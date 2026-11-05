import acHome from './assets/design/accio/screen-01-home.webp'
import acList from './assets/design/accio/screen-02-list.webp'
import acDetail from './assets/design/accio/screen-03-detail.webp'
import acAi from './assets/design/accio/screen-04-ai.webp'
import mrPcHome from './assets/design/maestro/pc-01-home.webp'
import mrPcResult from './assets/design/maestro/pc-02-result.webp'
import mrPcDetail from './assets/design/maestro/pc-03-detail.webp'
import pfmHome from './assets/design/planforme/screen-01-home.webp'
import pfmReplan from './assets/design/planforme/screen-03-replan.webp'
import pfmPreviewBook from './assets/design/planforme/screen-09-preview-book.webp'
import pfmCalendar from './assets/design/planforme/screen-11-calendar.webp'
import rmHome from './assets/design/remind/screen-01-home.webp'
import rmChoice from './assets/design/remind/screen-04-choice.webp'
import rmFeedback from './assets/design/remind/screen-05-feedback.webp'
import rmWrongNote from './assets/design/remind/screen-10-wrong-note.webp'
import { ACCIO_LIVE, CASES, PLANFORME_LIVE, REMIND_LIVE, type Role } from './data'

// 프로젝트 페이지(#/project/{slug}) 데이터 — F-011. 홈 '먼저 볼 프로젝트' 카드도 여기서 만든다.
// 틀은 피그마 jsh 파일 Page 3 「Project · Accio · PC 1440」. 칸이 비면 그 섹션을 그리지 않는다.
// 글은 기록(Admin_Docs · Accio 포트폴리오용 기록 · data.ts 사례)에 있는 사실만 옮긴다.
// 배포 주소는 data.ts 상수를 같이 쓴다. 역할(roles)은 사례와 맞추되, Accio 만 다르다 —
// 사례 accio 는 2025 팀 프로젝트에서 맡은 부분이고, 여기 accio 는 혼자 다시 만든 쪽이다.
// 사례 slug 를 못 찾으면 모듈을 불러올 때 바로 오류를 낸다 — npm run check 가 빌드 전에 잡는다.

export interface ProjectScreen {
  image: string
  label: string
}

export interface ProjectTrouble {
  code: string
  title: string
  /** 펼쳤을 때 보이는 문제 · 해결 · 배운 점. 없으면 summary 한 줄 */
  problem?: string
  solution?: string
  lesson?: string
  summary?: string
  /** 따로 쓴 사례 상세가 있으면 그리로 */
  href?: string
}

export interface Project {
  slug: string
  name: string
  title: string
  summary: string
  roles: Role[]
  /** 정보 띠 — 역할 · 기간 · 팀 · 스택 */
  info: { label: string; value: string }[]
  /** 버튼 — 마지막 하나가 주 버튼(Primary, 오른쪽) */
  links: { label: string; href: string }[]
  /** 대표 화면. mobile 이면 휴대폰 화면 여러 장을 나란히 */
  cover: { images: string[]; device: 'desktop' | 'mobile' }
  /** 오른쪽 '구조' 패널 — 화면에서 DB까지 위에서 아래로 */
  structure: { title: string; steps: { key: string; name: string; desc: string }[]; note?: string }
  numbers: { value: string; label: string; note: string }[]
  why: string
  decisions?: { code: string; title: string; body: string }[]
  chart?: { title: string; sub: string; bars: [string, number][]; chips: string[]; note: string }
  troubles?: ProjectTrouble[]
  screens: { device: 'desktop' | 'mobile'; items: ProjectScreen[] }
  next?: { title: string; body: string }[]
  /** 홈 카드 — 한 줄 제목 · 두 줄 설명 · 숫자 3개 */
  card: { title: string; desc: string; metrics: [string, string][] }
}

function findCase(slug: string) {
  const item = CASES.find((c) => c.slug === slug)
  if (!item) throw new Error(`사례가 없어요: ${slug}`)
  return item
}

