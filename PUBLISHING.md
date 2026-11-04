# GitHub 공개·업데이트 가이드

[처음으로](./README.md) · [번역 범위](./TRANSLATION.md) · [외부 자료 진행 현황](./docs/external/README.md)

한국어판 저장소: **[oweixx/learning-research-ko](https://github.com/oweixx/learning-research-ko)**

이 저장소의 Markdown 문서는 GitHub와 [한국어 학습 사이트](https://oweixx.github.io/learning-research-ko/)에서 읽을 수 있습니다. 학습 사이트는 VitePress로 생성하고 GitHub Pages로 배포합니다. `master`에 푸시하면 사이트 검사 후 자동 배포됩니다.

**공개 범위:** 저장소 내부 문서 4개, Notion 한국어 문서와 도표, 외부 자료의 한국어 길잡이를 제공합니다. 문서별 실제 범위는 [Notion 목록](./docs/notion/README.md)과 [전체 현황](./docs/external/README.md)을 기준으로 합니다.

## 학습 사이트 개발과 배포

Node.js 22 이상을 사용합니다. 배포 환경은 Node.js 24입니다.

```sh
npm ci
npm run site:dev
```

원본 Markdown은 저장소 루트와 `docs`에서 수정합니다. `scripts/prepare-site.mjs`가 문서 78개를 읽어 웹사이트용 경로와 검색 목록을 생성합니다. 생성된 `site/.generated`는 직접 수정하거나 커밋하지 않습니다. 개발 서버 실행 중 원문을 수정했다면 `npm run site:prepare`로 다시 반영합니다.

검사와 미리보기:

```sh
npm run site:build
npm run test:site
npx playwright install chromium
npm run test:browser
python scripts/check_site.py
npm run site:preview
```

화면과 상호작용은 `site/.vitepress/theme`, 학습 경로·주제 분류·연구 양식은 `site/data/learning.mjs`에 있습니다. 문서를 새로 추가하면 해당 주제의 문서 ID 목록에도 추가합니다. VitePress 1의 기본 Vite 의존성 대신 보안 수정이 반영된 Vite 6.4.5를 고정하며, 빌드와 브라우저 테스트로 호환성을 확인합니다.

[deploy-pages.yml](./.github/workflows/deploy-pages.yml)은 문서 사이트를 빌드하고 검색·기록·백업 테스트와 데스크톱·모바일 브라우저 검사를 통과한 산출물을 배포합니다. 풀 리퀘스트는 검사만 실행합니다. 저장소의 Settings → Pages → Source는 **GitHub Actions**로 설정합니다.

### 개인 기록과 개인정보

- 읽음·북마크·문서 메모·연구 노트·글자 크기는 해당 사이트의 브라우저 저장 공간에 저장합니다.
- 개인 기록을 GitHub, Notion 또는 별도 서버로 보내지 않습니다. 로그인과 기기 간 자동 동기화는 없습니다.
- 내 서재에서 전체 기록을 JSON으로 백업·복원할 수 있습니다. 같은 기록은 수정 시각이 최근인 내용을 유지합니다.
- 연구 노트와 문서 메모는 Markdown으로 내려받아 Notion 등에서 활용할 수 있습니다.
- 브라우저 데이터를 삭제하거나 기기를 변경하기 전에 백업하세요. 저장에 실패하면 화면에 안내합니다.

## 이 작업 폴더에서 문서 업데이트하기

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

## GitHub와 Notion 연결

### 한국어판 편집 원고 수정

요약은 `site/data/editorial.mjs`, 도식·가상 예시는 `site/data/editorial-examples.mjs`, 읽기 연결은 `site/data/reading-connections.mjs`, 용어 풀이는 `site/data/glossary.mjs`에서 관리합니다. 연구 원칙 모음집은 [handbook.md](./docs/guides/handbook.md)를 직접 편집합니다.

```sh
npm run editorial:prepare
npm run site:build
npm run test:site
npm run test:browser
python scripts/check_docs.py
python scripts/check_site.py
```

첫 명령은 편집 원고에서 각 Markdown의 표시된 편집 구역만 갱신합니다. 기존 본문과 강조 구절은 유지합니다. 생성된 구역을 직접 바꾸기보다 원고를 수정하고 재생성하세요. 빌드는 원고와 Markdown이 어긋나면 실패하며, 문서·제목 연결도 별도로 검사합니다. 새 문서를 추가할 때는 사이트 분류와 Notion 게시 대상·페이지 매핑을 함께 갱신합니다.

### Notion 게시 절차

GitHub의 Markdown 파일을 기준 문서로 삼고 연결된 Notion 도구로 게시합니다. Notion에서 손으로 수정한 내용을 GitHub로 자동 가져오는 양방향 동기화나 상시 백그라운드 작업은 설정하지 않았습니다.

1. 문서를 수정하고 원문·링크를 검수합니다.
2. 로컬 페이지 매핑을 사용해 게시 계획을 만듭니다.
3. 기존 Notion 페이지를 먼저 읽고, 사용자 메모와 하위 페이지를 보존하며 해당 문서만 갱신합니다.
4. 성공한 도구 응답에 대해서만 문서 경로·내용 해시·게시일을 게시 기록에 반영합니다.
5. 게시 기록 검사 후 GitHub에 푸시합니다.

```sh
python scripts/build_indexes.py
python scripts/check_docs.py
python scripts/notion_sync.py --map .git/notion-cache/final-page-map.json --output .git/notion-cache/publish-plan.json
python scripts/notion_sync.py --check
```

계획 생성 명령은 내용을 변환해 JSON으로 저장하며, 외부 서비스에 직접 쓰지 않습니다. 실제 게시에는 연결된 Notion 도구를 사용합니다. 페이지 매핑과 원문 캐시는 로컬 .git 안에 두며 공개 저장소에 업로드하지 않습니다. GitHub Actions에서 접근 토큰 없이 Notion을 자동 갱신한다고 가정하지 않습니다.
