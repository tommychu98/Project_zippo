export default function Picture({
  name,
  alt = "",
  className = "",
  eager = false,
  ...props
}) {
  return (
    <picture className={className}>
      <source srcSet={`/images/${name}.webp`} type="image/webp" />
      <img
        src={`/images/${name}.png`}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        {...props}
      />
    </picture>
  );
}
