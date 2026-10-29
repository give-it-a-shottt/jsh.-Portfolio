import { useState } from 'react'
import bookmarkIcon from './assets/icon-bookmark.svg'
import cartIcon from './assets/icon-cart.svg'
import chevSmall from './assets/icon-chev-sm.svg'
import menuIcon from './assets/icon-menu.svg'
import searchIcon from './assets/icon-search-sm.svg'
import starIcon from './assets/icon-star.svg'
import userIcon from './assets/icon-user.svg'
import social1 from './assets/social-1.svg'
import social2 from './assets/social-2.svg'
import social3 from './assets/social-3.svg'
import { discountRate, rating, won, type Course } from './data'
import { useCourseSearch } from './hooks'
import { techlearnHref } from './routes'

// techlearn 공통 조각 — 로고 · 헤더 · 푸터 · 강좌 카드 · 섹션 머리말

export function Logo({ size = 'md' }: { size?: 'md' | 'sm' }) {
  const md = size === 'md'
  return (
    <span className="flex items-center gap-1">
      <span
        aria-hidden="true"
        className={`flex items-center justify-center rounded-xs bg-tl font-semibold text-white ${md ? 'size-8 text-18' : 'size-7 text-16'}`}
      >
        TL
      </span>
      <span lang="en" className={`font-semibold text-tl-ink ${md ? 'text-22' : 'text-18'}`}>
        Tech<span className="text-tl">Learn</span>
      </span>
    </span>
  )
}

const NAV = [
  { label: '강의 탐색', href: techlearnHref('/courses') },
  // 해시 라우팅이라 '#roadmap' 을 덧붙이면 다른 주소가 된다 — 홈이 ?to= 를 읽어 그 칸으로 내려간다
  { label: '로드맵', href: techlearnHref('', { to: 'roadmap' }) },
  { label: '커뮤니티' },
  { label: '멘토링' },
]

function NavItem({ label, href, className }: { label: string; href?: string; className: string }) {
  return href ? (
    <a href={href} className={`${className} hover:text-tl`}>
      {label}
    </a>
  ) : (
    <span aria-disabled="true" className={className}>
      {label}
      <span className="ml-1 text-11 text-tl-weak">준비 중</span>
    </span>
  )
}

