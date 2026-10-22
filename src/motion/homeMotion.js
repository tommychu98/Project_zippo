import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

const select = (root, selector) => gsap.utils.toArray(selector, root);

// onLeave also completes skipped entrances when a scrollbar drag jumps past a
// section. Each trigger owns one paused animation and destroys itself after use.
function enter(trigger, animation, start = 'top 91%') {
  const finish = () => animation.progress(1);
  const scrollTrigger = ScrollTrigger.create({
    trigger, start: `clamp(${start})`, end: 'bottom top', once: true,
    onEnter: () => animation.play(),
    onLeave: finish,
    onRefresh: self => {
      if (self.scroll() > self.end) finish();
    },
  });
  if (scrollTrigger.scroll() > scrollTrigger.end) {
    finish();
    scrollTrigger.kill();
  }
  return animation;
}

function lines(root, trigger, mobile, options = {}) {
  const targets = select(root, '.reveal-line');
  if (!targets.length) return;
  const animation = gsap.from(targets, {
    yPercent: mobile ? 55 : 105, opacity: 0,
    duration: mobile ? .48 : .62,
    stagger: { amount: Math.min(.36, (targets.length - 1) * .075) },
    ease: 'power3.out', paused: true, clearProps: 'transform,opacity',
    ...options,
  });
  return enter(trigger, animation);
}

function fade(targets, trigger, mobile, options = {}) {
  if (!targets.length) return;
  return enter(trigger, gsap.from(targets, {
    y: mobile ? 10 : 22, opacity: 0, duration: .55,
    stagger: .065, ease: 'power2.out', paused: true,
    clearProps: 'transform,opacity', ...options,
  }));
}

function photo(frame, mobile, delay = 0) {
  const mask = frame.querySelector('.image-mask');
  const zoom = frame.querySelector('.image-zoom');
  const drift = frame.querySelector('.image-parallax');
  const animation = gsap.timeline({ paused: true })
    .fromTo(mask, { clipPath: `inset(${mobile ? 12 : 24}% 0 100% 0)` }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: mobile ? .65 : .85,
      ease: 'power3.inOut', clearProps: 'clipPath',
    }, delay)
    .from(zoom, {
      scale: mobile ? 1.045 : 1.11, duration: mobile ? .8 : 1.05,
      ease: 'power3.out', clearProps: 'transform',
    }, delay);
  enter(frame, animation, 'top 94%');
  // A separate layer owns drift; the outer frame retains its CSS rotation.
  gsap.fromTo(drift, { yPercent: mobile ? .65 : 1.6 }, {
    yPercent: mobile ? -.65 : -1.6, ease: 'none',
    scrollTrigger: {
      id: 'home-photo-parallax', trigger: frame, start: 'top bottom',
      end: 'bottom top', scrub: mobile ? .2 : .4,
    },
  });
}

export function heroMotion(root, mobile) {
  lines(root.querySelector('.hero-copy'), root.querySelector('.hero-copy'), mobile, { delay: .08 });
  fade(select(root, '.hero-copy .text-link, .scroll-cue'), root, mobile, { delay: .26 });
}

export function collectionMotion(root, mobile) {
  lines(root.querySelector('h2'), root.querySelector('h2'), mobile);
  fade(select(root, '.collection-tabs'), root.querySelector('h2'), mobile, { delay: .13 });
}

export function productsMotion(root, mobile) {
  fade(select(root, '.product-reveal'), root, mobile, {
    y: mobile ? 16 : 32, duration: .55, stagger: mobile ? .045 : .07,
  });
}

