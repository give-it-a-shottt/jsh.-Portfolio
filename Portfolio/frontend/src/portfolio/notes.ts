import { CASES, getSuggestions, type CaseType, type PortfolioCase, type Suggestion } from './data'
import { BACK_NOTES } from './noteData/back'
import { DESIGN_NOTES } from './noteData/design'
import { FRONT_NOTES } from './noteData/front'

// 공부 노트(Study) — 노션 학습노트를 직접 골라 요약해 옮긴다. 노션 원문 링크는 두지 않는다.
// 사례(CASES)와 따로 두고, 실제로 화면·코드에 쓴 경우에만 applied 로 사례와 잇는다. 억지로 잇지 않는다.
// 실습 이미지는 직접 만든 결과물만 싣는다(AI 로 만든 예시 이미지는 뺀다).
// 노트 내용은 분야별로 noteData/*.ts 에 있다. 나중에는 노션 동기화(real-backend 로드맵)로 채운다.

/** 노트에 올린 실습 결과물 한 장 */
export interface StudyPractice {
  image: string
  caption: string
  /** 어떻게 만들었는지 한 줄 */
  how: string
}

/** 이 노트의 개념을 실제로 쓴 곳 */
export interface StudyApplied {
  /** 쓴 사례의 slug(CASES). 아직 없는 사례면 화면에 나오지 않는다 */
  slug: string
  /** 노트에서 배운 것 */
  learned: string
  /** 그래서 이렇게 썼다 */
  used: string
}

export interface StudyNote {
  slug: string
  /** 어느 분야 탭(Design · Front · Back)에 함께 보일지 */
  area: CaseType
  /** 노션 폴더 기준 강의 묶음 */
  course: string
  lesson: string
  /** 일 단위 'YYYY.MM.DD' — 사례와 달리 최신순 정렬에 쓴다 */
  date: string
  title: string
  /** 노트를 한 문장으로 */
  summary: string
  /** 카드와 상세 '핵심 요약'에 보이는 포인트 2~3개 */
  points: string[]
  /** 상세 '배운 것' — 주제별 묶음 */
  learned: { title: string; items: string[] }[]
  /** 없으면 상세의 '실습 결과물' 칸을 숨긴다 */
  practice?: StudyPractice[]
  /** 없으면 '써먹은 곳' 칸을 숨긴다 */
  applied?: StudyApplied[]
  tags: string[]
  /** 화면에 보이지 않는 추가 검색어 */
  keywords: string
}

const RAW_NOTES: StudyNote[] = [...DESIGN_NOTES, ...FRONT_NOTES, ...BACK_NOTES]

/** 최신순. 날짜가 같으면 위에 적은 순서를 지킨다(sort 는 안정 정렬) */
export const NOTES = [...RAW_NOTES].sort((a, b) => b.date.localeCompare(a.date))

export function noteHref(slug: string) {
  return `#/study/${slug}`
}

/** 실제로 있는 사례에 쓴 것만 — 사례가 아직 없으면 '써먹은 곳'에 나오지 않는다 */
export function appliedCases(note: StudyNote): (StudyApplied & { item: PortfolioCase })[] {
  return (note.applied ?? []).flatMap((applied) => {
    const item = CASES.find((c) => c.slug === applied.slug)
    return item ? [{ ...applied, item }] : []
  })
}

/** 사례 상세의 '이 작업에 쓴 공부' — 그 사례를 applied 로 가리키는 노트 */
export function notesForCase(slug: string) {
  return NOTES.filter((note) => note.applied?.some((applied) => applied.slug === slug))
}

/** 검색창 자동완성 — 사례 쪽 제안(키워드 · 사례 제목) 뒤에 노트 제목을 붙인다. 빈 입력이면 추천 키워드만 */
export function getAllSuggestions(query: string, limit = 6): Suggestion[] {
  const q = query.trim().toLowerCase()
  const fromCases = getSuggestions(query, limit)
  if (!q) return fromCases
  const fromNotes = NOTES.filter(({ title }) => title.toLowerCase().includes(q)).map(({ title }) => ({
    text: title,
    type: 'Study' as const,
  }))
  return [...fromCases, ...fromNotes].slice(0, limit)
}

const haystack = (note: StudyNote) =>
  [note.title, note.summary, note.points.join(' '), note.tags.join(' '), note.keywords].join(' ').toLowerCase()

/** 사례 검색(matchesQuery)과 같은 규칙 — 모든 단어가 어딘가에 들어 있으면 일치 */
export function matchesNote(note: StudyNote, query: string) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const text = haystack(note)
  return words.every((word) => text.includes(word))
}
