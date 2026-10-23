import { useState, type FormEvent, type ReactNode } from 'react'
import searchIcon from './assets/icon-search.svg'
import searchIcon24 from './assets/icon-search-24.svg'
import myIcon from './assets/icon-my.svg'
import cartIcon from './assets/icon-cart.svg'
import menuIcon from './assets/icon-menu.svg'
import { CATEGORIES, type Category } from './data'
import { CASE_HREF, flaseekHref, goTo } from './routes'
import { showToast, useCartCount } from './store'
import { Container, ToastHost } from './ui'

/** 헤더 메뉴에서 지금 보고 있는 카테고리. 'all' 은 BEST */
export type ActiveMenu = Category | 'all' | null

const categoryHref = (key: Category | 'all') => flaseekHref('/list', { cat: key === 'all' ? undefined : key })

/** 시안이라는 걸 먼저 알린다 — 실제 쇼핑몰로 오해하지 않게 */
function NoticeBar() {
  return (
    <div className="bg-main text-white">
      <Container className="flex h-9 items-center justify-between gap-3 text-12">
        <p className="truncate">
          <span lang="en">FLASEEK</span> 리뉴얼 제안 시안 · 실제 판매 페이지가 아니에요
        </p>
        <a href={CASE_HREF} className="shrink-0 font-semibold underline underline-offset-2">
          사례로 돌아가기
        </a>
      </Container>
    </div>
  )
}

function SearchForm({ className = '', autoFocus = false }: { className?: string; autoFocus?: boolean }) {
  const [query, setQuery] = useState('')
  const submit = (event: FormEvent) => {
    event.preventDefault()
    goTo(flaseekHref('/list', { q: query.trim() }))
  }
  return (
    <form role="search" onSubmit={submit} className={`flex h-10 items-center gap-2 rounded-full bg-regular pr-3 pl-4 ${className}`}>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="스타킹, 캐미솔 검색"
        aria-label="상품 검색"
        autoFocus={autoFocus}
        className="min-w-0 flex-1 bg-transparent text-14 text-main outline-none placeholder:text-disabled"
      />
      <button type="submit" aria-label="검색" className="shrink-0">
        <img src={searchIcon} alt="" width={20} height={20} />
      </button>
    </form>
  )
}

function CartButton() {
  const count = useCartCount()
  return (
    <button
      type="button"
      onClick={() => showToast(`장바구니에 ${count}개 담겨 있어요 · 장바구니 화면은 시안 범위 밖이에요`)}
      aria-label={`장바구니 ${count}개`}
      className="relative flex size-11 items-center justify-center"
    >
      <img src={cartIcon} alt="" width={24} height={24} />
      <span className="absolute top-1 left-6.5 rounded-full bg-flaseek-pink px-1.25 py-px text-11 font-semibold tracking-normal text-main">
        {count}
      </span>
    </button>
  )
}

function Logo() {
  return (
    <a href={flaseekHref()} lang="en" className="text-24 font-semibold tracking-normal text-flaseek-pink">
      FLASEEK
    </a>
  )
}

