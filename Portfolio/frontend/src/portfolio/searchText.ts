// 검색 글자 맞추기(F-007 S1·S2) — 검색어와 데이터를 같은 모양으로 바꾼 뒤 비교한다.
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

/**
 * 낱말 끝에 붙는 조사(S2). 긴 것부터 본다 — '으로'를 '로'보다 먼저 봐야 '노션으로'가 '노션'이 된다.
 * 형태소 분석기 대신 짧은 목록만 쓴다. 동사 어미('잠들어서', '느린')는 다루지 않는다.
 */
const JOSA = ['에서는', '으로는', '에서', '으로', '에게', '까지', '부터', '처럼', '보다', '하고', '이랑', '랑', '의', '을', '를', '이', '가', '은', '는', '에', '로', '와', '과', '도', '만']

/** 조사를 뗀 모양. 남는 부분이 두 글자보다 짧으면 떼지 않는다 — '회의'의 '의', '속도'의 '도'를 떼면 뜻이 사라진다 */
function stripJosa(word: string) {
  const josa = JOSA.find((ending) => word.endsWith(ending) && [...word].length - [...ending].length >= 2)
  return josa ? word.slice(0, -josa.length) : word
}

/**
 * 검색어를 공백으로 나눈 낱말마다 [그대로, 조사 뗀 모양]. 문장부호만 있던 낱말은 버린다.
 * 둘 중 하나만 글에 있어도 그 낱말은 찾은 것으로 본다 — 조사를 잘못 떼도 원래 모양으로 찾을 수 있게.
 */
export function queryWords(query: string) {
  return query
    .split(/\s+/)
    .map(normalize)
    .filter(Boolean)
    .map((word) => [...new Set([word, stripJosa(word)])])
}

/** 낱말이 전부 글 안에 있으면 일치(AND). 글은 normalize 를 거친 것이어야 한다. 남는 낱말이 없으면(문장부호만 입력) 일치하지 않는다 */
export function containsAllWords(normalizedText: string, query: string) {
  const words = queryWords(query)
  return words.length > 0 && words.every((forms) => forms.some((form) => normalizedText.includes(form)))
}
