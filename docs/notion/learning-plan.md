# 학습 계획 예시

[한국어판 처음으로](../../README.md) · [외부 자료 진행 현황](../external/README.md)

출처: [Sida Peng의 원문](https://pengsida.notion.site/8911dcc5922b4442a80d4407926e65bf) · [원본 저장소](https://github.com/pengsida/learning_research)

원문 확인·번역일: 2026년 11월 4일. 본 페이지의 본문을 한국어로 옮겼습니다. 연결된 별도 문서의 번역 상태는 외부 자료 진행 현황에서 구분합니다.

첫 번째 목표는 **정적인 장면을 렌더링하는 분야의 논문과 알고리즘을 익히는 것**입니다. 그다음에는 **장면의 구성 요소를 분리하고 편집하는 분야**로 학습 범위를 넓힙니다.

## 학습 순서

### 1. NeRF 알고리즘 익히기

1. NeRF 논문을 읽습니다.
2. [NeRF 코드](https://github.com/yenchenlin/nerf-pytorch)를 살펴보며 알고리즘을 충분히 이해합니다.
3. [학습용 코드 구조](https://github.com/pengsida/learning_nerf)를 바탕으로 NeRF를 직접 구현합니다.
4. **새로운 데이터를 직접 촬영한 뒤, 자신이 작성한 코드로 NeRF를 실행합니다.**<!-- highlight -->

### 2. 선배의 프로젝트와 관련된 DFF를 공부하고 실험하기

1. [DFF 논문](https://pfnet-research.github.io/distilled-feature-fields/)을 읽습니다.
2. 선배와 이야기하며 DFF 실험을 진행합니다.
3. [DFF 코드](https://github.com/pfnet-research/distilled-feature-fields)를 살펴보며 알고리즘을 충분히 이해합니다.

### 3. 실험과 관련 논문 읽기를 병행하기

DFF 실험을 하면서 관련 논문을 읽습니다. **한꺼번에 전부 읽으려 하지 말고, 한 편씩 꼼꼼히 읽습니다.**<!-- highlight --> 서두를 필요는 없습니다.

## 첨부 도표: 마스크 없이 전경을 재구성하는 연구의 분류

> **번역자 주:** 원문의 중국어 도표를 읽고 아래 표로 옮겼습니다. 논문 제목은 검색할 수 있도록 영어 원제를 유지했습니다. 원문에서 비워 둔 칸은 ‘기재 없음’으로 표시했습니다.

도표의 최상위 과제는 **마스크를 제공하지 않은 상태에서 전경을 재구성하는 것**입니다.

### 도표 첫 번째 분기: 3차원 점군과 자기지도 특징 활용

3차원 점군(point cloud)과 자기지도 학습으로 얻은 2차원 이미지 특징을 활용해, 3차원 공간에서 전경과 배경을 분리합니다. 대표 연구는 원문에 기재되어 있지 않습니다.

### 사람이 일부 주석을 제공하는 경우

| 제공하는 정보 | 처리 방식 | 관련 연구 |
| --- | --- | --- |
| 사람이 정한 전경 범위 | 전경의 범위를 수동으로 지정합니다. | NeRF++: Analyzing and Improving Neural Radiance Fields; Neural Assets: Volumetric Object Capture and Rendering for Interactive Environments |
| 전경과 배경을 가리키는 클릭 | 클릭을 희소한 지도 신호로 활용합니다. 의미장(semantic field)을 학습시켜 3차원 분할 결과를 얻습니다. | SPIn-NeRF: Multiview Segmentation and Perceptual Inpainting with Neural Radiance Fields |
| 전경을 가리키는 패치 또는 낙서(scribble) | 구체적인 처리 과정은 원문에 기재되어 있지 않습니다. | DM-NeRF: 3D Scene Geometry Decomposition and Manipulation from 2D Images |
| 전경을 가리키는 패치 또는 낙서 | 신경장(neural field)의 특징을 이용해 3차원 공간에서 장면을 분해합니다. 3D GrabCut으로 전경과 배경을 분리하는 방식입니다. | Neural Volumetric Object Selection |
| 전경을 가리키는 패치 또는 낙서 | 사전 학습된 2차원 이미지 특징으로 신경장의 특징을 개선해 분할 성능을 높입니다. | Decomposing NeRF for Editing via Feature Field Distillation; Neural Feature Fusion Fields: 3D Distillation of Self-Supervised 2D Image Representations; Baking in the Feature: Accelerating Volumetric Segmentation by Rendering Feature Maps |

도표에서는 **Interactive Segmentation of Radiance Fields**가 **Decomposing NeRF for Editing via Feature Field Distillation**의 다음 분기로 연결되어 있습니다.

### 주석을 전혀 제공하지 않는 경우

| 처리 방식 | 관련 연구와 개선점 |
| --- | --- |
| 각 시점의 이미지에서 전경 마스크를 추정합니다. | NeuFa: Learning Neural Implicit Surfaces with Foreground-aware Volume Rendering. 일반적인 현저성 지도(saliency map)와 해당 목적에 맞춘 비지도 분할 결과를 결합해 전경 마스크의 품질을 높입니다. |
| 사전 학습된 2차원 이미지 특징으로 신경장의 특징을 개선해 분할 성능을 높입니다. | NeRF-SOS: Any-View Self-supervised Object Segmentation from Complex Real-World Scenes. 분할을 돕는 대조 손실(contrastive loss)을 제안합니다. |
