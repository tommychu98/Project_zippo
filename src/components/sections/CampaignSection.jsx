import Picture from "../ui/Picture";
import NewsletterForm from "../ui/NewsletterForm";
export default function CampaignSection() {
  return (
    <section className="campaign-section" aria-labelledby="campaign-title">
      <div className="campaign-hero">
        <Picture
          name="imgCampaignHero"
          alt="열대 정원에서 오렌지 셔츠를 입고 Zippo를 든 여성"
        />
        <div className="campaign-copy">
          <h2 id="campaign-title">
            ALWAYS READY,
            <br />
            NEVER ORDINARY
          </h2>
          <a className="text-link" href="/shop">
            DISCOVER THE FLAME →
          </a>
        </div>
      </div>
      <div className="campaign-panels">
        <div id="archive" className="archive-panel">
          <Picture
            name="imgArchivePanel"
            alt="테이블에 둘러앉아 함께 시간을 보내는 친구들"
          />
          <a href="#gallery">@ZIPPOARCHIVE</a>
        </div>
        <div className="newsletter-panel">
          <h2>
            STAY
            <br />
            CLOSE
            <br />
            TOTHE
            <br />
            FLAME
          </h2>
          <NewsletterForm variant="campaign-form" />
        </div>
      </div>
    </section>
  );
}
