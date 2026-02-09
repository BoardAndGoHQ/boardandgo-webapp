import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features | BoardAndGo',
  description:
    "Experience the future of flight tracking with BoardAndGo's AI-powered features.",
};

export default function FeaturesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative pt-16 md:pt-24 pb-12 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-teal/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">
            Travel With
            <span className="gradient-text block mt-2">Peace of Mind</span>
          </h1>
          <p className="text-lg text-text-muted max-w-3xl mx-auto">
            Let our AI agents handle the complexities of flight tracking while you focus on what
            matters.
          </p>
        </div>
      </section>

      {/* Feature 1: AI Chat */}
      <section className="py-12 md:py-16 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-semibold text-text-primary">
                AI Voice Calls That Feel Human
              </h3>
              <p className="text-text-muted">
                Forget robotic notifications. Our AI agents make natural voice calls that feel like
                talking to a helpful friend. They understand context, anticipate your needs, and
                provide solutions before you even ask.
              </p>
              <p className="text-text-muted">
                From gate changes to weather updates, we keep you informed with conversations that
                feel natural and helpful.
              </p>
            </div>
            {/* AI call simulation card */}
            <div className="glass-effect rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-teal flex items-center justify-center text-bg-primary text-sm font-medium">AI</div>
                <div className="flex-1">
                  <p className="text-xs text-text-muted">Amy from BoardAndGo</p>
                  <p className="text-sm text-text-primary">Your flight to Paris has arrived at Gate B15, which is about 12 minutes walk from your current location. Boarding begins in 45 minutes.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 opacity-60">
                <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-text-muted text-sm font-medium">S</div>
                <div className="flex-1">
                  <p className="text-xs text-text-muted">Sarah</p>
                  <p className="text-sm text-text-primary">Perfect, thanks! Will I make my connection?</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-teal flex items-center justify-center text-bg-primary text-sm font-medium">AI</div>
                <div className="flex-1">
                  <p className="text-xs text-text-muted">Amy from BoardAndGo</p>
                  <p className="text-sm text-text-primary">Yes, we&apos;re expecting an early arrival at 7:45 AM. I&apos;ve already updated your pre-arranged taxi with the new time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Live Tracking */}
      <section className="py-12 md:py-16 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Live flight card */}
            <div className="glass-effect rounded-2xl p-5 order-2 lg:order-1">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h4 className="text-base font-semibold text-text-primary">AF023 &bull; Paris</h4>
                  <p className="text-xs text-text-muted">Airbus A350-900</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs">On Time</span>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <div className="h-1 bg-bg-elevated rounded-full">
                    <div className="h-full w-3/4 bg-linear-to-r from-accent-teal to-accent-amber rounded-full relative">
                      <div className="absolute -right-2 -top-2.5 animate-pulse text-text-primary">✈</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-text-muted mt-2">
                    <span>JFK</span>
                    <span>CDG</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-text-muted text-xs">Gate</p>
                    <p className="font-semibold text-text-primary">B15</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">Arrival</p>
                    <p className="font-semibold text-green-400">7:45 AM</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">Weather</p>
                    <p className="font-semibold text-text-primary">16&deg;C</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 order-1 lg:order-2">
              <h3 className="text-2xl md:text-3xl font-semibold text-text-primary">
                Real-Time Flight Tracking
              </h3>
              <p className="text-text-muted">
                Watch your journey unfold with stunning precision. Our platform tracks your
                aircraft&apos;s exact location, speed, and status in real-time, giving you complete
                peace of mind.
              </p>
              <p className="text-text-muted">
                We monitor everything from weather patterns to airport operations, ensuring
                you&apos;re always one step ahead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: Smart Connection */}
      <section className="py-12 md:py-16 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-semibold text-text-primary">
                Smart Connection Protection
              </h3>
              <p className="text-text-muted">
                Never stress about tight connections again. Our AI calculates real-time walking
                distances between gates, monitors your flight&apos;s progress, and even arranges
                fast-track services when needed.
              </p>
              <p className="text-text-muted">
                We&apos;ll guide you through terminals with turn-by-turn directions, ensuring you
                make every connection with time to spare.
              </p>
            </div>
            <div className="relative h-[280px] w-full rounded-2xl overflow-hidden">
              <Image
                src="/images/terminal-map.jpg"
                alt="Terminal Navigation"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-bg-primary via-bg-primary/50 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-16 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '98%', label: 'Tracking Accuracy' },
              { value: '78%', label: 'Fewer Missed Connections' },
              { value: '24/7', label: 'AI Availability' },
              { value: '2.3M+', label: 'Hours of Anxiety Saved' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
