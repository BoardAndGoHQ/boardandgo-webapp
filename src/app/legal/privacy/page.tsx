import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | BoardAndGo',
  description: 'Learn how BoardAndGo protects and handles your data while providing flight tracking and AI assistance services.',
};

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
);
const LocationIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);

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
  return (
    <div className="relative pt-12 md:pt-16 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">Privacy Policy</h1>
          <p className="text-text-muted">How we handle and protect your data</p>
        </div>

        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title} className="glass-effect rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold gradient-text mb-4">{s.title}</h2>

              {'subsections' in s && s.subsections ? (
                <div className="space-y-5">
                  {s.subsections.map((sub) => (
                    <div key={sub.heading} className="bg-bg-elevated/50 rounded-xl p-5">
                      <h3 className="text-base font-semibold text-text-primary mb-3">{sub.heading}</h3>
                      <p className="text-sm text-text-secondary mb-2">{sub.intro}</p>
                      <ul className="list-disc pl-6 space-y-1.5 text-sm text-text-muted">
                        {sub.items.map((i) => (<li key={i}>{i}</li>))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : 'text' in s && s.text ? (
                <p className="text-sm text-text-muted">{s.text}</p>
              ) : (
                <>
                  {'intro' in s && <p className="text-sm text-text-secondary mb-3">{s.intro}</p>}
                  {'items' in s && (
                    <ul className="list-disc pl-6 space-y-1.5 text-sm text-text-muted">
                      {s.items!.map((i) => (<li key={i}>{i}</li>))}
                    </ul>
                  )}
                  {'outro' in s && s.outro && <p className="text-sm text-text-secondary mt-3">{s.outro}</p>}
                </>
              )}
            </div>
          ))}

          {/* Contact */}
          <div className="glass-effect rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold gradient-text mb-4">Contact Information</h2>
            <p className="text-sm text-text-secondary mb-4">For privacy concerns:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <MailIcon className="w-5 h-5" />, label: 'Email', value: 'privacy@boardandgo.com' },
                { icon: <PhoneIcon className="w-5 h-5" />, label: 'Phone', value: '+1 (231) 625-5322' },
                { icon: <LocationIcon className="w-5 h-5" />, label: 'Address', value: 'Trassaco Springs Estates' },
              ].map((c) => (
                <div key={c.label} className="glass-effect p-4 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-teal/10 flex items-center justify-center text-accent-teal">{c.icon}</div>
                  <div>
                    <p className="text-xs text-text-muted">{c.label}</p>
                    <p className="text-sm text-text-primary">{c.value}</p>
                  </div>
                </div>
              ))}
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
