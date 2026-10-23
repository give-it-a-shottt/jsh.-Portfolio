import { useEffect, useMemo, useState } from 'react'
import chevronDown16 from '../assets/icon-chevron-down-16.svg'
import filterIcon from '../assets/icon-filter.svg'
import {
  CATEGORIES,
  CATEGORY_TAB,
  PRESSURES,
  PRODUCTS,
  SEASONS,
  SKINS,
  THICKNESSES,
  type Category,
  type Pressure,
  type Product,
  type Season,
  type Skin,
  type Thickness,
} from '../data'
import { flaseekHref, goTo } from '../routes'
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Container, FilterChip, PillTab, ProductGrid } from '../ui'

interface Filters {
  thickness: Thickness | null
  skin: Skin | null
  pressure: Pressure | null
  season: Season | null
}

const NO_FILTERS: Filters = { thickness: null, skin: null, pressure: null, season: null }

/** 고른 값이 있으면 그 값을 가진 상품만 — 레그웨어 전용 값이라 쉐이프웨어는 함께 빠진다 */
function matches(product: Product, filters: Filters) {
  return (
    (!filters.thickness || !!product.thickness?.includes(filters.thickness)) &&
    (!filters.skin || !!product.skin?.includes(filters.skin)) &&
    (!filters.pressure || !!product.pressure?.includes(filters.pressure)) &&
    (!filters.season || !!product.season?.includes(filters.season))
  )
}

type Sort = 'popular' | 'price' | 'discount'
const SORTS: { key: Sort; label: string }[] = [
  { key: 'popular', label: '인기순' },
  { key: 'price', label: '낮은 가격순' },
  { key: 'discount', label: '할인율순' },
]

function sortProducts(products: Product[], sort: Sort) {
  if (sort === 'price') return [...products].sort((a, b) => a.price - b.price)
  if (sort === 'discount') return [...products].sort((a, b) => b.discount - a.discount)
  return products
}

/** 한 번에 보여주는 카드 수 */
const PAGE_SIZE = 8

const CATEGORY_TABS: { key: Category | 'all'; label: string }[] = [
  { key: 'all', label: '전체' },
  ...(Object.keys(CATEGORY_TAB) as Category[]).map((key) => ({ key, label: CATEGORY_TAB[key] })),
]

/** 필터 그룹 하나 — 다시 누르면 선택이 풀린다 */
interface GroupProps<T extends string> {
  label: string
  options: readonly T[]
  value: T | null
  onChange: (value: T | null) => void
  /** 칩 글자. 없으면 값 그대로 */
  format?: (value: T) => string
  /** '전체' 칩을 앞에 둔다 */
  allLabel?: string
}

function ChipGroup<T extends string>({ options, value, onChange, format, allLabel }: Omit<GroupProps<T>, 'label'>) {
  return (
    <>
      {allLabel && <FilterChip label={allLabel} selected={value === null} onClick={() => onChange(null)} />}
      {options.map((option) => (
        <FilterChip
          key={option}
          label={format ? format(option) : option}
          selected={value === option}
          onClick={() => onChange(value === option ? null : option)}
        />
      ))}
    </>
  )
}

const thicknessLabel = (key: Thickness) => {
  const info = THICKNESSES.find((thickness) => thickness.key === key)!
  return `${info.en} ${info.ko}`
}
const thicknessShort = (key: Thickness) => THICKNESSES.find((thickness) => thickness.key === key)!.en
const THICKNESS_KEYS = THICKNESSES.map(({ key }) => key)

interface FilterFieldsProps {
  filters: Filters
  onChange: (next: Filters) => void
}

/** PC — 연한 상자 안에 두께 한 줄, 피부톤·압박·계절 한 줄 */
function FilterBox({ filters, onChange }: FilterFieldsProps) {
  const group = <T extends string>({ label, ...props }: GroupProps<T>) => (
    <div role="group" aria-label={label} className="flex items-center gap-2">
      <span className="w-12 shrink-0 text-14 font-semibold">{label}</span>
      <ChipGroup {...props} />
    </div>
  )
  return (
    <div className="flex flex-col gap-4 rounded-card bg-light px-6 py-5">
      {group({ label: '두께', options: THICKNESS_KEYS, value: filters.thickness, onChange: (thickness) => onChange({ ...filters, thickness }), format: thicknessLabel, allLabel: '전체' })}
      <div className="flex flex-wrap gap-x-10 gap-y-4">
        {group({ label: '피부톤', options: SKINS, value: filters.skin, onChange: (skin) => onChange({ ...filters, skin }) })}
        {group({ label: '압박', options: PRESSURES, value: filters.pressure, onChange: (pressure) => onChange({ ...filters, pressure }) })}
        {group({ label: '계절', options: SEASONS, value: filters.season, onChange: (season) => onChange({ ...filters, season }) })}
      </div>
    </div>
  )
}

