# 관련 논문을 찾는 방법

<!-- editorial:summary -->
**세 줄로 먼저 읽기 · 한국어판 요약**

- 현재 논문의 과제·기술 구조·해결할 문제를 파악한 뒤 검색어를 정합니다.
- 참고문헌과 후속 인용을 따라가며 관련 연구의 범위를 넓힙니다.
- 검색 도구나 AI가 추천한 논문은 제목·저자·원문을 직접 대조합니다.
<!-- /editorial:summary -->

[연구 가이드 목록](./README.md) · [한국어판 처음으로](../../README.md)

원문: [공개 Notion](https://pengsida.notion.site/c278dab7e4764d61a92c1fd1ef3135b1) · [Sida Peng의 Learning Research](https://github.com/pengsida/learning_research)

원문 확인일: 2026년 11월 4일. 별도 표시가 없는 조언은 원저자의 견해입니다.

## 심층 조사 도구 활용하기

원문의 최신 설명은 Deep Research 같은 심층 조사 도구에 관련 논문을 찾아 달라고 요청하는 방법입니다. 첨부된 Gemini 예시에서는 다음과 같이 질문합니다.

> 「Structured 3D Latents for Scalable and Versatile 3D Generation」과 같은 과제를 다루는 논문에는 무엇이 있나요?

화면에 보이는 조사 계획은 **해당 논문의 과제, 핵심 기술 구조, 해결하려는 문제를 먼저 파악**<!-- highlight -->하고, 인용 관계를 통해 후속 연구를 찾은 뒤 확장성과 범용성을 다루는 3D 생성 연구를 탐색하는 순서입니다. 원본 스크린샷에서 접혀 있는 계획의 나머지 부분은 확인되지 않습니다.

## 이전 방식 — 원문에서 ‘2026년 1월 이전의 방법’으로 구분

원문은 [Wispaper 검색](https://www.wispaper.ai/scholar-search/)과 다음 접근도 남겨 두었습니다.

1. Kimi에 적절한 검색어를 물어본 뒤 Google과 arXiv에서 검색합니다.
2. Kimi에 관련 논문을 추천해 달라고 요청합니다.
3. 평소 관련 분야 연구자를 알아 두고 그들의 연구를 확인합니다.
4. 관련 논문을 꾸준히 모읍니다.
5. **찾은 논문의 참고문헌과 그 논문을 인용한 후속 연구를 따라갑니다.**<!-- highlight -->

## 검색어를 만드는 예시

원문의 질문은 ‘텍스트를 입력받아 장면 속 물체를 조작하는 사람의 움직임을 생성하는 연구를 찾으려면 어떤 검색어를 쓰면 좋을까?’입니다.

| 원문에 제시된 검색어 | 뜻 |
| --- | --- |
| Text-Driven Human Motion Generation | 텍스트 기반 사람 동작 생성 |
| Human Motion Synthesis from Description | 설명문으로부터 사람 동작 합성 |
| Natural Language to Human Motion | 자연어를 사람 동작으로 변환 |
| Human Pose Estimation from Text | 텍스트로부터 사람 자세 추정 |
| Scene-Aware Human Motion Generation | 장면을 고려한 사람 동작 생성 |

이어지는 스크린샷에서는 Google에 `text-driven scene-aware motion synthesis`, arXiv에 `cs.CV text scene human motion`을 입력합니다. Google 화면에는 텍스트 기반 동작 생성기의 상호작용, 장면을 고려한 사람 동작 생성 네트워크, 다양하고 자연스러운 장면 기반 3D 동작 연구가 표시됩니다. arXiv 화면에는 사회적 움직임 예측 기반 로봇 상호작용, 접촉을 고려한 3D 사람·물체 상호작용 생성인 CG-HOI, 다중 조건 확산 모델을 이용한 언어 기반 장면 합성이 나옵니다.

이 화면들은 검색 과정을 보여 주는 당시의 예시입니다. 현재 검색 순위나 논문의 완전한 관련성을 보증하는 목록은 아닙니다. **추천된 논문은 제목·저자·원문을 직접 확인하세요.**<!-- highlight -->

<!-- editorial:connections -->
## 읽기의 연결 · 한국어판 안내

- **먼저 읽으면:** [연구에서 검색 능력이 중요한 이유](./search-skills.md) — 검색이 연구의 새로움을 판단하는 데 필요한 이유를 봅니다.
- **이어서 적용하면:** [읽고 나서 남는 논문 읽기](./reading-papers.md) — 찾은 논문을 문제·방법·근거·한계로 나누어 읽습니다.
<!-- /editorial:connections -->
