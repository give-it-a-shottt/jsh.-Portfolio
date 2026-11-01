import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useSyncExternalStore, type ReactNode } from 'react'
import { getServerState, subscribeServerState } from './api'
import { axisPercent, badgeTone, minutesOf, stationShort } from './format'
import backIcon from './icons/back.svg'
import checkIcon from './icons/check.svg'
import closeIcon from './icons/close.svg'
import forwardIcon from './icons/forward.svg'
import locationIcon from './icons/location.svg'
import nowMarker from './icons/now-marker.svg'
import refreshIcon from './icons/refresh.svg'
import timeEmptyIcon from './icons/time-empty.svg'
import { useMaestro } from './store'
import type { ConditionKey, Hours, Pick, Status } from './types'

// 피그마 「마에스트로」 Design System — 리뉴얼 › M-1 Signature · M-2 UI Components 를 옮긴 것.
// 아이콘은 피그마에서 내려받은 Phosphor SVG(icons/)를 색까지 그대로 쓴다.

/** 장식 아이콘 — 같은 뜻을 글자가 전달하므로 읽지 않는다 */
export function Icon({ src, size }: { src: string; size: number }) {
  return <img src={src} alt="" aria-hidden="true" width={size} height={size} className="shrink-0" />
}

/** 'maestro' 로고 — 로고만 ExtraBold(800). 본문 굵기 3가지(400 · 500 · 600) 규칙의 예외 */
export function Logo({ href }: { href?: string }) {
  const text = (
    <span lang="en" className="text-24 leading-[1.3] font-[800] text-mr-primary">
      maestro
    </span>
  )
  return href ? (
    <a href={href} aria-label="마에스트로 홈">
      {text}
    </a>
  ) : (
    text
  )
}

/** 잠든 무료 서버가 깨어나는 동안 화면 위에 띄우는 안내 */
export function ServerWakeNotice() {
  const state = useSyncExternalStore(subscribeServerState, getServerState)
  return (
    <div role="status" aria-live="polite" className="sticky top-0 z-40">
      {state === 'waking' && (
        <p className="flex items-center gap-2 bg-mr-main px-5 py-2.5 text-13 break-keep text-white">
          <span aria-hidden="true" className="size-1.5 shrink-0 animate-pulse rounded-full bg-mr-now" />
          서버를 깨우는 중이에요. 무료 서버라 처음 한 번은 1분쯤 걸려요.
        </p>
      )}
    </div>
  )
}

/** GNB Sub MO — 뒤로 + 페이지 타이틀 (56) */
export function GnbSub({ title, backHref, className = '' }: { title: string; backHref: string; className?: string }) {
  return (
    <header className={`flex h-14 items-center border-b border-mr-line bg-white px-1.5 ${className}`}>
      <a href={backHref} aria-label="뒤로" className="flex size-11 shrink-0 items-center justify-center">
        <Icon src={backIcon} size={24} />
      </a>
      <h1 className="min-w-0 flex-1 truncate pr-2 text-18 font-semibold text-mr-main">{title}</h1>
    </header>
  )
}

/** GNB PC — 로고 + 지금 보는 조건 (72, 안쪽 1200) */
export function GnbPc({ context, homeHref }: { context: string; homeHref: string }) {
  return (
    <header className="flex h-[72px] items-center justify-center border-b border-mr-line bg-white">
      <div className="flex w-full max-w-[1200px] items-center gap-6 px-6 xl:px-0">
        <Logo href={homeHref} />
        <p className="text-16 font-semibold text-mr-main">{context}</p>
      </div>
    </header>
  )
}

