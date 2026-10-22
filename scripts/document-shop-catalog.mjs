import fs from 'node:fs/promises';
import { products } from '../src/data/products.js';

const categories = ['new', 'custom', 'armor', '540-color'];
let markdown = `# ZIPPO 상품 카탈로그

공식 상품 수집 및 가격 재검증: 2026-10-22. 기존 공식 상품 32개와 EMBLEM/LIMITED 각 4개로 공식 상품은 총 40개다. CLASSIC 시안 제품 4개를 포함해 화면에는 총 44개를 표시한다. 공식몰 가격·재고는 이후 변경될 수 있다.

## 기존 CLASSIC 시안 제품 — CUSTOM에 추가

사용자 요청으로 기존 생성 이미지를 재사용하고 이름·가격을 지정했다. 공식 상품 데이터와 구분해 src/data/products.js에서 관리한다.

| 제품명 | 시안 가격 | 기본 이미지 | 호버 이미지 |
| --- | ---: | --- | --- |
`;
for (const product of products) markdown += `| ${product.name} | ${product.price.toLocaleString('ko-KR')}원 | ${product.defaultImage} | ${product.hoverImage} |\n`;
markdown += `
## 공식 상품 분류 근거

- NEW: [공식 신상 분류](https://zippo.co.kr/goods/goods_list.php?cateCd=001034004)의 제품.
- CUSTOM: [공식 각인 분류](https://zippo.co.kr/goods/goods_list.php?cateCd=001031)의 클래식 제품. 각인 옵션과 추가 비용은 공식몰에서 선택한다.
- ARMOR: [공식 조각 분류](https://zippo.co.kr/goods/goods_list.php?cateCd=001010)에서 제품명에 Armor가 명시된 제품.
- 540 COLOR: [공식 프린팅 분류](https://zippo.co.kr/goods/goods_list.php?cateCd=001009)의 540 제품. 분류 확인에는 ZIPPO UK 공식 540 컬렉션의 모델 정보도 참고했고, 표시 가격·사진·제품명은 한국 공식몰에서 수집했다.

원본 페이지는 상품 번호별 HTML, 원본 이미지 및 WebP는 public/images/shop/{category}/{goodsNo}/, 데이터는 src/data/shop/의 카테고리별 JSON에 저장했다. manifest.json은 공식 상품 전체 이미지 출처·치수·기본/호버 매핑, verification.json은 실시간 명칭·가격 대조 기록이다.
`;
for (const category of categories) {
  const items = JSON.parse(await fs.readFile(`src/data/shop/${category}.json`, 'utf8'));
  markdown += `\n## ${category.toUpperCase()} — 공식 상품 ${items.length}개\n\n| 공식몰 제품명 | 모델 | 가격 | 기본 / 호버 이미지 |\n| --- | --- | ---: | --- |\n`;
  for (const item of items) markdown += `| [${item.sourceName}](${item.sourceUrl}) | ${item.sku} | ${item.price.toLocaleString('ko-KR')}원 | ${item.defaultImage.split('/').at(-1)} / ${item.hoverImage.split('/').at(-1)} |\n`;
}
const editorial = JSON.parse(await fs.readFile('src/data/shop/editorial.json', 'utf8'));
for (const collection of ['EMBLEM', 'LIMITED']) {
  markdown += `\n## ${collection} — ${collection === 'EMBLEM' ? 'ARMOR' : '540 COLOR'}에 추가\n\n사용자가 지정한 SHOP 분류이며 실제 제품의 케이스/인쇄 방식을 뜻하지 않는다. 기본 사진은 공식몰, 호버 사진은 제품을 참조해 별도 생성했다.\n\n| 제품명 | 가격 | 호버 콘셉트 |\n| --- | ---: | --- |\n`;
  for (const item of editorial.filter(item => item.collection === collection)) markdown += `| [${item.name}](${item.sourceUrl}) | ${item.price.toLocaleString('ko-KR')}원 | ${item.imageConcept} |\n`;
}
markdown += '\n생성 방식: built-in image_gen. 개별 프롬프트는 [editorial-image-prompts.json](editorial-image-prompts.json), 생성 원본 위치와 콘셉트는 [editorial-generated.json](editorial-generated.json). 배포 WebP와 보존 PNG는 public/images/collections/{emblem,limited}/에 있다.\n';
await fs.writeFile('docs/catalog-source/README.md', markdown);
console.log('Catalog documented: 40 official products and 4 studio products.');
