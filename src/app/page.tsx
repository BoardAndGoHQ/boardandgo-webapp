'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { FlightSearch } from '@/components/flight-search';
import { AgentChat } from '@/components/agent-chat';
import {
  IconSearch,
  IconSparkles,
  IconPlane,
  IconRadar,
  IconRoute,
  IconHeadset,
  IconGrid,
} from '@/components/icons';

/* ── data ──────────────────────────────────────── */
const features = [
  {
    title: 'Real-Time Aircraft Tracking',
    description:
      "Track your flight with 98% accuracy, from takeoff to landing. Our AI agents monitor your aircraft's location, speed, and status in real-time.",
    icon: IconRadar,
  },
  {
    title: 'Smart Connection Management',
    description:
      'Never miss a connection. Our AI calculates optimal routes through terminals and alerts you about gate changes or delays.',
    icon: IconRoute,
  },
  {
    title: 'Proactive AI Assistance',
    description:
      'Receive instant solutions for disruptions before they impact your journey. Our AI concierge is always one step ahead.',
    icon: IconHeadset,
  },
  {
    title: 'Multi-Flight Monitoring',
    description:
      'Track multiple flights simultaneously. Perfect for complex itineraries and connecting flights across different airlines.',
    icon: IconGrid,
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

/* ── Animated flight path SVG ── */
function FlightPath() {
  const path1 = "M-100 300 C200 100, 400 500, 600 250 S900 400, 1300 150";
  const path2 = "M-50 450 C150 200, 500 350, 700 150 S1000 300, 1350 100";

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]"
      viewBox="0 0 1200 600"
      fill="none"
      preserveAspectRatio="none"
    >
      {/* Dashed trails */}
      <path
        d={path1}
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="12 8"
        className="text-accent-teal animate-dash"
      />
      <path
        d={path2}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="8 12"
        className="text-text-muted animate-dash"
        style={{ animationDelay: '-15s' }}
      />

      {/* Plane on path 1 */}
      <g opacity="0.7">
        <path
          d="M0 -6 L3 6 L0 4 L-3 6 Z"
          fill="currentColor"
          className="text-accent-teal"
        >
          <animateMotion
            dur="22s"
            repeatCount="indefinite"
            rotate="auto"
            path={path1}
          />
        </path>
      </g>

      {/* Plane on path 2 */}
      <g opacity="0.5">
        <path
          d="M0 -5 L2.5 5 L0 3.5 L-2.5 5 Z"
          fill="currentColor"
          className="text-text-muted"
        >
          <animateMotion
            dur="28s"
            repeatCount="indefinite"
            rotate="auto"
            path={path2}
          />
        </path>
      </g>
    </svg>
  );
}

