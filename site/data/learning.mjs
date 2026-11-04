export const categories = [
  {
    id: 'start',
    label: '연구 입문',
    icon: 'compass',
    description: '첫걸음부터 나만의 연구 방향까지',
    ids: [
      'getting-started',
      'advanced',
      'research-project',
      'research-vs-coursework',
      'undergraduate-to-research',
      'learning-plan',
      'choosing-research',
      'student-mindset'
    ]
  },
  {
    id: 'papers',
    label: '논문 읽기',
    icon: 'book',
    description: '찾고, 이해하고, 연결하는 읽기',
    ids: [
      'reading-papers',
      'finding-papers',
      'literature-tree',
      'independent-literature-search',
      'reading-research-code',
      'search-skills',
      'reviewing-papers'
    ]
  },
  {
    id: 'ideas',
    label: '문제와 아이디어',
    icon: 'spark',
    description: '좋은 질문에서 설득력 있는 해결책으로',
    ids: [
      'research-ideas',
      'research-taste',
      'designing-solutions',
      'first-principles',
      'goal-driven-research',
      'solution-pitfalls',
      'technical-problem-template',
      'science-and-mathematics',
      'researcher-qualities',
      'research-impact'
    ]
  },
  {
    id: 'experiments',
    label: '실험과 개발',
    icon: 'flask',
    description: '작게 검증하고, 기록하며 개선하기',
    ids: [
      'minimum-experiment',
      'exploratory-experiments',
      'experiment-questions',
      'experiment-failures',
      'experiment-records',
      'experiment-record-template',
      'experiment-log-march24',
      'experiment-pitfalls',
      'debugging-guide',
      'nan-debugging',
      'linux-research-environment',
      'clean-code-guide',
      'ai-assisted-programming',
      'phase-character-control'
    ]
  },
  {
    id: 'writing',
    label: '논문 쓰기',
    icon: 'pen',
    description: '연구의 기여를 분명한 글로 전하기',
    ids: [
      'writing-practice',
      'paper-writing-template',
      'writing-resources',
      'revising-papers',
      'writing-outline-example',
      'paper-writing-pitfalls',
      'ai-assisted-writing',
      'rebuttal',
      'figure-template-access'
    ]
  },
  {
    id: 'sharing',
    label: '발표와 소통',
    icon: 'message',
    description: '미팅, 발표, 시연으로 함께 생각하기',
    ids: [
      'research-meetings',
      'academic-talks',
      'presentation-design',
      'research-communication',
      'research-demos',
      'project-page-resources'
    ]
  },
  {
    id: 'life',
    label: '연구 생활',
    icon: 'leaf',
    description: '오래 연구하기 위한 관계와 습관',
    ids: [
      'sebastian-starke',
      'research-life-pitfalls',
      'meaningful-goals',
      'learning-from-mentors',
      'asking-senior-researchers',
      'joining-a-lab',
      'getting-to-know-colleagues',
      'mental-overload',
      'working-state'
    ]
  },
  {
    id: 'lectures',
    label: '강의와 슬라이드',
    icon: 'layers',
    description: '발표 자료로 다시 보는 연구의 과정',
    ids: [
      'ccf-retrospective',
      'learning-process-slides',
      'research-topic-selection',
      'games003-week1',
      'games003-week3',
      'games003-week5',
      'research-experience-slides',
      'course-guide',
      'reading-guide'
    ]
  },
  {
    id: 'about',
    label: '자료 안내',
    icon: 'info',
    description: '출처, 번역 범위와 변경 이력',
    ids: [
      'about-project',
      'translation',
      'publishing',
      'notion-index',
      'source-status',
      'changelog'
    ]
  }
]

