import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis: Lenis | null = null;

if (!reduced) {
  lenis = new Lenis({
    autoRaf: false,
    lerp: 0.12,
    anchors: { offset: -88 },
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export const scrollToEl = (target: string | HTMLElement) => {
  if (lenis) lenis.scrollTo(target, { offset: -88 });
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
};

export { gsap, ScrollTrigger, lenis };
