import { useRef, useState, type ReactNode } from 'react'
import bellIcon from './assets/bell.svg'
import githubIcon from './assets/github.svg'
import glow860 from './assets/glow-860.svg'
import glow880 from './assets/glow-880.svg'
import glow940 from './assets/glow-940.svg'
import mobileRight from './assets/m-header-right.svg'
import moonIcon from './assets/moon.svg'
import pulseMutedDot from './assets/pulse-muted.svg'
import pulseDot from './assets/pulse.svg'
import ringBgSm from './assets/h-ring-bg.svg'
import ringFgSm from './assets/h-ring-fg.svg'
import ringBgLg from './assets/s-ring-bg.svg'
import ringFgLg from './assets/s-ring-fg.svg'
import tabBed from './assets/tab-bed.svg'
import tabCart from './assets/tab-cart.svg'
import tabHome from './assets/tab-home.svg'
import tabSparkles from './assets/tab-sparkles.svg'
import tabUser from './assets/tab-user.svg'
import { nightlyHref } from './routes'

// Nightly 공통 조각 — 유리 클래스 · 빛 번짐 · 로고 · 상태 표시 · 배지 · 버튼 · 헤더 · 푸터 · 점수 링 · 모바일 탭 바

/** 유리 테두리 — 윗변이 가장 밝고 아랫변, 옆 순서로 옅어진다 */
const EDGE = 'border border-nt-edge border-t-nt-edge-top border-b-nt-edge-bottom'

/** 유리 카드 3단계 (시안 Glass/Default · Subtle · Elevated). 바탕은 위 12% → 아래 3% 흰빛 */
export const GLASS = `rounded-card ${EDGE} bg-linear-to-b from-white/12 to-white/3 shadow-nt-glass inset-shadow-nt-specular backdrop-blur-[8px]`
export const GLASS_SUBTLE = `rounded-card ${EDGE} bg-linear-to-b from-white/10 to-white/3 backdrop-blur-[6px]`
export const GLASS_ELEVATED = `rounded-card ${EDGE} bg-linear-to-b from-white/12 to-white/3 shadow-nt-glass inset-shadow-nt-specular backdrop-blur-[12px]`
/** 카드 안 조작 요소(칩 · 추천 질문 · 말풍선 · 날짜 이동)의 얇은 유리. 라운드는 쓰는 곳에서 붙인다 */
export const GLASS_CONTROL = `${EDGE} bg-linear-to-b from-white/10 to-white/3`
/** 헤더(PC · 모바일 코치)의 유리 막 */
export const GLASS_BAR =
  'border-b border-nt-edge-bottom bg-linear-to-b from-white/12 to-white/3 shadow-nt-glass inset-shadow-nt-specular backdrop-blur-[12px]'

/** 카드 안 숫자 묶음 — 박스 대신 세로 구분선으로 나눈다(시안 수정안 '중첩 박스 정리') */
export const STAT = 'flex flex-1 flex-col gap-1 py-1 not-first:border-l not-first:border-nt-line-light not-first:pl-4'

const GLOWS = { 860: glow860, 880: glow880, 940: glow940 }

/**
 * 바탕의 흰 빛 번짐(시안 Ambient Orb · Light). 위치는 1440 시안 프레임 기준 그림 왼쪽 위 좌표.
 * 부모에 relative isolate 를 두면 내용 뒤(-z-10)에 깔린다.
 */
export function Ambient({ glows }: { glows: { size: keyof typeof GLOWS; x: number; y: number }[] }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="relative mx-auto h-full max-w-360">
        {glows.map(({ size, x, y }) => (
          <img
            key={`${x}-${y}`}
            src={GLOWS[size]}
            alt=""
            width={size}
            height={size}
            className="absolute max-w-none"
            style={{ left: x, top: y }}
          />
        ))}
      </div>
    </div>
  )
}

/** 반짝이는 유리 상자 — 로고 · AI 아바타 · 보내기 버튼 */
export const MARK =
  'flex shrink-0 items-center justify-center border border-white/35 bg-linear-to-b from-white/16 to-white/4 shadow-nt-mark inset-shadow-nt-mark backdrop-blur-[6px]'

export function Mark({ icon, size, iconSize, rounded = 'rounded-sm' }: { icon: string; size: string; iconSize: number; rounded?: string }) {
  return (
    <span aria-hidden="true" className={`${MARK} ${size} ${rounded}`}>
      <img src={icon} alt="" width={iconSize} height={iconSize} />
    </span>
  )
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <Mark icon={moonIcon} size="size-8" iconSize={18} />
      <span lang="en" className="text-20 font-semibold tracking-normal text-nt-main">
        Nightly
      </span>
    </span>
  )
}

const PULSE_TONE = {
  /** 헤더 — 바탕 없이 초록 점 + 초록 글자 */
  plain: { box: '', dot: pulseDot, text: 'text-nt-success' },
  /** 카드 · 머리말 — 옅은 초록 바탕 */
  soft: { box: 'bg-nt-success-soft', dot: pulseDot, text: 'text-nt-success' },
  /** 응답 코드처럼 덜 중요한 상태 — 회색 점 + 옅은 글자 */
  muted: { box: 'bg-nt-success-soft', dot: pulseMutedDot, text: 'text-nt-weak' },
}

