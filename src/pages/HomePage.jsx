import { useRef, useState, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from "../components/sections/HeroSection";
import CollectionSection from "../components/sections/CollectionSection";
import BrandStorySection from "../components/sections/BrandStorySection";
import SocialGallerySection from "../components/sections/SocialGallerySection";
import CampaignSection from "../components/sections/CampaignSection";
import ExploreSection from "../components/sections/ExploreSection";
import FooterNav from "../components/layout/FooterNav";
import SiteFooter from "../components/layout/SiteFooter";
import "../styles/motion.css";
export default function HomePage() {
  const page = useRef(null),
    dialog = useRef(null);
  const [notice, setNotice] = useState({ title: "", message: "" });
  const onNotice = (title, message) => {
    setNotice({ title, message });
    dialog.current.showModal();
  };
  useEffect(() => {
    document.title = "ZIPPO — One lighter. A lifetime of stories.";
  }, []);
  useEffect(() => {
    let mounted = true;
    let frame;
    const refresh = () => {
      if (!mounted) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { if (mounted) ScrollTrigger.refresh(); });
    };
    document.fonts.ready.then(refresh);
    document.fonts.addEventListener('loadingdone', refresh);
    const root = page.current;
    root.addEventListener('load', refresh, true);
    window.addEventListener('pageshow', refresh);
    // Router resets scroll on the mount frame; measure after that reset as well.
    refresh();
    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
      root.removeEventListener('load', refresh, true);
      document.fonts.removeEventListener('loadingdone', refresh);
      window.removeEventListener('pageshow', refresh);
    };
  }, []);
  return (
    <div ref={page}>
      <a className="skip-link" href="#collection">
        본문으로 바로가기
      </a>
      <main>
        <HeroSection onNotice={onNotice} />
        <CollectionSection onNotice={onNotice} />
        <BrandStorySection />
        <SocialGallerySection onNotice={onNotice} />
        <CampaignSection />
        <ExploreSection onNotice={onNotice} />
      </main>
      <FooterNav />
      <SiteFooter onNotice={onNotice} />
      <dialog
        ref={dialog}
        className="notice-dialog"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
        aria-labelledby="notice-title"
      >
        <div>
          <button
            className="dialog-close"
            aria-label="닫기"
            onClick={() => dialog.current.close()}
          >
            ×
          </button>
          <h2 id="notice-title">{notice.title}</h2>
          <p>{notice.message}</p>
          <button
            className="dialog-confirm"
            onClick={() => dialog.current.close()}
          >
            확인
          </button>
        </div>
      </dialog>
    </div>
  );
}
