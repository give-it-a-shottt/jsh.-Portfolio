import { useSyncExternalStore } from 'react'
import { cartActions, type CartItem, findProduct, summarize } from './useCart'

// 주문 — 목업 결제(토스페이 테스트)로 만든 주문을 브라우저에 남긴다. 주문내역·배송 조회가 읽는다.
export interface OrderLine {
  productId: string
  option: string
  quantity: number
  price: number
}

export interface Order {
  no: string
  /** ISO 날짜 */
  orderedAt: string
  lines: OrderLine[]
  total: number
  method: string
}

const KEY = 'accio:orders'
const listeners = new Set<() => void>()

function read(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

let snapshot = read()

function write(next: Order[]) {
  snapshot = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // 저장이 막혀도 이번 방문 동안은 유지된다
  }
  listeners.forEach((notify) => notify())
}

/** 테스트 결제 한도 — 넘으면 카드사 거절(REJECT_CARD_PAYMENT)로 실패 화면을 보여 준다 */
export const TEST_CARD_LIMIT = 1_000_000

export const PAYMENT_ERRORS: Record<string, { reason: string; short: string }> = {
  REJECT_CARD_PAYMENT: { reason: '카드 한도 초과', short: '카드 한도 초과' },
}

/** 'YYYYMMDD-000184' — 날짜 + 그날 주문 순번 */
function nextOrderNo(date: Date) {
  const day = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
  const sameDay = snapshot.filter((o) => o.no.startsWith(day)).length
  return `${day}-${String(184 + sameDay).padStart(6, '0')}`
}

/**
 * 장바구니에서 선택한 상품으로 결제한다. 성공하면 주문을 남기고 장바구니에서 뺀 뒤 주문번호를,
 * 한도를 넘으면 실패 코드를 돌려준다.
 */
export function placeOrder(items: CartItem[]): { ok: true; no: string } | { ok: false; code: string } {
  const { payable, total } = summarize(items)
  if (payable.length === 0) return { ok: false, code: 'EMPTY' }
  if (total > TEST_CARD_LIMIT) return { ok: false, code: 'REJECT_CARD_PAYMENT' }

  const now = new Date()
  const order: Order = {
    no: nextOrderNo(now),
    orderedAt: now.toISOString(),
    lines: payable.map(({ item, product }) => ({ productId: product.id, option: item.option, quantity: item.quantity, price: product.price })),
    total,
    method: '토스페이 (테스트)',
  }
  write([order, ...snapshot])
  cartActions.remove(payable.map(({ item }) => item.key))
  return { ok: true, no: order.no }
}

/** '내일(금)' — 오늘 기준 다음 날과 요일 */
export function arrivalLabel(from = new Date()) {
  const next = new Date(from)
  next.setDate(next.getDate() + 1)
  return `내일(${'일월화수목금토'[next.getDay()]})`
}

export default function useOrders() {
  return useSyncExternalStore(
    (notify) => {
      listeners.add(notify)
      return () => listeners.delete(notify)
    },
    () => snapshot,
    () => snapshot,
  )
}

/** 가장 최근 주문 — AI 주문 조회·재구매 답에 쓴다 */
export function latestOrder() {
  const order = snapshot[0]
  if (!order) return undefined
  return {
    no: order.no,
    firstName: findProduct(order.lines[0].productId)?.name ?? '상품',
    productIds: order.lines.map((line) => line.productId),
  }
}
