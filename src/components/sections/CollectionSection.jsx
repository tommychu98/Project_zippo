import { useRef, useState } from "react";
import { products } from "../../data/products";
import ProductCard from "../ui/ProductCard";
export default function CollectionSection({ onNotice }) {
  const [tab, setTab] = useState("CLASSIC");
  const list = useRef(null);
  function move(direction) {
    const width =
      list.current.querySelector(".product-card")?.getBoundingClientRect()
        .width || 300;
    list.current.scrollBy({
      left:
        direction * (width + parseFloat(getComputedStyle(list.current).gap)),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <section
      id="collection"
      className="collection-section"
      aria-labelledby="collection-title"
    >
      <h2 id="collection-title">
        DISCOVER
        <br />
        THE COLLECTION
      </h2>
      <div className="collection-tabs" role="tablist" aria-label="컬렉션">
        {["CLASSIC", "EMBLEM", "LIMITED"].map((name) => (
          <button
            key={name}
            id={`tab-${name}`}
            role="tab"
            tabIndex={tab === name ? 0 : -1}
            aria-selected={tab === name}
            aria-controls="collection-panel"
            onClick={() => setTab(name)}
            onKeyDown={(event) => {
              if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
                event.preventDefault();
                const buttons = [...event.currentTarget.parentElement.children];
                const next =
                  buttons[
                    (buttons.indexOf(event.currentTarget) +
                      (event.key === "ArrowRight" ? 1 : 2)) %
                      3
                  ];
                next.click();
                next.focus();
              }
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <div id="collection-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === "CLASSIC" ? (
          <>
            <div
              ref={list}
              className="product-carousel"
              tabIndex="0"
              aria-label="제품 목록. 좌우 방향키로 탐색"
              onKeyDown={(event) => {
                if (
                  ["ArrowLeft", "ArrowRight"].includes(event.key) &&
                  event.target === event.currentTarget
                ) {
                  event.preventDefault();
                  move(event.key === "ArrowLeft" ? -1 : 1);
                }
              }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(item) =>
                    onNotice(
                      item.alt,
                      "제품명과 상세 정보는 준비 중입니다. 시안의 TEXT는 임시 문구이며, 판매 가격은 아직 제공되지 않았습니다.",
                    )
                  }
                />
              ))}
            </div>
            <div className="carousel-controls">
              <button onClick={() => move(-1)} aria-label="이전 제품">
                ←
              </button>
              <button onClick={() => move(1)} aria-label="다음 제품">
                →
              </button>
            </div>
          </>
        ) : (
          <div className="collection-empty">
            <p>{tab}</p>
            <span>해당 컬렉션은 준비 중입니다.</span>
            <button className="text-link" onClick={() => setTab("CLASSIC")}>
              CLASSIC 둘러보기 →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
