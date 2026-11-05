export type ResultTab = 'all' | 'design' | 'fullstack' | 'study'

const TABS: ResultTab[] = ['all', 'design', 'fullstack', 'study']

/** 예전 탭 주소(Front · Back 따로) — 공유된 옛 링크가 Fullstack 탭으로 열리게 한다(F-011) */
const LEGACY_TABS: Record<string, ResultTab> = { front: 'fullstack', back: 'fullstack' }

/** `#/search?q=…&tab=…` 주소. 빈 검색어와 '전체' 탭은 주소에서 뺀다 */
export function searchHref(query = '', tab: ResultTab = 'all') {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (tab !== 'all') params.set('tab', tab)
  const search = params.toString()
  return `#/search${search ? `?${search}` : ''}`
}

/** 사례 상세 `#/case/{slug}` 주소 */
export function caseHref(slug: string) {
  return `#/case/${slug}`
}

/** 프로젝트 페이지 `#/project/{slug}` 주소(F-011) */
export function projectHref(slug: string) {
  return `#/project/${slug}`
}

export function readTab(value: string | null): ResultTab {
  // in 대신 hasOwn — '?tab=constructor' 같은 프로토타입 키가 탭 값으로 새지 않게 한다
  if (value && Object.hasOwn(LEGACY_TABS, value)) return LEGACY_TABS[value]
  return TABS.includes(value as ResultTab) ? (value as ResultTab) : 'all'
}

export function goTo(href: string) {
  window.location.hash = href.replace(/^#/, '')
}

/** 새 탭으로 여는 주소인지 — 바깥 사이트와 정적 빌드(/accio-v1/)는 새 탭, 사이트 안 해시 주소는 그대로 */
export function isExternal(href: string) {
  return !href.startsWith('#')
}
