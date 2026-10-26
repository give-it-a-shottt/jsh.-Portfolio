import { normalize } from './searchText'

// 동의어 사전(F-007 S4) — 한 줄이 같은 뜻의 말 묶음이다. 검색어에 이 중 하나가 있으면 나머지로도 찾는다.
// 이 사이트 글에서 실제로 섞여 쓰는 말만 둔다(한글 ↔ 영문 표기, 줄임말). 뜻이 넓어지는 말('서버' = 백엔드)은 넣지 않는다.
// 띄어 쓴 말('레이트 리밋')도 공백 없이 맞춰 보므로 그대로 적어도 된다.

const GROUPS = [
  ['프론트', '프론트엔드', 'front', 'frontend', 'fe'],
  ['백엔드', 'back', 'backend', 'be'],
  ['타입스크립트', 'typescript', 'ts'],
  ['자바스크립트', 'javascript', 'js'],
  ['리액트', 'react'],
  ['넥스트', 'next.js', 'nextjs'],
  ['파이썬', 'python'],
  ['피그마', 'figma'],
  ['포토샵', 'photoshop'],
  ['레이트 리밋', 'rate limit', 'rate limiting', '요청 한도', '쿼터', 'quota'],
  ['에러', '오류', '예외', 'error', 'exception'],
  ['캐시', '캐싱', 'cache', 'caching'],
  ['데이터베이스', 'database', 'db', '디비'],
  ['로그인', 'login'],
  ['테스트', 'test', 'testing'],
  ['배포', 'deploy', 'deployment'],
  ['반응형', 'responsive'],
  ['알고리즘', 'algorithm', '코딩테스트', '코테'],
  ['자동완성', 'autocomplete'],
]

/** 정규화한 말 → 같은 묶음의 다른 말들 */
const SYNONYMS = new Map<string, string[]>()
for (const group of GROUPS) {
  const forms = group.map(normalize)
  for (const form of forms) SYNONYMS.set(form, forms.filter((other) => other !== form))
}

/** 같은 뜻의 다른 말. 사전에 없으면 빈 목록 */
export function synonymsOf(word: string) {
  return SYNONYMS.get(word) ?? []
}

/** 사전에 있는 말인지 — 띄어 쓴 두 낱말을 하나로 붙여 볼 때('레이트' + '리밋') 쓴다 */
export function isSynonymTerm(word: string) {
  return SYNONYMS.has(word)
}