/** data.ts 사례를 '막힌 것' 줄로 — 제목 · 설명은 사례 그대로, 누르면 사례 상세 */
function fromCase(slug: string, code: string): ProjectTrouble {
  const item = findCase(slug)
  return { code, title: item.title, summary: item.description, href: item.href }
}

/** Design 사례에 적어 둔 '풀려던 문제' — 비어 있으면 '왜 만들었나'가 빈 섹션이 되므로 오류로 막는다 */
function designProblem(slug: string) {
  const problem = findCase(slug).design?.problem
  if (!problem) throw new Error(`사례에 design.problem 이 없어요: ${slug}`)
  return problem
}

export const PROJECT_LIST: Project[] = [
  {
    slug: 'accio',
    name: 'Accio',
    title: 'Accio — AI 자연어 검색 쇼핑몰',
    summary:
      '“비 오는 날 신을 운동화”처럼 모호한 말도 알아듣는 쇼핑몰. 5인 팀 프로젝트에서 목업이던 AI 검색을, 실제로 검색어를 이해하도록 무료 스택 위에 다시 만들었다.',
    roles: ['Design', 'Front', 'Back', 'DB'],
    info: [
      { label: '역할', value: '다시 만들기 1인 — 디자인 · 프론트 · 백엔드 · DB' },
      { label: '기간', value: '2026.10 – 11 (팀 원본 2025.10 – 11)' },
      { label: '팀', value: '원본 5명 → 다시 만들기 1명' },
      { label: '스택', value: 'React · FastAPI · Supabase · Gemini' },
    ],
    links: [
      { label: '팀 원본(v1) 보기', href: '/accio-v1/' },
      { label: '디자인 사례', href: '#/case/accio-redesign' },
      { label: '서비스 열기', href: ACCIO_LIVE },
    ],
    cover: { images: [acHome], device: 'desktop' },
    structure: {
      title: '화면에서 구조까지',
      steps: [
        { key: 'WEB', name: 'React · Vite', desc: '검색창 · AI 채팅 · “이렇게 이해했어요” 칩' },
        { key: 'API', name: 'FastAPI · Vercel Services', desc: '/api/search · /api/chat — 6초 넘으면 키워드 검색으로' },
        { key: 'AI', name: 'Gemini 3.5 Flash-Lite', desc: '검색어 → 종류 · 특징 · 가격 · 제외어. 연달아 늦으면 60초 차단' },
        { key: 'DB', name: 'Supabase Postgres', desc: '종류 · 가격은 필터, 낱말은 트라이그램 점수' },
      ],
      note: '외부 LLM이 느려져도 검색은 멈추지 않게: 시간 초과 → 규칙 해석 → 키워드 검색 순으로 내려간다.',
    },
    numbers: [
      { value: '0.613 → 0.938', label: '검색 정확도 (상위 5개)', note: '키워드 검색 → Gemini 해석 + 필터, 배포 환경 기준' },
      { value: '0.20 → 1.00', label: '“~말고” 제외 검색', note: '상품 종류를 필터로 받고 낱말은 구절 그대로 점수' },
      { value: '8.6초 → 2.1초', label: 'Gemini가 느린 날의 답변', note: '규칙 해석 + 60초 차단기로 서비스가 멈추지 않게' },
      { value: '0원', label: '운영비', note: 'Vercel Hobby · Supabase Free · Gemini 무료 등급' },
    ],
    why: '팀 프로젝트에서 홈 가운데 “AI 검색”과 하단 AI 탭은 규칙으로 흉내 낸 목업이었다. 가장 크게 보이는 AI 기능이 가짜였던 셈이다. 그래서 검색어를 실제로 이해하는 쇼핑몰로, 결제 수단 없이 도는 무료 스택 위에 다시 만들었다.',
    decisions: [
      { code: 'D-1', title: '상품 데이터: 네이버 쇼핑 API 종료 → Gemini 가상 상품 1,100개', body: '실데이터(상품명뿐)보다 설명 · 스펙 · 용도가 풍부해 자연어 검색을 보여 주기 좋고, 시험지 정답을 통제할 수 있다. 화면에는 “데모용 가상 상품”으로 표시.' },
      { code: 'D-2', title: '상품 이미지: 피그마 AI로 165장', body: 'Pexels는 키 발급 중단, Unsplash는 시간당 50회. 스튜디오 톤 하나로 고정해 800px webp(약 3.8MB)로 레포에 포함.' },
      { code: 'D-3', title: '리뷰도 생성', body: '1,100개 상품이 같은 리뷰 3개를 보여 주지 않게 상품마다 4개씩(4,401개), 평점과 아쉬운 점에 맞춰 생성.' },
      { code: 'D-6', title: '배포: Vercel Services + Supabase, 전부 무료', body: '결제 수단이 없어 한도를 넘으면 청구가 아니라 멈춘다. Supabase가 잠들지 않게 매일 Cron으로 깨운다.' },
      { code: 'D-7', title: 'AI 채팅을 실제로 연결', body: 'Gemini 해석 → 헤더 검색과 같은 SQL → 상위 5개를 보고 답변. “5만원 이하로”, “접이식 말고” 같은 이어지는 말은 앞 조건에 합친다.' },
    ],
    chart: {
      title: '검색 정확도 — 시험지 30문항',
      sub: '상위 5개 중 조건(종류 · 가격 · 특징 · 제외)을 지킨 비율이에요.',
      bars: [
        ['S0 키워드 검색', 0.613],
        ['S1 Gemini 질의 해석', 0.885],
        ['S1b 종류 필터 + 구절 점수', 0.932],
        ['배포 환경', 0.938],
      ],
      chips: ['가격 0.20 → 0.92', '제외 0.20 → 1.00', '특징 0.54 → 0.90', '상황 0.76 → 0.98'],
      note: '가격은 S1, 나머지는 S1b 기준. 대가: 응답 중앙값 166ms → 1,926ms(Gemini 호출 약 1초), 같은 검색어는 캐시로 0ms.',
    },
    troubles: [
      {
        code: 'T-5',
        title: 'Gemini가 수십 초씩 느려진 날 — 규칙 해석 + 차단기',
        problem: '같은 날 짧은 질문도 18 ~ 46초(처음엔 0.66초). 채팅 해석이 매번 6초 시간 초과로 키워드 검색으로 돌아갔고, “5만원 이하로” 같은 이어지는 말은 결과가 0개, 답 하나에 8초가 걸렸다.',
        solution: '① Gemini가 안 될 때 규칙 해석 — 가격 · 제외 · 상품 종류를 읽고, 종류가 없으면 이전 대화 조건을 이어받는다. ② 차단기 — 연달아 2번 늦거나 실패하면 60초 동안 부르지 않고 바로 규칙 · 키워드 검색. 답 8.6초 → 2.1초.',
        lesson: '외부 LLM은 “느려질 수 있다”를 전제로 시간 초과 + 대체 경로 + 차단기를 같이 둬야 서비스가 멈추지 않는다.',
      },
      { code: 'T-1', title: '이미지와 상품 설명이 어긋남', summary: '사진마다 생김새 설명을 기록해 상품 생성 프롬프트에 함께 넘기고, Gemini가 상품마다 맞는 사진 번호를 고르게 했다. 사진당 6 ~ 7개로 고르게 분배.' },
      { code: 'T-2', title: '생성물에 실존 브랜드 · 상표가 섞임', summary: '검사가 브랜드 칸만 보던 것을 상품명 · 설명 · 스펙 전체 검사로 바꾸고, 상표 · 기술명은 일반 표현으로 쓰게 했다. 4개 키워드 재생성 후 재검사 0건.' },
      { code: 'T-3', title: '생성 결과 품질 검사 자동화', summary: '키워드마다 개수 · 사진 분배 · 브랜드 쏠림 · 상표 경고를 출력. 55개 키워드 중 경고가 난 9개만 --only 로 재생성.' },
      { code: 'T-4', title: '가격 필터 기본값이 비싼 상품을 숨김', summary: '슬라이더 기본값 0 ~ 15만원이 늘 적용돼 그보다 비싼 생성 상품이 안 보였다. 슬라이더를 끝까지 두면 상한 없이 보이게 고쳤다.' },
    ],
    screens: {
      device: 'desktop',
      items: [
        { image: acHome, label: '홈 · AI 검색' },
        { image: acList, label: '검색 결과' },
        { image: acDetail, label: '상품 상세' },
        { image: acAi, label: 'AI 채팅' },
      ],
    },
    next: [
      { title: 'P4 임베딩 검색', body: '“클릭 소리 안 나는 마우스”처럼 말이 상품 글과 다른 특징 · 상황 문항 보강' },
      { title: 'P5 리뷰 실제 요약', body: '생성한 리뷰를 Gemini가 요약해 숨겨 둔 “AI 리뷰 요약”을 다시 연다' },
    ],
    card: {
      title: 'Accio — AI 자연어 검색 쇼핑몰',
      desc: '“비 오는 날 신을 운동화”처럼 모호한 말도 알아듣는 쇼핑몰. Gemini가 검색어를 조건으로 바꾸고 SQL이 걸러 낸다.',
      metrics: [
        ['0.61 → 0.94', '검색 정확도 (상위 5개)'],
        ['1,100개', '생성 상품 · 리뷰 4,401개'],
        ['0원', '운영비 (무료 스택 배포)'],
      ],
    },
  },
  {
    slug: 'maestro',
    name: '마에스트로',
    title: '마에스트로 — 지금 열린 식당 3곳을 근거와 함께',
    summary:
      '낯선 서울 동네에서 동네 · 상황만 고르면 지금 열려 있는 식당 3곳을 지도와 영업시간 막대, 날짜 붙은 근거로 비교해 주는 모바일 웹. 해커톤에 출품하려던 앱을 리뉴얼했다.',
    roles: ['Design', 'Front', 'Back'],
    info: [
      { label: '역할', value: '개인 작업 · 기여도 100%' },
      { label: '기간', value: '2026.10 – 11' },
      { label: '팀', value: '1명' },
      { label: '스택', value: 'React · Zustand · Leaflet · FastAPI' },
    ],
    links: [
      { label: '디자인 사례', href: '#/case/maestro-redesign' },
      { label: '서비스 열기', href: '#/maestro' },
    ],
    cover: { images: [mrPcResult], device: 'desktop' },
    structure: {
      title: '화면에서 구조까지',
      steps: [
        { key: 'WEB', name: 'React · Zustand · Leaflet', desc: '결과는 스토어 하나에 두고 목록 · 지도 · 상세 · 자리 물어보기가 함께 쓴다' },
        { key: 'API', name: 'FastAPI · Render', desc: '유미 클라이언트를 인터페이스 하나로 묶고 환경변수로 mock ↔ real 교체' },
        { key: 'EXT', name: '헤이유미 API', desc: '추천순 검색 10초+, 한도 넘으면 429 → 타임아웃 20초 · 재시도 1번 · 캐시 10분 · 동시 4개' },
        { key: 'DATA', name: '저장본', desc: '외부 검색이 실패하면 저장해 둔 400곳으로 답한다' },
      ],
      note: '실제 사장님께 알림이 가는 문의 · 예약만 시뮬레이터로 돌리고 응답에 simulated 표시를 붙였다.',
    },
    numbers: [
      { value: '11탭 → 1탭', label: '첫 후보까지', note: '일정 입력 없이 홈에서 [3곳 찾기] 한 번' },
      { value: '4.38 → 5.61', label: '버튼 글자 대비', note: '보라 버튼 위 흰 글자를 4.5 : 1 위로' },
      { value: '끼니당 1번', label: '외부 검색 요청', note: '상황 수와 무관하게 요청 수를 고정 (하루 70요청 한도)' },
      { value: '400곳', label: '실패할 때 저장본', note: '외부 API가 멈춰도 결과를 보여 준다' },
    ],
    why: designProblem('maestro-redesign'),
    troubles: [
      fromCase('maestro-quota', 'C-1'),
      fromCase('maestro-api-resilience', 'C-2'),
      fromCase('maestro-mock-real', 'C-3'),
      fromCase('maestro-owner-sim', 'C-4'),
      fromCase('maestro-trust-rank', 'C-5'),
      fromCase('maestro-wake', 'C-6'),
      fromCase('free-tier-infra', 'C-7'),
    ],
    screens: {
      device: 'desktop',
      items: [
        { image: mrPcHome, label: '홈' },
        { image: mrPcResult, label: '결과 — 목록 + 지도' },
        { image: mrPcDetail, label: '식당 상세 패널' },
      ],
    },
    card: {
      title: '마에스트로 — 지금 열린 식당 3곳',
      desc: '낯선 서울 동네에서 동네 · 상황만 고르면 지금 열려 있는 식당 3곳을 지도와 날짜 붙은 근거로 비교해 준다.',
      metrics: [
        ['1탭', '첫 후보까지'],
        ['6시간에 1번', '동네당 외부 검색'],
        ['400곳', '실패하면 저장본'],
      ],
    },
  },
  {
    slug: 'planforme',
    name: 'PlanForMe',
    title: 'PlanForMe — 하루 할당량을 계산해 주는 플래너',
    summary:
      '총분량과 마감일만 넣으면 하루 할 일을 정해 주는 1인용 플래너. IA · 유저 플로우 · 계산 규칙부터 모바일 화면 14개와 컴포넌트까지 피그마로 설계하고 그대로 구현 · 배포했다.',
    roles: ['Design', 'Front', 'Back'],
    info: [
      { label: '역할', value: '개인 프로젝트 — 설계 · 디자인 · 구현 · 배포' },
      { label: '기간', value: '2026.10' },
      { label: '팀', value: '1명' },
      { label: '스택', value: 'Next.js 16 · FastAPI · SQLAlchemy · pytest' },
    ],
    links: [
      { label: '디자인 사례', href: '#/case/planforme' },
      { label: '서비스 열기', href: PLANFORME_LIVE },
    ],
    cover: { images: [pfmHome, pfmPreviewBook, pfmReplan], device: 'mobile' },
    structure: {
      title: '화면에서 구조까지',
      steps: [
        { key: 'WEB', name: 'Next.js 16 · Vercel', desc: 'API 키는 서버 프록시에서만 붙여 브라우저에 노출하지 않는다' },
        { key: 'API', name: 'FastAPI', desc: '하루 할당량 계산은 DB 없는 순수 함수 — 기획서 예시가 곧 테스트(8개)' },
        { key: 'DB', name: 'SQLAlchemy', desc: '재계산 기준 시점(rebased_on)을 저장해 밀린 분량을 다시 센다' },
      ],
      note: '서버는 UTC라 “오늘”은 백엔드 · 프론트 모두 Asia/Seoul 기준 한 곳에서 구한다.',
    },
    numbers: [
      { value: '14개', label: '모바일 화면', note: 'IA · 유저 플로우 2개부터 설계' },
      { value: '5개', label: '계산 규칙', note: '책 · 강의 · 일반 · 재계산 · 유효 일수' },
      { value: '8개', label: '계산 테스트', note: '100p를 3일 → 34 · 34 · 32 같은 기획서 예시 그대로' },
      { value: '6건', label: '문제 해결 기록', note: '화면 보관 · 오래된 응답 · 시간대 · 보안까지' },
    ],
    why: designProblem('planforme'),
    troubles: [
      fromCase('planforme-replan-overdue', 'C-1'),
      fromCase('planforme-activity-state', 'C-2'),
      fromCase('planforme-quota-logic', 'C-3'),
      fromCase('planforme-stale-response', 'C-4'),
      fromCase('planforme-api-key', 'C-5'),
      fromCase('planforme-kst-today', 'C-6'),
    ],
    screens: {
      device: 'mobile',
      items: [
        { image: pfmHome, label: '홈 (Today)' },
        { image: pfmPreviewBook, label: '계산 결과' },
        { image: pfmReplan, label: '재계산 제안' },
        { image: pfmCalendar, label: '캘린더' },
      ],
    },
    card: {
      title: 'PlanForMe — 하루 할당량 플래너',
      desc: '총분량과 마감일만 넣으면 하루 할 일을 정해 주는 1인용 플래너. 피그마로 설계하고 그대로 구현 · 배포했다.',
      metrics: [
        ['14개', '모바일 화면'],
        ['5개', '계산 규칙'],
        ['6건', '문제 해결 기록'],
      ],
    },
  },
  {
    slug: 'remind',
    name: 'remind',
    title: 'remind — 노션 학습노트 복습 퀴즈 앱',
    summary:
      '노션에 정리한 강의 노트를 객관식 · OX · 단답형 · 서술형 퀴즈로 복습하는 모바일 퍼스트 앱. 복습 흐름 · 오답노트 · 디자인 시스템을 피그마로 설계했다.',
    roles: ['Design', 'Front'],
    info: [
      { label: '역할', value: '개인 프로젝트' },
      { label: '기간', value: '2026.10' },
      { label: '팀', value: '1명' },
      { label: '시안', value: '모바일 18 · PC/태블릿 5' },
    ],
    links: [
      { label: '디자인 사례', href: '#/case/remind' },
      { label: '서비스 열기', href: REMIND_LIVE },
    ],
    cover: { images: [rmHome, rmChoice, rmFeedback], device: 'mobile' },
    structure: {
      title: '설계 핵심',
      steps: [
        { key: 'IA', name: '화면 7개 + 하단 탭바', desc: '노션 소제목 하나를 개념 카드 하나로' },
        { key: 'FLOW', name: '매일 복습', desc: '홈에서 탭 2번 안에 첫 문제가 나오게' },
        { key: 'MODEL', name: 'Leitner 6단계', desc: '맞힐수록 복습 간격을 당일 → 1일 → 3일 → 7일 → 14일 뒤로' },
        { key: 'NOTE', name: '오답노트', desc: '틀린 문제는 연속 2번 맞히면 자동으로 졸업' },
      ],
    },
    numbers: [
      { value: '4종', label: '퀴즈 유형', note: '객관식 · OX · 단답형 · 서술형' },
      { value: '탭 2번', label: '첫 문제까지', note: '가장 자주 쓰는 매일 복습 흐름' },
      { value: '6단계', label: '복습 간격', note: 'Leitner BOX 0 ~ 5' },
      { value: '18 · 5', label: '시안', note: '모바일 · PC/태블릿' },
    ],
    why: designProblem('remind'),
    screens: {
      device: 'mobile',
      items: [
        { image: rmHome, label: '홈' },
        { image: rmChoice, label: '퀴즈 · 객관식' },
        { image: rmFeedback, label: '오답 피드백' },
        { image: rmWrongNote, label: '오답노트' },
      ],
    },
    card: {
      title: 'remind — 노션 노트 복습 퀴즈 앱',
      desc: '노션에 정리한 강의 노트를 객관식 · OX · 단답형 · 서술형 퀴즈로 복습하는 모바일 퍼스트 앱.',
      metrics: [
        ['4종', '퀴즈 유형'],
        ['탭 2번', '첫 문제까지'],
        ['18 · 5', '모바일 · PC 시안'],
      ],
    },
  },
]

/** 홈 카드 순서 — 사용자가 고른 대표 4개(F-011) */
export const FEATURED_SLUGS = ['accio', 'maestro', 'planforme', 'remind']

export function findProject(slug: string) {
  return PROJECT_LIST.find((p) => p.slug === slug)
}

/** 프로젝트 페이지 맨 아래 '다음 프로젝트' — 홈 카드 순서로 돈다 */
export function nextProject(slug: string) {
  const i = FEATURED_SLUGS.indexOf(slug)
  return findProject(FEATURED_SLUGS[(i + 1) % FEATURED_SLUGS.length])
}
