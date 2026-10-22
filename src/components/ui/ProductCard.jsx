import Picture from "./Picture";
export default function ProductCard({ product, onSelect }) {
  return (
    <button
      className={`product-card product-${product.id} ${product.collection ? 'product-card-catalog' : ''}`}
      onClick={() => onSelect(product)}
      aria-label={`${product.name} ${product.price.toLocaleString('ko-KR')}원 보기`}
    >
      <Picture
        name={product.defaultImage}
        src={product.defaultImage.startsWith('/') ? product.defaultImage : undefined}
        alt={product.alt || product.name}
        className="product-default"
      />
      <Picture name={product.hoverImage} src={product.hoverImage.startsWith('/') ? product.hoverImage : undefined} className="product-hover" />
      <span className="product-name">{product.displayName || product.name}</span>
      <span className="product-badge">₩{product.price.toLocaleString('ko-KR')}</span>
    </button>
  );
}
