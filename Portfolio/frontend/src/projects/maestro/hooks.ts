import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { ApiError, askSeat, getPlace, waitForSeat } from './api'
import type { Query } from './routes'
import type { PlaceDetail, SeatAnswer } from './types'

const DESKTOP = '(min-width: 1024px)'

/** PC(1024 이상)인지 — PC 는 상세를 지도 위 오른쪽 패널로, MO 는 한 화면으로 연다 */
export function useIsDesktop() {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(DESKTOP)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    () => window.matchMedia(DESKTOP).matches,
  )
}

type Load<T> = { status: 'loading' } | { status: 'ready'; data: T } | { status: 'error'; message: string }

/** 식당 상세 — 조건(시각)이 바뀌면 상태 배지 · 막대가 달라지므로 다시 받는다 */
export function usePlace(id: string, query: Query) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<{ key: string; load: Load<PlaceDetail> } | null>(null)
  const { t, dong } = query
  const s = query.s.join(',')
  // 응답을 받은 조건(key)과 지금 조건이 다르면 아직 받는 중이다 — 이전 식당이 잠깐 보이지 않게
  const key = `${id}|${t}|${dong}|${s}|${attempt}`

  useEffect(() => {
    let alive = true
    getPlace(id, { t, dong, s: s ? (s.split(',') as Query['s']) : [] })
      .then((data) => alive && setState({ key, load: { status: 'ready', data } }))
      .catch((error) => {
        if (!alive) return
        const message = error instanceof ApiError && error.code === 'not_found' ? '이 식당을 찾지 못했어요' : '식당 정보를 불러오지 못했어요'
        setState({ key, load: { status: 'error', message } })
      })
    return () => {
      alive = false
    }
  }, [key, id, t, dong, s])

  const load: Load<PlaceDetail> = state?.key === key ? state.load : { status: 'loading' }
  return { state: load, retry: () => setAttempt((n) => n + 1) }
}

// 사장님 답을 이만큼까지 기다린다. 넘으면 '응답 없음'으로 보고 전화 · 다음 후보를 권한다
const ANSWER_TIMEOUT_MS = 30_000

export type SeatStep =
  | { step: 'input' }
  | { step: 'waiting' }
  | { step: 'answered'; answer: SeatAnswer['status']; note: string | null }
  | { step: 'error'; message: string }

/** 자리 물어보기 — 묻기 → 답이 올 때까지 롱폴링(10초씩) → 답. 시트를 닫으면 기다리기를 멈춘다 */
export function useSeatAsk(placeId: string) {
  const [state, setState] = useState<SeatStep>({ step: 'input' })
  const run = useRef(0)

  // 화면을 떠나면 진행 중인 기다리기를 버린다
  useEffect(() => () => void (run.current += 1), [])

  const ask = useCallback(
    async (people: number, when: 'now' | '30min') => {
      const id = ++run.current
      const live = () => run.current === id
      setState({ step: 'waiting' })
      const deadline = Date.now() + ANSWER_TIMEOUT_MS
      try {
        let answer = await askSeat(placeId, people, when)
        while (answer.status === 'pending' && Date.now() < deadline && live()) {
          answer = await waitForSeat(answer.queryId, 10)
        }
        if (!live()) return
        const status = answer.status === 'pending' ? 'no_response' : answer.status
        setState({ step: 'answered', answer: status, note: answer.note })
      } catch (error) {
        if (live()) setState({ step: 'error', message: error instanceof ApiError ? error.message : '물어보지 못했어요' })
      }
    },
    [placeId],
  )

  const stop = useCallback(() => {
    run.current += 1
    setState({ step: 'input' })
  }, [])

  return { state, ask, stop }
}
