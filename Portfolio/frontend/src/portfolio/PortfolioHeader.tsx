import { searchHref, type ResultTab } from './routes'
import SearchBox from './SearchBox'

const NAV: { tab: Exclude<ResultTab, 'all'>; label: string }[] = [
  { tab: 'front', label: 'Front' },
  { tab: 'back', label: 'Back' },
  { tab: 'design', label: 'Design' },
  { tab: 'study', label: 'Study' },
]

interface PortfolioHeaderProps {
  /** 결과 화면에서만 가운데 검색창을 보여준다 */
  search?: { query: string; onSearch: (query: string) => void }
  activeTab?: ResultTab
}

// 로고 · (결과 화면) 검색창 · Front/Back/Design/Study 바로가기. md 미만에서는 검색창이 두 번째 줄로 내려간다.
export default function PortfolioHeader({ search, activeTab = 'all' }: PortfolioHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-5 py-5 sm:px-10">
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

      {search && (
        <div className="order-last w-full md:order-none md:max-w-160 md:flex-1">
          {/* 검색어가 바뀌면 입력값도 새로 맞춘다 */}
          <SearchBox key={search.query} size="md" defaultValue={search.query} onSearch={search.onSearch} />
        </div>
      )}

      <nav aria-label="분야 바로가기" className="flex shrink-0 gap-1 rounded-full border border-regular p-1">
        {NAV.map(({ tab, label }) => {
          const active = activeTab === tab
          return (
            <a
              key={tab}
              href={searchHref('', tab)}
              aria-current={active ? 'page' : undefined}
              lang="en"
              className={`rounded-full px-3 py-2 text-14 font-medium tracking-normal sm:px-4 ${active ? 'bg-main text-white' : 'text-main hover:bg-light'}`}
            >
              {label}
            </a>
          )
        })}
      </nav>
    </header>
  )
}
