import { useEffect, useRef } from 'react';
import { useShop } from './useShop';
import { shopProducts, findProduct, formatPrice, productHref } from '../data/shop/catalog';

export default function CartDrawer() {
  const { cart, count, cartOpen, setCartOpen, setQuantity, addToCart } = useShop();
  const dialog = useRef(null);
  const items = cart.map(item => ({ ...item, product: findProduct(item.id) }));
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const officialProduct = items.find(item => item.product.sourceUrl)?.product;
  const hasConcept = items.some(item => item.product.isConcept);
  const recommendations = shopProducts.filter(p => !cart.some(item => item.id === p.id)).filter((_, index) => index % 3 === 0).slice(0, 3);
  useEffect(() => {
    const element = dialog.current;
    if (cartOpen) {
      element.showModal();
      document.body.style.overflow = 'hidden';
      element.dataset.closing = 'false';
    } else if (element.open) {
      element.dataset.closing = 'true';
      const timer = setTimeout(() => { element.close(); document.body.style.overflow = ''; }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 380);
      return () => clearTimeout(timer);
    }
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen]);
  return (
    <dialog ref={dialog} className="cart-dialog" aria-labelledby="cart-title" onCancel={event => { event.preventDefault(); setCartOpen(false); }} onClick={event => { if (event.target === event.currentTarget) setCartOpen(false); }}>
      <div className="cart-panel">
        <header className="cart-heading"><h2 id="cart-title">Your Cart <span>({count})</span></h2><button onClick={() => setCartOpen(false)} aria-label="장바구니 닫기">×</button></header>
        <div className="cart-items">
          {items.length ? items.map(({ product, quantity }) => (
            <article className="cart-line" key={product.id}>
              <a href={productHref(product)} onClick={() => setCartOpen(false)} className="cart-line-image"><img src={product.defaultImage} alt={product.name} /></a>
              <div className="cart-line-name"><a href={productHref(product)} onClick={() => setCartOpen(false)}>{product.name}</a><span>{product.isConcept ? 'STUDIO EDITION' : `SKU ${product.sku}`}</span></div>
              <div className="quantity-control"><button aria-label={`${product.name} 수량 줄이기`} onClick={() => setQuantity(product.id, quantity - 1)}>−</button><output aria-label="수량">{quantity}</output><button disabled={quantity >= 99} aria-label={`${product.name} 수량 늘리기`} onClick={() => setQuantity(product.id, quantity + 1)}>+</button></div>
              <span className="cart-line-price">{formatPrice(product.price * quantity)}</span>
              <button className="cart-delete" aria-label={`${product.name} 삭제`} onClick={() => setQuantity(product.id, 0)}>DELETE</button>
            </article>
          )) : <div className="cart-empty"><p>A LITTLE<br />ROOM FOR FIRE.</p><span>아직 담긴 제품이 없습니다.</span><a href="/shop" onClick={() => setCartOpen(false)}>FIND YOUR ZIPPO ↗</a></div>}
        </div>
        <div className="cart-recommendations"><h3>You may<br /><u>also like</u></h3><div>{recommendations.map(product => <button className="cart-recommendation" key={product.id} onClick={() => addToCart(product)} aria-label={`${product.name} 추천 제품 담기`}><span><img src={product.defaultImage} alt="" /><b>+</b></span><small>{product.name}</small></button>)}</div></div>
        <footer className="cart-summary"><div><strong>TOTAL</strong><strong>{formatPrice(total)}</strong></div><p>담은 목록은 이 브라우저에 저장됩니다. {hasConcept && '시안 제품의 이름과 가격은 예시입니다. '}실제 주문·결제는 공식몰에서 진행해 주세요.</p><a className="shop-primary-button" href={officialProduct?.sourceUrl || 'https://zippo.co.kr/'} target="_blank" rel="noreferrer">{officialProduct ? '공식몰에서 구매하기' : 'ZIPPO 공식몰 둘러보기'} ↗</a><button className="cart-continue" onClick={() => setCartOpen(false)}>CONTINUE EXPLORING →</button></footer>
      </div>
    </dialog>
  );
}
