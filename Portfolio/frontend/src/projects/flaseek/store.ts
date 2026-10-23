import { useSyncExternalStore } from 'react'

/** 화면 여러 곳이 함께 보는 작은 값. 시안이라 서버 없이 이번 방문 동안만 유지한다 */
function createState<T>(initial: T) {
  let value = initial
  const listeners = new Set<() => void>()
  const get = () => value
  const set = (next: T) => {
    value = next
    listeners.forEach((notify) => notify())
  }
  const subscribe = (notify: () => void) => {
    listeners.add(notify)
    return () => listeners.delete(notify)
  }
  return { get, set, subscribe }
}

// ── 장바구니 수 — 시안 헤더처럼 2개에서 시작한다 ──
const cart = createState(2)
export const useCartCount = () => useSyncExternalStore(cart.subscribe, cart.get, cart.get)
export function addToCart(count = 1) {
  cart.set(cart.get() + count)
  showToast('장바구니에 담았어요')
}

// ── 찜 ──
const wishes = createState<ReadonlySet<number>>(new Set())
export const useWishes = () => useSyncExternalStore(wishes.subscribe, wishes.get, wishes.get)
export function toggleWish(id: number) {
  const next = new Set(wishes.get())
  if (next.has(id)) {
    next.delete(id)
    showToast('찜을 해제했어요')
  } else {
    next.add(id)
    showToast('찜했어요')
  }
  wishes.set(next)
}

// ── 토스트 — 3초 뒤 닫힌다 ──
export interface ToastMessage {
  id: number
  message: string
}

const toast = createState<ToastMessage | null>(null)
let timer: number | undefined
export const useToast = () => useSyncExternalStore(toast.subscribe, toast.get, toast.get)
export function showToast(message: string) {
  window.clearTimeout(timer)
  toast.set({ id: Date.now(), message })
  timer = window.setTimeout(() => toast.set(null), 3000)
}

/** 시안에서 연결하지 않은 기능을 눌렀을 때. subject 는 조사까지 — '결제는', '로그인은' */
export const showDemoNotice = (subject: string) => showToast(`시안이라 ${subject} 연결하지 않았어요`)
