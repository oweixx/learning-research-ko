"""번역 목록에서 한국어 문서 안내 페이지를 생성합니다."""

from collections import Counter
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LABELS = {
    "translated": "본문·도표 대조 완료",
    "body_translated": "본문 번역 · 외부 인용·첨부 별도",
    "reading_guide_only": "한국어 소개·요약",
    "pending": "번역 대기",
    "blocked": "원문 접근 제한",
    "reference_only": "출처 링크",
}


def build() -> None:
    notion = json.loads((ROOT / "translation/notion-source-manifest.json").read_text(encoding="utf-8"))
    catalog = json.loads((ROOT / "translation/external-sources.json").read_text(encoding="utf-8"))
    pages = notion["direct_pages"] + notion["linked_pages"]
    counts = Counter(p["translation_status"] for p in pages)
    available = sum(bool(p.get("translation_path")) for p in pages)
    summary = " · ".join(f"{LABELS[state]} {count}개" for state, count in counts.items())
    lines = [
        "# Notion 연구 가이드 한국어판", "",
        "[처음으로](../../README.md) · [전체 자료 현황](../external/README.md)", "",
        f"직접 연결 문서 {len(notion['direct_pages'])}개와 추가 연결 문서 {len(notion['linked_pages'])}개를 확인했습니다. 현재 한국어 파일은 **{available}개**입니다.", "",
        summary + ".", "",
        "한국어 파일이 있다는 사실만으로 첨부 자료까지 완역한 것은 아닙니다. 각 문서의 실제 범위는 아래 상태와 검수 기록으로 구분합니다.", "",
        "| 문서 | 상태 | 원문 |", "| --- | --- | --- |",
    ]
    for p in pages:
        title = p["title"].replace("|", "·")
        path = p.get("translation_path")
        item = f"[{title}](./{Path(path).name})" if path else title
        source = p.get("source_url", p.get("url"))
        lines.append(f"| {item} | {LABELS[p['translation_status']]} | [원문]({source}) |")
    lines += [
        "", "## 출처와 범위", "",
        "Sida Peng의 [Learning Research](https://github.com/pengsida/learning_research)를 바탕으로 한 비공식 한국어판입니다. 저자의 경험과 의견을 보존하고, 보완 설명은 번역자 주로 구분합니다.", "",
        "강의 영상은 한국어 제목·설명과 원문 링크로 안내하며 영상 전체의 자막 제작·더빙은 포함하지 않습니다. 실험 시연 영상은 실험 자료로 따로 추적합니다. 외부 저자의 책이나 재수록 글은 이용 조건에 맞는 소개·요약과 전문 번역을 구분합니다.", "",
        "[원문 확인 및 검수 기록](../../translation/notion-source-manifest.json)에는 본문 해시, 첨부 자료, 접근 제한과 번역 상태가 있습니다. 비공개 자료와 조회되지 않는 데이터베이스 항목은 완료 수에 포함하지 않습니다.", "",
    ]
    (ROOT / "docs/notion/README.md").write_text("\n".join(lines), encoding="utf-8", newline="\n")
    lines = [
        "# 외부 자료 번역 진행 현황", "",
        "[처음으로](../../README.md) · [한국어판 안내](../../TRANSLATION.md) · [읽기 길잡이](./reading-guide.md)", "",
        f"Notion 자료 {len(pages)}개 중 한국어 파일 {available}개를 제공합니다. {summary}.", "",
        "원본 저장소의 외부 URL 68개를 자료·출처 63개로 묶어 보존했습니다. 학습 자료 47개와 저자·기여자 등 출처 16개입니다. 아래 목록 외에 Notion 하위 문서와 첨부 자료도 따로 추적합니다.", "",
        "기본 문서 검사 통과는 외부 전체 완역을 뜻하지 않습니다. 원문 접근 실패는 이번 연결과 환경에서 확인한 결과이며, 영구 삭제 여부를 판단한 것이 아닙니다.", "",
        "## 원본 저장소에서 연결한 자료", "",
        "| 자료 | 종류 | 한국어 상태 |", "| --- | --- | --- |",
    ]
    for item in catalog["sources"]:
        links = " · ".join(f"[{'원문' if i == 0 else '다른 주소 ' + str(i)}]({u})" for i, u in enumerate(item["urls"]))
        path = item.get("translation_path") or item.get("reading_guide_path")
        status = LABELS[item["translation_status"]]
        if path:
            status = f"[{status}](../../{path})"
        category = {"attribution": "출처", "notion": "Notion", "pdf": "PDF", "course": "강의", "video": "영상", "book": "교재", "assignments": "과제", "image": "이미지", "article": "글"}.get(item["category"], item["category"])
        lines.append(f"| {item['title'].replace('|', '·')} · {links} | {category} | {status} |")
    lines += [
        "", "## 추가 Notion 문서와 첨부 자료", "",
        "[Notion 한국어 문서 목록](../notion/README.md)에서 하위 문서까지 확인할 수 있습니다. 본문만 번역한 자료, 도표까지 대조한 자료, 짧은 요약과 접근 제한을 구분했습니다.", "",
        "[Notion 원문 확인 기록](../../translation/notion-source-manifest.json)의 각 문서에는 첨부 이미지·파일·시연 영상의 원문 참조와 개별 검수 상태를 기록합니다. 만료되는 다운로드 주소는 공개 저장소에 넣지 않습니다.", "",
        "외부 책·강의·재수록 글은 원본 저장소에 링크되어 있다는 이유만으로 전문 번역·재배포가 허용되는 것은 아닙니다. 이용 조건을 확인할 수 없는 자료는 짧은 한국어 길잡이와 출처를 제공합니다. 전문이 없는 경우 완료로 표시하지 않습니다.", "",
    ]
    (ROOT / "docs/external/README.md").write_text("\n".join(lines), encoding="utf-8", newline="\n")


if __name__ == "__main__":
    build()
