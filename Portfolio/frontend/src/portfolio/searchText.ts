// 검색 글자 맞추기(F-007 S1) — 검색어와 데이터를 같은 모양으로 바꾼 뒤 비교한다.
// 띄어쓰기·대소문자·문장부호·전각 문자·자모가 풀린 글자(NFD)가 달라도 같은 글자로 본다.
// 공백을 지운 글에서 찾으므로 "디자인시스템"이 "디자인 시스템"에 걸린다. 반대(띄어 쓴 검색어)는 낱말마다 찾으니 원래 걸린다.

/** 전각 영문·숫자·기호(ＡＢＣ１２３)를 반각으로. NFKC 는 ㄱ·ㅏ 같은 낱자 모양까지 바꿔서 쓰지 않는다(S5 초성 검색) */
function toHalfWidth(text: string) {
  return text.replace(/[！-～]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
}

/** 비교용 모양 — 한글을 NFC 로 합치고, 반각·소문자로 바꾸고, 공백·문장부호·기호를 모두 지운다 */
export function normalize(text: string) {
  return toHalfWidth(text.normalize('NFC')).toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '')
}

/** 검색어를 공백으로 나눈 낱말마다 비교용 모양으로. 문장부호만 있던 낱말은 버린다 */
export function queryTerms(query: string) {
  return query.split(/\s+/).map(normalize).filter(Boolean)
}

/** 낱말이 전부 글 안에 있으면 일치. 글은 normalize 를 거친 것이어야 한다. 남는 낱말이 없으면(문장부호만 입력) 일치하지 않는다 */
export function containsAllTerms(normalizedText: string, query: string) {
  const terms = queryTerms(query)
  return terms.length > 0 && terms.every((term) => normalizedText.includes(term))
}
