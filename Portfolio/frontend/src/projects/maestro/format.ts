import type { Condition, PlaceCard, Status } from './types'

const KST_CLOCK = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })

/** 지금 한국 시각 'HH:MM' — 서버도 한국 시간으로 영업 여부를 본다 */
export const nowClock = (date = new Date()) => KST_CLOCK.format(date)

/** '1240' → '12:40' */
export const clockOf = (t: string) => `${t.slice(0, 2)}:${t.slice(2)}`

/** 시각 → 끼니. 점심과 저녁 사이(14:30~17:00)는 오후로 본다 */
export function mealOf(clock: string) {
  const [h, m] = clock.split(':').map(Number)
  const minutes = h * 60 + m
  if (minutes < 5 * 60) return '늦은 밤'
  if (minutes < 10 * 60 + 30) return '아침'
  if (minutes < 14 * 60 + 30) return '점심'
  if (minutes < 17 * 60) return '오후'
  if (minutes < 21 * 60 + 30) return '저녁'
  return '늦은 밤'
}

/** 축 10:00 ~ 다음 날 02:00 위에서의 위치(%) — 새벽 시각은 전날 밤으로 본다 */
export const AXIS_START = 10 * 60
export const AXIS_END = 26 * 60
export function axisPercent(minutes: number) {
  const m = minutes < AXIS_START - 4 * 60 ? minutes + 1440 : minutes
  return Math.min(100, Math.max(0, ((m - AXIS_START) / (AXIS_END - AXIS_START)) * 100))
}

export function minutesOf(clock: string) {
  const [h, m] = clock.split(':').map(Number)
  return h * 60 + m
}

/** '을지로3가 3분' */
export function stationShort(place: PlaceCard) {
  return place.station ? `${place.station.station} ${place.station.walkMin}분` : null
}

/** '을지로3가역에서 걸어서 3분' */
export function stationLong(place: PlaceCard) {
  if (!place.station) return null
  const name = place.station.station.endsWith('역') ? place.station.station : `${place.station.station}역`
  return `${name}에서 걸어서 ${place.station.walkMin}분`
}

/** 9000 → '9천 원', 23000 → '2만 3천 원' */
export function wonShort(won: number) {
  const thousands = Math.round(won / 1000)
  const man = Math.floor(thousands / 10)
  const chun = thousands % 10
  if (!man) return `${chun}천 원`
  return chun ? `${man}만 ${chun}천 원` : `${man}만 원`
}

/** 상세의 가격대 — '1인 1만 원 안쪽' */
export function priceText(avg: number | null) {
  if (avg === null) return '정보 없음'
  if (avg <= 10_000) return '1인 1만 원 안쪽'
  return `1인 평균 ${wonShort(avg)}`
}

export const waitingShort = (place: PlaceCard) => (place.waitingExpected ? '있을 수도' : '거의 없음')

/** 상태 배지 색 — 영업 중 초록 · 마감 임박 빨강 · 나중에 엶 / 영업 끝 회색 */
export function badgeTone(status: Status) {
  if (status.kind === 'open') return 'green'
  if (status.kind === 'closing') return 'red'
  return 'black'
}

/** 카카오맵 길 찾기 — 앱이 있으면 앱으로, 없으면(PC 포함) 웹으로 열린다 */
export function directionsUrl(place: PlaceCard) {
  return `https://map.kakao.com/link/to/${encodeURIComponent(place.name)},${place.location.lat},${place.location.lng}`
}

/** 조건 키 → 칩 글자 (서버가 정한 라벨) */
export const conditionLabels = (conditions: Condition[]) => new Map(conditions.map((c) => [c.key, c.label]))

/** 받침이 있으면 '은', 없으면 '는' — '을지백탄뼈구이는', '을지 칼국수집은'. 한글로 끝나지 않으면 '은(는)' */
export function topic(word: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  if (code < 0 || code > 11171) return '은(는)'
  return code % 28 ? '은' : '는'
}

/** 메뉴 이름 앞의 '[녹진한 치즈와 매콤한 매력]' 같은 꾸밈말은 뺀다 */
export const menuName = (item: string) => item.replace(/\[[^\]]*\]\s*/g, '').trim() || item
