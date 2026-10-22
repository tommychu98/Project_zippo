import Picture from "./Picture";
export default function ProductCard({ product, onSelect }) {
  return (
    <button
      className={`product-card product-${product.id}`}
      onClick={() => onSelect(product)}
      aria-label={`${product.alt} 정보 보기`}
    >
      <Picture
        name={product.defaultImage}
        alt={product.alt}
        className="product-default"
      />
      <Picture name={product.hoverImage} className="product-hover" />
      <span className="product-name">{product.name}</span>
      <span className="product-badge" aria-hidden="true" />
    </button>
  );
}
