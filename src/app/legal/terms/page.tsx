'use client';

import { Mail, Phone, MapPin, FileText, Shield, Scale } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const sections = [
  {
    title: 'Service Description',
    icon: FileText,
    items: ['Real-time flight tracking and monitoring', 'AI voice call notifications for critical updates', 'Multi-channel notifications (SMS, email, WhatsApp)', 'Connection assistance and rebooking suggestions', 'Weather impact analysis and predictions', 'Terminal navigation assistance'],
    intro: 'BoardAndGo provides an AI-powered flight tracking and assistance platform that includes:',
  },
  {
    title: 'AI Voice Calls',
    icon: Phone,
    items: ['Our AI assistant "Amy" will make voice calls for critical flight updates', 'Calls may be recorded for quality assurance and service improvement', 'Voice interactions are processed using artificial intelligence', 'You can opt out of voice calls while maintaining other notification methods'],
    intro: 'By using BoardAndGo, you acknowledge and agree that:',
  },
  {
    title: 'Data Usage and Privacy',
    icon: Shield,
    items: ['Flight itinerary information', 'Current location (for terminal navigation)', 'Contact information for notifications', 'Travel preferences and history', 'Voice call recordings when applicable'],
    intro: 'To provide our services, we collect and process:',
    outro: 'All data is processed in accordance with our Privacy Policy and applicable data protection laws.',
  },
  {
    title: 'Service Reliability',
    icon: Shield,
    items: ['Flight data is sourced from multiple providers and airlines', 'We cannot guarantee absolute accuracy of third-party information', 'Service availability may be affected by factors beyond our control', 'Users should always verify critical information with their airline'],
    intro: 'While we strive for 99.9% uptime and accuracy:',
  },
  {
    title: 'User Responsibilities',
    icon: Scale,
    items: ['Provide accurate flight and contact information', 'Maintain updated contact details for notifications', 'Not rely solely on BoardAndGo for critical travel decisions', 'Use the service in compliance with applicable laws and regulations'],
    intro: 'Users agree to:',
  },
  {
    title: 'Subscription and Billing',
    icon: FileText,
    items: ['Basic (Free): Single flight tracking with basic updates', 'Pro ($5/month): Up to 3 connecting flights with AI assistance', 'Business ($10/month): Unlimited tracking with premium features'],
    intro: 'Our service tiers include:',
    outro: 'Subscriptions are billed monthly and can be canceled at any time.',
  },
  {
    title: 'Limitation of Liability',
    icon: Scale,
    items: ['Missed connections due to inaccurate third-party data', 'Costs incurred from AI-suggested alternative arrangements', 'Consequential losses from service disruptions', 'Issues arising from telecommunication service failures'],
    intro: 'BoardAndGo shall not be liable for:',
  },
  {
    title: 'Service Modifications',
    icon: FileText,
    items: ['Modify or discontinue features with reasonable notice', 'Update pricing with 30 days advance notice', 'Improve AI systems and algorithms', 'Add or remove third-party data sources'],
    intro: 'We reserve the right to:',
  },
];

export default function TermsPage() {
  const heroRef = useScrollReveal<HTMLDivElement>();
  const contentRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="relative pt-16 md:pt-24 pb-20">
      {/* Decorative blob */}
      <div className="absolute top-16 right-1/4 w-100 h-100 bg-accent-blue/5 rounded-full blur-3xl pointer-events-none animate-drift" />

      <div className="max-w-4xl mx-auto px-5">
        {/* Header */}
        <div ref={heroRef} className="scroll-reveal text-center mb-14">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs font-medium text-accent-blue mb-6">
            <Scale className="w-3.5 h-3.5" />
            Legal
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-3">Terms &amp; Conditions</h1>
          <p className="text-text-secondary">Our service agreement and usage terms</p>
        </div>

        <div ref={contentRef} className="scroll-reveal space-y-6">
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="glass-card rounded-2xl p-6 md:p-8 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-text-primary">{s.title}</h2>
                </div>
                <p className="text-sm text-text-secondary mb-3">{s.intro}</p>
                <ul className="space-y-2 pl-1">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                {s.outro && <p className="text-sm text-text-muted mt-3 italic">{s.outro}</p>}
              </div>
            );
          })}

          {/* Contact */}
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-bold text-text-primary mb-4">Contact Information</h2>
            <p className="text-sm text-text-secondary mb-5">For questions about these terms, contact us at:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Mail, label: 'Email', value: 'legal@boardandgo.com' },
                { icon: Phone, label: 'Phone', value: '+1 (231) 625-5322' },
                { icon: MapPin, label: 'Address', value: 'Trassaco Springs Estates' },
              ].map((c) => {
                const CIcon = c.icon;
                return (
                  <div key={c.label} className="glass rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue shrink-0">
                      <CIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">{c.label}</p>
                      <p className="text-sm font-medium text-text-primary">{c.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-text-muted text-center pt-6 border-t border-border-subtle">
            Last updated: January 2, 2025
          </p>
        </div>
      </div>
    </div>
  );
}