/* ── page ──────────────────────────────────────── */
export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<'manual' | 'ai'>('manual');
  const searchRef = useRef<HTMLDivElement>(null);

  const scrollToSearch = (mode: 'manual' | 'ai') => {
    setSearchMode(mode);
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleFlightSearch = (params: URLSearchParams) => {
    if (user) {
      router.push(`/search?${params.toString()}`);
    } else {
      // Save intent and prompt login
      const searchUrl = `/search?${params.toString()}`;
      router.push(`/login?redirect=${encodeURIComponent(searchUrl)}`);
    }
  };

  return (
    <div className="flex flex-col">
      {/* ───────── Hero ───────── */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Atmospheric backgrounds */}
        <FlightPath />
        <div className="absolute inset-0 bg-linear-to-b from-bg-secondary/50 to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-teal/5 rounded-full blur-[120px] pointer-events-none animate-drift" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-amber/4 rounded-full blur-[100px] pointer-events-none animate-drift-reverse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent-teal/3 rounded-full blur-[80px] pointer-events-none animate-pulse-slow" />

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          {/* Overline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-teal/8 border border-accent-teal/15 rounded-full mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse" />
            <span className="text-xs font-medium text-accent-teal tracking-wide">AI-Powered Flight Intelligence</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary tracking-tight mb-5 leading-[1.1]">
            Your AI Travel Partner
            <br />
            <span className="gradient-text">Never Miss a Flight</span>
          </h1>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            AI Agents that handle your entire travel experience &mdash; from finding the best fares
            to real-time flight tracking. Just Board-and-Go.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => scrollToSearch('manual')}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-accent-teal text-bg-primary font-semibold text-sm rounded-xl glow-teal hover:brightness-110 transition-all duration-300"
            >
              <IconSearch className="w-4 h-4" />
              Search Flights
            </button>
            <button
              onClick={() => scrollToSearch('ai')}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-bg-elevated/80 border border-border-subtle text-text-primary font-medium text-sm rounded-xl hover:bg-bg-card hover:border-accent-teal/20 transition-all duration-300"
            >
              <IconSparkles className="w-4 h-4 text-accent-teal" />
              Try AI Search
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-12 text-text-muted">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['D', 'P', 'L', 'M'].map((initial, i) => (
                  <div
                    key={initial}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-teal/20 to-accent-amber/10 border-2 border-bg-primary flex items-center justify-center text-[10px] font-semibold text-accent-teal"
                    style={{ zIndex: 4 - i }}
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <span className="text-xs">Trusted by 2,000+ travelers</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs ml-1">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Embedded Search Experience ───────── */}
      <section ref={searchRef} id="find-flights" className="py-12 md:py-20 scroll-mt-20 relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-bg-secondary/30 to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              Find Your Next Flight
            </h2>
            <p className="text-text-muted text-sm max-w-md mx-auto">
              Search across hundreds of airlines or let our AI find the perfect flight for you.
            </p>
          </div>

          {/* Mode Toggle — sliding pill */}
          <div className="flex justify-center mb-8">
            <div className="relative inline-flex p-1 bg-bg-elevated/60 border border-border-subtle rounded-full">
              {/* Sliding indicator */}
              <div
                className="absolute top-1 bottom-1 rounded-full bg-accent-teal shadow-sm shadow-accent-teal/25 transition-all duration-300 ease-in-out"
                style={{
                  left: searchMode === 'manual' ? '4px' : '50%',
                  width: 'calc(50% - 4px)',
                }}
              />
              <button
                onClick={() => setSearchMode('manual')}
                className={`relative z-10 flex items-center gap-2 px-5 py-2 text-[13px] font-medium rounded-full transition-colors duration-300 ${
                  searchMode === 'manual' ? 'text-bg-primary' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <IconSearch className="w-3.5 h-3.5" />
                Manual Search
              </button>
              <button
                onClick={() => setSearchMode('ai')}
                className={`relative z-10 flex items-center gap-2 px-5 py-2 text-[13px] font-medium rounded-full transition-colors duration-300 ${
                  searchMode === 'ai' ? 'text-bg-primary' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <IconSparkles className="w-3.5 h-3.5" />
                AI Search
              </button>
            </div>
          </div>

          {/* ── Content area with slide transition ── */}
          <div className="relative overflow-hidden">
            {/* Manual Mode */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                searchMode === 'manual'
                  ? 'opacity-100 translate-x-0 relative'
                  : 'opacity-0 -translate-x-8 absolute inset-x-0 top-0 pointer-events-none'
              }`}
            >
              <FlightSearch onSearch={handleFlightSearch} />
            </div>

            {/* AI Mode */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                searchMode === 'ai'
                  ? 'opacity-100 translate-x-0 relative'
                  : 'opacity-0 translate-x-8 absolute inset-x-0 top-0 pointer-events-none'
              }`}
            >
            <div className="flex flex-col md:flex-row gap-5">
              {/* Chat panel */}
              <div className="w-full md:w-[380px] lg:w-[420px] shrink-0">
                <div className="h-[520px]">
                  {user ? (
                    <AgentChat />
                  ) : (
                    <div className="bg-bg-card border border-border-subtle rounded-xl h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-accent-teal/10 flex items-center justify-center">
                        <IconSparkles className="w-7 h-7 text-accent-teal" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-text-primary mb-1">AI Flight Assistant</h4>
                        <p className="text-xs text-text-muted max-w-xs">
                          Sign in to chat with our AI and find the perfect flight for your next trip.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href="/login"
                          className="px-5 py-2 text-[13px] font-medium text-bg-primary bg-accent-teal rounded-lg hover:brightness-110 transition-all"
                        >
                          Log in
                        </Link>
                        <Link
                          href="/register"
                          className="px-5 py-2 text-[13px] font-medium text-text-primary bg-bg-elevated border border-border-subtle rounded-lg hover:bg-bg-card transition-colors"
                        >
                          Sign up
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview panel */}
              <div className="hidden md:flex flex-1 min-w-0">
                <div className="w-full glass-card rounded-xl flex flex-col items-center justify-center text-center p-12 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-bg-elevated flex items-center justify-center">
                    <IconPlane className="w-8 h-8 text-text-muted/30" />
                  </div>
                  <h3 className="text-base font-medium text-text-secondary">
                    Your flights will appear here
                  </h3>
                  <p className="text-sm text-text-muted max-w-xs">
                    Chat with the AI assistant to find flights. Once you confirm, you&apos;ll be taken to full results.
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* ───────── Features ───────── */}
      <section className="py-16 md:py-24 border-t border-border-subtle relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-teal/3 rounded-full blur-[120px] pointer-events-none" />

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
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="feature-card group p-6 rounded-xl border border-border-subtle bg-bg-secondary/50 hover:bg-bg-card/60 hover:border-accent-teal/15"
                >
                  <div className="w-11 h-11 rounded-xl bg-accent-teal/8 border border-accent-teal/10 flex items-center justify-center mb-4 group-hover:bg-accent-teal/15 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-accent-teal" />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary mb-2">{f.title}</h3>
                  <p className="text-[13px] text-text-muted leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── Mobile App Preview ───────── */}
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
      <section className="py-16 md:py-24 border-t border-border-subtle">
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
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
                Trusted by Travelers
                <span className="gradient-text block mt-1">Worldwide</span>
              </h2>
              <p className="text-text-muted max-w-lg leading-relaxed">
                Join thousands of satisfied users who trust BoardAndGo for their travel needs.
                Experience seamless flight tracking with real-time updates and AI-powered insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => scrollToSearch('manual')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-teal text-bg-primary font-semibold text-sm rounded-xl glow-teal hover:brightness-110 transition-all duration-300"
                >
                  Get Started <span>&rarr;</span>
                </button>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-bg-elevated border border-border-subtle text-text-primary text-sm rounded-xl hover:bg-bg-card hover:border-accent-teal/20 transition-all duration-300"
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
        <FlightPath />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-accent-teal/4 to-bg-primary pointer-events-none" />
        <div className="absolute -left-20 bottom-0 w-80 h-80 bg-accent-teal/8 rounded-full blur-[100px] pointer-events-none animate-drift" />
        <div className="absolute -right-20 bottom-0 w-80 h-80 bg-accent-amber/8 rounded-full blur-[100px] pointer-events-none animate-drift-reverse" />

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">
            Never Miss a Flight
            <span className="gradient-text block mt-2">Let AI Be Your Co-Pilot</span>
          </h2>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Join thousands of stress-free travelers who let our AI handle the complexities of flight
            tracking. From gate changes to delay predictions, we&apos;ve got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => scrollToSearch('manual')}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent-teal text-bg-primary font-semibold text-sm rounded-xl glow-teal hover:brightness-110 transition-all duration-300"
            >
              Search Flights <span>&rarr;</span>
            </button>
            <Link
              href="/features"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-bg-elevated border border-border-subtle text-text-primary text-sm rounded-xl hover:bg-bg-card hover:border-accent-teal/20 transition-all duration-300"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