/** Tag — 조건 칩 (S 32). 선택하면 primary 테두리 + soft 바탕 + check — 색 하나에만 기대지 않는다 */
export function Tag({
  label,
  selected = false,
  onClick,
  href,
}: {
  label: string
  selected?: boolean
  onClick?: () => void
  href?: string
}) {
  const className = `flex h-8 shrink-0 items-center gap-1 rounded-mr-chip border px-3 text-13 font-medium text-mr-main ${
    selected ? 'border-mr-primary bg-mr-primary-soft' : 'border-mr-line-regular bg-white'
  }`
  const content = (
    <>
      {selected && <Icon src={checkIcon} size={16} />}
      {label}
    </>
  )
  if (href)
    return (
      <a href={href} className={className}>
        {/* 링크에는 aria-pressed 가 없어서, 고른 칩이라는 걸 글자로 알려 준다 */}
        {selected && <span className="sr-only">선택됨 </span>}
        {content}
      </a>
    )
  return (
    <button type="button" aria-pressed={onClick ? selected : undefined} onClick={onClick} className={className}>
      {content}
    </button>
  )
}

const BADGE_TONE = {
  green: 'bg-mr-green-soft text-mr-green',
  red: 'bg-mr-red-soft text-mr-red',
  navy: 'bg-mr-navy-soft text-mr-navy',
  black: 'bg-mr-black-soft text-mr-black',
}

/** Badge — Soft. S 20(카드) / M 24(상세) */
export function Badge({ tone, size = 'S', children }: { tone: keyof typeof BADGE_TONE; size?: 'S' | 'M'; children: ReactNode }) {
  const sizing = size === 'S' ? 'h-5 px-1.5 text-12' : 'h-6 px-2 text-13'
  return <span className={`flex shrink-0 items-center rounded-mr-chip font-medium whitespace-nowrap ${sizing} ${BADGE_TONE[tone]}`}>{children}</span>
}

export const StatusBadge = ({ status, size }: { status: Status; size?: 'S' | 'M' }) => (
  <Badge tone={badgeTone(status)} size={size}>
    {status.label}
  </Badge>
)

const TICKS = ['10', '14', '18', '22', '02']

/**
 * Now Bar — 영업시간 막대. 축 10:00~02:00 고정이라 3곳을 같은 눈으로 비교한다.
 * 영업 구간은 primary, 브레이크는 끊긴 빈 트랙, 라스트오더는 2×8 눈금, 지금은 앰버 + 검정 테두리 마커.
 * 같은 정보를 '15:00 브레이크 전까지 2시간' 글자로 주므로 막대는 읽지 않는다(aria-hidden).
 */
