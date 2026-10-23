import AiChatPage from "./components/AiChatPage";
import CartPage from "./components/CartPage";
import DetailPage from "./components/DetailPage";
import LoginPage from "./components/LoginPage";
import MyPage from "./components/MyPage";
import OrderTrackingPage from "./components/OrderTrackingPage";
import SupportPage from "./components/SupportPage";
import HomePage from "./home/HomePage";
import ListPage from "./pages/ListPage";

interface AccioAppProps {
  /** '#/accio' 뒤의 경로. '/' 는 쇼핑몰 홈 */
  path: string;
  /** 주소의 ?뒤 값 — 목록은 q(검색어)를 읽는다 */
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
  if (path === "/detail") return <DetailPage />;
  if (path === "/ai") return <AiChatPage />;
  if (path === "/cart") return <CartPage />;
  if (path === "/mypage") return <MyPage />;
  if (path === "/order") return <OrderTrackingPage />;
  if (path === "/support") return <SupportPage />;

  return <HomePage />;
}
