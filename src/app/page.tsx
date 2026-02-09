import Link from 'next/link';
import Image from 'next/image';
import { FlightSearch } from '@/components/flight-search';
import { IconPlane, IconSparkles, IconSearch } from '@/components/icons';

/* ── data ──────────────────────────────────────────────────────── */
const features = [
  {
    title: 'Real-Time Aircraft Tracking',
    description:
      "Track your flight with 98% accuracy, from takeoff to landing. Our AI agents monitor your aircraft's location, speed, and status in real-time.",
    icon: '✈',
  },
  {
    title: 'Smart Connection Management',
    description:
      'Never miss a connection. Our AI calculates optimal routes through terminals and alerts you about gate changes or delays.',
    icon: (
      <svg className="w-6 h-6 text-accent-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: 'Proactive AI Assistance',
    description:
      'Receive instant solutions for disruptions before they impact your journey. Our AI concierge is always one step ahead.',
    icon: (
      <svg className="w-6 h-6 text-accent-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Multi-Flight Monitoring',
    description:
      'Track multiple flights simultaneously. Perfect for complex itineraries and connecting flights across different airlines.',
    icon: (
      <svg className="w-6 h-6 text-accent-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
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
    name: 'Lena Bergström',
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

/* ── page ──────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ───────── Hero ───────── */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-bg-secondary/50 to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-teal/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-amber/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary tracking-tight mb-4 leading-tight">
            Your AI Travel Partner
            <br />
            <span className="gradient-text">Never Miss a Flight</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10">
            AI Agents that handle your travel for you, so you can just Board-and-Go!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="#find-flights"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent-teal text-bg-primary font-medium text-sm rounded-lg hover:bg-accent-teal/90 transition-colors"
            >
              <IconSearch className="w-4 h-4" />
              Search Flights
            </Link>
            <Link
              href="/search?mode=ai"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-bg-elevated border border-border-subtle text-text-primary font-medium text-sm rounded-lg hover:bg-bg-card transition-colors"
            >
              <IconSparkles className="w-4 h-4 text-accent-teal" />
              Try AI Search
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── Embedded Search ───────── */}
      <section id="find-flights" className="py-12 md:py-16 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
              Find Your Next Flight
            </h2>
            <p className="text-text-muted text-sm">
              Search across hundreds of airlines for the best prices.
            </p>
          </div>
          <FlightSearch />
        </div>
      </section>

      {/* ───────── Features ───────── */}
      <section className="py-16 md:py-20 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-xl border border-border-subtle bg-bg-secondary/50 hover:bg-bg-card/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center mb-4 text-xl">
                  {typeof f.icon === 'string' ? f.icon : f.icon}
                </div>
                <h3 className="text-sm font-medium text-text-primary mb-1.5">{f.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Mobile App Preview ───────── */}
      <section className="py-16 md:py-20 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary leading-tight">
                Take BoardAndGo
                <span className="gradient-text block mt-1">Wherever You Go</span>
              </h2>
              <p className="text-text-muted max-w-lg">
                Download our mobile app to track flights, receive real-time updates, and access
                AI-powered insights on the go.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#" className="transition-all duration-300 hover:-translate-y-1 w-[180px]">
                  <Image
                    src="/icons/download-on-the-app-store.svg"
                    alt="Download on the App Store"
                    width={180}
                    height={54}
                    className="w-full h-auto"
                  />
                </a>
                <a href="#" className="transition-all duration-300 hover:-translate-y-1 w-[180px]">
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
              <div className="absolute inset-0 bg-accent-teal/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

              {/* iOS Device */}
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

              {/* Android Device */}
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

      {/* ───────── Testimonials ───────── */}
      <section className="py-16 md:py-20 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {testimonials.map((t, i) => (
                <div
                  key={t.name}
                  className={`glass-effect rounded-xl p-5 group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 ${
                    i % 2 !== 0 ? 'sm:translate-y-6' : ''
                  }`}
                >
                  {/* Hover gradient glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-teal/10 via-accent-amber/5 to-transparent rounded-xl opacity-0 group-hover:opacity-50 transition-all duration-500" />

                  <div className="relative space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-teal/20 to-accent-amber/10 flex items-center justify-center text-xs font-semibold text-accent-teal shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary group-hover:text-accent-teal transition-colors duration-300">
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
                        <svg
                          key={j}
                          className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform duration-300"
                          style={{ transitionDelay: `${j * 50}ms` }}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Text side */}
            <div className="flex flex-col justify-center space-y-6 order-first lg:order-last">
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
                Trusted by Travelers
                <span className="gradient-text block mt-1">Worldwide</span>
              </h2>
              <p className="text-text-muted max-w-lg">
                Join thousands of satisfied users who trust BoardAndGo for their travel needs.
                Experience seamless flight tracking with real-time updates and AI-powered insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-teal text-bg-primary font-medium text-sm rounded-lg hover:bg-accent-teal/90 transition-colors"
                >
                  Get Started <span>&rarr;</span>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-bg-elevated border border-border-subtle text-text-primary text-sm rounded-lg hover:bg-bg-card transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Final CTA ───────── */}
      <section className="py-20 md:py-28 border-t border-border-subtle relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-accent-teal/5 to-bg-primary pointer-events-none" />
        <div className="absolute -left-20 bottom-0 w-80 h-80 bg-accent-teal/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -right-20 bottom-0 w-80 h-80 bg-accent-amber/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">
            Never Miss a Flight
            <span className="gradient-text block mt-2">Let AI Be Your Co-Pilot</span>
          </h2>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto mb-8">
            Join thousands of stress-free travelers who let our AI handle the complexities of flight
            tracking. From gate changes to delay predictions, we&apos;ve got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent-teal text-bg-primary font-medium text-sm rounded-lg hover:bg-accent-teal/90 transition-colors"
            >
              Search Flights <span>&rarr;</span>
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-bg-elevated border border-border-subtle text-text-primary text-sm rounded-lg hover:bg-bg-card transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
