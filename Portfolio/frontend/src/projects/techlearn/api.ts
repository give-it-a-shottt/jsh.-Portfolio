import { findLecture } from './lectures'
import { applyEnrollment, getState } from './store'

// POST /courses/{id}/enroll 흉내 — 실제 서버가 할 판단(이미 신청 409 · 포인트 부족 400)을 여기서 한다.
// 화면은 모달에서 포인트 부족을 미리 막지만(사전 방어), 최종 판단은 이 '서버'가 내린다.

export type EnrollStatus = 201 | 400 | 404 | 409 | 500

export class EnrollError extends Error {
  status: Exclude<EnrollStatus, 201>
  constructor(status: Exclude<EnrollStatus, 201>) {
    super(`enroll failed: ${status}`)
    this.status = status
  }
}

/** 네트워크를 건너는 것처럼 잠깐 기다린다 — 버튼의 '신청 처리 중' 상태가 보이게 */
const LATENCY_MS = 900

function today() {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`
}

export async function enrollCourse(id: string): Promise<{ status: 201; date: string }> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS))
  const lecture = findLecture(id)
  if (!lecture) throw new EnrollError(404)

  const { points, enrolled } = getState()
  if (enrolled[id]) throw new EnrollError(409)
  if (points < lecture.price) throw new EnrollError(400)

  const date = today()
  applyEnrollment(id, lecture.price, date)
  return { status: 201, date }
}
