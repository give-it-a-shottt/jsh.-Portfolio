// Front·Back 사례 상세 — 사용 기술과 실제 코드, 팀 프로젝트 소개. 목록 정보(제목·태그·레벨)는 data.ts,
// 문제 → 해결 포인트 → 결과 글은 caseStories.ts 에 있다(검색이 본문까지 찾도록 첫 화면에서 받는다).
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
  stack: string[]
  code: CodeSample[]
  team?: TeamProject
}

export const CASE_DETAILS: Record<string, CaseDetail> = {
  // ── Front ──────────────────────────────────────────────────────────────
  maestro: {
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
