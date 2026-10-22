export default function Picture({
  name,
  src,
  alt = "",
  className = "",
  eager = false,
  ...props
}) {
  return (
    <picture className={className}>
      <source srcSet={src || `/images/${name}.webp`} type="image/webp" />
      <img
        src={src || `/images/${name}.png`}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        {...props}
      />
    </picture>
  );
}
