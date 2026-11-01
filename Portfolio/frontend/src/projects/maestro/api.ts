import type { PlaceDetail, Picks, SeatAnswer } from './types'
import type { Query } from './routes'

// 유미 API 키는 백엔드에만 있다. 프론트는 마에스트로 백엔드만 부른다.
const API_URL: string = import.meta.env.VITE_MAESTRO_API_URL ?? 'http://localhost:8001'

export class ApiError extends Error {
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.code = code
  }
}

// 무료 서버(Render)는 15분 동안 요청이 없으면 잠들고, 다음 첫 요청에 깨어나는 데 1분쯤 걸린다.
// 첫 응답을 받기 전에 요청이 늦어지면 'waking' 으로 바꿔 화면에 안내를 띄운다.
// 한 번 응답을 받은 뒤의 느린 요청(유미 검색 등)은 서버가 잠든 게 아니라서 안내하지 않는다.
export type ServerState = 'unknown' | 'waking' | 'awake'
const WAKE_HINT_MS = 2500
let serverState: ServerState = 'unknown'
const serverListeners = new Set<() => void>()

function setServerState(next: ServerState) {
  if (serverState === next) return
  serverState = next
  serverListeners.forEach((listener) => listener())
}

export function subscribeServerState(listener: () => void) {
  serverListeners.add(listener)
  return () => serverListeners.delete(listener)
}

export function getServerState() {
  return serverState
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  const hint =
    serverState === 'awake' ? undefined : setTimeout(() => serverState !== 'awake' && setServerState('waking'), WAKE_HINT_MS)
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
  } catch {
    if (serverState === 'waking') setServerState('unknown')
    throw new ApiError('offline', '서버에 연결하지 못했어요. 마에스트로 백엔드가 켜져 있는지 확인해 주세요.')
  } finally {
    clearTimeout(hint)
  }
  setServerState('awake')
  if (!response.ok) {
    // 백엔드 오류는 {"detail": {"code", "message"}} 모양이다
    const body = await response.json().catch(() => null)
    const detail = body?.detail
    if (detail?.code) throw new ApiError(detail.code, detail.message)
    throw new ApiError('unknown', '잠시 후 다시 시도해 주세요.')
  }
  return response.json() as Promise<T>
}

/** 서버를 미리 깨운다 — 사용자가 동네 · 상황을 고르는 동안 깨어나도록 마에스트로에 들어오자마자 부른다 */
let waking: Promise<unknown> | null = null
export function wakeServer() {
  if (serverState === 'awake' || waking) return
  waking = request('/health')
    .catch(() => {})
    .finally(() => {
      waking = null
    })
}

/** 화면 주소의 조건 → API 쿼리. 시각은 'now' 또는 '12:40' */
function search(query: Query) {
  const params = new URLSearchParams({ at: query.t === 'now' ? 'now' : `${query.t.slice(0, 2)}:${query.t.slice(2)}` })
  query.s.forEach((key) => params.append('s', key))
  return params.toString()
}

/** [3곳 찾기] — 후보 3곳과 결과 화면 상태. 홈의 '지금 N곳이 열려 있어요'도 조건 없이 이걸로 센다 */
export function getPicks(query: Query) {
  return request<Picks>(`/api/picks?dong=${query.dong}&${search(query)}`)
}

/** 식당 상세 — 결과를 찾을 때 받아 둔 데이터에서 꺼내서 유미를 다시 부르지 않는다 */
export function getPlace(id: string, query: Query) {
  return request<PlaceDetail>(`/api/picks/${query.dong}/places/${encodeURIComponent(id)}?${search(query)}`)
}

/** 자리 물어보기 — 실제 사장님께 보내지 않고 식당마다 정해 둔 답을 흉내 낸다(simulated) */
export function askSeat(placeId: string, people: number, when: 'now' | '30min') {
  return request<SeatAnswer>(`/api/picks/places/${encodeURIComponent(placeId)}/seat-ask`, {
    method: 'POST',
    body: JSON.stringify({ people, when }),
  })
}

/** 답을 최대 wait 초 기다린다(롱폴링) */
export function waitForSeat(queryId: string, wait = 10) {
  return request<SeatAnswer>(`/api/live-status/${encodeURIComponent(queryId)}?wait=${wait}`)
}
