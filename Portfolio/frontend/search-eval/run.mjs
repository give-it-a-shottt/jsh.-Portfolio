// 검색 채점기(F-007 S0) — queries.json 의 검색어를 실제 사이트 검색 코드(search.ts)로 돌려 점수를 낸다.
// 사이트 코드는 이미지·?raw 를 import 하므로 Node 로 바로 못 연다. Vite 로 불러온다.
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
  const { CASES } = await server.ssrLoadModule('/src/portfolio/data.ts')
  const { NOTES } = await server.ssrLoadModule('/src/portfolio/notes.ts')
  const { search, INDEX_STATS, NOTES_AFTER, NOTES_IN_MODULE } = await server.ssrLoadModule('/src/portfolio/search.ts')
  const { CASE_DETAILS } = await server.ssrLoadModule('/src/portfolio/caseDetails.ts')
  // 숨은 글 검사도 사이트 검색과 같은 글자 규칙(정규화 · 조사 떼기)을 쓴다
  const { containsAllWords, normalize } = await server.ssrLoadModule('/src/portfolio/searchText.ts')

  const testSet = JSON.parse(readFileSync(join(HERE, 'queries.json'), 'utf8'))
  checkIds(testSet.queries, CASES, NOTES)

  /**
   * '전체' 탭에서 보이는 순서 — 사례 NOTES_AFTER 개 → 노트 묶음 NOTES_IN_MODULE 개 → 나머지 사례.
   * 나머지 노트는 Study 탭에 있어 맨 뒤로 둔다. 배치 값은 SearchResults 와 같은 것(search.ts)을 쓴다.
   */
  const visibleOrder = (query) => {
    const found = search(query)
    const cases = found.cases.map((item) => `case:${item.slug}`)
    const notes = found.notes.map((note) => `note:${note.slug}`)
    if (notes.length === 0) return cases
    return [
      ...cases.slice(0, NOTES_AFTER),
      ...notes.slice(0, NOTES_IN_MODULE),
      ...cases.slice(NOTES_AFTER),
      ...notes.slice(NOTES_IN_MODULE),
    ]
  }

  const hidden = buildHidden(CASE_DETAILS, NOTES, normalize)
  const inHidden = (id, query) => containsAllWords(hidden.get(id) ?? '', query)
  const rows = testSet.queries.map((item) => grade(item, visibleOrder(item.query), inHidden))
  const report = summarize(rows)

  // 자동완성 시험지(S5) — 친 글자(치는 도중 포함)마다 기대한 제안이 목록에 나오는지
  const { getAllSuggestions } = await server.ssrLoadModule('/src/portfolio/suggest.ts')
  const suggestSet = JSON.parse(readFileSync(join(HERE, 'suggest.json'), 'utf8'))
  const suggestRows = suggestSet.inputs.map((item) => gradeSuggest(item, getAllSuggestions(item.input).map((s) => s.text)))
  report.suggest = summarizeSuggest(suggestRows)

  // 추천 검색어(S6) — 예전 방식(고정 키워드 5개)과 새 방식(결과 태그)을 같은 검색어로 나란히 잰다
  const { KEYWORDS } = await server.ssrLoadModule('/src/portfolio/data.ts')
  const { relatedSearches, didYouMean } = await server.ssrLoadModule('/src/portfolio/related.ts')
  const idsOf = (found) => new Set([...found.cases.map((c) => `case:${c.slug}`), ...found.notes.map((n) => `note:${n.slug}`)])
  const methods = {
    '고정 키워드': (query) => KEYWORDS.filter(({ label }) => label !== query).slice(0, 5).map(({ label }) => label),
    '결과 태그': (query, found) => relatedSearches(query, found.cases, found.notes),
  }
  report.related = gradeRelated(testSet.queries, methods, search, idsOf)
  report.didYouMean = gradeDidYouMean(testSet.queries, search, didYouMean, idsOf)

  const base = loadBase(baseName)
  console.log(`\n색인: 문서 ${INDEX_STATS.docs}개 · 두 글자 조각 ${INDEX_STATS.grams}개`)
  printReport(report, rows, base)
  printSuggest(report.suggest, suggestRows, base?.suggest)
  printRelated(report.related, report.didYouMean)
  if (saveAs) save(saveAs, report, rows)
} finally {
  await server.close()
}

// ── 채점 ────────────────────────────────────────────────────────────────

