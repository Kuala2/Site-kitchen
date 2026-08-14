'use client';

import { useEffect } from 'react';

const clamp = (min: number, value: number, max: number) => Math.min(max, Math.max(min, value));

export function SiteMotion() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktop = window.matchMedia('(min-width: 761px)').matches;
    if (reduced) return;
    const hero = document.querySelector<HTMLElement>('[data-motion-hero]');
    const heroImage = hero?.querySelector<HTMLElement>(':scope > img');
    const heroCopy = hero?.querySelector<HTMLElement>('.raHomeHeroCopy');
    const parallax = desktop ? Array.from(document.querySelectorAll<HTMLElement>('[data-parallax] img')) : [];
    const progressBlocks = Array.from(document.querySelectorAll<HTMLElement>('[data-process-progress]'));
    let frame = 0;
    const draw = () => {
      frame = 0;
      if (desktop && hero && heroImage && heroCopy) {
        const rect = hero.getBoundingClientRect();
        const progress = clamp(0, -rect.top / Math.max(rect.height * .62, 1), 1);
        heroImage.style.transform = `scale(${1 + progress * .03})`;
        heroCopy.style.transform = `translate3d(0, ${-progress * 30}px, 0)`;
        heroCopy.style.opacity = String(1 - progress * .72);
      }
      for (const image of parallax) {
        const rect = image.parentElement?.getBoundingClientRect();
        if (!rect || rect.bottom < -100 || rect.top > innerHeight + 100) continue;
        const offset = clamp(-18, (innerHeight * .5 - (rect.top + rect.height * .5)) * .035, 18);
        image.style.transform = `translate3d(0, ${offset}px, 0) scale(1.035)`;
      }
      for (const block of progressBlocks) {
        const rect = block.getBoundingClientRect();
        const progress = clamp(0, (innerHeight * .76 - rect.top) / Math.max(rect.height * .72, 1), 1);
        block.style.setProperty('--process-progress', String(progress));
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    draw();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    return () => {
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
      if (heroImage) heroImage.style.transform = '';
      if (heroCopy) { heroCopy.style.transform = ''; heroCopy.style.opacity = ''; }
      parallax.forEach((image) => { image.style.transform = ''; });
    };
  }, []);
  return null;
}