/** 빛나는 점 + 짧은 상태 글자 (API Online · 200 OK · 동기화 시각) */
export function StatusPulse({ tone = 'soft', children }: { tone?: keyof typeof PULSE_TONE; children: ReactNode }) {
  const { box, dot, text } = PULSE_TONE[tone]
  return (
    <span className={`inline-flex shrink-0 items-center gap-2 rounded-full py-1.5 pr-3 pl-2.5 ${box}`}>
      <span aria-hidden="true" className="relative size-2">
        <img src={dot} alt="" width={28} height={28} className="absolute -inset-2.5 max-w-none" />
      </span>
      <span className={`text-12 font-medium tracking-normal ${text}`}>{children}</span>
    </span>
  )
}

const BADGE_TONE = {
  success: 'bg-nt-success-soft text-nt-success',
  primary: 'bg-nt-primary-soft text-nt-primary-text',
  secondary: 'bg-nt-secondary-soft text-nt-secondary-text',
  danger: 'bg-nt-danger-soft text-nt-danger',
  muted: 'bg-nt-glass-muted text-nt-sub',
}

export function Badge({ tone = 'success', children }: { tone?: keyof typeof BADGE_TONE; children: ReactNode }) {
  return (
    <span className={`inline-flex shrink-0 rounded-full border border-nt-line-light px-2.5 py-1 text-12 font-semibold ${BADGE_TONE[tone]}`}>
      {children}
    </span>
  )
}

/** 파란 주 버튼(인디고 빛) — 페이지 이동이라 <a> 로 둔다 */
export const PRIMARY_BUTTON =
  'flex h-12 items-center justify-center rounded-sm bg-nt-cta px-6 text-16 font-semibold text-nt-main shadow-nt-cta inset-shadow-nt-button transition-[filter] hover:brightness-110'
export const GHOST_BUTTON =
  'flex h-12 items-center justify-center rounded-sm border border-nt-line bg-white/5 px-6 text-16 font-semibold text-nt-main backdrop-blur-[4px] transition-colors hover:bg-white/10'

type NavKey = 'sleep' | 'coach'

// 타임세일 · 정기구독은 다른 곳에서 완성하는 화면이라 여기서는 누르지 않는 이름만 둔다
const NAV: { label: string; key?: NavKey }[] = [
  { label: '수면 대시보드', key: 'sleep' },
  { label: 'AI 코치', key: 'coach' },
  { label: '타임세일' },
  { label: '정기구독' },
]

function NavLink({ label, navKey, active, className }: { label: string; navKey?: NavKey; active: boolean; className: string }) {
  if (!navKey)
    return (
      <span aria-disabled="true" title="준비 중이에요" className={`${className} cursor-default text-nt-sub`}>
        {label}
      </span>
    )
  return (
    <a
      href={nightlyHref(`/${navKey}`)}
      aria-current={active ? 'page' : undefined}
      className={`${className} transition-colors hover:text-nt-main ${active ? 'text-nt-main' : 'text-nt-sub'}`}
    >
      {label}
    </a>
  )
}

/**
 * 72 높이 유리 헤더. 홈(guest)은 회원가입 · 로그인, 대시보드 · 코치(member)는 알림 · 계정을 보여 준다.
 * 로그인 화면은 이번 범위 밖이라 회원가입 · 로그인은 데모 계정의 수면 대시보드로 보낸다.
 * 모바일(56 높이)은 로고 · 상태 점 · 알림 · 메뉴(≡)만 남기고, 메뉴를 누르면 헤더 아래로 목록이 펼쳐진다(시안 01-M).
 */
