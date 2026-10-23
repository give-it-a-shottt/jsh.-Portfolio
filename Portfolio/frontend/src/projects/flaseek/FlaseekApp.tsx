import Shell, { type ActiveMenu } from './layout'
import { findProduct, type Category } from './data'
import DetailPage from './pages/DetailPage'
import ListPage from './pages/ListPage'
import LoginPage from './pages/LoginPage'
import MainPage from './pages/MainPage'

interface FlaseekAppProps {
  /** '#/flaseek' 뒤의 경로. '/' 는 메인 */
  path: string
  params: URLSearchParams
}

// FLASEEK 자사몰 리뉴얼 시안 — 메인 → 상품 리스트 → 상품 상세, 로그인. 피그마 PC 1440 · MO 390 시안을 반응형 한 벌로.
export default function FlaseekApp({ path, params }: FlaseekAppProps) {
  // 주소의 조건이 바뀌면 화면 상태(필터·선택)를 새로 시작한다
  const key = params.toString()

  if (path === '/list') {
    const active: ActiveMenu = params.get('q') ? null : ((params.get('cat') as Category | null) ?? 'all')
    return (
      <Shell active={active}>
        <ListPage key={key} params={params} />
      </Shell>
    )
  }
  if (path === '/detail') {
    const product = findProduct(Number(params.get('id')))
    return (
      <Shell active={product?.categories[0] ?? 'legwear'} mobileBottomBar>
        <DetailPage key={key} params={params} />
      </Shell>
    )
  }
  if (path === '/login')
    return (
      <Shell active={null}>
        <LoginPage />
      </Shell>
    )
  return (
    <Shell active={null}>
      <MainPage />
    </Shell>
  )
}
