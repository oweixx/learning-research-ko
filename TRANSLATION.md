# 한국어판 안내

[처음으로](./README.md) · [외부 자료 진행 현황](./docs/external/README.md)

## 번역 기준

- 원저자: [Sida Peng](https://pengsida.net/)
- 원본 저장소: [pengsida/learning_research](https://github.com/pengsida/learning_research)
- 기준 커밋: [1ee561e5019fcc7d102b9a647591372871e40204](https://github.com/pengsida/learning_research/commit/1ee561e5019fcc7d102b9a647591372871e40204)
- 기준 커밋 작성일: 2026년 10월 14일
- 한국어판 작업일: 2026년 11월 4일
- 원문 README에 별도로 기재된 자료 업데이트 날짜: 2026년 6월 6일

이 한국어판은 공식 번역본이 아닙니다. 원저자의 추천, 판단, 연구실 경험은 원저자의 관점으로 유지했습니다. 문장의 순서와 문단 구성을 다듬고, 읽기 순서와 문서 간 이동 링크를 추가했습니다. 강의 자료의 출처에 관한 보충 설명은 ‘번역자 주’로 구분했습니다.

## 완료 범위

| 원본 파일 | 한국어 문서 | 상태 |
| --- | --- | --- |
| README.md | [연구를 배우는 법](./README.md) | 본문·링크 제목·주석·감사의 말 번역 |
| getting_started_in_research.md | [연구 입문](./getting_started_in_research.md) | 3개 학습 단계 전체 번역 |
| getting_advanced_in_research.md | [연구 역량을 키우는 법](./getting_advanced_in_research.md) | 본문과 추천 자료 목록 전체 번역 |
| changelog | [원문 변경 이력](./changelog) | 62개 항목 전체 번역 |

외부 Notion, PDF, 이미지, 영상, 교재의 **전문 번역은 미완료**입니다. 원문에 직접 연결된 Notion 18개 문서는 현재 환경에서 본문을 확보하지 못했습니다. 일부 PDF는 텍스트를 확인했으나, 이를 전문 번역이나 전체 도표 검수 완료로 간주하지 않습니다.

[외부 자료 읽기 길잡이](./docs/external/reading-guide.md)는 확인한 내용에 대한 짧은 한국어 안내입니다. 원문의 모든 문장과 예시를 옮긴 문서가 아닙니다. 외부 자료까지 포함한 완역본으로 소개하려면 [진행 현황](./docs/external/README.md)의 남은 항목을 마쳐야 합니다.

## 표현과 용어 기준

원문의 의미를 유지하면서 한국어 연구실에서 자연스럽게 쓰는 표현을 우선했습니다. 설명에 필요한 전문 용어는 첫 등장 시 원어를 함께 적었습니다. 인명은 검색과 식별이 쉽도록 로마자 표기를 사용했습니다.

| 원어 또는 원문의 표현 | 한국어 표현 |
| --- | --- |
| research project | 연구 프로젝트 |
| Top Ph.D. Student | 뛰어난 박사과정 연구자 |
| idea | 문맥에 따라 아이디어, 해결책, 연구 구상 |
| meet | 연구 미팅, 지도교수와의 미팅 |
| work / not work | 제대로 작동하다 / 기대대로 되지 않다 |
| presentation | 발표, 연구 성과 전달 |
| slides / PPT | 발표 슬라이드 |
| first author | 제1저자 |
| rebuttal | 심사 의견에 대한 답변, 리버털 |
| roadmap | 연구 로드맵 |
| goal-driven research | 목표 중심 연구 |
| method-driven research | 방법 중심 연구 |
| novelty | 독창성 |
| literature review | 문헌 조사 |
| pipeline | 파이프라인, 방법의 전체 처리 과정 |
| challenge-insight tree | 기술적 난제·해결 통찰 트리 |

‘new Bing’처럼 작성 당시의 서비스 명칭은 원문 표현임을 밝혔습니다. 원문의 과제 링크가 개인 학습용 저장소라는 점은 해당 저장소의 안내를 확인해 번역자 주에 덧붙였습니다. 외부 링크의 대상이나 논문·강의 자체를 임의로 바꾸지 않았습니다.

## 출처와 이력 보존

기존 파일명과 Git 이력을 유지했습니다. 원본 커밋의 파일별 SHA-256, 외부 URL, 변경 이력 날짜는 [원문 기준 기록](./translation/source-manifest.json)에 보관합니다. 원문 주소는 번역된 각 파일에 유지해 출처를 추적할 수 있게 했습니다.

번역 기준 커밋에는 별도 `LICENSE` 파일이 없으며, 원문은 내용을 옮길 때 출처를 밝히도록 요청합니다. 이 저장소에 임의의 MIT·CC 등의 라이선스를 붙이지 않았습니다. 외부 저자의 자료는 각 자료의 이용 조건을 따로 확인해야 합니다.

## 검증 방법

Python 3.10 이상에서 별도 패키지 설치 없이 실행합니다.

```sh
python scripts/check_docs.py
git diff --check
```

검사 항목은 UTF-8 인코딩, 남아 있는 한자·중국어 문자, 저장소 내부 링크, 원문 외부 URL 보존, 변경 이력의 개수와 날짜 순서, 외부 자료 목록의 누락 여부입니다. 자동 검사는 한국어 문장의 자연스러움이나 번역 의미의 정확성을 보증하지 않으므로 원문 대조가 함께 필요합니다. 외부 사이트의 실시간 접속 상태는 자동 검사하지 않습니다.

외부 자료까지 완역했는지 점검하려면 다음 명령을 사용합니다.

```sh
python scripts/check_docs.py --require-external
```

현재는 외부 전문 번역이 남아 있으므로 이 명령이 실패하는 것이 정상입니다. GitHub의 기본 문서 검사 통과와 외부 완역 완료를 혼동하지 않도록 분리했습니다.

## 번역을 이어서 추가할 때

1. 원문 파일과 하위 페이지·첨부 자료를 확보하고 실제 번역 범위를 목록에 반영합니다.
2. 출처, 원문 확인일, 제목을 명시한 한국어 Markdown 파일을 추가합니다.
3. 본문뿐 아니라 표, 각주, 그림 속 설명과 문서 간 링크도 대조합니다.
4. [외부 자료 목록](./translation/external-sources.json)의 `translation_status`를 `translated`로 바꾸고 `translation_path`에 실제 파일 경로를 기록합니다. 원문 확인일과 검수 메모도 남깁니다.
5. 완성된 자료의 한국어 링크를 본문에 추가하고 원문 링크를 함께 유지합니다.
6. 두 가지 문서 검사와 원문 대조를 마친 뒤 공개 안내의 완료 범위를 갱신합니다.
