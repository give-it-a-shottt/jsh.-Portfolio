import CoachScreen from './screens/CoachScreen'
import HomeScreen from './screens/HomeScreen'
import SleepScreen from './screens/SleepScreen'

interface NightlyAppProps {
  /** '#/nightly' 뒤의 경로. '/' 는 홈 */
  path: string
  params: URLSearchParams
}

// Nightly AI 수면 코칭 시안 — 홈 · 수면 대시보드 · AI 코치 (가짜 데이터). 나머지 화면은 다른 곳에서 완성한다.
export default function NightlyApp({ path, params }: NightlyAppProps) {
  if (path === '/sleep') return <SleepScreen />
  // 질문(?q=)이 바뀌면 대화를 새로 시작한다
  if (path === '/coach') return <CoachScreen key={params.get('q') ?? ''} question={params.get('q')} />
  return <HomeScreen />
}
