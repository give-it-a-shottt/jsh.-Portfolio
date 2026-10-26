import { CASES, type PortfolioCase } from './data'
import { NOTES, type StudyNote } from './notes'
import { search } from './search'
import { normalize, queryWords } from './searchText'
import { synonymsOf } from './synonyms'

// 추천 검색어(F-007 S6) — 결과 화면 옆 '관련 검색어'와 0건일 때 '혹시 이걸 찾으셨나요?'.
// 관련 검색어는 지금 결과에 함께 나온 태그에서 고른다. 위쪽 결과의 태그일수록, 어디에나 붙는 흔한 태그가 아닐수록 앞에 둔다.

/** 태그 → 몇 개의 사례·노트에 붙어 있는지. 흔한 태그('백엔드')를 덜 치려고 쓴다 */
const TAG_COUNT = new Map<string, number>()
for (const { tags } of [...CASES, ...NOTES]) for (const tag of tags) TAG_COUNT.set(tag, (TAG_COUNT.get(tag) ?? 0) + 1)
const TOTAL = CASES.length + NOTES.length

/** 결과에서 태그를 몇 개까지 볼지 — 아래쪽 결과는 검색어와 관련이 옅다 */
const CASES_TO_READ = 5
const NOTES_TO_READ = 3

/** 검색어에 이미 든 말(과 그 동의어)인지 — '디자인 시스템' 결과에 '디자인 시스템' 을 다시 추천하지 않게 */
function isInQuery(tag: string, query: string) {
  const plainTag = normalize(tag)
  const plainQuery = normalize(query)
  if (!plainTag || plainQuery.includes(plainTag) || plainTag.includes(plainQuery)) return true
  return queryWords(query).some(({ forms }) => forms.some((form) => form === plainTag || synonymsOf(form).includes(plainTag)))
}

/**
 * 관련 검색어 — 결과 위쪽 사례 5개 · 노트 3개의 태그에 점수를 매긴다.
 * 점수 = Σ (1 / 결과 순위) × log(전체 문서 수 / 그 태그가 붙은 문서 수). 순위가 높을수록, 드문 태그일수록 크다.
 */
export function relatedSearches(query: string, cases: PortfolioCase[], notes: StudyNote[], limit = 5) {
  const scores = new Map<string, number>()
  const read = (items: { tags: string[] }[], count: number) =>
    items.slice(0, count).forEach(({ tags }, index) => {
      for (const tag of tags) {
        if (isInQuery(tag, query)) continue
        const rarity = Math.log(TOTAL / (TAG_COUNT.get(tag) ?? 1))
        scores.set(tag, (scores.get(tag) ?? 0) + rarity / (index + 1))
      }
    })
  read(cases, CASES_TO_READ)
  read(notes, NOTES_TO_READ)
  return [...scores].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([tag]) => tag)
}

/**
 * 0건일 때 '혹시 이걸 찾으셨나요?' — 낱말이 여러 개면, 혼자서도 결과가 있는 낱말만 남긴 검색어를 권한다.
 * '블록체인 디자인 시스템' → '디자인 시스템'. 낱말이 하나면 S4 오타 고치기가 이미 해 봤으니 권하지 않는다.
 * 남는 낱말이 둘 이상일 때만 권한다 — '스프링 부트' → '부트' 처럼 이름의 한쪽만 남으면 뜻이 바뀐다.
 */
export function didYouMean(query: string) {
  const words = queryWords(query)
  if (words.length < 2) return null
  const kept = words.filter(({ raw }) => {
    const found = search(raw)
    return found.cases.length + found.notes.length > 0
  })
  if (kept.length < 2 || kept.length === words.length) return null
  const suggestion = kept.map(({ raw }) => raw).join(' ')
  const found = search(suggestion)
  return found.cases.length + found.notes.length > 0 ? suggestion : null
}
