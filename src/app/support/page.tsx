'use client';

import { useState, useCallback } from 'react';
import { MessageCircle, Mail, Phone, ChevronDown, HelpCircle, LifeBuoy } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

/* ── Quick Help Card ── */
function QuickHelp({ title, description, icon: Icon }: { title: string; description: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 flex items-center justify-center text-accent-blue group-hover:bg-accent-blue group-hover:text-white transition-colors shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-text-primary mb-1.5">{title}</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

/* ── FAQ Item ── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-accent-blue/3 transition-colors"
      >
        <span className="font-semibold text-text-primary text-sm pr-4">{question}</span>
        <ChevronDown className={`w-4 h-4 text-text-muted shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div
        className="grid transition-all duration-300"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

const faqs = [
  { question: 'How do I track multiple flights?', answer: 'With our Pro plan, you can track up to 3 connecting flights simultaneously. Business plan users get unlimited flight tracking.' },
  { question: 'What happens if my flight is delayed?', answer: 'Our AI system will immediately notify you through your preferred channels and provide alternative options if needed.' },
  { question: 'Can I share my flight status?', answer: 'Yes, you can easily share your flight status with family and friends through the app using email, SMS, or WhatsApp.' },
  { question: 'How accurate is the tracking?', answer: 'Our flight tracking is 98% accurate, using multiple data sources including AviationStack API and FlightAware.' },
];

export default function SupportPage() {
  const heroRef = useScrollReveal<HTMLDivElement>();
  const helpRef = useScrollReveal<HTMLDivElement>();
  const faqRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="flex flex-col">
      {/* ═══ Hero ═══ */}
      <section className="relative pt-20 md:pt-28 pb-16 overflow-hidden">
        <div className="absolute top-16 left-1/3 w-[380px] h-[380px] bg-accent-blue/5 rounded-full blur-3xl pointer-events-none animate-drift" />

        <div ref={heroRef} className="scroll-reveal max-w-6xl mx-auto px-5 text-center space-y-6">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs font-medium text-accent-blue">
            <LifeBuoy className="w-3.5 h-3.5" />
            24/7 Support
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary leading-tight">
            How Can We
            <span className="gradient-text block mt-2">Help You?</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Our team is here to help. Reach out through any of the channels below.
          </p>
        </div>
      </section>

      {/* ═══ Quick Help ═══ */}
      <section className="py-12 md:py-20">
        <div ref={helpRef} className="scroll-reveal max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickHelp
              title="Live Chat Support"
              description="Chat with our support team 24/7 for immediate assistance with your account or flight tracking."
              icon={MessageCircle}
            />
            <QuickHelp
              title="Email Support"
              description="Send us an email at support@boardandgo.com for detailed inquiries and account issues."
              icon={Mail}
            />
            <QuickHelp
              title="Phone Support"
              description="Call us at +1 (231) 625-5322 for urgent assistance with your flight tracking."
              icon={Phone}
            />
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
              <FAQItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
