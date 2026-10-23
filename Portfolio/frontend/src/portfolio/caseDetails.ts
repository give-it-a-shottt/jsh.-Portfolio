// Front·Back 사례 상세 — 문제 → 해결 포인트 → 결과 → 실제 코드. 목록 정보(제목·태그·레벨)는 data.ts 에 있다.
// 코드는 따로 복사해 두지 않고 저장소 파일을 원문(?raw)으로 불러와 줄 범위만 잘라 보여준다.
// 원본 파일을 고쳐 줄이 밀리면 여기 lines 도 같이 고친다.
// 이 파일은 상세 화면을 열 때만 받는다(PortfolioApp 의 lazy) — 코드 원문이 첫 화면 용량에 들어가지 않는다.

import accioCart from '../projects/accio/ui/useCart.ts?raw'
import accioArchitecture from './assets/accio/architecture.png'
import accioDemoIntentPoster from './assets/accio/demo-intent.jpg'
import accioDemoIntent from './assets/accio/demo-intent.mp4'
import accioDemoReviewPoster from './assets/accio/demo-review.jpg'
import accioDemoReview from './assets/accio/demo-review.mp4'
import accioDemoSearchPoster from './assets/accio/demo-search.jpg'
import accioDemoSearch from './assets/accio/demo-search.mp4'
import accioPoster from './assets/accio/poster.jpg'
import accioTeam from './assets/accio/team.webp'
import appRoutes from '../App.tsx?raw'
import designTokens from '../index.css?raw'
import maestroApi from '../projects/maestro/api.ts?raw'
import maestroComponents from '../projects/maestro/components.tsx?raw'
import maestroLiveScreen from '../projects/maestro/screens/LiveScreen.tsx?raw'
import maestroStore from '../projects/maestro/store.ts?raw'
import rankSource from './rank.ts?raw'
import frontendReadme from '../../README.md?raw'
import accioHealth from '../../../backend/accio/app/health/router.py?raw'
import yumiClient from '../../../backend/maestro/app/yumi/client.py?raw'
import yumiDeps from '../../../backend/maestro/app/yumi/deps.py?raw'
import yumiMock from '../../../backend/maestro/app/yumi/mock.py?raw'
import yumiReal from '../../../backend/maestro/app/yumi/real.py?raw'
import scoreService from '../../../backend/maestro/app/score/service.py?raw'
import situations from '../../../backend/maestro/app/situations.py?raw'
import errorHandlers from '../../../backend/maestro/app/core/errors.py?raw'
import testConftest from '../../../backend/maestro/tests/conftest.py?raw'
import renderBlueprint from '../../../../render.yaml?raw'
import keepAwakeWorkflow from '../../../../.github/workflows/keep-supabase-awake.yml?raw'
// PlanForMe 는 다른 저장소라, 보여줄 파일만 Portfolio/external/planforme 에 원문 그대로 복사해 두었다
import pfmMain from '../../../external/planforme/api/main.py?raw'
import pfmPlanner from '../../../external/planforme/api/planner.py?raw'
import pfmServices from '../../../external/planforme/api/services.py?raw'
import pfmTimeutil from '../../../external/planforme/api/timeutil.py?raw'
import pfmTestApi from '../../../external/planforme/api/tests/test_api.py?raw'
import pfmTestPlanner from '../../../external/planforme/api/tests/test_planner.py?raw'
import pfmProxyRoute from '../../../external/planforme/web/src/app/api/[...path]/route.ts?raw'
import pfmCalendar from '../../../external/planforme/web/src/app/(tabs)/calendar/page.tsx?raw'
import pfmNewPlan from '../../../external/planforme/web/src/app/new/page.tsx?raw'
import pfmTaskActions from '../../../external/planforme/web/src/components/TaskActions.tsx?raw'
import pfmApi from '../../../external/planforme/web/src/lib/api.ts?raw'
import pfmFormat from '../../../external/planforme/web/src/lib/format.ts?raw'
import pfmUseToday from '../../../external/planforme/web/src/lib/useToday.ts?raw'

const PLANFORME_REPO = 'https://github.com/give-it-a-shottt/PlanForMe'

export interface CodeSample {
  /** 탭 이름 — 보통 파일 이름 */
  label: string
  /** 저장소 루트 기준 경로. 코드 위 경로 표시와 GitHub 링크에 쓴다 */
  path: string
  /** 코드가 다른 GitHub 저장소에 있을 때 그 주소. 없으면 이 저장소(jsh.-Portfolio) */
  repo?: string
  /** 파일 원문 */
  source: string
  /** 보여줄 줄 범위(1부터, 양 끝 포함). 없으면 파일 전체 */
  lines?: [number, number]
  /** 이 코드에서 볼 점 — 코드 아래 '설계 의도' 칸 */
  note: string
}

/** 팀 프로젝트 원본 소개 — 팀 저장소 README(팀원·시연 영상·아키텍처·포스터)를 사례 아래에 옮겨 둔다 */
export interface TeamProject {
  name: string
  tagline: string
  period: string
  repo: string
  /** 팀원 사진 한 장(이름이 그림 안에 있다) + 화면 읽기용 이름 */
  team: { image: string; members: string[] }
  /** 포스터에서 뽑은 팀 기술 요약 */
  highlights: { title: string; body: string }[]
  demos: { title: string; body: string; video: string; poster: string }[]
  architecture: { image: string; caption: string }
  poster: string
}

export interface CaseDetail {
  /** 무엇이 문제였나 */
  problem: string
  /** 어떻게 풀었나 — 번호 붙은 카드로 보여준다 */
  points: { title: string; body: string }[]
  /** 그래서 무엇이 달라졌나 */
  result?: string
  stack: string[]
  code: CodeSample[]
  team?: TeamProject
}

