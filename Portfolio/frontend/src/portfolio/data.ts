import accioHome from './assets/home.png'
import maestroLive from './assets/maestro.jpg'
import stayLoginV1 from './assets/design/stay-login/v1.png'
import stayLoginV2 from './assets/design/stay-login/v2.png'
import stayLoginV3 from './assets/design/stay-login/v3.png'

// 검색형 포트폴리오 데이터 — 기준: 「검색형 포트폴리오 구상안」 Search Portfolio.dc.html
// Accio 를 뺀 사례·지표는 시안의 예시 값이다. 실제 사례를 정리하면 여기서 바꾼다.

export type CaseType = 'Front' | 'Back' | 'Design'

/** Design 사례의 시안 한 장 */
export interface DesignVariant {
  label: string
  image: string
  /** 이 안에서 바꾼 점·이유 한 줄 */
  note: string
}

/** Design 사례 — 같은 화면을 여러 안으로 고친 과정. 최종안은 실제 동작하는 데모로 함께 보여준다 */
export interface DesignCase {
  /** 어떤 서비스의 화면인지 */
  app: string
  /** 처음 시안에서 느낀 문제 */
  problem: string
  variants: DesignVariant[]
  /** variants 중 최종안의 위치 */
  finalIndex: number
}

export interface PortfolioCase {
  slug: string
  type: CaseType
  code: string
  date: string
  title: string
  description: string
  metrics: { label: string; value: string }[]
  tags: string[]
  /** 화면에 보이지 않는 추가 검색어 */
  keywords: string
  /** Front 썸네일. 없으면 자리표시를 보여준다 */
  image?: string
  /** 눌렀을 때 갈 곳. 없으면 링크 없이 보여준다 */
  href?: string
  /** href 말고 따로 열어볼 곳(예: 이전 버전). 새 탭으로 연다 */
  links?: { label: string; href: string }[]
  /** type 이 'Design' 인 사례의 시안 비교 */
  design?: DesignCase
}

