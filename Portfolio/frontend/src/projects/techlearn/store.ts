import { useSyncExternalStore } from 'react'

// 내 포인트와 수강 중인 강의 — 서버 대신 메모리에 둔다. 새로고침하면 처음 상태(50,000 P, 2개 수강 중)로 돌아가
// 보는 사람마다 같은 화면에서 시작한다.

interface TechlearnState {
  points: number
  /** 강의 id → 신청일 'YYYY.MM.DD' */
  enrolled: Record<string, string>
}

const INITIAL: TechlearnState = {
  points: 50000,
  // 시안의 목록 화면처럼 PostgreSQL · Git 강의는 이미 수강 중
  enrolled: { 'postgres-tx': '2026.10.21', 'git-collab': '2026.10.21' },
}

let state = INITIAL
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function setState(next: TechlearnState) {
  state = next
  listeners.forEach((listener) => listener())
}

export function useTechlearn() {
  return useSyncExternalStore(subscribe, () => state)
}

export function getState() {
  return state
}

/** 신청 성공을 반영한다 — 포인트 차감과 수강 기록을 한 번에 바꾼다 */
export function applyEnrollment(id: string, price: number, date: string) {
  setState({ points: state.points - price, enrolled: { ...state.enrolled, [id]: date } })
}

/** 포인트 충전 — 실제 결제 없이 잔액만 늘린다 (수강신청 모달의 충전 유도) */
export function chargePoints(amount: number) {
  setState({ ...state, points: state.points + amount })
}
