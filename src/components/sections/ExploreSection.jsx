import { exploreCategories } from "../../data/navigation";
import Picture from "../ui/Picture";
export default function ExploreSection({ onNotice }) {
  return (
    <section
      id="explore"
      className="explore-section"
      aria-labelledby="explore-title"
    >
      <h2 id="explore-title">
        <span>EXPLORE ZIPPO</span>
      </h2>
      <div className="explore-list">
        {exploreCategories.map((category) => (
          <button
            key={category.name}
            className="explore-row"
            onClick={() =>
              onNotice(
                category.name,
                "카테고리별 상품 목록은 준비 중입니다. CLASSIC 컬렉션에서 현재 공개된 제품 이미지를 확인할 수 있습니다.",
              )
            }
          >
            <span className="explore-label">{category.label}</span>
            <span className="explore-detail">
              <strong>{category.name}</strong>
              <span>{category.detail}</span>
            </span>
            <span className="explore-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
        ))}
      </div>
      <Picture
        name="imgNewProductPolaroid"
        alt="새로운 Zippo 제품을 소개하는 폴라로이드"
        className="explore-polaroid"
      />
    </section>
  );
}
