import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function useSectionMotion(scope, setup, dependencies = []) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({
      desktop: '(min-width: 769px)',
      mobile: '(max-width: 768px)',
      reduce: '(prefers-reduced-motion: reduce)',
    }, context => {
      // Visible HTML/CSS is the default, including when JS is unavailable.
      if (context.conditions.reduce) return;
      return setup(scope.current, context.conditions.mobile);
    });
    return () => media.revert();
  }, { scope, dependencies, revertOnUpdate: true });
}
