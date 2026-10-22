import { products } from './products';
import editorialProducts from './shop/editorial.json';

export const collections = [
  { id: 'CLASSIC', category: 'custom', products },
  { id: 'EMBLEM', category: 'armor', products: editorialProducts.filter(product => product.collection === 'EMBLEM') },
  { id: 'LIMITED', category: '540-color', products: editorialProducts.filter(product => product.collection === 'LIMITED') },
];
