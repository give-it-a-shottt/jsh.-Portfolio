// 마에스트로 백엔드(Portfolio/backend/maestro/app/picks) 응답 모양 — camelCase 로 온다

export type DongKey = 'euljiro' | 'seongsu' | 'ikseon' | 'yeonnam'
export type ConditionKey = 'rain' | 'solo' | 'quiet' | 'nowait' | 'light' | 'budget'
export type StatusKind = 'open' | 'closing' | 'opens' | 'closed'
export type Source = 'live' | 'snapshot'

export interface LatLng {
  lat: number
  lng: number
}

export interface Dong {
  key: DongKey
  label: string
  center: LatLng
}

export interface Condition {
  key: ConditionKey
  label: string
}

export interface Status {
  kind: StatusKind
  /** 상태 배지 — '영업 중', '40분 남음', '17:00 열어요' */
  label: string
  /** 카드의 '다음 변화 시점' 한 줄 */
  nextChange: string
  /** 표로 비교의 '지금' 칸 — '21시까지' */
  short: string
}

export interface Hours {
  /** 그날 0시부터 몇 분. 새벽 마감이면 1440 을 넘는다 */
  segments: { start: number; end: number }[]
  lastOrder: number | null
}

export interface Evidence {
  line: string
  checkedOn: string | null
  sourceCount: number
  items: string[]
}

export interface PlaceCard {
  id: string
  name: string
  initial: string
  categoryLabel: string | null
  location: LatLng
  distanceM: number | null
  station: { station: string; walkMin: number } | null
  priceAvg: number | null
  aiSummary: string | null
  waitingExpected: boolean
  atmosphere: string[]
}

export interface Pick {
  place: PlaceCard
  status: Status
  hours: Hours
  evidence: Evidence
  matched: ConditionKey[]
  unmatched: ConditionKey[]
}

export interface Picks {
  dong: Dong
  /** 실제로 찾은 시각 'HH:MM' */
  at: string
  /** '지금'에 열린 곳이 모자라 시연 시각으로 바꿨으면 원래 시각 */
  switchedFrom: string | null
  source: Source
  /** ok: 3곳 다 맞음 / few: 조건 맞는 곳이 3곳 미만 / none: 열린 곳 없음 */
  state: 'ok' | 'few' | 'none'
  openCount: number
  picks: Pick[]
  relax: { key: ConditionKey; label: string; more: number }[]
  conditions: Condition[]
}

export interface PlaceDetail {
  dong: Dong
  at: string
  source: Source
  pick: Pick
  phone: string | null
  menu: string[]
  hoursText: string
}

/** 자리 물어보기 답 — pending 이면 다시 묻는다 */
export interface SeatAnswer {
  queryId: string
  status: 'pending' | 'available' | 'limited' | 'unavailable' | 'no_response'
  note: string | null
  simulated: boolean
}