interface FilterSheetProps {
  initial: Filters
  /** 필터를 바꿨을 때 남는 상품 수 */
  countFor: (filters: Filters) => number
  onApply: (filters: Filters) => void
  onClose: () => void
}

/** 모바일 — 필터 바텀시트. 고르는 동안 결과 수를 버튼에 바로 보여준다 */
function FilterSheet({ initial, countFor, onApply, onClose }: FilterSheetProps) {
  const [draft, setDraft] = useState(initial)

  // 열린 동안 뒤 화면이 스크롤되지 않게, Esc 로 닫히게
  useEffect(() => {
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const group = <T extends string>({ label, ...props }: GroupProps<T>) => (
    <div role="group" aria-label={label} className="flex flex-col gap-3">
      <p className="text-14 font-semibold">{label}</p>
      <div className="flex flex-wrap gap-2">
        <ChipGroup {...props} />
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button type="button" aria-label="필터 닫기" onClick={onClose} className="absolute inset-0 bg-main/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-title"
        className="absolute inset-x-0 bottom-0 flex max-h-[85svh] flex-col gap-6 overflow-y-auto rounded-t-card bg-white px-5 pt-3 pb-8 shadow-flaseek-4 motion-safe:animate-[accio-sheet-up_300ms_ease-out]"
      >
        <div className="flex justify-center">
          <span className="h-1 w-10 rounded-[2px] bg-regular" />
        </div>
        <div className="flex items-center justify-between">
          <h2 id="filter-title" className="text-18 font-semibold">
            필터
          </h2>
          <button type="button" onClick={() => setDraft(NO_FILTERS)} className="text-14 font-medium text-sub">
            초기화
          </button>
        </div>
        {group({ label: '두께', options: THICKNESS_KEYS, value: draft.thickness, onChange: (thickness) => setDraft({ ...draft, thickness }), format: thicknessLabel, allLabel: '전체' })}
        {group({ label: '피부톤', options: SKINS, value: draft.skin, onChange: (skin) => setDraft({ ...draft, skin }) })}
        {group({ label: '압박', options: PRESSURES, value: draft.pressure, onChange: (pressure) => setDraft({ ...draft, pressure }) })}
        {group({ label: '계절', options: SEASONS, value: draft.season, onChange: (season) => setDraft({ ...draft, season }) })}
        <div className="flex gap-2">
          <button type="button" onClick={() => setDraft(NO_FILTERS)} className={`${BUTTON_SECONDARY} h-14 w-27.5 shrink-0`}>
            초기화
          </button>
          <button type="button" onClick={() => onApply(draft)} className={`${BUTTON_PRIMARY} h-14 flex-1`}>
            상품 {countFor(draft)}개 보기
          </button>
        </div>
      </div>
    </div>
  )
}

function SortSelect({ value, onChange }: { value: Sort; onChange: (sort: Sort) => void }) {
  return (
    <label className="relative flex items-center">
      <span className="sr-only">정렬</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as Sort)}
        className="appearance-none bg-transparent pr-5 text-13 font-medium text-main outline-none lg:text-14"
      >
        {SORTS.map(({ key, label }) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <img src={chevronDown16} alt="" width={16} height={16} className="pointer-events-none absolute right-0" />
    </label>
  )
}

interface ListPageProps {
  params: URLSearchParams
}

// 상품 리스트 — 위에 카테고리 탭과 두께 칩, 아래 카드. 모바일 필터는 바텀시트로.
export default function ListPage({ params }: ListPageProps) {
  const category = (params.get('cat') as Category | null) ?? 'all'
  const query = params.get('q')?.trim() ?? ''
  const initialThickness = THICKNESS_KEYS.find((key) => key === params.get('thick')) ?? null

  const [filters, setFilters] = useState<Filters>({ ...NO_FILTERS, thickness: initialThickness })
  const [sort, setSort] = useState<Sort>('popular')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [sheetOpen, setSheetOpen] = useState(false)

  // 카테고리·검색어로 먼저 거르고, 그 안에서 필터를 바꾼다
  const scoped = useMemo(
    () =>
      PRODUCTS.filter(
        (product) => (category === 'all' || product.categories.includes(category)) && (!query || product.name.includes(query)),
      ),
    [category, query],
  )
  const results = sortProducts(
    scoped.filter((product) => matches(product, filters)),
    sort,
  )
  const countFor = (next: Filters) => scoped.filter((product) => matches(product, next)).length

  const changeFilters = (next: Filters) => {
    setFilters(next)
    setVisible(PAGE_SIZE)
  }

  const info = CATEGORIES.find(({ key }) => key === category) ?? CATEGORIES[0]
  const heading = query ? '검색' : info.en
  const subheading = query ? `‘${query}’ 검색 결과` : category === 'all' ? '플레시크 인기상품' : info.ko

  return (
    <>
      <Container className="flex flex-col gap-4 pt-6 lg:gap-6 lg:pt-8">
        <div className="flex flex-col gap-1">
          <p className="hidden text-12 text-sub-weak lg:block">
            홈 / <span lang="en">{heading}</span>
          </p>
          <h1 className="flex items-baseline gap-2 lg:gap-3">
            <span lang="en" className="text-24 font-semibold tracking-normal lg:text-32">
              {heading}
            </span>
            <span className="text-14 text-sub lg:text-16">{subheading}</span>
          </h1>
        </div>
        <div className="scrollbar-none -mr-5 flex gap-2 overflow-x-auto pr-5 lg:mr-0 lg:pr-0">
          {CATEGORY_TABS.map(({ key, label }) => (
            <PillTab
              key={key}
              label={label}
              selected={!query && category === key}
              onClick={() => goTo(flaseekHref('/list', { cat: key === 'all' ? undefined : key }))}
            />
          ))}
        </div>
      </Container>

      {/* PC 필터 상자 */}
      <Container className="hidden pt-6 lg:block">
        <FilterBox filters={filters} onChange={changeFilters} />
      </Container>

      {/* 모바일 — 필터 버튼 + 두께 칩 가로 스크롤 */}
      <Container className="flex flex-col gap-3 pt-4 lg:hidden">
        <div className="scrollbar-none -mr-5 flex gap-2 overflow-x-auto pr-5">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            className="flex h-9 shrink-0 items-center gap-1 rounded-full border border-black bg-white pr-4 pl-3 text-14 font-medium"
          >
            <img src={filterIcon} alt="" width={16} height={16} />
            필터
          </button>
          <ChipGroup
            options={THICKNESS_KEYS}
            value={filters.thickness}
            onChange={(thickness) => changeFilters({ ...filters, thickness })}
            format={thicknessShort}
            allLabel="전체 두께"
          />
        </div>
      </Container>

      <Container className="flex items-center justify-between pt-3 lg:pt-8">
        <p className="text-13 text-sub lg:text-14" aria-live="polite">
          총 <span className="font-semibold text-main">{results.length}</span>개
        </p>
        <SortSelect value={sort} onChange={setSort} />
      </Container>

      <Container className="pt-4">
        {results.length > 0 ? (
          <ProductGrid products={results.slice(0, visible)} />
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-card bg-light px-5 py-16 text-center">
            <p className="text-16 font-semibold">조건에 맞는 상품이 없어요</p>
            <p className="text-14 text-sub">필터를 줄이거나 다른 카테고리를 골라 보세요.</p>
            <button type="button" onClick={() => changeFilters(NO_FILTERS)} className={`${BUTTON_SECONDARY} h-12`}>
              필터 초기화
            </button>
          </div>
        )}
      </Container>

      <Container className="flex flex-col items-center gap-2 pt-8 pb-12 lg:pt-12 lg:pb-20">
        {visible < results.length && (
          <button
            type="button"
            onClick={() => setVisible((count) => count + PAGE_SIZE)}
            className={`${BUTTON_SECONDARY} h-14 w-full lg:h-12 lg:w-auto`}
          >
            상품 더보기&nbsp;&nbsp;{visible} / {results.length}
          </button>
        )}
        <p className="text-12 text-sub-weak">별점·리뷰 수는 예시 데이터</p>
      </Container>

      {sheetOpen && (
        <FilterSheet
          initial={filters}
          countFor={countFor}
          onApply={(next) => {
            changeFilters(next)
            setSheetOpen(false)
          }}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </>
  )
}
