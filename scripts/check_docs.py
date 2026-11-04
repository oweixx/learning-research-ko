"""한국어 문서의 인코딩, 링크, 원문 보존 여부와 외부 번역 상태를 검사합니다."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
URL = re.compile(r"https?://[^\s<>\[\]()\u3000-\u303f\uff00-\uffef]+")
LINK = re.compile(r"\[[^\]\n]+\]\(([^\s)]+)\)")
CJK = re.compile(
    r"[\u2e80-\u2fdf\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff"
    r"\U00020000-\U0002fa1f\U00030000-\U000323af]"
)
EXCLUDED = {".git", ".venv", ".codex", ".agents", ".aws", "__pycache__"}
REQUIRED = {
    "README.md", "getting_started_in_research.md", "getting_advanced_in_research.md",
    "changelog", "TRANSLATION.md", "PUBLISHING.md", "docs/external/README.md",
    "docs/external/reading-guide.md", "translation/source-manifest.json",
    "translation/external-sources.json", ".github/workflows/check-docs.yml",
    "translation/notion-source-manifest.json", "docs/notion/README.md",
}


def local_target(root: Path, parent: Path, destination: str) -> tuple[Path | None, str | None]:
    """경로 이탈과 운영체제에 따라 달라지는 파일명 대소문자를 확인합니다."""
    parts = urlsplit(destination)
    if parts.scheme or parts.netloc:
        return None, None
    # Windows의 resolve()는 실제 파일명의 대소문자로 보정하므로 원래 표기를 먼저 검사합니다.
    path = Path(os.path.normpath(parent / unquote(parts.path)))
    resolved = path.resolve()
    if not path.is_relative_to(root) or not resolved.is_relative_to(root):
        return None, "저장소 바깥을 가리키는 링크"
    if not path.exists():
        return None, "존재하지 않는 파일"
    current = root
    for part in path.relative_to(root).parts:
        if part not in {p.name for p in current.iterdir()}:
            return None, "파일명 대소문자 불일치"
        current /= part
    return resolved, None


def heading_ids(text: str) -> set[str]:
    result: set[str] = set()
    counts: dict[str, int] = {}
    for heading in re.findall(r"^#{1,6}\s+(.+?)\s*#*\s*$", text, re.MULTILINE):
        base = re.sub(r"[^\w\- ]", "", heading.lower()).replace(" ", "-")
        number = counts.get(base, 0)
        result.add(f"{base}-{number}" if number else base)
        counts[base] = number + 1
    return result


def audit(root: Path, require_external: bool = False) -> tuple[list[str], dict[str, int]]:
    root = root.resolve()
    errors: list[str] = []
    texts: dict[str, str] = {}
    for required in sorted(REQUIRED):
        if not (root / required).is_file():
            errors.append(f"필수 파일 없음: {required}")

    # 이 저장소의 문서, 검증 코드, 설정과 메타데이터만 검사합니다.
    for path in sorted(root.rglob("*")):
        relative = path.relative_to(root)
        if any(part in EXCLUDED for part in relative.parts) or not path.is_file():
            continue
        if path.suffix not in {".md", ".json", ".py", ".yml", ".yaml"} and path.name != "changelog":
            continue
        name = relative.as_posix()
        try:
            text = path.read_bytes().decode("utf-8")
        except UnicodeDecodeError:
            errors.append(f"{name}: UTF-8 인코딩이 아닙니다.")
            continue
        texts[name] = text
        if text.startswith("\ufeff") or "\ufffd" in text:
            errors.append(f"{name}: BOM 또는 깨진 문자가 있습니다.")
        if re.search(r"\?{3,}", text):
            errors.append(f"{name}: 인코딩 손실로 의심되는 연속 물음표가 있습니다.")
        if not text.strip():
            errors.append(f"{name}: 파일이 비어 있습니다.")
        match = CJK.search(text)
        if match:
            line = text[:match.start()].count("\n") + 1
            errors.append(f"{name}:{line}: 번역되지 않은 한자·중국어 문자가 있습니다.")

    for name, text in texts.items():
        if not (name.endswith(".md") or name == "changelog"):
            continue
        for destination in LINK.findall(text):
            parts = urlsplit(destination)
            if parts.scheme or parts.netloc:
                continue
            destination_path = destination if parts.path else name.split("/")[-1] + destination
            target, error = local_target(root, (root / name).parent, destination_path)
            if error:
                errors.append(f"{name}: {error}: {destination}")
            elif parts.fragment and target and target.is_file():
                target_text = texts.get(target.relative_to(root).as_posix(), "")
                if unquote(parts.fragment) not in heading_ids(target_text):
                    errors.append(f"{name}: 없는 제목 링크: {destination}")

    try:
        manifest = json.loads(texts.get("translation/source-manifest.json", ""))
        catalog = json.loads(texts.get("translation/external-sources.json", ""))
        source_files = manifest["files"]
        sources = catalog["sources"]
    except (ValueError, KeyError, TypeError) as error:
        errors.append(f"번역 기준 기록을 읽을 수 없습니다: {error}")
        return errors, {}

    original_urls: set[str] = set()
    for name, source in source_files.items():
        original_urls.update(source["external_urls"])
        current_urls = set(URL.findall(texts.get(name, "")))
        for missing in sorted(set(source["external_urls"]) - current_urls):
            errors.append(f"{name}: 원문 링크 누락: {missing}")

    entries = re.findall(r"^- (.+)$", texts.get("changelog", ""), re.MULTILINE)
    expected = source_files["changelog"]
    if len(entries) != expected["entry_count"]:
        errors.append(f"changelog: 원문은 {expected['entry_count']}개 항목, 현재는 {len(entries)}개입니다.")
    dates = [
        f"{year}-{int(month):02d}-{int(day):02d}"
        for year, month, day in re.findall(
            r"^- (\d{4})년 (\d{1,2})월 (\d{1,2})일:", texts.get("changelog", ""), re.MULTILINE
        )
    ]
    if dates != expected["entry_dates"]:
        errors.append("changelog: 변경 날짜 또는 항목 순서가 원문과 다릅니다.")

    if catalog["source_commit"] != manifest["commit"]:
        errors.append("외부 자료 목록의 기준 커밋이 원문 기준 기록과 다릅니다.")
    catalog_urls = {url for source in sources for url in source["urls"]}
    for missing in sorted(original_urls - catalog_urls):
        errors.append(f"외부 자료 목록에 없는 원문 링크: {missing}")
    ids = [source["id"] for source in sources]
    if len(set(ids)) != len(ids):
        errors.append("외부 자료 목록에 중복 ID가 있습니다.")

    incomplete = []
    for source in sources:
        status = source["translation_status"]
        if status not in {"pending", "reading_guide_only", "reference_only", "translated", "body_translated", "blocked"}:
            errors.append(f"알 수 없는 번역 상태: {source['title']}")
        if status == "reference_only" and source["category"] != "attribution":
            errors.append(f"학습 자료를 출처 링크로만 표시했습니다: {source['title']}")
        if source["category"] != "attribution" and status != "translated":
            incomplete.append(source)
        if status == "translated" and not source.get("translation_path"):
            errors.append(f"번역 완료로 표시했지만 번역 파일이 없습니다: {source['title']}")
        for field in ("translation_path", "reading_guide_path"):
            if source.get(field):
                target, error = local_target(root, root, source[field])
                if error or not target or not target.is_file():
                    errors.append(f"{source['title']}: {field} 경로 오류: {source[field]}")
        if status == "translated" and not source.get("review_notes"):
            errors.append(f"{source['title']}: 원문 대조 검수 기록이 없습니다.")

    pending_nested = []
    try:
        notion = json.loads(texts.get("translation/notion-source-manifest.json", ""))
        direct = notion["direct_pages"]
        linked = notion["linked_pages"]
        direct_ids = {s["id"].removeprefix("notion-") for s in sources if s["category"] == "notion"}
        manifest_ids = [s["id"] for s in direct]
        linked_ids = [s["id"] for s in linked]
        if set(manifest_ids) != direct_ids or len(set(manifest_ids)) != len(manifest_ids):
            errors.append("Notion 원문 기록의 직접 연결 문서 목록이 외부 자료 목록과 다릅니다.")
        if len(set(linked_ids)) != len(linked_ids) or set(linked_ids) & direct_ids:
            errors.append("Notion 추가 연결 문서에 중복 항목이 있습니다.")
        for page in direct:
            entry = next((s for s in sources if s["id"] == "notion-" + page["id"]), None)
            if entry and any(entry.get(k) != page.get(k) for k in ("translation_status", "translation_path")):
                errors.append(f"Notion 번역 상태 기록 불일치: {page['title']}")
            if not re.fullmatch(r"[0-9a-f]{64}", page.get("content_sha256", "")):
                errors.append(f"Notion 원문 본문 해시 오류: {page['title']}")
        for page in direct + linked:
            if page["translation_status"] not in {"pending", "translated", "body_translated", "reading_guide_only", "blocked"}:
                errors.append(f"Notion 번역 상태 오류: {page['title']}")
            if page["translation_status"] in {"translated", "body_translated", "reading_guide_only"}:
                path = page.get("translation_path")
                if not path or not page.get("review_notes"):
                    errors.append(f"Notion 번역 파일 또는 검수 기록 없음: {page['title']}")
                else:
                    target, error = local_target(root, root, path)
                    if error or not target or not target.is_file():
                        errors.append(f"Notion 번역 파일 경로 오류: {page['title']}")
        pending_nested = [p for p in linked if p["translation_status"] != "translated"]
    except (ValueError, KeyError, TypeError) as error:
        errors.append(f"Notion 원문 확인 기록을 읽을 수 없습니다: {error}")

    if require_external and incomplete:
        errors.append(f"외부 학습 자료 {len(incomplete)}개의 전문 번역이 미완료입니다. docs/external/README.md를 확인하세요.")
    if require_external and pending_nested:
        errors.append(f"추가 연결 Notion 문서 {len(pending_nested)}개의 전문 번역이 미완료입니다.")
    return errors, {
        "files": len(texts), "source_files": len(source_files), "urls": len(original_urls),
        "entries": len(entries), "pending_external": len(incomplete),
        "pending_nested_notion": len(pending_nested),
    }


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--require-external", action="store_true", help="외부 전문 번역이 남아 있으면 실패")
    args = parser.parse_args()
    errors, stats = audit(ROOT, args.require_external)
    if errors:
        for error in errors:
            print(f"오류: {error}")
        return 1
    print(f"통과: {stats['files']}개 파일의 인코딩·문자·내부 링크를 검사했습니다.")
    print(f"원문 {stats['source_files']}개 파일의 외부 URL {stats['urls']}개와 변경 이력 {stats['entries']}개를 보존했습니다.")
    if stats["pending_external"]:
        print(f"별도 진행 상태: 외부 학습 자료 {stats['pending_external']}개의 전문 번역이 남아 있습니다.")
    if stats["pending_nested_notion"]:
        print(f"추가 연결 Notion 문서 {stats['pending_nested_notion']}개의 번역이 남아 있습니다.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
