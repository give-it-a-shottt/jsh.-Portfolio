// 메인 프로젝트 섹션(F-018)의 움직임 계산 - 화면(ProjectShowcase)과 검사(checks/run.mjs)가 같은 함수를 쓴다.
// 위치 x 는 '프로젝트 번호' 단위다. 0 이면 첫 프로젝트가 다 보이고, 0.5 면 첫째에서 둘째로 반쯤 넘어간 상태.

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

/** 천천히 시작해 천천히 끝나는 곡선. 0 ~ 1 밖의 값은 잘라 쓴다 */
export function easeInOut(v: number) {
  const t = clamp01(v)
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}

/** 앞뒤로 멈춰 있는 구간(다 보이는 시간)과 그 사이 넘어가는 구간 */
const HOLD = 0.15
/** 글 하나가 옅어지거나 진해지는 데 쓰는 구간 */
const FADE = 0.35
/** 다음 글이 진해지기 시작하는 지점 - 앞 글이 다 옅어지기(0.5) 조금 전이라 빈 순간이 생기지 않는다 */
const NEXT_START = 0.42

/** 화면 띠의 위치 - 앞뒤 15%는 멈춰 있고 가운데 70%에서 다음 화면으로 넘어간다 */
export function stripPosition(x: number) {
  const k = Math.floor(x)
  return k + easeInOut((x - k - HOLD) / (1 - HOLD * 2))
}

/** 글의 진하기. d = x - 프로젝트 번호. 0 이면 다 보이고, 지나가면(d > 0) 옅어지고, 아직이면(d < 0) 진해지는 중이다 */
export function textOpacity(d: number) {
  if (d >= 0) return 1 - easeInOut((d - HOLD) / FADE)
  return easeInOut((d + 1 - NEXT_START) / FADE)
}

/** 글이 위아래로 움직이는 px - 떠날 때 위로 24, 들어올 때 아래 24 에서 올라온다 */
export function textOffset(d: number) {
  return (d >= 0 ? -24 : 24) * (1 - textOpacity(d))
}

/** 지금 프로젝트 번호 - 반을 넘으면 다음. 스프링이 살짝 넘쳐도 범위 밖으로 나가지 않는다 */
export function activeIndex(x: number, count: number) {
  return Math.max(0, Math.min(count - 1, Math.round(x)))
}
