import scPcHome from './assets/design/snapchef/pc-01-home.webp'
import scHome from './assets/design/snapchef/screen-01-home.webp'
import scIngredients from './assets/design/snapchef/screen-02-ingredients.webp'
import scRecommend from './assets/design/snapchef/screen-03-recommend.webp'
import scCook from './assets/design/snapchef/screen-04-cook.webp'
import ggHome from './assets/design/geogi/screen-01-home.webp'
import ggDetail from './assets/design/geogi/screen-02-detail.webp'
import ggNearby from './assets/design/geogi/screen-03-nearby.webp'
import ggSearch from './assets/design/geogi/screen-04-search.webp'
import agStage from './assets/design/agora/screen-01-stage.webp'
import agStageMo from './assets/design/agora/screen-05-stage-mo.webp'
import agPredict from './assets/design/agora/screen-02-predict.webp'
import agResult from './assets/design/agora/screen-03-result.webp'
import agHome from './assets/design/agora/screen-04-home.webp'
import dmDraft from './assets/design/didim/screen-02-draft.webp'
import dmAnalysis from './assets/design/didim/screen-03-analysis.webp'
import dmCard from './assets/design/didim/screen-04-card.webp'
import dmReport from './assets/design/didim/screen-05-report.webp'
import acHome from './assets/design/accio/screen-01-home.webp'
import acLiveHome from './assets/design/accio/live-01-home.webp'
import acLiveHomeMo from './assets/design/accio/live-02-home-mo.webp'
import acList from './assets/design/accio/screen-02-list.webp'
import acDetail from './assets/design/accio/screen-03-detail.webp'
import acAi from './assets/design/accio/screen-04-ai.webp'
import mrPcHome from './assets/design/maestro/pc-01-home.webp'
import mrPcDetail from './assets/design/maestro/pc-03-detail.webp'
import mrLiveResult from './assets/design/maestro/live-01-result.webp'
import mrLiveResultMo from './assets/design/maestro/live-02-result-mo.webp'
import pfmHome from './assets/design/planforme/screen-01-home.webp'
import pfmReplan from './assets/design/planforme/screen-03-replan.webp'
import pfmPreviewBook from './assets/design/planforme/screen-09-preview-book.webp'
import pfmCalendar from './assets/design/planforme/screen-11-calendar.webp'
import rmHome from './assets/design/remind/screen-01-home.webp'
import rmChoice from './assets/design/remind/screen-04-choice.webp'
import rmFeedback from './assets/design/remind/screen-05-feedback.webp'
import rmWrongNote from './assets/design/remind/screen-10-wrong-note.webp'
import miHome from './assets/design/mini-inflearn/screen-01-home.webp'
import miLogin from './assets/design/mini-inflearn/screen-04-login.webp'
import ntHome from './assets/design/nightly/screen-01-home.webp'
import ntSleep from './assets/design/nightly/screen-02-sleep.webp'
import ntCoach from './assets/design/nightly/screen-03-coach.webp'
import gpHome from './assets/design/gameprobe/screen-01-home.webp'
import gpProfile from './assets/design/gameprobe/screen-02-profile.webp'
import gpMatch from './assets/design/gameprobe/screen-03-match.webp'
import gpLineup from './assets/design/gameprobe/screen-08-lineup.webp'
import flPcMain from './assets/design/flaseek/pc-01-main.webp'
import flPcList from './assets/design/flaseek/pc-02-list.webp'
import flPcDetail from './assets/design/flaseek/pc-03-detail.webp'
import flPcLogin from './assets/design/flaseek/pc-04-login.webp'
import { ACCIO_LIVE, AGORA_GITHUB, AGORA_LIVE, CASES, DIDIM_GITHUB, DIDIM_LIVE, GEOGI_GITHUB, GEOGI_LIVE, MINI_INFLEARN_LIVE, PLANFORME_LIVE, REMIND_LIVE, SNAPCHEF_GITHUB, SNAPCHEF_LIVE, type DesignVariant, type Role } from './data'

// 프로젝트 페이지(#/project/{slug}) 데이터 - F-011. 홈의 메인 섹션 · 목차 · '그 밖의 작업'도 이 목록 순서대로 만든다(F-018) -
// 프로젝트를 추가할 때는 PROJECT_LIST 에 하나 넣으면 홈 · 프로젝트 페이지 · '다음 프로젝트'에 같이 생긴다.
// tier 'main'(대표 · 스크롤 섹션)을 목록 앞에, 'sub'(그 밖의 작업)를 뒤에 둔다 - 홈은 tier 로 나눠 그리고, 목록은 하나라
// '다음 프로젝트'는 메인 → 서브로 한 바퀴 돈다(D-008, F-015).
// 틀은 피그마 jsh 파일 Page 3 「Project · Accio · PC 1440」. 칸이 비면 그 섹션을 그리지 않는다.
// 글은 기록(Admin_Docs · Accio 포트폴리오용 기록 · data.ts 사례)에 있는 사실만 옮긴다.
// 배포 주소는 data.ts 상수를 같이 쓴다. 역할(roles)은 사례와 맞추되, Accio 만 다르다 -
// 사례 accio 는 2025 팀 프로젝트에서 맡은 부분이고, 여기 accio 는 혼자 다시 만든 쪽이다.
// 사례 slug 를 못 찾으면 모듈을 불러올 때 바로 오류를 낸다 - npm run check 가 빌드 전에 잡는다.

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

/** 홈 메인 섹션(F-018)의 글과 화면 */
export interface ShowcaseContent {
  /** 이름 아래 한 줄 */
  tagline: string
  /** 보여 줄 숫자 두 개 - numbers 의 label. 값은 numbers 에서 가져와 두 곳이 어긋나지 않게 한다 */
  stats: [string, string]
  /** 오른쪽 판에 올릴 화면 - 휴대폰 3장, 또는 PC 화면 위에 다른 화면을 하나 겹친 것 */
  shots:
    | { kind: 'phones'; images: [string, string, string] }
    | { kind: 'screens'; main: string; overlay: string; overlayDevice: 'mobile' | 'desktop' }
}

export interface Project {
  slug: string
  /** 홈에서 메인(대표 · 스크롤 섹션) / 서브('그 밖의 작업') - D-008 · D-009 */
  tier: 'main' | 'sub'
  /** 메인이면 꼭 있어야 한다 - 없으면 홈 메인 섹션에 나오지 않으므로 npm run check 가 잡는다 */
  showcase?: ShowcaseContent
  name: string
  title: string
  summary: string
  roles: Role[]
  /** 정보 띠 - 역할 · 팀 · 스택 */
  info: { label: string; value: string }[]
  /** 버튼 - 마지막 하나가 주 버튼(Primary, 오른쪽) */
  links: { label: string; href: string }[]
  /** 대표 화면. mobile 이면 휴대폰 화면 여러 장을 나란히 */
  cover: { images: string[]; device: 'desktop' | 'mobile' }
  /** 오른쪽 '구조' 패널 - 화면에서 DB까지 위에서 아래로. 디자인만 한 프로젝트처럼 없으면 대표 화면을 넓게 */
  structure?: { title: string; steps: { key: string; name: string; desc: string }[]; note?: string }
  /** 숫자로 보는 결과. 비면 섹션을 그리지 않는다 */
  numbers: { value: string; label: string; note: string }[]
  why: string
  decisions?: { code: string; title: string; body: string }[]
  chart?: { title: string; sub: string; bars: [string, number][]; chips: string[]; note: string }
  troubles?: ProjectTrouble[]
  screens: { device: 'desktop' | 'mobile'; items: ProjectScreen[] }
  next?: { title: string; body: string }[]
  /** 홈 카드 - 한 줄 제목 · 두 줄 설명 */
  card: { title: string; desc: string }
  /** 피그마 공개 링크(보기 전용, F-013) - 프로젝트 페이지 '디자인' 섹션의 버튼.
   * 공개하지 않기로 한 프로젝트는 비워 둔다(F-017). 비우면 버튼을 그리지 않는다 */
  figma?: string
  /** 같은 서비스의 Design 사례 slug - 프로젝트 페이지 '디자인' 섹션에 시안을 함께 보여 준다(F-013) */
  designCase?: string
}

function findCase(slug: string) {
  const item = CASES.find((c) => c.slug === slug)
  if (!item) throw new Error(`사례가 없어요: ${slug}`)
  return item
}

/** data.ts 사례를 '막힌 것' 줄로 - 제목 · 설명은 사례 그대로, 누르면 사례 상세 */
function fromCase(slug: string, code: string): ProjectTrouble {
  const item = findCase(slug)
  return { code, title: item.title, summary: item.description, href: item.href }
}