function Header({ active }: { active: ActiveMenu }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b border-regular bg-white">
      {/* PC — 로고 · 영문+한글 2줄 메뉴 · 검색·마이·장바구니 */}
      <Container className="hidden items-center justify-between py-4 lg:flex">
        <Logo />
        <nav aria-label="카테고리">
          <ul className="flex gap-5 xl:gap-8">
            {CATEGORIES.map(({ key, en, ko }) => (
              <li key={key}>
                <a href={categoryHref(key)} aria-current={active === key ? 'page' : undefined} className="flex flex-col items-center gap-0.5">
                  <span lang="en" className="text-14 font-semibold tracking-normal text-main">
                    {en}
                  </span>
                  <span className="text-12 text-sub">{ko}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <SearchForm className="w-44 xl:w-60" />
          <a href={flaseekHref('/login')} aria-label="로그인" className="flex size-11 items-center justify-center">
            <img src={myIcon} alt="" width={24} height={24} />
          </a>
          <CartButton />
        </div>
      </Container>

      {/* 모바일 — 메뉴·로고 / 검색·장바구니, 아래에 가로로 넘기는 카테고리 줄 */}
      <div className="lg:hidden">
        <div className="flex h-14 items-center justify-between px-2">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label="메뉴"
              className="flex size-11 items-center justify-center"
            >
              <img src={menuIcon} alt="" width={24} height={24} />
            </button>
            <Logo />
          </div>
          <div className="flex">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-expanded={searchOpen}
              aria-label="검색 열기"
              className="flex size-11 items-center justify-center"
            >
              <img src={searchIcon24} alt="" width={24} height={24} />
            </button>
            <CartButton />
          </div>
        </div>
        {menuOpen && (
          <nav aria-label="메뉴" className="border-t border-light px-5 py-2">
            <ul className="flex flex-col text-15 text-main">
              <li>
                <a href={flaseekHref('/login')} className="block py-2.5">
                  로그인
                </a>
              </li>
              {CATEGORIES.map(({ key, ko }) => (
                <li key={key}>
                  <a href={categoryHref(key)} className="block py-2.5">
                    {ko}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {searchOpen && (
          <div className="px-5 pb-3">
            <SearchForm autoFocus />
          </div>
        )}
        <nav aria-label="카테고리" className="scrollbar-none flex gap-5 overflow-x-auto px-5 pt-1 pb-3 text-14">
          {CATEGORIES.map(({ key, ko }) => (
            <a
              key={key}
              href={categoryHref(key)}
              aria-current={active === key ? 'page' : undefined}
              className={`shrink-0 whitespace-nowrap ${active === key ? 'font-semibold text-main' : 'font-medium text-sub'}`}
            >
              {ko}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

const COMPANY = [
  'Company : Ascend Corp. · CEO : Il-Heum Baek',
  'Address : 3F, 12 Samseong-ro 126-gil, Gangnam-gu, Seoul',
  'Business License : 120-88-20685 · Mall Order License : 2013-Seoul Gangnam-03223',
  'Hosting by Connect Waves',
]

function FooterLinks() {
  return (
    <p className="flex gap-4 text-12 font-medium">
      <span className="text-sub">회사소개</span>
      <span className="text-sub">이용약관</span>
      <span className="text-main">개인정보처리방침</span>
    </p>
  )
}

function CustomerCenter({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <p className="text-13 font-medium text-sub">고객센터</p>
      <p className="text-24 font-semibold tracking-normal text-main">02-1522-6075</p>
      <p className="text-12 text-sub">평일 10:30 – 18:00 (점심 12:00 – 13:00) · 주말·공휴일 휴무</p>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-light">
      {/* PC — 회사 정보 왼쪽, 고객센터 오른쪽 */}
      <Container className="hidden items-start justify-between pt-12 pb-16 lg:flex">
        <div className="flex flex-col gap-3">
          <p lang="en" className="text-16 font-semibold tracking-normal text-main">
            FLASEEK
          </p>
          <p lang="en" className="text-12 text-sub">
            {COMPANY[0]} · {COMPANY[1]}
            <br />
            {COMPANY[2]} · {COMPANY[3]}
          </p>
          <FooterLinks />
        </div>
        <CustomerCenter className="items-end" />
      </Container>
      {/* 모바일 — 고객센터를 먼저 */}
      <div className="flex flex-col gap-4 px-5 pt-8 pb-12 lg:hidden">
        <CustomerCenter />
        <FooterLinks />
        <p lang="en" className="text-11 text-sub">
          {COMPANY.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    </footer>
  )
}

interface ShellProps {
  active: ActiveMenu
  /** 모바일 하단 고정 구매바가 있는 화면 — 푸터가 가려지지 않게 그만큼 띄운다 */
  mobileBottomBar?: boolean
  children: ReactNode
}

/** 모든 화면의 틀 — 안내 띠 · 헤더 · 본문 · 푸터 · 토스트 */
export default function Shell({ active, mobileBottomBar = false, children }: ShellProps) {
  return (
    <div className={`flex min-h-svh flex-col bg-white text-main ${mobileBottomBar ? 'pb-26 lg:pb-0' : ''}`}>
      <NoticeBar />
      <Header active={active} />
      <main className="flex-1">{children}</main>
      <Footer />
      <ToastHost />
    </div>
  )
}
