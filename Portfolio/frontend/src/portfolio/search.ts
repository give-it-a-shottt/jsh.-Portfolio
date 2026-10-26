import { CASE_STORIES } from './caseStories'
import { CASES, type PortfolioCase } from './data'
import { NOTES, type StudyNote } from './notes'
import { rankCases } from './rank'
import { isShortLatin, latinWords, normalize, queryWords } from './searchText'

// 사이트 검색(F-007) — 사례·노트를 '문서'로 보고 점수를 매겨 순서를 정한다.
//   S2  두 글자 조각(bigram) 목차로 후보를 좁힌 뒤 글을 확인한다. 본문까지 찾는다.
//   S3  BM25 점수 — 낱말이 많이 나올수록, 드문 낱말일수록, 제목에 있을수록 위로. 레벨은 살짝 얹는다.

/** 문서를 나눈 칸. 같은 낱말이라도 어느 칸에 있느냐로 무게가 다르다 */
type Field = 'title' | 'meta' | 'summary' | 'body'

/** 칸별 무게 — 제목에 있으면 본문의 3배로 친다. 태그·keywords 는 작성자가 고른 말이라 요약보다 무겁다 */
const FIELD_WEIGHT: Record<Field, number> = { title: 3, meta: 2, summary: 1.5, body: 1 }
const FIELDS = Object.keys(FIELD_WEIGHT) as Field[]

/** BM25 상수 — 널리 쓰는 기본값. K1 은 같은 낱말이 여러 번 나올 때 점수가 얼마나 더 오를지, B 는 긴 글을 얼마나 깎을지 */
const K1 = 1.2
const B = 0.75

/** 레벨 한 단계마다 점수에 곱하는 덤 — 레벨 4 는 ×1.3. 관련도가 비슷할 때만 순서를 바꿀 만큼 작게 둔다 */
const LEVEL_BOOST = 0.1

/** '전체' 탭 배치 — 사례 몇 개 뒤에 노트 묶음을 끼울지. SearchResults 와 채점기(search-eval)가 같이 쓴다 */
export const NOTES_AFTER = 3
export const NOTES_IN_MODULE = 3

