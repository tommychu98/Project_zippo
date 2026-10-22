import { useState, useRef, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { gsap } from 'gsap';
import { findProduct } from '../data/shop/catalog';
import CartDrawer from './CartDrawer';
import { ShopContext } from './useShop';

const currentRoute = () => location.pathname + location.search;
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function ShopProvider({ children }) {
  const [route, setRoute] = useState(currentRoute);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      const value = JSON.parse(localStorage.getItem('zippo-cart-v1') || '[]');
      if (!Array.isArray(value)) return [];
      const items = new Map();
      for (const item of value) {
        if (!item || !findProduct(item.id) || !Number.isInteger(item.quantity) || item.quantity < 1) continue;
        items.set(item.id, { id: item.id, quantity: Math.min(99, (items.get(item.id)?.quantity || 0) + item.quantity) });
      }
      return [...items.values()];
    } catch { return []; }
  });
  const [notice, setNotice] = useState({ title: '', message: '' });
  const [announcement, setAnnouncement] = useState('');
  const curtain = useRef(null);
  const busy = useRef(false);
  const timeline = useRef(null);
  const noticeDialog = useRef(null);

  useEffect(() => {
    try { localStorage.setItem('zippo-cart-v1', JSON.stringify(cart)); } catch { /* Private browsing can disable storage. */ }
  }, [cart]);

  const navigate = useCallback((href, { pop = false } = {}) => {
    if (busy.current && !pop) return;
    const url = new URL(href, location.origin);
    const next = url.pathname + url.search;
    if (next === currentRoute() && !pop) {
      if (url.hash) document.querySelector(url.hash)?.scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth' });
      return;
    }
    busy.current = true;
    timeline.current?.kill();
    // Native dialogs occupy the top layer, above the transition curtain.
    document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
    setCartOpen(false);
    const change = () => {
      if (!pop) history.pushState({}, '', url.pathname + url.search + url.hash);
      // Layout effects in the incoming page measure synchronously during mount.
      // Reset the outgoing scroll first so new reveal triggers don't consume
      // their first entrance at the previous page's footer position.
      window.scrollTo({ top: 0, behavior: 'instant' });
      flushSync(() => { setRoute(next); setCartOpen(false); });
      window.scrollTo({ top: 0, behavior: 'instant' });
      requestAnimationFrame(() => {
        if (url.hash) document.querySelector(url.hash)?.scrollIntoView({ behavior: 'instant' });
        const heading = document.querySelector('main h1');
        if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
      });
    };
    if (reducedMotion()) { change(); gsap.set(curtain.current, { display: 'none' }); busy.current = false; return; }
    gsap.set(curtain.current, { display: 'grid', yPercent: 100 });
    timeline.current = gsap.timeline({ onComplete: () => { gsap.set(curtain.current, { display: 'none' }); busy.current = false; } })
      .to(curtain.current, { yPercent: 0, duration: .46, ease: 'power3.inOut' })
      .call(change)
      .to(curtain.current, { yPercent: -100, duration: .56, delay: .14, ease: 'power3.inOut' });
  }, []);

  useEffect(() => {
    const onPop = () => navigate(location.href, { pop: true });
    const onLink = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href]');
      if (!link || link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href, location.origin);
      if (url.origin !== location.origin || !(url.pathname === '/' || url.pathname.startsWith('/shop'))) return;
      if (url.pathname + url.search === currentRoute() && url.hash) return;
      event.preventDefault(); navigate(url.href);
    };
    window.addEventListener('popstate', onPop);
    document.addEventListener('click', onLink);
    return () => { window.removeEventListener('popstate', onPop); document.removeEventListener('click', onLink); timeline.current?.kill(); };
  }, [navigate]);

  function addToCart(product, quantity = 1) {
    setCart(items => {
      const existing = items.find(item => item.id === product.id);
      return existing ? items.map(item => item.id === product.id ? { ...item, quantity: Math.min(99, item.quantity + quantity) } : item) : [...items, { id: product.id, quantity }];
    });
    setAnnouncement(`${product.name} ${quantity}개를 장바구니에 담았습니다.`);
    setCartOpen(true);
  }
  function setQuantity(id, quantity) {
    setCart(items => quantity <= 0 ? items.filter(item => item.id !== id) : items.map(item => item.id === id ? { ...item, quantity: Math.min(99, quantity) } : item));
  }
  function onNotice(title, message) {
    setNotice({ title, message }); noticeDialog.current.showModal();
  }
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <ShopContext.Provider value={{ route, navigate, cart, count, addToCart, setQuantity, cartOpen, setCartOpen, onNotice }}>
      {children}
      <CartDrawer />
      <div className="page-curtain" ref={curtain} aria-hidden="true" />
      <span className="sr-only" role="status">{announcement}</span>
      <dialog ref={noticeDialog} className="notice-dialog" aria-labelledby="shop-notice-title" onClick={e => { if (e.target === e.currentTarget) noticeDialog.current.close(); }}>
        <div><button className="dialog-close" aria-label="닫기" onClick={() => noticeDialog.current.close()}>×</button><h2 id="shop-notice-title">{notice.title}</h2><p>{notice.message}</p><button className="dialog-confirm" onClick={() => noticeDialog.current.close()}>확인</button></div>
      </dialog>
    </ShopContext.Provider>
  );
}