export const CASES: PortfolioCase[] = [
  {
    slug: 'stay-login',
    type: 'Design',
    code: 'DESIGN 01',
    date: '2026.10',
    title: '숙박 예약 앱 로그인 화면 3안 개선',
    description: '소셜 로그인이 먼저 보여 아이디 로그인 동선이 길던 첫 시안을 3안까지 다듬고, 최종안을 실제 동작하는 화면으로 구현.',
    metrics: [
      { label: '시안', value: '3안' },
      { label: '최종', value: '3안 구현' },
    ],
    tags: ['Figma', 'React', 'Tailwind'],
    keywords: '로그인 숙박 예약 앱 소셜 로그인 UI 개선 피그마 accio 디자인',
    image: stayLoginV3,
    href: '#/case/stay-login',
    design: {
      app: 'Accio — 저장한 여행지를 모아 보고 숙소를 예약하는 앱 (개인 콘셉트)',
      problem:
        '첫 시안은 소셜 로그인이 맨 위에 있어 아이디로 로그인하는 사용자가 한 번 더 내려가야 했고, 둥근 입력창과 버튼이 비슷해 보여 무엇을 눌러야 할지 흐렸다.',
      variants: [
        { label: '1안', image: stayLoginV1, note: '소셜 로그인을 맨 위에 두고 입력창·버튼을 모두 둥근 알약 모양으로 맞춘 첫 시안' },
        { label: '2안', image: stayLoginV2, note: '아이디 로그인을 주 동선으로 보고 위로 올림. 입력창을 각지게 바꿔 버튼과 구분' },
        { label: '3안', image: stayLoginV3, note: '로그인 버튼이 어두운 배경에 묻혀 파란색으로 강조하고, 로고를 원형 심볼로 정리' },
      ],
      finalIndex: 2,
    },
  },
  {
    slug: 'accio',
    type: 'Front',
    code: 'PROJECT 01',
    date: '2025.11',
    title: 'Accio — AI 자연어 검색 쇼핑몰',
    description:
      '“USB 여러 개 꽂는 거”처럼 모호한 말도 알아듣는 쇼핑몰. 디자인 시스템을 정의하고 대화형 검색부터 장바구니·주문까지 구현.',
    metrics: [
      { label: '기간', value: '2025.10 – 11' },
      { label: '팀', value: '5명' },
    ],
    tags: ['React', 'TypeScript', 'Tailwind'],
    keywords: 'accio 아씨오 쇼핑몰 이커머스 ai 검색 리액트 디자인 시스템',
    image: accioHome,
    href: '#/accio',
    // v1: 실제 서비스했던 원본. 서버가 닫혀 목데이터로 도는 정적 빌드(public/accio-v1)다
    links: [{ label: 'v1 원본 보기', href: '/accio-v1/' }],
  },
  {
    slug: 'maestro',
    type: 'Front',
    code: 'PROJECT 05',
    date: '2026.10',
    title: '마에스트로 — 틀어진 일정의 플랜 B 지휘자',
    description:
      '짜둔 서울 일정의 끼니마다 "속이 더부룩해", "비 와" 같은 상황별 대안 식당을 미리 붙여두고, 당일 버튼 하나로 꺼내 쓰는 모바일 웹. YUMITHON 해커톤 출품작.',
    metrics: [
      { label: '유미 요청', value: '끼니당 1번' },
      { label: '상황', value: '6개 × 대안 3곳' },
    ],
    tags: ['React', 'FastAPI', '헤이유미 API'],
    keywords: '마에스트로 maestro 해커톤 yumithon 헤이유미 맛집 일정 플랜B 대안 식당 fastapi 백엔드',
    image: maestroLive,
    href: '#/maestro',
  },
  {
    slug: 'traffic-scale-out',
    type: 'Back',
    code: 'CASE 01',
    date: '2026.03',
    title: '트래픽 10배 급증 시 API 서버 수평 확장',
    description: '이벤트 오픈 직후 요청이 몰려 응답이 지연되는 상황. 오토스케일링 정책과 로드밸런서 헬스체크를 재설계해 해결.',
    metrics: [
      { label: '처리량', value: '1.2k → 12k RPS' },
      { label: '에러율', value: '4.1% → 0.2%' },
    ],
    tags: ['오토스케일링', '로드밸런서', '부하테스트'],
    keywords: '트래픽 급증 서버 확장 스케일',
  },
  {
    slug: 'connection-pool',
    type: 'Back',
    code: 'CASE 02',
    date: '2026.04',
    title: 'DB 커넥션 풀 고갈로 인한 장애 대응',
    description: '슬로우 쿼리가 커넥션을 붙잡아 전체 API가 멈춘 상황. 풀 사이즈 튜닝과 쿼리 타임아웃으로 재발 방지.',
    metrics: [{ label: 'p95 응답', value: '2.4s → 210ms' }],
    tags: ['MySQL', 'HikariCP', '장애대응'],
    keywords: '커넥션 풀 DB 데이터베이스 장애',
  },
  {
    slug: 'n-plus-one',
    type: 'Back',
    code: 'CASE 03',
    date: '2026.05',
    title: 'N+1 쿼리로 느려진 목록 API 개선',
    description: '연관 엔티티 조회 시 쿼리가 행 수만큼 실행되던 문제. fetch join과 배치 조회로 쿼리 수를 줄임.',
    metrics: [
      { label: '쿼리 수', value: '101 → 2' },
      { label: '응답', value: '840ms → 90ms' },
    ],
    tags: ['JPA', '쿼리최적화'],
    keywords: 'N+1 쿼리 성능 개선 JPA',
  },
  {
    slug: 'redis-cache',
    type: 'Back',
    code: 'CASE 04',
    date: '2026.06',
    title: 'Redis 캐시 도입과 캐시 스탬피드 방지',
    description: '인기 상품 조회가 DB에 집중되던 문제. 캐시 계층을 추가하고 만료 시점 분산으로 동시 재조회를 막음.',
    metrics: [
      { label: '캐시 히트율', value: '92%' },
      { label: 'DB 부하', value: '-70%' },
    ],
    tags: ['Redis', '캐시전략'],
    keywords: '캐시 레디스 성능 개선',
  },
  {
    slug: 'blue-green-deploy',
    type: 'Back',
    code: 'CASE 05',
    date: '2026.07',
    title: 'Blue/Green 무중단 배포 파이프라인 구축',
    description: '배포마다 수 분간 서비스가 끊기던 문제. CI/CD 파이프라인과 트래픽 전환 방식으로 다운타임 제거.',
    metrics: [{ label: '다운타임', value: '3분 → 0' }],
    tags: ['GitHub Actions', 'Docker', 'CI/CD'],
    keywords: '무중단 배포 자동화 파이프라인',
  },
  {
    slug: 'message-queue',
    type: 'Back',
    code: 'CASE 06',
    date: '2026.08',
    title: '메시지 큐로 결제 알림 비동기 처리',
    description: '결제 완료 후 알림 발송이 응답을 붙잡던 문제. 메시지 큐로 분리해 응답 시간과 장애 전파를 줄임.',
    metrics: [{ label: '응답', value: '900ms → 120ms' }],
    tags: ['Kafka', '비동기'],
    keywords: '메시지 큐 비동기 카프카 결제',
  },
  {
    slug: 'design-system-ui',
    type: 'Front',
    code: 'PROJECT 02',
    date: '2026.02',
    title: '디자인 시스템 기반 포트폴리오 UI',
    description: '컬러·타이포·여백 토큰을 정의하고 컴포넌트로 정리해 화면 전반의 일관성을 맞춘 작업.',
    metrics: [{ label: '컴포넌트', value: '24개' }],
    tags: ['디자인시스템', 'Figma'],
    keywords: '디자인 시스템 UI 토큰',
  },
  {
    slug: 'dashboard-rendering',
    type: 'Front',
    code: 'PROJECT 03',
    date: '2026.05',
    title: '대시보드 렌더링 성능 개선',
    description: '수천 행 테이블에서 스크롤이 끊기던 문제. 가상 스크롤과 메모이제이션으로 렌더링 비용을 줄임.',
    metrics: [{ label: 'LCP', value: '3.1s → 1.2s' }],
    tags: ['React', '가상스크롤'],
    keywords: '성능 개선 렌더링 대시보드',
  },
  {
    slug: 'search-portfolio',
    type: 'Front',
    code: 'PROJECT 04',
    date: '2026.09',
    title: '검색형 포트폴리오 인터페이스',
    description: '포트폴리오를 검색으로 탐색하도록 설계한 인터페이스. 자동완성과 키보드 탐색을 지원.',
    metrics: [{ label: '단축키', value: '/ 로 검색' }],
    tags: ['UX', '검색'],
    keywords: '검색 UX 인터페이스',
  },
]

