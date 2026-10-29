/** Nightly 는 포트폴리오 안에서 `#/nightly/…` 아래에 있다 */
export const NIGHTLY_BASE = '/nightly'

/** Nightly 안 주소. nightlyHref() → '#/nightly', nightlyHref('/coach', { q: '…' }) → '#/nightly/coach?q=…' */
export function nightlyHref(path = '', params: Record<string, string | undefined> = {}) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, value)
  }
  const query = search.toString()
  return `#${NIGHTLY_BASE}${path}${query ? `?${query}` : ''}`
}
