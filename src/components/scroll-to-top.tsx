'use client';

import { useState, useEffect } from 'react';

function PlaneIcon() {
  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 307 257"
      fill="currentColor"
      style={{ transform: 'rotate(-90deg)' }}
    >
      <path d="M84.5 1c-2.2.4-3.5.8-3 .9.6.1.3.6-.5 1.1-1.3.8-1.3 1 .1 1 1.1 0 4.1 5.4 9.4 17.2 4.4 9.5 7.9 18.2 7.9 19.4.1 2.8 16.7 39.6 18.5 41 1 .8 1.6 3.3 1.7 8 .1 3.8.5 10.8.9 15.5l.8 8.6-25.4.6c-16.5.4-28.2 1.1-33.4 2.1-4.4.9-8.6 1.6-9.2 1.6-.7 0-6.7-7.3-13.4-16.3-6.7-8.9-12.9-16.8-13.7-17.5-1.4-1.1-12.2-1.8-12.2-.8 0 .2 2 8.6 4.5 18.7 2.4 10.1 4.3 18.3 4.2 18.4-.1.1-1.4.9-2.9 1.8-1.5.9-3.5 1.7-4.5 1.7-2.4.1-12.8 3.7-12.8 4.5 0 .8 10.4 4.4 12.8 4.5 1 0 3 .8 4.5 1.7 1.5.9 2.8 1.7 2.9 1.8.1.1-1.8 8.3-4.2 18.4-2.5 10.1-4.5 18.5-4.5 18.7 0 1 10.8.3 12.2-.9.8-.6 7-8.5 13.7-17.5 6.7-8.9 12.7-16.2 13.4-16.2.6 0 4.8.7 9.2 1.6 5.2 1 16.9 1.7 33.4 2.1l25.4.6-.8 8.6c-.4 4.7-.8 11.7-.9 15.5-.1 4.7-.7 7.2-1.7 8-1.8 1.4-18.4 38.2-18.5 41 0 1.2-3.5 9.9-7.9 19.3-5.3 11.9-8.3 17.3-9.4 17.3-1.4 0-1.4.2-.1 1 .8.5 1.1 1 .5 1.1-.5.1 1 .5 3.5.9 3.7.6 5.3.3 9.4-1.7 5.8-2.9 3.3-.1 37.9-43.7 17.3-21.8 28.6-35.2 29.8-35.4 1.1-.2 2.7.2 3.5.9 2 1.7 16.2 2.4 19.7 1 2.7-1 2.8-1.3 2.5-7.3l-.3-6.3-8.2-.3c-4.6-.2-8.3-.5-8.3-.7 0-1 11.4-14.5 12.2-14.5.4 0 .8-.5.8-1.1 0-.7-1-.9-2.7-.4-2.3.5-2.6.4-1.5-.7 1-1 11.1-1.4 47-1.9 45-0.6 45.9-.7 56.7-3.3 31-7.4 31-16.8 0-24.2-10.8-2.6-11.7-2.7-56.7-3.3-35.9-.5-46-.9-47-1.9-1.1-1.1-.8-1.2 1.5-.7 1.7.5 2.7.3 2.7-.4 0-.6-.4-1.1-.8-1.1-.8 0-12.2-13.5-12.2-14.5 0-.2 3.7-.5 8.3-.7l8.2-.3.3-6.3c.3-6 .2-6.3-2.5-7.3-3.5-1.4-17.7-.7-19.7 1-.8.7-2.4 1.1-3.5.9-1.2-.2-12.5-13.6-29.8-35.4-34.6-43.7-32.1-40.7-38.1-43.8-2.8-1.4-5.3-2.5-5.4-2.5-.2.1-2.1.5-4.3.9z" />
    </svg>
  );
}

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 right-4 z-50">
      <button
        onClick={scrollToTop}
        className={`transform transition-all duration-500 ease-in-out ${
          visible ? '-translate-y-4 opacity-100' : 'translate-y-24 opacity-0'
        }`}
        aria-label="Scroll to top"
      >
        <div className="relative p-3.5 rounded-full bg-bg-card/80 backdrop-blur-md border border-border-subtle shadow-xl shadow-black/20 group hover:scale-110 hover:border-accent-teal/30 transition-all duration-300 animate-float">
          {/* Hover glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-teal/20 to-accent-teal/5 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300" />

          {/* Plane */}
          <div className="relative text-accent-teal group-hover:text-accent-teal transition-colors">
            <PlaneIcon />
          </div>
        </div>
      </button>
    </div>
  );
}
