'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Animated counter that counts from 0 to `target` when the element enters the viewport.
 *
 * Usage:
 *   const { ref, value } = useCountUp(98, { suffix: '%' });
 *   <span ref={ref}>{value}</span>
 */
export function useCountUp(
  target: number,
  opts?: {
    duration?: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
  }
) {
  const ref = useRef<HTMLElement>(null);
  const [value, setValue] = useState('0');
  const hasAnimated = useRef(false);

  const duration = opts?.duration ?? 1500;
  const suffix = opts?.suffix ?? '';
  const prefix = opts?.prefix ?? '';
  const decimals = opts?.decimals ?? 0;

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      const rafId = requestAnimationFrame(() => {
        setValue(`${prefix}${target.toFixed(decimals)}${suffix}`);
      });
      hasAnimated.current = true;
      return () => cancelAnimationFrame(rafId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            observer.disconnect();

            const start = performance.now();

            const tick = (now: number) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = eased * target;
              setValue(`${prefix}${current.toFixed(decimals)}${suffix}`);

              if (progress < 1) {
                requestAnimationFrame(tick);
              }
            };

            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, suffix, prefix, decimals]);

  return { ref, value };
}
