// 검색 채점기(F-007 S0) — queries.json 의 검색어를 실제 사이트 검색 코드로 돌려 점수를 낸다.
// 사이트 코드(data.ts · notes.ts)는 이미지·?raw 를 import 하므로 Node 로 바로 못 연다. Vite 로 불러온다.
//
//   npm run search:eval                       점수 보기 (runs/ 에 S0 가 있으면 그것과 비교)
//   npm run search:eval -- --save S1          점수를 runs/S1.json 에 남기기
//   npm run search:eval -- --base S1          비교 기준 바꾸기
//   npm run search:eval -- --verbose          맞힌 검색어까지 전부 보기

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const RUNS = join(HERE, 'runs')
/** 상위 몇 위까지를 '보인다'로 칠지 — 결과 첫 화면에서 눈이 먼저 가는 줄 수 */
const TOP_K = 3

const args = process.argv.slice(2)
const option = (name) => {
  const index = args.indexOf(`--${name}`)
  return index >= 0 ? args[index + 1] : undefined
}
const saveAs = option('save')
const baseName = option('base') ?? 'S0'
const verbose = args.includes('--verbose')

const server = await createServer({
  root: ROOT,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false },
})

try {
  const { CASES, matchesQuery } = await server.ssrLoadModule('/src/portfolio/data.ts')
  const { NOTES, matchesNote } = await server.ssrLoadModule('/src/portfolio/notes.ts')
  const { rankCases } = await server.ssrLoadModule('/src/portfolio/rank.ts')
  const { CASE_DETAILS } = await server.ssrLoadModule('/src/portfolio/caseDetails.ts')

  const testSet = JSON.parse(readFileSync(join(HERE, 'queries.json'), 'utf8'))
  checkIds(testSet.queries, CASES, NOTES)

  /**
   * '전체' 탭에서 보이는 순서 그대로 — SearchResults.tsx 를 따라 한다.
   * 사례 3개(NOTES_AFTER) → 노트 묶음 3개(NOTES_IN_MODULE) → 나머지 사례. 나머지 노트는 Study 탭에 있어 맨 뒤로 둔다.
   * SearchResults 의 규칙이 바뀌면 여기도 고친다(S3 에서 검색 함수를 한 곳으로 모을 때 없앤다).
   */
  const search = (query) => {
    const cases = rankCases(CASES.filter((item) => matchesQuery(item, query))).map((item) => `case:${item.slug}`)
    const notes = NOTES.filter((note) => matchesNote(note, query)).map((note) => `note:${note.slug}`)
    if (notes.length === 0) return cases
    return [...cases.slice(0, 3), ...notes.slice(0, 3), ...cases.slice(3), ...notes.slice(3)]
  }

  const bodies = buildBodies(CASES, NOTES, CASE_DETAILS)
  const rows = testSet.queries.map((item) => grade(item, search(item.query), bodies))
  const report = summarize(rows)

  printReport(report, rows, loadBase(baseName))
  if (saveAs) save(saveAs, report, rows)
} finally {
  await server.close()
}

// ── 채점 ────────────────────────────────────────────────────────────────

/** 검색어 하나의 점수. relevant 가 비어 있으면 '아무것도 안 나와야 하는' 검색어다 */
function grade(item, results, bodies) {
  const { relevant } = item
  const ranks = relevant.map((id) => results.indexOf(id) + 1).filter((rank) => rank > 0)
  const firstRank = ranks.length ? Math.min(...ranks) : 0
  const missed = relevant.filter((id) => !results.includes(id))
  return {
    id: item.id,
    query: item.query,
    category: item.category,
    negative: relevant.length === 0,
    total: results.length,
    top: results.slice(0, TOP_K),
    firstRank,
    hit: firstRank > 0 && firstRank <= TOP_K,
    reciprocal: firstRank ? 1 / firstRank : 0,
    recall: relevant.length ? (relevant.length - missed.length) / relevant.length : 1,
    // 놓친 정답 중, 검색어 낱말이 전부 본문(상세·배운 것)에는 들어 있던 것 — 본문을 안 뒤져서 놓친 것
    missedInBody: missed.filter((id) => containsAll(bodies.get(id) ?? '', item.query)),
    missed,
  }
}

