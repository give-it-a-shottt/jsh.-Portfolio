import type { StudyNote } from '../notes'

// Front 공부 노트 — 노션 학습노트 > 학습 폴더 > 프론트엔드, AI와 학습(화면 쪽)
export const FRONT_NOTES: StudyNote[] = [
  // ── React (같은 날짜는 위에 적은 순서대로 보이므로 최신 편부터) ──
  {
    slug: 'fe-router-cors-redux',
    area: 'Front',
    course: 'React',
    lesson: '5편',
    date: '2026.10.30',
    title: 'React Router · 레이지 로딩 · CORS 와 프록시 · Redux',
    summary: 'React Router 는 URL 과 화면을 맞추고, 중첩 라우트는 부모 안의 <Outlet /> 자리에 자식 화면을 끼운다. CORS 는 브라우저가 거는 제한이라 프록시로 피해 가고, Redux 는 지금 Redux Toolkit 으로 쓴다.',
    points: [
      'React Router v8 에서 react-router-dom 패키지가 없어졌다 — npm i react-router',
      '오리진은 같은 컴퓨터가 아니라 프로토콜 + 도메인 + 포트 — 5173 과 8000 은 다른 오리진',
      'CORS 에러가 나도 요청은 서버에 도착했고 응답도 나갔다 — 막은 건 브라우저',
    ],
    learned: [
      {
        title: '라우터',
        items: [
          'index 라우트는 부모 경로까지만 맞았을 때 <Outlet /> 에 넣을 기본 자식 — 없으면 그 자리가 빈다',
          '"어떤 대상인가"(강의 7번)는 경로 파라미터(useParams), "어떻게 보여 줄까"(정렬 · 필터)는 검색 파라미터(useSearchParams)',
          '레이지 로딩은 빌드를 덜 하는 게 아니라 페이지별 파일로 쪼개 두고, 들어가는 순간 그 파일만 내려받는 것',
        ],
      },
      {
        title: 'HTTP · CORS',
        items: [
          '프록시는 브라우저가 같은 오리진(5173)에만 요청하고, 개발 서버가 8000 에 대신 전달 — 서버끼리는 CORS 가 없다',
          'Vite server.proxy 는 개발 서버 전용 — 배포에서는 백엔드 CORS 허용이나 리버스 프록시가 따로 필요',
          'fetch 는 404 · 500 을 에러로 보지 않는다 — res.ok 를 직접 확인해야 하고, axios 는 바로 에러를 던진다',
        ],
      },
      {
        title: 'Redux',
        items: [
          '리듀서를 순수 함수로 뺀 이유 — 화면 없이 테스트하고, 액션을 다시 넣어 과거 시점을 재현(시간 여행)할 수 있어서',
          'Redux Toolkit 의 createSlice 가 액션 · 리듀서를 한 번에 만들고, 안의 immer 덕분에 고치듯 써도 불변 업데이트가 된다',
          'counter 액션만 보냈을 때 todos 는 이전과 같은 객체로 남았다 — 바뀐 영역만 새 객체',
        ],
      },
      {
        title: '막힌 것 · 바로잡은 것',
        items: [
          '"같은 컴퓨터면 같은 오리진 아닌가?" → 포트가 다르면 다른 오리진이다. 프록시로 온 요청은 서버 로그에 Origin 이 비어 있었다',
          'useLocation 으로 이동하려 했다 → 읽기 전용이고, 이동은 useNavigate 나 <Link> 로 한다',
          '해시 라우터면 404 가 안 난다 → 맞지만 URL · 검색 노출에서 손해라, 보통은 호스팅에 index.html 폴백을 설정한다',
          '책처럼 createStore 와 switch 리듀서를 손으로 짜는 방식은 Redux 팀이 더 이상 권하지 않는다 — thunk 도 따로 설치하지 않는다',
        ],
      },
    ],
    tags: ['프론트엔드', 'React', 'React Router', 'CORS', 'Redux'],
    keywords: 'react router v8 outlet index route useparams usesearchparams usenavigate uselocation navlink lazy suspense code splitting hash router fallback cors origin proxy vite server.proxy fetch axios res.ok redux toolkit createslice configurestore thunk saga generator reducer time travel',
  },
  {
    slug: 'fe-hooks-lifecycle-context',
    area: 'Front',
    course: 'React',
    lesson: '4편',
    date: '2026.10.30',
    title: '화면 단위 설계 · 함수 컴포넌트와 훅 · 생명주기 · Context',
    summary: '화면은 시안 → 상태와 액션 → 컴포넌트 분할 순서로 설계한다. Context 는 멀리 있는 자식에게 값을 바로 주는 통로일 뿐, 상태 관리 라이브러리는 아니다.',
    points: [
      '마운트 순서는 렌더링 → DOM 반영 → useLayoutEffect → 화면 그리기 → useEffect',
      '레이지 초기화는 비동기가 아니다 — 마운트 때 한 번만 부르는 것 (일반 초기화 4번, 레이지 1번 실행)',
      'state 는 다시 렌더링돼도 유지된다 — 초기화되는 건 일반 변수, ref 는 기억하지만 바꿔도 다시 그리지 않는다',
    ],
    learned: [
      {
        title: '설계',
        items: [
          'IA 의 화면 정보는 상태 후보, 유저플로우의 행동은 액션, 시안에서 반복되는 덩어리는 컴포넌트 후보가 된다',
          '따로 바뀌는 상태는 나누고, 항상 같이 바뀌는 상태(x, y)는 하나로 묶는다',
          'useReducer 의 Action 타입이 곧 유저플로우의 행동 목록 — 바꾸는 로직은 컴포넌트 밖 순수 함수에 모인다',
        ],
      },
      {
        title: '훅',
        items: [
          'useEffect 하나가 마운트 · 업데이트 · 언마운트를 맡는다 — 클린업은 언마운트 때와 다시 실행되기 직전에 돈다',
          '클린업을 빼면 컴포넌트가 사라져도 타이머가 계속 돌았다(메모리 누수)',
          'useMemo 는 결과값, useCallback 은 함수 자체를 캐싱 — 커스텀 훅은 로직을 나누는 것이지 상태를 나누는 게 아니다',
        ],
      },
      {
        title: 'Context',
        items: [
          'Provider 가 감싼 범위에만 값을 방송하고, 필요한 컴포넌트만 받아 쓴다',
          '값이 바뀌면 그 Context 를 쓰는 컴포넌트는 전부 다시 렌더링 — 테마 · 로그인 사용자처럼 가끔 바뀌는 값에 맞다',
          '자주 바뀌고 여러 곳에서 쓰는 값(장바구니)은 골라 구독할 수 있는 Zustand · Redux 쪽이 낫다',
        ],
      },
      {
        title: '막힌 것 · 바로잡은 것',
        items: [
          '"다시 렌더링되면 state 가 리셋된다"고 알았다 → 리셋되는 건 일반 변수였다. ref 2번 누른 뒤 state 를 누르니 ref=2, plain=0',
          '책의 마운트 순서는 useLayoutEffect 가 DOM 반영보다 앞이었다 → 실제로는 DOM 반영이 먼저라 useLayoutEffect 안에서 글자를 읽을 수 있었다',
          '"공통 로직은 커스텀 훅이면 되지 HOC 가 왜 필요하지?" → 훅은 컴포넌트 안에서 돌아서 렌더링 자체를 건너뛸 수는 없다. 그게 memo(HOC)의 몫',
          '클래스 컴포넌트를 고르는 기준은 익숙함이 아니다 — 지금은 레거시이고, 남은 쓰임은 에러 바운더리 정도',
        ],
      },
    ],
    tags: ['프론트엔드', 'React', '훅', 'Context'],
    keywords: 'react hooks usestate useeffect uselayouteffect usereducer useref usememo usecallback custom hook lazy initialization mount unmount cleanup lifecycle context provider use hoc memo class component error boundary thinking in react',
  },
  {
    slug: 'fe-state-immutability',
    area: 'Front',
    course: 'React',
    lesson: '3편',
    date: '2026.10.30',
    title: '상태와 불변성 · 스타일링 · 이벤트 · 폼 입력',
    summary: '상태는 그걸 쓰는 컴포넌트들의 가장 가까운 공통 부모에 두고, 직접 고치지 않는다. 바뀐 값까지 가는 길에 있는 객체만 새로 만들어야 React 가 주소 비교 한 번으로 변화를 알아차린다.',
    points: [
      'push 후 같은 배열로 setState 하면 화면이 안 바뀌다가, 다른 버튼을 누르자 숨어 있던 값이 한꺼번에 나왔다 (A → A,X,X,O)',
      'React 19 에서 함수 컴포넌트의 PropTypes 검사가 없어졌다 — props 타입은 TypeScript, 외부 데이터는 zod',
      '제어 · 비제어는 "입력 도중에 그 값이 필요한가"로 고른다',
    ],
    learned: [
      {
        title: '상태와 불변성',
        items: [
          '다른 값으로 계산할 수 있는 값은 state 로 두지 않는다 — 따로 두면 둘이 어긋난다',
          'React 는 안을 다 열어 보는 깊은 비교 대신 주소만 보는 얕은 비교를 한다',
          '경로 복사: 바뀐 값을 감싼 객체들만 새로 만들고 나머지는 공유 — 깊은 복사는 안 바뀐 곳까지 주소가 바뀌어 memo 가 무의미해진다',
        ],
      },
      {
        title: '스타일링 · 이벤트',
        items: [
          'CSS 모듈은 클래스 이름에 고유값을 붙여 충돌을 막는다(.title → _title_nc2zs_2) — Tailwind 와는 다른 방식',
          'onClick={handle()} 은 그리는 순간 실행된다 — 함수를 넘기거나 () => handle(id) 로 감싼다',
          '<MyButton onClick> 은 이벤트가 아니라 이름이 onClick 인 prop — 안쪽 <button> 에 넘겨야 동작했다',
        ],
      },
      {
        title: '막힌 것 · 바로잡은 것',
        items: [
          '"경로를 루트로 거슬러 올라가며 새로 만든다"가 헷갈렸다 → 새로 만들어지는 객체를 설명한 말이고, 코드는 위에서 아래로 쓴다',
          '"이벤트 아규먼트"를 useState 의 첫 인자로 알았다 → 이벤트 핸들러가 받는 첫 인자 e 다',
          '컨테이너 / 표현 컴포넌트는 소개한 사람도 2019년에 더 이상 권하지 않는다 — 로직은 커스텀 훅으로 뺀다',
          '책은 "비제어는 꼭 필요할 때만"이라 했지만, 비제어는 글자마다 다시 그리지 않아 오히려 빠르다 — React 19 form action 이 FormData 를 바로 넘겨준다',
        ],
      },
    ],
    tags: ['프론트엔드', 'React', '불변성', '폼'],
    keywords: 'react state immutability shallow compare object.is structural sharing immer spread props mutation css modules tailwind sass styled-components proptypes defaultprops zod synthetic event controlled uncontrolled form action formdata container presentational custom hook',
  },
  {
    slug: 'fe-es6-typescript-jsx',
    area: 'Front',
    course: 'React',
    lesson: '2편',
    date: '2026.10.30',
    title: 'ES6+ · TypeScript 기초와 JSX · props · 리스트 렌더링',
    summary: 'React 코드는 ES6+ 문법과 TypeScript 타입 위에서 쓴다. JSX 의 {} 에는 표현식만 들어가고 문자열은 자동으로 이스케이프된다. 목록은 항목 컴포넌트로 쪼개고 바뀌지 않는 key 를 준다.',
    points: [
      'async/await 는 Promise 를 대체한 게 아니라 Promise 위에 올린 문법 — 동시에 기다리려면 Promise.all',
      'enum 대신 리터럴 유니언 — Vite 8 react-ts 템플릿은 enum 을 막는다',
      '쪼개기만 해서는 렌더링이 줄지 않는다 — memo 없이 9번, memo 를 붙이니 3번',
    ],
    learned: [
      {
        title: 'ES6+ · TypeScript',
        items: [
          '화살표 함수는 자기 this 가 없다 — JS 클래스 메서드를 떼어 부르면 this 가 사라지는 게 파이썬 self 와 다른 점',
          'type 은 유니언 · 별칭, interface 는 선언 병합 · extends — 프로젝트 안에서 한 규칙으로 통일하는 게 먼저',
          '절대 경로 @/ 는 tsconfig paths 와 vite.config 두 곳 다 설정해야 한다 — 하나만 하면 에디터나 실행 중 한쪽이 깨진다',
        ],
      },
      {
        title: 'JSX · 렌더링',
        items: [
          '{} 안의 문자열은 이스케이프돼서 <img onerror> 같은 코드가 글자로 찍힌다 — dangerouslySetInnerHTML 만 예외',
          'key 는 형제 사이에서 고유하고 바뀌지 않는 값 — 순서가 바뀌는 목록에 index 를 쓰면 입력값이 엉뚱한 줄에 남는다',
          '렌더링은 컴포넌트 함수를 불러 화면 모양을 계산하는 것, 실제 DOM 을 바꾸는 건 그다음 커밋',
        ],
      },
      {
        title: '막힌 것 · 바로잡은 것',
        items: [
          '"요즘은 Promise 안 쓰고 async/await 만 쓴다"고 알았다 → async 함수는 항상 Promise 를 돌려준다',
          '인터섹션 & 를 합집합처럼 느꼈다 → 속성은 합쳐지지만 값의 범위로는 교집합이라 이름이 그렇다',
          '책의 "세분화하면 렌더링 최적화"는 저절로 되지 않는다 — 부모가 다시 그려지면 자식은 props 가 같아도 다시 그려진다',
          '{count && ...} 는 count 가 0 이면 화면에 0 이 찍힌다 → count > 0 && 로 쓴다',
        ],
      },
    ],
    tags: ['프론트엔드', 'React', 'TypeScript', 'JavaScript'],
    keywords: 'es6 es2015 destructuring spread rest arrow function this promise async await promise.all class typescript type interface generic union intersection enum erasablesyntaxonly unknown any literal union path alias tsconfig paths jsx escape xss fragment props key memo rerender commit',
  },
  {
    slug: 'fe-react-modules-bundling',
    area: 'Front',
    course: 'React',
    lesson: '1편',
    date: '2026.10.30',
    title: 'React 시작하기 — 단방향 흐름 · 모듈 · 번들링 · 호이스팅',
    summary: 'React 는 상태가 바뀌면 화면을 다시 그리고, 데이터는 부모 → 자식 한 방향으로만 흐른다. 컴포넌트가 늘면 파일(모듈)로 쪼개고, 번들러가 import 관계를 따라가 몇 개 파일로 묶는다.',
    points: [
      '가상 DOM 이라서 무조건 빠른 건 아니다 — 비교하는 것도 비용이고, 장점은 선언형으로 써도 충분히 빠르다는 것',
      'Vite · Next.js 는 번들러가 아니라 번들러를 품은 도구 (Vite 8 은 Rolldown, Next.js 16 은 Turbopack)',
      '호이스팅은 코드를 옮기는 게 아니라 실행 전에 선언을 먼저 등록하는 것 — let · const 도 등록되지만 TDZ 에 걸린다',
    ],
    learned: [
      {
        title: '모듈 · 번들링',
        items: [
          '번들러가 하는 일 — 합치기 · 안 쓰는 export 빼기(트리 셰이킹) · JSX/TS 변환 · 압축과 파일명 해시',
          '파일 3개를 묶었더니 1개가 되고, 아무도 안 쓰는 unused 함수는 빠졌다',
          'import 는 파일 어디에 써도 먼저 처리된다 — 그래서 모듈 맨 위에 부작용 코드를 두지 않는다',
        ],
      },
      {
        title: 'npm · 도구',
        items: [
          '--save 는 npm 5 부터 기본값, 개발 도구는 -D, 전역 -g 대신 npx',
          'create-react-app 은 2025년 2월 지원이 끝났다 — npm create vite@latest 나 create-next-app',
          'lazy(() => import()) 한 줄로 About 이 별도 파일로 나뉘었다(코드 스플리팅)',
        ],
      },
      {
        title: '막힌 것 · 바로잡은 것',
        items: [
          '"번들링이 뭘 묶는다는 거지?" → 내가 쪼갠 JS · CSS 파일과 node_modules 의 라이브러리를 의존성 순서대로 묶는다',
          '"호이스팅 = 선언을 맨 위로 옮기는 것"은 비유일 뿐 — 엔진은 코드를 옮기지 않고, 공식 단계 이름도 아니다',
          'var 는 중복 선언이 되고 let 은 안 된다 → let 중복은 파싱 단계 SyntaxError 라 첫 줄조차 실행되지 않았다',
          '책의 "단방향 데이터 바인딩"은 공식 문서에서 "단방향 데이터 흐름"이라고 부른다',
        ],
      },
    ],
    tags: ['프론트엔드', 'React', '번들링', 'JavaScript'],
    keywords: 'react one-way data flow virtual dom reconciliation module dependency bundler bundling webpack rollup rolldown esbuild turbopack vite next.js tree shaking code splitting npm install save-dev npx npm ci hoisting var let const tdz esm commonjs barrel file',
  },
  // ── 포트폴리오 검색 (번외) ──
  {
    slug: 'fe-search-algorithm',
    area: 'Front',
    course: '포트폴리오 검색',
    lesson: 'S0~S6',
    date: '2026.10.26',
    title: '검색 알고리즘 — 정규화 · 역색인 · BM25 · 오타 고치기',
    summary: '글자가 똑같아야만 찾던 사이트 검색을, 재는 도구부터 만든 뒤 정규화 → 역색인 → BM25 랭킹 → 오타·동의어 → 자동완성 → 추천 검색어 순서로 고쳤다. 숫자는 시험지와 처음 보는 검색어로 따로 쟀다.',
    points: [
      '고치기 전에 시험지(검색어 + 정답)와 채점기부터 — 상위 3 적중률 · MRR · 0건 비율로 단계마다 비교',
      '찾는 범위를 넓히면(본문 · 조사) 순서가 무너진다 → BM25 로 많이 · 드물게 · 제목에 나온 말을 위로',
      '시험지 95% vs 처음 보는 검색어 50% — 시험지를 보고 만든 규칙은 점수가 부풀려진다',
    ],
    learned: [
      {
        title: '측정',
        items: [
          '검색어를 유형별로 나눠 잰다 — 같은 0건이라도 띄어쓰기 · 조사 · 본문 · 문장 · 오타로 원인이 달랐다',
          '"결과가 없어야 하는 검색어"를 같이 둬야, 규칙을 느슨하게 할 때 엉뚱한 결과가 느는 걸 잡는다',
          '규칙을 다 만든 뒤에 정한 검색어로 한 번만 잰다(검증 세트) — 그 결과를 보고 고치면 다시 오염된다',
        ],
      },
      {
        title: '정규화 · 역색인',
        items: [
          'NFC 로 합치고 전각 · 대소문자 · 공백 · 문장부호를 지워 검색어와 데이터를 같은 모양으로 — NFKC 는 ㄱ 같은 낱자까지 바꿔서 쓰지 않았다',
          '역색인은 책 뒤의 찾아보기 — 두 글자 조각마다 문서 목록을 두고, 교집합으로 후보를 고른 뒤 글에서 한 번 더 확인',
          '조사는 짧은 목록으로 떼되, 원래 모양과 뗀 모양 중 하나만 맞아도 찾은 것으로 본다',
        ],
      },
      {
        title: '랭킹 (BM25)',
        items: [
          '많이 나올수록(하지만 끝없이 오르지 않게), 드문 낱말일수록, 짧은 글일수록 점수가 높다',
          '같은 낱말도 칸마다 무게가 다르다 — 제목 3 · 태그 2 · 요약 1.5 · 본문 1',
          '군더더기 말("어떻게", "했나")은 빼고, 낱말 3개부터는 75% 만 맞아도 결과에 — 2개는 전부(안드로이드 앱 ≠ 아무 앱)',
        ],
      },
      {
        title: '오타 · 자동완성',
        items: [
          '편집거리는 자모로 센다 — 시스탬 → 시스템은 ㅐ → ㅔ 하나라 1',
          '고치기는 결과가 0건일 때만 — 한영 자판(vmffosvhal → 플랜포미) → 편집거리 순서',
          '치는 도중의 "디장"은 자모 앞부분으로, "ㄷㅈㅇ"은 낱말 첫 글자의 초성으로 비교',
        ],
      },
      {
        title: '막힌 것 · 바로잡은 것',
        items: [
          '공백을 지우고 비교했더니 "AI" 가 "detail" 속에도 걸렸다(20건) → 3글자 이하 영어는 단어째로 비교(4건)',
          '초성 "ㄷㅈㅇ" 이 "모든 작업" 의 낱말 중간(든 작업)에 걸렸다 → 낱말 첫 글자에서만 맞추게',
          '시험지에 "레이아웃"의 초성을 ㄹㅇㅇㅅ 으로 적었는데, "웃"의 첫소리는 ㅇ 이고 ㅅ 은 받침이었다 — 시험지 정답도 틀릴 수 있어서, 코드보다 정답부터 확인했다',
        ],
      },
    ],
    applied: [
      {
        slug: 'search-portfolio',
        learned: 'BM25 · 역색인 · 자모 편집거리 같은 검색 알고리즘',
        used: '이 사이트 검색창에 단계별로 적용해 상위 3 적중률을 31% 에서 95% 로 올렸다(처음 보는 검색어로는 50%)',
      },
    ],
    tags: ['프론트엔드', '검색', '알고리즘', 'BM25'],
    keywords: 'search algorithm 검색 알고리즘 정규화 nfc 역색인 inverted index bigram n-gram bm25 tf idf 랭킹 편집거리 levenshtein 오타 동의어 자동완성 초성 한영 자판 mrr 검증 세트',
  },
  // ── AI와 학습 (미니 인프런 · Nightly 풀스택) ──
  {
    slug: 'fe-ssr-dynamic-route',
    area: 'Front',
    course: '미니 인프런',
    lesson: '12회차',
    date: '2026.11.03',
    title: '강의 상세 SSR — 동적 라우트 [id] · fetch 상태 코드 확인',
    summary: 'pages/courses/[id].tsx 파일 하나가 /courses/1, /courses/2 … 를 모두 받고, 주소의 그 자리 값은 문자열로 context.params.id 에 담긴다. fetch 는 응답이 오기만 하면 404 든 500 이든 성공으로 보니, 상태 코드를 직접 확인해 나눠야 한다.',
    points: [
      'fetch 는 연결조차 못 할 때(ECONNREFUSED)만 에러를 던지고, 404 · 500 처럼 응답이 오면 조용히 통과시킨다 — 확인 없이 두면 빈 화면이 200 OK 로 나간다',
      '400번대(없는 강의 404 · 숫자 아닌 id 422)는 { notFound: true }, 그 밖의 실패는 throw(500) — "없음"과 "고장"을 같은 화면으로 섞지 않는다',
      '파일 이름에는 타입을 적는 자리가 없다 — Next.js 는 /courses/abc 도 받으니 거르는 건 우리(또는 FastAPI 의 course_id: int) 몫',
    ],
    learned: [
      {
        title: '동적 라우트',
        items: [
          '강의마다 파일을 만들면 강의가 늘 때마다 코드를 고치고 다시 배포해야 한다 — 대괄호 파일 하나로 대신한다',
          '괄호는 프레임워크마다 다르다 — Next.js 는 [id], FastAPI 는 {course_id}, App Router 의 (이름)은 주소에 안 나오는 라우트 그룹',
          'context.params 의 열쇠 이름은 대괄호 안 글자다 — [courseId].tsx 로 바꾸면 params.id 는 undefined',
          'pages/courses.tsx(목록)와 pages/courses/[id].tsx(상세)는 함께 있어도 된다',
        ],
      },
      {
        title: '주소 값과 템플릿 리터럴',
        items: [
          '주소는 브라우저가 보낸 요청에 담긴 글자라 /courses/1 의 id 는 숫자가 아니라 문자열 "1"',
          '백틱 + ${id} 를 써야 값이 들어간다 — 큰따옴표나 $ 없는 백틱 안의 {id}는 그냥 글자라 FastAPI 가 422',
          '순서는 id 꺼내기 → fetch → 상태 코드 확인 → res.json() → props — 주소 확인, 받기, 쪽지 확인, 뜯기, 건네기',
        ],
      },
      {
        title: '서버에서 일어나는 일',
        items: [
          'getServerSideProps 안의 console.log 는 브라우저 콘솔이 아니라 npm run dev 터미널에 찍힌다',
          'Pages Router 컴포넌트는 서버 컴포넌트가 아니다 — 서버에서 한 번 그리고 브라우저에서 다시 실행해 이벤트를 붙인다(하이드레이션)',
          'Ctrl+U 의 <!-- --> 는 React 가 글자 조각 경계에 끼운 표시라 하이드레이션 때 서버 HTML 과 맞춰 본다',
          '이미 앱 안에서 이동할 때는 페이지 HTML 대신 /_next/data/…json 으로 props 만 받아 온다',
        ],
      },
      {
        title: '앞으로',
        items: [
          '로그인이 붙으면 401 은 로그인 페이지로 redirect, 403 은 "권한 없음" — 400번대를 모두 404 로 묶는 규칙은 공개 상세 페이지에서만 맞다',
          '자주 안 바뀌는 상세는 getStaticPaths + revalidate(ISR)로 미리 만들어 DB 부담을 줄일 수 있다',
          'App Router 에서는 app/courses/[id]/page.tsx 에서 await params 로 꺼내고 notFound() 를 부른다',
        ],
      },
    ],
    tags: ['프론트엔드', 'Next.js', 'SSR', '동적 라우트', '에러 처리'],
    keywords: 'next.js pages router dynamic route [id] getserversideprops context params string template literal backtick fetch res.ok res.status notfound throw 404 422 500 econnrefused hydration server component app router await params notfound() getstaticpaths isr revalidate console.log terminal 미니 인프런',
  },
  {
    slug: 'fe-ssr-getserversideprops',
    area: 'Front',
    course: '미니 인프런',
    lesson: '11회차',
    date: '2026.11.02',
    title: '강의 목록 SSR — getServerSideProps · Ctrl+U vs Elements',
    summary: 'CSR 은 서버가 빈 틀을 보내고 브라우저가 useEffect 로 채워서, Ctrl+U(서버 원본)에는 강의 제목이 없다. SSR 은 Next.js 서버가 데이터를 먼저 받아 props 로 넘기고, 내용이 다 찬 HTML 을 보낸다.',
    points: [
      'Elements 에 있다고 서버가 보낸 HTML 에 있었던 건 아니다 — 검색 로봇과 링크 미리보기는 Ctrl+U 와 같은 것만 본다',
      'FastAPI 를 끄니 fetch 가 ECONNREFUSED 로 514ms 만에 실패하고 페이지 전체가 500 — 그 500 은 Next.js 가 보낸 것',
      '검색에 나와야 하는 공개 페이지는 SSR, 로그인 후 개인 화면은 CSR 로도 충분하다',
    ],
    learned: [
      {
        title: 'SSR',
        items: [
          '순서가 핵심 — 데이터 받기 → HTML 만들기 → 보내기. 바뀌면 빈 목록으로 HTML 이 나간다',
          'return { props: { courses } } 를 Next.js 가 열어서 넘기고, Courses({ courses }) 가 같은 이름으로 꺼낸다',
          'Pages Router 는 컴포넌트가 브라우저에서도 실행돼서 서버 전용 일을 getServerSideProps 로 떼어 둔다 — App Router 는 컴포넌트 안에서 바로 await',
          'SSR HTML 은 처음엔 그림일 뿐, 브라우저가 같은 컴포넌트를 한 번 더 실행해 동작을 연결한다(하이드레이션)',
        ],
      },
      {
        title: '실패를 읽는 법',
        items: [
          'ECONNREFUSED 는 그 포트에 아무도 없어 바로 거절, 타임아웃은 대답이 없어 기다리다 포기',
          '꺼진 서버는 상태 코드를 못 보낸다 — 상태 코드는 응답이 있어야 생긴다',
          'fetch 는 연결 실패에만 에러를 던진다 — 404 · 500 응답은 res.ok 를 따로 봐야 한다',
        ],
      },
      {
        title: '막힌 것 · 바로잡은 것',
        items: [
          'CSR 페이지의 Elements 에도 제목이 없을 거라 예측했다 → li 4개가 있었다. 브라우저 안의 React 가 setCourses 뒤에 넣었다',
          'FastAPI 를 끄면 "빈 배열에 map 해서" 에러가 날 거라 했다 → [].map 은 [] 를 돌려줄 뿐, 실제로는 fetch 줄에서 터졌다',
          '서버가 HTML 을 만드는 일을 "번들"이라고 했다 → 렌더링이다. 번들은 빌드 때 JS 를 묶는 작업',
        ],
      },
    ],
    tags: ['프론트엔드', 'Next.js', 'SSR', 'React'],
    keywords: 'ssr csr getserversideprops next.js pages router app router props hydration view source ctrl+u elements seo useeffect econnrefused fetch failed timeout ssg isr getstaticprops revalidate 미니 인프런',
  },
  {
    slug: 'fe-tanstack-query',
    area: 'Front',
    course: 'Nightly 풀스택',
    lesson: 'S0-8',
    date: '2026.10.20',
    title: 'TanStack Query 회원 화면 — 캐시 무효화와 405 · 422',
    summary: '서버 데이터는 useState 가 아니라 TanStack Query 에 맡긴다. useQuery 가 ["users"] 이름표로 캐시하고, 등록이 성공하면 invalidateQueries 로 낡음 표시를 해 새로고침 없이 목록을 다시 채운다.',
    points: [
      '클라이언트 상태(입력창 · 모달)는 useState, 서버 상태(회원 목록)는 TanStack Query',
      '405 는 주소는 있는데 그 메서드가 없다는 뜻 — 백엔드에 목록 조회(GET /api/v1/users)가 없었다',
      '422 는 필드 약속이 어긋난 것 — 프론트가 password 를 안 보냈고, 응답 detail 에 위치가 정확히 적혀 있었다',
    ],
    learned: [
      {
        title: '캐시',
        items: [
          'invalidateQueries 의 키는 글자 하나까지 같아야 한다 — "user" 를 무효화해도 "users" 는 그대로',
          '["users"] 를 무효화하면 ["users", 3] 도 같이 낡음 처리된다',
          '무효화를 빼도 창 포커스 · 재마운트 때는 다시 불러온다 — "바로 안 바뀐다"가 정확한 표현',
        ],
      },
      {
        title: '구조',
        items: [
          '프론트도 사용자 쪽부터: 1 화면 → 2 훅 → 3 API 통신 (lib/api/client.ts)',
          '훅은 Service 와 위치만 비슷하다 — 본업은 비즈니스 로직이 아니라 서버 상태 관리',
          'fetch 는 웹 표준, axios 는 편의 기능을 얹은 외부 라이브러리 — 상위호환이 아니다',
        ],
      },
    ],
    tags: ['프론트엔드', 'TanStack Query', 'React', 'API 연동'],
    keywords: 'tanstack query react query usequery usemutation invalidatequeries cache 405 422 fetch axios server state',
  },
  {
    slug: 'fe-cors-usestate',
    area: 'Front',
    course: '미니 인프런',
    lesson: '3회차',
    date: '2026.10.18',
    title: 'CORS 와 화면에 데이터 띄우기 — fetch · useState',
    summary: 'fetch 는 브라우저가 보내고, 포트가 다른 서버의 응답은 Access-Control-Allow-Origin 허가증이 있어야 JS 에 넘어온다. 받은 데이터는 set 함수로 신호를 보내야 화면이 다시 그려진다.',
    points: [
      '서버 로그는 200 인데 화면은 비어 있다 — 막은 건 서버가 아니라 브라우저의 동일 출처 정책',
      'allow_origins 에 "http://localhost:3000/" 처럼 / 를 붙이면 안 된다 — origin 은 프로토콜 + 주소 + 포트까지',
      '일반 변수에 넣으면 화면이 안 바뀐다 → setCourses(data) 호출 자체가 다시 그리라는 신호',
    ],
    learned: [
      {
        title: 'CORS',
        items: [
          'CORS 는 서버 보호가 아니라, 다른 사이트가 사용자 브라우저로 응답을 읽지 못하게 막는 규칙',
          'JSON POST 같은 요청은 OPTIONS 사전 요청으로 먼저 묻고, 허락이 없으면 실제 요청을 보내지 않는다',
          'curl · Postman 에는 적용되지 않는다 → 서버 보호는 인증 · 인가의 몫',
        ],
      },
      {
        title: 'React · TypeScript',
        items: [
          'useState([]) 만 쓰면 never[] 로 추측된다 → useState<Course[]>([])',
          'useEffect 의 빈 배열을 빼면 set → 다시 그림 → fetch 가 무한 반복된다',
          'App Router 는 app/courses/page.tsx — 폴더 이름이 주소, page.tsx 가 문패',
        ],
      },
    ],
    tags: ['프론트엔드', 'CORS', 'React', 'TypeScript'],
    keywords: 'cors same origin policy preflight options fetch usestate useeffect never typescript app router access-control-allow-origin',
  },
  // ── 프론트엔드 강의 ──
  {
    slug: 'fe-flex-grid',
    area: 'Front',
    course: '프론트엔드',
    lesson: '16강',
    date: '2026.10.04',
    title: '레이아웃 — Flexbox & Grid',
    summary: 'flex 는 한 줄 정렬, grid 는 행 · 열이 있는 전체 구조. 페이지는 grid, 카드 안은 flex 로 섞어 쓴다.',
    points: [
      'flex 는 주축과 교차축 — justify-content 는 주축, align-items 는 교차축',
      '카드 안 버튼을 항상 맨 아래로: 세로 flex + margin-top: auto',
      'grid 는 repeat(auto-fit, minmax(220px, 1fr)) 로 미디어 쿼리 없이도 반응형',
    ],
    learned: [
      {
        title: 'Flexbox',
        items: [
          'flex: 1 1 200px = grow · shrink · basis',
          'flex-direction: column 이면 justify-content 가 세로 정렬이 된다',
          '사이드바 고정 + 본문 채우기: flex: 0 0 240px / flex: 1',
        ],
      },
      {
        title: 'Grid',
        items: ['fr 은 남는 공간의 비율, span 2 로 두 칸 차지', 'grid-template-areas 로 영역에 이름을 붙여 배치'],
      },
    ],
    applied: [
      {
        slug: 'search-portfolio',
        learned: '페이지는 grid, 카드 안은 flex. 카드 안 요소를 맨 아래로 보내려면 세로 flex 에 margin-top: auto.',
        used: '홈 사례 카드는 grid 로 1 → 2 → 3단, 카드 안은 세로 flex 로 쌓고 태그 · 지표 줄에 margin-top: auto 를 줘서 설명 길이가 달라도 같은 줄 카드의 아랫줄이 맞게 했다. 검색 결과의 본문 + 사이드는 flex-wrap 으로 좁아지면 아래로 내려간다.',
      },
    ],
    tags: ['CSS', 'Flexbox', 'Grid', '레이아웃'],
    keywords: 'css flex flexbox grid layout 반응형 justify-content align-items',
  },
  {
    slug: 'fe-responsive',
    area: 'Front',
    course: '프론트엔드',
    lesson: '15강',
    date: '2026.10.04',
    title: '미디어 쿼리와 반응형 웹',
    summary: '하나의 코드로 화면 크기에 따라 레이아웃이 바뀌게 한다. 모바일을 기본으로 쓰고 min-width 로 화면이 커질 때만 덧붙인다.',
    points: [
      'viewport meta 가 없으면 모바일이 PC 화면을 축소해 보여줘서 미디어 쿼리가 안 먹는다',
      '브레이크포인트는 정답이 아니라 디자인이 깨지는 지점에 맞춘다',
      '모바일 퍼스트: 기본은 모바일, min-width 로 태블릿 · PC 를 더한다',
    ],
    learned: [
      {
        title: '반응형 도구',
        items: [
          '@media (min-width: 768px) / (orientation: landscape) / print',
          'img { max-width: 100%; height: auto } · <picture> 로 화면별 다른 이미지',
          '미디어 쿼리 없이도: %, max-width, clamp(), flex-wrap, auto-fit + minmax',
        ],
      },
    ],
    tags: ['CSS', '반응형', '미디어 쿼리'],
    keywords: 'css responsive media query mobile first breakpoint viewport picture 반응형',
  },
  {
    slug: 'fe-inheritance',
    area: 'Front',
    course: '프론트엔드',
    lesson: '14강',
    date: '2026.10.04',
    title: 'CSS 상속',
    summary: '글자 관련 스타일은 부모에서 자식으로 물려받고, 박스 · 배치 관련 스타일은 물려받지 않는다. 상속을 이용하면 글자 스타일을 한 번만 쓰면 된다.',
    points: [
      '상속되는 건 color · font · line-height 같은 글자 속성, 안 되는 건 width · margin · border 같은 박스 속성',
      'button · input 은 폰트를 상속받지 않아서 font: inherit 를 자주 쓴다',
      '상속받은 값은 명시도가 가장 약하다 — 자식에 직접 쓴 규칙이 항상 이긴다',
    ],
    learned: [
      {
        title: '상속 제어',
        items: [
          'inherit(부모 값) · initial(기본값) · unset(상속 속성이면 inherit, 아니면 initial)',
          'CSS 변수도 상속된다 — .dark 안에서만 --main-color 를 바꾸는 식으로 테마를 만든다',
        ],
      },
    ],
    tags: ['CSS', '상속', 'CSS 변수'],
    keywords: 'css inheritance inherit initial unset custom properties 상속',
  },
  {
    slug: 'fe-float',
    area: 'Front',
    course: '프론트엔드',
    lesson: '13강',
    date: '2026.10.04',
    title: 'float',
    summary: 'float 의 원래 목적은 사진 옆에 글이 흘러가는 배치다. 레이아웃에 쓰던 시절의 문제(부모 높이 0)와 해결법을 알아 두고, 요즘 레이아웃은 flex · grid 로 한다.',
    points: [
      '자식이 모두 float 이면 부모 높이가 0 이 된다',
      '해결: clear: both · clearfix(::after) · display: flow-root',
      'float 은 이미지 옆 텍스트 감싸기 원래 용도로만 — 하지만 오래된 코드에 많아 개념은 필요하다',
    ],
    learned: [
      {
        title: '정리',
        items: ['display: flow-root 가 가장 깔끔한 최신 방식', 'overflow: hidden 은 예전 방식이라 내용이 잘릴 수 있다'],
      },
    ],
    tags: ['CSS', 'float', '레이아웃'],
    keywords: 'css float clear clearfix flow-root bfc',
  },
  {
    slug: 'fe-transform',
    area: 'Front',
    course: '프론트엔드',
    lesson: '12강',
    date: '2026.10.04',
    title: 'transform',
    summary: '요소를 이동 · 확대 · 회전 · 기울이기 한다. 다른 요소의 위치에 영향을 주지 않고, transition 과 함께 쓰면 부드럽고 가볍다.',
    points: [
      'translate · scale · rotate · skew, 기준점은 transform-origin(기본 가운데)',
      '함수 순서가 바뀌면 결과가 달라지고, 다른 선택자에서 다시 쓰면 덮어쓰인다',
      'perspective + rotateY + backface-visibility 로 카드 뒤집기',
    ],
    learned: [
      {
        title: '자주 쓰는 곳',
        items: [
          'hover 시 살짝 떠오르기 translateY(-4px), 아코디언 화살표 rotate(180deg)',
          '정중앙 정렬 translate(-50%, -50%) — % 는 자기 크기 기준',
          '최신 CSS 는 translate · scale · rotate 개별 속성으로 덮어쓰기 문제를 피한다',
        ],
      },
    ],
    tags: ['CSS', 'transform', '애니메이션'],
    keywords: 'css transform translate scale rotate skew origin 3d perspective',
  },
  {
    slug: 'fe-animation',
    area: 'Front',
    course: '프론트엔드',
    lesson: '11강',
    date: '2026.10.04',
    title: 'animation',
    summary: '@keyframes 로 중간 단계까지 정의해 상태 변화 없이도 자동 · 반복 실행한다. 두 지점만 잇는 transition 과의 차이를 정리했다.',
    points: [
      'transition 은 변화가 있어야 실행되는 두 지점, animation 은 자동 실행 · 여러 단계 · 반복',
      'forwards 가 없으면 끝난 뒤 처음 상태로 돌아간다 — both 는 딜레이 동안에도 시작 상태 유지',
      '움직임에 민감한 사용자를 위해 prefers-reduced-motion 을 존중한다',
    ],
    learned: [
      {
        title: '예제',
        items: [
          '로딩 스피너: rotate(360deg) + linear infinite',
          '아래에서 올라오며 등장: opacity 0 → 1 + translateY(20px → 0), 다음 요소는 딜레이',
          'hover 하면 멈추기: animation-play-state: paused',
        ],
      },
    ],
    tags: ['CSS', 'animation', 'keyframes'],
    keywords: 'css animation keyframes fill-mode reduced motion spinner',
  },
  {
    slug: 'fe-transition',
    area: 'Front',
    course: '프론트엔드',
    lesson: '10강',
    date: '2026.10.04',
    title: 'transition',
    summary: '속성 값이 바뀔 때 즉시가 아니라 부드럽게 변하게 한다. 들어갈 때와 나올 때 모두 부드럽게 하려면 변하기 전 상태에 써야 한다.',
    points: [
      'property · duration · timing-function · delay 4가지',
      'cubic-bezier 로 속도 곡선을 직접 만든다 — 포토샵 Curves 와 비슷한 개념',
      'transform · opacity 는 가볍고, width · top 은 레이아웃을 다시 계산해 무겁다',
    ],
    learned: [
      {
        title: '주의할 것',
        items: [
          'transition: all 은 의도치 않은 속성까지 움직일 수 있다 — 필요한 속성만',
          'display: none 은 전환이 안 된다 → opacity + visibility 조합',
        ],
      },
    ],
    tags: ['CSS', 'transition', 'easing'],
    keywords: 'css transition easing cubic-bezier hover performance',
  },
  {
    slug: 'fe-position',
    area: 'Front',
    course: '프론트엔드',
    lesson: '9강',
    date: '2026.10.04',
    title: 'position',
    summary: 'static · relative · absolute · fixed · sticky 다섯 가지와 z-index, 그리고 배지 · 고정 헤더 · 정중앙 같은 자주 쓰는 패턴을 정리했다.',
    points: [
      '부모에 relative, 자식에 absolute — 카드 모서리 배지의 기본 조합',
      'fixed 는 화면 기준, sticky 는 스크롤이 닿으면 붙는다(부모 안에서만)',
      'z-index 는 static 이 아닌 요소에서만, 부모의 쌓임 맥락을 넘지 못한다',
    ],
    learned: [
      {
        title: '패턴',
        items: [
          'fixed 헤더는 문서 흐름에서 빠지므로 body 에 padding-top 으로 보정',
          'sticky 가 안 되면 부모의 overflow: hidden 이나 top 값 누락을 확인',
          'inset: 0 = top · right · bottom · left 모두 0 (전체 덮는 막)',
        ],
      },
    ],
    tags: ['CSS', 'position', 'z-index'],
    keywords: 'css position relative absolute fixed sticky z-index stacking context',
  },
  {
    slug: 'fe-font-text',
    area: 'Front',
    course: '프론트엔드',
    lesson: '8강',
    date: '2026.10.04',
    title: '폰트와 텍스트',
    summary: 'font 속성, 웹폰트를 불러오는 두 가지 방법, 텍스트 정렬 · 간격, 한 줄 · 여러 줄 말줄임 처리를 정리했다.',
    points: [
      'font-family 는 앞에서부터 쓸 수 있는 폰트를 쓰고, 마지막엔 계열(sans-serif)',
      'line-height 는 단위 없이 써야 상속할 때 안전하다',
      '한글은 word-break: keep-all 로 단어 중간에서 안 끊기게, 자간은 살짝 음수',
    ],
    learned: [
      {
        title: '웹폰트와 말줄임',
        items: [
          'Google Fonts 의 link 또는 @font-face + woff2, font-display: swap',
          '한글 폰트는 용량이 커서 필요한 굵기만 · 상업적 사용 전 라이선스 확인',
          '여러 줄 말줄임: -webkit-line-clamp: 2 + overflow: hidden',
        ],
      },
    ],
    tags: ['CSS', '폰트', '타이포'],
    keywords: 'css font web font font-face line-height ellipsis line-clamp keep-all',
  },
  {
    slug: 'fe-display',
    area: 'Front',
    course: '프론트엔드',
    lesson: '7강',
    date: '2026.10.04',
    title: 'display — block · inline · inline-block',
    summary: 'block 은 한 줄을 다 차지하고, inline 은 내용만큼 옆으로 나란히, inline-block 은 나란히 서면서 크기와 여백이 적용된다.',
    points: [
      'inline 에는 width · height · 위아래 margin 이 적용되지 않는다',
      'inline-block 사이에는 HTML 줄바꿈 때문에 약 4px 틈이 생겨 요즘은 flex 를 쓴다',
      'display: none 은 공간도 사라지고, visibility: hidden 은 공간이 남고, opacity: 0 은 클릭도 된다',
    ],
    learned: [
      {
        title: '활용',
        items: ['메뉴 링크를 display: block + padding 으로 클릭 영역 넓히기', '세로 목록을 inline-block 으로 가로 배치'],
      },
    ],
    tags: ['CSS', 'display'],
    keywords: 'css display block inline inline-block visibility opacity',
  },
  {
    slug: 'fe-background',
    area: 'Front',
    course: '프론트엔드',
    lesson: '6강',
    date: '2026.10.04',
    title: '배경 (background)',
    summary: '배경색 · 배경 이미지의 repeat · position · size · attachment, 단축 속성, 그라디언트와 여러 겹 배경을 정리했다.',
    points: [
      'cover 는 빈틈없이 채우고 잘릴 수 있음, contain 은 전체가 보이고 여백이 생길 수 있음',
      '배경을 쉼표로 여러 개 쓰면 앞에 쓴 게 위에 쌓인다 — 어두운 그라디언트 막 + 사진',
      '내용인 이미지는 <img> + alt, 꾸미기용은 background-image',
    ],
    learned: [
      {
        title: '포인트',
        items: [
          'url 경로는 CSS 파일 위치 기준',
          '포토샵 조정 레이어로 어둡게 하던 것을 CSS 그라디언트 막으로',
          '<img> 를 cover 처럼 쓰려면 object-fit: cover',
        ],
      },
    ],
    tags: ['CSS', '배경', '그라디언트'],
    keywords: 'css background cover contain gradient object-fit',
  },
  {
    slug: 'fe-box-model',
    area: 'Front',
    course: '프론트엔드',
    lesson: '5강',
    date: '2026.10.04',
    title: '박스 모델',
    summary: '모든 요소는 content → padding → border → margin 상자다. box-sizing, 세로 margin 상쇄, 가운데 정렬과 overflow 를 정리했다.',
    points: [
      'box-sizing: border-box 면 width 에 padding 과 border 까지 포함 — 계산이 편하다',
      '세로로 만나는 margin 은 더해지지 않고 큰 쪽 하나만 적용된다',
      '블록 가로 가운데는 max-width + margin: 0 auto',
    ],
    learned: [
      {
        title: '디버깅',
        items: ['개발자 도구 Computed 탭의 박스 그림으로 여백 확인', '레이아웃이 이상하면 임시로 * { outline: 1px solid red }'],
      },
    ],
    tags: ['CSS', '박스 모델'],
    keywords: 'css box model box-sizing margin collapse overflow',
  },
  {
    slug: 'fe-selectors',
    area: 'Front',
    course: '프론트엔드',
    lesson: '4강',
    date: '2026.10.04',
    title: 'CSS 선택자',
    summary: '기본 · 조합 · 속성 선택자, 상태와 순서를 고르는 가상 클래스, HTML 에 없는 부분을 만드는 가상 요소를 정리했다.',
    points: [
      '자손(띄어쓰기) · 자식(>) · 인접 형제(+) · 일반 형제(~)',
      '가상 클래스는 : 하나(:hover, :nth-child), 가상 요소는 :: 두 개(::before)',
      '스타일은 class 로, id 는 JS · 앵커용으로 남겨 두면 명시도 충돌이 줄어든다',
    ],
    learned: [
      {
        title: '팁',
        items: ['::before · ::after 는 content 가 있어야 보인다', '링크 순서는 :link → :visited → :hover → :active'],
      },
    ],
    tags: ['CSS', '선택자'],
    keywords: 'css selector pseudo class pseudo element nth-child specificity',
  },
  {
    slug: 'fe-css-units',
    area: 'Front',
    course: '프론트엔드',
    lesson: '3강',
    date: '2026.10.04',
    title: 'CSS 단위',
    summary: 'px · % · em · rem · vw · vh 의 기준과 언제 무엇을 쓸지, 그리고 min() · clamp() · calc() 를 정리했다.',
    points: [
      'rem 은 항상 루트 기준이라 예측하기 쉽고, 브라우저 글자 크기를 키우면 같이 커져 접근성에 유리하다',
      '글자는 rem, 레이아웃 너비는 % · max-width, 테두리는 px',
      '디자인 시안의 px 을 rem 으로 바꿀 땐 px ÷ 16',
    ],
    learned: [
      {
        title: '함수',
        items: ['width: min(90%, 1200px) · font-size: clamp(1.5rem, 4vw, 3rem)', '모바일 주소창 때문에 100vh 대신 100dvh'],
      },
    ],
    tags: ['CSS', '단위', 'rem'],
    keywords: 'css units px rem em vw vh clamp calc min',
  },
  {
    slug: 'fe-css-basics',
    area: 'Front',
    course: '프론트엔드',
    lesson: '2강',
    date: '2026.10.04',
    title: 'CSS 기본',
    summary: 'CSS 문법과 적용하는 세 가지 방법, 색 표현, 어떤 스타일이 이기는지 정하는 캐스케이딩, 브라우저 기본 스타일 리셋을 정리했다.',
    points: [
      '외부 파일로 연결하는 게 기본 — 여러 페이지가 같은 CSS 를 공유한다',
      '이기는 순서: !important → 명시도(인라인 > id > class > 태그) → 나중에 쓴 것',
      '스타일이 안 먹으면 개발자 도구에서 취소선 그어진 속성을 본다',
    ],
    learned: [
      {
        title: '색과 리셋',
        items: ['HEX · RGB(A) · HSL — 포토샵 · 피그마의 HEX 를 그대로 쓴다', '* { margin: 0; padding: 0; box-sizing: border-box }'],
      },
    ],
    tags: ['CSS', '캐스케이딩', '명시도'],
    keywords: 'css cascade specificity reset color hex',
  },
  {
    slug: 'fe-html',
    area: 'Front',
    course: '프론트엔드',
    lesson: '1강',
    date: '2026.10.04',
    title: 'HTML 정리',
    summary: 'HTML 기본 구조, 태그 · 요소 · 속성, 텍스트 · 링크 · 이미지 · 목록 · 표 · 폼, 그리고 의미를 담는 시맨틱 태그를 정리했다.',
    points: [
      'viewport meta 는 반응형의 필수, img 의 alt 는 접근성의 필수',
      'label 의 for 와 input 의 id 를 맞추면 라벨을 눌러도 입력창이 선택된다',
      'div 만 쓰지 말고 header · nav · main · section · article · footer 로 역할을 드러낸다',
    ],
    learned: [
      {
        title: 'id · class · name',
        items: ['id 는 페이지에 하나, class 는 여러 요소 · 한 요소에 여러 개', 'input 의 name 은 서버로 보낼 때의 키 이름'],
      },
    ],
    tags: ['HTML', '시맨틱', '접근성'],
    keywords: 'html semantic tags form label alt accessibility',
  },
  {
    slug: 'fe-overview',
    area: 'Front',
    course: '프론트엔드',
    lesson: '0강',
    date: '2026.10.04',
    title: '웹 프론트엔드 개요와 개발 환경',
    summary: '웹페이지는 HTML(뼈대) · CSS(옷) · JavaScript(근육)로 이뤄지고, 브라우저는 DOM 을 만들고 스타일 · 레이아웃 · 페인트 순서로 화면을 그린다.',
    points: [
      '브라우저: HTML → DOM → 스타일 계산 → 레이아웃 → 페인트, JS 가 DOM 을 바꾸면 필요한 부분만 다시',
      'VS Code + Live Server · Prettier, Emmet(! + Tab, ul>li*3)',
      '파일 · 폴더 이름은 영어 소문자 + 하이픈',
    ],
    learned: [
      {
        title: '개발자 도구',
        items: ['Elements 로 HTML · CSS 확인 · 수정, Console 로 에러 확인', '디바이스 툴바(Ctrl + Shift + M)로 모바일 미리보기'],
      },
    ],
    tags: ['HTML', 'CSS', 'JavaScript', '개발 환경'],
    keywords: 'web frontend browser rendering dom vscode emmet devtools',
  },
]
