import { defineConfig } from 'vitepress'
import { readFileSync } from 'node:fs'
import { categories } from '../data/learning.mjs'

const catalog = JSON.parse(
  readFileSync(new URL('../.generated/catalog.json', import.meta.url), 'utf8')
)
export default defineConfig({
  lang: 'ko-KR',
  title: '연구를 배우는 법',
  titleTemplate: ':title · Learning Research',
  description:
    '논문 읽기부터 실험, 글쓰기, 발표까지. 한국어로 읽고 직접 기록하는 연구 학습 공간.',
  base: '/learning-research-ko/',
  srcDir: '.generated',
  cleanUrls: false,
  lastUpdated: false,
  sitemap: { hostname: 'https://oweixx.github.io/learning-research-ko/' },
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/learning-research-ko/favicon.svg'
      }
    ],
    ['meta', { name: 'theme-color', content: '#176458' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'ko_KR' }]
  ],
  themeConfig: {
    logo: '/favicon.svg',
    siteTitle: '연구를 배우는 법',
    nav: [
      { text: '학습 경로', link: '/paths' },
      { text: '자료실', link: '/library' },
      { text: '연구 노트', link: '/notebook' },
      { text: '내 서재', link: '/bookshelf' }
    ],
    sidebar: [
      {
        text: '나에게 맞는 시작',
        items: [
          { text: '학습 경로', link: '/paths' },
          { text: '전체 자료 검색', link: '/library' }
        ]
      },
      ...categories.map((c) => ({
        text: c.label,
        collapsed: !['start', 'papers'].includes(c.id),
        items: c.ids
          .map((id) => catalog.find((d) => d.id === id))
          .filter(Boolean)
          .map((d) => ({ text: d.title, link: d.url }))
      }))
    ],
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '검색', buttonAriaLabel: '문서 검색' },
              modal: {
                noResultsText: '검색 결과가 없습니다.',
                resetButtonTitle: '검색어 지우기',
                displayDetails: '자세히 보기',
                backButtonTitle: '검색 닫기',
                footer: {
                  selectText: '선택',
                  navigateText: '이동',
                  closeText: '닫기'
                }
              }
            }
          }
        }
      }
    },
    outline: { level: [2, 3], label: '이 문서의 내용' },
    docFooter: { prev: '이전 문서', next: '다음 문서' },
    darkModeSwitchLabel: '화면 테마',
    lightModeSwitchTitle: '밝은 화면으로 전환',
    darkModeSwitchTitle: '어두운 화면으로 전환',
    sidebarMenuLabel: '문서 목록',
    returnToTopLabel: '맨 위로',
    skipToContentLabel: '본문으로 건너뛰기',
    notFound: {
      code: '404',
      title: '문서를 찾지 못했어요',
      quote: '주소가 바뀌었을 수 있습니다. 자료실에서 다시 찾아보세요.',
      linkLabel: '처음으로',
      linkText: '처음으로 돌아가기'
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/oweixx/learning-research-ko',
        ariaLabel: 'GitHub 저장소'
      }
    ],
    editLink: {
      pattern: ({ frontmatter }) =>
        frontmatter.sourcePath
          ? `https://github.com/oweixx/learning-research-ko/edit/master/${frontmatter.sourcePath}`
          : 'https://github.com/oweixx/learning-research-ko',
      text: 'GitHub에서 이 문서 수정하기'
    },
    footer: {
      message:
        'Sida Peng의 Learning Research 비공식 한국어판 · 출처와 번역 범위를 각 문서에 표시합니다.',
      copyright: '읽고, 질문하고, 직접 해 보며 나만의 연구를 만들어 가세요.'
    }
  },
  markdown: {
    config(md) {
      md.set({ typographer: false })
    }
  }
})