function summarize(rows) {
  const positive = rows.filter((row) => !row.negative)
  const negative = rows.filter((row) => row.negative)
  const avg = (list, pick) => (list.length ? list.reduce((sum, row) => sum + pick(row), 0) / list.length : 0)
  const metrics = (list) => ({
    count: list.length,
    zeroRate: avg(list, (row) => (row.total === 0 ? 1 : 0)),
    hitAtK: avg(list, (row) => (row.hit ? 1 : 0)),
    mrr: avg(list, (row) => row.reciprocal),
    recall: avg(list, (row) => row.recall),
  })
  const categories = {}
  for (const name of [...new Set(positive.map((row) => row.category))]) {
    categories[name] = metrics(positive.filter((row) => row.category === name))
  }
  return {
    overall: metrics(positive),
    // 정답이 없어야 하는 검색어에서 뭔가 나온 비율 — 낮을수록 좋다
    falsePositiveRate: avg(negative, (row) => (row.total > 0 ? 1 : 0)),
    negativeCount: negative.length,
    categories,
  }
}

// ── 본문 ────────────────────────────────────────────────────────────────

/** 지금 검색이 보지 않는 글까지 합친 '본문' — 사례 상세(문제·해결·결과), 디자인 시안 설명, 노트의 배운 것 */
function buildBodies(cases, notes, details) {
  const bodies = new Map()
  for (const item of cases) {
    const detail = details[item.slug]
    const design = item.design
    const parts = [item.title, item.description, item.tags.join(' '), item.keywords]
    if (detail) parts.push(detail.problem, detail.result ?? '', ...detail.points.flatMap((p) => [p.title, p.body]))
    if (design) {
      parts.push(design.problem)
      const groups = [design.variants, design.screens, design.mobileScreens, design.system, design.story, ...(design.sections ?? []).map((s) => s.items)]
      for (const group of groups) for (const v of group ?? []) parts.push(v.label, v.note)
    }
    bodies.set(`case:${item.slug}`, parts.join(' ').toLowerCase())
  }
  for (const note of notes) {
    const parts = [note.title, note.summary, note.points.join(' '), note.tags.join(' '), note.keywords]
    parts.push(...note.learned.flatMap((group) => [group.title, ...group.items]))
    for (const p of note.practice ?? []) parts.push(p.caption, p.how)
    bodies.set(`note:${note.slug}`, parts.join(' ').toLowerCase())
  }
  return bodies
}

function containsAll(text, query) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return words.length > 0 && words.every((word) => text.includes(word))
}

// ── 출력 · 저장 ─────────────────────────────────────────────────────────

function checkIds(queries, cases, notes) {
  const known = new Set([...cases.map((c) => `case:${c.slug}`), ...notes.map((n) => `note:${n.slug}`)])
  const unknown = queries.flatMap((q) => q.relevant.filter((id) => !known.has(id)).map((id) => `${q.id} → ${id}`))
  if (unknown.length) throw new Error(`queries.json 에 없는 사례·노트가 있어요:\n  ${unknown.join('\n  ')}`)
}

function loadBase(name) {
  const file = join(RUNS, `${name}.json`)
  return existsSync(file) && name !== saveAs ? { name, ...JSON.parse(readFileSync(file, 'utf8')) } : null
}

function save(name, report, rows) {
  mkdirSync(RUNS, { recursive: true })
  const perQuery = Object.fromEntries(rows.map((row) => [row.id, { total: row.total, firstRank: row.firstRank, recall: row.recall }]))
  const body = { savedAt: new Date().toISOString().slice(0, 10), ...report, perQuery }
  writeFileSync(join(RUNS, `${name}.json`), `${JSON.stringify(body, null, 2)}\n`)
  console.log(`\n저장했어요 → search-eval/runs/${name}.json`)
}

