import { CASE_STORIES } from './caseStories'
import { CASES, type PortfolioCase } from './data'
import { NOTES, type StudyNote } from './notes'
import { rankCases } from './rank'
import { normalize, queryWords } from './searchText'

// 사이트 검색(F-007 S2) — 사례·노트를 '문서'로 보고, 두 글자 조각(bigram) 목차로 후보를 좁힌 뒤 글을 확인한다.
// 본문(사례의 문제·해결·결과, 디자인 시안 설명, 노트의 배운 것)까지 찾는다.
// 문서가 60여 개라 목차의 속도 이득은 거의 없다. 목차가 S3 랭킹(BM25)의 재료라서 지금 만든다.

interface SearchDoc {
  /** 'case:slug' · 'note:slug' */
  id: string
  /** 모든 필드를 이어 붙여 정규화한 글(공백·문장부호 없음) — 일치 확인용 */
  text: string
}

/** 디자인 사례의 시안·화면 설명 */
function designText(item: PortfolioCase) {
  const design = item.design
  if (!design) return []
  const groups = [design.variants, design.screens, design.mobileScreens, design.system, design.story, ...(design.sections ?? []).map((section) => section.items)]
  return [
    design.problem,
    design.role ?? '',
    ...(design.sections ?? []).flatMap((section) => [section.title, section.description]),
    ...groups.flatMap((group) => (group ?? []).flatMap((variant) => [variant.label, variant.note])),
  ]
}

function caseText(item: PortfolioCase) {
  const story = CASE_STORIES[item.slug]
  const body = story ? [story.problem, story.result ?? '', ...story.points.flatMap((point) => [point.title, point.body])] : []
  return [item.title, item.description, item.tags.join(' '), item.keywords, ...body, ...designText(item)].join(' ')
}

function noteText(note: StudyNote) {
  const body = [
    ...note.learned.flatMap((group) => [group.title, ...group.items]),
    ...(note.practice ?? []).flatMap((practice) => [practice.caption, practice.how]),
  ]
  return [note.title, note.summary, note.points.join(' '), note.tags.join(' '), note.keywords, ...body].join(' ')
}

/** 두 글자씩 겹쳐 자른 조각 — '디자인' → 디자 · 자인. 한 글자면 조각이 없다 */
function bigrams(text: string) {
  const grams = new Set<string>()
  for (let i = 0; i < text.length - 1; i++) grams.add(text.slice(i, i + 2))
  return grams
}

const DOCS: SearchDoc[] = [
  ...CASES.map((item) => ({ id: `case:${item.slug}`, text: normalize(caseText(item)) })),
  ...NOTES.map((note) => ({ id: `note:${note.slug}`, text: normalize(noteText(note)) })),
]

/** 역색인 — 조각마다 그 조각이 들어 있는 문서 번호. 책 뒤의 '찾아보기'와 같다 */
const INDEX = new Map<string, number[]>()
DOCS.forEach((doc, docIndex) => {
  for (const gram of bigrams(doc.text)) {
    const postings = INDEX.get(gram)
    if (postings) postings.push(docIndex)
    else INDEX.set(gram, [docIndex])
  }
})

const ALL_DOCS = DOCS.map((_, docIndex) => docIndex)

/**
 * 낱말 하나가 들어 있을 수 있는 문서 — 낱말의 조각이 모두 들어 있는 문서만 남긴다(목록 교집합).
 * 조각이 다 있어도 순서가 다를 수 있어서(디자·자인 ↔ 자인디자) 마지막에 글에서 한 번 더 확인한다.
 */
function candidates(term: string) {
  const grams = [...bigrams(term)]
  if (grams.length === 0) return ALL_DOCS
  const lists = grams.map((gram) => INDEX.get(gram) ?? []).sort((a, b) => a.length - b.length)
  return lists.slice(1).reduce((kept, list) => kept.filter((docIndex) => list.includes(docIndex)), lists[0])
}

/** 낱말이 들어 있는 문서. 낱말 그대로 또는 조사를 뗀 모양 중 하나라도 글에 있으면 된다 */
function docsWithWord(forms: string[]) {
  const found = new Set<number>()
  for (const form of forms) {
    for (const docIndex of candidates(form)) if (DOCS[docIndex].text.includes(form)) found.add(docIndex)
  }
  return found
}

/** 검색어의 낱말이 모두 들어 있는 문서 id(AND). 순서는 아직 없다 — S3 에서 점수로 매긴다 */
function matchedIds(query: string) {
  const words = queryWords(query)
  if (words.length === 0) return new Set<string>()
  const sets = words.map(docsWithWord)
  const [first, ...rest] = sets
  return new Set([...first].filter((docIndex) => rest.every((set) => set.has(docIndex))).map((docIndex) => DOCS[docIndex].id))
}

/** 검색 결과 — 사례는 레벨 순(rank.ts), 노트는 최신순(notes.ts). 빈 검색어면 전부 */
export function search(query: string) {
  if (!query.trim()) return { cases: rankCases(CASES), notes: NOTES }
  const ids = matchedIds(query)
  return {
    cases: rankCases(CASES.filter((item) => ids.has(`case:${item.slug}`))),
    notes: NOTES.filter((note) => ids.has(`note:${note.slug}`)),
  }
}

/** 색인 크기 — 채점기(search-eval)가 기록에 남긴다 */
export const INDEX_STATS = { docs: DOCS.length, grams: INDEX.size }
