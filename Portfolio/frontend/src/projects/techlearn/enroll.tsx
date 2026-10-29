import { useEffect, useRef, useState } from 'react'
import errorIcon from './assets/toast-error.svg'
import alertIcon from './assets/toast-alert.svg'
import checkIcon from './assets/toast-check.svg'
import closeIcon from './assets/icon-x.svg'
import { points, type Lecture } from './lectures'
import { techlearnHref } from './routes'
import type { Toast } from './hooks'

// 수강신청 확인 모달과 응답 토스트 — 상태는 hooks.ts 의 useEnroll 이 들고 있다.

interface EnrollModalProps {
  lecture: Lecture
  myPoints: number
  /** 신청 후 잔여 · 모자란 포인트 — useEnroll 이 계산한 값을 그대로 받는다 */
  remaining: number
  shortBy: number
  onCancel: () => void
  onConfirm: () => void
  onCharge: (amount: number) => void
}

/** 충전 금액 칩 — 부족분만큼과 3만 · 5만 P 중 부족분 이상인 것 */
function chargeOptions(shortBy: number) {
  return [...new Set([shortBy, 30000, 50000])].filter((amount) => amount >= shortBy).sort((a, b) => a - b)
}

// 03-2 / 03-3 수강신청 확인 모달 — 기본 · 포인트 부족 · 무료 3상태.
// 포인트 부족이면 시안의 '비활성 신청하기' 대신 그 자리에서 충전하게 한다(사용자 확인).
// 충전으로 잔액이 차면 같은 모달이 기본 상태로 바뀌어 바로 신청할 수 있다. 최종 판단은 서버(api.ts)가 한다.
export function EnrollModal({ lecture, myPoints, remaining, shortBy, onCancel, onConfirm, onCharge }: EnrollModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const primaryRef = useRef<HTMLButtonElement>(null)
  const free = lecture.price === 0
  const short = shortBy > 0
  const options = chargeOptions(shortBy)
  const [amount, setAmount] = useState(shortBy)
  const [charged, setCharged] = useState(0)

  // showModal 로 열어야 배경이 막히고 Esc · 포커스 가두기를 브라우저가 해 준다.
  // 열 때 주 버튼에 포커스를 두고, 닫히면 모달을 연 버튼으로 포커스를 돌려준다.
  useEffect(() => {
    const dialog = dialogRef.current
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialog?.showModal()
    primaryRef.current?.focus()
    return () => {
      dialog?.close()
      opener?.focus()
    }
  }, [])

  const charge = () => {
    onCharge(amount)
    setCharged(amount)
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="tl-enroll-title"
      onCancel={(e) => {
        e.preventDefault()
        onCancel()
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      className="m-auto w-[calc(100%-32px)] max-w-110 rounded-sm bg-white p-6 text-tl-ink shadow-[0_25px_50px_rgba(0,0,0,0.25)] backdrop:bg-tl-ink/50 sm:p-8"
    >
      <div className="flex items-center justify-between">
        <h2 id="tl-enroll-title" className="text-20 font-semibold">
          수강신청 확인
        </h2>
        <button type="button" onClick={onCancel} aria-label="닫기" className="rounded-xs p-0.5 hover:bg-tl-chip">
          <img src={closeIcon} alt="" width={20} height={20} />
        </button>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <img src={lecture.cover ?? lecture.thumbnail} alt="" className="h-[54px] w-24 shrink-0 rounded-xs object-cover" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="flex gap-1">
            <span lang="en" className="rounded-tl-tag bg-tl-chip px-2 py-0.5 text-12 text-tl-body">
              {lecture.tags[0]}
            </span>
            {free && (
              <span lang="en" className="rounded-tl-tag bg-tl px-2 py-0.5 text-11 font-semibold text-white">
                FREE
              </span>
            )}
          </p>
          <p className="text-15 font-medium break-keep">{lecture.title}</p>
        </div>
      </div>

      <dl className="mt-5 flex flex-col gap-2.5 rounded-xs bg-tl-bg p-4 text-13">
        <div className="flex justify-between text-tl-body">
          <dt>보유 포인트</dt>
          <dd className="font-medium">{points(myPoints)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-tl-body">차감 포인트</dt>
          <dd className={`font-medium ${free ? 'text-tl' : 'text-tl-ink'}`}>{free ? '무료 (0 P)' : `- ${points(lecture.price)}`}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-tl-chip pt-2.5 font-semibold">
          <dt>신청 후 잔여 포인트</dt>
          <dd className={`text-18 ${short ? 'text-tl-sale' : 'text-tl'}`}>{points(remaining)}</dd>
        </div>
      </dl>

      {short && (
        <div className="mt-3 flex flex-col gap-3">
          <p role="alert" className="flex items-center gap-2 rounded-xs bg-status-error-soft px-4 py-2.5 text-13 break-keep text-tl-sale">
            <img src={errorIcon} alt="" width={16} height={16} className="shrink-0 rounded-full bg-tl-sale" />
            포인트가 {points(shortBy)} 부족해요. 충전하면 바로 신청할 수 있어요.
          </p>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-13 font-semibold">충전할 포인트</legend>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <label
                  key={option}
                  className="cursor-pointer rounded-xs border border-tl-chip px-3 py-2 text-13 font-medium has-checked:border-tl has-checked:bg-tl-bg has-checked:text-tl has-focus-visible:ring-2 has-focus-visible:ring-tl"
                >
                  <input
                    type="radio"
                    name="tl-charge"
                    value={option}
                    checked={amount === option}
                    onChange={() => setAmount(option)}
                    className="sr-only"
                  />
                  {points(option)}
                  {option === shortBy && <span className="ml-1 text-11 text-tl-muted">부족분</span>}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      )}
      {!short && charged > 0 && (
        <p role="status" className="mt-3 rounded-xs bg-tl-bg px-4 py-2.5 text-13 font-medium text-tl">
          {points(charged)}를 충전했어요. 이제 신청할 수 있어요.
        </p>
      )}
      {free && <p className="mt-3 text-12 text-tl-muted">무료 강의예요. 포인트가 차감되지 않아요.</p>}

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-12 w-31 shrink-0 rounded-xs border border-tl-chip bg-white text-15 font-semibold hover:bg-tl-bg"
        >
          취소
        </button>
        {/* 주 버튼은 한 개 — 충전 뒤에도 같은 버튼이라 포커스가 그대로 남는다 */}
        <button
          ref={primaryRef}
          type="button"
          onClick={short ? charge : onConfirm}
          className="h-12 flex-1 rounded-xs bg-tl text-15 font-semibold text-white shadow-[0_4px_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.1)] hover:bg-tl/90"
        >
          {short ? `${points(amount)} 충전하기` : '신청하기'}
        </button>
      </div>
    </dialog>
  )
}

const TOAST_STYLE = {
  success: { bg: 'bg-tl-ink', icon: checkIcon },
  warning: { bg: 'bg-tl-ink', icon: alertIcon },
  error: { bg: 'bg-tl-sale', icon: errorIcon },
} satisfies Record<Toast['tone'], { bg: string; icon: string }>

const TOAST_MS = 3500

/** 화면 아래 가운데에 잠깐 뜨는 서버 응답 알림. 모바일은 하단 신청 바 위로 띄운다 */
export function EnrollToast({ toast, onDone }: { toast: Toast | null; onDone: () => void }) {
  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(onDone, TOAST_MS)
    return () => window.clearTimeout(id)
  }, [toast, onDone])

  return (
    <div
      role={toast?.tone === 'success' ? 'status' : 'alert'}
      className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 lg:bottom-8"
    >
      {toast && (
        <p
          className={`pointer-events-auto flex items-center gap-2.5 rounded-sm px-4 py-3 text-14 font-medium text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] ${TOAST_STYLE[toast.tone].bg}`}
        >
          <img src={TOAST_STYLE[toast.tone].icon} alt="" width={18} height={18} />
          {toast.message}
          {toast.withLink && (
            <a href={techlearnHref('/courses')} className="text-13 font-semibold text-tl-indigo-soft underline">
              내 강의 보기
            </a>
          )}
        </p>
      )}
    </div>
  )
}
