import Picture from "../ui/Picture";
export default function SocialGallerySection({ onNotice }) {
  return (
    <section
      id="gallery"
      className="gallery-section"
      aria-labelledby="gallery-title"
    >
      <h2 id="gallery-title">SPOTTED WITH ZIPPO</h2>
      <p className="hashtag-badge">#CARRYTHEFLAME</p>
      <div className="gallery-grid">
        <Picture
          name="imgGalleryImageLarge"
          alt="민트 Zippo와 함께한 햇살 아래의 순간"
          className="gallery-large"
        />
        <div className="gallery-stack">
          <Picture
            name="imgGalleryImageTop"
            alt="초록 셔츠와 레드 Zippo를 매치한 남성"
          />
          <Picture
            name="imgGalleryImageBottom"
            alt="보라색 의상과 블랙 Zippo를 매치한 여성"
          />
        </div>
      </div>
      <button
        className="sticker-link gallery-view-all"
        onClick={() =>
          onNotice(
            "SPOTTED WITH ZIPPO",
            "현재 공개된 사진은 위 세 장입니다. 전체 갤러리 페이지는 준비 중입니다.",
          )
        }
      >
        VIEW ALL
      </button>
    </section>
  );
}
