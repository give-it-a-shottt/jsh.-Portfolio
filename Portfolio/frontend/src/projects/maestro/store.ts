import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ApiError, getPicks } from './api'
import type { Query } from './routes'
import type { DongKey, Picks } from './types'

// 마에스트로 전역 상태 (Zustand).
// 결과 목록 · 지도 핀 · PC 상세 패널 · 자리 물어보기의 '다음 후보'가 같은 결과를 본다.
// 화면마다 따로 부르면 서로 다른 응답을 볼 수 있어서, 결과는 여기 한 곳에만 두고 같은 조건이면 다시 부르지 않는다.
// 조건(시각 · 동네 · 상황)은 주소에 두고, 여기에는 주소에 둘 필요 없는 것만 둔다.

type Result =
  | { key: string; status: 'loading' }
  | { key: string; status: 'ready'; data: Picks }
  | { key: string; status: 'error'; message: string }

interface MaestroState {
  /** 마지막에 고른 동네 — 다음 방문의 기본값. 이것만 localStorage 에 남긴다 */
  lastDong: DongKey
  /** 결과 — 조건(key)이 같으면 상세에 갔다 와도 다시 부르지 않는다 */
  result: Result | null
  /** 지도 핀 ↔ 카드 강조 */
  selectedId: string | null
  /** 결과 시트 — 목록 / 표로 비교 */
  view: 'list' | 'table'
  /** 화면 아래 토스트 한 줄 */
  toast: string | null

  setLastDong: (dong: DongKey) => void
  loadPicks: (query: Query, options?: { force?: boolean }) => Promise<void>
  select: (id: string | null) => void
  setView: (view: 'list' | 'table') => void
  showToast: (message: string) => void
}

export const queryKey = (query: Query) => `${query.t}|${query.dong}|${query.s.join(',')}`

const TOAST_MS = 3000
let toastTimer: ReturnType<typeof setTimeout> | undefined

export const useMaestro = create<MaestroState>()(
  persist(
    (set, get) => ({
      lastDong: 'euljiro', // 첫 방문은 을지로
      result: null,
      selectedId: null,
      view: 'list',
      toast: null,

      setLastDong: (lastDong) => set({ lastDong }),

      loadPicks: async (query, { force = false } = {}) => {
        const key = queryKey(query)
        const current = get().result
        // 같은 조건을 이미 받았거나 받는 중이면 다시 부르지 않는다 (다시 시도만 force)
        if (!force && current?.key === key && current.status !== 'error') return
        set({ result: { key, status: 'loading' }, selectedId: null })
        try {
          const data = await getPicks(query)
          // 그사이 조건이 바뀌었으면 늦게 온 응답은 버린다
          if (get().result?.key === key) set({ result: { key, status: 'ready', data } })
        } catch (error) {
          const message = error instanceof ApiError ? error.message : '후보를 불러오지 못했어요'
          if (get().result?.key === key) set({ result: { key, status: 'error', message } })
        }
      },

      select: (selectedId) => set({ selectedId }),
      setView: (view) => set({ view }),

      showToast: (toast) => {
        clearTimeout(toastTimer)
        set({ toast })
        toastTimer = setTimeout(() => set({ toast: null }), TOAST_MS)
      },
    }),
    {
      name: 'maestro-v2',
      // 저장소를 못 쓰는 환경(사생활 보호 모드 등)이면 zustand 가 조용히 메모리로만 쓴다
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lastDong: state.lastDong }),
    },
  ),
)
