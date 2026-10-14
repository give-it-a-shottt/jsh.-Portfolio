import accioHome from './assets/home.png'
import maestroLive from './assets/maestro.jpg'
import stayLoginV1 from './assets/design/stay-login/v1.png'
import stayLoginV2 from './assets/design/stay-login/v2.png'
import stayLoginV3 from './assets/design/stay-login/v3.png'
import gpHome from './assets/design/gameprobe/screen-01-home.webp'
import gpProfile from './assets/design/gameprobe/screen-02-profile.webp'
import gpMatch from './assets/design/gameprobe/screen-03-match.webp'
import gpRanking from './assets/design/gameprobe/screen-04-ranking.webp'
import gpMeta from './assets/design/gameprobe/screen-05-meta.webp'
import gpAgent from './assets/design/gameprobe/screen-06-agent.webp'
import gpMy from './assets/design/gameprobe/screen-07-my.webp'
import gpLineup from './assets/design/gameprobe/screen-08-lineup.webp'
import gpSmoke from './assets/design/gameprobe/screen-09-smoke.webp'
import gpAdmin from './assets/design/gameprobe/screen-10-admin.webp'
import gpCover from './assets/design/gameprobe/system-00-cover.webp'
import gpColor from './assets/design/gameprobe/system-01-color.webp'
import gpTypography from './assets/design/gameprobe/system-02-typography.webp'
import gpTextHierarchy from './assets/design/gameprobe/system-03-text-hierarchy.webp'
import gpLayout from './assets/design/gameprobe/system-04-layout.webp'
import gpRadius from './assets/design/gameprobe/system-05-radius.webp'
import gpComponents from './assets/design/gameprobe/system-06-components.webp'
import rmHome from './assets/design/remind/screen-01-home.webp'
import rmTrack from './assets/design/remind/screen-02-track.webp'
import rmTopic from './assets/design/remind/screen-03-topic.webp'
import rmChoice from './assets/design/remind/screen-04-choice.webp'
import rmFeedback from './assets/design/remind/screen-05-feedback.webp'
import rmOx from './assets/design/remind/screen-06-ox.webp'
import rmSelfGrade from './assets/design/remind/screen-07-self-grade.webp'
import rmConceptSheet from './assets/design/remind/screen-08-concept-sheet.webp'
import rmResult from './assets/design/remind/screen-09-result.webp'
import rmWrongNote from './assets/design/remind/screen-10-wrong-note.webp'
import rmSettings from './assets/design/remind/screen-11-settings.webp'
import rmColor from './assets/design/remind/system-01-color.webp'
import rmTypography from './assets/design/remind/system-02-typography.webp'
import rmLayout from './assets/design/remind/system-03-layout.webp'
import rmRadius from './assets/design/remind/system-04-radius.webp'
import rmBreakpoints from './assets/design/remind/system-05-breakpoints.webp'
import rmComponents from './assets/design/remind/system-06-components.webp'
import rmIa from './assets/design/remind/system-07-ia.webp'
import rmUserFlow from './assets/design/remind/system-08-user-flow.webp'
import rmLearningModel from './assets/design/remind/system-09-learning-model.webp'
import rmComponentSheet from './assets/design/remind/system-10-component-sheet.webp'

// 검색형 포트폴리오 데이터 — 기준: 「검색형 포트폴리오 구상안」 Search Portfolio.dc.html
// Accio 를 뺀 사례·지표는 시안의 예시 값이다. 실제 사례를 정리하면 여기서 바꾼다.

export type CaseType = 'Front' | 'Back' | 'Design'

/** Design 사례의 화면 한 장(시안·화면 구성·디자인 시스템 가이드) */
export interface DesignVariant {
  label: string
  image: string
  /** 이 안에서 바꾼 점·이유, 또는 이 화면이 하는 일 한 줄 */
  note: string
  /** 이미지 원본 크기. 없으면 400×860 휴대폰 시안으로 본다 */
  width?: number
  height?: number
}

