import { useEffect, useState } from "react";
import { navigation } from "../../data/navigation";
import HeaderIcon from "../ui/HeaderIcon";
import { useShop } from "../../shop/useShop";
export default function SiteHeader({ onNotice }) {
  const { count, setCartOpen, route } = useShop();
  const [openRoute, setOpenRoute] = useState(null);
  const open = openRoute === route;
  const setOpen = value => setOpenRoute(value ? route : null);
  useEffect(() => {
    if (!open) return;
    function close(e) {
      if (e.key === "Escape") setOpenRoute(null);
    }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <div className="header-icons" role="group" aria-label="소셜 미디어">
        <button type="button" className="header-icon" aria-label="인스타그램" onClick={() => onNotice("INSTAGRAM", "인스타그램 계정 링크는 준비 중입니다.")}>
          <HeaderIcon name="instagram" />
        </button>
        <button type="button" className="header-icon" aria-label="트위터" onClick={() => onNotice("TWITTER", "트위터 계정 링크는 준비 중입니다.")}>
          <HeaderIcon name="twitter" />
        </button>
      </div>
      <nav className="desktop-nav" aria-label="주 메뉴">
        {navigation.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-utility">
        <span>KOR</span>
        <button
          onClick={() => setCartOpen(true)}
          className="header-cart-button"
        >
          CART <span className="header-cart-count" key={count}>{count}</span>
        </button>
        <div className="header-icons" role="group" aria-label="쇼핑 메뉴">
          <button type="button" className="header-icon" aria-label="장바구니" onClick={() => setCartOpen(true)}>
            <HeaderIcon name="cart" />
          </button>
          <button type="button" className="header-icon" aria-label="마이페이지" onClick={() => onNotice("MY PAGE", "마이페이지 서비스는 준비 중입니다.")}>
            <HeaderIcon name="account" />
          </button>
        </div>
      </div>
      <button
        className="mobile-menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
      >
        {open ? "CLOSE −" : "MENU +"}
      </button>
      {open && (
        <nav id="mobile-menu" className="mobile-nav" aria-label="모바일 메뉴">
          {navigation.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
              <span>↗</span>
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