export function Header({ variant, active }: { variant: 'guest' | 'member'; active?: NavKey }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  return (
    <header
      className={`sticky top-0 z-20 ${GLASS_BAR}`}
      onKeyDown={(e) => {
        if (e.key !== 'Escape' || !menuOpen) return
        // 닫은 뒤 키보드 사용자가 제자리(메뉴 버튼)에서 이어 가게 한다
        setMenuOpen(false)
        menuButton.current?.focus()
      }}
    >
      <div className="mx-auto flex h-14 max-w-300 items-center justify-between px-5 lg:h-18 xl:px-0">
        <div className="flex items-center gap-12">
          <a href={nightlyHref()} aria-label="Nightly 홈">
            <Logo />
          </a>
          <nav aria-label="Nightly 메뉴" className="hidden items-center gap-7 lg:flex">
            {NAV.map(({ label, key }) => (
              <NavLink key={label} label={label} navKey={key} active={key === active} className="text-15 font-medium" />
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <StatusPulse tone="plain">API Online</StatusPulse>
          {variant === 'guest' ? (
            <>
              <a href={nightlyHref('/sleep')} className="flex h-10 items-center px-4 text-14 font-medium text-nt-primary-text hover:underline">
                회원가입
              </a>
              <a
                href={nightlyHref('/sleep')}
                className="flex h-10 items-center rounded-sm bg-nt-primary px-4 text-14 font-medium text-nt-main shadow-nt-cta inset-shadow-nt-button hover:brightness-110"
              >
                로그인
              </a>
            </>
          ) : (
            <>
              <img src={bellIcon} alt="" width={20} height={20} />
              <span className={`flex items-center gap-2 rounded-full py-1 pr-3 pl-1 ${GLASS_CONTROL}`}>
                <span aria-hidden="true" className={`${MARK} size-7 rounded-full text-12 font-semibold text-nt-mark`}>
                  밤
                </span>
                <span className="text-14 font-medium text-nt-main">김나잇</span>
              </span>
            </>
          )}
        </div>

        {/* 시안의 상태 점 · 알림 · 메뉴는 한 장의 그림이라, 메뉴 자리(오른쪽 끝)에만 투명 버튼을 얹는다 */}
        <div className="relative lg:hidden">
          <img src={mobileRight} alt="" width={84} height={22} />
          <button
            ref={menuButton}
            type="button"
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={menuOpen}
            aria-controls="nightly-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="absolute -top-3 -right-3 size-11 rounded-sm"
          />
        </div>
      </div>

      {menuOpen && (
        <nav id="nightly-mobile-menu" aria-label="Nightly 메뉴" className="border-t border-nt-line-light px-5 py-2 lg:hidden">
          {NAV.map(({ label, key }) => (
            <NavLink key={label} label={label} navKey={key} active={key === active} className="flex py-3 text-15 font-medium" />
          ))}
        </nav>
      )}
    </header>
  )
}

const GITHUB_URL = 'https://github.com/give-it-a-shottt'

export function Footer() {
  return (
    <footer className="border-t border-nt-line-light bg-nt-bg-light py-6 lg:py-10">
      <div className="mx-auto flex max-w-300 flex-col gap-3 px-5 lg:h-10 lg:flex-row lg:items-center lg:justify-between xl:px-0">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <Logo />
          <p className="hidden text-12 font-medium text-nt-weak lg:block">
            © 2026 Nightly · my-nightly-project (FastAPI · PostgreSQL · Next.js)
          </p>
          <p className="text-12 font-medium text-nt-weak lg:hidden">© 2026 Nightly · 이용약관 · 개인정보처리방침</p>
        </div>
        <div className="hidden items-center gap-5 text-12 font-medium text-nt-sub lg:flex">
          <span>이용약관</span>
          <span>개인정보처리방침</span>
          <span lang="en">Grafana :3001</span>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub (새 창)">
            <img src={githubIcon} alt="" width={16} height={16} />
          </a>
        </div>
      </div>
    </footer>
  )
}

const RING = {
  sm: { bg: ringBgSm, fg: ringFgSm, size: 136, box: 'size-34' },
  lg: { bg: ringBgLg, fg: ringFgLg, size: 200, box: 'size-50' },
}

/** 수면 점수 링 — 시안의 87점 원호 그림을 그대로 쓰고 가운데에 숫자를 얹는다 */
export function ScoreRing({ size, children }: { size: keyof typeof RING; children: ReactNode }) {
  const ring = RING[size]
  return (
    <div className={`relative shrink-0 ${ring.box}`}>
      <img src={ring.bg} alt="" width={ring.size} height={ring.size} className="absolute inset-0" />
      <img src={ring.fg} alt="" width={ring.size} height={ring.size} className="absolute inset-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">{children}</div>
    </div>
  )
}

const TABS: { label: string; icon: string; href?: string }[] = [
  { label: '홈', icon: tabHome, href: nightlyHref() },
  { label: '수면', icon: tabBed, href: nightlyHref('/sleep') },
  { label: '코치', icon: tabSparkles, href: nightlyHref('/coach') },
  { label: '샵', icon: tabCart },
  { label: '마이', icon: tabUser },
]

/** 모바일 대시보드 아래에 떠 있는 탭 바(시안 04-M). 샵 · 마이는 다른 곳에서 완성하는 화면이라 누르지 않는다 */
export function TabBar({ active }: { active: string }) {
  return (
    <nav
      aria-label="Nightly 탭"
      className={`fixed inset-x-5 bottom-4 z-20 flex h-16 items-center justify-between px-3 lg:hidden ${GLASS_ELEVATED}`}
    >
      {TABS.map(({ label, icon, href }) => {
        const isActive = label === active
        const className = `flex flex-col items-center gap-1 rounded-md px-3 py-1.5 text-11 font-medium ${
          isActive ? 'bg-nt-primary-soft text-nt-primary-text' : 'text-nt-weak'
        }`
        const content = (
          <>
            <img src={icon} alt="" width={20} height={20} />
            {label}
          </>
        )
        return href ? (
          <a key={label} href={href} aria-current={isActive ? 'page' : undefined} className={className}>
            {content}
          </a>
        ) : (
          <span key={label} aria-disabled="true" title="준비 중이에요" className={className}>
            {content}
          </span>
        )
      })}
    </nav>
  )
}
