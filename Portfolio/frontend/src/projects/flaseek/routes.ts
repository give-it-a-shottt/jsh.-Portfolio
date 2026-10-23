/** FLASEEK 리뉴얼 시안은 포트폴리오 안에서 `#/flaseek/…` 아래에 있다 */
export const FLASEEK_BASE = '/flaseek'

/** 시안 안 주소. flaseekHref() → '#/flaseek', flaseekHref('/list', { cat: 'legwear' }) → '#/flaseek/list?cat=legwear' */
export function flaseekHref(path = '', params: Record<string, string | number | undefined> = {}) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value))
  }
  const query = search.toString()
  return `#${FLASEEK_BASE}${path}${query ? `?${query}` : ''}`
}

export function goTo(href: string) {
  window.location.hash = href.replace(/^#/, '')
}

/** 시안을 소개하는 포트폴리오 사례 */
export const CASE_HREF = '#/case/flaseek-renewal'