interface SearchDoc {
  /** 'case:slug' · 'note:slug' */
  id: string
  /** 칸마다 정규화한 글(공백·문장부호 없음) */
  fields: Record<Field, string>
  /** 칸마다 영어·숫자 낱말 — 짧은 영어 검색어('ai')를 통째로 맞춰 볼 때 쓴다 */
  words: Record<Field, string[]>
  /** 노트는 레벨이 없어 1로 둔다 */
  level: number
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

/** 칸별 원문으로 문서 만들기 — 정규화한 글과 영어 낱말 목록을 함께 만들어 둔다 */
function makeDoc(id: string, level: number, raw: Record<Field, string>): SearchDoc {
  const fields = {} as Record<Field, string>
  const words = {} as Record<Field, string[]>
  for (const field of FIELDS) {
    fields[field] = normalize(raw[field])
    words[field] = latinWords(raw[field])
  }
  return { id, level, fields, words }
}

function caseDoc(item: PortfolioCase): SearchDoc {
  const story = CASE_STORIES[item.slug]
  const body = story ? [story.problem, story.result ?? '', ...story.points.flatMap((point) => [point.title, point.body])] : []
  return makeDoc(`case:${item.slug}`, item.level, {
    title: item.title,
    meta: [item.tags.join(' '), item.keywords].join(' '),
    summary: item.description,
    body: [...body, ...designText(item)].join(' '),
  })
}

function noteDoc(note: StudyNote): SearchDoc {
  const body = [
    ...note.learned.flatMap((group) => [group.title, ...group.items]),
    ...(note.practice ?? []).flatMap((practice) => [practice.caption, practice.how]),
  ]
  return makeDoc(`note:${note.slug}`, 1, {
    title: note.title,
    meta: [note.tags.join(' '), note.keywords].join(' '),
    summary: [note.summary, ...note.points].join(' '),
    body: body.join(' '),
  })
}

/** 두 글자씩 겹쳐 자른 조각 — '디자인' → 디자 · 자인. 한 글자면 조각이 없다 */
function bigrams(text: string) {
  const grams = new Set<string>()
  for (let i = 0; i < text.length - 1; i++) grams.add(text.slice(i, i + 2))
  return grams
}

const DOCS: SearchDoc[] = [...CASES.map(caseDoc), ...NOTES.map(noteDoc)]

/** 칸별 평균 길이 — BM25 가 '이 글이 평균보다 긴가'를 볼 때 쓴다 */
const AVG_LENGTH = Object.fromEntries(
  FIELDS.map((field) => [field, DOCS.reduce((sum, doc) => sum + doc.fields[field].length, 0) / DOCS.length]),
) as Record<Field, number>

/** 역색인 — 조각마다 그 조각이 들어 있는 문서 번호. 책 뒤의 '찾아보기'와 같다 */
const INDEX = new Map<string, number[]>()
DOCS.forEach((doc, docIndex) => {
  for (const gram of bigrams(FIELDS.map((field) => doc.fields[field]).join(' '))) {
    const postings = INDEX.get(gram)
    if (postings) postings.push(docIndex)
    else INDEX.set(gram, [docIndex])
  }
})

const ALL_DOCS = DOCS.map((_, docIndex) => docIndex)

/**
 * 낱말 하나가 들어 있을 수 있는 문서 — 낱말의 조각이 모두 들어 있는 문서만 남긴다(목록 교집합).
 * 조각이 다 있어도 순서가 다를 수 있어서(디자·자인 ↔ 자인디자) 칸마다 한 번 더 확인한다.
 */
function candidates(term: string) {
  const grams = [...bigrams(term)]
  if (grams.length === 0) return ALL_DOCS
  const lists = grams.map((gram) => INDEX.get(gram) ?? []).sort((a, b) => a.length - b.length)
  return lists.slice(1).reduce((kept, list) => kept.filter((docIndex) => list.includes(docIndex)), lists[0])
}

/** 글 안에 term 이 몇 번 나오는지(겹치지 않게) */
function countIn(text: string, term: string) {
  let count = 0
  for (let at = text.indexOf(term); at >= 0; at = text.indexOf(term, at + term.length)) count++
  return count
}

/** 문서의 한 칸에 낱말 모양이 몇 번 나오는지. 짧은 영어는 영어 낱말과 통째로 같은 것만 센다('ai' ≠ 'detail') */
function occurrences(doc: SearchDoc, field: Field, form: string) {
  return isShortLatin(form) ? doc.words[field].filter((word) => word === form).length : countIn(doc.fields[field], form)
}

/** 낱말이 들어 있는 문서 → 그 문서에서 찾은 모양. 낱말 그대로를 먼저 보고, 없으면 조사 뗀 모양을 본다 */
function docsWithWord(forms: string[]) {
  const found = new Map<number, string>()
  for (const form of forms) {
    for (const docIndex of candidates(form)) {
      if (found.has(docIndex)) continue
      if (FIELDS.some((field) => occurrences(DOCS[docIndex], field, form) > 0)) found.set(docIndex, form)
    }
  }
  return found
}

/** 드문 낱말일수록 큰 값(IDF). 모든 문서에 있는 낱말은 0 에 가깝다 */
function idf(docCount: number) {
  return Math.log(1 + (DOCS.length - docCount + 0.5) / (docCount + 0.5))
}

/** 낱말 하나가 문서 하나에 주는 점수(BM25F) — 칸마다 무게를 곱하고 긴 칸은 깎아 합친 뒤, 많이 나와도 점수가 끝없이 오르지 않게 누른다 */
function wordScore(doc: SearchDoc, form: string, wordIdf: number) {
  const weighted = FIELDS.reduce((sum, field) => {
    const lengthRatio = AVG_LENGTH[field] ? doc.fields[field].length / AVG_LENGTH[field] : 0
    return sum + (FIELD_WEIGHT[field] * occurrences(doc, field, form)) / (1 - B + B * lengthRatio)
  }, 0)
  return (wordIdf * weighted * (K1 + 1)) / (weighted + K1)
}

/**
 * 결과에 넣으려면 맞아야 하는 낱말 수. 두 개까지는 전부, 세 개부터는 75%(내림).
 * Elasticsearch 의 minimum_should_match 와 같은 생각이다 — 긴 문장형 검색어는 한두 낱말이 데이터에 없어도 찾게.
 * 두 낱말을 전부 요구하는 건 '안드로이드 앱'이 '앱' 하나로 아무 앱이나 걸리지 않게 하려고다.
 */
function requiredMatches(wordCount: number) {
  return wordCount <= 2 ? wordCount : Math.floor(wordCount * 0.75)
}

/** 검색어로 문서 점수 매기기. 결과에 들 문서만 담는다 */
function scoreDocs(query: string) {
  const words = queryWords(query)
  const scores = new Map<string, number>()
  if (words.length === 0) return scores
  const matches = words.map(docsWithWord)
  const idfs = matches.map((found) => idf(found.size))
  const needed = requiredMatches(words.length)
  const hit = new Map<number, number>()
  for (const found of matches) for (const docIndex of found.keys()) hit.set(docIndex, (hit.get(docIndex) ?? 0) + 1)
  for (const [docIndex, count] of hit) {
    if (count < needed) continue
    const doc = DOCS[docIndex]
    const relevance = matches.reduce((sum, found, i) => {
      const form = found.get(docIndex)
      return form ? sum + wordScore(doc, form, idfs[i]) : sum
    }, 0)
    scores.set(doc.id, relevance * (1 + LEVEL_BOOST * (doc.level - 1)))
  }
  return scores
}

/** 검색 결과 — 점수 높은 순. 점수가 같으면 사례는 레벨 → 날짜(rank.ts), 노트는 최신순. 빈 검색어면 전부 기본 순서 */
export function search(query: string) {
  if (!query.trim()) return { cases: rankCases(CASES), notes: NOTES }
  const scores = scoreDocs(query)
  const scoreOf = (id: string) => scores.get(id) ?? 0
  const byScore = <T>(items: T[], id: (item: T) => string) =>
    items.filter((item) => scores.has(id(item))).sort((a, b) => scoreOf(id(b)) - scoreOf(id(a)))
  return {
    // rankCases 로 먼저 줄 세운 뒤 점수로 다시 정렬한다 — sort 는 안정 정렬이라 같은 점수면 레벨·날짜 순이 남는다
    cases: byScore(rankCases(CASES), (item) => `case:${item.slug}`),
    notes: byScore(NOTES, (note) => `note:${note.slug}`),
  }
}

/** 색인 크기 — 채점기(search-eval)가 기록에 남긴다 */
export const INDEX_STATS = { docs: DOCS.length, grams: INDEX.size }
