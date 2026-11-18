// 자소서형 랜딩(F-014)은 첫 방문 때만 띄운다 — 같은 탭 세션에서 한 번.
// 저장소를 못 쓰는 환경(사생활 보호 모드 등)이면 매번 보여 준다. 건너뛰기가 늘 있어서 막히지는 않는다.
const LANDING_SEEN_KEY = 'jsh-landing-seen'

export function shouldShowLanding() {
  try {
    return sessionStorage.getItem(LANDING_SEEN_KEY) !== '1'
  } catch {
    return true
  }
}

export function markLandingSeen() {
  try {
    sessionStorage.setItem(LANDING_SEEN_KEY, '1')
  } catch {
    // 기록하지 못하면 다음 방문에 랜딩을 한 번 더 보여 줄 뿐이다
  }
}
