'use client';

import { useRef, type RefObject } from 'react';
import Image from 'next/image';
import { Mic, Plane, MapPin, Radio, Navigation, Clock, CloudSun, Shield, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useCountUp } from '@/hooks/useCountUp';
import Link from 'next/link';

/* ── Animated stat ── */
function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, value: countValue } = useCountUp(value, { duration: 2000 });
  return (
    <div ref={ref as RefObject<HTMLDivElement>} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-accent-blue">
        {countValue}{suffix}
      </div>
      <div className="text-sm text-text-muted mt-1">{label}</div>
    </div>
  );
}

export default function FeaturesPage() {
  const heroRef = useScrollReveal<HTMLDivElement>();
  const chatRef = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });
  const trackRef = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });
  const connectRef = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });
  const statsRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
  const ctaRef = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div className="flex flex-col">
      {/* ═══ Hero ═══ */}
      <section className="relative pt-20 md:pt-28 pb-16 overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-16 left-1/4 w-105 h-105 rounded-full bg-accent-blue/5 blur-3xl pointer-events-none animate-drift" />
        <div className="absolute bottom-0 right-1/4 w-[320px] h-80 rounded-full bg-accent-blue/4 blur-3xl pointer-events-none animate-drift-reverse" />

        <div ref={heroRef} className="scroll-reveal max-w-6xl mx-auto px-5 text-center space-y-6">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs font-medium text-accent-blue">
            <Radio className="w-3.5 h-3.5" />
            AI-Powered Features
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary leading-tight">
            Travel With
            <span className="gradient-text block mt-2">Peace of Mind</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Let our AI agents handle the complexities of flight tracking while you focus on what matters.
          </p>
        </div>
      </section>

      {/* ═══ Feature 1 — AI Voice Calls ═══ */}
      <section className="py-16 md:py-24">
        <div ref={chatRef} className="scroll-reveal max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="space-y-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent-blue/10 text-accent-blue">
                <Mic className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-text-primary">
                AI Voice Calls That Feel Human
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Forget robotic notifications. Our AI agents make natural voice calls that feel like
                talking to a helpful friend. They understand context, anticipate your needs, and
                provide solutions before you even ask.
              </p>
              <p className="text-text-secondary leading-relaxed">
                From gate changes to weather updates, we keep you informed with conversations that
                feel natural and helpful.
              </p>
            </div>

            {/* Chat card */}
            <div className="glass-card rounded-2xl p-6 space-y-5">
              {/* AI message */}
              <div className="flex items-start gap-3 animate-fade-up">
                <div className="w-9 h-9 rounded-full bg-accent-blue flex items-center justify-center text-white text-xs font-bold shrink-0">AI</div>
                <div className="flex-1 glass rounded-2xl rounded-tl-md p-4">
                  <p className="text-xs text-text-muted mb-1">Amy from BoardAndGo</p>
                  <p className="text-sm text-text-primary">Your flight to Paris has arrived at Gate B15, which is about 12 minutes walk from your current location. Boarding begins in 45 minutes.</p>
                </div>
              </div>
              {/* User message */}
              <div className="flex items-start gap-3 animate-fade-up stagger-2">
                <div className="w-9 h-9 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-muted text-xs font-bold shrink-0">S</div>
                <div className="flex-1 bg-accent-blue/5 rounded-2xl rounded-tl-md p-4">
                  <p className="text-xs text-text-muted mb-1">Sarah</p>
                  <p className="text-sm text-text-primary">Perfect, thanks! Will I make my connection?</p>
                </div>
              </div>
              {/* AI reply */}
              <div className="flex items-start gap-3 animate-fade-up stagger-4">
                <div className="w-9 h-9 rounded-full bg-accent-blue flex items-center justify-center text-white text-xs font-bold shrink-0">AI</div>
                <div className="flex-1 glass rounded-2xl rounded-tl-md p-4">
                  <p className="text-xs text-text-muted mb-1">Amy from BoardAndGo</p>
                  <p className="text-sm text-text-primary">Yes, we&apos;re expecting an early arrival at 7:45 AM. I&apos;ve already updated your pre-arranged taxi with the new time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Feature 2 — Live Tracking ═══ */}
      <section className="py-16 md:py-24 bg-bg-secondary/50">
        <div ref={trackRef} className="scroll-reveal max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Flight card */}
            <div className="glass-card rounded-2xl p-6 order-2 lg:order-1">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-lg font-bold text-text-primary">AF023 &bull; Paris</h4>
                  <p className="text-xs text-text-muted mt-0.5">Airbus A350-900</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">On Time</span>
              </div>

              {/* Progress bar */}
              <div className="relative mb-6">
                <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-linear-to-r from-accent-blue to-blue-400 rounded-full relative">
                    <Plane className="absolute -right-3 -top-2 w-5 h-5 text-accent-blue animate-pulse-slow" />
                  </div>
                </div>
                <div className="flex justify-between text-sm text-text-muted mt-3">
                  <span className="font-medium">JFK</span>
                  <span className="font-medium">CDG</span>
                </div>
              </div>

              {/* Info row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: <Navigation className="w-4 h-4" />, label: 'Gate', value: 'B15' },
                  { icon: <Clock className="w-4 h-4" />, label: 'Arrival', value: '7:45 AM', highlight: true },
                  { icon: <CloudSun className="w-4 h-4" />, label: 'Weather', value: '16°C' },
                ].map((item) => (
                  <div key={item.label} className="glass rounded-xl p-3 text-center">
                    <div className="flex justify-center text-accent-blue mb-1">{item.icon}</div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wide">{item.label}</p>
                    <p className={`text-sm font-bold ${item.highlight ? 'text-emerald-600' : 'text-text-primary'}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Text */}
            <div className="space-y-5 order-1 lg:order-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent-blue/10 text-accent-blue">
                <Plane className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-text-primary">
                Real-Time Flight Tracking
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Watch your journey unfold with stunning precision. Our platform tracks your
                aircraft&apos;s exact location, speed, and status in real-time, giving you complete
                peace of mind.
              </p>
              <p className="text-text-secondary leading-relaxed">
                We monitor everything from weather patterns to airport operations, ensuring
                you&apos;re always one step ahead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Feature 3 — Smart Connection ═══ */}
      <section className="py-16 md:py-24">
        <div ref={connectRef} className="scroll-reveal max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="space-y-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent-blue/10 text-accent-blue">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-text-primary">
                Smart Connection Protection
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Never stress about tight connections again. Our AI calculates real-time walking
                distances between gates, monitors your flight&apos;s progress, and even arranges
                fast-track services when needed.
              </p>
              <p className="text-text-secondary leading-relaxed">
                We&apos;ll guide you through terminals with turn-by-turn directions, ensuring you
                make every connection with time to spare.
              </p>
            </div>

            {/* Image card */}
            <div className="relative h-75 w-full glass-card rounded-2xl overflow-hidden">
              <Image
                src="/images/terminal-map.jpg"
                alt="Terminal Navigation"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-white/80 via-white/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 glass rounded-xl px-4 py-3 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-accent-blue shrink-0" />
                <div>
                  <p className="text-xs text-text-muted">Walking to Gate B15</p>
                  <p className="text-sm font-bold text-text-primary">12 min &middot; 850m</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Stats ═══ */}
      <section className="py-16 md:py-20 bg-bg-secondary/50">
        <div ref={statsRef} className="scroll-reveal max-w-6xl mx-auto px-5">
          <div className="glass-card rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <Stat value={98} suffix="%" label="Tracking Accuracy" />
              <Stat value={78} suffix="%" label="Fewer Missed Connections" />
              <Stat value={24} suffix="/7" label="AI Availability" />
              <Stat value={2.3} suffix="M+" label="Hours of Anxiety Saved" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 md:py-24">
        <div ref={ctaRef} className="scroll-reveal max-w-3xl mx-auto px-5 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Ready to fly smarter?
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Join thousands of travelers who trust BoardAndGo for stress-free journeys.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-accent-blue text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-accent-blue/90 transition-all glow-primary hover:scale-105"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
