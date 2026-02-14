import Link from 'next/link';
import Image from 'next/image';
import {
  Radar,
  Route,
  Headset,
  LayoutGrid,
  Signal,
  Star,
} from 'lucide-react';

/* -- data -- */
const features = [
  {
    title: 'Real-Time Aircraft Tracking',
    description:
      "Track your flight with 98% accuracy, from takeoff to landing. Our AI agents monitor your aircraft's location, speed, and status in real-time.",
    icon: Radar,
  },
  {
    title: 'Smart Connection Management',
    description:
      'Never miss a connection. Our AI calculates optimal routes through terminals and alerts you about gate changes or delays.',
    icon: Route,
  },
  {
    title: 'Proactive AI Assistance',
    description:
      'Receive instant solutions for disruptions before they impact your journey. Our AI concierge is always one step ahead.',
    icon: Headset,
  },
  {
    title: 'Multi-Flight Monitoring',
    description:
      'Track multiple flights simultaneously. Perfect for complex itineraries and connecting flights across different airlines.',
    icon: LayoutGrid,
  },
];

const testimonials = [
  {
    name: 'Daniel Okafor',
    role: 'Business Consultant',
    content:
      "BoardAndGo's AI agents called me about my Paris connection while I was still at JFK. They had already calculated my walking time to the gate and confirmed my flight was on schedule.",
  },
  {
    name: 'Priya Nair',
    role: 'Software Developer',
    content:
      "When my Tokyo flight was diverted, BoardAndGo's AI Agents had already arranged my hotel and rebooking before we landed. Incredible proactive service!",
  },
  {
    name: 'Lena Bergstr\u00f6m',
    role: 'Digital Nomad',
    content:
      'Managing four connecting flights across three continents was a breeze. The AI Agents tracked each flight and even arranged fast-track security when my connection was tight.',
  },
  {
    name: 'Marco Delgado',
    role: 'Management Consultant',
    content:
      "The voice updates about my next flight while I'm still in the air are game-changing. Makes tight connections so much less stressful.",
  },
];

/* -- Animated flight path SVG -- */
function FlightPath() {
  const path1 = 'M-100 300 C200 100, 400 500, 600 250 S900 400, 1300 150';
  const path2 = 'M-50 450 C150 200, 500 350, 700 150 S1000 300, 1350 100';

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]"
      viewBox="0 0 1200 600"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d={path1}
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="12 8"
        className="text-accent-blue animate-dash"
      />
      <path
        d={path2}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="8 12"
        className="text-text-muted animate-dash"
        style={{ animationDelay: '-15s' }}
      />
      <g opacity="0.7">
        <path
          d="M0 -6 L3 6 L0 4 L-3 6 Z"
          fill="currentColor"
          className="text-accent-blue"
        >
          <animateMotion dur="22s" repeatCount="indefinite" rotate="auto" path={path1} />
        </path>
      </g>
      <g opacity="0.5">
        <path
          d="M0 -5 L2.5 5 L0 3.5 L-2.5 5 Z"
          fill="currentColor"
          className="text-text-muted"
        >
          <animateMotion dur="28s" repeatCount="indefinite" rotate="auto" path={path2} />
        </path>
      </g>
    </svg>
  );
}

