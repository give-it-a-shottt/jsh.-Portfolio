// 한글 자모 다루기(F-007 S4) — 글자를 자모로 풀고(디 → ㄷ ㅣ), 자모를 다시 글자로 합친다.
// 쓰는 곳: 한영 자판 오타 고치기(vmffosvhal → 플랜포미, ㅁㅊㅊㅑㅐ → accio), 자모 편집거리(마에스트르 ≈ 마에스트로).
// 겹모음·겹받침은 자판에서 두 번 누르는 대로 둘로 푼다(ㅘ → ㅗ ㅏ, ㄳ → ㄱ ㅅ). 그래야 자판 변환과 편집거리가 같은 단위로 센다.

const SYLLABLE_START = 0xac00
const SYLLABLE_END = 0xd7a3
const CHO = [...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ']
const JUNG = [...'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ']
const JONG = ['', ...'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ']

/** 두 번 눌러 만드는 모음·받침 */
const DOUBLE_VOWEL: Record<string, string> = { ㅗㅏ: 'ㅘ', ㅗㅐ: 'ㅙ', ㅗㅣ: 'ㅚ', ㅜㅓ: 'ㅝ', ㅜㅔ: 'ㅞ', ㅜㅣ: 'ㅟ', ㅡㅣ: 'ㅢ' }
const DOUBLE_FINAL: Record<string, string> = {
  ㄱㅅ: 'ㄳ', ㄴㅈ: 'ㄵ', ㄴㅎ: 'ㄶ', ㄹㄱ: 'ㄺ', ㄹㅁ: 'ㄻ', ㄹㅂ: 'ㄼ', ㄹㅅ: 'ㄽ', ㄹㅌ: 'ㄾ', ㄹㅍ: 'ㄿ', ㄹㅎ: 'ㅀ', ㅂㅅ: 'ㅄ',
}
const SPLIT = Object.fromEntries([...Object.entries(DOUBLE_VOWEL), ...Object.entries(DOUBLE_FINAL)].map(([pair, joined]) => [joined, [...pair]]))

/** 두벌식 자판 — 영문 키 → 자모. 대문자는 Shift(쌍자음·ㅒ·ㅖ) */
const KEY_TO_JAMO: Record<string, string> = {
  q: 'ㅂ', w: 'ㅈ', e: 'ㄷ', r: 'ㄱ', t: 'ㅅ', y: 'ㅛ', u: 'ㅕ', i: 'ㅑ', o: 'ㅐ', p: 'ㅔ',
  a: 'ㅁ', s: 'ㄴ', d: 'ㅇ', f: 'ㄹ', g: 'ㅎ', h: 'ㅗ', j: 'ㅓ', k: 'ㅏ', l: 'ㅣ',
  z: 'ㅋ', x: 'ㅌ', c: 'ㅊ', v: 'ㅍ', b: 'ㅠ', n: 'ㅜ', m: 'ㅡ',
  Q: 'ㅃ', W: 'ㅉ', E: 'ㄸ', R: 'ㄲ', T: 'ㅆ', O: 'ㅒ', P: 'ㅖ',
}
const JAMO_TO_KEY = Object.fromEntries(Object.entries(KEY_TO_JAMO).map(([key, jamo]) => [jamo, key]))

const isVowel = (jamo: string) => JUNG.includes(jamo)
const isConsonant = (jamo: string) => CHO.includes(jamo) || JONG.includes(jamo)

/** 글자를 자판에서 누르는 순서대로 자모로 푼다. 한글이 아닌 글자는 그대로 둔다 — '디자인' → ㄷㅣㅈㅏㅇㅣㄴ */
export function toJamo(text: string) {
  const out: string[] = []
  for (const char of text) {
    const code = char.charCodeAt(0)
    if (code >= SYLLABLE_START && code <= SYLLABLE_END) {
      const offset = code - SYLLABLE_START
      const parts = [CHO[Math.floor(offset / 588)], JUNG[Math.floor((offset % 588) / 28)], JONG[offset % 28]]
      for (const part of parts) if (part) out.push(...(SPLIT[part] ?? [part]))
    } else {
      out.push(...(SPLIT[char] ?? [char]))
    }
  }
  return out
}

/** 자모를 자판 입력처럼 글자로 합친다 — ㅍㅡㄹㄹㅐㄴ → 플랜. 받침 뒤에 모음이 오면 받침이 다음 글자로 넘어간다(ㄱㅏㄴㅏ → 가나) */
export function fromJamo(jamos: string[]) {
  let out = ''
  let cho = ''
  let jung = ''
  let jong = ''
  const flush = () => {
    if (cho && jung) {
      out += String.fromCharCode(SYLLABLE_START + (CHO.indexOf(cho) * 21 + JUNG.indexOf(jung)) * 28 + JONG.indexOf(jong))
    } else {
      out += cho + jung + jong
    }
    cho = jung = jong = ''
  }
  for (const jamo of jamos) {
    if (isVowel(jamo)) {
      if (cho && jung && jong) {
        // 받침의 마지막 자음을 떼어 다음 글자의 첫소리로
        const [keep, move] = SPLIT[jong] ?? ['', jong]
        jong = keep
        flush()
        cho = move
        jung = jamo
      } else if (jung && DOUBLE_VOWEL[jung + jamo] && !jong) {
        jung = DOUBLE_VOWEL[jung + jamo]
      } else if (cho && !jung) {
        jung = jamo
      } else {
        flush()
        jung = jamo
      }
    } else if (isConsonant(jamo)) {
      if (cho && jung && !jong && JONG.includes(jamo)) jong = jamo
      else if (cho && jung && jong && DOUBLE_FINAL[jong + jamo]) jong = DOUBLE_FINAL[jong + jamo]
      else {
        flush()
        cho = jamo
      }
    } else {
      flush()
      out += jamo
    }
  }
  flush()
  return out
}

/** 한글 자판인 줄 모르고 영문으로 친 것 → 한글. 영문자만 있을 때만 — 'vmffosvhal' → '플랜포미' */
export function keysToHangul(text: string) {
  if (!/^[a-zA-Z]+$/.test(text)) return null
  return fromJamo([...text].map((key) => KEY_TO_JAMO[key] ?? KEY_TO_JAMO[key.toLowerCase()]))
}

/** 영문 자판인 줄 모르고 한글로 친 것 → 영문. 한글만 있을 때만 — 'ㅁㅊㅊㅑㅐ' → 'accio' */
export function hangulToKeys(text: string) {
  if (!/^[ㄱ-ㆎ가-힣]+$/.test(text)) return null
  const keys = toJamo(text).map((jamo) => JAMO_TO_KEY[jamo])
  return keys.every(Boolean) ? keys.join('').toLowerCase() : null
}

/**
 * 편집거리(Damerau, 이웃 글자 맞바꿈 1번 허용) — 한 쪽을 다른 쪽으로 바꾸는 데 고칠 글자 수.
 * 한글은 자모 단위로 센다: 시스탬 → 시스템은 ㅐ → ㅔ 하나라 1이다.
 */
export function editDistance(a: string[], b: string[], limit: number) {
  if (Math.abs(a.length - b.length) > limit) return limit + 1
  const rows: number[][] = [Array.from({ length: b.length + 1 }, (_, j) => j)]
  for (let i = 1; i <= a.length; i++) {
    rows[i] = [i]
    let best = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1)
      best = Math.min(best, rows[i][j])
    }
    if (best > limit) return limit + 1
  }
  return rows[a.length][b.length]
}
