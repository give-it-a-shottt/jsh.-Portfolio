import type { ButtonHTMLAttributes, ReactNode } from 'react'
import chevronLeft from '../assets/v4/icons/chevron-left.svg'
import chevronRight from '../assets/v4/icons/chevron-right.svg'
import chevronRightWeak from '../assets/v4/icons/chevron-right-weak.svg'
import symbol from '../assets/v4/logo/symbol.svg'
import wordmark from '../assets/v4/logo/wordmark-dark.svg'
import { accioHref } from '../routes'

/** 시안(1440) 좌우 120 → 콘텐츠 1200. 모바일(390)은 좌우 20 */
export const CONTAINER_CLASS = 'mx-auto w-full max-w-[1240px] px-5'

/** 가로 스크롤 트랙이 화면 끝까지 닿되 첫 카드는 Container 콘텐츠 왼쪽 선에 맞도록 하는 여백 */
export const BLEED_TRACK_CLASS =
  'flex snap-x snap-mandatory overflow-x-auto scrollbar-none px-5 scroll-px-5 lg:px-[max(20px,calc((100%-1200px)/2))] lg:scroll-px-[max(20px,calc((100%-1200px)/2))]'

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${CONTAINER_CLASS} ${className}`}>{children}</div>
}

/**
 * AI 표시 말풍선 점 — 로고의 i 위 점과 같은 모양(왼쪽 아래만 뾰족). 오렌지는 AI 기능에서만 쓴다.
 * size 는 시안의 점 지름(px).
 */
export function AiDot({ size = 10, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 rounded-full rounded-bl-[10%] bg-accio ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

/** 로고 락업(심볼 + 워드마크). height 는 워드마크 높이 — 헤더 46.44 / 모바일 30.96 / 푸터 34.4 */
export function Logo({ height, className = '' }: { height: number; className?: string }) {
  return (
    <a href={accioHref()} aria-label="Accio 홈" className={`flex shrink-0 items-center ${className}`} style={{ gap: height * 0.1628 }}>
      <img src={symbol} alt="" style={{ width: height * 0.8023, height: height * 0.6279 }} />
      <img src={wordmark} alt="" style={{ width: height * 1.9884, height }} />
    </a>
  )
}

/** 섹션 머리 — 제목(모바일 20 / PC 24) + 보조 문구 + 오른쪽 요소 */
export function SectionHeader({
  title,
  description,
  aside,
  className = '',
}: {
  title: ReactNode
  description?: string
  aside?: ReactNode
  className?: string
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="flex min-w-0 items-center gap-2 lg:gap-3">
        <h2 className="text-20 font-semibold whitespace-nowrap text-main lg:text-24">{title}</h2>
        {description && <p className="hidden truncate text-14 text-sub-weak lg:block">{description}</p>}
      </div>
      {aside}
    </div>
  )
}

/** '전체 보기 >' — 모바일은 '전체' 로 줄인다 */
export function ViewAllLink({ href }: { href: string }) {
  return (
    <a href={href} className="flex shrink-0 items-center gap-0.5 text-13 font-medium text-sub-weak lg:text-14">
      <span className="lg:hidden">전체</span>
      <span className="hidden lg:inline">전체 보기</span>
      <img src={chevronRightWeak} alt="" className="size-4" />
    </a>
  )
}

/** 동그란 화살표 버튼. size 36(섹션 머리) · 44(배너 위) · 48(트랙 위) */
export function ArrowButton({
  direction,
  onClick,
  disabled,
  size = 36,
  floating = false,
  className = '',
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled?: boolean
  size?: 36 | 44 | 48
  /** 사진 위에 떠 있는 버튼은 그림자를 준다 */
  floating?: boolean
  className?: string
}) {
  const sizeClass = { 36: 'size-9', 44: 'size-11', 48: 'size-12' }[size]
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? '이전' : '다음'}
      className={`flex shrink-0 items-center justify-center rounded-full border border-regular bg-white transition-opacity disabled:opacity-40 ${floating ? 'shadow-accio-2' : ''} ${sizeClass} ${className}`}
    >
      <img src={direction === 'prev' ? chevronLeft : chevronRight} alt="" className="size-4" />
    </button>
  )
}

/** '02 / 08' 위치 표시 + 이전·다음 버튼 */
export function CarouselControls({
  index,
  count,
  total = count,
  onPrev,
  onNext,
  pad = false,
}: {
  index: number
  /** 넘길 수 있는 위치 수 (버튼을 끌 때 쓴다) */
  count: number
  /** 분모로 보여 줄 전체 수 — 기획전처럼 '몇 번째 배너 / 전체 배너' 로 보일 때 */
  total?: number
  onPrev: () => void
  onNext: () => void
  /** 기획전처럼 두 자리로 맞춰 보여 줄 때 */
  pad?: boolean
}) {
  const format = (n: number) => (pad ? String(n).padStart(2, '0') : String(n))
  return (
    <div className="flex items-center gap-2">
      <p className="flex gap-1 pr-2 text-13 tabular-nums" aria-live="polite">
        <span className="font-semibold text-main">{format(index)}</span>
        <span className="text-sub-weak">/ {format(total)}</span>
      </p>
      <ArrowButton direction="prev" onClick={onPrev} disabled={index <= 1} />
      <ArrowButton direction="next" onClick={onNext} disabled={index >= count} />
    </div>
  )
}

/** 디자인 시스템 Button — 높이 48 · radius 12 · 좌우 20. Primary(오렌지)는 한 화면 핵심 행동 1개에만 */
export function Button({
  children,
  variant = 'outline',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }) {
  const variantClass = {
    primary: 'bg-accio text-white active:bg-accio-strong disabled:bg-regular disabled:text-disabled',
    secondary: 'bg-accio-soft text-accio-strong active:bg-[#ffe8df] disabled:bg-regular disabled:text-disabled',
    outline: 'border border-regular bg-white text-main active:bg-regular disabled:text-disabled',
    ghost: 'text-main active:bg-regular disabled:text-disabled',
  }[variant]
  return (
    <button
      type="button"
      className={`flex h-12 items-center justify-center rounded-md px-5 text-16 font-semibold whitespace-nowrap ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
