'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

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
    <div className="fixed bottom-6 right-4 z-50">
      <button
        onClick={scrollToTop}
        className={`transform transition-all duration-500 ease-in-out ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <div className="relative p-3 rounded-full glass shadow-lg group hover:scale-110 hover:shadow-xl transition-all duration-300">
          {/* Hover glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/15 to-accent-blue/5 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300" />

          <div className="relative text-accent-blue">
            <ChevronUp className="w-5 h-5" />
          </div>
        </div>
      </button>
    </div>
  );
}
