import Picture from "../ui/Picture";
export default function BrandStorySection() {
  return (
    <section id="story" className="story-section" aria-labelledby="story-title">
      <div className="story-heading">
        <h2 id="story-title">ZIPPO STORY</h2>
        <p>SINCE 1932</p>
      </div>
      <div className="story-ticker ticker-back" aria-hidden="true">
        THE POCKET ARCHIVE
      </div>
      <div className="story-ticker ticker-front" aria-hidden="true">
        KEEP THE FLAME ALIVE
      </div>
      <Picture
        name="imgStoryImage"
        alt="골드 Zippo를 든 여성의 햇살 가득한 초상"
        className="story-image"
      />
      <div className="story-panel">
        <div className="story-content">
          <h3>
            BUILT TO LAST.
            <br />
            MADE TO
            <br />
            REMEMBER.
            <br />
            EVERY CLICK,
            <br />
            EVERY SCRATCH,
            <br />
            EVERY FLAME
            <br />
            BECOMES
            <br />
            PART
            <br />
            OF YOUR
            <br />
            STORY.
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
