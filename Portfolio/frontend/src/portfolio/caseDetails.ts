// Front·Back 사례 상세 — 문제 → 해결 포인트 → 결과 → 실제 코드. 목록 정보(제목·태그·레벨)는 data.ts 에 있다.
// 코드는 따로 복사해 두지 않고 저장소 파일을 원문(?raw)으로 불러와 줄 범위만 잘라 보여준다.
// 원본 파일을 고쳐 줄이 밀리면 여기 lines 도 같이 고친다.
// 이 파일은 상세 화면을 열 때만 받는다(PortfolioApp 의 lazy) — 코드 원문이 첫 화면 용량에 들어가지 않는다.

import accioCartPage from '../projects/accio/components/CartPage.tsx?raw'
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

export interface CodeSample {
  /** 탭 이름 — 보통 파일 이름 */
  label: string
  /** 저장소 루트 기준 경로. 코드 위 경로 표시와 GitHub 링크에 쓴다 */
  path: string
  /** 파일 원문 */
  source: string
  /** 보여줄 줄 범위(1부터, 양 끝 포함). 없으면 파일 전체 */
  lines?: [number, number]
  /** 이 코드에서 볼 점 — 코드 아래 '설계 의도' 칸 */
  note: string
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
        body: '장바구니의 선택 상품·합계·쿠폰까지 남은 금액은 따로 저장하지 않고 매번 계산한다. 수량을 바꾸거나 지워도 숫자가 어긋날 틈이 없다.',
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
        label: 'CartPage.tsx',
        path: 'Portfolio/frontend/src/projects/accio/components/CartPage.tsx',
        source: accioCartPage,
        lines: [118, 141],
        note: '상태는 담은 상품(items)과 선택(selected) 두 개뿐이고, 합계·쿠폰까지 남은 금액은 렌더할 때 계산한다.',
      },
    ],
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
}
