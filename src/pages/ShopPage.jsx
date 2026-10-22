import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useShop } from '../shop/useShop';
import { shopCategories, shopProducts } from '../data/shop/catalog';
import ShopCard from '../shop/ShopCard';

export default function ShopPage() {
  const { route, navigate } = useShop();
  const requested = new URLSearchParams(route.split('?')[1]).get('category');
  const category = shopCategories.find(item => item.id === requested) || shopCategories[0];
  const [sort, setSort] = useState('featured');
  const grid = useRef(null);
  const products = shopProducts.filter(product => product.category === category.id).sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0);
  useEffect(() => { document.title = `${category.label} — SHOP ZIPPO`; }, [category.label]);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => gsap.from('.shop-card', { y: 32, opacity: 0, duration: .65, stagger: .055, ease: 'power2.out', clearProps: 'transform,opacity' }), grid);
    return () => ctx.revert();
  }, [category.id, sort]);
  return (
    <main className="shop-main" id="shop-main">
      <div className="shop-title"><a href="/" className="shop-breadcrumb">ZIPPO / SHOP</a><h1>FIND YOUR<br /><span>FLAME.</span></h1><p>ONE LIGHTER. A LIFETIME OF STORIES.</p></div>
      <div className="shop-layout">
        <aside className="shop-sidebar"><p className="shop-eyebrow">THE COLLECTION</p><nav aria-label="상품 카테고리">{shopCategories.map(item => <a key={item.id} href={`/shop?category=${item.id}`} aria-current={category.id === item.id ? 'page' : undefined}><span>{item.label}</span><small>{String(shopProducts.filter(product => product.category === item.id).length).padStart(2, '0')}</small><span className="category-arrow">↗</span></a>)}</nav><p className="shop-category-copy">{category.description}</p><span className="shop-sidebar-note">IT WORKS.<br />OR WE FIX IT FREE.™</span><a href="/" className="shop-back">← BACK TO ZIPPO</a></aside>
        <section className="shop-display" aria-label={`${category.label} 제품`}>
          <div className="shop-display-heading"><div><h2>{category.label}</h2><span>{String(products.length).padStart(2, '0')} OBJECTS OF DESIRE</span></div><label className="shop-sort">SORT BY <select aria-label="상품 정렬" value={sort} onChange={event => setSort(event.target.value)}><option value="featured">FEATURED</option><option value="low">PRICE: LOW → HIGH</option><option value="high">PRICE: HIGH → LOW</option></select></label></div>
          <div className="shop-editorial-grid" ref={grid} key={category.id}>{products.map((product, index) => <ShopCard key={product.id} product={product} index={index} />)}</div>
          <div className="shop-endnote"><span>YOU'VE SEEN ALL {products.length}.</span><p>{category.line}</p><button onClick={() => navigate(`/shop?category=${shopCategories[(shopCategories.indexOf(category) + 1) % 4].id}`)}>EXPLORE THE NEXT COLLECTION ↗</button></div>
        </section>
      </div>
    </main>
  );
}
