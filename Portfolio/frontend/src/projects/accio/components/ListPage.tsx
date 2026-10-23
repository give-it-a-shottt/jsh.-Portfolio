import { useState } from 'react'
import checkIcon from '../assets/figma/v3/icons/check.svg'
import gridViewIcon from '../assets/figma/v3/icons/grid-view.svg'
import viewListIcon from '../assets/figma/v3/icons/view-list.svg'
import { LIST_PAGE } from '../data/mock'
import ProductCard from './ProductCard'
import SiteHeader from '../ui/SiteHeader'

const CHIP_CLASS = 'shrink-0 rounded-full px-3 py-1.5 text-12 font-semibold whitespace-nowrap'

// 시안 1280px 기준: 좌우 24px 여백 안에 필터(212px) + 24px + 결과(996px).
// 결과 영역은 툴바·그리드 모두 좌우 32px 들여 4열 카드(약 221px)를 가운데 둔다. lg 미만에서는 필터를 '필터' 버튼으로 접는다.
export default function ListPage() {
  const [checkedFilters, setCheckedFilters] = useState(() => new Set(LIST_PAGE.defaultCheckedFilters))
  const [sort, setSort] = useState(LIST_PAGE.sortOptions[0])
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const toggleFilter = (key: string) => {
    setCheckedFilters((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="flex min-h-svh flex-col bg-white">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-2.5 px-4 py-6 sm:px-6">
        <nav aria-label="현재 위치" className="text-12 text-disabled">
          {LIST_PAGE.breadcrumb.join(' › ')}
        </nav>

        <div className="flex items-baseline gap-2.5">
          <h1 className="text-20 font-semibold text-main">{LIST_PAGE.title}</h1>
          <p className="text-12 text-sub-weak tabular-nums">{LIST_PAGE.totalCount.toLocaleString('ko-KR')}개 상품</p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <aside
            id="list-filters"
            aria-label="상품 필터"
            className={`w-full shrink-0 flex-col gap-5 lg:flex lg:w-[212px] ${filtersOpen ? 'flex' : 'hidden'}`}
          >
            {LIST_PAGE.filterGroups.map((group) => (
              <fieldset key={group.title} className="flex flex-col gap-2 border-b border-light pb-5">
                <legend className="mb-2 text-13 font-semibold text-main">{group.title}</legend>
                {group.options.map((option) => {
                  const key = `${group.title}:${option}`
                  const checked = checkedFilters.has(key)
                  return (
                    <label key={key} className="flex cursor-pointer items-center gap-2 self-start">
                      <input type="checkbox" checked={checked} onChange={() => toggleFilter(key)} className="peer sr-only" />
                      <span
                        aria-hidden="true"
                        className={`flex size-[18px] shrink-0 items-center justify-center rounded-badge peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${checked ? 'bg-main' : 'border-[1.5px] border-regular bg-white'}`}
                      >
                        {checked && <img src={checkIcon} alt="" />}
                      </span>
                      <span className="text-13 text-sub-weak">{option}</span>
                    </label>
                  )
                })}
              </fieldset>
            ))}

            <div className="flex flex-col gap-2 text-13">
              <p className="font-semibold text-main">{LIST_PAGE.ratingFilter.title}</p>
              <p className="text-sub-weak">{LIST_PAGE.ratingFilter.text}</p>
            </div>
          </aside>

          <section aria-label="상품 목록" className="flex min-w-0 flex-1 flex-col gap-[18px]">
            <div className="flex items-center justify-between gap-3 border-b border-light pb-3.5 lg:px-8">
              <div role="radiogroup" aria-label="정렬" className="scrollbar-none flex min-w-0 gap-1.5 overflow-x-auto">
                {LIST_PAGE.sortOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={sort === option}
                    onClick={() => setSort(option)}
                    className={`${CHIP_CLASS} ${sort === option ? 'bg-main text-white' : 'bg-regular text-sub-weak'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  aria-expanded={filtersOpen}
                  aria-controls="list-filters"
                  onClick={() => setFiltersOpen((open) => !open)}
                  className={`${CHIP_CLASS} border border-regular bg-white text-sub lg:hidden`}
                >
                  필터{checkedFilters.size > 0 && ` ${checkedFilters.size}`}
                </button>
                <div className="flex items-center gap-1.5">
                  <button type="button" aria-label="그리드로 보기" aria-pressed="true" className="flex">
                    <img src={gridViewIcon} alt="" />
                  </button>
                  {/* 리스트형 보기는 시안이 아직 없어 비활성으로 둔다 */}
                  <button type="button" aria-label="리스트로 보기 (준비 중)" disabled className="flex disabled:cursor-default">
                    <img src={viewListIcon} alt="" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-[18px] sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 lg:px-8">
              {LIST_PAGE.products.map((product) => (
                <ProductCard key={product.id} product={product} widthClass="w-full min-w-0" />
              ))}
            </div>

            <nav aria-label="페이지" className="flex justify-center gap-1.5 pt-2.5">
              {Array.from({ length: LIST_PAGE.pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-current={n === page ? 'page' : undefined}
                  onClick={() => setPage(n)}
                  className={`flex size-8 items-center justify-center rounded-thumb-sm text-13 tabular-nums ${n === page ? 'bg-main font-semibold text-white' : 'text-sub-weak'}`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                aria-label="다음 페이지"
                disabled={page === LIST_PAGE.pageCount}
                onClick={() => setPage((p) => p + 1)}
                className="flex size-8 items-center justify-center rounded-thumb-sm text-13 text-sub-weak disabled:cursor-default disabled:text-disabled"
              >
                ›
              </button>
            </nav>
          </section>
        </div>
      </main>
    </div>
  )
}