/**
 * Design 사례 — 같은 화면을 여러 안으로 고친 과정(variants), 또는 앱 전체 화면 구성(screens)과
 * 디자인 시스템(system). 대표 화면은 실제 동작하는 데모로 함께 보여준다(demos/index.ts).
 */
export interface DesignCase {
  /** 어떤 서비스의 화면인지 */
  app: string
  /** 시안 화면 종류. 없으면 휴대폰 화면으로 본다 */
  device?: 'mobile' | 'desktop'
  /** 처음 시안에서 느낀 문제, 또는 설계하며 풀려던 문제 */
  problem: string
  /** 같은 화면을 고쳐 나간 시안 */
  variants?: DesignVariant[]
  /** variants 중 최종안의 위치 */
  finalIndex?: number
  /** 앱의 주요 화면 */
  screens?: DesignVariant[]
  /** 디자인 시스템 가이드(컬러·타이포·컴포넌트). 넓고 긴 문서라 device 와 상관없이 데스크톱 카드로 보여준다 */
  system?: DesignVariant[]
  /** 실제 동작 화면 칸의 제목·설명. 데모가 등록된 사례에만 쓴다 */
  demo?: { title: string; note: string; caveat?: string }
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
      demo: {
        title: '최종안 실제 화면',
        note: '3안을 실제로 동작하는 화면으로 만들었어요. 직접 입력해 보세요. 비밀번호 보기, 아이디 저장이 동작하고, 로그인 버튼을 누르면 안내가 떠요.',
        caveat: '실제 인증은 연결하지 않은 데모예요.',
      },
    },
  },
  {
    slug: 'gameprobe',
    type: 'Design',
    code: 'DESIGN 02',
    date: '2026.10',
    title: 'GAMEPROBE — 발로란트 전적·공략 웹 서비스 설계',
    description:
      '전적 검색부터 매치 분석, 메타 통계, 라인업·스모크 공략, 관리자 편집까지 10개 영역의 화면과 디자인 시스템을 피그마로 설계.',
    metrics: [
      { label: '영역', value: '10개' },
      { label: '디자인 시스템', value: '7장' },
    ],
    tags: ['Figma', '디자인 시스템', 'Web UI'],
    keywords:
      'gameprobe 게임프로브 발로란트 valorant 게임 전적 검색 매치 분석 메타 티어 라인업 스모크 공략 관리자 디자인 시스템 피그마 웹',
    image: gpHome,
    href: '#/case/gameprobe',
    links: [{ label: '실제 서비스 보기', href: 'https://valorant-platform.vercel.app/' }],
    design: {
      app: 'GAMEPROBE — 발로란트 플레이어가 전적을 검색하고 메타·라인업·스모크 공략을 찾아보는 웹 서비스 (팬 프로젝트)',
      problem:
        '전적, 메타 통계, 라인업 공략이 서로 다른 사이트에 흩어져 있어 한 경기를 돌아보려면 여러 곳을 오가야 했다. 검색 → 매치 분석 → 공략까지 한 서비스 안에서 이어지도록 화면과 디자인 시스템을 함께 설계했다.',
      device: 'desktop',
      screens: [
        { label: '메인 홈', image: gpHome, note: 'Riot ID 검색을 가장 위에 두고, 즐겨찾기·요원 티어·맵 승률·리더보드를 한 화면에 모음', width: 1440, height: 1863 },
        { label: '플레이어 프로필', image: gpProfile, note: '현재 티어와 최근 20매치 요약을 왼쪽에, 매치 목록을 승패 색으로 구분해 오른쪽에 배치', width: 1440, height: 1965 },
        { label: '매치 상세', image: gpMatch, note: '우리 팀·상대 팀 스코어보드를 나누고 내 행을 강조. 라운드·경제·비교는 탭으로 분리', width: 1440, height: 1431 },
        { label: '랭킹', image: gpRanking, note: '공식 리더보드를 순위·티어·RR 중심의 긴 표로 정리', width: 1440, height: 3218 },
        { label: '메타 통계', image: gpMeta, note: 'S~C 티어 보드로 한눈에 보고, 아래 표에서 승률·픽률·KDA로 다시 정렬', width: 1440, height: 2660 },
        { label: '게임 정보', image: gpAgent, note: '요원 상세 — 역할과 스킬 정보를 한 페이지에 정리', width: 1440, height: 2050 },
        { label: '마이페이지', image: gpMy, note: '로그인 전에는 계정 연동으로 얻는 이점만 짧게 보여주고 로그인 버튼 하나로 이어지게 함', width: 1440, height: 717 },
        { label: '라인업', image: gpLineup, note: '맵·요원·스킬을 고르면 미니맵에 던지는 위치가 뜨고, 오른쪽에 서는 위치→조준→발사 단계를 보여줌', width: 1440, height: 1117 },
        { label: '스모크 가이드', image: gpSmoke, note: '맵에서 연막 도착 위치를 고르면 서는 위치·조준·설치 순서가 펼쳐짐', width: 1440, height: 1763 },
        { label: '관리자', image: gpAdmin, note: '공략 편집 — 입력 폼과 지도 위 위치 지정을 나란히 두어 입력하면서 바로 확인', width: 1440, height: 1594 },
      ],
      system: [
        { label: '표지', image: gpCover, note: '가이드 목차와 디자인 원칙', width: 1440, height: 1673 },
        { label: '컬러', image: gpColor, note: '배경·표면·텍스트·브랜드·승패 색과 사용 규칙', width: 1440, height: 4648 },
        { label: '타이포그래피', image: gpTypography, note: 'Pretendard 기반 크기·굵기 스케일', width: 1440, height: 4346 },
        { label: '텍스트 위계', image: gpTextHierarchy, note: '화면 유형별 제목·본문·보조 텍스트 조합', width: 1440, height: 3937 },
        { label: '레이아웃·간격', image: gpLayout, note: '간격 스케일과 1440 데스크톱 그리드', width: 1440, height: 3245 },
        { label: '모서리', image: gpRadius, note: '요소 크기별 모서리 반경 규칙', width: 1440, height: 2423 },
        { label: '컴포넌트', image: gpComponents, note: '버튼·필터 칩·탭·검색창·통계 카드·매치 행', width: 1440, height: 3436 },
      ],
    },
  },
  {
    slug: 'remind',
    type: 'Design',
    code: 'DESIGN 03',
    date: '2026.10',
    title: 'remind — 노션 학습노트 복습 퀴즈 앱 설계',
    description:
      '노션에 정리한 강의 노트를 객관식·OX·단답형·서술형 퀴즈로 복습하는 모바일 퍼스트 앱. 복습 흐름·오답노트·디자인 시스템을 피그마로 설계.',
    metrics: [
      { label: '퀴즈 유형', value: '4종' },
      { label: '시안', value: '모바일 18 · PC/태블릿 5' },
    ],
    tags: ['Figma', '디자인 시스템', 'Mobile UI'],
    keywords:
      'remind 리마인드 노션 학습노트 복습 퀴즈 오답노트 객관식 ox 단답형 서술형 라이트너 leitner 학습 앱 모바일 반응형 디자인 시스템 피그마',
    image: rmHome,
    href: '#/case/remind',
    links: [{ label: '실제 서비스 보기', href: 'https://remind-flame-ten.vercel.app/' }],
    design: {
      app: 'remind — 노션에 정리한 강의 노트를 퀴즈로 바꿔 매일 복습하는 웹 앱 (개인 프로젝트)',
      problem:
        '노션에 강의 노트를 쌓아도 다시 펼쳐 보지 않으면 금방 잊어버렸다. 홈에서 탭 두 번 안에 오늘 복습을 시작하고, 틀린 문제는 연속으로 두 번 맞힐 때까지 오답노트에서 다시 나오도록 흐름을 설계했다.',
      screens: [
        { label: '홈', image: rmHome, note: '오늘 복습할 문제 수와 시작 버튼을 맨 위에 두고, 이어 풀기·이번 주 업데이트·트랙을 아래로', width: 390, height: 1424 },
        { label: '트랙', image: rmTrack, note: '토픽 수·진도·정답률 요약과 상태 필터, 토픽 목록', width: 390, height: 924 },
        { label: '토픽 · 개념', image: rmTopic, note: '노션 소제목 하나를 개념 카드 하나로. 개념·문제 목록 탭과 하단 고정 버튼', width: 390, height: 1257 },
        { label: '퀴즈 · 객관식', image: rmChoice, note: '탭바 없는 집중 모드 — 위에는 닫기·진행바·문제 번호만 남김', width: 390, height: 844 },
        { label: '오답 피드백', image: rmFeedback, note: '채점 직후 정답·오답을 색·아이콘·문장으로 함께 보여주고, 보기마다 맞고 틀린 이유를 설명', width: 390, height: 1044 },
        { label: '퀴즈 · OX', image: rmOx, note: '누르는 즉시 채점해 정답 쪽과 내가 고른 쪽을 바로 표시', width: 390, height: 844 },
        { label: '퀴즈 · 서술형', image: rmSelfGrade, note: '모범답안·핵심 키워드와 비교해 몰랐음·애매함·알았음으로 직접 채점', width: 390, height: 844 },
        { label: '개념 바텀시트', image: rmConceptSheet, note: '퀴즈를 벗어나지 않고 관련 개념을 아래에서 올려 확인', width: 390, height: 844 },
        { label: '결과', image: rmResult, note: '점수·정답률 변화·연속 복습 일수와 틀린 문제를 한 번에 다시 풀기', width: 390, height: 1066 },
        { label: '오답노트', image: rmWrongNote, note: '틀린 문제를 모아 두고, 연속 2번 맞히면 자동으로 졸업', width: 390, height: 1087 },
        { label: '설정', image: rmSettings, note: '퀴즈·학습 기록·정보로 나눈 설정 목록', width: 390, height: 846 },
      ],
      system: [
        { label: '컬러', image: rmColor, note: '쿨그레이 바탕에 오렌지 한 색. 색은 지금 눌러야 할 것과 정답·오답에만', width: 1200, height: 2558 },
        { label: '타이포그래피', image: rmTypography, note: '크기·굵기 스케일과 화면별 텍스트 위계', width: 1200, height: 3853 },
        { label: '레이아웃·간격', image: rmLayout, note: '간격 스케일과 컨테이너 규칙', width: 1200, height: 1311 },
        { label: '모서리·그림자', image: rmRadius, note: '요소별 모서리 반경과 그림자 단계', width: 1200, height: 672 },
        { label: '브레이크포인트', image: rmBreakpoints, note: '모바일 퍼스트 — 390 · 768 · 1440 시안, 콘텐츠 최대 1200', width: 1200, height: 868 },
        { label: '컴포넌트 규칙', image: rmComponents, note: '컴포넌트를 고르고 조합하는 기준', width: 1200, height: 1396 },
        { label: 'IA', image: rmIa, note: '화면 7개와 하단 탭바가 보이는 범위·이동 경로', width: 1200, height: 2108 },
        { label: '유저 플로우', image: rmUserFlow, note: '가장 자주 쓰는 매일 복습은 홈에서 탭 2번 안에 첫 문제가 나오도록', width: 1200, height: 2235 },
        { label: '학습 모델', image: rmLearningModel, note: 'Leitner 6단계(BOX 0~5)로 맞힐수록 복습 간격을 당일 → 1일 → 3일 → 7일 → 14일 뒤로 늘림', width: 1200, height: 802 },
        { label: '컴포넌트 시트', image: rmComponentSheet, note: '버튼·보기·OX·피드백 패널·오답 카드 등 상태별 컴포넌트 전체', width: 1680, height: 11050 },
      ],
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
  { label: '게임 전적', type: 'Design' },
  { label: '복습 퀴즈', type: 'Design' },
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
