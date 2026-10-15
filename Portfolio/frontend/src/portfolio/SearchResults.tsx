import { CASES, KEYWORDS, matchesQuery, type PortfolioCase } from './data'
import { rankCases } from './rank'
import { SearchIcon } from '../shared/icons'
import CaseMeta from './CaseMeta'
import { searchHref, type ResultTab } from './routes'

const TABS: { tab: ResultTab; label: string }[] = [
  { tab: 'all', label: '전체' },
  { tab: 'front', label: 'Front' },
  { tab: 'back', label: 'Back' },
  { tab: 'design', label: 'Design' },
]

function KeywordChips({ exclude }: { exclude?: string }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {KEYWORDS.filter(({ label }) => label !== exclude).map(({ label }) => (
        <li key={label}>
          <a
            href={searchHref(label)}
            className="block rounded-full border border-regular bg-white px-4 py-2 text-14 font-medium text-main hover:bg-light"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  )
}

// 사례 한 줄 — 목록(리스트 아이템) B 스케일: 제목 20, 설명 14. 갈 곳(href)이 있는 사례만 행 전체가 링크다.
function ResultRow({ item }: { item: PortfolioCase }) {
  return (
    <li className="relative flex gap-6 border-b border-light py-6">
      <div className="flex min-w-0 flex-1 flex-col">
        <CaseMeta item={item} />
        <h2 className="mt-2 text-18 font-semibold break-keep text-main sm:text-20">
          {item.href ? (
            <a href={item.href} className="hover:text-portfolio after:absolute after:inset-0">
              {item.title}
            </a>
          ) : (
            item.title
          )}
        </h2>
        <p className="mt-2 text-14 break-keep text-sub">{item.description}</p>
        {item.metrics.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {item.metrics.map(({ label, value }) => (
              <li key={label} className="flex items-center gap-2 rounded-thumb-sm bg-light px-3 py-1 text-13">
                <span className="text-sub-weak">{label}</span>
                <span className="font-semibold tracking-normal text-main">{value}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 flex flex-wrap gap-2 text-13 text-sub-weak">
          {item.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </p>
        {/* 행 전체를 덮는 제목 링크(after:inset-0) 위로 올려야 눌린다 */}
        {item.links && (
          <p className="relative z-10 mt-3 flex flex-wrap gap-3 text-13">
            {item.links.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener"
                className="font-semibold text-sub underline-offset-4 hover:text-portfolio hover:underline"
              >
                {label} ↗
              </a>
            ))}
          </p>
        )}
      </div>

      {/* 화면이 있는 사례(Front·Design)만 썸네일을 둔다 */}
      {item.type !== 'Back' && (
        <div className="hidden h-28 w-40 shrink-0 overflow-hidden rounded-thumb border border-regular sm:block">
          {item.image ? (
            <img src={item.image} alt="" className="size-full object-cover object-top" />
          ) : (
            // 아직 캡처가 없는 프로젝트 — 시안의 사선 자리표시
            <div className="flex size-full items-center justify-center bg-[repeating-linear-gradient(135deg,#f7f7fb_0_8px,#f1f1f5_8px_16px)] font-mono text-11 tracking-normal text-sub-weak">
              screenshot
            </div>
          )}
        </div>
      )}
    </li>
  )
}

interface SearchResultsProps {
  query: string
  tab: ResultTab
}

export default function SearchResults({ query, tab }: SearchResultsProps) {
  // 레벨 높은 사례부터 — 기준은 rank.ts
  const matched = rankCases(CASES.filter((item) => !query || matchesQuery(item, query)))
  const counts: Record<ResultTab, number> = {
    all: matched.length,
    front: matched.filter((item) => item.type === 'Front').length,
    back: matched.filter((item) => item.type === 'Back').length,
    design: matched.filter((item) => item.type === 'Design').length,
  }
  const results = tab === 'all' ? matched : matched.filter((item) => item.type.toLowerCase() === tab)
  const related = KEYWORDS.filter(({ label }) => label !== query).slice(0, 5)

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="sr-only">{query ? `'${query}' 검색 결과` : '전체 사례'}</h1>

      <div className="border-b border-light">
        <nav aria-label="결과 분류" className="mx-auto flex max-w-300 gap-6 px-5 sm:px-10">
          {TABS.map(({ tab: id, label }) => {
            const active = tab === id
            return (
              <a
                key={id}
                href={searchHref(query, id)}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2 border-b-2 pt-4 pb-3 text-15 tracking-normal ${active ? 'border-black font-semibold text-main' : 'border-transparent font-medium text-sub-weak hover:text-main'}`}
              >
                {label}
                <span className="text-13 font-medium text-sub-weak tabular-nums">{counts[id]}</span>
              </a>
            )
          })}
        </nav>
      </div>

      <div className="mx-auto flex w-full max-w-300 flex-wrap items-start gap-16 px-5 pt-6 pb-20 sm:px-10">
        <main className="min-w-0 flex-[1_1_560px]">
          <p className="text-13 text-sub-weak">
            {query ? `'${query}' 검색 결과 ${results.length}건` : `전체 사례 ${results.length}건`}
          </p>

          {results.length > 0 ? (
            <ul className="mt-2">
              {results.map((item) => (
                <ResultRow key={item.slug} item={item} />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col gap-2 py-16">
              <h2 className="text-20 font-semibold break-keep text-main">
                {query ? `'${query}'에 대한 사례가 아직 없어요.` : '아직 등록된 사례가 없어요.'}
              </h2>
              <p className="text-14 text-sub">다른 키워드로 검색하거나 아래 키워드를 눌러보세요.</p>
              <div className="mt-4">
                <KeywordChips exclude={query} />
              </div>
            </div>
          )}
        </main>

        <aside aria-labelledby="related-title" className="min-w-60 flex-[0_1_280px] pt-8">
          <div className="rounded-card border border-regular p-6">
            <h2 id="related-title" className="text-14 font-semibold text-main">
              관련 검색어
            </h2>
            <ul className="mt-3 flex flex-col">
              {related.map(({ label }) => (
                <li key={label}>
                  <a href={searchHref(label)} className="flex items-center gap-3 py-2 text-14 text-sub hover:text-main">
                    <SearchIcon size={14} className="text-icon-disabled" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