export const tracks = [
  {
    id: 'first',
    number: '01',
    icon: 'compass',
    title: '연구실에 처음 들어왔어요',
    description:
      '연구의 전체 흐름을 이해하고, 나에게 맞는 첫 학습 계획을 세웁니다.',
    outcome: '나의 첫 연구 학습 계획',
    ids: [
      'getting-started',
      'research-vs-coursework',
      'joining-a-lab',
      'learning-from-mentors',
      'learning-plan'
    ],
    template: 'meeting'
  },
  {
    id: 'read',
    number: '02',
    icon: 'book',
    title: '논문을 제대로 읽고 싶어요',
    description:
      '필요한 논문을 찾고, 핵심을 파악하고, 연구 흐름 속에 연결합니다.',
    outcome: '질문이 남는 논문 정리 한 편',
    ids: [
      'finding-papers',
      'reading-papers',
      'reading-research-code',
      'literature-tree',
      'independent-literature-search'
    ],
    template: 'paper'
  },
  {
    id: 'experiment',
    number: '03',
    icon: 'flask',
    title: '아이디어를 실험으로 옮기고 싶어요',
    description: '막연한 아이디어를 검증 가능한 질문과 작은 실험으로 바꿉니다.',
    outcome: '판단 기준이 분명한 실험 계획',
    ids: [
      'research-ideas',
      'technical-problem-template',
      'minimum-experiment',
      'exploratory-experiments',
      'experiment-records',
      'experiment-questions'
    ],
    template: 'experiment'
  },
  {
    id: 'write',
    number: '04',
    icon: 'pen',
    title: '첫 논문을 쓰고 있어요',
    description:
      '기여와 논리를 정리하고, 초안을 쓰고, 독자의 관점에서 다듬습니다.',
    outcome: '기여와 근거가 연결된 논문 개요',
    ids: [
      'writing-practice',
      'paper-writing-template',
      'writing-outline-example',
      'revising-papers',
      'reviewing-papers',
      'rebuttal'
    ],
    template: 'outline'
  },
  {
    id: 'present',
    number: '05',
    icon: 'message',
    title: '연구를 잘 전달하고 싶어요',
    description: '생산적인 미팅과 이해하기 쉬운 발표를 준비합니다.',
    outcome: '논의할 질문이 있는 미팅 준비 노트',
    ids: [
      'research-meetings',
      'research-communication',
      'academic-talks',
      'presentation-design',
      'research-demos'
    ],
    template: 'meeting'
  }
]

