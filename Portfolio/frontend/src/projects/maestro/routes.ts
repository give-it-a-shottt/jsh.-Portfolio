import type { ConditionKey, DongKey } from './types'

/** 마에스트로는 포트폴리오 안에서 `#/maestro/…` 아래에 있다 */
export const MAESTRO_BASE = '/maestro'

/** 고른 조건 — 새로고침 · 뒤로 가기에도 남도록 주소(?t=1240&dong=euljiro&s=rain,solo)에 둔다 */
export interface Query {
  /** 'now' 또는 '1240' 같은 시연 시각 */
  t: string
  dong: DongKey
  s: ConditionKey[]
}

export const DONGS: { key: DongKey; label: string }[] = [
  { key: 'euljiro', label: '을지로' },
  { key: 'seongsu', label: '성수' },
  { key: 'ikseon', label: '익선동' },
  { key: 'yeonnam', label: '연남' },
]

export const CONDITIONS: { key: ConditionKey; label: string }[] = [
  { key: 'rain', label: '비 와' },
  { key: 'solo', label: '혼밥' },
  { key: 'quiet', label: '조용히' },
  { key: 'nowait', label: '웨이팅 싫어' },
  { key: 'light', label: '가볍게' },
  { key: 'budget', label: '1인 2만 원 이하' },
]

/** 시연 시각 — 새벽 · 오후에 면접관이 빈 화면만 보지 않게 고를 수 있게 둔다 */
export const DEMO_TIMES = ['1240', '1930', '2200']

const isDong = (value: string | null): value is DongKey => DONGS.some((d) => d.key === value)
const isCondition = (value: string): value is ConditionKey => CONDITIONS.some((c) => c.key === value)

/** 주소 → 조건. 잘못된 값은 기본값으로 바꾼다 */
export function readQuery(params: URLSearchParams, fallbackDong: DongKey): Query {
  const t = params.get('t') ?? 'now'
  const dong = params.get('dong')
  return {
    t: t === 'now' || /^([01]\d|2[0-3])[0-5]\d$/.test(t) ? t : 'now',
    dong: isDong(dong) ? dong : fallbackDong,
    s: [...new Set((params.get('s') ?? '').split(',').filter(isCondition))],
  }
}

/** 마에스트로 안 주소. maestroHref('/picks', query) → '#/maestro/picks?t=now&dong=euljiro&s=rain' */
export function maestroHref(path = '', query?: Query) {
  if (!query) return `#${MAESTRO_BASE}${path}`
  const search = new URLSearchParams({ t: query.t, dong: query.dong })
  if (query.s.length) search.set('s', query.s.join(','))
  return `#${MAESTRO_BASE}${path}?${search.toString().replace(/%2C/g, ',')}`
}

export function goTo(href: string) {
  window.location.hash = href.replace(/^#/, '')
}
