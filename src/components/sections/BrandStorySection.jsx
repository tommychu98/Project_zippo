import { useRef } from 'react';
import MotionPicture from '../ui/MotionPicture';
import RevealLines from '../ui/RevealLines';
import useSectionMotion from '../../hooks/useSectionMotion';
import { storyMotion } from '../../motion/homeMotion';

function StoryTicker({ className, children }) {
  return (
    <div className={`story-ticker ${className}`} aria-hidden="true">
      <div className="story-ticker-track">
        {[0, 1].map(group => (
          <div className="story-ticker-group" key={group}>
            <span>{children}</span>
            <span>{children}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BrandStorySection() {
  const section = useRef(null);
  useSectionMotion(section, storyMotion);
  return (
    <section ref={section} id="story" className="story-section" aria-labelledby="story-title">
      <div className="story-heading">
        <h2 id="story-title"><RevealLines lines={['ZIPPO STORY']} /></h2>
        <p>SINCE 1932</p>
      </div>
      <StoryTicker className="ticker-back">
        THE POCKET ARCHIVE
      </StoryTicker>
      <StoryTicker className="ticker-front">
        KEEP THE FLAME ALIVE
      </StoryTicker>
      <MotionPicture
        name="imgStoryImage"
        alt="골드 Zippo를 든 여성의 햇살 가득한 초상"
        className="story-image"
      />
      <div className="story-panel">
        <div className="story-content">
          <h3>
            <RevealLines lines={['BUILT TO LAST.', 'MADE TO', 'REMEMBER.', 'EVERY CLICK,', 'EVERY SCRATCH,', 'EVERY FLAME', 'BECOMES', 'PART', 'OF YOUR', 'STORY.']} />
          </h3>
          <p>
            1932년부터 Zippo는 단순한 라이터가 아닌,
            <br className="desktop-break" /> 사용자의 시간을 기록하는 물건을
            만들어왔습니다.
            <br className="desktop-break" /> 익숙한 클릭 소리와 표면에 남은
            흔적,
            <br className="desktop-break" /> 그리고 함께한 순간들이 모여
            <br className="desktop-break" /> 하나의 Zippo를 당신만의 이야기가
            되게 합니다.
          </p>
          <a className="text-link" href="#archive">
            EXPLORE THE ARCHIVE →
          </a>
        </div>
      </div>
    </section>
  );
}
