import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Badge, CloseButton, Icon, Segment, StatusBadge } from '../components'
import { buttonClass } from '../styles'
import { directionsUrl, stationLong } from '../format'
import { useSeatAsk } from '../hooks'
import minusIcon from '../icons/minus.svg'
import plusIcon from '../icons/plus.svg'
import type { Pick } from '../types'

const WHEN = [
  { value: 'now' as const, label: '지금 바로' },
  { value: '30min' as const, label: '30분 뒤' },
]
const MIN_PEOPLE = 1
const MAX_PEOPLE = 10

// PLC_01_002 — 자리 물어보기. MO 바텀시트 / PC 가운데 모달.
// ① 인원 · 시간 → ② 사장님께 묻는 중 → ③ 가능 / 제한 / 응답 없음. 불가면 시트를 닫고 다음 후보로(onNext).
// 실제 사장님께 보내지 않는다 — 백엔드가 식당마다 정해 둔 답을 흉내 낸다.
export default function SeatSheet({
  pick,
  phone,
  onClose,
  onAvailable,
  onNext,
}: {
  pick: Pick
  phone: string | null
  onClose: () => void
  onAvailable: () => void
  onNext: () => void
}) {
  const { place } = pick
  const [people, setPeople] = useState(2)
  const [when, setWhen] = useState<'now' | '30min'>('now')
  const { state, ask, stop } = useSeatAsk(place.id)
  const panel = useRef<HTMLDivElement>(null)

  // 부모가 렌더마다 새 onClose 를 넘겨도 아래 효과가 다시 돌지 않게(초점이 튀지 않게) ref 로 받는다
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  // 열면 시트로 초점을 옮기고, Esc 로 닫고, Tab 은 시트 안에서만 돌고, 닫으면 연 버튼으로 초점을 돌려준다
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    panel.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !panel.current) return
      const items = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), select, input')
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || active === panel.current)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      opener?.focus()
    }
  }, [])

  // 답을 받으면 상세 화면에 알린다 — 가능: [길 찾기]가 주 행동, 불가: 다음 후보로
  const answer = state.step === 'answered' ? state.answer : null
  useEffect(() => {
    if (answer === 'available') onAvailable()
    if (answer === 'unavailable') onNext()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 답이 바뀔 때 한 번만
  }, [answer])

  const whenLabel = when === 'now' ? '지금 바로' : '30분 뒤에'
  const station = stationLong(place)
  const directions = (
    <a href={directionsUrl(place)} target="_blank" rel="noopener noreferrer" className={`${buttonClass('primary')} flex-1`}>
      길 찾기
    </a>
  )

  let body: ReactNode
  let buttons: ReactNode
  if (state.step === 'input' || state.step === 'error') {
    body = (
      <>
        <div className="flex items-center">
          <p id="seat-people" className="flex-1 text-16 font-semibold text-mr-main">
            몇 명이에요?
          </p>
          <div role="group" aria-labelledby="seat-people" className="flex h-10 w-[132px] items-center overflow-hidden rounded-sm border border-mr-line-strong bg-white">
            <button
              type="button"
              aria-label="한 명 빼기"
              disabled={people <= MIN_PEOPLE}
              onClick={() => setPeople((n) => n - 1)}
              className="flex h-full w-10 items-center justify-center disabled:opacity-40"
            >
              <Icon src={minusIcon} size={20} />
            </button>
            <output aria-live="polite" className="flex h-full w-12 items-center justify-center border-x border-mr-line-strong text-15 font-medium text-mr-main">
              {people}
            </output>
            <button
              type="button"
              aria-label="한 명 더하기"
              disabled={people >= MAX_PEOPLE}
              onClick={() => setPeople((n) => n + 1)}
              className="flex h-full w-10 items-center justify-center disabled:opacity-40"
            >
              <Icon src={plusIcon} size={20} />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-16 font-semibold text-mr-main">언제 가요?</p>
          <Segment items={WHEN} value={when} onChange={setWhen} label="언제 가요?" />
        </div>
        {state.step === 'error' && (
          <p role="alert" className="text-14 text-mr-red">
            {state.message}
          </p>
        )}
        <p className="text-13 text-mr-weak">시연용이라 실제 사장님께 보내지 않고, 미리 정해 둔 응답(mock)을 보여 드려요</p>
      </>
    )
    buttons = (
      <button type="button" onClick={() => ask(people, when)} className={`${buttonClass('primary')} flex-1`}>
        물어보기
      </button>
    )
  } else if (state.step === 'waiting') {
    body = (
      <>
        <p className="text-18 font-semibold text-mr-main">사장님께 물어보는 중이에요</p>
        <p className="text-14 text-mr-sub">
          {people}명 · {when === 'now' ? '지금 바로' : '30분 뒤'} — 보통 몇 초 안에 답이 와요
        </p>
        <div role="progressbar" aria-label="답을 기다리는 중" className="relative h-1 overflow-hidden rounded-full bg-mr-line">
          <div className="absolute inset-y-0 w-[120px] animate-[mr-indeterminate_1.4s_ease-in-out_infinite] rounded-full bg-mr-primary motion-reduce:left-[60px] motion-reduce:animate-none" />
        </div>
      </>
    )
    buttons = (
      <button type="button" onClick={stop} className={`${buttonClass('secondary')} flex-1`}>
        그만 묻기
      </button>
    )
  } else {
    const badges = (
      <div className="flex gap-2">
        <Badge tone="black" size="M">
          mock 응답
        </Badge>
        <StatusBadge status={pick.status} size="M" />
      </div>
    )
    if (state.answer === 'available') {
      body = (
        <>
          {badges}
          <p className="text-18 font-semibold text-mr-main">
            {people}명, {whenLabel} 앉을 수 있대요
          </p>
          {station && <p className="text-14 text-mr-sub">{station}이에요</p>}
        </>
      )
      buttons = (
        <>
          <button type="button" onClick={onClose} className={`${buttonClass('secondary')} flex-1`}>
            닫기
          </button>
          {directions}
        </>
      )
    } else if (state.answer === 'limited') {
      body = (
        <>
          {badges}
          <p className="text-18 font-semibold text-mr-main">{state.note ? state.note.replace(/있어요$/, '있대요') : '자리가 조금 있대요'}</p>
          <p className="text-14 text-mr-sub">그래도 가거나, 다음 후보를 볼 수 있어요</p>
        </>
      )
      buttons = (
        <>
          <button type="button" onClick={onNext} className={`${buttonClass('secondary')} flex-1`}>
            다음 후보
          </button>
          <a href={directionsUrl(place)} target="_blank" rel="noopener noreferrer" className={`${buttonClass('primary')} flex-1`}>
            그래도 가기
          </a>
        </>
      )
    } else {
      // 응답 없음 — 불가(unavailable)는 위 effect 가 다음 후보로 넘긴다
      body = (
        <>
          {badges}
          <p className="text-18 font-semibold text-mr-main">사장님이 아직 답하지 않았어요</p>
          <p className="text-14 text-mr-sub">전화로 물어보거나, 다음 후보를 볼 수 있어요</p>
        </>
      )
      buttons = (
        <>
          <button type="button" onClick={onNext} className={`${buttonClass('secondary')} flex-1`}>
            다음 후보
          </button>
          {phone ? (
            <a href={`tel:${phone}`} className={`${buttonClass('primary')} flex-1`}>
              전화하기
            </a>
          ) : (
            <button type="button" disabled className={`${buttonClass('primary')} flex-1`}>
              전화하기
            </button>
          )}
        </>
      )
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end lg:items-center lg:justify-center">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-mr-dim" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="seat-title"
        tabIndex={-1}
        className="relative w-full rounded-t-mr-sheet bg-white outline-none lg:w-[440px] lg:rounded-card"
      >
        <div className="flex h-3 justify-center pt-2 lg:hidden">
          <span className="h-1 w-9 rounded-full bg-mr-line-regular" />
        </div>
        <div className="flex h-14 items-center px-5">
          <h2 id="seat-title" className="flex-1 text-18 font-semibold text-mr-main">
            자리 물어보기
          </h2>
          <CloseButton onClick={onClose} />
        </div>
        <div aria-live="polite" className={`flex flex-col px-5 pb-6 ${state.step === 'input' || state.step === 'error' ? 'gap-5' : 'gap-3'}`}>
          {body}
        </div>
        <div className="flex gap-2 border-t border-mr-line px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:pb-5">{buttons}</div>
      </div>
    </div>,
    document.body,
  )
}
