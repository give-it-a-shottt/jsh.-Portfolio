import { useRef, useState, type ReactNode } from 'react'
import bellIcon from './assets/bell.svg'
import githubIcon from './assets/github.svg'
import mobileRight from './assets/m-header-right.svg'
import moonIcon from './assets/moon.svg'
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

// Nightly 공통 조각 — 유리 카드 클래스 · 로고 · 상태 표시 · 배지 · 버튼 · 헤더 · 푸터 · 점수 링 · 모바일 탭 바

/** 유리 카드 3단계 (시안 Glass/Default · Subtle · Elevated) */
export const GLASS =
  'rounded-card border border-nt-line bg-nt-glass shadow-nt-glass inset-shadow-nt-specular backdrop-blur-[8px]'
export const GLASS_SUBTLE = 'rounded-card border border-nt-line bg-nt-glass-subtle backdrop-blur-[6px]'
export const GLASS_ELEVATED =
  'rounded-card border border-nt-line-highlight bg-nt-glass-elevated shadow-nt-glass inset-shadow-nt-specular backdrop-blur-[12px]'
/** 카드 안의 작은 칸(헬스 체크 · 요약 숫자 · 기기 상태) */
export const CELL = 'rounded-md border border-nt-line-light bg-nt-glass-highlight'

/** 반짝이는 유리 아이콘 상자 — 로고 · 기능 카드 · 단계 카드 */
export function Mark({ icon, size, iconSize, rounded = 'rounded-sm' }: { icon: string; size: string; iconSize: number; rounded?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center border border-white/35 bg-linear-to-b from-white/16 to-white/4 shadow-nt-mark inset-shadow-nt-mark backdrop-blur-[6px] ${size} ${rounded}`}
    >
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

/** 초록 점 대신 빛나는 흰 점 + 짧은 상태 글자 (API Online · 200 OK · 동기화 시각) */
export function StatusPulse({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-nt-glass-soft py-1.5 pr-3 pl-2.5">
      <span aria-hidden="true" className="relative size-2">
        <img src={pulseDot} alt="" width={28} height={28} className="absolute -inset-2.5 max-w-none" />
      </span>
      <span className="text-12 font-medium tracking-normal text-nt-success">{children}</span>
    </span>
  )
}

const BADGE_TONE = {
  success: 'bg-nt-glass-soft text-nt-success',
  primary: 'bg-nt-primary-soft text-nt-primary-text',
  secondary: 'bg-nt-glass-soft text-nt-secondary-text',
  warning: 'bg-nt-warning-soft text-nt-warning',
  danger: 'bg-nt-danger-soft text-nt-danger',
  muted: 'bg-nt-glass-highlight text-nt-sub',
}

export function Badge({ tone = 'success', children }: { tone?: keyof typeof BADGE_TONE; children: ReactNode }) {
  return (
    <span className={`inline-flex shrink-0 rounded-full border border-nt-line-light px-2.5 py-1 text-12 font-semibold ${BADGE_TONE[tone]}`}>
      {children}
    </span>
  )
}

/** 파란 그라데이션 주 버튼 — 페이지 이동이라 <a> 로 둔다 */
export const PRIMARY_BUTTON =
  'flex h-12 items-center justify-center rounded-sm bg-linear-160 from-nt-primary from-15% to-nt-primary-strong to-85% px-6 text-16 font-semibold text-nt-main shadow-nt-cta inset-shadow-nt-button transition-[filter] hover:brightness-110'
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
      className="sticky top-0 z-20 border-b border-nt-line bg-nt-glass-elevated shadow-nt-glass inset-shadow-nt-specular backdrop-blur-[12px]"
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
          <StatusPulse>API Online</StatusPulse>
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
              <span className="flex items-center gap-2 rounded-full border border-nt-line bg-nt-glass-highlight py-1 pr-3 pl-1">
                <span
                  aria-hidden="true"
                  className="flex size-7 items-center justify-center rounded-full bg-linear-135 from-nt-primary-text from-15% to-nt-secondary to-85% text-12 font-semibold text-nt-ink"
                >
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