// 64 높이, 흰 반투명 + 블러로 스크롤 중에도 위에 붙는다. 모바일은 로고 · 검색 · 장바구니 · 메뉴(≡)만 남기고,
// 메뉴를 누르면 헤더 아래로 메뉴 목록이 펼쳐진다(시안 01-M).
// 커뮤니티·멘토링·장바구니·내 학습실은 이번 범위 밖이라 누르지 않는 표시만 둔다.
export function Header() {
  const { query, setQuery, submit } = useCourseSearch()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header
      className="sticky top-0 z-20 bg-white/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-[6px]"
      onKeyDown={(e) => e.key === 'Escape' && setMenuOpen(false)}
    >
      <div className="mx-auto flex h-16 max-w-320 items-center justify-between gap-6 px-4 lg:gap-[75px] lg:px-8">
        <div className="flex items-center gap-6">
          <a href={techlearnHref()} aria-label="TechLearn 홈">
            <Logo />
          </a>
          <nav aria-label="techlearn 메뉴" className="hidden items-center gap-6 lg:flex">
            {NAV.map(({ label, href }) => (
              <NavItem key={label} label={label} href={href} className="text-15 text-tl-sub" />
            ))}
          </nav>
        </div>

        <form role="search" onSubmit={submit} className="relative hidden max-w-112 flex-1 md:block">
          <img src={searchIcon} alt="" width={15} height={15} className="pointer-events-none absolute top-[12.5px] left-[14.5px]" />
          <label htmlFor="tl-header-search" className="sr-only">
            강의 검색
          </label>
          <input
            id="tl-header-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="배우고 싶은 기술, 강의 검색..."
            className="h-10 w-full rounded-xs bg-tl-bg pr-4 pl-10 text-13 text-tl-ink outline-none placeholder:text-tl-weak focus-visible:ring-2 focus-visible:ring-tl"
          />
        </form>

        <div className="flex items-center gap-4">
          <a href={techlearnHref('/courses')} aria-label="강의 검색" className="p-1 md:hidden">
            <img src={searchIcon} alt="" width={15} height={15} />
          </a>
          <span role="img" aria-label="장바구니 2개" className="relative px-1 pt-1 pb-[9px]">
            <img src={cartIcon} alt="" width={19.98} height={20} />
            <span
              aria-hidden="true"
              className="absolute top-0.5 right-[2px] flex size-4 items-center justify-center rounded-md bg-tl text-[10px] font-semibold text-white"
            >
              2
            </span>
          </span>
          <span aria-hidden="true" className="hidden h-5 w-px bg-tl-line sm:block" />
          <span className="hidden text-13 text-tl-sub sm:block">내 학습실</span>
          <span role="img" aria-label="내 계정" className="hidden size-8 items-center justify-center rounded-md bg-tl lg:flex">
            <img src={userIcon} alt="" width={12} height={12} />
          </span>
          <button
            type="button"
            aria-label="메뉴"
            aria-expanded={menuOpen}
            aria-controls="tl-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-xs p-0.5 hover:bg-tl-chip lg:hidden"
          >
            <img src={menuIcon} alt="" width={22} height={22} />
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav id="tl-mobile-menu" aria-label="techlearn 메뉴" className="border-t border-tl-line bg-white px-4 py-2 lg:hidden">
          <ul className="flex flex-col">
            {[...NAV, { label: '내 학습실' }].map(({ label, href }) => (
              <li key={label}>
                <NavItem label={label} href={href} className="block py-3 text-15 text-tl-sub" />
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

const FOOTER_LINKS = [
  { title: '강의 & 학습', items: ['전체 강의', '추천 로드맵', '무료 강의', '수료증 검증'] },
  { title: '커뮤니티', items: ['질문 & 답변', '기술 블로그', '1:1 멘토링', '스터디 모임'] },
  { title: '고객지원', items: ['자주 묻는 질문', '수강료 환불 규정', '지식공유자 참여', '기업 B2B 교육'] },
]

export function Footer() {
  return (
    <footer className="bg-tl-bg">
      <div className="mx-auto flex max-w-320 flex-col gap-6 p-4 sm:p-8">
        <div className="grid grid-cols-3 gap-6 lg:grid-cols-5">
          <div className="col-span-3 flex flex-col gap-2 lg:col-span-2">
            <Logo size="sm" />
            <p className="max-w-96 text-13 break-keep text-tl-sub">
              개발자 실무 교육부터 취업·이직 커리어 성장까지 함께하는 대한민국 대표 테크 교육 플랫폼입니다.
            </p>
            <div className="flex gap-2 pt-2" aria-hidden="true">
              {[
                { src: social1, width: 15, height: 12 },
                { src: social2, width: 15, height: 9 },
                { src: social3, width: 15, height: 15 },
              ].map(({ src, width, height }) => (
                <span key={src} className="flex size-8 items-center justify-center rounded-xs bg-tl-line">
                  <img src={src} alt="" width={width} height={height} />
                </span>
              ))}
            </div>
          </div>
          {FOOTER_LINKS.map(({ title, items }) => (
            <div key={title} className="flex flex-col gap-2">
              <h2 className="text-15 font-medium text-tl-ink">{title}</h2>
              <ul className="flex flex-col gap-1 text-13 text-tl-sub">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 rounded-xs bg-tl-line/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          {/* 시안의 회사 정보 자리 — 실제 회사처럼 보이지 않게 포트폴리오 시안임을 적는다 */}
          <p className="text-13 break-keep text-tl-sub">
            © 2026 TechLearn — 개인 포트폴리오 시안으로, 실제 수강·결제가 이루어지지 않습니다.
          </p>
          <p className="flex gap-4 text-11 text-tl-sub">
            <span>이용약관</span>
            <span className="font-medium text-tl-ink">개인정보처리방침</span>
            <span>운영정책</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

/** 섹션 머리말 — 작은 영문 라벨 + 32 제목 */
export function SectionTitle({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return (
    <div className="flex flex-col gap-px pt-[3px]">
      <p lang="en" className="text-13 font-semibold text-tl uppercase">
        {eyebrow}
      </p>
      <h2 id={id} className="text-24 font-semibold text-tl-ink sm:text-32">
        {title}
      </h2>
    </div>
  )
}

// 강좌 카드 — 썸네일 153 · 난이도 라벨 · 북마크, 아래 기술 태그 · 제목 2줄 · 멘토 · 평점과 가격
export function CourseCard({ course }: { course: Course }) {
  const rate = discountRate(course)
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-sm bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="relative h-[153px] overflow-hidden bg-tl-chip">
        <img src={course.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        <span className="absolute bottom-2.5 left-2.5 rounded-tl-tag bg-tl-dark/85 px-2 py-0.5 text-11 font-medium text-white backdrop-blur-[4px]">
          {course.level}
        </span>
      </div>
      <button
        type="button"
        aria-label={`${course.title} 찜하기`}
        className="absolute top-2.5 right-2.5 z-10 flex size-8 items-center justify-center rounded-md bg-white/80 backdrop-blur-[4px]"
      >
        <img src={bookmarkIcon} alt="" width={11.67} height={15} />
      </button>
      <div className="flex flex-1 flex-col p-4">
        <p className="flex flex-wrap gap-1.5 pb-2">
          {course.tags.map((tag) => (
            <span key={tag} lang="en" className="rounded-tl-tag bg-tl-chip px-2 py-0.5 text-12 text-tl-sub">
              {tag}
            </span>
          ))}
        </p>
        <h3 className="mb-2 line-clamp-2 text-18 font-semibold break-keep text-tl-ink">
          {/* 카드 전체를 누르는 링크 — 찜 버튼은 위에 따로 둔다 */}
          <a href={techlearnHref('/courses')} className="after:absolute after:inset-0 group-hover:text-tl">
            {course.title}
          </a>
        </h3>
        <p className="mb-4 text-13 text-tl-sub">멘토 {course.mentor}</p>
        <div className="-mx-4 mt-auto flex flex-col gap-1 bg-tl-bg/40 px-4 py-2">
          <p className="flex items-center gap-1 text-11 font-semibold">
            <img src={starIcon} alt="" width={13.33} height={12.67} />
            <span className="text-tl-ink">{rating(course.rating)}</span>
            <span className="text-tl-weak">({course.students.toLocaleString('ko-KR')}명 수강)</span>
          </p>
          <div className="flex items-end justify-between">
            {rate > 0 && <p className="pb-5 text-15 font-semibold text-tl-sale">{rate}% 할인</p>}
            <p className="ml-auto flex flex-col items-end font-semibold">
              {course.originalPrice && (
                <s className="text-11 text-tl-weak">
                  <span className="sr-only">정가 </span>
                  {won(course.originalPrice)}
                </s>
              )}
              <span className="text-18 text-tl-ink">
                <span className="sr-only">할인가 </span>
                {won(course.price)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

/** 위치 표시 — '홈 › 강의 목록'. 마지막 칸이 지금 화면이다 */
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="현재 위치">
      <ol className="flex items-center gap-1.5 text-13">
        {items.map(({ label, href }, i) => {
          const last = i === items.length - 1
          return (
            <li key={label} className="flex items-center gap-1.5">
              {i > 0 && <img src={chevSmall} alt="" width={12} height={12} />}
              {last || !href ? (
                <span aria-current={last ? 'page' : undefined} className={last ? 'font-medium text-tl-ink' : 'text-tl-muted'}>
                  {label}
                </span>
              ) : (
                <a href={href} className="text-tl-muted hover:text-tl">
                  {label}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
