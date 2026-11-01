import { useEffect } from 'react'
import { wakeServer } from './api'
import { ServerWakeNotice } from './components'
import { useIsDesktop } from './hooks'
import { readQuery } from './routes'
import HomeScreen from './screens/HomeScreen'
import PlaceDetailBody from './screens/PlaceDetailBody'
import ResultScreen from './screens/ResultScreen'
import { useMaestro } from './store'

interface MaestroAppProps {
  /** '#/maestro' 뒤의 경로. '/' 는 홈 */
  path: string
  params: URLSearchParams
}

// 마에스트로 리뉴얼 — 홈(동네 · 상황) → 결과(지도 + 후보 3곳) → 식당 상세 → 자리 물어보기.
// 조건은 주소(?t=&dong=&s=)에, 결과 · 선택 같은 화면 사이 상태는 Zustand(store.ts)에 둔다.
export default function MaestroApp({ path, params }: MaestroAppProps) {
  const lastDong = useMaestro((state) => state.lastDong)
  const isDesktop = useIsDesktop()
  // 무료 서버는 쉬다가 깨는 데 1분쯤 걸려서, 들어오자마자 미리 깨워 둔다
  useEffect(() => {
    wakeServer()
  }, [])
  const query = readQuery(params, lastDong)

  let screen
  if (path === '/picks') screen = <ResultScreen query={query} />
  else if (path.startsWith('/place/')) {
    const id = decodeURIComponent(path.slice('/place/'.length))
    // PC 는 결과 지도 위 오른쪽 패널로, MO 는 한 화면으로 연다
    screen = isDesktop ? <ResultScreen query={query} placeId={id} /> : <PlaceDetailBody id={id} query={query} layout="page" />
  } else screen = <HomeScreen params={params} />

  return (
    <>
      <ServerWakeNotice />
      {screen}
    </>
  )
}
