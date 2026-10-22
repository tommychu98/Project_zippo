import { footerColumns } from "../../data/navigation";
import NewsletterForm from "../ui/NewsletterForm";
import Wordmark from "../ui/Wordmark";
import { useRef } from 'react';
import useSectionMotion from '../../hooks/useSectionMotion';
import { footerMotion } from '../../motion/homeMotion';
export default function SiteFooter({ onNotice }) {
  const section = useRef(null);
  useSectionMotion(section, footerMotion);
  return (
    <footer ref={section} id="footer" className="site-footer">
      <div className="footer-top">
        <div className="footer-newsletter">
          <h2>
            NEW DROPS & ZIPPO STORIES
            <br />
            STRAIGHT TO YOUR INBOX
          </h2>
          <NewsletterForm />
          <p className="newsletter-note">
            NEW RELEASES. LIMITED EDITIONS. FIRST LOOKS.
          </p>
        </div>
        <div className="footer-columns">
          {footerColumns.map((column) => (
            <div className="footer-column" key={column.title} id={column.id}>
              <h3>{column.title}</h3>
              {column.links.map((label) => (
                <button
                  key={label}
                  onClick={() =>
                    onNotice(
                      label,
                      "해당 페이지는 준비 중입니다. 현재는 ZIPPO 홈 디자인 구현 화면입니다.",
                    )
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <a href="#home" aria-label="맨 위로" className="footer-brand">
        <Wordmark />
        <span>IT WORKS OR WE FIX IT FREE™</span>
      </a>
      <div className="footer-bottom">
        <div className="legal-links">
          {[
            "PRIVACY POLICY",
            "TERMS & CONDITIONS",
            "COOKIE POLICY",
            "ACCESSIBILITY",
          ].map((label) => (
            <button
              key={label}
              onClick={() =>
                onNotice(label, "정책 페이지는 연결 준비 중입니다.")
              }
            >
              {label}
            </button>
          ))}
        </div>
        <p>© 2026 ZIPPO MANUFACTURING COMPANY. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
