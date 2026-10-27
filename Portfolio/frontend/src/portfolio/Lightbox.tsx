import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronRightIcon, CloseIcon, MinusIcon, PlusIcon } from '../shared/icons'

/** 크게 띄울 이미지 한 장 */
export interface LightboxItem {
  label: string
  image: string
  /** 아래에 보여줄 설명 한 줄 */
  note: string
  /** 보여줄 최대 크기. 없으면 이미지 원래 크기까지(화면보다 크면 화면 폭에 맞춘다) */
  width?: number
  height?: number
}

interface LightboxProps {
  /** 어느 목록인지 — 화면 읽기 프로그램에 함께 읽어 준다 */
  title: string
  items: LightboxItem[]
  index: number
  onIndex: (index: number) => void
  onClose: () => void
  /**
   * 보는 방식. 없으면 scroll.
   *   scroll  폭에 맞춰 크게, 세로로 긴 건 스크롤 — 웹페이지 캡처 · 디자인 시스템 문서(Design 사례)
   *   fit     화면 안에 통째로 보여 주고, 누르면 원본 크기로 확대 — 구도가 중요한 포토샵 작업물(Study 노트)
   */
  mode?: 'scroll' | 'fit'
}

/**
 * 이미지 한 장을 어두운 배경 위에 크게 띄운다. 좌우 화살표·키보드 ←→·옆으로 밀기로 같은 목록 안을 넘기고,
 * Esc·배경·닫기 버튼으로 닫는다. Design 사례의 화면 목록과 Study 노트의 실습 이미지가 함께 쓴다.
 */
export default function Lightbox({ title, items, index, onIndex, onClose, mode = 'scroll' }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef<number | null>(null)
  // fit 방식의 확대 상태 — 몇 번째 이미지를 확대했는지로 둬서, 다른 장으로 넘기면 저절로 맞춤으로 돌아간다
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null)
  // 화면보다 커서 확대할 거리가 있는 이미지만 확대를 켠다(작은 이미지는 맞춤 = 원본)
  const [zoomable, setZoomable] = useState<Record<number, boolean>>({})
  const item = items[index]
  const hasPrev = index > 0
  const hasNext = index < items.length - 1
  const isFit = mode === 'fit'
  const zoomed = isFit && zoomedIndex === index
  const canZoom = isFit && (zoomable[index] ?? false)
  const toggleZoom = () => setZoomedIndex(zoomed ? null : index)

  // 열린 동안 뒤 화면을 멈추고, 닫으면 누른 카드로 포커스를 돌려준다
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      opener?.focus()
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowLeft' && hasPrev) onIndex(index - 1)
      else if (event.key === 'ArrowRight' && hasNext) onIndex(index + 1)
      else return
      event.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, hasPrev, hasNext, onIndex, onClose])

  const onTouchEnd = (clientX: number) => {
    // 확대한 동안에는 밀기가 화면 이동이라 넘기지 않는다
    if (touchStartX.current === null || zoomed) return
    const delta = clientX - touchStartX.current
    touchStartX.current = null
    if (delta > 60 && hasPrev) onIndex(index - 1)
    else if (delta < -60 && hasNext) onIndex(index + 1)
  }

  const arrow = (direction: 'prev' | 'next') => (
    <button
      type="button"
      onClick={() => onIndex(direction === 'prev' ? index - 1 : index + 1)}
      aria-label={`${direction === 'prev' ? '이전' : '다음'} 화면`}
      className={`absolute top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-lg hover:bg-white ${
        direction === 'prev' ? 'left-3 sm:left-6' : 'right-3 sm:right-6'
      }`}
    >
      <ChevronRightIcon size={22} className={direction === 'prev' ? 'rotate-180' : undefined} />
    </button>
  )

  // 화면 전체를 덮어야 해서 body 에 바로 그린다 — 위쪽 요소에 transform 이 있어도 fixed 가 어긋나지 않게
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} 크게 보기`}
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
      onTouchStart={(event) => (touchStartX.current = event.touches[0].clientX)}
      onTouchEnd={(event) => onTouchEnd(event.changedTouches[0].clientX)}
    >
      <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 text-white sm:px-6">
        <p className="min-w-0 truncate text-14">
          <span className="font-semibold">{item.label}</span>
          <span className="ml-2 text-white/70">
            {index + 1} / {items.length}
          </span>
        </p>
        <div className="flex shrink-0 items-center gap-1">
          {/* 키보드로도 확대할 수 있게 버튼을 둔다(이미지 누르기와 같은 동작) */}
          {canZoom && (
            <button
              type="button"
              onClick={toggleZoom}
              aria-pressed={zoomed}
              aria-label={zoomed ? '화면에 맞추기' : '원본 크기로 확대'}
              className="flex size-10 items-center justify-center rounded-full hover:bg-white/15"
            >
              {zoomed ? <MinusIcon size={20} /> : <PlusIcon size={20} />}
            </button>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/15"
          >
            <CloseIcon size={22} />
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        {/* 바깥(어두운 곳)을 누르면 닫는다. 화면을 바꾸면 맨 위부터 보이게 key 로 새로 그린다.
            스크롤바는 어두운 배경에 묻히게 얇고 옅게(scrollbar-dark) — 긴 이미지가 더 있다는 표시는 남긴다 */}
        {isFit ? (
          <div
            key={index}
            onClick={onClose}
            className={`scrollbar-dark h-full overscroll-contain px-4 pb-6 sm:px-20 ${zoomed ? 'overflow-auto' : 'overflow-hidden'}`}
          >
            {/* 맞춤: 화면 안에 통째로. 확대: 원본 크기 그대로 두고 가로·세로로 스크롤해서 본다 */}
            <div className={`flex items-center justify-center ${zoomed ? 'min-h-full w-max min-w-full' : 'h-full'}`}>
              <img
                src={item.image}
                alt={`${item.label} 화면`}
                onLoad={(event) => {
                  const image = event.currentTarget
                  const fits = image.naturalWidth <= image.clientWidth + 1 && image.naturalHeight <= image.clientHeight + 1
                  setZoomable((current) => ({ ...current, [index]: !fits }))
                }}
                onClick={(event) => {
                  event.stopPropagation()
                  if (canZoom) toggleZoom()
                }}
                className={`rounded-sm bg-white ${zoomed ? 'max-w-none cursor-zoom-out' : `max-h-full max-w-full object-contain ${canZoom ? 'cursor-zoom-in' : ''}`}`}
              />
            </div>
          </div>
        ) : (
          <div key={index} onClick={onClose} className="scrollbar-dark h-full overflow-y-auto overscroll-contain px-4 pb-6 sm:px-20">
            <div className="flex min-h-full items-center justify-center">
              <img
                src={item.image}
                alt={`${item.label} 화면`}
                width={item.width}
                height={item.height}
                onClick={(event) => event.stopPropagation()}
                className="h-auto w-auto max-w-full rounded-sm bg-white"
                style={item.width ? { maxWidth: `min(100%, ${item.width}px)` } : undefined}
              />
            </div>
          </div>
        )}
        {hasPrev && arrow('prev')}
        {hasNext && arrow('next')}
      </div>

      <p className="shrink-0 px-4 pb-4 text-center text-13 break-keep text-white/80 sm:px-6">{item.note}</p>
    </div>,
    document.body,
  )
}
