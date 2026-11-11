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
  const { PROJECT_LIST, findProject, nextProject, designPreview } = projects
  check('프로젝트 slug 는 겹치지 않는다', new Set(PROJECT_LIST.map((p) => p.slug)).size, PROJECT_LIST.length)
  check('없는 slug', findProject('없는-프로젝트'), undefined)
  check('빈 slug', findProject(''), undefined)
  const order = PROJECT_LIST.map((p) => p.slug)
  check('다음 프로젝트는 홈 카드 순서로 돈다', order.map((slug) => nextProject(slug)?.slug), [...order.slice(1), order[0]])
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
} finally {
  await server.close()
}

console.log(`\n확인 ${passed + failed}개 · 통과 ${passed} · 실패 ${failed}`)
process.exit(failed ? 1 : 0)
