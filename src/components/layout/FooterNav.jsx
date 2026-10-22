import { navigation } from "../../data/navigation";
import { useRef } from 'react';
import useSectionMotion from '../../hooks/useSectionMotion';
import { footerNavMotion } from '../../motion/homeMotion';
export default function FooterNav() {
  const section = useRef(null);
  useSectionMotion(section, footerNavMotion);
  return (
    <nav ref={section} className="footer-nav" aria-label="하단 주요 메뉴">
      {navigation.slice(0, 3).map((item) => (
        <a key={item.label} href={item.href}>
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