export const templates = [
  {
    id: 'paper',
    title: '논문 정리',
    icon: 'book',
    description: '무엇을 풀었고, 왜 작동하며, 무엇이 남았는지 정리합니다.',
    source: 'reading-papers',
    fields: [
      [
        'reference',
        '논문 제목과 링크',
        '다시 찾아볼 수 있도록 제목, 저자, 연도, 링크를 적어 보세요.'
      ],
      [
        'problem',
        '해결하려는 문제',
        '기존 방법은 어디서 어려움을 겪고, 왜 이 문제가 중요한가요?'
      ],
      ['idea', '핵심 아이디어와 기여', '새로운 생각을 내 말로 설명해 보세요.'],
      [
        'evidence',
        '주장을 뒷받침하는 근거',
        '핵심 비교 실험과 구성 요소 분석은 무엇을 보여 주나요?'
      ],
      [
        'limits',
        '한계와 남은 질문',
        '어떤 조건에서 실패할까요? 더 확인하고 싶은 점은 무엇인가요?'
      ],
      [
        'next',
        '내 연구에 적용할 점',
        '다음에 읽을 논문이나 직접 해 볼 실험을 하나 적어 보세요.'
      ]
    ]
  },
  {
    id: 'experiment',
    title: '실험 설계',
    icon: 'flask',
    description: '한 번의 작은 실험으로 무엇을 확인할지 구체화합니다.',
    source: 'exploratory-experiments',
    fields: [
      [
        'question',
        '검증할 질문과 가설',
        '무엇이 원인이라고 생각하나요? 예상되는 결과는 무엇인가요?'
      ],
      [
        'minimum',
        '가장 작은 검증 방법',
        '기술적 난점은 남기면서 데이터와 구현을 얼마나 단순하게 만들 수 있나요?'
      ],
      [
        'control',
        '비교 조건과 통제할 변수',
        '기준 방법, 변경할 요소, 고정할 요소를 구분해 보세요.'
      ],
      [
        'criteria',
        '성공·실패 판단 기준',
        '어떤 지표와 결과를 보고 가설을 지지하거나 기각할 건가요?'
      ],
      [
        'setup',
        '재현을 위한 설정',
        '데이터, 코드 버전, 시드, 실행 명령과 예상 비용을 기록하세요.'
      ],
      [
        'result',
        '결과와 다음 행동',
        '예상과 실제 결과의 차이는 무엇인가요? 다음에 무엇을 바꿀 건가요?'
      ]
    ]
  },
  {
    id: 'meeting',
    title: '미팅 준비',
    icon: 'message',
    description: '진행 상황과 막힌 지점을 정리해 함께 판단할 질문을 만듭니다.',
    source: 'research-meetings',
    fields: [
      [
        'goal',
        '이번 미팅에서 얻고 싶은 것',
        '어떤 결정이나 피드백이 필요한가요?'
      ],
      [
        'progress',
        '지난 미팅 이후의 진전',
        '시도한 방법, 확인한 근거와 결과를 간결하게 정리하세요.'
      ],
      [
        'blocker',
        '막힌 지점과 내 분석',
        '증상, 추정 원인, 이미 시도한 방법을 구분해 보세요.'
      ],
      [
        'questions',
        '함께 논의할 질문',
        '조언을 구할 지점과 생각해 본 대안을 적어 보세요.'
      ],
      [
        'actions',
        '결정과 다음 행동',
        '미팅 후 담당할 일, 확인할 결과와 목표 날짜를 기록하세요.'
      ]
    ]
  },
  {
    id: 'outline',
    title: '논문 개요',
    icon: 'pen',
    description: '독자가 따라올 수 있도록 문제, 기여, 근거의 흐름을 세웁니다.',
    source: 'paper-writing-template',
    fields: [
      [
        'message',
        '핵심 메시지 한 문장',
        '이 연구를 읽고 독자가 기억할 내용은 무엇인가요?'
      ],
      [
        'motivation',
        '문제와 기존 방법의 한계',
        '문제가 중요한 이유와 아직 해결되지 않은 난점을 연결해 보세요.'
      ],
      [
        'contributions',
        '기여와 각각의 근거',
        '각 기여가 어떤 난점을 해결하며, 어떤 결과로 뒷받침되는지 적어 보세요.'
      ],
      [
        'method',
        '방법의 설명 순서',
        '전체 흐름, 각 구성 요소의 도입 이유, 작동 방식 순으로 정리하세요.'
      ],
      [
        'experiments',
        '필요한 실험과 그림',
        '주장마다 어떤 비교, 분석, 그림이 있어야 설득력이 생길까요?'
      ],
      [
        'limits',
        '한계와 수정할 점',
        '과장된 주장이나 빠진 연결은 없는지 독자의 관점에서 살펴보세요.'
      ]
    ]
  }
]

export const statusLabels = {
  translated: '본문·도표 대조 완료',
  body_translated: '본문 번역',
  reading_guide_only: '소개·요약',
  blocked: '접근 제한 안내',
  reference: '자료 안내'
}
export const statusDescriptions = {
  translated:
    '공개 본문과 학습용 도표를 대조했습니다. 링크된 외부 자료는 별도입니다.',
  body_translated:
    '본문을 한국어로 옮겼습니다. 외부 인용·첨부 및 영상은 별도 범위입니다.',
  reading_guide_only: '한국어 소개와 요약입니다. 원문 전문 번역은 아닙니다.',
  blocked: '원문 접근이 제한되어 확인 가능한 범위만 안내합니다.',
  reference: '자료의 구성, 이용 방법 또는 번역 범위를 안내합니다.'
}
