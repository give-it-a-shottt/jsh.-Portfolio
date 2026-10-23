import { useSyncExternalStore } from 'react'
import { ALL_PRODUCTS, PRODUCTS, type Product } from '../data/catalog'

// 장바구니 — 화면을 옮겨도 유지되도록 localStorage 에 둔다(목업이라 서버 없이 브라우저에만).
export interface CartItem {
  /** 상품 + 옵션 조합 키 — 같은 옵션을 또 담으면 수량만 늘린다 */
  key: string
  productId: string
  option: string
  quantity: number
  checked: boolean
}

const KEY = 'accio:cart'
const listeners = new Set<() => void>()

// 처음 들어온 사람에게도 시안처럼 3개가 담겨 있도록 한다
const SEED: CartItem[] = [
  { key: `${PRODUCTS.campingChair.id}|샌드 / 기본`, productId: PRODUCTS.campingChair.id, option: '샌드 / 기본', quantity: 1, checked: true },
  { key: `${PRODUCTS.campingLantern.id}|기본`, productId: PRODUCTS.campingLantern.id, option: '기본', quantity: 2, checked: true },
  { key: `${PRODUCTS.electricBlanket.id}|기본`, productId: PRODUCTS.electricBlanket.id, option: '기본', quantity: 1, checked: true },
]

function read(): CartItem[] {
  try {
    const saved = localStorage.getItem(KEY)
    return saved ? JSON.parse(saved) : SEED
  } catch {
    return SEED
  }
}

let snapshot = read()

function write(next: CartItem[]) {
  snapshot = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // 저장이 막혀도 이번 방문 동안은 유지된다
  }
  listeners.forEach((notify) => notify())
}

function subscribe(notify: () => void) {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

export const findProduct = (id: string) => ALL_PRODUCTS.find((p) => p.id === id)

export const cartActions = {
  add(product: Product, option: string, quantity: number) {
    const key = `${product.id}|${option}`
    const existing = snapshot.find((item) => item.key === key)
    write(
      existing
        ? snapshot.map((item) => (item.key === key ? { ...item, quantity: item.quantity + quantity, checked: true } : item))
        : [...snapshot, { key, productId: product.id, option, quantity, checked: true }],
    )
  },
  setQuantity: (key: string, quantity: number) =>
    write(snapshot.map((item) => (item.key === key ? { ...item, quantity: Math.max(1, Math.min(99, quantity)) } : item))),
  toggle: (key: string) => write(snapshot.map((item) => (item.key === key ? { ...item, checked: !item.checked } : item))),
  toggleAll: (checked: boolean) => write(snapshot.map((item) => ({ ...item, checked }))),
  remove: (keys: string[]) => write(snapshot.filter((item) => !keys.includes(item.key))),
}

export default function useCart() {
  return useSyncExternalStore(subscribe, () => snapshot, () => snapshot)
}