/** Design 사례에 적어 둔 '풀려던 문제' - 비어 있으면 '왜 만들었나'가 빈 섹션이 되므로 오류로 막는다 */
function designProblem(slug: string) {
  const problem = findCase(slug).design?.problem
  if (!problem) throw new Error(`사례에 design.problem 이 없어요: ${slug}`)
  return problem
}

/** 프로젝트 페이지에 '디자인' 섹션을 그릴지 - 피그마 링크나 Design 사례 중 하나는 있어야 보여 줄 것이 있다(F-017).
 * 전제: Design 사례를 건 프로젝트는 그 사례에 시안이 1장 이상 있다. 없으면 피그마 링크가 없을 때 제목만 남는
 * 빈 섹션이 되므로, npm run check 가 프로젝트마다 '디자인 섹션 시안 있음'으로 확인한다 */
export function hasDesign(project: Pick<Project, 'figma' | 'designCase'>): boolean {
  return Boolean(project.figma || project.designCase)
}

export interface ProjectSection {
  id: string
  title: string
}

/** 프로젝트 페이지 목차 - 데이터가 있는 섹션만 올린다. 화면(ProjectPage)과 검사(checks/run.mjs)가 같은 목록을 쓴다 */
export function projectSections(p: Project): ProjectSection[] {
  return [
    { id: 'why', title: '왜 만들었나' },
    hasDesign(p) && { id: 'design', title: '디자인' },
    p.decisions && { id: 'decisions', title: '중요한 결정' },
    p.chart && { id: 'chart', title: '검색 정확도' },
    p.troubles && { id: 'troubles', title: '막힌 것과 해결' },
    { id: 'screens', title: '화면' },
    p.next && { id: 'next', title: '다음 단계' },
  ].filter(Boolean) as ProjectSection[]
}

/** Design 사례의 시안을 장표 → 화면 → 기획 · 시스템 순으로 모아 앞에서 몇 장 - 프로젝트 페이지 '디자인' 섹션용 */
export function designPreview(slug: string, count = 6): DesignVariant[] {
  const d = findCase(slug).design
  if (!d) throw new Error(`Design 사례가 아니에요: ${slug}`)
  return [
    ...(d.story ?? []),
    ...(d.sections ?? []).flatMap((s) => s.items),
    ...(d.screens ?? []),
    ...(d.variants ?? []),
    ...(d.mobileScreens ?? []),
    ...(d.system ?? []),
  ].slice(0, count)
}

export type ShowcaseProject = Project & { showcase: ShowcaseContent }

/** 홈 메인 섹션에 나오는 프로젝트 - tier 'main' 중 showcase 가 있는 것, 목록 순서대로 */
export function showcaseProjects(list: Project[]): ShowcaseProject[] {
  return list.filter((p): p is ShowcaseProject => p.tier === 'main' && Boolean(p.showcase))
}

/** 메인 섹션의 숫자 두 개 - showcase.stats 의 label 로 numbers 에서 찾는다. 이름이 틀리면 그 칸은 빠진다(check 가 잡는다) */
export function showcaseStats(project: ShowcaseProject): { value: string; label: string }[] {
  return project.showcase.stats.flatMap((label) => project.numbers.filter((n) => n.label === label))
}

/** 홈 첫 화면 목차의 칸 수(F-019) - 메인 수만큼 한 줄에 놓는다. 메인이 없으면 목차를 그리지 않으므로 undefined.
 * Tailwind 클래스(grid-cols-N)는 동적으로 만들 수 없어서 style 의 gridTemplateColumns 값으로 돌려준다 */
export function mainIndexColumns(count: number): string | undefined {
  return count > 0 ? `repeat(${count}, minmax(0, 1fr))` : undefined
}

/** 서비스로 가는 버튼 - links 의 마지막이 주 버튼이다 */
export function serviceLink(project: Pick<Project, 'links'>): { label: string; href: string } | undefined {
  return project.links[project.links.length - 1]
}

