'use client';

import { useState, useRef, useEffect } from 'react';

const QuickHelp = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <div className="glass-effect rounded-2xl p-6 hover:scale-[1.02] transition-all">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center text-accent-teal">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-muted">{description}</p>
      </div>
    </div>
  </div>
);

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);

  useEffect(() => {
    if (ref.current) setH(open ? ref.current.scrollHeight : 0);
  }, [open]);

  return (
    <div className="border-b border-border-subtle">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left hover:text-accent-teal transition-colors">
        <span className="font-medium text-text-primary">{question}</span>
        <svg className={`w-5 h-5 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div ref={ref} className="overflow-hidden transition-all duration-500" style={{ height: h }}>
        <p className="pb-4 text-sm text-text-muted" style={{ opacity: open ? 1 : 0, transition: 'opacity 300ms' }}>{answer}</p>
      </div>
    </div>
  );
};

export default function SupportPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative pt-16 md:pt-24 pb-12 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">
            How Can We
            <span className="gradient-text block mt-2">Help You?</span>
          </h1>
        </div>
      </section>

      {/* Quick Help */}
      <section className="py-10 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickHelp
              title="Live Chat Support"
              description="Chat with our support team 24/7 for immediate assistance with your account or flight tracking."
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
            />
            <QuickHelp
              title="Email Support"
              description="Send us an email at support@boardandgo.com for detailed inquiries and account issues."
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            />
            <QuickHelp
              title="Phone Support"
              description="Call us at +1 (231) 625-5322 for urgent assistance with your flight tracking."
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 border-t border-border-subtle">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-text-primary text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-2">
            <FAQItem question="How do I track multiple flights?" answer="With our Pro plan, you can track up to 3 connecting flights simultaneously. Business plan users get unlimited flight tracking." />
            <FAQItem question="What happens if my flight is delayed?" answer="Our AI system will immediately notify you through your preferred channels and provide alternative options if needed." />
            <FAQItem question="Can I share my flight status?" answer="Yes, you can easily share your flight status with family and friends through the app using email, SMS, or WhatsApp." />
            <FAQItem question="How accurate is the tracking?" answer="Our flight tracking is 98% accurate, using multiple data sources including AviationStack API and FlightAware." />
          </div>
        </div>
      </section>
    </div>
  );
}
