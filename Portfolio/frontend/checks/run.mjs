// 포트폴리오 확인 스크립트(F-011) - 테스트 러너 없이, 주소 해석과 프로젝트 데이터의 갈림길을 확인한다.
// 사이트 코드는 이미지·?raw 를 import 하므로 search-eval 처럼 Vite 로 불러온다.
//
//   npm run check        실패가 하나라도 있으면 종료 코드 1

import { readdirSync, readFileSync } from 'node:fs'
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
  // projects.ts 는 사례 slug · design.problem 이 없으면 불러올 때 오류를 낸다 - 여기서 먼저 잡힌다
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
  const { PROJECT_LIST, findProject, nextProject, designPreview, hasDesign, projectSections, showcaseProjects, showcaseStats, serviceLink, mainIndexColumns } = projects
  check('프로젝트 slug 는 겹치지 않는다', new Set(PROJECT_LIST.map((p) => p.slug)).size, PROJECT_LIST.length)
  check('없는 slug', findProject('없는-프로젝트'), undefined)
  check('빈 slug', findProject(''), undefined)
  const order = PROJECT_LIST.map((p) => p.slug)
  check('다음 프로젝트는 홈 카드 순서로 돈다', order.map((slug) => nextProject(slug)?.slug), [...order.slice(1), order[0]])
  // 메인 · 서브(D-008, F-015 ~ F-019): 메인 6개를 목록 앞에, 첫 번째는 찰칵셰프
  const tiers = PROJECT_LIST.map((p) => p.tier)
  check('모든 프로젝트에 tier 가 main · sub 중 하나', tiers.filter((t) => t !== 'main' && t !== 'sub').length, 0)
  check('메인은 찰칵셰프 · 거기붐벼? · Agora · 디딤 · Accio · 마에스트로 순', PROJECT_LIST.filter((p) => p.tier === 'main').map((p) => p.slug), ['snapchef', 'geogi', 'agora', 'didim', 'accio', 'maestro'])
  // 메인 기댓값(위 slug 6개)은 사용자가 정한 순서라 고정한다 - 메인을 바꾸면 여기도 같이 바꾼다(D-008)
  const mainCount = tiers.filter((t) => t === 'main').length
  check('메인이 목록 앞에 모여 있고 서브는 그 뒤에만', tiers.every((t, i) => (i < mainCount ? t === 'main' : t === 'sub')), true)
  check('서브가 1개 이상', tiers.length - mainCount > 0, true)
  check('메인은 6개(F-019)', mainCount, 6)
  // 메인 스크롤 섹션(F-018 · D-009): showcase 가 없으면 홈 메인에서 조용히 빠지므로, 메인 전부에 있는지 · 숫자 이름이 맞는지 본다
  const showcase = showcaseProjects(PROJECT_LIST)
  check('메인 모두 홈 스크롤 섹션에 나온다', showcase.map((p) => p.slug), PROJECT_LIST.filter((p) => p.tier === 'main').map((p) => p.slug))
  check('서브에는 showcase 를 두지 않는다', PROJECT_LIST.filter((p) => p.tier === 'sub' && p.showcase).map((p) => p.slug), [])
  for (const p of showcase) {
    check(`${p.name} · 섹션 숫자 두 개를 numbers 에서 찾는다`, showcaseStats(p).map((s) => s.label), p.showcase.stats)
    check(`${p.name} · 섹션 한 줄이 비어 있지 않다`, p.showcase.tagline.trim().length > 0, true)
    check(`${p.name} · 섹션 화면이 모두 있다`, (p.showcase.shots.kind === 'phones' ? p.showcase.shots.images : [p.showcase.shots.main, p.showcase.shots.overlay]).every(Boolean), true)
    check(`${p.name} · 서비스 버튼은 링크의 마지막`, serviceLink(p), p.links[p.links.length - 1])
  }
  check('숫자 이름이 틀리면 그 칸은 빠진다', showcaseStats({ ...showcase[0], showcase: { ...showcase[0].showcase, stats: ['없는 이름', showcase[0].showcase.stats[1]] } }).length, 1)
  check('링크가 없으면 서비스 버튼도 없다', serviceLink({ links: [] }), undefined)

  // 메인 스크롤 섹션의 움직임(F-018): 위치 계산은 순수 함수라 값으로 확인한다
  const { activeIndex, easeInOut, stripPosition, textOffset, textOpacity } = await server.ssrLoadModule('/src/portfolio/home/showcaseMotion.ts')
  check('곡선 · 0 과 1 에서 시작하고 끝난다(밖의 값은 자른다)', [-1, 0, 0.5, 1, 2].map(easeInOut), [0, 0, 0.5, 1, 1])
  check('화면 띠 · 프로젝트마다 딱 맞게 선다', [0, 1, 2, 3, 4].map(stripPosition), [0, 1, 2, 3, 4])
  check('화면 띠 · 앞뒤 15%는 멈춰 있다', [0.1, 0.9, 2.1].map(stripPosition), [0, 1, 2])
  check('화면 띠 · 가운데에서 반을 지난다', stripPosition(1.5), 1.5)
  const steps = Array.from({ length: 401 }, (_, i) => i / 100)
  check('화면 띠 · 내리는 동안 거꾸로 가지 않는다', steps.every((x, i) => i === 0 || stripPosition(x) >= stripPosition(steps[i - 1])), true)
  check('글 · 자기 자리에서 다 보이고 한 칸 떨어지면 안 보인다', [-1, 0, 1].map(textOpacity), [0, 1, 0])
  check('글 · 멀리 떨어진 글은 안 보인다', [-4, -2, 2, 4].map(textOpacity), [0, 0, 0, 0])
  check('글 · 넘어가는 동안 두 글이 다 사라지는 순간이 없다', steps.filter((x) => x <= 1).every((x) => textOpacity(x) + textOpacity(x - 1) > 0.05), true)
  check('글 · 다 보일 때는 제자리', Math.abs(textOffset(0)), 0)
  check('글 · 떠날 때는 위로, 들어올 때는 아래에서', [textOffset(0.4) < 0, textOffset(-0.4) > 0], [true, true])
  check('현재 위치 · 반을 넘으면 다음, 스프링이 넘쳐도 범위 안', [-0.2, 0.49, 0.51, 3.6, 4.3].map((x) => activeIndex(x, 5)), [0, 0, 1, 4, 4])
  check('찰칵셰프 링크는 GitHub · 서비스 보기(마지막 = 주 버튼)', findProject('snapchef')?.links, [
    { label: 'GitHub', href: 'https://github.com/give-it-a-shottt/ClickChef' },
    { label: '서비스 보기', href: 'https://snapchef-sigma.vercel.app' },
  ])
  check('거기붐벼? 링크는 GitHub · 서비스 보기(마지막 = 주 버튼)', findProject('geogi')?.links, [
    { label: 'GitHub', href: 'https://github.com/give-it-a-shottt/geogi-boombyeo' },
    { label: '서비스 보기', href: 'https://geogi-boombyeo.shop' },
  ])
  // 피그마 링크(F-017 · F-019): 공개하지 않기로 한 프로젝트만 비운다 - 실수로 빠뜨린 것을 잡으려고 목록을 고정한다
  check('피그마 링크가 없는 프로젝트는 찰칵셰프 · 거기붐벼?뿐', PROJECT_LIST.filter((p) => !p.figma).map((p) => p.slug), ['snapchef', 'geogi'])
  check('디자인 섹션 - 피그마 링크만 있음', hasDesign({ figma: 'https://www.figma.com/design/x' }), true)
  check('디자인 섹션 - Design 사례만 있음', hasDesign({ designCase: 'remind' }), true)
  check('디자인 섹션 - 둘 다 없으면 그리지 않는다', hasDesign({}), false)
  check('디자인 섹션 - 빈 문자열도 없는 것으로 본다', hasDesign({ figma: '' }), false)
  check('거기붐벼?는 디자인 섹션이 없다', hasDesign(findProject('geogi')), false)
  check('찰칵셰프는 디자인 섹션이 없다', hasDesign(findProject('snapchef')), false)
  // 목차(F-017): 섹션 번호는 목차 순서에서 나온다 - id 가 겹치거나 '디자인' 줄과 섹션이 어긋나면 번호가 틀어진다
  const sectionIds = (p) => projectSections(p).map((s) => s.id)
  check('목차 섹션 id 는 프로젝트 안에서 겹치지 않는다', PROJECT_LIST.filter((p) => new Set(sectionIds(p)).size !== sectionIds(p).length).map((p) => p.slug), [])
  check("목차의 '디자인' 줄은 디자인 섹션이 있을 때만", PROJECT_LIST.filter((p) => sectionIds(p).includes('design') !== hasDesign(p)).map((p) => p.slug), [])
  check('거기붐벼? 목차는 왜 · 결정 · 막힌 것 · 화면 · 다음', sectionIds(findProject('geogi')), ['why', 'decisions', 'troubles', 'screens', 'next'])
  check('찰칵셰프 목차는 왜 · 결정 · 막힌 것 · 화면 · 다음', sectionIds(findProject('snapchef')), ['why', 'decisions', 'troubles', 'screens', 'next'])
  // 승인받은 글의 줄 수(F-017 거기붐벼? · F-019 찰칵셰프) - 줄을 빠뜨리거나 더하면 여기서 잡힌다.
  // [숫자, 결정, 막힌 것, 화면, 다음] - 사용자가 승인한 초안의 줄 수라 고정한다
  const APPROVED_COUNTS = { geogi: [4, 4, 5, 4, 3], snapchef: [4, 4, 5, 4, 3] }
  const codes = (prefix, n) => Array.from({ length: n }, (_, i) => `${prefix}-${i + 1}`)
  for (const [slug, counts] of Object.entries(APPROVED_COUNTS)) {
    const p = findProject(slug)
    check(`${slug} · 숫자 · 결정 · 막힌 것 · 화면 · 다음 줄 수`, [p?.numbers.length, p?.decisions?.length, p?.troubles?.length, p?.screens.items.length, p?.next?.length], counts)
    check(`${slug} · 결정 · 막힌 것 번호`, [p?.decisions?.map((d) => d.code), p?.troubles?.map((t) => t.code)], [codes('D', counts[1]), codes('T', counts[2])])
  }
  // 홈 목차 칸 수(F-019) - 메인 수만큼 한 줄, 메인이 없으면 목차를 그리지 않으므로 값도 없다
  check('홈 목차 칸 수 = 메인 수', mainIndexColumns(showcase.length), `repeat(${showcase.length}, minmax(0, 1fr))`)
  check('홈 목차 칸 수 - 6개 · 1개 · 0개', [6, 1, 0].map(mainIndexColumns), ['repeat(6, minmax(0, 1fr))', 'repeat(1, minmax(0, 1fr))', undefined])
  check('Agora 링크는 GitHub · 서비스 보기(마지막 = 주 버튼)', findProject('agora')?.links, [
    { label: 'GitHub', href: 'https://github.com/give-it-a-shottt/AgoraAI' },
    { label: '서비스 보기', href: 'https://agora-ai-seven.vercel.app' },
  ])
  check('디딤 링크는 GitHub · 평가 리포트 · 샘플 체험(마지막 = 주 버튼)', findProject('didim')?.links, [
    { label: 'GitHub', href: 'https://github.com/give-it-a-shottt/Didim' },
    { label: '평가 리포트', href: 'https://didim-gamma.vercel.app/report' },
    { label: '샘플 체험', href: 'https://didim-gamma.vercel.app/demo' },
  ])
  // 프로젝트 기간은 보여 주지 않는다(F-019, 사용자 요청 2026-11-26) - 정보 띠 · 사례 숫자에 다시 들어오면 여기서 잡힌다
  // 정보 띠 라벨은 역할 · 팀 · 스택뿐이라 '기간'이 들어간 라벨('개발 기간' 등)까지 막는다. 프로젝트 numbers 는
  // '토큰 유효기간' 같은 결과 숫자가 있어 보지 않는다
  check("프로젝트 정보 띠에 '기간'이 없다", PROJECT_LIST.filter((p) => p.info.some((i) => /기간/.test(i.label))).map((p) => p.slug), [])
  check("사례 숫자에 '기간'이 없다", CASES.filter((c) => (c.metrics ?? []).some((m) => m.label === '기간')).map((c) => c.slug), [])
  // 정보 띠는 넓은 화면에서 3칸(ProjectPage lg:grid-cols-3) - 줄이 늘면 다음 줄로 흐르므로 여기서 먼저 알린다
  check('정보 띠는 3칸 이하', PROJECT_LIST.filter((p) => p.info.length > 3).map((p) => p.slug), [])
  const caseHrefs = new Set(CASES.map((c) => c.href).filter(Boolean))
  for (const p of PROJECT_LIST) {
    check(`${p.slug} · 왜 만들었나 있음`, p.why.trim().length > 0, true)
    // 글 칸이 비면 화면에 제목만 남는다(F-019 R3) - 결정 · 막힌 것 · 다음은 제목과 본문이 모두 있어야 한다
    check(`${p.slug} · 결정 제목 · 본문 있음`, (p.decisions ?? []).filter((d) => !d.title.trim() || !d.body.trim()).map((d) => d.code), [])
    check(`${p.slug} · 막힌 것 제목 · 내용 있음`, (p.troubles ?? []).filter((t) => !t.title.trim() || !(t.summary?.trim() || (t.problem?.trim() && t.solution?.trim()))).map((t) => t.code), [])
    check(`${p.slug} · 다음 단계 제목 · 본문 있음`, (p.next ?? []).filter((n) => !n.title.trim() || !n.body.trim()).map((n) => n.title), [])
    check(`${p.slug} · 버튼 1개 이상`, p.links.length > 0, true)
    check(`${p.slug} · 대표 화면 있음`, p.cover.images.length > 0 && p.cover.images.every(Boolean), true)
    check(`${p.slug} · 홈 카드 제목 · 설명 있음`, Boolean(p.card.title && p.card.desc), true)
    if (p.figma !== undefined) check(`${p.slug} · 피그마 공개 링크`, /^https:\/\/www\.figma\.com\/design\//.test(p.figma) && !p.figma.includes('t='), true)
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

  // ── 홈 개편(F-018): 랜딩을 뺀 뒤 남은 조각이 없는지, 엔대시 · 엠대시가 다시 들어오지 않았는지
  const sources = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const file = join(dir, entry.name)
      if (entry.isDirectory()) walk(file)
      else if (/\.(tsx?|css|json)$/.test(entry.name)) sources.push([file, readFileSync(file, 'utf8')])
    }
  }
  walk(join(ROOT, 'src'))
  sources.push(['index.html', readFileSync(join(ROOT, 'index.html'), 'utf8')])
  check('랜딩 조각을 부르는 코드가 없다', sources.filter(([, text]) => /landing\/|CoverLanding|landingSeen/.test(text)).map(([file]) => file), [])
  check('Ivory 테마 이름이 남아 있지 않다', sources.filter(([, text]) => /data-theme="ivory"|theme = 'ivory'/.test(text)).map(([file]) => file), [])
  // 첫 화면 목차 · 현재 위치 점은 showcaseAnchor id 로 스크롤한다 - 붙잡는 화면과 펼친 화면 둘 다 그 id 를 그려야 눌렀을 때 움직인다
  const showcaseSource = readFileSync(join(ROOT, 'src/portfolio/home/ProjectShowcase.tsx'), 'utf8').replace(/\r\n/g, '\n')
  const part = (name) => showcaseSource.slice(showcaseSource.indexOf(`function ${name}(`), showcaseSource.indexOf('\n}\n', showcaseSource.indexOf(`function ${name}(`)))
  for (const name of ['Pinned', 'Stacked']) check(`메인 섹션 · ${name} 이 목차가 찾아갈 자리를 그린다`, part(name).includes('id={showcaseAnchor(p.slug)}'), true)
  check('메인 섹션 · 좁은 화면 · 낮은 창 · 움직임 줄이기에서는 붙잡지 않는다', /const PINNED = '\(min-width: 1024px\) and \(min-height: 700px\) and \(prefers-reduced-motion: no-preference\)'/.test(showcaseSource), true)
  check('엔대시 · 엠대시를 쓰지 않는다', sources.filter(([, text]) => /[\u2013\u2014]/.test(text)).map(([file]) => file), [])
} finally {
  await server.close()
}

console.log(`\n확인 ${passed + failed}개 · 통과 ${passed} · 실패 ${failed}`)
process.exit(failed ? 1 : 0)
