export const products = [
  {
    id: "mint",
    name: "CLASSIC MINT",
    price: 49000,
    description: "산뜻한 민트 컬러와 매끈한 표면을 담은 클래식 디자인.",
    alt: "민트 Zippo 라이터",
    defaultImage: "imgProductCard01",
    hoverImage: "hover-mint",
  },
  {
    id: "red",
    name: "CLASSIC RED",
    price: 49000,
    description: "선명한 레드 컬러로 일상에 포인트를 더하는 클래식 디자인.",
    alt: "레드 Zippo 라이터",
    defaultImage: "imgProductCard02",
    hoverImage: "imgGalleryImageTop",
  },
  {
    id: "black",
    name: "CLASSIC BLACK",
    price: 45000,
    description: "차분한 블랙 컬러와 간결한 실루엣의 클래식 디자인.",
    alt: "블랙 Zippo 라이터",
    defaultImage: "imgProductCard03",
    hoverImage: "hover-black",
  },
  {
    id: "chrome",
    name: "CLASSIC CHROME",
    price: 55000,
    description: "은빛 금속 질감과 열린 라이터의 형태를 보여주는 클래식 디자인.",
    alt: "열린 크롬 Zippo 라이터",
    defaultImage: "imgProductCard04",
    hoverImage: "hover-chrome",
  },
];

// Existing generated visuals; names and prices are user-authorized design examples.
export const classicShopProducts = products.map(product => ({
  id: `classic-${product.id}`,
  category: 'custom',
  name: product.name,
  sourceName: product.name,
  sku: `STUDIO-${product.id.toUpperCase()}`,
  price: product.price,
  currency: 'KRW',
  description: product.description,
  isConcept: true,
  imageStyle: 'editorial',
  hoverStyle: 'scene',
  defaultImage: `/images/${product.defaultImage}.webp`,
  hoverImage: `/images/${product.hoverImage}.webp`,
  images: [
    { src: `/images/${product.defaultImage}.webp` },
    { src: `/images/${product.hoverImage}.webp` },
  ],
}));