export function storyMotion(root, mobile) {
  // Identical halves make the reset invisible. Only the inner text moves;
  // the yellow bands retain their original CSS rotation and stacking order.
  select(root, '.story-ticker-track').forEach(track => {
    const toRight = track.closest('.ticker-back') !== null;
    gsap.fromTo(track, { xPercent: toRight ? -50 : 0 }, {
      xPercent: toRight ? 0 : -50,
      duration: mobile ? 60 : 50,
      repeat: -1,
      ease: 'none',
    });
  });
  lines(root.querySelector('.story-heading'), root.querySelector('.story-heading'), mobile);
  fade(select(root, '.story-heading p'), root.querySelector('.story-heading'), mobile, { delay: .12 });
  photo(root.querySelector('.story-image'), mobile);
  lines(root.querySelector('.story-content h3'), root.querySelector('.story-content h3'), mobile);
  const paragraph = root.querySelector('.story-content > p');
  // Words flow normally at every width and are safe inside the rotated panel.
  const split = SplitText.create(paragraph, { type: 'words', wordsClass: 'story-word' });
  enter(paragraph, gsap.from(split.words, {
    opacity: 0, y: mobile ? 3 : 6, duration: .38,
    stagger: { amount: .42 }, ease: 'power2.out', paused: true,
    clearProps: 'transform,opacity',
  }));
  fade(select(root, '.story-content .text-link'), paragraph, mobile, { delay: .24 });
}

export function galleryMotion(root, mobile) {
  lines(root.querySelector('h2'), root.querySelector('h2'), mobile);
  // Animate an inner span so the badge/sticker keeps its rotation and hover.
  fade(select(root, '.hashtag-badge > span'), root.querySelector('h2'), mobile, { delay: .14 });
  select(root, '.motion-image').forEach((frame, index) => photo(frame, mobile, index * (mobile ? .055 : .12)));
  fade(select(root, '.gallery-view-all > span'), root.querySelector('.gallery-view-all'), mobile);
}

export function campaignMotion(root, mobile) {
  const hero = root.querySelector('.campaign-hero');
  const visual = root.querySelector('.campaign-visual');
  const copy = gsap.timeline({ paused: true })
    .from(select(hero, '.reveal-line'), {
      yPercent: mobile ? 55 : 105, opacity: 0, duration: .58,
      stagger: .08, ease: 'power3.out', clearProps: 'transform,opacity',
    })
    .from(select(hero, '.text-link'), {
      y: mobile ? 8 : 15, opacity: 0, duration: .45,
      clearProps: 'transform,opacity',
    }, .2);
  let revealed = false;
  gsap.fromTo(visual, {
    clipPath: mobile ? 'inset(28% 22% 28% 22%)' : 'inset(38% 34% 38% 34%)',
  }, {
    clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
    onUpdate() {
      if (!revealed && this.progress() >= .995) {
        revealed = true;
        copy.play();
      }
    },
    scrollTrigger: {
      id: 'home-campaign-expand', trigger: hero, start: 'center 85%',
      end: mobile ? 'center 52%' : 'center 48%', scrub: mobile ? .15 : .3,
      onLeave: () => { revealed = true; copy.progress(1); },
    },
  });
  lines(root.querySelector('.newsletter-panel h2'), root.querySelector('.newsletter-panel h2'), mobile);
  fade(select(root, '.campaign-form'), root.querySelector('.campaign-form'), mobile);
  fade(select(root, '.archive-panel > a > span'), root.querySelector('.archive-panel'), mobile);
}

export function exploreMotion(root, mobile) {
  lines(root.querySelector('h2'), root.querySelector('h2'), mobile);
  select(root, '.explore-row').forEach((row, index) => {
    const animation = gsap.timeline({ paused: true })
      .fromTo(row, { '--rule-progress': 0 }, {
        '--rule-progress': 1, duration: mobile ? .34 : .48, ease: 'power2.inOut',
      }, index * .04)
      .from(select(row, '.explore-label, .explore-detail'), {
        y: mobile ? 10 : 20, opacity: 0, stagger: .06, duration: .5,
        ease: 'power3.out', clearProps: 'transform,opacity',
      }, index * .04 + .22);
    enter(row, animation);
  });
}

export function footerNavMotion(root, mobile) {
  select(root, 'a').forEach(link => fade(select(link, 'span'), link, mobile, { y: mobile ? 8 : 14, duration: .45 }));
}

export function footerMotion(root, mobile) {
  for (const selector of ['.footer-newsletter', '.footer-columns', '.footer-brand', '.footer-bottom']) {
    const targets = select(root, selector);
    fade(targets, targets[0], mobile, { y: mobile ? 8 : 14, duration: .5 });
  }
}
