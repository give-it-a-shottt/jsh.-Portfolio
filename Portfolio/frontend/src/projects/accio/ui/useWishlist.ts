import { useSyncExternalStore } from 'react'

// 찜한 상품 id 목록 — 화면을 옮겨도 유지되도록 localStorage 에 둔다(목업이라 서버 없이 브라우저에만).
const KEY = 'accio:wishlist'
const listeners = new Set<() => void>()

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

let snapshot = read()

function toggle(id: string) {
  snapshot = snapshot.includes(id) ? snapshot.filter((x) => x !== id) : [...snapshot, id]
  try {
    localStorage.setItem(KEY, JSON.stringify(snapshot))
  } catch {
    // 시크릿 창 등에서 저장이 막혀도 이번 방문 동안은 유지된다
  }
  listeners.forEach((notify) => notify())
}

function subscribe(notify: () => void) {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

export default function useWishlist() {
  const ids = useSyncExternalStore(subscribe, () => snapshot, () => snapshot)
  return { ids, has: (id: string) => ids.includes(id), toggle }
}