/** 검색어 하나의 점수. relevant 가 비어 있으면 '아무것도 안 나와야 하는' 검색어다 */
function grade(item, results, inHidden) {
  const { relevant } = item
  const ranks = relevant.map((id) => results.indexOf(id) + 1).filter((rank) => rank > 0)
  const firstRank = ranks.length ? Math.min(...ranks) : 0
  const missed = relevant.filter((id) => !results.includes(id))
  return {
    id: item.id,
    query: item.query,
    category: item.category,
    heldOut: Boolean(item.heldOut),
    negative: relevant.length === 0,
    total: results.length,
    top: results.slice(0, TOP_K),
    firstRank,
    hit: firstRank > 0 && firstRank <= TOP_K,
    reciprocal: firstRank ? 1 / firstRank : 0,
    recall: relevant.length ? (relevant.length - missed.length) / relevant.length : 1,
    // 놓친 정답 중, 검색이 아직 안 보는 글(코드 설명 · 팀 소개 · 노트의 써먹은 곳)에는 낱말이 다 있던 것
    missedInHidden: missed.filter((id) => inHidden(id, item.query)),
    missed,
  }
}

function summarize(rows) {
  // 처음 보는 검색어(heldOut)는 전체 점수에서 뺀다 — 단계끼리 같은 시험지로 비교하고, 규칙이 시험지에만 맞춰졌는지는 따로 본다
  const positive = rows.filter((row) => !row.negative && !row.heldOut)
  const heldOut = rows.filter((row) => !row.negative && row.heldOut)
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
    heldOut: heldOut.length ? metrics(heldOut) : undefined,
    // 정답이 없어야 하는 검색어에서 뭔가 나온 비율 — 낮을수록 좋다
    falsePositiveRate: avg(negative, (row) => (row.total > 0 ? 1 : 0)),
    negativeCount: negative.length,
    categories,
  }
}

// ── 자동완성 ────────────────────────────────────────────────────────────

/** 친 글자 하나의 점수 — 기대한 문구가 제안 목록 몇 번째에 있는지 */
function gradeSuggest(item, shown) {
  const rank = shown.indexOf(item.expect) + 1
  return { ...item, shown, rank, hit: rank > 0, reciprocal: rank ? 1 / rank : 0 }
}

function summarizeSuggest(allRows) {
  // 처음 보는 입력(heldOut)은 전체 점수에서 빼고 따로 — 검색 채점과 같은 이유
  const rows = allRows.filter((row) => !row.heldOut)
  const heldOut = allRows.filter((row) => row.heldOut)
  const avg = (list, pick) => (list.length ? list.reduce((sum, row) => sum + pick(row), 0) / list.length : 0)
  const metrics = (list) => ({
    count: list.length,
    zeroRate: avg(list, (row) => (row.shown.length === 0 ? 1 : 0)),
    hitRate: avg(list, (row) => (row.hit ? 1 : 0)),
    mrr: avg(list, (row) => row.reciprocal),
  })
  const categories = {}
  for (const name of [...new Set(rows.map((row) => row.category))]) categories[name] = metrics(rows.filter((row) => row.category === name))
  return { ...metrics(rows), heldOut: heldOut.length ? metrics(heldOut) : undefined, categories }
}

function printSuggest(summary, rows, base) {
  console.log(`\n자동완성 채점 — 친 글자 ${summary.count}개 (제안은 최대 6개)`)
  console.log('─'.repeat(64))
  console.log(`제안 없음       ${pct(summary.zeroRate)}${delta(summary.zeroRate, base?.zeroRate, true, true)}`)
  console.log(`목록에 나옴     ${pct(summary.hitRate)}${delta(summary.hitRate, base?.hitRate, true)}   기대한 문구가 6개 안에 있는 비율`)
  console.log(`MRR            ${num(summary.mrr)}${delta(summary.mrr, base?.mrr, false)}`)
  if (summary.heldOut) {
    const h = summary.heldOut
    console.log(`\n처음 보는 입력 ${h.count}개(전체 점수에서 뺌) — 목록에 나옴 ${pct(h.hitRate).trim()}${delta(h.hitRate, base?.heldOut?.hitRate, true)} · MRR ${num(h.mrr)}`)
  }
  console.log(`\n${padWide('유형별', 12)} 개수  목록에 나옴   MRR`)
  for (const [name, m] of Object.entries(summary.categories)) {
    console.log(`${padWide(name, 12)} ${String(m.count).padStart(4)}  ${pct(m.hitRate).padStart(11)}  ${num(m.mrr)}`)
  }
  const missed = rows.filter((row) => !row.hit || (verbose && row.hit))
  if (missed.length) console.log(verbose ? '\n친 글자별' : '\n못 맞힌 자동완성')
  for (const row of missed) {
    console.log(`${row.hit ? 'O' : 'X'} ${row.id} [${row.category}] "${row.input}" → 기대 "${row.expect}" — ${row.hit ? `${row.rank}번째` : `없음 (제안 ${row.shown.length}개)`}`)
  }
}

// ── 추천 검색어 ─────────────────────────────────────────────────────────

/**
 * 결과가 있는 검색어마다 추천 검색어를 받아, 추천 하나하나를 다시 검색해 본다.
 *   유효: 눌렀을 때 결과가 1건 이상 / 관련: 지금 결과와 겹치는 게 있음 / 새로움: 지금 결과에 없던 것이 나옴
 */
