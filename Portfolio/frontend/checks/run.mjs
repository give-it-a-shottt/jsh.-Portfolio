// 포트폴리오 확인 스크립트(F-011) — 테스트 러너 없이, 주소 해석과 프로젝트 데이터의 갈림길을 확인한다.
// 사이트 코드는 이미지·?raw 를 import 하므로 search-eval 처럼 Vite 로 불러온다.
//
//   npm run check        실패가 하나라도 있으면 종료 코드 1

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const server = await createServer({
  root: ROOT,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false },
})

let failed = 0
let passed = 0
function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (ok) passed++
  else {
    failed++
    console.log(`✗ ${name}\n    기대: ${JSON.stringify(expected)}\n    실제: ${JSON.stringify(actual)}`)
  }
}

try {
  const routes = await server.ssrLoadModule('/src/portfolio/routes.ts')
  const data = await server.ssrLoadModule('/src/portfolio/data.ts')
  // projects.ts 는 사례 slug · design.problem 이 없으면 불러올 때 오류를 낸다 — 여기서 먼저 잡힌다
  const projects = await server.ssrLoadModule('/src/portfolio/projects.ts')

  // ── 탭 주소 해석: 새 탭 · 예전 탭(front · back) · 이상한 값
  const { readTab, searchHref, projectHref, isExternal } = routes
  for (const tab of ['all', 'design', 'fullstack', 'study']) check(`readTab('${tab}')`, readTab(tab), tab)
  check("readTab('front') → fullstack", readTab('front'), 'fullstack')
  check("readTab('back') → fullstack", readTab('back'), 'fullstack')
  for (const odd of [null, '', 'constructor', 'toString', '__proto__', 'hasOwnProperty', 'Front', 'xyz'])
    check(`readTab(${JSON.stringify(odd)}) → all`, readTab(odd), 'all')
  check('searchHref 빈 값', searchHref(), '#/search')
  check('searchHref 검색어 + 탭', searchHref('AI', 'fullstack'), '#/search?q=AI&tab=fullstack')
  check('projectHref', projectHref('accio'), '#/project/accio')
  check('isExternal 해시 주소', isExternal('#/maestro'), false)
  check('isExternal 바깥 주소', isExternal('https://example.com/'), true)
  check('isExternal 정적 빌드', isExternal('/accio-v1/'), true)

  // ── 사례 분류 → 탭 · 역할
  const { CASES, caseTab, caseRoles } = data
  check('caseTab Design', caseTab({ type: 'Design' }), 'design')
  check('caseTab Front', caseTab({ type: 'Front' }), 'fullstack')
  check('caseTab Back', caseTab({ type: 'Back' }), 'fullstack')
  check('caseRoles 기본값', caseRoles({ type: 'Back' }), ['Back'])
  check('caseRoles 지정값', caseRoles({ type: 'Front', roles: ['Front', 'Back'] }), ['Front', 'Back'])
  check('사례 roles 는 Design · Front · Back · DB 만', CASES.flatMap((c) => c.roles ?? []).filter((r) => !['Design', 'Front', 'Back', 'DB'].includes(r)), [])

  // ── 프로젝트 데이터
  const { PROJECT_LIST, findProject, nextProject, designPreview, mainGridLayout } = projects
  check('프로젝트 slug 는 겹치지 않는다', new Set(PROJECT_LIST.map((p) => p.slug)).size, PROJECT_LIST.length)
  check('없는 slug', findProject('없는-프로젝트'), undefined)
  check('빈 slug', findProject(''), undefined)
  const order = PROJECT_LIST.map((p) => p.slug)
  check('다음 프로젝트는 홈 카드 순서로 돈다', order.map((slug) => nextProject(slug)?.slug), [...order.slice(1), order[0]])
  // 메인 · 서브(D-008, F-015 · F-016): 메인 4개를 목록 앞에, 첫 번째는 Agora AI 토론장
  const tiers = PROJECT_LIST.map((p) => p.tier)
  check('모든 프로젝트에 tier 가 main · sub 중 하나', tiers.filter((t) => t !== 'main' && t !== 'sub').length, 0)
  check('메인은 Agora · 디딤 · Accio · 마에스트로 순', PROJECT_LIST.filter((p) => p.tier === 'main').map((p) => p.slug), ['agora', 'didim', 'accio', 'maestro'])
  // 메인 기댓값(위 slug 4개)은 사용자가 정한 순서라 고정한다 — 메인을 바꾸면 여기도 같이 바꾼다(D-008)
  const mainCount = tiers.filter((t) => t === 'main').length
  check('메인이 목록 앞에 모여 있고 서브는 그 뒤에만', tiers.every((t, i) => (i < mainCount ? t === 'main' : t === 'sub')), true)
  check('서브가 1개 이상', tiers.length - mainCount > 0, true)
  // 메인 큰 카드 줄(F-016): 4개면 2칸(2×2), 그 밖엔 3칸 — 4개를 3칸에 두면 하나가 혼자 남는다
  check('메인 4개면 2칸, 그 밖엔 3칸', [1, 2, 3, 4, 5, 6].map((n) => mainGridLayout(n).cols), [3, 3, 3, 2, 3, 3])
  check('지금 메인 개수의 칸 수', mainGridLayout(mainCount).cols, mainCount === 4 ? 2 : 3)
  check('Agora 링크는 GitHub · 서비스 보기(마지막 = 주 버튼)', findProject('agora')?.links, [
    { label: 'GitHub', href: 'https://github.com/give-it-a-shottt/AgoraAI' },
    { label: '서비스 보기', href: 'https://agora-ai-seven.vercel.app' },
  ])
  check('디딤 링크는 GitHub · 평가 리포트 · 샘플 체험(마지막 = 주 버튼)', findProject('didim')?.links, [
    { label: 'GitHub', href: 'https://github.com/give-it-a-shottt/Didim' },
    { label: '평가 리포트', href: 'https://didim-gamma.vercel.app/report' },
    { label: '샘플 체험', href: 'https://didim-gamma.vercel.app/demo' },
  ])
  const caseHrefs = new Set(CASES.map((c) => c.href).filter(Boolean))
  for (const p of PROJECT_LIST) {
    check(`${p.slug} · 왜 만들었나 있음`, p.why.length > 0, true)
    check(`${p.slug} · 버튼 1개 이상`, p.links.length > 0, true)
    check(`${p.slug} · 대표 화면 있음`, p.cover.images.length > 0 && p.cover.images.every(Boolean), true)
    check(`${p.slug} · 홈 카드 제목 · 설명 있음`, Boolean(p.card.title && p.card.desc), true)
    check(`${p.slug} · 피그마 공개 링크`, /^https:\/\/www\.figma\.com\/design\//.test(p.figma) && !p.figma.includes('t='), true)
    if (p.designCase) check(`${p.slug} · 디자인 섹션 시안 있음`, designPreview(p.designCase).length > 0, true)
    check(
      `${p.slug} · 막힌 것의 사례 링크가 실제 사례`,
      (p.troubles ?? []).filter((t) => t.href && !caseHrefs.has(t.href)).map((t) => t.href),
      [],
    )
  }

  // ── 첫 화면 데이터(F-013): 대표 레포 · GitHub 잔디 저장본
  const { REPOS, CONTRIBUTIONS, GITHUB_USER } = await server.ssrLoadModule('/src/portfolio/profile.ts')
  const saved = JSON.parse(readFileSync(join(ROOT, 'src/portfolio/githubContributions.json'), 'utf8'))
  check('대표 레포의 프로젝트 페이지가 실제로 있다', REPOS.filter((r) => r.project && !findProject(r.project)).map((r) => r.name), [])
  check('잔디 저장본 주인 = 화면의 GitHub 사용자', saved.user, GITHUB_USER)
  const days = CONTRIBUTIONS.days
  check('잔디 저장본은 300일 이상', days.length >= 300, true)
  check('잔디 날짜는 오름차순 · 겹치지 않음', days.every((d, i) => i === 0 || days[i - 1].date < d.date), true)
  check('잔디 진하기는 0~4', days.filter((d) => !(Number.isInteger(d.level) && d.level >= 0 && d.level <= 4)).length, 0)
  check('잔디 합계 = 날마다 기여 수의 합', CONTRIBUTIONS.total, days.reduce((sum, d) => sum + d.count, 0))

  // ── 공부 노트(F-012): 합친 노트의 예전 주소 · 새 노트 틀
  const { NOTES, resolveNoteSlug } = await server.ssrLoadModule('/src/portfolio/notes.ts')
  const slugs = new Set(NOTES.map((n) => n.slug))
  check('노트 slug 는 겹치지 않는다', slugs.size, NOTES.length)
  for (const note of NOTES.filter((n) => n.replaces)) {
    check(`${note.slug} · 예전 주소가 이 노트로 이어진다`, note.replaces.map(resolveNoteSlug), note.replaces.map(() => note.slug))
    check(`${note.slug} · 예전 노트가 따로 남아 있지 않다`, note.replaces.filter((old) => slugs.has(old)), [])
  }
  for (const note of NOTES.filter((n) => n.sections)) {
    check(`${note.slug} · 개념 4개 이상`, note.sections.length >= 4, true)
    check(`${note.slug} · 개념 제목이 겹치지 않는다`, new Set(note.sections.map((s) => s.title)).size, note.sections.length)
    check(`${note.slug} · 개념마다 설명이 있다`, note.sections.filter((s) => !s.body).map((s) => s.title), [])
  }
  check('없는 노트 주소는 그대로', resolveNoteSlug('없는-노트'), '없는-노트')

  // ── Study 홈 대표 강의(F-004 8차): 최신 노트 날짜 포함 7일(차이 0~6일) 안 강의, 최소 2 · 최대 4
  const { FEATURED_COURSES, pickFeatured } = await server.ssrLoadModule('/src/portfolio/notes.ts')
  check(
    '노트 날짜는 YYYY.MM.DD 이고 실제 있는 날짜',
    NOTES.filter((n) => {
      const m = /^(\d{4})\.(\d{2})\.(\d{2})$/.exec(n.date)
      if (!m) return true
      const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]))
      return d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3]
    }).map((n) => `${n.slug} ${n.date}`),
    [],
  )
  check('실제 대표 강의는 2~4개', FEATURED_COURSES.length >= 2 && FEATURED_COURSES.length <= 4, true)
  check('실제 대표 강의 이름은 겹치지 않는다', new Set(FEATURED_COURSES.map((c) => c.course)).size, FEATURED_COURSES.length)
  // 강의 하나 = 최신 노트 날짜 하나. 입력은 최근 공부한 순
  const pick = (...dates) => pickFeatured(dates.map((date) => ({ notes: [{ date }] }))).map((c) => c.notes[0].date)
  check('대표 강의 · 강의가 없으면 빈 목록', pick(), [])
  check('대표 강의 · 강의가 1개뿐이면 1개', pick('2026.11.11'), ['2026.11.11'])
  check('대표 강의 · 최근 강의가 1개여도 최소 2개', pick('2026.11.11', '2026.10.01', '2026.09.01'), ['2026.11.11', '2026.10.01'])
  check('대표 강의 · 차이 6일은 넣고 딱 7일은 뺀다', pick('2026.11.11', '2026.11.08', '2026.11.05', '2026.11.04'), ['2026.11.11', '2026.11.08', '2026.11.05'])
  check('대표 강의 · 달이 바뀌어도 날짜 차이로 센다', pick('2026.12.01', '2026.11.28', '2026.11.25', '2026.11.24'), ['2026.12.01', '2026.11.28', '2026.11.25'])
  check(
    '대표 강의 · 최근 강의가 많아도 최대 4개',
    pick('2026.11.11', '2026.11.10', '2026.11.10', '2026.11.09', '2026.11.08', '2026.11.07'),
    ['2026.11.11', '2026.11.10', '2026.11.10', '2026.11.09'],
  )

  // ── techlearn → 미니 인프런(D-006): 프로젝트 카드와 예전 주소가 배포 사이트로 간다
  const { MINI_INFLEARN_LIVE } = data
  const { isOldTechlearnPath } = routes
  check('MINI_INFLEARN_LIVE 는 https 바깥 주소', /^https:\/\//.test(MINI_INFLEARN_LIVE) && isExternal(MINI_INFLEARN_LIVE), true)
  check('미니 인프런 프로젝트의 서비스 열기 → 배포 사이트', findProject('mini-inflearn')?.links.at(-1)?.href, MINI_INFLEARN_LIVE)
  for (const old of ['/techlearn', '/techlearn/courses', '/techlearn/course/nextjs-pages'])
    check(`예전 주소 ${old} → 배포 사이트로`, isOldTechlearnPath(old), true)
  for (const other of ['/', '/techlearnx', '/nightly', '/project/accio'])
    check(`${other} 는 techlearn 주소가 아니다`, isOldTechlearnPath(other), false)

  // ── 자소서형 랜딩(F-014): 첫 방문 판단(탭마다 한 번, Q-007) · 저장소를 못 쓸 때 · 글 데이터
  const { shouldShowLanding, markLandingSeen } = await server.ssrLoadModule('/src/portfolio/landing/landingSeen.ts')
  const memoryStorage = () => {
    const box = new Map()
    return { getItem: (k) => (box.has(k) ? box.get(k) : null), setItem: (k, v) => box.set(k, String(v)) }
  }
  const realStorage = globalThis.sessionStorage
  try {
    globalThis.sessionStorage = memoryStorage()
    check('랜딩 · 처음이면 보여 준다', shouldShowLanding(), true)
    markLandingSeen()
    check('랜딩 · 기록한 뒤에는 안 보여 준다', shouldShowLanding(), false)
    globalThis.sessionStorage = { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('blocked') } }
    check('랜딩 · 저장소가 막히면 보여 준다', shouldShowLanding(), true)
    let threw = false
    try { markLandingSeen() } catch { threw = true }
    check('랜딩 · 저장소가 막혀도 기록이 오류를 내지 않는다', threw, false)
    delete globalThis.sessionStorage
    check('랜딩 · 저장소가 아예 없으면 보여 준다', shouldShowLanding(), true)
    threw = false
    try { markLandingSeen() } catch { threw = true }
    check('랜딩 · 저장소가 아예 없어도 기록이 오류를 내지 않는다', threw, false)
  } finally {
    if (realStorage === undefined) delete globalThis.sessionStorage
    else globalThis.sessionStorage = realStorage
  }

  // Q-008: 처음 연 화면이 홈이 아니면 '봤음' 기록 — App.tsx 의 첫 주소 비교가 남아 있는지 (지우면 다른 화면을 거쳐 홈에 올 때 랜딩이 다시 뜬다)
  const appSource = readFileSync(join(ROOT, 'src/App.tsx'), 'utf8')
  check('랜딩 · 첫 주소가 홈이 아니면 봤음으로 기록한다(App.tsx)', /if \(entryPath !== "\/"\) markLandingSeen\(\)/.test(appSource), true)

  // 랜딩을 못 그리면(조각 못 받음 · 그리다 오류) 빈 화면 대신 홈으로 — 오류 경계의 세 단계를 직접 불러 확인
  const { default: LandingBoundary } = await server.ssrLoadModule('/src/portfolio/landing/LandingBoundary.tsx')
  let failCalls = 0
  const boundary = new LandingBoundary({ onFail: () => failCalls++, children: '랜딩' })
  check('랜딩 경계 · 평소에는 랜딩을 그린다', boundary.render(), '랜딩')
  check('랜딩 경계 · 오류가 나면 실패 상태로', LandingBoundary.getDerivedStateFromError(new Error('chunk')), { failed: true })
  boundary.state = LandingBoundary.getDerivedStateFromError(new Error('chunk'))
  boundary.componentDidCatch(new Error('chunk'))
  check('랜딩 경계 · 실패하면 아무것도 그리지 않는다', boundary.render(), null)
  check('랜딩 경계 · 실패하면 홈으로 넘기라고 한 번 알린다', failCalls, 1)

  const { CHAPTERS, CLOSING, QUOTE } = await server.ssrLoadModule('/src/portfolio/landing/landingContent.ts')
  check('랜딩 · 장 id 가 겹치지 않는다', new Set(CHAPTERS.map((c) => c.id)).size, CHAPTERS.length)
  check('랜딩 · 장마다 문장이 있다', CHAPTERS.filter((c) => c.sentences.length === 0).map((c) => c.id), [])
  check('랜딩 · 성공 기준 강조 단어가 문장 안에 있다', QUOTE.accent.filter((w) => !QUOTE.lines.flat().includes(w)), [])
  // 사용자 결정(2026-11-18)으로 뺀 문단(생산 라인 · 영상 기획 · 회사 지원)이 다시 들어오지 않았는지
  const allText = [...CHAPTERS.flatMap((c) => c.sentences), ...CLOSING.sentences, CLOSING.last].join(' ')
  for (const word of ['생산', '의료기기', '영상', '두어스', '지원'])
    check(`랜딩 · 뺀 문단 단어 '${word}' 가 없다`, allText.includes(word), false)
} finally {
  await server.close()
}

console.log(`\n확인 ${passed + failed}개 · 통과 ${passed} · 실패 ${failed}`)
process.exit(failed ? 1 : 0)
