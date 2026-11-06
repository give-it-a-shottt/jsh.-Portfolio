// 포트폴리오 확인 스크립트(F-011) — 테스트 러너 없이, 주소 해석과 프로젝트 데이터의 갈림길을 확인한다.
// 사이트 코드는 이미지·?raw 를 import 하므로 search-eval 처럼 Vite 로 불러온다.
//
//   npm run check        실패가 하나라도 있으면 종료 코드 1

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
  const { PROJECT_LIST, FEATURED_SLUGS, findProject, nextProject } = projects
  check('대표 프로젝트는 모두 데이터가 있다', FEATURED_SLUGS.filter((slug) => !findProject(slug)), [])
  check('없는 slug', findProject('없는-프로젝트'), undefined)
  check('빈 slug', findProject(''), undefined)
  check(
    '다음 프로젝트는 대표 순서로 돈다',
    FEATURED_SLUGS.map((slug) => nextProject(slug)?.slug),
    [...FEATURED_SLUGS.slice(1), FEATURED_SLUGS[0]],
  )
  const caseHrefs = new Set(CASES.map((c) => c.href).filter(Boolean))
  for (const p of PROJECT_LIST) {
    check(`${p.slug} · 왜 만들었나 있음`, p.why.length > 0, true)
    check(`${p.slug} · 버튼 1개 이상`, p.links.length > 0, true)
    check(`${p.slug} · 대표 화면 있음`, p.cover.images.length > 0 && p.cover.images.every(Boolean), true)
    check(`${p.slug} · 홈 카드 숫자 3개`, p.card.metrics.length, 3)
    check(
      `${p.slug} · 막힌 것의 사례 링크가 실제 사례`,
      (p.troubles ?? []).filter((t) => t.href && !caseHrefs.has(t.href)).map((t) => t.href),
      [],
    )
  }

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
} finally {
  await server.close()
}

console.log(`\n확인 ${passed + failed}개 · 통과 ${passed} · 실패 ${failed}`)
process.exit(failed ? 1 : 0)
