import { studyHref } from './notes'
import SearchBox from './SearchBox'

/** 헤더 탭 — Design · Fullstack 을 합쳐 Main(첫 화면) / Study 둘로(F-013) */
export type HeaderTab = 'main' | 'study'

const NAV: { tab: HeaderTab; label: string; href: string }[] = [
  { tab: 'main', label: 'Main', href: '#/' },
  { tab: 'study', label: 'Study', href: studyHref() },
]

interface PortfolioHeaderProps {
  /** 검색창 — 모든 화면에 작게 둔다(F-013). 결과 화면이면 지금 검색어를 채워 둔다 */
  search: { query: string; onSearch: (query: string) => void }
  activeTab: HeaderTab
}

// 로고 · 작은 검색창 · Main/Study 바로가기(F-013). md 미만에서는 검색창이 두 번째 줄로 내려간다.
// 높이 72 · 아래 구분선 · 본문과 같은 1200 폭 안에 정렬 (피그마 01 Home 리뉴얼 Header)
export default function PortfolioHeader({ search, activeTab }: PortfolioHeaderProps) {
  return (
    <header className="border-b border-light px-5 sm:px-10">
      <div className="mx-auto flex min-h-18 w-full max-w-300 flex-wrap items-center justify-between gap-x-6 gap-y-4 py-4">
        {/* 로고 = 모노그램 + 'jsh.' 글자 */}
        <a href="#/" aria-label="jsh 포트폴리오 홈" className="flex shrink-0 items-center gap-3">
          <svg aria-hidden="true" viewBox="2 5 26 26" className="size-9" fill="none">
            <rect x="2" y="5" width="26" height="26" rx="7" fill="#18181B" />
            <path d="M12 11V21C12 23 10.5 24 8.5 24" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="21" cy="21" r="2" fill="#6366F1" />
          </svg>
          <span className="block">
            <svg aria-hidden="true" viewBox="37 7 38 22" className="h-7 w-auto overflow-visible" fill="none">
              <text
                x="38"
                y="23"
                fontFamily="system-ui, -apple-system, 'SF Pro Display', 'Inter', sans-serif"
                fontSize="19"
                fontWeight="700"
                letterSpacing="-0.6px"
                fill="#09090B"
              >
                jsh<tspan fill="#6366F1">.</tspan>
              </text>
            </svg>
          </span>
        </a>
  
        <div className="order-last w-full md:order-none md:max-w-100 md:flex-1">
          {/* 검색어가 바뀌면 입력값도 새로 맞춘다 */}
          <SearchBox key={search.query} size="sm" defaultValue={search.query} onSearch={search.onSearch} />
        </div>
  
        <nav aria-label="바로가기" className="flex shrink-0 gap-1 rounded-full border border-regular p-1">
          {NAV.map(({ tab, label, href }) => {
            const active = activeTab === tab
            return (
              <a
                key={tab}
                href={href}
                aria-current={active ? 'page' : undefined}
                lang="en"
                className={`rounded-full px-3 py-2 text-14 font-medium tracking-normal sm:px-4 ${active ? 'bg-main text-white' : 'text-main hover:bg-light'}`}
              >
                {label}
              </a>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
