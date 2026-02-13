'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

/* ── Pricing Card ── */
const PricingCard = ({
  plan,
  isPopular,
  index,
}: {
  plan: { name: string; description: string; price: string; features: string[] };
  isPopular: boolean;
  index: number;
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
      className={`relative glass-card rounded-2xl p-7 md:p-8 overflow-visible group hover:scale-[1.02] transition-all duration-300 animate-fade-up ${
        isPopular ? 'ring-2 ring-accent-blue shadow-lg' : ''
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Cursor glow */}
      <div
        className="absolute pointer-events-none bg-accent-blue opacity-0 group-hover:opacity-15 blur-[100px] w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 transition-opacity rounded-full"
        style={{ left: pos.x, top: pos.y, transition: hovering ? 'none' : 'opacity 300ms' }}
      />

      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
          <span className="inline-flex items-center gap-1.5 bg-accent-blue text-white text-xs font-semibold px-4 py-1 rounded-full shadow-md">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </span>
        </div>
      )}

      <div className="relative z-10 mt-2">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-text-primary mb-1">{plan.name}</h3>
          <p className="text-text-muted text-sm mb-5">{plan.description}</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-text-primary">${plan.price}</span>
            <span className="text-text-muted text-sm">/ month</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3.5 mb-8">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-accent-blue/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-accent-blue" />
              </div>
              <span className="text-text-secondary">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="/register"
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105 ${
            isPopular
              ? 'bg-accent-blue hover:bg-accent-blue/90 text-white glow-primary'
              : 'glass border border-border-subtle text-text-primary hover:border-accent-blue/30'
          }`}
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
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
    features: [
      'Track single flight in real-time',
      'Basic flight status updates',
      'Email notifications',
      'Weather updates at destination',
      'Basic gate information',
    ],
  },
  {
    name: 'Pro',
    description: 'For frequent flyers',
    price: '5',
    features: [
      'Everything in Basic, plus:',
      'Track up to 3 connecting flights',
      'AI voice calls for critical updates',
      'Smart connection assistance',
      'Interactive terminal maps',
      'Turn-by-turn terminal navigation',
      'Real-time walking times to gates',
      'Priority customer support',
    ],
  },
  {
    name: 'Business',
    description: 'For teams and organizations',
    price: '10',
    features: [
      'Everything in Pro, plus:',
      'Unlimited flight tracking',
      'Automatic rebooking suggestions',
      'Fast-track security booking',
      'Hotel arrangements during delays',
      'Expense tracking for disruptions',
      '24/7 dedicated support',
    ],
  },
];

const faqs = [
  { q: 'Can I switch plans anytime?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
  { q: 'Is there a free trial?', a: 'Yes! You can try our Pro plan free for 14 days. No credit card required.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and Apple Pay.' },
  { q: 'How does the AI voice calling work?', a: "Our AI makes proactive calls for critical updates about your flight, such as gate changes or delays. It's like having a personal travel assistant." },
];

/* ── FAQ Item ── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-accent-blue/3 transition-colors"
      >
        <span className="font-semibold text-text-primary text-sm pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-300 shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div
        className="grid transition-all duration-300"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm text-text-secondary">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const heroRef = useScrollReveal<HTMLDivElement>();
  const faqRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="flex flex-col">
      {/* ═══ Hero ═══ */}
      <section className="relative pt-20 md:pt-28 pb-16 overflow-hidden">
        <div className="absolute top-20 left-1/3 w-[400px] h-[400px] rounded-full bg-accent-blue/5 blur-3xl pointer-events-none animate-drift" />

        <div ref={heroRef} className="scroll-reveal max-w-6xl mx-auto px-5 text-center space-y-6">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs font-medium text-accent-blue">
            <Sparkles className="w-3.5 h-3.5" />
            14-day free trial
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary leading-tight">
            Simple Pricing,
            <span className="gradient-text block mt-2">Peace of Mind</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Choose the perfect plan for your journey. All plans include our core flight tracking technology.
          </p>
        </div>
      </section>

      {/* ═══ Cards ═══ */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <PricingCard key={plan.name} plan={plan} isPopular={i === 1} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-16 md:py-24 bg-bg-secondary/50">
        <div ref={faqRef} className="scroll-reveal max-w-3xl mx-auto px-5">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent-blue/10 text-accent-blue mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
