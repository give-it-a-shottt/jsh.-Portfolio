import type { StudyNote } from '../notes'

// Front 공부 노트 — 노션 학습노트 > 학습 폴더 > 프론트엔드, AI와 학습(화면 쪽)
export const FRONT_NOTES: StudyNote[] = [
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
        title: '헷갈리는 것',
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
