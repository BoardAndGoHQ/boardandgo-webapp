import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | BoardAndGo',
  description: "Terms and conditions for using BoardAndGo's flight tracking and AI assistance services.",
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
    title: 'Service Description',
    items: ['Real-time flight tracking and monitoring', 'AI voice call notifications for critical updates', 'Multi-channel notifications (SMS, email, WhatsApp)', 'Connection assistance and rebooking suggestions', 'Weather impact analysis and predictions', 'Terminal navigation assistance'],
    intro: 'BoardAndGo provides an AI-powered flight tracking and assistance platform that includes:',
  },
  {
    title: 'AI Voice Calls',
    items: ['Our AI assistant "Amy" will make voice calls for critical flight updates', 'Calls may be recorded for quality assurance and service improvement', 'Voice interactions are processed using artificial intelligence', 'You can opt out of voice calls while maintaining other notification methods'],
    intro: 'By using BoardAndGo, you acknowledge and agree that:',
  },
  {
    title: 'Data Usage and Privacy',
    items: ['Flight itinerary information', 'Current location (for terminal navigation)', 'Contact information for notifications', 'Travel preferences and history', 'Voice call recordings when applicable'],
    intro: 'To provide our services, we collect and process:',
    outro: 'All data is processed in accordance with our Privacy Policy and applicable data protection laws.',
  },
  {
    title: 'Service Reliability',
    items: ['Flight data is sourced from multiple providers and airlines', 'We cannot guarantee absolute accuracy of third-party information', 'Service availability may be affected by factors beyond our control', 'Users should always verify critical information with their airline'],
    intro: 'While we strive for 99.9% uptime and accuracy:',
  },
  {
    title: 'User Responsibilities',
    items: ['Provide accurate flight and contact information', 'Maintain updated contact details for notifications', 'Not rely solely on BoardAndGo for critical travel decisions', 'Use the service in compliance with applicable laws and regulations'],
    intro: 'Users agree to:',
  },
  {
    title: 'Subscription and Billing',
    items: ['Basic (Free): Single flight tracking with basic updates', 'Pro ($5/month): Up to 3 connecting flights with AI assistance', 'Business ($10/month): Unlimited tracking with premium features'],
    intro: 'Our service tiers include:',
    outro: 'Subscriptions are billed monthly and can be canceled at any time.',
  },
  {
    title: 'Limitation of Liability',
    items: ['Missed connections due to inaccurate third-party data', 'Costs incurred from AI-suggested alternative arrangements', 'Consequential losses from service disruptions', 'Issues arising from telecommunication service failures'],
    intro: 'BoardAndGo shall not be liable for:',
  },
  {
    title: 'Service Modifications',
    items: ['Modify or discontinue features with reasonable notice', 'Update pricing with 30 days advance notice', 'Improve AI systems and algorithms', 'Add or remove third-party data sources'],
    intro: 'We reserve the right to:',
  },
];

export default function TermsPage() {
  return (
    <div className="relative pt-12 md:pt-16 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">Terms &amp; Conditions</h1>
          <p className="text-text-muted">Our service agreement and usage terms</p>
        </div>

        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title} className="glass-effect rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold gradient-text mb-4">{s.title}</h2>
              <p className="text-sm text-text-secondary mb-3">{s.intro}</p>
              <ul className="list-disc pl-6 space-y-1.5 text-sm text-text-muted">
                {s.items.map((i) => (<li key={i}>{i}</li>))}
              </ul>
              {s.outro && <p className="text-sm text-text-secondary mt-3">{s.outro}</p>}
            </div>
          ))}

          {/* Contact */}
          <div className="glass-effect rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold gradient-text mb-4">Contact Information</h2>
            <p className="text-sm text-text-secondary mb-4">For questions about these terms, contact us at:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <MailIcon className="w-5 h-5" />, label: 'Email', value: 'legal@boardandgo.com' },
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
