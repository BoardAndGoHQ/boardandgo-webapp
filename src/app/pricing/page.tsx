'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

const CheckIcon = () => (
  <svg className="w-5 h-5 text-accent-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const PricingCard = ({
  plan,
  isPopular,
}: {
  plan: { name: string; description: string; price: string; features: string[] };
  isPopular: boolean;
}) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      className={`glass-effect rounded-2xl p-6 md:p-8 relative overflow-visible group hover:scale-[1.02] transition-all ${
        isPopular ? 'border-2 !border-accent-teal' : ''
      }`}
      onMouseMove={onMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Glow follow */}
      <div
        className="absolute pointer-events-none bg-accent-teal opacity-0 group-hover:opacity-20 blur-[100px] w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 transition-opacity"
        style={{ left: pos.x, top: pos.y, transition: hovering ? 'none' : 'opacity 300ms' }}
      />

      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <span className="bg-accent-teal text-bg-primary text-xs font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="relative z-10 mt-2">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-2">{plan.name}</h3>
          <p className="text-text-muted text-sm mb-4">{plan.description}</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold text-text-primary">${plan.price}</span>
            <span className="text-text-muted">/ month</span>
          </div>
        </div>

        <ul className="space-y-3 mb-8">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm">
              <CheckIcon />
              <span className="text-text-secondary">{f}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/register"
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all group/btn relative overflow-hidden ${
            isPopular
              ? 'bg-accent-teal hover:bg-accent-teal/90 text-bg-primary'
              : 'bg-bg-elevated hover:bg-bg-card text-text-primary'
          }`}
        >
          <span className="relative z-10">Get Started</span>
          <span className="relative z-10 group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
        </Link>
      </div>
    </div>
  );
};

const plans = [
  {
    name: 'Basic',
    description: 'Perfect for occasional travelers',
    price: '0',
    features: ['Track single flight in real-time', 'Basic flight status updates', 'Email notifications', 'Weather updates at destination', 'Basic gate information'],
  },
  {
    name: 'Pro',
    description: 'For frequent flyers',
    price: '5',
    features: ['Everything in Basic, plus:', 'Track up to 3 connecting flights', 'AI voice calls for critical updates', 'Smart connection assistance', 'Interactive terminal maps', 'Turn-by-turn terminal navigation', 'Real-time walking times to gates', 'Priority customer support'],
  },
  {
    name: 'Business',
    description: 'For teams and organizations',
    price: '10',
    features: ['Everything in Pro, plus:', 'Unlimited flight tracking', 'Automatic rebooking suggestions', 'Fast-track security booking', 'Hotel arrangements during delays', 'Expense tracking for disruptions', '24/7 dedicated support'],
  },
];

const faqs = [
  { q: 'Can I switch plans anytime?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
  { q: 'Is there a free trial?', a: 'Yes! You can try our Pro plan free for 14 days. No credit card required.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and Apple Pay.' },
  { q: 'How does the AI voice calling work?', a: "Our AI makes proactive calls for critical updates about your flight, such as gate changes or delays. It's like having a personal travel assistant." },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative pt-16 md:pt-24 pb-12 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">
            Simple Pricing,
            <span className="gradient-text block mt-2">Peace of Mind</span>
          </h1>
          <p className="text-lg text-text-muted max-w-3xl mx-auto">
            Choose the perfect plan for your journey. All plans include our core flight tracking
            technology.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-12 md:py-16 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <PricingCard key={plan.name} plan={plan} isPopular={i === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 border-t border-border-subtle">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="glass-effect rounded-xl p-6">
                <h3 className="text-base font-semibold text-text-primary mb-2">{faq.q}</h3>
                <p className="text-sm text-text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
