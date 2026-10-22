import { useEffect, useState } from "react";
import { navigation } from "../../data/navigation";
export default function SiteHeader({ onNotice }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    function close(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <a className="header-icons" href="#home" aria-label="ZIPPO 홈">
        <img
          src="/images/imgLeftIconGroup.svg"
          width="110"
          height="50"
          alt=""
        />
      </a>
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
          onClick={() => onNotice("CART", "장바구니 서비스는 준비 중입니다.")}
        >
          CART
        </button>
        <a className="header-icons" href="#explore" aria-label="Zippo 탐색">
          <img
            src="/images/imgRightIconGroup.svg"
            width="110"
            height="50"
            alt=""
          />
        </a>
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
