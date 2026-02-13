'use client';

import { Mail, Phone, MapPin, Database, Eye, Lock, Globe, Users, Clock, ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Data Collection': Database,
  'Use of Information': Eye,
  'AI Voice System': Phone,
  'Data Sharing': Globe,
  'Data Security': Lock,
  'User Rights': Users,
  'Data Retention': Clock,
  'International Transfers': Globe,
  "Children's Privacy": ShieldCheck,
};

const sections = [
  {
    title: 'Data Collection',
    subsections: [
      { heading: 'Essential Flight Data', intro: 'We collect:', items: ['Flight itineraries and booking references', 'Airline and flight numbers', 'Departure and arrival information', 'Connection details', 'Travel document information (when provided)'] },
      { heading: 'Personal Information', intro: 'To provide personalized service, we collect:', items: ['Name and contact details', 'Phone number (for AI voice calls)', 'Email address', 'WhatsApp number (if enabled)', 'Travel preferences'] },
    ],
  },
  {
    title: 'Use of Information',
    items: ['Track and monitor your flights in real-time', 'Provide AI voice call updates about critical changes', 'Calculate optimal connection routes', 'Send multi-channel notifications', 'Suggest alternative arrangements during disruptions', "Improve our AI assistant's understanding and responses"],
    intro: 'Your data enables us to:',
  },
  {
    title: 'AI Voice System',
    items: ['Uses voice recognition to understand responses', 'Records calls for quality improvement', 'Processes conversations using artificial intelligence', 'Learns from interactions to improve service'],
    intro: 'Our AI voice system "Amy":',
    outro: 'Voice recordings are stored securely and automatically deleted after 30 days unless required for specific service improvements or legal compliance.',
  },
  {
    title: 'Data Sharing',
    items: ['Airlines (for flight status verification)', 'Airports (for terminal navigation)', 'Weather services (for impact analysis)', 'Service providers (SMS, email, voice calls)'],
    intro: 'We share data with:',
    outro: 'We never sell your personal data to third parties.',
  },
  {
    title: 'Data Security',
    items: ['End-to-end encryption for all transmissions', 'Secure cloud storage with regular backups', 'Access controls and authentication', 'Regular security audits', 'Employee training on data protection'],
    intro: 'We protect your data through:',
  },
  {
    title: 'User Rights',
    items: ['Access your personal data', 'Correct inaccurate information', 'Request data deletion', 'Opt out of AI voice calls', 'Export your data', 'Withdraw consent for data processing'],
    intro: 'You have the right to:',
  },
  {
    title: 'Data Retention',
    items: ['Active accounts: Duration of account activity', 'Flight data: 90 days after completion', 'Voice recordings: 30 days', 'Payment information: As required by law'],
    intro: 'We retain data for:',
  },
  {
    title: 'International Transfers',
    text: 'As a global service, we may transfer data across borders. All international transfers comply with relevant data protection laws and use appropriate safeguards.',
  },
  {
    title: "Children's Privacy",
    text: 'BoardAndGo does not knowingly collect data from children under 13. Parents or guardians should manage flight tracking for young travelers.',
  },
];

export default function PrivacyPage() {
  const heroRef = useScrollReveal<HTMLDivElement>();
  const contentRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="relative pt-16 md:pt-24 pb-20">
      <div className="absolute top-16 left-1/4 w-[400px] h-[400px] bg-accent-blue/5 rounded-full blur-3xl pointer-events-none animate-drift" />

      <div className="max-w-4xl mx-auto px-5">
        {/* Header */}
        <div ref={heroRef} className="scroll-reveal text-center mb-14">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs font-medium text-accent-blue mb-6">
            <Lock className="w-3.5 h-3.5" />
            Privacy
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-3">Privacy Policy</h1>
          <p className="text-text-secondary">How we handle and protect your data</p>
        </div>

        <div ref={contentRef} className="scroll-reveal space-y-6">
          {sections.map((s, i) => {
            const Icon = iconMap[s.title] || Lock;
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

                {'subsections' in s && s.subsections ? (
                  <div className="space-y-5">
                    {s.subsections.map((sub) => (
                      <div key={sub.heading} className="glass rounded-xl p-5">
                        <h3 className="text-base font-semibold text-text-primary mb-3">{sub.heading}</h3>
                        <p className="text-sm text-text-secondary mb-2">{sub.intro}</p>
                        <ul className="space-y-2 pl-1">
                          {sub.items.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-2 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : 'text' in s && s.text ? (
                  <p className="text-sm text-text-secondary leading-relaxed">{s.text}</p>
                ) : (
                  <>
                    {'intro' in s && <p className="text-sm text-text-secondary mb-3">{s.intro}</p>}
                    {'items' in s && (
                      <ul className="space-y-2 pl-1">
                        {s.items!.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-2 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {'outro' in s && s.outro && <p className="text-sm text-text-muted mt-3 italic">{s.outro}</p>}
                  </>
                )}
              </div>
            );
          })}

          {/* Contact */}
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-bold text-text-primary mb-4">Contact Information</h2>
            <p className="text-sm text-text-secondary mb-5">For privacy concerns:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Mail, label: 'Email', value: 'privacy@boardandgo.com' },
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