/* -- page -- */
export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ---- Hero ---- */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <FlightPath />
        {/* Soft background blobs */}
        <div className="absolute top-1/4 left-1/4 w-125 h-125 bg-accent-blue/6 rounded-full blur-[120px] pointer-events-none animate-drift" />
        <div className="absolute bottom-0 right-1/4 w-100 h-100 bg-blue-300/5 rounded-full blur-[100px] pointer-events-none animate-drift-reverse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-accent-blue/4 rounded-full blur-[80px] pointer-events-none animate-pulse-slow" />

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          {/* Overline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-blue/6 border border-accent-blue/10 rounded-full mb-6 animate-fade-up opacity-0" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
            <span className="text-xs font-medium text-accent-blue tracking-wide">Flight Intelligence Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary tracking-tight mb-5 leading-[1.1] animate-fade-up opacity-0" style={{ animationDelay: '60ms', animationFillMode: 'forwards' }}>
            Your Flight. Fully Handled.
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up opacity-0" style={{ animationDelay: '120ms', animationFillMode: 'forwards' }}>
            Real-time tracking. Gate changes. Delay alerts. Cross-airline intelligence.
            <br className="hidden sm:block" />
            Never get surprised by a disruption again.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up opacity-0" style={{ animationDelay: '180ms', animationFillMode: 'forwards' }}>
            <Link
              href="/track"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-accent-blue text-white font-semibold text-sm rounded-xl glow-primary hover:brightness-110 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            >
              <Signal className="w-4 h-4" />
              Track a Flight
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-12 text-text-muted animate-fade-up opacity-0" style={{ animationDelay: '240ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['D', 'P', 'L', 'M'].map((initial, i) => (
                  <div
                    key={initial}
                    className="w-7 h-7 rounded-full bg-linear-to-br from-accent-blue/15 to-blue-300/10 border-2 border-bg-primary flex items-center justify-center text-[10px] font-semibold text-accent-blue hover:scale-110 transition-transform"
                    style={{ zIndex: 4 - i }}
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <span className="text-xs">Trusted by 2,000+ travelers</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ))}
              <span className="text-xs ml-1.5">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section className="py-16 md:py-24 border-t border-border-subtle relative overflow-hidden">
        <div className="absolute top-0 right-0 w-100 h-100 bg-accent-blue/4 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
              Built for the Modern Traveler
            </h2>
            <p className="text-text-muted text-sm max-w-md mx-auto">
              Everything you need to fly with confidence, powered by intelligent automation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="feature-card group p-6 rounded-xl border border-border-subtle bg-white/60 dark:bg-bg-secondary/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-bg-card/60 hover:border-accent-blue/15 animate-fade-up opacity-0"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="w-11 h-11 rounded-xl bg-accent-blue/8 border border-accent-blue/10 flex items-center justify-center mb-4 group-hover:bg-accent-blue/12 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-5 h-5 text-accent-blue" />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary mb-2">{f.title}</h3>
                  <p className="text-[13px] text-text-muted leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Mobile App Preview ---- */}
      <section className="py-16 md:py-24 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight">
                Take BoardAndGo
                <span className="gradient-text block mt-1">Wherever You Go</span>
              </h2>
              <p className="text-text-muted max-w-lg leading-relaxed">
                Download our mobile app to track flights, receive real-time updates, and access
                AI-powered insights on the go.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#" className="transition-all duration-300 hover:-translate-y-1 w-45">
                  <Image
                    src="/icons/download-on-the-app-store.svg"
                    alt="Download on the App Store"
                    width={180}
                    height={54}
                    className="w-full h-auto"
                  />
                </a>
                <a href="#" className="transition-all duration-300 hover:-translate-y-1 w-45">
                  <Image
                    src="/icons/download-on-the-google-play-store.svg"
                    alt="Get it on Google Play"
                    width={180}
                    height={54}
                    className="w-full h-auto"
                  />
                </a>
              </div>
            </div>

            <div className="relative flex justify-center items-center gap-6">
              <div className="absolute inset-0 bg-accent-blue/4 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

              <div className="animate-float hover:scale-105 transition-transform duration-500">
                <div className="glass-effect rounded-3xl p-1.5 shadow-xl">
                  <Image
                    src="/mockups/ios-device.png"
                    alt="BoardAndGo iOS App"
                    width={180}
                    height={360}
                    className="rounded-2xl"
                    style={{ transform: 'rotate(-5deg)' }}
                  />
                </div>
              </div>

              <div className="animate-float-delay hover:scale-105 transition-transform duration-500">
                <div className="glass-effect rounded-3xl p-1.5 shadow-xl">
                  <Image
                    src="/mockups/android-device.png"
                    alt="BoardAndGo Android App"
                    width={180}
                    height={360}
                    className="rounded-2xl"
                    style={{ transform: 'rotate(5deg)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Testimonials ---- */}
      <section className="py-16 md:py-24 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {testimonials.map((t, i) => (
                <div
                  key={t.name}
                  className={`glass-effect rounded-xl p-5 group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-fade-up opacity-0 ${
                    i % 2 !== 0 ? 'sm:translate-y-6' : ''
                  }`}
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
                >
                  {/* Hover gradient glow */}
                  <div className="absolute inset-0 bg-linear-to-br from-accent-blue/8 via-blue-200/4 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  <div className="relative space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-linear-to-br from-accent-blue/15 to-blue-300/10 flex items-center justify-center text-xs font-semibold text-accent-blue shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary group-hover:text-accent-blue transition-colors duration-300">
                          {t.name}
                        </p>
                        <p className="text-xs text-text-muted">{t.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors duration-300">
                      &ldquo;{t.content}&rdquo;
                    </p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="w-3.5 h-3.5 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform duration-300"
                          style={{ transitionDelay: `${j * 50}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Text side */}
            <div className="flex flex-col justify-center space-y-6 order-first lg:order-last">
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
                Trusted by Travelers
                <span className="gradient-text block mt-1">Worldwide</span>
              </h2>
              <p className="text-text-muted max-w-lg leading-relaxed">
                Join thousands of satisfied users who trust BoardAndGo for their travel needs.
                Experience seamless flight tracking with real-time updates and AI-powered insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/track"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-blue text-white font-semibold text-sm rounded-xl glow-primary hover:brightness-110 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                >
                  Start Tracking <span>&rarr;</span>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/60 dark:bg-bg-elevated border border-border-subtle text-text-primary text-sm rounded-xl hover:bg-white dark:hover:bg-bg-card hover:border-accent-blue/15 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Final CTA ---- */}
      <section className="py-20 md:py-28 border-t border-border-subtle relative overflow-hidden">
        <FlightPath />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-accent-blue/3 to-bg-primary pointer-events-none" />
        <div className="absolute -left-20 bottom-0 w-80 h-80 bg-accent-blue/6 rounded-full blur-[100px] pointer-events-none animate-drift" />
        <div className="absolute -right-20 bottom-0 w-80 h-80 bg-blue-300/6 rounded-full blur-[100px] pointer-events-none animate-drift-reverse" />

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">
            Your Flight. Our Watch.
            <span className="gradient-text block mt-2">Never Be Caught Off Guard Again</span>
          </h2>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            From gate changes to delay predictions &mdash; we sit on top of every airline so you don&apos;t have to.
            The unified flight intelligence layer for modern travelers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/track"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent-blue text-white font-semibold text-sm rounded-xl glow-primary hover:brightness-110 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            >
              Track a Flight <span>&rarr;</span>
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/60 dark:bg-bg-elevated border border-border-subtle text-text-primary text-sm rounded-xl hover:bg-white dark:hover:bg-bg-card hover:border-accent-blue/15 transition-all duration-300"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