export const KEYWORDS: { label: string; type: CaseType }[] = [
  { label: '트래픽 급증', type: 'Back' },
  { label: '커넥션 풀', type: 'Back' },
  { label: 'N+1 쿼리', type: 'Back' },
  { label: '캐시', type: 'Back' },
  { label: '무중단 배포', type: 'Back' },
  { label: '메시지 큐', type: 'Back' },
  { label: '성능 개선', type: 'Front' },
  { label: '디자인 시스템', type: 'Front' },
  { label: '로그인 화면', type: 'Design' },
  { label: '해커톤', type: 'Front' },
]

// ── 검색 ────────────────────────────────────────────────────────────────
const haystack = (item: PortfolioCase) =>
  [item.title, item.description, item.tags.join(' '), item.keywords].join(' ').toLowerCase()

/** 공백으로 나눈 모든 단어가 제목·설명·태그·검색어 어딘가에 들어 있으면 일치 */
export function matchesQuery(item: PortfolioCase, query: string) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const text = haystack(item)
  return words.every((word) => text.includes(word))
}

export interface Suggestion {
  text: string
  type: CaseType
}

/** 빈 입력이면 추천 키워드, 입력이 있으면 키워드 + 사례 제목 중 부분 일치 */
export function getSuggestions(query: string, limit = 6): Suggestion[] {
  const q = query.trim().toLowerCase()
  if (!q) return KEYWORDS.slice(0, limit).map(({ label, type }) => ({ text: label, type }))
  const pool = [
    ...KEYWORDS.map(({ label, type }) => ({ text: label, type })),
    ...CASES.map(({ title, type }) => ({ text: title, type })),
  ]
  return pool.filter(({ text }) => text.toLowerCase().includes(q)).slice(0, limit)
}

/** 자동완성에서 일치한 부분만 굵게 보여주기 위해 앞·일치·뒤로 나눈다 */
export function splitMatch(text: string, query: string) {
  const q = query.trim()
  const index = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1
  if (index < 0) return { before: text, match: '', after: '' }
  return { before: text.slice(0, index), match: text.slice(index, index + q.length), after: text.slice(index + q.length) }
}
