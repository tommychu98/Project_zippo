import { useShop } from './useShop';
import { formatPrice, productHref } from '../data/shop/catalog';

export default function ShopCard({ product, index = 0, compact = false }) {
  const { addToCart } = useShop();
  return (
    <article className={`shop-card ${compact ? 'shop-card-compact' : ''} ${product.imageStyle === 'editorial' ? 'shop-card-editorial' : ''}`} style={{ '--card-index': index }}>
      <a className="shop-card-link" href={productHref(product)} aria-label={`${product.name} 상세 보기`}>
        <div className="shop-card-art">
          <img className="shop-card-default" src={product.defaultImage} alt={product.name} loading={index < 3 ? 'eager' : 'lazy'} width="640" height="640" />
          <img className={`shop-card-alternate ${product.hoverStyle === 'scene' ? 'is-scene' : ''}`} src={product.hoverImage} alt="" loading="lazy" width="640" height="640" />
          <span className="shop-view-label" aria-hidden="true">TAKE A<br />CLOSER LOOK ↗</span>
        </div>
        <div className="shop-card-caption"><span>{product.displayName || product.name}</span><span className="shop-price-sticker">{formatPrice(product.price)}</span></div>
      </a>
      <button className="shop-quick-add" onClick={() => addToCart(product)} aria-label={`${product.name} 장바구니 담기`}><span>ADD TO CART</span> +</button>
    </article>
  );
}
