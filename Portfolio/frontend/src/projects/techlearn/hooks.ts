import { useCallback, useRef, useState, type FormEvent } from 'react'
import { EnrollError, enrollCourse } from './api'
import type { Lecture } from './lectures'
import { goTo, techlearnHref } from './routes'
import { chargePoints, useTechlearn } from './store'

/** 검색어를 받아 강의 목록으로 보낸다 — 헤더와 홈 히어로가 같이 쓴다 */
export function useCourseSearch(initial = '') {
  const [query, setQuery] = useState(initial)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    goTo(techlearnHref('/courses', { q: query.trim() || undefined }))
  }
  return { query, setQuery, submit }
}

// 수강신청 흐름 — 버튼 → 확인 모달(포인트 차감 계산) → 서버 응답 → 토스트.
// 버튼 4상태(신청 가능 · 신청 중 · 수강 중 · 포인트 부족)는 상세 카드와 모바일 하단 바가 같이 쓴다.
// 포인트가 모자라도 버튼은 막지 않는다 — 모달에서 부족분을 보여 주고 바로 충전하게 한다(사용자 확인).
// 포인트 부족 계산은 여기 한 곳(remaining · shortBy)에서만 하고, 화면은 이 값을 받아 쓴다.
export type EnrollState = 'available' | 'pending' | 'enrolled' | 'short'

export interface Toast {
  tone: 'success' | 'warning' | 'error'
  message: string
  /** 성공 토스트에만 붙는 '내 강의 보기' */
  withLink?: boolean
}

// 서버 응답 코드 → 토스트 (시안 03-1 '서버 응답 토스트')
const TOAST_BY_STATUS: Record<EnrollError['status'] | 201, Toast> = {
  201: { tone: 'success', message: '수강신청이 완료되었어요!', withLink: true },
  409: { tone: 'warning', message: '이미 신청한 강의예요.' },
  400: { tone: 'error', message: '포인트가 부족해요.' },
  404: { tone: 'error', message: '강의를 찾지 못했어요.' },
  500: { tone: 'error', message: '신청하지 못했어요. 잠시 후 다시 시도해 주세요.' },
}

export function useEnroll(lecture: Lecture) {
  const { points: myPoints, enrolled } = useTechlearn()
  const [pending, setPending] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  // 토스트 타이머가 렌더마다 다시 시작되지 않게 같은 함수를 넘긴다
  const clearToast = useCallback(() => setToast(null), [])

  // 같은 요청이 두 번 나가지 않게 — 상태(pending)는 다음 렌더에야 바뀌어서 ref 로 바로 막는다
  const inFlight = useRef(false)

  const enrolledAt = enrolled[lecture.id]
  const remaining = myPoints - lecture.price
  /** 모자란 포인트. 충분하면 0 */
  const shortBy = Math.max(0, -remaining)
  const state: EnrollState = enrolledAt ? 'enrolled' : pending ? 'pending' : shortBy > 0 ? 'short' : 'available'

  const submit = async () => {
    if (inFlight.current) return
    inFlight.current = true
    setConfirming(false)
    setPending(true)
    try {
      await enrollCourse(lecture.id)
      setToast(TOAST_BY_STATUS[201])
    } catch (error) {
      setToast(TOAST_BY_STATUS[error instanceof EnrollError ? error.status : 500])
    } finally {
      inFlight.current = false
      setPending(false)
    }
  }

  return {
    state,
    myPoints,
    remaining,
    shortBy,
    enrolledAt,
    /** 신청 가능 · 포인트 부족일 때 모달을 연다. 처리 중 · 수강 중에는 열지 않는다 */
    open: () => (state === 'available' || state === 'short') && setConfirming(true),
    /** 모달에서 고른 만큼 충전한다 — 잔액이 늘면 모달이 기본 상태로 바뀐다 */
    charge: chargePoints,
    confirming,
    cancel: () => setConfirming(false),
    submit,
    toast,
    clearToast,
  }
}
