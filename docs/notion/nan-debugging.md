# 코드에서 NaN이 발생하는 대표적인 원인

[연구 가이드 목록](./README.md) · [한국어판 처음으로](../../README.md)

출처: [공개 Notion 원문](https://pengsida.notion.site/8beb455efdd54cf8bc6de579bca3c211) · [Sida Peng의 Learning Research](https://github.com/pengsida/learning_research)

원문 확인·번역일: 2026년 11월 4일. 별도 표시가 없는 의견과 경험은 원저자의 관점입니다.

## 원인 후보

1. 정답 데이터(ground truth)에 문제가 있어 0으로 나누는 계산이 발생합니다.
2. 모델의 연산에 문제가 있습니다. 로그나 softmax처럼 수치에 민감한 연산을 살펴봅니다.
3. 학습이 발산해 값이 무한대로 커졌습니다.

## 발생 지점 찾기

중단점을 걸고, **범위를 반복해서 반으로 나누어 확인하면서 문제가 시작되는 지점에 가까워집니다.**<!-- highlight -->

```python
# NaN이 나타나는 지점에서 멈추고 값을 확인합니다.
if torch.isnan(number):
    __import__('ipdb').set_trace()
```

> **번역자 주:** 위 코드는 원문의 예시를 유지한 것입니다. `number`가 여러 원소를 가진 텐서라면 조건을 `torch.isnan(number).any()`로 바꾸어, NaN이 하나라도 있는지를 확인할 수 있습니다.
