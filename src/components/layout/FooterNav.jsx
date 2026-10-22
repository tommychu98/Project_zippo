import { navigation } from "../../data/navigation";
export default function FooterNav() {
  return (
    <nav className="footer-nav" aria-label="하단 주요 메뉴">
      {navigation.slice(0, 3).map((item) => (
        <a key={item.label} href={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
