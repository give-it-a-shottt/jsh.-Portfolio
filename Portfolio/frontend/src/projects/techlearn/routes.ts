/** techlearn 은 포트폴리오 안에서 `#/techlearn/…` 아래에 있다 */
export const TECHLEARN_BASE = '/techlearn'

/** techlearn 안 주소. techlearnHref() → '#/techlearn', techlearnHref('/courses', { cat: 'ai' }) → '#/techlearn/courses?cat=ai' */
export function techlearnHref(path = '', params: Record<string, string | number | undefined> = {}) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value))
  }
  const query = search.toString()
  return `#${TECHLEARN_BASE}${path}${query ? `?${query}` : ''}`
}

export function goTo(href: string) {
  window.location.hash = href.replace(/^#/, '')
}
