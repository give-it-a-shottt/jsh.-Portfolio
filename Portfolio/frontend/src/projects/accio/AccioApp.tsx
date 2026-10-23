import AiChatPage from "./components/AiChatPage";
import LoginPage from "./components/LoginPage";
import MyPage from "./components/MyPage";
import OrderTrackingPage from "./components/OrderTrackingPage";
import SupportPage from "./components/SupportPage";
import HomePage from "./home/HomePage";
import CartPage from "./pages/CartPage";
import DetailPage from "./pages/DetailPage";
import ListPage from "./pages/ListPage";
import { OrderCompletePage, OrderFailPage } from "./pages/OrderResultPage";

interface AccioAppProps {
  /** '#/accio' 뒤의 경로. '/' 는 쇼핑몰 홈 */
  path: string;
  /** 주소의 ?뒤 값 — 목록은 q(검색어), 상세는 id(상품)를 읽는다 */
  params: URLSearchParams;
}

// Accio 쇼핑몰 — 포트폴리오 안에서 '#/accio/…' 로 연다. 모르는 경로는 쇼핑몰 홈으로 보낸다.
export default function AccioApp({ path, params }: AccioAppProps) {
  if (path === "/login") return <LoginPage />;
  if (path === "/list") {
    const query = params.get("q") ?? "";
    // 검색어가 바뀌면 필터·페이지를 새로 시작하도록 key 로 다시 만든다
    return <ListPage key={query} query={query} />;
  }
  if (path === "/detail") {
    const id = params.get("id") ?? undefined;
    return <DetailPage key={id} productId={id} />;
  }
  if (path === "/ai") return <AiChatPage />;
  if (path === "/cart") return <CartPage />;
  if (path === "/mypage") return <MyPage />;
  if (path === "/order/complete") return <OrderCompletePage orderNo={params.get("no") ?? undefined} />;
  if (path === "/order/fail") return <OrderFailPage code={params.get("code") ?? undefined} />;
  if (path === "/order") return <OrderTrackingPage />;
  if (path === "/support") return <SupportPage />;

  return <HomePage />;
}
