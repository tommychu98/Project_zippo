import Picture from "../ui/Picture";
import NewsletterForm from "../ui/NewsletterForm";
import { useRef } from 'react';
import RevealLines from '../ui/RevealLines';
import useSectionMotion from '../../hooks/useSectionMotion';
import { campaignMotion } from '../../motion/homeMotion';
export default function CampaignSection() {
  const section = useRef(null);
  useSectionMotion(section, campaignMotion);
  return (
    <section ref={section} className="campaign-section" aria-labelledby="campaign-title">
      <div className="campaign-hero">
        <div className="campaign-visual">
          <Picture
            name="imgCampaignHero"
            alt="열대 정원에서 오렌지 셔츠를 입고 Zippo를 든 여성"
          />
          <div className="campaign-copy">
            <h2 id="campaign-title">
              <RevealLines lines={['ALWAYS READY,', 'NEVER ORDINARY']} />
            </h2>
            <a className="text-link" href="/shop">
              DISCOVER THE FLAME →
            </a>
          </div>
        </div>
      </div>
      <div className="campaign-panels">
        <div id="archive" className="archive-panel">
          <Picture
            name="imgArchivePanel"
            alt="테이블에 둘러앉아 함께 시간을 보내는 친구들"
          />
          <a href="#gallery"><span>@ZIPPOARCHIVE</span></a>
        </div>
        <div className="newsletter-panel">
          <h2>
            <RevealLines lines={['STAY', 'CLOSE', 'TOTHE', 'FLAME']} />
          </h2>
          <NewsletterForm variant="campaign-form" />
        </div>
      </div>
    </section>
  );
}
