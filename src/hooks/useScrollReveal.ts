'use client';

import { useEffect, useRef } from 'react';

/**
 * IntersectionObserver hook that adds `.revealed` class to elements
 * with `.scroll-reveal` when they enter the viewport.
 *
 * Usage:
 *   const ref = useScrollReveal<HTMLDivElement>();
 *   <div ref={ref} className="scroll-reveal">...</div>
 *
 * Or for a container whose children all have .scroll-reveal:
 *   const ref = useScrollReveal<HTMLElement>({ root: true });
 *   <section ref={ref}> <div className="scroll-reveal">... </section>
 */
export function useScrollReveal<T extends HTMLElement>(opts?: { root?: boolean; threshold?: number }) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Immediately reveal everything
      const targets = opts?.root
        ? el.querySelectorAll('.scroll-reveal')
        : [el];
      targets.forEach((t) => t.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: opts?.threshold ?? 0.15 }
    );

    if (opts?.root) {
      el.querySelectorAll('.scroll-reveal').forEach((child) => observer.observe(child));
    } else {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [opts?.root, opts?.threshold]);

  return ref;
}
