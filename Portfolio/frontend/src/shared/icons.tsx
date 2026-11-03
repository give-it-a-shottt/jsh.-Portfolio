import type { ReactNode, SVGProps } from 'react'

// 직접 그린 라인 아이콘 — 20 그리드, 1.5 선, 각진 끝(square cap)으로 통일한다. 색은 currentColor 를 따른다.
// 반짝이·로봇·마법봉처럼 AI 서비스에서 흔히 쓰는 아이콘은 의도적으로 두지 않는다.
type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & { size?: number }

function Icon({ size = 20, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 4.5l5.5 5.5L8 15.5" />
    </Icon>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 7.5l5.5 5.5 5.5-5.5" />
    </Icon>
  )
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10 16V5" />
      <path d="M5 10l5-5 5 5" />
    </Icon>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 10h11M10 4.5v11" />
    </Icon>
  )
}

export function MinusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 10h11" />
    </Icon>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 10.5l3.5 3.5 7.5-8" />
    </Icon>
  )
}

/** 배송 문의 — 위가 열린 상자 */
export function ParcelIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 7.5h14v9.5H3z" />
      <path d="M3 7.5L5 3h10l2 4.5" />
      <path d="M8 11h4" />
    </Icon>
  )
}

/** 교환·반품 — 엇갈린 두 화살표 */
export function SwapIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 7h12.5M12.5 3.5L16 7l-3.5 3.5" />
      <path d="M16.5 13H4M7.5 9.5L4 13l3.5 3.5" />
    </Icon>
  )
}

/** 결제·환불 — 끝이 톱니인 영수증 */
export function ReceiptIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 2.75h10v14.5l-2.5-1.5-2.5 1.5-2.5-1.5L5 17.25z" />
      <path d="M8 7h4M8 10.5h4" />
    </Icon>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 3a6 6 0 1 0 0 12A6 6 0 0 0 9 3z" />
      <path d="M13.5 13.5L17 17" />
    </Icon>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 10h11.5" />
      <path d="M10.5 5l5 5-5 5" />
    </Icon>
  )
}

/** 펼친 책 — Study 공부 노트 페이지 아이콘 */
export function BookIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10 6v10.5M2.5 4h5a2.5 2.5 0 0 1 2.5 2.5A2.5 2.5 0 0 1 12.5 4h5v11h-5.5a2 2 0 0 0-2 2 2 2 0 0 0-2-2H2.5z" />
    </Icon>
  )
}

/** 전구 — 노트의 한 줄 요약 콜아웃 */
export function LightbulbIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7.5 15h5M8.5 17.5h3M10 2.5a5.5 5.5 0 0 0-3.2 10c.45.35.7.85.7 1.4v.1h5v-.1c0-.55.25-1.05.7-1.4A5.5 5.5 0 0 0 10 2.5z" />
    </Icon>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 5l10 10M15 5L5 15" />
    </Icon>
  )
}

export function StarIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M10 2.5l2.3 4.7 5.2.75-3.75 3.65.9 5.15L10 14.3l-4.65 2.45.9-5.15L2.5 7.95l5.2-.75z" />
    </svg>
  )
}