export function NowBar({ hours, at, animate = false }: { hours: Hours; at: string; animate?: boolean }) {
  const reduceMotion = useReducedMotion()
  const now = axisPercent(minutesOf(at))
  const moving = animate && !reduceMotion
  return (
    <div aria-hidden="true" className="relative h-8 w-full">
      <div className="absolute inset-x-0 top-1.5 h-1 rounded-full bg-mr-line" />
      {hours.segments.map((segment) => {
        const left = axisPercent(segment.start)
        const right = axisPercent(Math.min(segment.end, 26 * 60))
        if (right <= left) return null
        return (
          <div
            key={segment.start}
            className="absolute top-1.5 h-1 rounded-full bg-mr-primary"
            style={{ left: `${left}%`, width: `${right - left}%` }}
          />
        )
      })}
      {hours.lastOrder !== null && (
        <div className="absolute top-1 h-2 w-0.5 -translate-x-1/2 bg-mr-sub" style={{ left: `${axisPercent(hours.lastOrder)}%` }} />
      )}
      {/* 마커 — 첫 카드만 진입할 때 0 → 지금 위치로 300ms 움직인다 (세 장이 같이 움직이면 산만해서) */}
      <motion.div
        className="absolute inset-x-0 top-0.5"
        initial={{ x: moving ? '0%' : `${now}%` }}
        animate={{ x: `${now}%` }}
        transition={{ duration: moving ? 0.3 : 0, ease: 'easeOut' }}
      >
        <img src={nowMarker} alt="" width={16} height={16} className="absolute -top-0.5 -left-2 max-w-none" />
      </motion.div>
      <div className="absolute inset-x-0 top-4 flex justify-between text-11 text-mr-sub">
        {TICKS.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
    </div>
  )
}

/** '비 와 ✓  혼밥 ✓' — 안 맞은 조건은 흐리게 */
function MatchedLine({ pick, labels }: { pick: Pick; labels: Map<ConditionKey, string> }) {
  if (!pick.matched.length && !pick.unmatched.length) return null
  return (
    <p className="flex flex-wrap gap-x-2 text-13 font-medium">
      {pick.matched.map((key) => (
        <span key={key} className="text-mr-main">
          {labels.get(key)} <span aria-label="맞음">✓</span>
        </span>
      ))}
      {pick.unmatched.map((key) => (
        <span key={key} className="text-mr-disabled">
          <span className="sr-only">안 맞음: </span>
          {labels.get(key)}
        </span>
      ))}
    </p>
  )
}

/** Result Card — 3장 모두 같은 구조 · 같은 막대 축. 마감 1시간 이내면 배지가 빨강 'N분 남음' */
export function ResultCard({
  pick,
  at,
  href,
  labels,
  selected = false,
  animate = false,
}: {
  pick: Pick
  at: string
  href: string
  labels: Map<ConditionKey, string>
  selected?: boolean
  animate?: boolean
}) {
  const { place } = pick
  const station = stationShort(place)
  const ref = useRef<HTMLAnchorElement>(null)
  // 지도 핀을 누르면 그 카드가 보이게 굴린다
  useEffect(() => {
    if (selected) ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selected])
  return (
    <a
      ref={ref}
      href={href}
      data-place={place.id}
      className={`flex flex-col gap-2 rounded-card border bg-white p-4 outline-offset-2 ${
        selected ? 'border-mr-primary shadow-[0_0_0_1px_var(--color-mr-primary)]' : 'border-mr-line'
      }`}
    >
      <div className="flex items-center gap-2">
        <h3 className="min-w-0 flex-1 truncate text-18 font-semibold text-mr-main">{place.name}</h3>
        <StatusBadge status={pick.status} />
        <Icon src={forwardIcon} size={16} />
      </div>
      <NowBar hours={pick.hours} at={at} animate={animate} />
      <p className="text-14 text-mr-sub">{pick.status.nextChange}</p>
      <p className="text-14 text-mr-main">{pick.evidence.line}</p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {station && (
          <p className="flex items-center gap-1 text-13 text-mr-sub">
            <Icon src={locationIcon} size={16} />
            {station}
          </p>
        )}
        <MatchedLine pick={pick} labels={labels} />
      </div>
    </a>
  )
}

/** Segment — 두 칸 전환 (40). 선택된 칸만 흰 바탕 */
export function Segment<T extends string>({
  items,
  value,
  onChange,
  label,
}: {
  items: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  label: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex w-full rounded-sm bg-mr-fill p-1">
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(item.value)}
            className={`flex h-8 flex-1 items-center justify-center rounded-mr-chip text-14 ${
              active ? 'bg-white font-semibold text-mr-main shadow-mr-1' : 'font-medium text-mr-sub'
            }`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

/** Bottom Button Bar — MO 화면 아래 고정. 홈 표시줄 자리는 기기 안전 영역으로 둔다 */
export function BottomBar({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`fixed inset-x-0 bottom-0 z-20 border-t border-mr-line bg-white pb-[max(12px,env(safe-area-inset-bottom))] ${className}`}>
      <div className="flex gap-2 px-5 pt-3">{children}</div>
    </div>
  )
}

/** Evidence Block — 별점 대신 날짜가 붙은 근거. surface 위 글자는 main · sub 만 */
export function EvidenceBlock({ pick }: { pick: Pick }) {
  const { evidence } = pick
  const verified =
    evidence.sourceCount >= 2 ? `지도 ${evidence.sourceCount}곳 확인${evidence.checkedOn ? ` · ${evidence.checkedOn}` : ''}` : evidence.checkedOn ? `${evidence.checkedOn} 확인` : null
  return (
    <section aria-labelledby="evidence-title" className="flex flex-col gap-3 rounded-card bg-mr-surface p-5">
      <div className="flex items-center gap-2">
        <h2 id="evidence-title" className="flex-1 text-16 font-semibold text-mr-main">
          믿을 이유
        </h2>
        {verified && (
          <Badge tone="navy" size="M">
            {verified}
          </Badge>
        )}
      </div>
      <ul className="flex flex-col gap-3">
        {evidence.items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-14 text-mr-sub">
            <Icon src={checkIcon} size={16} />
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

/** (?) 툴팁 — 탭으로 열고 닫는다. 누르는 영역 44 */
export function HelpTip({ label, children, icon }: { label: string; children: ReactNode; icon: string }) {
  const id = useId()
  return (
    <details className="group relative">
      <summary aria-describedby={id} className="flex size-11 cursor-pointer list-none items-center justify-center [&::-webkit-details-marker]:hidden">
        <Icon src={icon} size={16} />
        <span className="sr-only">{label}</span>
      </summary>
      <p id={id} role="tooltip" className="absolute top-10 left-0 z-10 w-60 rounded-sm bg-mr-main px-3 py-2 text-13 text-white">
        {children}
      </p>
    </details>
  )
}

/** Info Row — 라벨 88 + 값 */
export function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex gap-4 py-1.5 text-14">
      <dt className="w-[88px] shrink-0 font-medium text-mr-weak">{label}</dt>
      <dd className="min-w-0 flex-1 text-mr-main">{value}</dd>
    </div>
  )
}

/** Empty State — 지금 열린 곳이 없을 때 */
export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center pt-2 pb-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-mr-fill">
        <Icon src={timeEmptyIcon} size={36} />
      </div>
      <p className="mt-5 text-18 font-semibold text-mr-main">{title}</p>
      <p className="text-14 text-mr-sub">{body}</p>
    </div>
  )
}

/** Error Inline — 불러오기 실패 + 다시 시도 */
export function ErrorInline({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-card-sm bg-mr-fill px-5 py-10 text-center">
      <Icon src={refreshIcon} size={28} />
      <p className="text-15 font-medium text-mr-sub">{message}</p>
      <button type="button" onClick={onRetry} className="flex h-8 w-20 items-center justify-center rounded-sm bg-white text-14 font-medium text-mr-primary">
        다시 시도
      </button>
    </div>
  )
}

/** 로딩 — 카드 모양 스켈레톤 3장 */
export function SkeletonCards() {
  return (
    <div aria-busy="true" aria-label="후보를 찾는 중이에요" className="flex flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-3 rounded-card border border-mr-line bg-white p-4">
          <div className="h-5 w-40 animate-pulse rounded-badge bg-mr-fill" />
          <div className="h-2 w-full animate-pulse rounded-badge bg-mr-fill" />
          <div className="h-3.5 w-[220px] max-w-full animate-pulse rounded-badge bg-mr-fill" />
          <div className="h-3.5 w-[180px] animate-pulse rounded-badge bg-mr-fill" />
        </div>
      ))}
    </div>
  )
}

/** Toast — 화면 아래 한 줄. 3초 뒤 사라진다 */
export function Toast({ className = '' }: { className?: string }) {
  const toast = useMaestro((state) => state.toast)
  return (
    <div role="status" aria-live="polite" className={`pointer-events-none fixed inset-x-5 z-50 flex justify-center ${className}`}>
      {toast && <p className="w-full max-w-[400px] rounded-sm bg-mr-main px-4 py-3 text-13 font-medium text-white">{toast}</p>}
    </div>
  )
}

/** 시트 · 모달 닫기 버튼 */
export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="닫기" className="-mr-2.5 flex size-11 items-center justify-center">
      <Icon src={closeIcon} size={24} />
    </button>
  )
}
