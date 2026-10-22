import newProducts from './new.json';
import customProducts from './custom.json';
import armorProducts from './armor.json';
import colorProducts from './540-color.json';
import editorialProducts from './editorial.json';
import { classicShopProducts } from '../products';

export const shopCategories = [
  { id: 'new', label: 'NEW', line: 'A NEW SPARK.', description: '새로운 컬러, 새로운 이야기. 지금 만나는 ZIPPO의 신제품.' },
  { id: 'custom', label: 'CUSTOM', line: 'MAKE IT YOURS.', description: '당신만의 이야기를 새길, 각인 가능한 클래식 ZIPPO.' },
  { id: 'armor', label: 'ARMOR', line: 'MORE TO HOLD.', description: '깊이 있는 디테일과 금속의 존재감. ARMOR와 EMBLEM 컬렉션.' },
  { id: '540-color', label: '540 COLOR', line: 'EVERY SIDE, A STORY.', description: '컬러를 입은 540 COLOR와 소장하고 싶은 LIMITED 컬렉션.' },
];
export const shopProducts = [...newProducts, ...classicShopProducts, ...customProducts, ...editorialProducts, ...armorProducts, ...colorProducts];
export const findProduct = id => shopProducts.find(p => p.id === id);
export const formatPrice = value => `₩${value.toLocaleString('ko-KR')}`;
export const productHref = product => `/shop/product/${product.id}`;
