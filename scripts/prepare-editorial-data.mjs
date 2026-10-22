import fs from 'node:fs/promises';

const selected = JSON.parse(await fs.readFile('docs/catalog-source/editorial-selected.json', 'utf8'));
const firstImages = { '1000001912': 0, '1000001756': 1, '1000001847': 0, '1000002170': 1, '1000002315': 1, '1000002237': 1, '1000002325': 1, '1000002321': 1 };
const displayNames = ['Valkyrie Gold Emblem', 'Wolf Emblem Design', 'Lucky Wings Brass Antique', '46856 오딘 엠블렘', 'Pink Floyd® 피라미드', 'Guy Harvey® 샤크', 'Blazy Susan® 부케 로즈', 'Grateful Dead® 댄싱베어'];
const descriptions = [
  '골드 발키리 엠블렘의 입체적인 질감이 돋보이는 공식 EMBLEM 컬렉션 제품.',
  '실버 울프 엠블렘과 섬세한 장식이 어우러진 공식 EMBLEM 컬렉션 제품.',
  '앤티크 브라스와 날개 엠블렘이 어우러진 Lucky Wings 디자인.',
  '오딘의 얼굴을 금속 엠블렘으로 표현한 ZIPPO 46856 디자인.',
  'Pink Floyd®의 피라미드 아트워크를 담은 공식 한정판 47239.',
  'Guy Harvey®의 샤크 아트워크를 담은 공식 한정판 47104.',
  'Blazy Susan®의 부케 로즈 아트워크를 담은 공식 한정판 47193.',
  'Grateful Dead®의 댄싱베어 아트워크를 담은 공식 락스피릿 한정판 47250.',
];
const products = selected.map((product, index) => ({
  ...product,
  displayName: displayNames[index],
  description: descriptions[index],
  defaultImage: product.id === '1000001912' ? '/images/collections/emblem/1000001912-default.webp' : product.images[firstImages[product.id]].src,
  ...(product.id === '1000001912' ? { editedDefault: true } : {}),
  hoverImage: `/images/collections/${product.collection.toLowerCase()}/${product.id}-hover.webp`,
  hoverStyle: 'scene',
  generatedHover: true,
  imageConcept: product.collection === 'EMBLEM' ? 'CRAFTED IN METAL' : 'THE COLLECTOR’S LIGHT',
}));
await fs.writeFile('src/data/shop/editorial.json', JSON.stringify(products, null, 2) + '\n');
console.log('Prepared 4 EMBLEM and 4 LIMITED products.');
