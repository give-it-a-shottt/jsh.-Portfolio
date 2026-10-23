import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import beforeAfterImage from './assets/before-after.webp'
import chevronLeft from './assets/icon-chevron-left.svg'
import chevronRight from './assets/icon-chevron-right.svg'
import chevronLeft16 from './assets/icon-chevron-left-16.svg'
import chevronRight16 from './assets/icon-chevron-right-16.svg'

const clamp = (value: number) => Math.min(100, Math.max(0, value))

/**
 * 메인 히어로의 Before/After 드래그 비교. 사진 한 장의 왼쪽 반이 Before, 오른쪽 반이 After 라서
 * 각 반쪽을 칸 너비에 맞춰 겹치고, Before 만 손잡이 위치까지 잘라 보여준다.
 * 손잡이는 transform 으로만 움직인다(레이아웃을 다시 계산하지 않게).
 */
export default function BeforeAfterSlider({ className = '' }: { className?: string }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(50)
  const dragging = useRef(false)

  const moveTo = (clientX: number) => {
    const frame = frameRef.current
    if (!frame) return
    const rect = frame.getBoundingClientRect()
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100))
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    moveTo(event.clientX)
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(event.clientX)
  }
  const stopDrag = () => {
    dragging.current = false
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 20 : 5
    if (event.key === 'ArrowLeft') setPosition((value) => clamp(value - step))
    else if (event.key === 'ArrowRight') setPosition((value) => clamp(value + step))
    else if (event.key === 'Home') setPosition(0)
    else if (event.key === 'End') setPosition(100)
    else return
    event.preventDefault()
  }

  // 반쪽 사진을 칸 너비에 맞춘다 — 사진 전체 너비를 200% 로 두고 왼쪽(0%)·오른쪽(100%) 끝을 맞춘다
  const half = (side: 'left' | 'right') => ({
    backgroundImage: `url(${beforeAfterImage})`,
    backgroundSize: '200% auto',
    backgroundPosition: `${side === 'left' ? '0%' : '100%'} 45%`,
  })

  return (
    <div
      ref={frameRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      className={`relative cursor-ew-resize touch-pan-y overflow-hidden rounded-card select-none ${className}`}
    >
      <div aria-hidden className="absolute inset-0" style={half('right')} />
      <div aria-hidden className="absolute inset-0" style={{ ...half('left'), clipPath: `inset(0 ${100 - position}% 0 0)` }} />

      <p className="absolute top-3 left-3 text-11 text-sub lg:top-4 lg:left-4">
        시안용 AI 생성 이미지<span className="hidden lg:inline"> · 오픈 시 실제 리뷰 사진으로 교체</span>
      </p>
      <span lang="en" className="absolute bottom-3 left-3 rounded-full bg-white px-2 py-1 text-12 font-medium tracking-normal text-main lg:bottom-4 lg:left-4 lg:px-3 lg:text-14 lg:font-semibold">
        Before
      </span>
      <span lang="en" className="absolute right-3 bottom-3 rounded-full bg-white px-2 py-1 text-12 font-medium tracking-normal text-flaseek-text lg:right-4 lg:bottom-4 lg:px-3 lg:text-14 lg:font-semibold">
        After
      </span>

      {/* 칸 전체 폭의 층을 옮겨 가운데 선·손잡이를 position 위치에 둔다 */}
      <div className="pointer-events-none absolute inset-0" style={{ transform: `translateX(${position - 50}%)` }}>
        <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white" />
        <button
          type="button"
          role="slider"
          aria-label="Before After 비교 위치"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`Before ${Math.round(position)}%`}
          onKeyDown={onKeyDown}
          className="pointer-events-auto absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center rounded-full bg-white p-2 shadow-flaseek-3 lg:px-2 lg:py-3"
        >
          <img src={chevronLeft16} alt="" width={16} height={16} className="lg:hidden" />
          <img src={chevronRight16} alt="" width={16} height={16} className="lg:hidden" />
          <img src={chevronLeft} alt="" width={20} height={20} className="hidden lg:block" />
          <img src={chevronRight} alt="" width={20} height={20} className="hidden lg:block" />
        </button>
      </div>
    </div>
  )
}
