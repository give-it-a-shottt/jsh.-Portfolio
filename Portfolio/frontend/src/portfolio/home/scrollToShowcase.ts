/** 메인 프로젝트 섹션이 다 보이는 자리의 id */
export const showcaseAnchor = (slug: string) => `showcase-${slug}`

/** 그 프로젝트가 다 보이는 위치로 - 첫 화면 목차와 현재 위치 점이 함께 쓴다. 해시 라우팅이라 주소는 바꾸지 않는다 */
export function scrollToShowcase(slug: string, behavior: ScrollBehavior = 'smooth') {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(showcaseAnchor(slug))?.scrollIntoView({ behavior: reduce ? 'auto' : behavior, block: 'start' })
}
