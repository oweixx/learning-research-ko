"""GitHub 문서로 Notion 게시 계획을 만들고 게시 기록을 검사합니다.

이 스크립트는 네트워크에 쓰지 않습니다. 실제 게시에는 연결된 Notion 도구를 사용합니다.
페이지 ID를 담은 매핑과 게시 payload는 .git 안에 보관하세요.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import posixpath
import re
import sys
from urllib.parse import quote, unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
REPO = "https://github.com/oweixx/learning-research-ko/blob/master/"
RECEIPTS = ROOT / "translation/notion-publication.json"
LINK = re.compile(r"(?<!!)\[([^\]\n]+)\]\(([^\s)]+)\)")


def digest(content: str) -> str:
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def render(path: str, content: str, mapping: dict) -> tuple[str, str]:
    lines = content.splitlines()
    title = lines[0].removeprefix("# ") if lines and lines[0].startswith("# ") else {"changelog": "원문 변경 이력"}.get(path, path)
    body = "\n".join(lines[1:] if lines and lines[0].startswith("# ") else lines).strip()
    body = re.sub(r"<!--[\s\S]*?-->", "", body)

    def replace(match: re.Match) -> str:
        label, destination = match.groups()
        parts = urlsplit(destination)
        if parts.scheme or parts.netloc:
            return match.group(0)
        target = posixpath.normpath(posixpath.join(posixpath.dirname(path), unquote(parts.path))) if parts.path else path
        if target == ".." or target.startswith("../"):
            raise ValueError(f"저장소 밖 링크: {path}: {destination}")
        if target in mapping and not parts.fragment:
            page_id = mapping[target]["id"].replace("-", "")
            return f'<mention url="https://app.notion.com/p/{page_id}" />'
        url = REPO + quote(target, safe="/")
        if parts.fragment:
            url += "#" + quote(unquote(parts.fragment), safe="-")
        return f"[{label}]({url})"

    # 코드 예시 안의 Markdown 문법은 변환하지 않습니다.
    fence = chr(96) * 3
    chunks = re.split(r"(^" + fence + r"[^\n]*\n[\s\S]*?^" + fence + r"\s*$)", body, flags=re.MULTILINE)
    body = "".join(chunk if chunk.startswith(fence) else LINK.sub(replace, chunk) for chunk in chunks)
    return title, body.rstrip() + f"\n\n---\n[GitHub 문서와 변경 이력 보기]({REPO + quote(path, safe='/')})\n"


def document_paths() -> list[str]:
    paths = ["README.md", "getting_started_in_research.md", "getting_advanced_in_research.md", "changelog", "TRANSLATION.md", "PUBLISHING.md", "docs/notion/README.md", "docs/external/README.md", "docs/external/reading-guide.md"]
    manifest = json.loads((ROOT / "translation/notion-source-manifest.json").read_text(encoding="utf-8"))
    paths += [p["translation_path"] for p in manifest["direct_pages"] + manifest["linked_pages"] if p.get("translation_path")]
    catalog = json.loads((ROOT / "translation/external-sources.json").read_text(encoding="utf-8"))
    paths += [p[key] for p in catalog["sources"] for key in ("translation_path", "reading_guide_path") if p.get(key)]
    return sorted(set(paths))


def check_receipts() -> list[str]:
    if not RECEIPTS.exists():
        return ["Notion 게시 기록이 없습니다."]
    records = json.loads(RECEIPTS.read_text(encoding="utf-8"))["documents"]
    by_path = {r["path"]: r for r in records}
    errors = []
    if len(by_path) != len(records):
        errors.append("게시 기록에 중복 경로가 있습니다.")
    for path in document_paths():
        source = (ROOT / path).read_text(encoding="utf-8")
        if path not in by_path or by_path[path].get("sha256") != digest(source):
            errors.append(f"Notion에 최신 내용을 반영해야 합니다: {path}")
        elif not by_path[path].get("published_on"):
            errors.append(f"게시 날짜가 없습니다: {path}")
    return errors


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--map", type=Path, help="로컬 경로와 Notion 페이지 ID 매핑")
    parser.add_argument("--output", type=Path, help="게시 계획 JSON 저장 위치")
    parser.add_argument("--path", action="append", help="특정 문서만 계획")
    parser.add_argument("--check", action="store_true", help="게시 기록과 현재 문서의 해시 대조")
    args = parser.parse_args()
    if args.check:
        errors = check_receipts()
        for error in errors:
            print(error)
        if not errors:
            print("통과: 모든 게시 대상의 현재 내용과 Notion 게시 기록이 일치합니다.")
        return bool(errors)
    if not args.map or not args.output:
        parser.error("계획을 만들려면 --map과 --output이 필요합니다.")
    mapping = json.loads(args.map.read_text(encoding="utf-8"))
    plan = []
    for path in args.path or document_paths():
        source_path = (ROOT / path).resolve()
        if not source_path.is_relative_to(ROOT) or not source_path.is_file():
            raise ValueError(f"잘못된 문서 경로: {path}")
        source = source_path.read_text(encoding="utf-8")
        title, content = render(path, source, mapping)
        plan.append({"path": path, "page_id": mapping.get(path, {}).get("id"), "title": title, "source_sha256": digest(source), "content": content})
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(f"게시 계획 {len(plan)}개를 만들었습니다. 실제 Notion 쓰기는 수행하지 않았습니다.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
