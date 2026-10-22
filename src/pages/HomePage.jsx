import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import HeroSection from "../components/sections/HeroSection";
import CollectionSection from "../components/sections/CollectionSection";
import BrandStorySection from "../components/sections/BrandStorySection";
import SocialGallerySection from "../components/sections/SocialGallerySection";
import CampaignSection from "../components/sections/CampaignSection";
import ExploreSection from "../components/sections/ExploreSection";
import FooterNav from "../components/layout/FooterNav";
import SiteFooter from "../components/layout/SiteFooter";
gsap.registerPlugin(ScrollTrigger, useGSAP);
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
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils
          .toArray(
            ".story-heading, .gallery-section > h2, .explore-section > h2",
          )
          .forEach((element) =>
            gsap.from(element, {
              y: 24,
              opacity: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: { trigger: element, start: "top 95%", once: true },
            }),
          );
      });
      return () => media.revert();
    },
    { scope: page },
  );
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
