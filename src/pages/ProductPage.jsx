import { useState, useEffect, useRef } from 'react';
import { useShop } from '../shop/useShop';
import { shopCategories, shopProducts, findProduct, formatPrice } from '../data/shop/catalog';
import ShopCard from '../shop/ShopCard';

export default function ProductPage({ id }) {
  const product = findProduct(id);
  const { addToCart } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(product?.hoverStyle === 'scene' ? product.hoverImage : product?.defaultImage);
  const [detailTab, setDetailTab] = useState('details');
  const zoom = useRef(null);
  function onTabKeyDown(event) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 'details' : event.key === 'End' ? 'care' : detailTab === 'details' ? 'care' : 'details';
    setDetailTab(next);
    document.getElementById(`${next}-tab`)?.focus();
  }
  useEffect(() => { document.title = product ? `${product.name} — ZIPPO` : '제품을 찾을 수 없습니다 — ZIPPO'; }, [product]);
  if (!product) return <main className="shop-not-found"><h1>NOT FOUND.</h1><p>제품을 찾을 수 없습니다.</p><a href="/shop">SHOP으로 돌아가기 →</a></main>;
  const category = shopCategories.find(item => item.id === product.category);
  const images = [product.defaultImage, product.hoverImage, ...product.images.map(item => item.src)].filter((src, index, all) => all.indexOf(src) === index);
  const related = shopProducts.filter(item => item.category === product.category && item.id !== product.id).slice(0, 3);
  return (
    <main className="product-page">
      <div className="product-detail-layout">
        <section className="product-gallery" aria-label="제품 사진">
          <a className="product-back" href={`/shop?category=${product.category}`}>← {category.label}</a>
          <button className={`product-main-image ${image === product.hoverImage && product.hoverStyle === 'scene' ? 'is-scene' : ''}`} onClick={() => zoom.current.showModal()} aria-label="제품 이미지 확대"><img key={image} src={image} alt={product.name} /><span>ZOOM +</span></button>
          <div className="product-thumbnails">{images.map((src, index) => <button key={src} onClick={() => setImage(src)} aria-label={`제품 사진 ${index + 1}`} aria-pressed={src === image}><img src={src} alt="" /></button>)}</div>
        </section>
        <section className="product-purchase" aria-labelledby="product-title"><div className="product-purchase-inner">
          <p className="shop-eyebrow">{category.label} / {product.isConcept ? 'STUDIO EDITION' : `SKU ${product.sku}`}</p><h1 id="product-title">{product.name}</h1><div className="product-detail-price"><span className="shop-price-sticker">{formatPrice(product.price)}</span>{product.promotion && <small>{product.promotion}</small>}</div>
          <div className="product-detail-tabs" role="tablist" aria-label="상품 정보" onKeyDown={onTabKeyDown}><button role="tab" tabIndex={detailTab === 'details' ? 0 : -1} aria-selected={detailTab === 'details'} aria-controls="product-info" id="details-tab" onClick={() => setDetailTab('details')}>THE DETAILS</button><button role="tab" tabIndex={detailTab === 'care' ? 0 : -1} aria-selected={detailTab === 'care'} aria-controls="product-info" id="care-tab" onClick={() => setDetailTab('care')}>CARE & SERVICE</button></div>
          <div id="product-info" className="product-info" role="tabpanel" aria-labelledby={`${detailTab}-tab`}>{detailTab === 'details' ? <><p>{product.description || category.description}</p><dl><div><dt>제품명</dt><dd>{product.sourceName}</dd></div><div><dt>{product.isConcept ? '디자인' : '모델'}</dt><dd>{product.sku}</dd></div><div><dt>컬렉션</dt><dd>{category.label}</dd></div></dl>{product.category === 'custom' && !product.isConcept && <p>각인 문구와 추가 비용은 공식몰에서 선택할 수 있습니다.</p>}</> : <><p>오래 사용할 수 있도록 제품별 연료·관리 방법을 확인해 주세요.</p><p>품질 보증, 수리 접수 및 배송·반품 조건은 ZIPPO Korea 공식몰에서 확인할 수 있습니다.</p>{product.sourceUrl && <a href={product.sourceUrl} target="_blank" rel="noreferrer">공식 제품 정보 보기 ↗</a>}</>}</div>
          <div className="product-order"><span>QUANTITY</span><div className="quantity-control"><button disabled={quantity <= 1} aria-label="구매 수량 줄이기" onClick={() => setQuantity(quantity - 1)}>−</button><output>{quantity}</output><button disabled={quantity >= 99} aria-label="구매 수량 늘리기" onClick={() => setQuantity(quantity + 1)}>+</button></div></div>
          <button className="shop-primary-button product-add" onClick={() => addToCart(product, quantity)}><span>ADD TO CART</span><span>{formatPrice(product.price * quantity)} +</span></button>
          {product.sourceUrl && <a href={product.sourceUrl} target="_blank" rel="noreferrer" className="product-official">ZIPPO KOREA 공식몰에서 구매 ↗</a>}
          <div className="product-assurances"><span>↻<small>REFILL. REUSE.</small></span><span>◇<small>MADE TO LAST</small></span><span>✳<small>YOUR EVERYDAY ICON</small></span></div>
          <p className="product-price-note">{product.isConcept ? '기존 제작 이미지를 활용한 시안 제품으로, 제품명과 가격은 예시입니다.' : <>공식몰 표시 가격 · {product.capturedAt}<br />실제 주문 시 가격·재고·옵션은 공식몰에서 확인해 주세요.{product.generatedHover && <><br />연출 사진은 제품 이미지를 바탕으로 제작한 이미지입니다.</>}</>}</p>
        </div></section>
      </div>
      <section className="product-related"><div><p className="shop-eyebrow">KEEP THE SPARK GOING</p><h2>PAIR IT WITH.</h2><a href={`/shop?category=${product.category}`}>VIEW THE COLLECTION ↗</a></div><div className="product-related-grid">{related.map((p, i) => <ShopCard product={p} key={p.id} index={i} compact />)}</div></section>
      <dialog className="product-zoom" ref={zoom} aria-label="확대 제품 이미지" onClick={event => { if (event.target === event.currentTarget) zoom.current.close(); }}><button aria-label="확대 이미지 닫기" onClick={() => zoom.current.close()}>CLOSE ×</button><img src={image} alt={product.name} /></dialog>
    </main>
  );
}
