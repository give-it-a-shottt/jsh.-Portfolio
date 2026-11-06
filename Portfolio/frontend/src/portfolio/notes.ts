import { CASES, type CaseType, type PortfolioCase } from './data'
import { BACK_NOTES } from './noteData/back'
import { DESIGN_NOTES } from './noteData/design'
import { FLASK_NOTES } from './noteData/flask'
import { FRONT_NOTES } from './noteData/front'
import { MONGODB_NOTES } from './noteData/mongodb'
import { MYSQL_NOTES } from './noteData/mysql'

// 공부 노트(Study) — 노션 학습노트를 직접 골라 요약해 옮긴다. 노션 원문 링크는 두지 않는다.
// 사례(CASES)와 따로 두고, 실제로 화면·코드에 쓴 경우에만 applied 로 사례와 잇는다. 억지로 잇지 않는다.
// 실습 이미지(practice)는 직접 만든 결과물만 싣는다. 직접 만들지 않은 예시는 사용자가 원할 때만 examples 칸에 따로 싣는다.
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

/** 노트 속 코드 예시 — 직접 돌려 본 것만 싣는다(F-012) */
export interface NoteCode {
  lang: 'sql' | 'python' | 'javascript' | 'typescript' | 'css' | 'markup' | 'bash' | 'json'
  source: string
  /** 코드 위에 붙는 한 줄 설명 */
  caption?: string
}

/** 새 노트 틀(F-012)의 개념 한 칸 — 설명 · 왜 이렇게 하나 · 코드 */
export interface NoteSection {
  title: string
  /** 설명 2~3문장 */
  body: string
  /** 왜 이렇게 하나 — 한 줄 */
  why?: string
  code?: NoteCode
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
  /** 직접 만들지 않은 참고 예시(강의 미션 예시 등). '실습 결과물'과 섞지 않고 따로 보여준다. 없으면 칸을 숨긴다 */
  examples?: StudyPractice[]
  /** 없으면 '써먹은 곳' 칸을 숨긴다 */
  applied?: StudyApplied[]
  /**
   * 새 노트 틀(F-012) — 있으면 상세의 '핵심 개념'을 개념마다 설명 · 왜 · 코드로 그린다.
   * 얇은 강의 노트 여러 개를 합친 노트에 쓴다. 없으면 예전처럼 points 목록.
   */
  sections?: NoteSection[]
  /** 자주 하는 실수 — 공식 문서로 확인한 것만 */
  pitfalls?: string[]
  /** 이 노트로 합친 예전 노트 slug — 예전 주소가 이 노트로 열린다 */
  replaces?: string[]
  tags: string[]
  /** 화면에 보이지 않는 추가 검색어 */
  keywords: string
}

const RAW_NOTES: StudyNote[] = [...DESIGN_NOTES, ...FRONT_NOTES, ...BACK_NOTES, ...MYSQL_NOTES, ...MONGODB_NOTES, ...FLASK_NOTES]

/** 최신순. 날짜가 같으면 위에 적은 순서를 지킨다(sort 는 안정 정렬) */
export const NOTES = [...RAW_NOTES].sort((a, b) => b.date.localeCompare(a.date))

/** 합쳐서 없어진 예전 노트 slug → 지금 노트 slug */
const NOTE_ALIASES = new Map(RAW_NOTES.flatMap((note) => (note.replaces ?? []).map((old) => [old, note.slug] as const)))

/** 예전 주소로 들어와도 합친 노트를 찾는다 */
export function resolveNoteSlug(slug: string) {
  return NOTE_ALIASES.get(slug) ?? slug
}

export function noteHref(slug: string) {
  return `#/study/${slug}`
}

/** Study 홈 `#/study`, 강의를 고르면 `#/study?area=…&course=…` */
export function studyHref(course?: { area: CaseType; course: string }) {
  if (!course) return '#/study'
  return `#/study?${new URLSearchParams({ area: course.area, course: course.course })}`
}

// 노트의 '막힌 것 · 바로잡은 것' 묶음은 내가 틀렸던 문답이라 화면과 검색에서 뺀다. 데이터는 다시 볼 수 있게 남겨 둔다.
const HIDDEN_GROUP = /막힌|바로잡|헷갈/

/** 화면에 보일 '배운 것' 묶음 — 틀렸던 문답 묶음은 뺀다 */
export function visibleLearned(note: StudyNote) {
  return note.learned.filter((group) => !HIDDEN_GROUP.test(group.title))
}

/**
 * 노트의 개념 묶음 — 새 틀(sections) 노트는 개념 한 칸이 한 묶음, 예전 노트는 화면에 보이는 '배운 것' 묶음.
 * Study 홈 통계 · 개념 칩 · 검색이 두 틀을 같은 방식으로 읽게 한다(F-012).
 */
export function conceptGroups(note: StudyNote): { title: string; items: string[] }[] {
  if (note.sections) return note.sections.map(({ title, body, why }) => ({ title, items: why ? [body, why] : [body] }))
  return visibleLearned(note)
}

/** '정리한 개념' 수 — 새 틀은 개념 칸 수, 예전 노트는 '배운 것' 항목 수 */
export function conceptCount(note: StudyNote) {
  return note.sections ? note.sections.length : visibleLearned(note).reduce((count, group) => count + group.items.length, 0)
}

export interface StudyCourse {
  area: CaseType
  course: string
  /** 최신순 */
  notes: StudyNote[]
  /** 이 강의의 개념 묶음 이름 — 나온 순서대로, 겹치면 한 번만 */
  groups: string[]
}

const AREA_ORDER: CaseType[] = ['Front', 'Back', 'Design']

/** 분야 → 강의 묶음. 강의는 노트가 많은 순. 같은 강의라도 분야가 다르면 따로 센다(미니 인프런 Front · Back) */
export const STUDY_TREE = AREA_ORDER.map((area) => {
  const courses = new Map<string, StudyNote[]>()
  for (const note of NOTES) if (note.area === area) courses.set(note.course, [...(courses.get(note.course) ?? []), note])
  return {
    area,
    count: [...courses.values()].reduce((sum, notes) => sum + notes.length, 0),
    courses: [...courses]
      .map(([course, notes]): StudyCourse => ({
        area,
        course,
        notes,
        groups: [...new Set(notes.flatMap((note) => conceptGroups(note).map((group) => group.title)))],
      }))
      .sort((a, b) => b.notes.length - a.notes.length),
  }
}).filter(({ count }) => count > 0)

export const COURSES = STUDY_TREE.flatMap(({ courses }) => courses)

export function findCourse(area: string | null, course: string | null) {
  return COURSES.find((item) => item.area === area && item.course === course)
}

const FEATURED_COUNT = 2

/**
 * Study 홈에서 개념 카드로 크게 보여 줄 대표 강의 — 가장 최근에 공부한 강의부터(같은 날이면 노트가 많은 쪽).
 * 같은 강의가 Front · Back 에 나뉘어 있으면 한 번만 넣는다. 나머지는 '다른 강의' 목록에 한 줄씩.
 */
export const FEATURED_COURSES = [...COURSES]
  .sort((a, b) => b.notes[0].date.localeCompare(a.notes[0].date) || b.notes.length - a.notes.length)
  .filter((course, i, sorted) => sorted.findIndex((other) => other.course === course.course) === i)
  .slice(0, FEATURED_COUNT)

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

// 노트 검색은 사례와 함께 search.ts, 자동완성은 suggest.ts 에서 한다
