import { useRef, useState } from "react";
import { collections } from "../../data/collections";
import ProductCard from "../ui/ProductCard";
import { useShop } from "../../shop/useShop";
import RevealLines from '../ui/RevealLines';
import useSectionMotion from '../../hooks/useSectionMotion';
import { collectionMotion, productsMotion } from '../../motion/homeMotion';
export default function CollectionSection() {
  const { navigate } = useShop();
  const [tab, setTab] = useState("CLASSIC");
  const collection = collections.find(collection => collection.id === tab);
  const list = useRef(null);
  const section = useRef(null);
  useSectionMotion(section, collectionMotion);
  useSectionMotion(list, productsMotion, [tab]);
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
      ref={section}
      className="collection-section"
      aria-labelledby="collection-title"
    >
      <h2 id="collection-title">
        <RevealLines lines={['DISCOVER', 'THE COLLECTION']} />
      </h2>
      <div className="collection-tabs" role="tablist" aria-label="컬렉션">
        {collections.map(({ id: name }) => (
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
            <div
              key={tab}
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
              {collection.products.map((product) => (
                <div className="product-reveal" key={product.id}>
                  <ProductCard
                    product={product}
                    onSelect={() => navigate(`/shop?category=${collection.category}`)}
                  />
                </div>
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
      </div>
    </section>
  );
}
