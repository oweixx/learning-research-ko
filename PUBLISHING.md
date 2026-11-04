# GitHub 공개·업데이트 가이드

[처음으로](./README.md) · [번역 범위](./TRANSLATION.md) · [외부 자료 진행 현황](./docs/external/README.md)

한국어판 저장소: **[oweixx/learning-research-ko](https://github.com/oweixx/learning-research-ko)**

이 저장소는 Markdown 문서 모음입니다. GitHub에서 바로 읽을 수 있으며 별도의 앱 빌드나 서버 배포는 필요하지 않습니다.

**공개 범위:** 저장소 내부 문서 4개의 한국어 번역, 변경 이력, 외부 자료 목록과 짧은 읽기 안내를 제공합니다. 외부 Notion·PDF·영상의 전문 번역은 아직 완료하지 않았습니다. 저장소 소개와 README에는 실제 완료 범위를 유지합니다.

## 이 작업 폴더에서 업데이트하기

최초 번역을 진행한 로컬 폴더에서는 원저자 저장소를 `origin`, 한국어판 저장소를 `korean` 원격으로 구분합니다. 먼저 연결 주소와 현재 브랜치를 확인합니다.

```sh
git remote -v
git branch --show-current
```

한국어판의 원격 주소는 `https://github.com/oweixx/learning-research-ko.git`입니다. 변경한 문서를 검사하고 커밋한 뒤 한국어판으로 올립니다. Python 3.10 이상이 필요하며 추가 Python 패키지는 없습니다.

```sh
python scripts/check_docs.py
git diff --check
git status --short
git add README.md getting_started_in_research.md getting_advanced_in_research.md changelog TRANSLATION.md PUBLISHING.md .gitattributes .gitignore .github scripts translation docs
git diff --cached --stat
git commit -m "docs: 한국어 연구 가이드 업데이트"
git push korean HEAD
```

## 다른 컴퓨터에서 내려받아 수정하기

한국어판을 새로 복제하면 `origin`이 한국어판을 가리킵니다.

```sh
git clone https://github.com/oweixx/learning-research-ko.git
cd learning-research-ko
python scripts/check_docs.py
```

수정 후 변경한 파일을 선택해 커밋하고 `git push origin HEAD`로 올립니다. 원저자의 변경 이력을 따로 확인하려면 다음과 같이 `upstream` 원격을 추가할 수 있습니다.

```sh
git remote add upstream https://github.com/pengsida/learning_research.git
git fetch upstream
```

원문의 새 내용을 한국어판에 반영할 때는 번역 기준 커밋, 변경 이력과 외부 자료 목록도 함께 갱신합니다.

## 자동 검사 확인하기

[GitHub Actions](https://github.com/oweixx/learning-research-ko/actions)에서 **한국어 문서 검사**의 실행 결과를 확인할 수 있습니다. 푸시와 풀 리퀘스트에서 UTF-8 인코딩, 번역되지 않은 문자, 내부 링크, 원문 링크와 변경 이력 보존 여부를 검사합니다.

검사 설정은 [check-docs.yml](./.github/workflows/check-docs.yml)에 있습니다. GitHub Actions의 실행 방식은 [공식 안내](https://docs.github.com/en/actions/get-started/quickstart)를 참고하세요.

외부 자료까지 완역했는지 확인하려면 별도 검사를 실행합니다.

```sh
python scripts/check_docs.py --require-external
```

현재는 외부 전문 번역이 남아 있어 이 검사가 실패합니다. 기본 문서 검사 통과는 외부 완역 완료를 뜻하지 않습니다. GitHub의 **Run workflow**에서도 외부 완역 검사 옵션을 선택할 수 있습니다.

## 공개 후 유지할 정보

- 비공식 한국어 번역본이라는 표기와 원저자 출처를 유지합니다.
- 외부 자료의 전문 번역 여부를 실제 진행 상황에 맞게 표시합니다.
- 원문 저장소에 없던 라이선스를 임의로 추가하지 않습니다.
- 외부 자료 번역을 추가할 때는 원문·첨부 자료와 대조하고 검수 기록을 남깁니다.
