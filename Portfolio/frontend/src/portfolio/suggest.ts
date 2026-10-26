import { CASES, KEYWORDS, type CaseType } from './data'
import { hangulToKeys, initialOf, isInitialsOnly, keysToHangul, toJamo } from './hangul'
import { NOTES } from './notes'
import { normalize } from './searchText'

// 검색창 자동완성(F-007 S5) — 추천 키워드 · 사례 제목 · 노트 제목 중에서 친 글자와 맞는 것을 제안한다.
//   띄어쓰기·대소문자 무시(S1) · 치는 도중의 글자('디장' → 디자인) · 초성('ㄷㅈㅇ') · 한영 자판('gozj' → 해커)
// 맞은 부분은 굵게 보여주도록 segments 로 나눠 돌려준다.

export interface Suggestion {
  text: string
  /** 공부 노트 제목이면 'Study' */
  type: CaseType | 'Study'
  /** 굵게 보일 부분(match)과 나머지로 나눈 문구 */
  segments: { text: string; match: boolean }[]
}

/** 문구의 글자 하나. 공백·문장부호처럼 비교에서 빠지는 글자는 칸이 없다 */
interface Unit {
  /** 원래 문구에서 몇 번째 글자인지 */
  at: number
  jamo: string[]
  /** 한글이면 초성, 아니면 글자 그대로 */
  initial: string
  /** 낱말 첫 글자인지(문구 맨 앞, 또는 바로 앞이 공백·문장부호) */
  wordStart: boolean
}

interface Candidate {
  text: string
  type: Suggestion['type']
  chars: string[]
  units: Unit[]
}

function toUnits(chars: string[]): Unit[] {
  return chars.flatMap((char, at) => {
    const plain = normalize(char)
    const wordStart = at === 0 || !normalize(chars[at - 1])
    return plain ? [{ at, jamo: toJamo(plain), initial: initialOf(plain) ?? plain, wordStart }] : []
  })
}

/** 제안 후보 — 추천 키워드가 먼저, 그다음 사례 제목, 노트 제목. 같은 문구는 한 번만 */
const CANDIDATES: Candidate[] = [
  ...KEYWORDS.map(({ label, type }) => ({ text: label, type })),
  ...CASES.map(({ title, type }) => ({ text: title, type })),
  ...NOTES.map(({ title }) => ({ text: title, type: 'Study' as const })),
]
  .filter((item, index, all) => all.findIndex((other) => other.text === item.text) === index)
  .map((item) => {
    const chars = [...item.text]
    return { ...item, chars, units: toUnits(chars) }
  })

/**
 * 초성이 이어서 맞는 곳 — 'ㄷㅈㅇ' 은 '디자인' 의 ㄷ·ㅈ·ㅇ. [시작 칸, 끝 칸]
 * 낱말 첫 글자에서 시작할 때만 맞춘다 — 안 그러면 '모든 작업'의 '든 작업'(ㄷㅈㅇ)처럼 낱말 중간에 걸린다.
 */
function matchInitials(units: Unit[], initials: string[]) {
  for (let start = 0; start + initials.length <= units.length; start++) {
    if (!units[start].wordStart) continue
    if (initials.every((initial, i) => units[start + i].initial === initial)) return [start, start + initials.length - 1]
  }
  return null
}

/**
 * 자모 단위로 이어서 맞는 곳 — 칸(글자) 시작에서만 맞춰 본다.
 * '디장'(ㄷㅣㅈㅏㅇ)은 '디자인'(ㄷㅣㅈㅏㅇㅣㄴ)의 앞부분이라 맞는다. 치는 도중에 받침처럼 보이는 자음이 다음 글자의 첫소리여도 된다.
 */
function matchJamo(units: Unit[], jamo: string[]) {
  for (let start = 0; start < units.length; start++) {
    let used = 0
    let end = start
    while (end < units.length && used < jamo.length) {
      const unitJamo = units[end].jamo
      const take = Math.min(unitJamo.length, jamo.length - used)
      if (!unitJamo.slice(0, take).every((piece, i) => piece === jamo[used + i])) break
      used += take
      // 이 글자의 자모를 다 쓰지 못했는데 입력이 더 남았으면 어긋난 것이다
      if (take < unitJamo.length && used < jamo.length) break
      end++
    }
    if (used === jamo.length) return [start, end - 1 < start ? start : end - 1]
  }
  return null
}

function findMatch(candidate: Candidate, input: string) {
  if (isInitialsOnly(input) && [...input].length >= 2) return matchInitials(candidate.units, [...input])
  return matchJamo(candidate.units, toJamo(normalize(input)))
}

/** 맞은 칸 범위를 원래 문구의 글자 범위로 바꿔 굵게/보통으로 나눈다 */
function toSegments(candidate: Candidate, [startUnit, endUnit]: number[]) {
  const from = candidate.units[startUnit].at
  const to = candidate.units[endUnit].at + 1
  const segments = [
    { text: candidate.chars.slice(0, from).join(''), match: false },
    { text: candidate.chars.slice(from, to).join(''), match: true },
    { text: candidate.chars.slice(to).join(''), match: false },
  ]
  return segments.filter((segment) => segment.text)
}

function suggestFor(input: string, limit: number) {
  const found = CANDIDATES.flatMap((candidate) => {
    const range = findMatch(candidate, input)
    return range ? [{ candidate, range }] : []
  })
  // 문구 맨 앞에서 맞은 것을 먼저 — '시스템' 은 '디자인 시스템' 보다 '시스템…' 으로 시작하는 문구가 위
  found.sort((a, b) => Number(a.range[0] !== 0) - Number(b.range[0] !== 0))
  return found.slice(0, limit).map(({ candidate, range }) => ({ text: candidate.text, type: candidate.type, segments: toSegments(candidate, range) }))
}

/**
 * 검색창 자동완성. 빈 입력이면 추천 키워드. 아무것도 안 맞으면 한영 자판을 바꿔 한 번 더 본다('gozj' → 해커).
 */
export function getAllSuggestions(value: string, limit = 6): Suggestion[] {
  const input = value.trim()
  if (!input) return KEYWORDS.slice(0, limit).map(({ label, type }) => ({ text: label, type, segments: [{ text: label, match: false }] }))
  if (!normalize(input)) return []
  const direct = suggestFor(input, limit)
  if (direct.length > 0) return direct
  const switched = keysToHangul(input.replace(/\s+/g, '')) ?? hangulToKeys(input.replace(/\s+/g, ''))
  return switched ? suggestFor(switched, limit) : []
}
