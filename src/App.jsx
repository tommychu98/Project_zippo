import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import ShopProvider from "./shop/ShopContext";
import { useShop } from "./shop/useShop";
import SiteHeader from "./components/layout/SiteHeader";
import FooterNav from "./components/layout/FooterNav";
import SiteFooter from "./components/layout/SiteFooter";

import "./styles/desktop.css";
import "./styles/responsive.css";
import "./styles/shop.css";
function Routes() {
  const { route, onNotice } = useShop();
  if (!route.startsWith('/shop')) return <HomePage />;
  const productId = route.split('?')[0].match(/^\/shop\/product\/([^/]+)\/?$/)?.[1];
  return <div className="shop-shell" id="home">
    <a className="skip-link" href="#shop-content">본문으로 바로가기</a>
    <SiteHeader onNotice={onNotice} />
    <div id="shop-content">{productId ? <ProductPage key={productId} id={productId} /> : <ShopPage />}</div>
    <FooterNav /><SiteFooter onNotice={onNotice} />
  </div>;
}
export default function App() {
  return <ShopProvider><Routes /></ShopProvider>;
}