export const CASE_DETAILS: Record<string, CaseDetail> = {
  // ── Front ──────────────────────────────────────────────────────────────
  maestro: {
    problem:
      '여행 일정은 짜 두어도 당일에 비가 오거나, 속이 더부룩하거나, 줄이 너무 길면 틀어진다. 그 자리에서 다시 검색하면 늦으니, 상황이 생겼을 때 버튼 하나로 바로 대안을 꺼낼 수 있어야 했다.',
    points: [
      {
        title: '미리 다 찾아 두기',
        body: '‘지휘 시작’을 누르면 끼니마다 상황 6개의 대안을 한 번에 받아 둔다. 당일에는 서버를 다시 부르지 않고 바로 보여준다.',
      },
      {
        title: '새로고침해도 그대로',
        body: '만든 악보를 localStorage 에 저장하고 useSyncExternalStore 로 화면에 연결했다. 일정이 바뀌면 예전 악보는 맞지 않으니 비우고, 저장소를 못 쓰는 환경에서도 이번 방문 동안은 동작한다.',
      },
      {
        title: '문장으로 상황 고르기',
        body: '‘직접 말하기’에 “여기 너무 비싸”처럼 적으면 문장 속 낱말로 상황을 찾는다. ‘비싸’가 ‘비’에 걸리지 않도록 예산부터 보는 순서로 두었다.',
      },
      {
        title: '열린 시트도 주소에',
        body: '지금 끼니와 열린 상황을 주소(?meal=…&s=…)에 담아, 뒤로가기로 시트를 닫을 수 있게 했다.',
      },
    ],
    result: '당일에는 네트워크를 기다리지 않고 상황 버튼을 누르는 즉시 대안 3곳이 뜬다.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'motion', 'FastAPI'],
    code: [
      {
        label: 'store.ts',
        path: 'Portfolio/frontend/src/projects/maestro/store.ts',
        source: maestroStore,
        lines: [18, 58],
        note: '외부 저장소 + useSyncExternalStore 로 상태 라이브러리 없이 화면을 묶었다. 저장에 실패해도 화면은 계속 쓸 수 있게 try/catch 로 감쌌다.',
      },
      {
        label: 'LiveScreen.tsx',
        path: 'Portfolio/frontend/src/projects/maestro/screens/LiveScreen.tsx',
        source: maestroLiveScreen,
        lines: [12, 25],
        note: '목록 순서가 곧 우선순위다. 예산(‘비싸’)을 비(‘비’)보다 먼저 검사해 잘못 걸리는 경우를 막았다.',
      },
    ],
  },
  accio: {
    problem:
      '“USB 여러 개 꽂는 거”처럼 상품 이름을 모르는 사람도 원하는 물건을 찾게 하는 쇼핑몰이다. 홈·목록·상세·AI 대화·장바구니·마이페이지·주문 조회·고객센터까지 화면이 많고 반응형도 맞춰야 해서, 화면마다 값을 따로 정하면 금방 어긋났다.',
    points: [
      {
        title: '토큰 밖의 값은 쓸 수 없게',
        body: 'Tailwind @theme 에 글자 크기·굵기·색·모서리를 토큰으로 정의하고 기본 유틸리티는 지웠다. 문서에 없는 값은 클래스로 쓸 수 없어서 화면 사이 값이 어긋나지 않는다.',
      },
      {
        title: '반응형은 모바일부터',
        body: '같은 리스트 아이템도 모바일 → 태블릿 → 데스크톱 스케일을 정해 두고 단계별로 키웠다.',
      },
      {
        title: '계산 값은 상태로 두지 않기',
        body: '장바구니의 결제할 상품·할인·배송비·합계는 따로 저장하지 않고 매번 계산한다. 수량을 바꾸거나 지워도 숫자가 어긋날 틈이 없다.',
      },
      {
        title: '보이지 않는 사용자도',
        body: '체크박스는 진짜 input 을 숨겨 두고 모양만 그려 키보드·화면 읽기를 살렸고, 주문 단계는 aria-current 로 지금 단계를 알린다.',
      },
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS v4', 'Vite'],
    code: [
      {
        label: 'index.css',
        path: 'Portfolio/frontend/src/index.css',
        source: designTokens,
        lines: [3, 28],
        note: '--font-weight-*: initial, --text-*: initial 로 Tailwind 기본값을 지우고 디자인 문서의 값만 남겼다. 토큰에 없는 크기는 쓰려 해도 클래스가 없다.',
      },
      {
        label: 'useCart.ts',
        path: 'Portfolio/frontend/src/projects/accio/ui/useCart.ts',
        source: accioCart,
        lines: [81, 91],
        note: '저장하는 건 담은 상품·옵션·수량·선택뿐이고, 결제할 항목과 할인·배송비·합계는 장바구니와 주문서가 이 함수로 매번 계산한다.',
      },
    ],
    // 팀 저장소 README(mall-haebwa_) — 시연 GIF 는 용량이 커서(13MB) mp4 로 바꿔 두었다
    team: {
      name: 'Accio',
      tagline: '생각을 담는 장바구니',
      period: '2025.10.29 – 2025.11.29',
      repo: 'https://github.com/give-it-a-shottt/mall-haebwa_',
      team: { image: accioTeam, members: ['신정호(팀장)', '백준렬', '정성훈', '진충열', '서찬진'] },
      highlights: [
        {
          title: '의도를 알아듣는 검색',
          body: 'ElasticSearch 키워드 검색과 벡터 검색을 함께 써서 “USB 여러 개 꽂는 거” 같은 말의 뜻까지 찾고, 검색 뒤 LLM 이 한 번 더 걸러 관련 없는 상품을 뺐다.',
        },
        {
          title: '대화로 쇼핑몰을 움직이기',
          body: 'LLM Function Calling 으로 리뷰 요약·주문 조회·배송 조회 같은 쇼핑몰 API 를 대화 한 줄로 부른다.',
        },
        {
          title: 'Redis 캐싱으로 80초 → 5초',
          body: '대화·최근 검색·최근 본 상품을 Redis 에 두고 TTL 을 걸어, 첫 화면 응답을 80초에서 5초 안으로 줄였다.',
        },
      ],
      demos: [
        {
          title: '자연어 기반 검색',
          body: '상품 이름을 몰라도 원하는 걸 말로 적으면 맞는 상품을 찾아 준다.',
          video: accioDemoSearch,
          poster: accioDemoSearchPoster,
        },
        {
          title: '상품 및 리뷰 분석',
          body: '리뷰를 읽고 좋은 점과 아쉬운 점을 정리해, 사기 전에 핵심만 보게 한다.',
          video: accioDemoReview,
          poster: accioDemoReviewPoster,
        },
        {
          title: '사용자 의도 파악',
          body: '대화 흐름과 지난 구매를 보고 장바구니 담기·주문까지 대화로 이어 준다.',
          video: accioDemoIntent,
          poster: accioDemoIntentPoster,
        },
      ],
      architecture: {
        image: accioArchitecture,
        caption: 'AWS 위에 React·FastAPI 를 private subnet 에 두고 ALB 로 연결했다. LLM 은 Bedrock, 데이터는 MongoDB·Redis, 이미지는 S3.',
      },
      poster: accioPoster,
    },
  },
  'search-portfolio': {
    problem:
      '작은 작업까지 다 실으면 정작 중요한 작업이 묻히고, 몇 개만 고르면 한 일을 다 보여줄 수 없었다. 보는 사람은 대부분 위의 몇 개만 읽는다.',
    points: [
      {
        title: '다 싣고 순서로 말하기',
        body: '사례마다 화면에 보이지 않는 레벨(1~3)을 매기고, 결과를 레벨 → 최신순으로 정렬한다. 레벨 기준은 코드 주석에 적어 두었다.',
      },
      {
        title: '검색 상태는 주소에',
        body: '검색어와 탭을 #/search?q=…&tab=… 에 담아, 결과를 링크로 공유하고 뒤로가기로 돌아올 수 있다.',
      },
      {
        title: '필요할 때 받기',
        body: 'Accio·마에스트로 같은 프로젝트와 이 상세 화면은 lazy 로 나눴다. 프로젝트가 늘어도 포트폴리오 첫 화면은 자기 코드만 받는다.',
      },
      {
        title: '코드는 저장소에서 그대로',
        body: '상세 화면의 코드는 따로 복사해 두지 않고 저장소 파일 원문을 불러와 줄 범위만 잘라 보여준다. 복사본이 원본과 달라질 일이 없다.',
      },
      {
        title: '키보드로도',
        body: "어디서든 '/' 를 누르면 검색창으로 가고, 자동완성은 화살표로 고른다.",
      },
    ],
    stack: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'motion', 'Vite'],
    code: [
      {
        label: 'rank.ts',
        path: 'Portfolio/frontend/src/portfolio/rank.ts',
        source: rankSource,
        note: '레벨 기준을 타입 옆에 적어 두어, 사례를 더할 때 같은 기준으로 매기게 했다. 같은 레벨·날짜면 안정 정렬이라 data.ts 에 적은 순서가 남는다.',
      },
      {
        label: 'App.tsx',
        path: 'Portfolio/frontend/src/App.tsx',
        source: appRoutes,
        lines: [7, 10],
        note: '프로젝트마다 lazy 한 줄 — 들어갈 때 그 프로젝트 코드만 받는다.',
      },
    ],
  },
  'maestro-wake': {
    problem:
      '마에스트로 백엔드는 Render 무료 서버에 있어서 15분 동안 요청이 없으면 잠들고, 다음 첫 요청에 1분쯤 걸린다. 처음 들어온 사람은 버튼을 눌러도 반응이 없어 고장 난 줄 알게 된다.',
    points: [
      {
        title: '들어오자마자 미리 깨우기',
        body: '마에스트로에 들어오면 /health 를 먼저 불러, 사용자가 일정을 고르는 동안 서버가 깨어나게 했다. 이미 깨우는 중이면 다시 보내지 않는다.',
      },
      {
        title: '늦을 때만 안내',
        body: '첫 응답 전에 요청이 2.5초를 넘기면 ‘서버를 깨우는 중’ 안내를 띄운다. 한 번 응답을 받은 뒤의 느린 요청은 서버가 잠든 게 아니라서 안내하지 않는다.',
      },
      {
        title: '화면 읽기 프로그램에도',
        body: '안내 영역은 role="status" 로 두어 화면 읽기 프로그램도 읽어 준다.',
      },
    ],
    stack: ['React', 'TypeScript'],
    code: [
      {
        label: 'api.ts',
        path: 'Portfolio/frontend/src/projects/maestro/api.ts',
        source: maestroApi,
        lines: [15, 73],
        note: "서버 상태를 'unknown → waking → awake' 셋으로 두고, 첫 응답을 받으면 awake 로 굳힌다. 그 뒤로는 타이머를 걸지 않는다.",
      },
      {
        label: 'components.tsx',
        path: 'Portfolio/frontend/src/projects/maestro/components.tsx',
        source: maestroComponents,
        lines: [20, 33],
        note: '안내 문구가 없을 때도 role="status" 영역은 남겨 두어, 문구가 생기는 순간 읽힌다.',
      },
    ],
  },
  'accio-v1': {
    problem:
      'Accio 팀 프로젝트(v1)는 서버와 데이터 서버가 닫혀 더 이상 들어가 볼 수 없었다. 다시 만든 버전만 보여주면 팀 프로젝트 당시의 실제 결과물을 확인할 방법이 없었다.',
    points: [
      {
        title: '원본의 목 모드로 빌드',
        body: '원본 프론트에 들어 있던 목 모드로 빌드해, 서버 없이도 화면이 돈다.',
      },
      {
        title: '하위 경로에 붙이기',
        body: 'base 를 /accio-v1/ 로 빌드해 포트폴리오 public 아래에 두고, Accio 사례에서 새 탭으로 연다.',
      },
      {
        title: '비밀값은 저장소 밖에',
        body: '원본 소스는 백엔드·.env 가 섞여 있어 git 에서 빼고 빌드 결과만 커밋했다. 다시 빌드하는 순서는 README 에 남겼다.',
      },
      {
        title: 'Git Bash 경로 변환 함정',
        body: 'Git Bash 가 /accio-v1/ 을 윈도 경로로 바꿔 버려서 MSYS_NO_PATHCONV=1 을 붙여 빌드한다.',
      },
    ],
    stack: ['Vite', 'React'],
    code: [
      {
        label: 'README.md',
        path: 'Portfolio/frontend/README.md',
        source: frontendReadme,
        lines: [3, 18],
        note: 'git 이 원본 소스를 보지 않으니, 빌드 결과가 바뀌어야 커밋할 게 생긴다는 점까지 순서로 적어 두었다.',
      },
    ],
  },
  'planforme-activity-state': {
    problem:
      'PlanForMe 는 플랜을 3단계(유형 → 조건 → 계산 결과)로 만든다. 플랜을 등록해 홈으로 간 뒤 다시 +를 누르면 1단계가 아니라 방금 등록한 플랜의 3단계 화면이 그대로 나왔고, 등록 버튼은 회색으로 막혀 있었다. 오류 메시지도 없어 원인이 보이지 않았다.',
    points: [
      {
        title: '원인은 화면 보관',
        body: 'Next.js 16 은 Cache Components 가 켜져 있으면 떠난 화면을 지우지 않고 React <Activity> 로 숨겨 둔다(최대 3개). step = 3, saving = true 같은 상태가 그대로 남아 있다가 다시 보였다.',
      },
      {
        title: '상태마다 유지·초기화 정하기',
        body: '‘화면을 떠나면 상태가 사라진다’는 가정을 버렸다. 쓰던 폼은 남기고, 끝난 폼과 열린 시트는 비우는 것으로 상태마다 정했다.',
      },
      {
        title: '끝났을 때는 이벤트에서 직접',
        body: '등록 성공과 X 닫기 핸들러에서 reset() 으로 단계와 폼을 비운다. 뒤로가기로 잠깐 나갔다 오면 쓰던 내용은 그대로 남는다. Next.js 공식 가이드(Preserving UI state)가 권하는 방식이다.',
      },
      {
        title: '바텀시트는 숨겨질 때 닫기',
        body: '진행량 입력·재계산 시트는 useLayoutEffect 정리 함수에서 닫는다. 화면이 숨겨질 때 정리 함수가 실행돼, 돌아왔을 때 시트가 열린 채로 남지 않는다.',
      },
    ],
    result: '등록하거나 닫은 뒤에는 항상 1단계부터 시작하고, 작성 중 잠깐 나갔다 온 내용은 그대로 남는다.',
    stack: ['Next.js 16', 'React 19', 'TypeScript'],
    code: [
      {
        label: 'page.tsx',
        path: 'web/src/app/new/page.tsx',
        repo: PLANFORME_REPO,
        source: pfmNewPlan,
        lines: [96, 107],
        note: '초기화는 렌더나 effect 가 아니라 ‘끝났다’는 이벤트(등록 성공·닫기)에서만 한다. 그래서 뒤로가기로 나갔다 온 경우에는 폼이 남는다.',
      },
      {
        label: 'TaskActions.tsx',
        path: 'web/src/components/TaskActions.tsx',
        repo: PLANFORME_REPO,
        source: pfmTaskActions,
        lines: [17, 30],
        note: '화면이 Activity 로 숨겨질 때도 정리 함수는 실행된다. 열려 있던 시트 상태를 여기서 비운다.',
      },
    ],
  },
  'planforme-stale-response': {
    problem:
      '캘린더에서 다른 날짜를 누르면 새 데이터가 오기 전까지 이전 날짜의 할 일이 그대로 보였다. 잠깐이지만 17일 제목 아래에 16일의 할 일이 떠, 틀린 정보를 보여주는 셈이었다.',
    points: [
      {
        title: '무엇에 대한 결과인지 함께 저장',
        body: '공통 데이터 훅 useApi 가 마지막 응답만 기억하던 것을, 요청 key(예: tasks-2026-10-17)와 함께 저장하도록 바꿨다.',
      },
      {
        title: 'key 가 다르면 없는 데이터로',
        body: '지금 key 와 저장된 key 가 다르면 data 를 null 로 보고 로딩 스켈레톤을 보여준다. 늦게 도착한 이전 요청의 응답은 취소 플래그로 버린다.',
      },
      {
        title: '새로고침은 데이터를 유지',
        body: '같은 key 로 다시 불러오는 reload() 는 기존 목록을 보여 준 채 새로 고친다. 할 일을 체크할 때마다 목록이 깜빡이지 않는다.',
      },
    ],
    result: '날짜를 바꾸면 바로 스켈레톤이 뜨고, 그 날짜의 할 일만 보인다.',
    stack: ['Next.js 16', 'React 19', 'TypeScript'],
    code: [
      {
        label: 'api.ts',
        path: 'web/src/lib/api.ts',
        repo: PLANFORME_REPO,
        source: pfmApi,
        lines: [81, 118],
        note: 'fresh = result.key === key 한 줄이 핵심이다. 저장된 결과가 지금 요청의 것이 아니면 data 를 보여주지 않는다.',
      },
      {
        label: 'calendar/page.tsx',
        path: 'web/src/app/(tabs)/calendar/page.tsx',
        repo: PLANFORME_REPO,
        source: pfmCalendar,
        lines: [44, 50],
        note: '화면은 key 만 정해 주면 된다. 날짜가 key 에 들어 있어 날짜를 바꾸면 알아서 다시 불러온다.',
      },
    ],
  },

  // ── Back ───────────────────────────────────────────────────────────────
  'maestro-quota': {
    problem:
      '해커톤에서 쓸 수 있는 헤이유미 요청은 하루 70번이었다. 끼니마다 상황 6개(더부룩함·비·기분·웨이팅·예산·피로)의 대안을 상황별로 검색하면 끼니 하나에 6번, 세 끼 일정이면 18번이 나가 일정 몇 개만 만들어도 한도가 끝난다.',
    points: [
      {
        title: '끼니마다 검색은 한 번',
        body: '그 시각에 여는 곳을 추천순으로 반경 1km, 최대 100곳까지 한 번에 받는다. 요금이 요청 단위라 많이 받아도 값이 같다.',
      },
      {
        title: '상황 조건은 서버에서 판정',
        body: '상황마다 유미 필터 이름 그대로 조건을 적고, 받은 매장 데이터로 직접 맞는지 본다. 가격처럼 유미에 필터가 없는 조건은 함수(accept)로 따로 적었다.',
      },
      {
        title: '끼니는 동시에',
        body: '끼니별 계산을 asyncio.gather 로 함께 돌려, 끼니가 늘어도 기다리는 시간은 가장 느린 끼니 하나만큼이다.',
      },
      {
        title: '만든 결과는 다시 부르지 않기',
        body: '프론트는 받은 악보를 브라우저에 저장해, 새로고침해도 유미를 다시 부르지 않는다.',
      },
    ],
    result: '유미 요청 수가 상황 수와 상관없이 끼니마다 검색 1번(+ 처음 보는 동네 1번)으로 고정됐다.',
    stack: ['Python', 'FastAPI', 'asyncio', 'Pydantic', 'pytest'],
    code: [
      {
        label: 'service.py',
        path: 'Portfolio/backend/maestro/app/score/service.py',
        source: scoreService,
        lines: [87, 148],
        note: '_search 는 끼니마다 한 번만 부르고, 그 결과(places)를 상황 6개가 나눠 쓴다. 끼니들은 build_score 에서 gather 로 동시에 계산한다.',
      },
      {
        label: 'situations.py',
        path: 'Portfolio/backend/maestro/app/situations.py',
        source: situations,
        lines: [67, 86],
        note: '상황 하나 = 필터 + 반경 + 추가 조건. 카페 시간대에는 카페 안에서 대안을 찾도록 조건을 바꾼다.',
      },
    ],
  },
  'maestro-mock-real': {
    problem:
      '키를 받기 전에는 실제 API 로 개발을 시작할 수 없었고, 하루 한도가 작아 개발·테스트에 실제 API 를 쓰기도 아까웠다. 발표 도중 한도를 다 쓰거나 API 가 멈추면 시연이 끊길 위험도 있었다.',
    points: [
      {
        title: '인터페이스 하나, 구현 둘',
        body: 'YumiClient 를 Protocol 로 정의하고, mock(fixtures JSON)과 real(HTTP)이 같은 메서드를 갖추게 했다. 라우터·서비스는 인터페이스만 보고 짜서, 바꿔 끼워도 고칠 곳이 없다.',
      },
      {
        title: 'YUMI_MODE 하나로 전환',
        body: 'FastAPI Depends 로 클라이언트를 주입하고 설정값 하나로 mock ↔ real 을 고른다. 공개 사이트는 mock 으로 두어 유미를 한 번도 부르지 않는다.',
      },
      {
        title: 'mock 도 진짜처럼',
        body: '을지로·성수 가상 매장 29곳으로 거리·필터·추천순까지 흉내 내서, 키 없이도 화면을 끝까지 만들 수 있었다.',
      },
      {
        title: '테스트도 같은 구조로',
        body: '테스트는 응답이 0.2초 만에 오는 mock 을 dependency_overrides 로 끼워, 실제 네트워크 없이 돈다.',
      },
    ],
    result: '키가 없을 때도, 한도를 다 썼을 때도 환경변수 하나만 바꾸면 서비스가 계속 돈다.',
    stack: ['Python', 'FastAPI', 'Pydantic Settings', 'pytest'],
    code: [
      {
        label: 'client.py',
        path: 'Portfolio/backend/maestro/app/yumi/client.py',
        source: yumiClient,
        lines: [54, 92],
        note: 'mock 과 real 이 갖춰야 할 기능만 적은 Protocol. 상속 없이 메서드 모양만 맞으면 된다.',
      },
      {
        label: 'deps.py',
        path: 'Portfolio/backend/maestro/app/yumi/deps.py',
        source: yumiDeps,
        note: '라우터는 get_yumi_client 만 Depends 로 받는다. 캐시·문의 기록을 요청 사이에 이어 쓰려고 클라이언트는 lru_cache 로 하나만 만든다.',
      },
      {
        label: 'conftest.py',
        path: 'Portfolio/backend/maestro/tests/conftest.py',
        source: testConftest,
        note: '같은 의존성 자리에 빠른 mock 을 끼워 넣는 것만으로 테스트가 외부 API 와 떨어진다.',
      },
    ],
  },
  'maestro-owner-sim': {
    problem:
      '헤이유미의 실시간 문의(“지금 웨이팅 얼마나 돼요?”)와 예약은 실제 가게 사장님 앱으로 푸시가 간다. 검색은 real 로 확인해야 했지만, 이 기능까지 real 로 돌리면 개발하고 발표하는 동안 실제 가게에 가짜 문의가 쌓인다.',
    points: [
      {
        title: '검색은 진짜, 사장님께 가는 기능은 흉내',
        body: 'real 클라이언트 안에 시뮬레이터를 하나 두고 문의·예약 메서드만 그쪽으로 넘겼다. 실제 매장 id 가 들어와도 받도록 accept_any_place 옵션을 더했다.',
      },
      {
        title: '흉내라는 걸 숨기지 않기',
        body: '응답에 simulated=True 를 붙여, 프론트가 체험용 답이라는 걸 알 수 있게 했다.',
      },
      {
        title: '답을 기다리는 롱폴링',
        body: '문의 결과는 wait 초 동안 답을 기다렸다가 돌려준다. 답이 몇 초 뒤에 오는 것처럼 만들어 대기 → 답변 흐름을 그대로 체험할 수 있다.',
      },
      {
        title: '같은 질문은 다시 묻지 않기',
        body: '같은 매장·주제에 이미 받은 답이 있으면 새로 묻지 않고, 재사용 표시(reused)와 함께 그 답을 돌려준다.',
      },
    ],
    result: '실제 가게에는 아무것도 보내지 않으면서, 문의 → 대기 → 답변 흐름을 시연에서 그대로 보여줄 수 있었다.',
    stack: ['Python', 'FastAPI', 'asyncio'],
    code: [
      {
        label: 'real.py',
        path: 'Portfolio/backend/maestro/app/yumi/real.py',
        source: yumiReal,
        lines: [143, 161],
        note: 'real 클라이언트에서도 사장님께 가는 네 메서드는 HTTP 를 보내지 않고 시뮬레이터(self._owner)로 넘긴다.',
      },
      {
        label: 'mock.py',
        path: 'Portfolio/backend/maestro/app/yumi/mock.py',
        source: yumiMock,
        lines: [100, 150],
        note: '답이 올 때까지 최대 wait 초만 잠들었다가 돌려주는 롱폴링. 이미 답을 받은 같은 질문은 다시 만들지 않는다.',
      },
    ],
  },
  'maestro-api-resilience': {
    problem:
      '헤이유미 API 를 실제로 불러 보니 추천순 검색은 10초를 넘기기도 했고, 요청마다 남은 한도가 1씩 줄었다. 악보 하나를 만들 때 검색이 여러 개 동시에 나가는데, 실패를 그대로 두면 사용자는 이유 모를 오류만 보게 된다.',
    points: [
      {
        title: '실측으로 정한 타임아웃',
        body: '느린 검색에 맞춰 타임아웃을 20초로 잡고, 시간 초과는 한 번만 더 시도한 뒤 504 로 알린다.',
      },
      {
        title: '429 는 기다릴 만할 때만',
        body: 'Retry-After 가 5초 이하면 기다렸다 한 번 더 보내고, 몇 시간짜리(하루 한도 소진)면 기다리지 않고 바로 알린다.',
      },
      {
        title: '캐시와 동시 요청 제한',
        body: '같은 경로·파라미터 요청은 10분 동안 캐시해 한도를 아끼고, 세마포어로 동시에 나가는 요청을 4개로 묶었다.',
      },
      {
        title: '키는 헤더로, 이상한 데이터는 건너뛰기',
        body: 'API 키는 주소가 아니라 Authorization 헤더에 실어 로그에 남지 않게 했다. 모양이 다른 매장 하나 때문에 검색 전체가 실패하지 않도록 그 매장만 건너뛴다.',
      },
      {
        title: '오류를 안내 문구로',
        body: '유미·서비스 예외를 {code, message} 한 모양으로 바꿔, 프론트가 코드별로 안내를 띄운다.',
      },
    ],
    stack: ['Python', 'httpx', 'asyncio', 'FastAPI'],
    code: [
      {
        label: 'real.py',
        path: 'Portfolio/backend/maestro/app/yumi/real.py',
        source: yumiReal,
        lines: [54, 115],
        note: '캐시 확인 → 세마포어 안에서 전송 → 429 면 짧을 때만 재시도 → 결과 캐시. 실패는 모두 YumiError 하나로 모은다.',
      },
      {
        label: 'errors.py',
        path: 'Portfolio/backend/maestro/app/core/errors.py',
        source: errorHandlers,
        note: '예외 종류마다 상태 코드와 사람이 읽을 문구를 정해, 응답 모양을 {"detail": {"code", "message"}} 하나로 맞췄다.',
      },
    ],
  },
  'maestro-trust-rank': {
    problem:
      '유미 데이터에는 매장마다 폐업 신호, 교차검증 신뢰도(confidence), 정보 최근성(freshness)이 있다. 추천 순서를 그대로 쓰면 폐업이 의심되거나 정보가 오래된 매장이 대안 맨 위에 올라올 수 있었다.',
    points: [
      {
        title: '폐업 신호는 빼기',
        body: '폐업 가능성 표시나 폐업 신호가 있으면 메인·대안 어디에도 넣지 않는다.',
      },
      {
        title: '의심스러운 곳은 빼지 말고 뒤로',
        body: '신뢰도 0.6, 최근성 0.5보다 낮으면 뒤로 미룬다. 빼 버리면 상황에 맞는 후보가 모자랄 수 있어서다.',
      },
      {
        title: '원래 순서는 지키기',
        body: '의심 점수로만 정렬해, 같은 점수끼리는 유미 추천 순서가 그대로 남는다(안정 정렬).',
      },
    ],
    stack: ['Python'],
    code: [
      {
        label: 'service.py',
        path: 'Portfolio/backend/maestro/app/score/service.py',
        source: scoreService,
        lines: [31, 53],
        note: '의심 점수는 기준 미달 항목 수(0~2). sorted 가 안정 정렬이라 점수가 같으면 API 순서가 유지된다.',
      },
    ],
  },
  'free-tier-infra': {
    problem:
      '포트폴리오의 데모는 무료 플랜 위에서 돈다. Render 무료 서버는 15분 동안 요청이 없으면 잠들고, Supabase 무료 DB 는 1주일 동안 쓰지 않으면 일시정지된다. 보는 사람이 언제 들어올지 모르니 그대로 두면 데모가 멈춰 있을 수 있다.',
    points: [
      {
        title: '배포를 코드로',
        body: 'Render 블루프린트에 서버 설정을 남겨, 그 백엔드 폴더(rootDir)가 바뀔 때만 다시 배포한다. 키 같은 비밀값은 저장소에 두지 않고 대시보드에서 받는다.',
      },
      {
        title: '공개 사이트는 mock 으로',
        body: '공개 배포는 YUMI_MODE=mock 으로 두어 유미 한도를 쓰지 않고, 확인할 때만 real 로 바꾼다.',
      },
      {
        title: 'DB 는 사흘마다 깨우기',
        body: 'GitHub Actions 크론이 사흘마다 Accio 백엔드의 /health/db 를 불러 DB 에 SELECT 1 을 보낸다. 잠든 서버가 깨는 시간을 생각해 120초까지 기다리고 두 번 더 시도한다.',
      },
      {
        title: '준비 전에는 조용히 건너뛰기',
        body: '주소 변수가 없으면 실패하지 않고 건너뛰어, 백엔드를 배포하기 전에도 워크플로가 빨간불을 띄우지 않는다.',
      },
    ],
    result: '마에스트로 서버는 이 블루프린트로 배포했다. DB 깨우기는 Accio 백엔드를 배포하면 바로 켜지도록 준비해 두었다.',
    stack: ['Render', 'GitHub Actions', 'Supabase', 'FastAPI', 'SQLAlchemy'],
    code: [
      {
        label: 'render.yaml',
        path: 'render.yaml',
        source: renderBlueprint,
        note: 'rootDir 로 백엔드 폴더를 나눠, 다른 폴더가 바뀌어도 이 서버는 다시 배포하지 않는다.',
      },
      {
        label: 'keep-supabase-awake.yml',
        path: '.github/workflows/keep-supabase-awake.yml',
        source: keepAwakeWorkflow,
        note: '잠든 서버가 깨는 시간까지 계산해 --max-time 120, --retry 2 를 걸었다.',
      },
      {
        label: 'router.py',
        path: 'Portfolio/backend/accio/app/health/router.py',
        source: accioHealth,
        lines: [27, 38],
        note: '서버만 확인하는 /health 와 DB 까지 확인하는 /health/db 를 나눴다. DB 가 안 되면 503 으로 알린다.',
      },
    ],
  },
  'planforme-replan-overdue': {
    problem:
      'PlanForMe 의 핵심은 할 일을 덜 하거나 더 했을 때 남은 분량을 남은 날짜로 다시 나누는 재계산(Re-plan)이다. 그런데 진행량을 적게 입력하고 “네, 다시 계산해 주세요”를 눌러도 홈의 “밀린 분량이 있어요” 배너가 사라지지 않았다. 다시 나눠 놓고도 여전히 밀렸다고 말하는 셈이었다.',
    points: [
      {
        title: '원인은 지우지 않는 기록',
        body: '‘밀림’을 오늘 이전 + 미완료인 할 일로 셌다. 재계산은 남은 분량만 다시 나누고 지난 기록은 그대로 두는데(기획 의도), 그 기록이 영원히 밀림으로 남았다.',
      },
      {
        title: '기록 대신 기준 시점을 저장',
        body: '플랜에 마지막 재계산 시작일(rebased_on)을 두고, 그날 이후의 미완료만 밀림으로 센다. 지난 기록은 지우지 않아 플랜 상세의 수행 기록에는 ‘미완료’로 그대로 남는다.',
      },
      {
        title: '어디서부터 다시 나눌지',
        body: '오늘 할 일을 이미 끝냈으면 내일부터, 아니면 오늘부터 다시 나눈다. 그 뒤 날짜 중 이미 끝낸 날은 남은 유효 일수에서 뺀다.',
      },
      {
        title: '회귀 테스트로 고정',
        body: '사흘 전 시작한 강의 플랜이 밀림에 있다가 재계산 후 빠지는지 API 로 확인하는 테스트를 더했다.',
      },
    ],
    result: '재계산을 누르면 배너가 바로 사라지고, 지난 기록은 지워지지 않고 남는다.',
    stack: ['Python', 'FastAPI', 'SQLAlchemy 2', 'pytest'],
    code: [
      {
        label: 'services.py',
        path: 'api/services.py',
        repo: PLANFORME_REPO,
        source: pfmServices,
        lines: [280, 294],
        note: 'or_(rebased_on 이 없거나, 그 날 이후) 조건 하나로 재계산 이전 기록을 밀림에서 뺀다. 기록은 그대로 둔다.',
      },
      {
        label: 'services.py · 재계산',
        path: 'api/services.py',
        repo: PLANFORME_REPO,
        source: pfmServices,
        lines: [195, 231],
        note: '재계산할 때 rebased_on 을 시작일로 옮기고, 그날부터의 미완료 할 일만 지운 뒤 다시 만든다. 완료한 기록과 시작일 이전 기록은 건드리지 않는다.',
      },
      {
        label: 'test_api.py',
        path: 'api/tests/test_api.py',
        repo: PLANFORME_REPO,
        source: pfmTestApi,
        lines: [95, 114],
        note: '밀림에 있음 → 재계산 → 밀림에서 빠짐. 버그가 다시 생기면 이 테스트가 먼저 깨진다.',
      },
    ],
  },
  'planforme-quota-logic': {
    problem:
      '총분량과 마감일만 넣으면 하루 할당량을 계산해 주는 게 PlanForMe 의 핵심이다. 하루 3.4강은 들을 수 없으니 올림해야 하고, 쉬는 요일은 빼야 하고, 강의가 하루 180분을 넘으면 종료일을 늘리라고 안내해야 한다. 이 규칙이 화면이나 DB 코드에 섞이면 어디서 틀렸는지 찾기 어렵다.',
    points: [
      {
        title: '규칙은 디자인 단계에서 먼저',
        body: '피그마에 계산 로직 페이지를 따로 두고 유효 일수 D, 책·강의·일반 공식, 재계산 공식을 예시와 함께 적었다.',
      },
      {
        title: 'DB 없는 순수 함수로',
        body: 'planner.py 에는 날짜와 숫자만 받는 함수만 둔다. 미리보기·플랜 생성·재계산이 모두 이 함수를 불러, 같은 규칙이 두 군데에 생기지 않는다.',
      },
      {
        title: '나머지는 마지막 날에 적게',
        body: '올림(총량 ÷ D)씩 앞에서부터 나누고 남는 만큼만 마지막 날에 둔다. 100p 를 3일이면 34/34/32 이고, 0이 배정된 날은 할 일을 만들지 않는다.',
      },
      {
        title: '디자인 예시가 곧 테스트',
        body: '피그마에 적은 예시(평일 10일 → D=10, 100p/3일 → 34/34/32, 45강·15일 → 하루 3강, 남은 215p/8일 → 27p)를 그대로 pytest 로 옮겼다.',
      },
    ],
    result: '기획서에 적은 계산 예시가 테스트로 계속 확인되고, 화면은 같은 함수의 결과만 보여준다.',
    stack: ['Python', 'pytest', 'FastAPI'],
    code: [
      {
        label: 'planner.py',
        path: 'api/planner.py',
        repo: PLANFORME_REPO,
        source: pfmPlanner,
        lines: [10, 73],
        note: 'DB·FastAPI 를 import 하지 않는다. 과부하일 때는 종료일을 한 주씩 늘려 보며 하루 180분 아래가 되는 주 수를 찾는다.',
      },
      {
        label: 'test_planner.py',
        path: 'api/tests/test_planner.py',
        repo: PLANFORME_REPO,
        source: pfmTestPlanner,
        note: '테스트 주석이 곧 피그마 계산 로직 카드의 예시다. 기획과 코드가 어긋나면 여기서 드러난다.',
      },
    ],
  },
  'planforme-api-key': {
    problem:
      'PlanForMe 는 혼자 쓰는 앱이라 로그인 대신 API 키와 앱 비밀번호로 잠갔다. 그런데 배포한 뒤 api 주소의 /today 를 브라우저에서 열었더니 키 없이도 할 일 데이터가 나왔다.',
    points: [
      {
        title: '“설정이 없으면 통과”의 함정',
        body: '로컬 개발을 편하게 하려고 API_KEY 환경 변수가 없으면 검사를 건너뛰게 짰다. 배포된 api 가 이 변수를 읽지 못하자 조용히 전부 열렸다. 변수를 Production 까지 적용하고 다시 배포해 막았다.',
      },
      {
        title: '키는 서버에서만 붙이기',
        body: '브라우저는 Next.js 의 /api/* 로만 요청하고, 그 라우트 핸들러가 서버에서 X-API-Key 를 붙여 FastAPI 로 넘긴다. 키가 브라우저 코드에 들어가지 않는다.',
      },
      {
        title: '막혀야 할 요청이 막히는지',
        body: '배포 직후 키 없는 /today 는 401, 일부러 열어 둔 /health 는 200 인지 직접 열어 확인했다.',
      },
    ],
    result: '키 없는 요청은 “API 키가 올바르지 않아요”(401)로 막히고, 앱에서는 그대로 동작한다.',
    stack: ['FastAPI', 'Next.js 16', 'Vercel'],
    code: [
      {
        label: 'main.py',
        path: 'api/main.py',
        repo: PLANFORME_REPO,
        source: pfmMain,
        lines: [18, 43],
        note: '키 검사는 라우터마다 Depends 로 건다. /health 만 앱에 직접 달아 키 없이도 서버 상태를 볼 수 있게 했다.',
      },
      {
        label: 'route.ts',
        path: 'web/src/app/api/[...path]/route.ts',
        repo: PLANFORME_REPO,
        source: pfmProxyRoute,
        note: '브라우저 → Next.js → FastAPI. API_KEY 는 NEXT_PUBLIC_ 이 아닌 서버 변수라 브라우저로 내려가지 않는다.',
      },
    ],
  },
  'planforme-kst-today': {
    problem:
      'Vercel 서버는 UTC 로 돈다. date.today() 를 그대로 쓰면 한국 시간 오전 0시~9시에는 ‘오늘’이 하루 전 날짜가 되어, 아침에 앱을 열면 어제 할 일이 오늘 할 일로 보인다. 날짜가 전부인 플래너라 배포 전에 미리 막았다.',
    points: [
      {
        title: '백엔드의 오늘은 한 곳에서',
        body: '모든 ‘오늘’을 timeutil.py 의 today_kst() 로 구하고, Asia/Seoul 기준으로 계산한다. 시간대 데이터가 없는 Windows 에서도 돌도록 tzdata 를 함께 설치했다.',
      },
      {
        title: '프론트도 같은 기준',
        body: '브라우저의 오늘도 Intl.DateTimeFormat 에 timeZone: Asia/Seoul 을 줘서 구한다. 기기 시간대가 달라도 서버와 같은 날짜를 쓴다.',
      },
      {
        title: 'build 한 날짜가 박히지 않게',
        body: 'Next 16 은 build 때 클라이언트 컴포넌트도 미리 그려서, 렌더 중에 new Date() 를 쓰면 build 가 막힌다. useSyncExternalStore 의 서버용 값을 null 로 두어 오늘은 브라우저에서만 읽는다.',
      },
    ],
    result: '서버·브라우저 어디서 계산해도 ‘오늘’이 한국 날짜 하나로 맞는다.',
    stack: ['Python', 'zoneinfo', 'Next.js 16', 'React 19'],
    code: [
      {
        label: 'timeutil.py',
        path: 'api/timeutil.py',
        repo: PLANFORME_REPO,
        source: pfmTimeutil,
        note: '백엔드는 date.today() 를 쓰지 않고 이 두 함수만 쓴다.',
      },
      {
        label: 'format.ts',
        path: 'web/src/lib/format.ts',
        repo: PLANFORME_REPO,
        source: pfmFormat,
        lines: [11, 14],
        note: 'en-CA 형식이 YYYY-MM-DD 라 서버와 주고받는 날짜 문자열을 그대로 만든다.',
      },
      {
        label: 'useToday.ts',
        path: 'web/src/lib/useToday.ts',
        repo: PLANFORME_REPO,
        source: pfmUseToday,
        note: '세 번째 인자가 미리 그릴 때 쓰는 값이다. 캘린더·플랜 생성은 today 가 null 이면 아무것도 그리지 않고, 브라우저에서 날짜를 읽은 뒤 그린다.',
      },
    ],
  },
}