function gradeRelated(queries, methods, search, idsOf) {
  const out = {}
  const withResults = queries.filter((q) => idsOf(search(q.query)).size > 0)
  for (const [name, pick] of Object.entries(methods)) {
    const per = withResults.map((q) => {
      const found = search(q.query)
      const current = idsOf(found)
      const terms = pick(q.query, found)
      const checks = terms.map((term) => {
        const next = idsOf(search(term))
        return { valid: next.size > 0, related: [...next].some((id) => current.has(id)), novel: [...next].some((id) => !current.has(id)) }
      })
      const share = (key) => (checks.length ? checks.filter((c) => c[key]).length / checks.length : 0)
      return { count: terms.length, valid: share('valid'), related: share('related'), novel: share('novel') }
    })
    const avg = (key) => per.reduce((sum, row) => sum + row[key], 0) / per.length
    out[name] = { queries: per.length, count: avg('count'), valid: avg('valid'), related: avg('related'), novel: avg('novel') }
  }
  return out
}

/** 0건인 검색어 중 '혹시 이걸 찾으셨나요?'를 받은 것, 그리고 그 제안이 정답을 찾아 주는지 */
function gradeDidYouMean(queries, search, didYouMean, idsOf) {
  const zero = queries.filter((q) => idsOf(search(q.query)).size === 0)
  const rows = zero.map((q) => {
    const suggestion = didYouMean(q.query)
    const found = suggestion ? idsOf(search(suggestion)) : new Set()
    return { id: q.id, query: q.query, negative: q.relevant.length === 0, suggestion, helps: q.relevant.some((id) => found.has(id)) }
  })
  return { zero: rows.length, suggested: rows.filter((r) => r.suggestion).length, helps: rows.filter((r) => r.helps).length, rows }
}

function printRelated(related, dym) {
  console.log('\n추천 검색어 채점 — 결과가 있는 검색어마다 추천을 다시 검색해 봄')
  console.log('─'.repeat(64))
  console.log(`${padWide('방식', 12)} 검색어  추천 수   유효   관련  새로움`)
  for (const [name, m] of Object.entries(related)) {
    console.log(`${padWide(name, 12)} ${String(m.queries).padStart(6)}  ${m.count.toFixed(1).padStart(6)}  ${pct(m.valid)}  ${pct(m.related)}  ${pct(m.novel)}`)
  }
  console.log(`\n'혹시 이걸 찾으셨나요?' — 0건 검색어 ${dym.zero}개 중 제안 ${dym.suggested}개, 그중 정답을 찾아 준 것 ${dym.helps}개`)
  for (const row of dym.rows) {
    console.log(`  ${row.id.padEnd(4)} "${row.query}"${row.negative ? ' (없어야 함)' : ''} → ${row.suggestion ? `"${row.suggestion}"${row.helps ? ' · 정답 찾음' : ''}` : '제안 없음'}`)
  }
}

// ── 숨은 글 ─────────────────────────────────────────────────────────────

/** 사이트 검색(search.ts)이 아직 보지 않는 글 — 사례의 사용 기술·코드 설명·팀 소개, 노트의 '써먹은 곳' */
function buildHidden(details, notes, normalize) {
  const hidden = new Map()
  for (const [slug, detail] of Object.entries(details)) {
    const parts = [detail.stack.join(' '), ...detail.code.flatMap((sample) => [sample.label, sample.note])]
    if (detail.team) {
      const { team } = detail
      parts.push(team.name, team.tagline, ...team.highlights.flatMap((h) => [h.title, h.body]), ...team.demos.flatMap((d) => [d.title, d.body]), team.architecture.caption)
    }
    hidden.set(`case:${slug}`, normalize(parts.join(' ')))
  }
  for (const note of notes) {
    hidden.set(`note:${note.slug}`, normalize((note.applied ?? []).flatMap((a) => [a.learned, a.used]).join(' ')))
  }
  return hidden
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
  if (report.heldOut) {
    const h = report.heldOut
    const hb = base?.heldOut
    console.log(`\n처음 보는 검색어 ${h.count}개(전체 점수에서 뺌) — 상위 ${TOP_K} 적중률 ${pct(h.hitAtK).trim()}${delta(h.hitAtK, hb?.hitAtK, true)} · 0건 비율 ${pct(h.zeroRate).trim()}${delta(h.zeroRate, hb?.zeroRate, true, true)} · MRR ${num(h.mrr)}`)
  }

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
    if (row.missedInHidden.length) console.log(`       검색이 안 보는 글(코드 설명 등)에만 있어서 놓침: ${row.missedInHidden.join(', ')}`)
    const elsewhere = row.missed.filter((id) => !row.missedInHidden.includes(id))
    if (elsewhere.length) console.log(`       못 찾음: ${elsewhere.join(', ')}`)
    if (row.negative && row.total) console.log(`       나온 것: ${row.top.join(', ')}${row.total > TOP_K ? ' …' : ''}`)
  }
}
