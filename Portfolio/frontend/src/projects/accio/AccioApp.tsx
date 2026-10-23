import AiChatPage from "./components/AiChatPage";
import CartPage from "./components/CartPage";
import DetailPage from "./components/DetailPage";
import ListPage from "./components/ListPage";
import LoginPage from "./components/LoginPage";
import MyPage from "./components/MyPage";
import OrderTrackingPage from "./components/OrderTrackingPage";
import SupportPage from "./components/SupportPage";
import HomePage from "./home/HomePage";

interface AccioAppProps {
  /** '#/accio' 뒤의 경로. '/' 는 쇼핑몰 홈 */
  path: string;
}

// Accio 쇼핑몰 — 포트폴리오 안에서 '#/accio/…' 로 연다. 모르는 경로는 쇼핑몰 홈으로 보낸다.
export default function AccioApp({ path }: AccioAppProps) {
  if (path === "/login") return <LoginPage />;
  if (path === "/list") return <ListPage />;
  if (path === "/detail") return <DetailPage />;
  if (path === "/ai") return <AiChatPage />;
  if (path === "/cart") return <CartPage />;
  if (path === "/mypage") return <MyPage />;
  if (path === "/order") return <OrderTrackingPage />;
  if (path === "/support") return <SupportPage />;

  return <HomePage />;
}