// 위의 top-level await 가 먼저 돌기 때문에 화살표 함수(const)가 아니라 함수 선언으로 둔다
function pct(value) {
  return `${(value * 100).toFixed(0)}%`.padStart(4)
}

/** 터미널에서 한글은 영문 두 칸을 차지한다 — padEnd 는 글자 수로 세서 표가 어긋나므로 폭으로 센다 */
function padWide(text, width) {
  const used = [...text].reduce((sum, char) => sum + (/[ᄀ-ᇿ㄰-㆏가-힣]/.test(char) ? 2 : 1), 0)
  return text + ' '.repeat(Math.max(0, width - used))
}

function num(value) {
  return value.toFixed(2)
}

function delta(now, before, asPct, lowerIsBetter = false) {
  if (before === undefined) return ''
  const diff = now - before
  if (Math.abs(diff) < 1e-9) return '  (±0)'
  const better = lowerIsBetter ? diff < 0 : diff > 0
  const text = asPct ? `${diff > 0 ? '+' : ''}${(diff * 100).toFixed(0)}%p` : `${diff > 0 ? '+' : ''}${diff.toFixed(2)}`
  return `  (${text} ${better ? '좋아짐' : '나빠짐'})`
}

function printReport(report, rows, base) {
  const { overall } = report
  const b = base?.overall
  console.log(`\n검색 채점 — 정답 있는 검색어 ${overall.count}개 · 정답 없어야 하는 검색어 ${report.negativeCount}개${base ? ` · 비교 기준 ${base.name}(${base.savedAt})` : ''}`)
  console.log('─'.repeat(64))
  console.log(`0건 비율        ${pct(overall.zeroRate)}${delta(overall.zeroRate, b?.zeroRate, true, true)}   낮을수록 좋아요`)
  console.log(`상위 ${TOP_K} 적중률   ${pct(overall.hitAtK)}${delta(overall.hitAtK, b?.hitAtK, true)}`)
  console.log(`MRR            ${num(overall.mrr)}${delta(overall.mrr, b?.mrr, false)}   1이면 정답이 늘 1위`)
  console.log(`찾은 비율       ${pct(overall.recall)}${delta(overall.recall, b?.recall, true)}   정답 중 결과에 나온 몫`)
  console.log(`엉뚱한 결과     ${pct(report.falsePositiveRate)}${delta(report.falsePositiveRate, base?.falsePositiveRate, true, true)}   정답 없어야 하는데 뭔가 나온 비율`)

  console.log(`\n${padWide('유형별', 12)} 개수   0건 상위${TOP_K}   MRR 찾은 비율`)
  for (const [name, m] of Object.entries(report.categories)) {
    console.log(`${padWide(name, 12)} ${String(m.count).padStart(4)}  ${pct(m.zeroRate)}  ${pct(m.hitAtK)}  ${num(m.mrr)}  ${pct(m.recall)}`)
  }

  console.log(verbose ? '\n검색어별' : '\n못 맞힌 검색어 (--verbose 로 전부 보기)')
  for (const row of rows) {
    const ok = row.negative ? row.total === 0 : row.hit && row.recall === 1
    if (ok && !verbose) continue
    const mark = ok ? 'O' : 'X'
    const where = row.negative
      ? `${row.total}건 (0건이어야 함)`
      : `${row.total}건 · 첫 정답 ${row.firstRank ? `${row.firstRank}위` : '없음'} · 찾은 비율 ${pct(row.recall).trim()}`
    console.log(`${mark} ${row.id.padEnd(4)} [${row.category}] "${row.query}" — ${where}`)
    if (row.missedInBody.length) console.log(`       본문에만 있어서 놓침: ${row.missedInBody.join(', ')}`)
    const elsewhere = row.missed.filter((id) => !row.missedInBody.includes(id))
    if (elsewhere.length) console.log(`       못 찾음: ${elsewhere.join(', ')}`)
    if (row.negative && row.total) console.log(`       나온 것: ${row.top.join(', ')}${row.total > TOP_K ? ' …' : ''}`)
  }
}
