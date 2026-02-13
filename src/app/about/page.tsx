import Image from 'next/image';
import type { Metadata } from 'next';
import { Rocket, Plane, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | BoardAndGo',
  description:
    "Learn about BoardAndGo's mission to revolutionize flight tracking with AI innovation.",
};

const stats = [
  { value: '98%', label: 'Flight Tracking Accuracy' },
  { value: '24/7', label: 'AI Agent Availability' },
  { value: '78%', label: 'Reduction in Missed Connections' },
  { value: '2.3M+', label: 'Hours of Passenger Anxiety Saved' },
];

const values = [
  {
    title: 'Proactive Care',
    description:
      "We don't just track flights — we anticipate needs and solve problems before they arise.",
    icon: Rocket,
  },
  {
    title: 'Traveler First',
    description:
      'Every feature we build starts with reducing traveler stress and anxiety.',
    icon: Plane,
  },
  {
    title: 'Always Connected',
    description:
      'From takeoff to landing, our AI agents never stop watching over your journey.',
    icon: Target,
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative pt-16 md:pt-24 pb-12 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">
            Your Personal AI
            <span className="gradient-text block mt-2">Travel Companion</span>
          </h1>
          <p className="text-lg text-text-muted max-w-3xl mx-auto">
            At BoardAndGo, we&apos;ve built a swarm of AI agents that work tirelessly to track your
            flights, predict disruptions, and ensure you never miss a connection. From takeoff to
            landing, we&apos;ve got you covered.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 md:py-16 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
                Our Mission
                <span className="gradient-text block mt-2">Peace of Mind in the Skies</span>
              </h2>
              <p className="text-text-muted">
                Born from a moment of clarity at Dubai International Airport, BoardAndGo was created
                to solve the fragmentation of flight information that causes unnecessary stress for
                millions of travelers. Our AI-powered platform monitors your flights in real-time,
                predicts potential disruptions, and provides instant solutions — just like having a
                personal travel assistant in your pocket.
              </p>
              <div className="space-y-3">
                {[
                  'Real-time aircraft tracking and monitoring',
                  'AI-powered delay predictions and alerts',
                  'Personalized voice calls for critical updates',
                  'Smart connection management and guidance',
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                    <span className="text-sm text-text-secondary">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src="/images/mission-visual.jpg"
                alt="BoardAndGo Mission"
                width={600}
                height={400}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/10 via-transparent to-transparent mix-blend-overlay" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-16 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-bold gradient-text">{s.value}</div>
                <div className="text-sm text-text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-16 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
              Our Values
              <span className="gradient-text block mt-2">That Guide Us</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="glass-effect rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-blue/[0.08] border border-accent-blue/10 flex items-center justify-center mb-4 group-hover:bg-accent-blue/[0.12] group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 text-accent-blue" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{v.title}</h3>
                  <p className="text-sm text-text-muted">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
