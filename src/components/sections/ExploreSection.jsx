import { exploreCategories } from "../../data/navigation";
import Picture from "../ui/Picture";
export default function ExploreSection() {
  return (
    <section
      id="explore"
      className="explore-section"
      aria-labelledby="explore-title"
    >
      <h2 id="explore-title">
        <a href="/shop">EXPLORE ZIPPO</a>
      </h2>
      <div className="explore-list">
        {exploreCategories.map((category) => (
          <a
            key={category.name}
            className="explore-row"
            href={`/shop?category=${category.shopCategory}`}
          >
            <span className="explore-label">{category.label}</span>
            <span className="explore-detail">
              <strong>{category.name}</strong>
              <span>{category.detail}</span>
            </span>
            <span className="explore-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </div>
      <a href="/shop?category=new" className="explore-polaroid" aria-label="신제품 쇼핑하기"><Picture
        name="imgNewProductPolaroid"
        alt="새로운 Zippo 제품을 소개하는 폴라로이드"
      /></a>
    </section>
  );
}