export const PROJECT_LIST: Project[] = [
  {
    // 글은 ClickChef 레포의 README · docs/ARCHITECTURE.md와 운영 실측(2026-11-26)에서 옮겼다(사용자 승인 2026-11-26, F-019).
    // 피그마 링크는 넣지 않는다(사용자 결정). 화면은 운영 사이트 캡처.
    slug: 'snapchef',
    tier: 'main',
    name: '찰칵셰프',
    title: '찰칵셰프 - 냉장고 사진 한 장으로 지금 만들 수 있는 한식',
    summary:
      '냉장고 재료를 찍으면 AI(Gemini)가 재료를 찾고, 식약처 레시피 1,151개 중 내 재료와 많이 겹치는 한식을 부족한 재료와 함께 추천하는 웹 서비스. 단계별 타이머와 화면 꺼짐 방지가 있는 조리 모드로 끝까지 따라 만들 수 있다.',
    roles: ['Design', 'Front', 'Back', 'DB'],
    info: [
      { label: '역할', value: '개인 작업 · 기여도 100%' },
      { label: '팀', value: '1명' },
      { label: '스택', value: 'React · Vite · FastAPI · PostgreSQL · Gemini · EXAONE' },
    ],
    links: [
      { label: 'GitHub', href: SNAPCHEF_GITHUB },
      { label: '서비스 보기', href: SNAPCHEF_LIVE },
    ],
    cover: { images: [scPcHome], device: 'desktop' },
    showcase: {
      tagline: '냉장고 사진 한 장으로 오늘의 한식',
      stats: ['레시피', '사진 용량'],
      shots: { kind: 'screens', main: scPcHome, overlay: scIngredients, overlayDevice: 'mobile' },
    },
    structure: {
      title: '화면에서 구조까지',
      steps: [
        { key: 'WEB', name: 'React 19 · Vite', desc: '정적 파일로 CDN에 올린다. 레시피는 TanStack Query, 촬영 흐름 · 설정은 Zustand, 필터는 URL에 둔다' },
        { key: 'API', name: 'FastAPI · Vercel(싱가포르)', desc: '사진은 Gemini로 재료 목록을 받고, 추천은 SQL로 후보를 추린 뒤 순수 함수로 점수를 매긴다' },
        { key: 'AI', name: 'Gemini · EXAONE', desc: '실행 중에는 사진 인식(Gemini)만 부른다. 조리 시간 · 단계별 재료 같은 값은 EXAONE으로 데이터를 만들 때 한 번만 채웠다' },
        { key: 'DB', name: 'PostgreSQL (Neon 싱가포르)', desc: '레시피 1,151개. 재료 배열에 GIN 인덱스를 걸고, 하루 인식 횟수를 센다' },
      ],
      note: '로그인 없이 찜 · 설정 · 기록은 브라우저에 저장한다.',
    },
    numbers: [
      { value: '1,151개', label: '레시피', note: '식약처 조리식품 레시피 DB 전체를 정리하고 LLM으로 시간 · 인분 · 단계별 재료를 채웠다' },
      { value: '1,869MB → 18MB', label: '사진 용량', note: '한 장에 14 ~ 31MB인 원본 1,150장을 카드 크기 WebP로 줄여 함께 배포했다' },
      { value: '27개', label: '백엔드 테스트', note: '일치도 규칙, API 응답 형식, 동의어, 인식 후처리(가짜 Gemini 응답)' },
      { value: '0.15 ~ 0.25초', label: '추천 · 검색 응답', note: '운영 주소에서 잰 값. 함수와 DB를 모두 싱가포르에 두었다' },
    ],
    why: '냉장고에 남은 재료로 뭘 만들지 고민할 때, 레시피 앱은 요리 이름부터 고르게 하고 재료는 하나씩 입력해야 한다. 그래서 사진 한 장으로 재료를 알아내고, 가진 재료와 많이 겹치는 요리부터 보여 주는 서비스를 만들었다. 집에 늘 있는 양념은 가진 것으로 치고 없는 재료만 따로 보여 줘서, “지금 만들 수 있는가”를 먼저 답한다.',
    decisions: [
      {
        code: 'D-1',
        title: 'LLM은 실행 중이 아니라 데이터를 만들 때',
        body: '식약처 데이터에는 조리 시간 · 인분 · 단계별 재료가 없다. 이 값을 한 번만 만들어 DB에 넣어서, 실행 중 LLM 호출은 사진 인식 하나뿐이다. 비용과 응답 시간이 줄고, 키가 만료돼도 추천은 멈추지 않는다.',
      },
      {
        code: 'D-2',
        title: '추천은 SQL로 추리고 점수는 순수 함수로',
        body: '재료 배열 GIN 인덱스로 겹치는 레시피만 가져오고, 점수 규칙은 DB와 분리된 함수라 규칙마다 테스트로 확인한다.',
      },
      {
        code: 'D-3',
        title: '재료 이름은 한곳에서 맞춘다',
        body: '인식 결과의 “계란”과 DB의 “달걀”이 같은 재료가 되도록, 서버와 데이터 정리 스크립트가 같은 이름 사전을 쓴다.',
      },
      {
        code: 'D-4',
        title: 'Vercel + Neon, 둘 다 싱가포르',
        body: '카드 등록 없이 운영하는 게 조건이었다. 프론트와 API가 한 도메인이라 CORS가 없고, 서울 리전이 없는 Neon에 맞춰 함수도 싱가포르에 두었다.',
      },
    ],
    // 막힌 것: 펼쳐 보는 대표 1건을 먼저, 나머지는 한 줄 요약 - 거기붐벼? · Agora와 같은 방식
    troubles: [
      {
        code: 'T-1',
        title: '“지금 만들 수 있는 요리”가 늘 400개였다',
        problem: '재료가 하나만 겹쳐도 후보에 넣고 400개에서 잘라서, 무엇을 넣어도 개수가 400이었다. 점수도 가진 수 ÷ 필요한 수라서 재료 1개짜리 요리(1/1)가 5개를 다 가진 요리(5/5)와 같은 점수로 앞에 왔다.',
        solution: '부족한 주재료가 2개 이하이거나 절반 이상 가진 요리만 넣고, 같은 기준을 SQL에도 걸었다. 점수는 분모에 0.5를 더해 1/1은 0.67, 5/5는 0.91이 되게 했다. 흔한 재료 6개 기준으로 400개가 77개가 됐다.',
        lesson: '결과 개수가 늘 같은 값이면 어딘가의 제한에 걸린 것이다. 실제 데이터로 재 봐야 보인다.',
      },
      { code: 'T-2', title: '식약처 원본 사진이 한 장에 최대 31MB였다', summary: '홈만 열어도 100MB가 넘었고 해외 이미지 프록시는 시간 초과로 막혔다. 미리 카드 크기로 줄여 앱과 함께 배포했다.' },
      { code: 'T-3', title: 'React가 두 벌 불러와져 “Invalid hook call”이 났다', summary: '개발 서버가 의존성을 따로따로 미리 묶어서 생긴 일이었다. 미리 묶을 목록을 고정해 한 벌만 쓰게 했다.' },
      { code: 'T-4', title: 'CI에서만 npm ci가 실패했다', summary: 'Windows에서 만든 잠금 파일에 Linux용 선택 의존성이 빠져 있었다. Linux 컨테이너에서 잠금 파일을 다시 만들었다.' },
      { code: 'T-5', title: '쓰려던 Gemini 모델이 새 사용자에게 막혔다', summary: '기본 모델을 바꾸고, 404 · 429 · 503이면 다음 모델로 한 번 더 시도하게 했다.' },
    ],
    screens: {
      device: 'mobile',
      items: [
        { image: scHome, label: '홈' },
        { image: scIngredients, label: '재료 확인' },
        { image: scRecommend, label: '추천 목록' },
        { image: scCook, label: '조리 모드 · 타이머' },
      ],
    },
    next: [
      { title: '카카오 로그인', body: '카카오 로그인과 찜 동기화' },
      { title: 'PC → 폰 사진 넘기기', body: 'PC에서 띄운 QR로 폰 사진 넘기기' },
      { title: '레시피 DB 공유', body: '술 → 안주 추천 서비스와 레시피 DB 공유' },
    ],
    card: {
      title: '찰칵셰프 - 사진 한 장으로 오늘의 한식',
      desc: '냉장고 사진에서 AI가 재료를 찾고, 식약처 레시피 1,151개 중 지금 만들 수 있는 요리를 부족한 재료와 함께 보여 준다.',
    },
  },
  {
    // 글은 geogi-boombyeo 레포의 디자인 md(§0 브리프) · 결정(D-001 · D-002 · D-004 · D-009 · D-011) · 트러블슈팅(T-001 · T-004 ~ T-006 · T-008) · 실측(2026-11-23)에서 옮겼다(사용자 승인 2026-11-23, F-017).
    slug: 'geogi',
    tier: 'main',
    name: '거기붐벼?',
    title: '거기붐벼? - 몇 시에 가면 덜 붐비는지 한 문장으로',
    summary:
      '서울 주요 121곳의 혼잡도를 5분마다 모아, “오후 4시부터 6시까지 여유로울 거예요”처럼 언제 가면 되는지를 가장 큰 글자로 답하는 모바일 웹. 지금 붐비면 근처의 덜 붐비는 곳을 가까운 순으로 보여 준다.',
    roles: ['Design', 'Front', 'Back', 'DB'],
    info: [
      { label: '역할', value: '개인 작업 · 기여도 100%' },
      { label: '팀', value: '1명' },
      { label: '스택', value: 'Next.js 16 · FastAPI · PostgreSQL · Docker · GitHub Actions' },
    ],
    links: [
      { label: 'GitHub', href: GEOGI_GITHUB },
      { label: '서비스 보기', href: GEOGI_LIVE },
    ],
    cover: { images: [ggHome, ggDetail, ggNearby], device: 'mobile' },
    showcase: {
      tagline: '몇 시에 가면 덜 붐비는지 한 문장으로',
      stats: ['5분마다 수집', '백엔드 테스트'],
      shots: { kind: 'phones', images: [ggHome, ggDetail, ggNearby] },
    },
    structure: {
      title: '화면에서 구조까지',
      steps: [
        { key: 'WEB', name: 'Next.js 16', desc: '장소 121곳의 페이지를 미리 만들고 1분마다 갱신한다. 브라우저는 같은 주소의 /api로만 요청한다' },
        { key: 'API', name: 'FastAPI', desc: '읽기만 한다. 답 한 줄, 여유 순위, 근처 대안을 계산한다' },
        { key: 'WORKER', name: '수집 워커', desc: '5분마다 121곳을 한 번에 10개씩 가져온다. 웹 서버와 따로 한 개만 띄운다' },
        { key: 'DB', name: 'PostgreSQL', desc: '쌓이는 기록과 최신 상태를 다른 표에 둔다' },
      ],
      note: '서버 한 대(메모리 1GB)라 빌드는 깃허브 Actions가 하고, 서버는 이미지를 내려받아 켜기만 한다.',
    },
    numbers: [
      { value: '121곳', label: '5분마다 수집', note: '실제 인증키로 한 바퀴 2.3초, 성공 121 · 실패 0' },
      { value: '103개', label: '백엔드 테스트', note: '답 문장 규칙의 줄마다, 이상한 응답 · 끝나지 않는 응답 · 저장 실패까지' },
      { value: '1건', label: '리뷰가 찾은 [위험]', note: '테스트와 실제 수집이 통과한 뒤에, 리뷰어가 코드를 읽고 찾았다' },
      { value: '1GB', label: '서버 메모리', note: '프로그램 다섯 개를 켜고 여유 363MB. 빌드는 깃허브에서 한다' },
    ],
    why: '서울시 공식 사이트는 121곳의 혼잡도를 한눈에 보여 주지만, 그래서 언제 가야 하는지는 사용자가 판단해야 한다. 가 보고 나서야 붐비는 걸 알고, 현장에서는 대안을 찾기 어렵다. 그래서 정보를 펼쳐 놓는 대신 “언제 가면 되는지”를 한 문장으로 먼저 답하고, 붐비면 근처의 덜 붐비는 곳을 알려 주는 서비스를 만들었다. 서울시 API는 한 번에 한 곳만, 지금 값만 준다. 그래서 수집을 따로 돌려 DB에 쌓고, 화면은 우리 DB만 읽게 했다.',
    decisions: [
      {
        code: 'D-1',
        title: '수집 워커를 웹 서버와 분리',
        body: '웹 서버는 여러 개를 띄우는데, 그 안에 수집을 넣으면 서버 수만큼 같은 값을 여러 번 받아 온다. 그래서 수집은 따로 띄우는 프로그램 하나가 맡는다.',
      },
      {
        code: 'D-2',
        title: '쌓이는 기록과 최신 상태를 다른 표로',
        body: '화면은 최신 상태 121줄만 읽는다. 기록이 계속 쌓여도 화면은 느려지지 않는다.',
      },
      {
        code: 'D-3',
        title: '답 한 줄은 서버의 순수 함수',
        body: 'DB도 시계도 쓰지 않고 넣은 값만으로 문장을 만든다. 그래서 문구 규칙의 줄마다 테스트로 확인할 수 있다.',
      },
      {
        code: 'D-4',
        title: '응답의 장소 코드를 물어본 장소와 대조',
        body: '체험용 인증키는 어떤 장소를 물어도 한 곳의 값만 돌려준다. 확인 없이 저장하면 121곳이 모두 같은 값이 되는데 겉으로는 정상처럼 보인다.',
      },
    ],
    // 막힌 것: 펼쳐 보는 대표 1건을 먼저, 나머지는 한 줄 요약 - Agora · 디딤 · Accio와 같은 방식
    troubles: [
      {
        code: 'T-1',
        title: '이상한 응답 하나가 수집 한 바퀴 전체를 멈췄다',
        problem: '121곳을 다 모은 뒤에 저장하는 구조라, 한 곳의 응답 모양이 예상과 다르면 그 예외가 전체를 깨뜨려 121곳 모두 저장되지 않았다. 테스트도 실제 수집도 통과한 상태였다.',
        solution: '응답의 모양을 먼저 확인하고, 그래도 생기는 예상 밖의 오류는 그 장소만의 실패로 기록한다. 장소 하나에 쓰는 전체 시간에도 한도를 두었다.',
        lesson: '“한 곳의 실패가 다른 곳을 막지 않는다”는 약속은 실패를 일부러 만들어 봐야 확인된다.',
      },
      { code: 'T-2', title: '통신 라이브러리가 인증키가 든 주소를 로그에 찍었다', summary: '서울시 API는 인증키를 주소에 넣는다. 테스트가 로그에서 키를 찾아냈고, 수집 코드를 불러오는 순간 주소 로그를 끄게 했다.' },
      { code: 'T-3', title: '없는 장소 주소가 404가 아니라 200으로 응답했다', summary: '페이지 껍데기가 먼저 나간 뒤라 상태 코드가 이미 정해져 있었다. 요청이 페이지에 닿기 전에 121곳 목록과 비교해 걸렀다.' },
      { code: 'T-4', title: '“다시 시도”를 눌러도 같은 화면이 나왔다', summary: '서버가 1분 동안 기억해 둔 결과가 다시 나왔다. 버튼이 그 기억을 먼저 지우게 했다.' },
      { code: 'T-5', title: '아무것도 안 띄운 서버가 메모리를 절반 넘게 썼다', summary: '많이 쓰는 순서로 뽑아 보니 가상 서버에서는 쓸모없는 펌웨어 업데이트 프로그램이 200MB였다. 끄고 여유를 455MB에서 629MB로 늘렸다.' },
    ],
    screens: {
      device: 'mobile',
      items: [
        { image: ggHome, label: '홈 · 여유 TOP 5' },
        { image: ggDetail, label: '장소 상세 · 12시간 그래프' },
        { image: ggNearby, label: '근처 덜 붐비는 곳' },
        { image: ggSearch, label: '검색 · 별칭' },
      ],
    },
    next: [
      { title: '요일 · 시간대 패턴', body: '수집 기록이 쌓이면 “성수는 토요일 몇 시가 덜 붐빈다” 같은 패턴을 만든다' },
      { title: 'TOP 5 둘째 줄 문구', body: 'TOP 5 둘째 줄 문구를 장소마다 다르게 한다' },
      { title: '편하게 서울', body: '승강기 정보를 더해 유모차 · 휠체어 이용자가 쓰기 편하게 한다' },
    ],
    card: {
      title: '거기붐벼? - 몇 시에 가면 덜 붐비는지',
      desc: '서울 121곳의 혼잡도를 5분마다 모아 “언제 가면 되는지”를 한 문장으로 답한다. 붐비면 근처의 덜 붐비는 곳을 알려 준다.',
    },
  },
  {
    // 글은 AgoraAI 레포의 기획(agora-design.md §0) · 결정(D-003 · D-005) · 트러블슈팅(T-003) · 운영 DB 실측(2026-11-22)에서 옮겼다(사용자 승인 2026-11-22, F-016).
    slug: 'agora',
    tier: 'main',
    name: 'Agora AI 토론장',
    title: 'Agora AI 토론장 - AI 캐릭터들이 밸런스 게임으로 맞붙는 무대',
    summary:
      '밸런스 게임 주제(예: 평생 짜장 vs 평생 짬뽕)를 한국 AI(EXAONE) 냥냥이와 해외 AI(Gemini) 펭펭이가 3라운드로 토론하고, 발언의 핵심 한 구절이 예능 자막처럼 뜨는 서비스. 보기 전에 승부를 예측하고, 끝나면 AI 심판의 판정과 토론 품질 지표를 내 예측과 비교한다.',
    roles: ['Design', 'Front', 'Back', 'DB'],
    info: [
      { label: '역할', value: '개인 작업 · 기여도 100%' },
      { label: '팀', value: '1명' },
      { label: '스택', value: 'React · Vite · FastAPI · PostgreSQL · EXAONE · Gemini · Groq' },
    ],
    links: [
      { label: 'GitHub', href: AGORA_GITHUB },
      { label: '서비스 보기', href: AGORA_LIVE },
    ],
    cover: { images: [agStage], device: 'desktop' },
    showcase: {
      tagline: 'AI가 밸런스 게임으로 맞붙는다',
      stats: ['반박률', '동시 요청 통과'],
      shots: { kind: 'screens', main: agStage, overlay: agStageMo, overlayDevice: 'mobile' },
    },
    structure: {
      title: '화면에서 구조까지',
      steps: [
        { key: 'WEB', name: 'React · Vite', desc: '화면은 DB만 읽는다. 토론이 만들어지는 중이면 새 발언을 몇 초마다 확인한다' },
        { key: 'API', name: 'FastAPI · Vercel(싱가포르)', desc: '발언 1개 = 요청 1번. 같은 순번은 DB 고유 제약과 생성 잠금으로 한 번만 저장한다' },
        { key: 'AI', name: 'EXAONE · Gemini · Groq', desc: '냥냥이 EXAONE → Groq Qwen, 펭펭이 Gemini → Groq gpt-oss. 앞이 막히면 그 발언만 다음 AI가 대신한다' },
        { key: 'DB', name: 'PostgreSQL (Neon 싱가포르)', desc: '하루 한도는 UPDATE … WHERE used < limit 한 문장으로 자리를 먼저 잡는다' },
      ],
      note: '보기 · 예측 · 공감은 로그인 없이 된다. 토론 만들기만 로그인(구글 · 카카오)이 필요하다.',
    },
    numbers: [
      { value: '98.9%', label: '반박률', note: '실제 AI 토론 18개 평균. 목표(70% 이상)를 넘었다' },
      { value: '1.1%', label: '동의율', note: '상대 말에 그냥 맞장구친 비율. 목표(20% 이하) 안' },
      { value: '0개', label: '멈춘 토론', note: '실제 AI로 18개를 만드는 동안 Gemini가 24번 붐볐지만 다른 AI가 대신 말했다' },
      { value: '10 → 3', label: '동시 요청 통과', note: '하루 한도 3에 같은 계정으로 10건을 동시에 보냈을 때 운영 DB에서 정확히 3건만 통과' },
    ],
    why: 'AI끼리 토론하는 서비스는 영어권에만 있었고, 혼자 넣고 혼자 보는 도구라 같이 보는 재미가 없었다. AI끼리는 쉽게 동의해서 토론이 금방 심심해지기도 한다. 그래서 한국어 토론에 예능 자막을 붙이고, 보기 전에 승부를 예측하게 해 같이 보는 재미를 만들었다. 2라운드부터는 반박을 의무로 두고, 제대로 맞붙은 발언의 비율(반박률)을 화면에 숫자로 공개했다.',
    decisions: [
      {
        code: 'D-1',
        title: '발언 1개 = 요청 1번',
        body: '서버리스 함수는 60초 제한이 있어서 6발언을 한 번에 만들 수 없다. 발언을 하나씩 만들어 DB에 저장하고 화면은 DB만 읽는다. 같은 순번이 두 번 저장되지 않게 DB 고유 제약과 생성 잠금을 걸었다.',
      },
      {
        code: 'D-2',
        title: 'AI가 막혀도 토론은 멈추지 않는다',
        body: '냥냥이는 EXAONE(키 2개) → Groq Qwen, 펭펭이는 Gemini → Groq gpt-oss 순서로, 앞이 막히면 그 발언만 다음 AI가 대신 만든다.',
      },
      {
        code: 'D-3',
        title: '하루 한도는 “세고 나서”가 아니라 “자리부터”',
        body: '처음엔 오늘 만든 수를 센 뒤 몇 초짜리 AI 확인을 하고 저장했는데, 리뷰에서 동시 요청이면 한도를 넘는다는 [위험] 지적을 받았다. UPDATE … WHERE used < limit 한 문장으로 자리를 먼저 잡고, 거절되거나 실패하면 돌려준다.',
      },
      {
        code: 'D-4',
        title: '키가 없으면 가짜 AI로',
        body: '키 없이도 개발 · 테스트 · 화면 확인을 끝까지 했고, 실제 키는 배포 때 붙였다.',
      },
    ],
    // 막힌 것: 펼쳐 보는 대표 1건을 먼저, 나머지는 한 줄 요약 - 디딤 · Accio와 같은 방식
    troubles: [
      {
        code: 'T-1',
        title: '운영 DB에서만 마이그레이션이 실패했다',
        problem: '로컬(SQLite)은 참/거짓 칸 기본값 0을 받아 줬지만 Postgres는 거부했다. 테스트가 SQLite에서만 돌아서 못 잡았다.',
        solution: '기본값을 고치고, Postgres용 SQL을 접속 없이 만들어 검사하는 테스트를 추가했다.',
        lesson: '운영과 다른 DB로만 테스트하면 그 차이는 배포 때 터진다.',
      },
      { code: 'T-2', title: '쓰던 무료 AI 모델이 새 사용자에게 닫혔다', summary: 'gemini-2.5-flash가 새 사용자에게 닫혀서 "-latest" 별칭으로 바꿨다.' },
      { code: 'T-3', title: 'NVIDIA 무료 모델은 60초 안에 답하지 못했다', summary: '답하기 전에 생각부터 해서 70~83초가 걸렸다. 직접 재 보고 EXAONE을 골랐다.' },
      { code: 'T-4', title: '미리보기 배포까지 운영으로 판단했다', summary: '운영 비밀값을 복사하게 만들 뻔했다(리뷰 2차). 운영 판단 기준을 고쳤다.' },
    ],
    screens: {
      device: 'desktop',
      items: [
        { image: agStage, label: '무대 · 자막 박스' },
        { image: agPredict, label: '승부 예측' },
        { image: agResult, label: '결과 · 토론 품질' },
        { image: agHome, label: '홈 · 오늘의 토론' },
      ],
    },
    next: [
      { title: '심판 쏠림 고치기', body: 'AI 심판이 마지막 발언자(B편)를 편드는 쏠림이 있다(18개 중 17개)' },
      { title: '토론 만들기 열기', body: '로그인 키를 연결해 토론 만들기를 연다' },
      { title: '사람 분류와의 일치율', body: '‘사람 분류와의 일치율’ 지표를 잰다' },
    ],
    card: {
      title: 'Agora AI 토론장 - AI가 밸런스 게임으로 맞붙는다',
      desc: '한국 AI와 해외 AI가 3라운드로 토론하고, 발언의 핵심 한 구절이 예능 자막처럼 뜬다. 보기 전에 승부를 예측하고 AI 심판과 비교한다.',
    },
    figma: 'https://www.figma.com/design/QXz9VONI8xqLfc1c3moxGO/AI-%ED%86%A0%EB%A1%A0?node-id=17-461',
  },
  {
    // 글은 디딤 레포의 README · 결정(D-003 · D-005 · D-031 · D-033 · D-034) · 평가 회차 2026-11-17 · 트러블슈팅에서 옮겼다(사용자 승인 2026-11-19, F-015).
    slug: 'didim',
    tier: 'main',
    name: '디딤',
    title: '디딤 - 문장마다 근거가 달린 자소서',
    summary:
      '공부 기록(마크다운 · 노션)을 퀴즈로 복습하고, 그 기록에서 경험 카드를 뽑아 공고에 맞는 자소서 초안과 면접 연습까지 이어 주는 서비스. AI가 쓴 문장에는 어느 카드의 어느 칸에서 왔는지 근거를 붙이고, 기록에 없는 문장에는 밑줄을 긋는다.',
    roles: ['Design', 'Front', 'Back', 'DB'],
    info: [
      { label: '역할', value: '개인 작업 · 기여도 100%' },
      { label: '팀', value: '1명' },
      { label: '스택', value: 'Next.js 16 · FastAPI · PostgreSQL · NVIDIA Nemotron' },
    ],
    links: [
      { label: 'GitHub', href: DIDIM_GITHUB },
      { label: '평가 리포트', href: `${DIDIM_LIVE}/report` },
      { label: '샘플 체험', href: `${DIDIM_LIVE}/demo` },
    ],
    cover: { images: [dmDraft], device: 'desktop' },
    showcase: {
      tagline: '문장마다 근거가 달린 자소서',
      stats: ['지어낸 문장 경고율', '매칭 적중률'],
      shots: { kind: 'screens', main: dmDraft, overlay: dmCard, overlayDevice: 'desktop' },
    },
    structure: {
      title: '화면에서 구조까지',
      steps: [
        { key: 'WEB', name: 'Next.js 16', desc: '공개 화면(랜딩 · 리포트)은 미리 그리고, 회원 화면은 서버에서 로그인을 확인한다' },
        { key: 'API', name: 'FastAPI · Vercel Services', desc: '화면과 같은 주소의 /api/* 로 받는다. 모든 조회에 사용자 조건을 건다' },
        { key: 'AI', name: 'NVIDIA Nemotron', desc: '정해진 형식으로 받고, 인용이 원문에 글자 그대로 없으면 버린다' },
        { key: 'DB', name: 'PostgreSQL (Neon 싱가포르)', desc: '키워드 검색(pg_trgm). 구조는 Alembic 버전 파일로만 바꾼다' },
      ],
      note: 'AI 기능은 허용한 이메일만 쓴다. 공개 사이트에서는 실제 AI 결과를 넣어 둔 샘플 계정으로 같은 화면을 둘러본다.',
    },
    numbers: [
      { value: '100%', label: '지어낸 문장 경고율', note: 'AI 초안에서 기록에 없는 문장에 모두 경고했다' },
      { value: '100%', label: '심은 경험 찾은 비율', note: '노트에 심어 둔 경험 20개를 모두 카드 후보로 찾았다' },
      { value: '94.1%', label: '매칭 적중률', note: '공고 요구 역량과 내 카드 맞추기. 없는 근거로 만든 매칭이 5개 남았다' },
      { value: '75%', label: '심은 질문 잡은 비율', note: '지어낸 전제를 심은 면접 질문을 걸러 낸 비율. 남은 과제다' },
    ],
    why: '공부 기록은 계속 쌓이는데, 복습도 지원서도 매번 처음부터 다시 했다. 기록을 다시 읽지 않으니 배운 것이 남지 않고, 자소서를 쓸 때는 “그때 뭘 했더라”를 기억에 기대어 다시 찾았다. AI에게 자소서를 맡기면 빨리 쓸 수는 있다. 하지만 그럴듯한 문장 사이에 내가 하지 않은 일과 내지 않은 성과가 섞여 들어온다. 면접에서 그 문장을 물어보면 답할 수 없다. 그래서 AI가 지어낸 부분을 잡아내는 것을 가장 중요한 설계 목표로 두고, 그 설계가 실제로 얼마나 잡아내는지를 평가 수치로 공개했다.',
    decisions: [
      {
        code: 'D-1',
        title: '근거 없는 내용은 저장하지 않고 드러낸다',
        body: '퀴즈, 카드, 자소서 문장, 면접 질문마다 출처(노트 · 카드와 위치)를 함께 저장하고 화면에 보여 준다. 경험 카드 칸은 원문 인용이 있어야 채우고, 기록에 없으면 빈칸으로 둔다. 자소서 문장에 근거가 없으면 ‘근거 없음’, 카드에 없는 숫자 · 낱말이면 ‘확인 필요’를 띄운다.',
      },
      {
        code: 'D-2',
        title: '공개 사이트의 AI는 나만 쓰고, 다른 사람은 샘플 체험으로 본다',
        body: '디딤의 AI는 NVIDIA의 무료 API를 쓴다. 무료 체험판이라 보낸 내용과 받은 답이 기록되고 모델 개선에 쓰일 수 있다. 내 기록을 보낼 때는 괜찮지만, 다른 사람이 가입해 공부 기록과 경험을 올리면 그 내용이 그대로 넘어간다. “타인의 개인정보는 AI에 보내지 않는다”는 원칙과 부딪혀서, 공개 사이트에서는 남이 AI를 부르지 않게 했다. 대신 같은 기능을 그대로 볼 수 있게 했다. 가상 지원자의 기록을 실제 AI로 처리한 결과를 넣은 샘플 계정이 있고, 로그인 없이 기록 · 퀴즈 · 경험 카드 · 공고 매칭 · 근거 달린 자소서 · 면접 질문을 둘러볼 수 있다. 읽기만 되고, 쓰기와 AI 호출은 서버가 막는다. 막는 곳은 화면이 아니라 서버다. 구글 로그인 뒤 서버가 허용 목록의 이메일만 받는다. 버튼을 숨기는 것만으로는 막히지 않아서다. 데이터를 기록하지 않는 AI로 바꾸면 공개 범위를 다시 정한다.',
      },
      {
        code: 'D-3',
        title: '정답을 먼저 심은 가상 데이터로 잰다',
        body: '기능마다 정답을 정해 두고 쓴 가상 노트와 공고로 채점한다. 결과는 같은 요약 파일에서 /report 와 README 표로 공개한다. 사람 판정이 끝나지 않은 수치는 ‘판정 대기’로 두고 미리 채우지 않는다.',
      },
      {
        code: 'D-4',
        title: '화면과 백엔드를 한 주소로',
        body: 'Vercel Services로 Next.js와 FastAPI를 한 프로젝트에 올리고, /api/* 만 백엔드로 보낸다. 로그인 쿠키가 한 주소에 묶여서 주소가 다른 서버끼리 쿠키를 주고받는 설정이 필요 없다. DB는 Neon(싱가포르)이고 함수도 같은 지역에 둔다.',
      },
    ],
    // 막힌 것: 펼쳐 보는 대표 1건(T-5)을 먼저, 나머지는 한 줄 요약 - Accio와 같은 방식
    troubles: [
      {
        code: 'T-5',
        title: '배포: 지역 설정이 먹지 않아 함수가 미국에 있었다',
        problem: '설정 파일에 싱가포르를 적었지만, Services 방식에서는 적용되지 않았다. 그래서 함수는 미국, DB는 싱가포르에 있었고, 요청마다 태평양을 왕복했다.',
        solution: '응답 머리말(x-vercel-id)로 함수 지역을 확인하고 대시보드에서 싱가포르로 고정했다.',
        lesson: '설정 파일에 적은 값이 실제로 먹었는지는 배포 결과로 확인한다.',
      },
      { code: 'T-1', title: 'AI는 1분 넘게 걸리는데 프록시는 30초에 끊었다', summary: '화면은 실패로 보이는데 서버는 문제를 저장하는 어긋남이 생길 수 있었다. 기다리는 시간을 AI 전체 상한에 맞췄고, 배포 때는 Vercel 상한(120초)에 맞춰 AI 전체를 100초로 낮췄다.' },
      { code: 'T-2', title: '무료 AI API 한도 안에서 평가 돌리기', summary: '연달아 부르면 500 · 429 · 하루 한도 · 시간 초과가 났다. 호출 사이에 쉬고, 다시 시도하고, 노트마다 바로 저장해 중간에 멈춰도 결과가 남게 했다.' },
      { code: 'T-3', title: '검색 색인이 PostgreSQL 17에서 먹지 않았다', summary: '리뷰가 제안한 방법이 효과가 없었고, 값을 묶어 보내면 DB가 느린 방법을 골랐다. 후보를 한 번만 고르게 쿼리를 바꾸고 색인을 ‘사용자 + 본문’ 하나로 합쳤다.' },
      { code: 'T-4', title: '리포트 응답의 모양을 배열인지만 봤다', summary: '칸이 빠진 응답이 오면 랜딩까지 통째로 깨질 수 있었다. 테스트가 찾았고, 화면이 읽는 칸의 모양까지 검사해 수치 칸만 숨게 했다.' },
    ],
    screens: {
      device: 'desktop',
      items: [
        { image: dmDraft, label: '근거 달린 자소서' },
        { image: dmAnalysis, label: '공고 분석 · 내 근거' },
        { image: dmCard, label: '경험 카드 · 원문 인용' },
        { image: dmReport, label: '평가 리포트' },
      ],
    },
    next: [
      { title: '평가 수치 캐시', body: '첫 방문 때 랜딩 수치 칸이 늦게 뜬다' },
      { title: '공개 범위 다시 정하기', body: '데이터를 기록하지 않는 AI로 바꾸면 공개 범위를 다시 정한다. 사용자별 비용 상한과 ‘무엇을 AI에 보내는지’ 안내를 함께 정한다' },
      { title: '노션 연결 운영 적용', body: '노션 연결을 운영에도 적용한다' },
    ],
    card: {
      title: '디딤 - 문장마다 근거가 달린 자소서',
      desc: '공부 기록에서 경험 카드를 뽑아, 문장마다 근거가 붙은 자소서와 면접 질문을 만든다. 기록에 없는 문장은 밑줄로 잡아낸다.',
    },
    figma: 'https://www.figma.com/design/QmJiFtWEruu2JEpNixaOop/Didim?node-id=0-1',
  },
  {
    slug: 'accio',
    tier: 'main',
    name: 'Accio',
    title: 'Accio - AI 자연어 검색 쇼핑몰',
    summary:
      '“비 오는 날 신을 운동화”처럼 모호한 말도 알아듣는 쇼핑몰. 5인 팀 프로젝트에서 목업이던 AI 검색을, 실제로 검색어를 이해하도록 무료 스택 위에 다시 만들었다.',
    roles: ['Design', 'Front', 'Back', 'DB'],
    info: [
      { label: '역할', value: '다시 만들기 1인 - 디자인 · 프론트 · 백엔드 · DB' },
      { label: '팀', value: '원본 5명 → 다시 만들기 1명' },
      { label: '스택', value: 'React · FastAPI · Supabase · Gemini' },
    ],
    links: [
      { label: '팀 원본(v1) 보기', href: '/accio-v1/' },
      { label: '디자인 사례', href: '#/case/accio-redesign' },
      { label: '서비스 열기', href: ACCIO_LIVE },
    ],
    cover: { images: [acLiveHome], device: 'desktop' },
    showcase: {
      tagline: 'AI 자연어 검색 쇼핑몰',
      stats: ['검색 정확도 (상위 5개)', '운영비'],
      shots: { kind: 'screens', main: acLiveHome, overlay: acLiveHomeMo, overlayDevice: 'mobile' },
    },
    structure: {
      title: '화면에서 구조까지',
      steps: [
        { key: 'WEB', name: 'React · Vite', desc: '검색창 · AI 채팅 · “이렇게 이해했어요” 칩' },
        { key: 'API', name: 'FastAPI · Vercel Services', desc: '/api/search · /api/chat - 6초 넘으면 키워드 검색으로' },
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
      title: '검색 정확도 - 시험지 30문항',
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
        title: 'Gemini가 수십 초씩 느려진 날 - 규칙 해석 + 차단기',
        problem: '같은 날 짧은 질문도 18 ~ 46초(처음엔 0.66초). 채팅 해석이 매번 6초 시간 초과로 키워드 검색으로 돌아갔고, “5만원 이하로” 같은 이어지는 말은 결과가 0개, 답 하나에 8초가 걸렸다.',
        solution: '① Gemini가 안 될 때 규칙 해석 - 가격 · 제외 · 상품 종류를 읽고, 종류가 없으면 이전 대화 조건을 이어받는다. ② 차단기 - 연달아 2번 늦거나 실패하면 60초 동안 부르지 않고 바로 규칙 · 키워드 검색. 답 8.6초 → 2.1초.',
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
      title: 'Accio - AI 자연어 검색 쇼핑몰',
      desc: '“비 오는 날 신을 운동화”처럼 모호한 말도 알아듣는 쇼핑몰. Gemini가 검색어를 조건으로 바꾸고 SQL이 걸러 낸다.',
    },
    figma: 'https://www.figma.com/design/rDAy4sMyRqyF3lQ4baGLq2/ACCIO?node-id=464-2',
    designCase: 'accio-redesign',
  },
  {
    slug: 'maestro',
    tier: 'main',
    name: '마에스트로',
    title: '마에스트로 - 지금 열린 식당 3곳을 근거와 함께',
    summary:
      '낯선 서울 동네에서 동네 · 상황만 고르면 지금 열려 있는 식당 3곳을 지도와 영업시간 막대, 날짜 붙은 근거로 비교해 주는 모바일 웹. 해커톤에 출품하려던 앱을 리뉴얼했다.',
    roles: ['Design', 'Front', 'Back'],
    info: [
      { label: '역할', value: '개인 작업 · 기여도 100%' },
      { label: '팀', value: '1명' },
      { label: '스택', value: 'React · Zustand · Leaflet · FastAPI' },
    ],
    links: [
      { label: '디자인 사례', href: '#/case/maestro-redesign' },
      { label: '서비스 열기', href: '#/maestro' },
    ],
    cover: { images: [mrLiveResult], device: 'desktop' },
    showcase: {
      tagline: '지금 열린 식당 3곳을 근거와 함께',
      stats: ['첫 후보까지', '실패할 때 저장본'],
      shots: { kind: 'screens', main: mrLiveResult, overlay: mrLiveResultMo, overlayDevice: 'mobile' },
    },
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
        { image: mrLiveResult, label: '결과 - 목록 + 지도' },
        { image: mrPcDetail, label: '식당 상세 패널' },
      ],
    },
    card: {
      title: '마에스트로 - 지금 열린 식당 3곳',
      desc: '낯선 서울 동네에서 동네 · 상황만 고르면 지금 열려 있는 식당 3곳을 지도와 날짜 붙은 근거로 비교해 준다.',
    },
    figma: 'https://www.figma.com/design/Tec5SHtst0FxyN5P1bm4UT/%EB%A7%88%EC%97%90%EC%8A%A4%ED%8A%B8%EB%A1%9C?node-id=66-113',
    designCase: 'maestro-redesign',
  },
  {
    slug: 'planforme',
    tier: 'sub',
    name: 'PlanForMe',
    title: 'PlanForMe - 하루 할당량을 계산해 주는 플래너',
    summary:
      '총분량과 마감일만 넣으면 하루 할 일을 정해 주는 1인용 플래너. IA · 유저 플로우 · 계산 규칙부터 모바일 화면 14개와 컴포넌트까지 피그마로 설계하고 그대로 구현 · 배포했다.',
    roles: ['Design', 'Front', 'Back'],
    info: [
      { label: '역할', value: '개인 프로젝트 - 설계 · 디자인 · 구현 · 배포' },
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
        { key: 'API', name: 'FastAPI', desc: '하루 할당량 계산은 DB 없는 순수 함수 - 기획서 예시가 곧 테스트(8개)' },
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
      title: 'PlanForMe - 하루 할당량 플래너',
      desc: '총분량과 마감일만 넣으면 하루 할 일을 정해 주는 1인용 플래너. 피그마로 설계하고 그대로 구현 · 배포했다.',
    },
    figma: 'https://www.figma.com/design/yHn20tfa3RyUmmRYaRTYcl/PlanForMe?node-id=0-1',
    designCase: 'planforme',
  },
  {
    slug: 'mini-inflearn',
    tier: 'sub',
    name: '미니 인프런',
    title: '미니 인프런 - 포인트로 수강신청하는 강의 서비스',
    summary:
      '강의 목록 · 상세를 보고 포인트로 수강신청하는 작은 온라인 강의 서비스. 피그마 TechLearn 시안을 Next.js · FastAPI · PostgreSQL로 처음부터 직접 만들고 배포했다.',
    roles: ['Design', 'Front', 'Back', 'DB'],
    info: [
      { label: '역할', value: '개인 학습 프로젝트 - 디자인 · 프론트 · 백엔드 · DB' },
      { label: '팀', value: '1명' },
      { label: '스택', value: 'Next.js · TanStack Query · FastAPI · PostgreSQL' },
    ],
    links: [
      { label: 'GitHub 코드', href: 'https://github.com/give-it-a-shottt/mini-inflearn' },
      { label: '서비스 열기', href: MINI_INFLEARN_LIVE },
    ],
    cover: { images: [miHome], device: 'desktop' },
    structure: {
      title: '화면에서 구조까지',
      steps: [
        { key: 'WEB', name: 'Next.js (Pages Router) · Vercel', desc: '강의 목록 · 상세는 서버에서 그려 보내고(SSR), 수강신청은 TanStack Query' },
        { key: 'API', name: 'FastAPI · Render', desc: 'JWT 로그인, 수강신청은 201 · 400 · 401 · 404 · 409로 답한다' },
        { key: 'DB', name: 'PostgreSQL · Neon', desc: 'UNIQUE (user_id, course_id) · CHECK (points >= 0)' },
      ],
      note: '포인트 차감과 신청 기록은 한 트랜잭션 - 둘 다 성공해야 저장하고, 하나라도 실패하면 전부 되돌린다.',
    },
    numbers: [
      { value: '5가지', label: '수강신청 버튼 상태', note: '로그인 전 · 신청 가능 · 신청 중 · 수강 중 · 포인트 부족' },
      { value: '5가지', label: '수강신청 응답', note: '201 · 400(포인트 부족) · 401 · 404 · 409(이미 신청)' },
      { value: '1시간', label: '토큰 유효기간', note: 'JWT exp - 토큰이 새도 영원히 쓰이지 않게' },
      { value: '60만 번', label: '비밀번호 해시 반복', note: 'PBKDF2 + 소금, 원문은 저장하지 않는다' },
    ],
    why: '인프런 공고에 올라온 기술을 익히려고 만들었다. Next.js · FastAPI · PostgreSQL을 처음부터 직접 만들며 요청이 화면에서 DB까지 어떻게 흘러가는지 익히는 학습 프로젝트다.',
    decisions: [
      { code: 'D-1', title: 'user_id는 요청 body가 아니라 검증된 토큰에서만', body: 'body에 user_id를 넣어 남의 포인트로 신청하는 것을 막는다. 토큰 내용을 고치면 서명이 달라져 401.' },
      { code: 'D-2', title: '로그인 실패는 같은 401 문구로', body: '이메일 없음 · 비밀번호 틀림을 구분해서 답하면 가입 여부가 새어 나간다.' },
    ],
    troubles: [
      {
        code: 'T-1',
        title: '서로 다른 강의를 동시에 신청하면 포인트가 덜 빠짐 - 갱신 손실',
        problem: '35,000P로 33,000원 · 3,000원 강의를 동시에 신청하면, 잠금이 없을 때는 둘 다 성공하고 3,000P만 빠졌다.',
        solution: '유저 행을 SELECT … FOR UPDATE로 잠갔다. 잠금을 건 뒤에는 두 번째 요청이 400(포인트 부족)으로 막혔다. 동시 신청 스크립트로 재현해서 확인했다.',
      },
      { code: 'T-2', title: '포인트만 빠지고 기록은 없는 상태', summary: '포인트 차감과 신청 기록을 한 트랜잭션(session.begin())으로 묶어, 하나라도 실패하면 전부 되돌린다.' },
      { code: 'T-3', title: '버튼 연타 · 동시 요청으로 같은 강의 중복 신청', summary: 'DB에 UNIQUE (user_id, course_id)를 걸고, 위반하면 409로 알려 준다.' },
      { code: 'T-4', title: '신청 후 화면의 포인트가 옛 값으로 남음', summary: '신청에 성공하면 내 정보 캐시를 무효화(invalidateQueries)해서 새 포인트를 다시 받는다.' },
    ],
    screens: {
      device: 'desktop',
      items: [
        { image: miHome, label: '메인 홈' },
        { image: miLogin, label: '로그인' },
      ],
    },
    next: [
      { title: '토큰 보관', body: 'localStorage에서 HttpOnly 쿠키로 옮기고 refresh token 추가' },
      { title: '회원가입 화면', body: '지금은 API 문서(/docs)에서 가입' },
      { title: '스키마 변경 관리', body: 'schema.sql 직접 실행 대신 Alembic 마이그레이션' },
    ],
    card: {
      title: '미니 인프런 - 포인트 수강신청 강의 서비스',
      desc: '피그마 시안을 Next.js · FastAPI · PostgreSQL로 직접 만든 강의 서비스. JWT 로그인과 동시 신청까지 막았다.',
    },
    figma: 'https://www.figma.com/design/WLnNcSmrkE1zDS9lFPpg9p/techlearn-%EB%94%94%EC%9E%90%EC%9D%B8?node-id=28-2',
  },
  {
    slug: 'remind',
    tier: 'sub',
    name: 'remind',
    title: 'remind - 노션 학습노트 복습 퀴즈 앱',
    summary:
      '노션에 정리한 강의 노트를 객관식 · OX · 단답형 · 서술형 퀴즈로 복습하는 모바일 퍼스트 앱. 복습 흐름 · 오답노트 · 디자인 시스템을 피그마로 설계했다.',
    roles: ['Design', 'Front'],
    info: [
      { label: '역할', value: '개인 프로젝트' },
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
      title: 'remind - 노션 노트 복습 퀴즈 앱',
      desc: '노션에 정리한 강의 노트를 객관식 · OX · 단답형 · 서술형 퀴즈로 복습하는 모바일 퍼스트 앱.',
    },
    figma: 'https://www.figma.com/design/F9bo9j2bIabfqRtZW87ua2/remind?node-id=0-1',
    designCase: 'remind',
  },
  {
    slug: 'nightly',
    tier: 'sub',
    name: 'Nightly',
    title: 'Nightly - AI 수면 코칭 시안',
    summary:
      '피그마 「AI 수면」 시안의 홈 · 수면 대시보드 · AI 수면 코치 화면을 가짜 데이터로 옮겼다. 백엔드를 공부하려고 만드는 프로젝트라, 실제 서비스는 따로 만들고 있다.',
    roles: ['Design', 'Front'],
    info: [
      { label: '역할', value: '개인 프로젝트 - 디자인 · 프론트(시안)' },
      { label: '팀', value: '1명' },
      { label: '스택', value: 'React · TypeScript · Tailwind CSS' },
    ],
    links: [
      { label: '실제 서비스 코드', href: 'https://github.com/give-it-a-shottt/my-nightly-project' },
      { label: '시안 화면 열기', href: '#/nightly' },
    ],
    cover: { images: [ntSleep], device: 'desktop' },
    structure: {
      title: '화면 구성',
      steps: [
        { key: 'HOME', name: '홈', desc: '서비스 소개와 수면 데이터 · AI 코치 기능 카드' },
        { key: 'SLEEP', name: '수면 대시보드', desc: '수면 점수 · 단계 그래프 · 최근 7일 점수 · 기기 동기화 기록' },
        { key: 'COACH', name: 'AI 수면 코치', desc: '미리 써 둔 답을 30ms마다 두 글자씩 늘려 스트리밍처럼 보여 준다' },
      ],
      note: '서버 없이 코드 안 가짜 데이터만 쓴다. 1분에 5번까지 물을 수 있고, 넘기면 429 안내 뒤 1분 후 다시 열린다.',
    },
    numbers: [
      { value: '3개', label: '화면', note: '홈 · 수면 대시보드 · AI 코치 (PC · 모바일)' },
      { value: '1분에 5번', label: 'AI 코치 요청 제한', note: '넘기면 429 안내 후 1분 뒤 다시' },
      { value: '1024px', label: '화면 폭 기준', note: '이상은 PC 시안, 아래는 모바일 배치' },
    ],
    why: '백엔드를 공부하려고 만드는 프로젝트 Nightly의 화면이다. 지금은 피그마 시안을 화면으로 옮기고, 나중에 프로젝트 소개 페이지로 바꾼다.',
    screens: {
      device: 'desktop',
      items: [
        { image: ntHome, label: '홈' },
        { image: ntSleep, label: '수면 대시보드' },
        { image: ntCoach, label: 'AI 수면 코치' },
      ],
    },
    card: {
      title: 'Nightly - AI 수면 코칭 시안',
      desc: '수면 대시보드와 AI 코치를 피그마 시안대로 옮긴 화면. 실제 서비스는 백엔드 공부용으로 따로 만들고 있다.',
    },
    figma: 'https://www.figma.com/design/LByldIr3d9DfRfnAxblB32/AI-%EC%88%98%EB%A9%B4?node-id=0-1',
  },
  {
    slug: 'gameprobe',
    tier: 'sub',
    name: 'GAMEPROBE',
    title: 'GAMEPROBE - 발로란트 전적 · 공략 웹 서비스 설계',
    summary: findCase('gameprobe').description,
    roles: ['Design'],
    info: [
      { label: '역할', value: '화면 설계 · 디자인 시스템' },
      { label: '도구', value: 'Figma' },
      { label: '시안', value: '10개 영역 · 디자인 시스템 7장' },
    ],
    links: [
      { label: '디자인 사례', href: '#/case/gameprobe' },
      { label: '서비스 열기', href: 'https://valorant-platform.vercel.app/' },
    ],
    cover: { images: [gpHome], device: 'desktop' },
    numbers: [
      { value: '10개', label: '화면 영역', note: '전적 검색 · 매치 분석 · 메타 · 라인업 · 스모크 · 관리자까지' },
      { value: '7장', label: '디자인 시스템', note: '컬러 · 타이포 · 텍스트 위계 · 레이아웃 · 모서리 · 컴포넌트' },
    ],
    why: designProblem('gameprobe'),
    screens: {
      device: 'desktop',
      items: [
        { image: gpHome, label: '메인 홈' },
        { image: gpProfile, label: '플레이어 프로필' },
        { image: gpMatch, label: '매치 상세' },
        { image: gpLineup, label: '라인업' },
      ],
    },
    card: {
      title: 'GAMEPROBE - 발로란트 전적 · 공략',
      desc: '전적 검색부터 매치 분석, 메타 통계, 라인업 · 스모크 공략까지 10개 영역의 화면과 디자인 시스템을 설계했다.',
    },
    figma: 'https://www.figma.com/design/zMbn8YMcz2YgxuEatTZGlj/gameprobe?node-id=0-1',
    designCase: 'gameprobe',
  },
  {
    slug: 'flaseek',
    tier: 'sub',
    name: 'FLASEEK',
    title: 'FLASEEK - 자사몰 리뉴얼 시안',
    summary: findCase('flaseek-renewal').description,
    roles: ['Design', 'Front'],
    info: [
      { label: '역할', value: '개인 작업 · 기여도 100%' },
      { label: '도구', value: 'Figma · React' },
      { label: '시안', value: 'PC 4 · 모바일 6' },
    ],
    links: [
      { label: '디자인 사례', href: '#/case/flaseek-renewal' },
      { label: '시안 화면 열기', href: '#/flaseek' },
    ],
    cover: { images: [flPcMain], device: 'desktop' },
    structure: {
      title: '설계 핵심',
      steps: [
        { key: 'LAYOUT', name: '상단 GNB + 12칼럼', desc: '왼쪽 250px 고정 사이드바를 걷어내고 1200px 가운데로' },
        { key: 'ENTRY', name: '진입점 11곳 → 3곳', desc: '혜택 · 고객센터를 한 페이지씩으로 묶고 퀵메뉴를 줄임' },
        { key: 'CARD', name: '상품 카드', desc: '이미지 → 상품명 → 할인율 · 판매가 → 장당가 → 별점 순서 고정' },
        { key: 'DETAIL', name: '상세페이지', desc: '앵커 탭 · 900px 접기 · 고정 구매바로 어디서든 바로 구매' },
      ],
    },
    numbers: [
      { value: '11곳 → 3곳', label: '진입점', note: '멤버십 · 쿠폰 · 문의 버튼 중복 정리' },
      { value: '2.53 → 5.10', label: '버튼 글자 대비', note: '브랜드 핑크는 지키고 역할을 셋으로 나눔' },
      { value: '3안', label: '메인 시안 비교', note: '증거 · 두께 · 블랙 박스 중 A안 선택' },
    ],
    why: designProblem('flaseek-renewal'),
    screens: {
      device: 'desktop',
      items: [
        { image: flPcMain, label: '메인' },
        { image: flPcList, label: '상품 리스트' },
        { image: flPcDetail, label: '상품 상세' },
        { image: flPcLogin, label: '로그인' },
      ],
    },
    card: {
      title: 'FLASEEK - 자사몰 리뉴얼 시안',
      desc: '보정속옷 자사몰의 문제 4가지와 핑크 대비를 진단하고, PC · 모바일 화면과 디자인 시스템을 제안했다.',
    },
    figma: 'https://www.figma.com/design/Cv5stZORnc3A75SSvywqat/Untitled?node-id=0-1',
    designCase: 'flaseek-renewal',
  },
]

export function findProject(slug: string) {
  return PROJECT_LIST.find((p) => p.slug === slug)
}

/** 프로젝트 페이지 맨 아래 '다음 프로젝트' - 홈 카드 순서(PROJECT_LIST)로 돈다 */
export function nextProject(slug: string) {
  const i = PROJECT_LIST.findIndex((p) => p.slug === slug)
  return PROJECT_LIST[(i + 1) % PROJECT_LIST.length]
}
