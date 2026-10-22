import SiteHeader from "../layout/SiteHeader";
import Picture from "../ui/Picture";
import Wordmark from "../ui/Wordmark";
import { useRef } from 'react';
import RevealLines from '../ui/RevealLines';
import useSectionMotion from '../../hooks/useSectionMotion';
import { heroMotion } from '../../motion/homeMotion';
export default function HeroSection({ onNotice }) {
  const section = useRef(null);
  useSectionMotion(section, heroMotion);
  return (
    <section
      id="home"
      ref={section}
      className="hero-section"
      aria-label="Zippo — A lifetime of stories"
    >
      <Picture
        name="img01Hero"
        alt="햇살 아래 Zippo 라이터를 들고 함께 웃는 친구들"
        className="hero-background"
        eager
      />
      <SiteHeader onNotice={onNotice} />
      <h1 className="hero-brand">
        <Wordmark />
        <span className="brand-flame">
          <img src="/images/imgBrandFlameMark.png" alt="" />
        </span>
      </h1>
      <div className="hero-copy">
        <p><RevealLines lines={['ONE LIGHTER.']} /></p>
        <p><RevealLines lines={['A LIFETIME OF STORIES.']} /></p>
        <a className="text-link" href="#story">
          DISCOVER THE ARCHIVE →
        </a>
      </div>
      <a className="scroll-cue" href="#collection">
        SCROLL TO IGNITE ↓
      </a>
    </section>
  );
}
