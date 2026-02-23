import Link from 'next/link';
import Image from 'next/image';
import {
  Radar,
  Route,
  Headset,
  LayoutGrid,
  Signal,
  Star,
  Plane,
  Quote,
  CheckCircle2,
} from 'lucide-react';

const testimonials = [
  {
    name: 'Daniel Okafor',
    role: 'Business Consultant',
    flight: 'JFK',
    dest: 'CDG',
    status: 'Connection Saved',
    content:
      "BoardAndGo's AI agents called me about my Paris connection while I was still at JFK. They had already calculated my walking time to the gate and confirmed my flight was on schedule.",
  },
  {
    name: 'Priya Nair',
    role: 'Software Developer',
    flight: 'SFO',
    dest: 'NRT',
    status: 'Proactive Rebook',
    content:
      "When my Tokyo flight was diverted, BoardAndGo's AI Agents had already arranged my hotel and rebooking before we landed. Incredible proactive service!",
  },
  {
    name: 'Lena Bergstr\u00f6m',
    role: 'Digital Nomad',
    flight: 'LHR',
    dest: 'SYD',
    status: 'Fast-Track',
    content:
      "Managing four connecting flights across three continents was a breeze. The AI Agents tracked each flight and even arranged fast-track security when my connection was tight.",
  },
  {
    name: 'Marco Delgado',
    role: 'Management Consultant',
    flight: 'ORD',
    dest: 'LHR',
    status: 'Live Updates',
    content:
      "The voice updates about my next flight while I'm still in the air are game-changing. Makes tight connections so much less stressful.",
  },
];

/* -- Animated Radar Background -- */
function RadarWidget() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-30 md:opacity-50">
      {/* Concentric Radar Rings */}
      <div className="absolute w-[800px] h-[800px] rounded-full border border-accent-copper/20" />
      <div className="absolute w-[600px] h-[600px] rounded-full border border-accent-copper/15" />
      <div className="absolute w-[400px] h-[400px] rounded-full border border-accent-copper/20 border-dashed" />
      <div className="absolute w-[200px] h-[200px] rounded-full border border-accent-copper/30" />

      {/* Crosshairs */}
      <div className="absolute w-full h-[1px] bg-accent-copper/10" />
      <div className="absolute w-[1px] h-full bg-accent-copper/10" />

      {/* Sweeping Radar Beam */}
      <div className="absolute w-[800px] h-[800px] rounded-full animate-radar-sweep opacity-60">
        <div style={{
          background: 'conic-gradient(from 0deg, transparent 70%, rgba(160, 67, 10, 0.15) 95%, rgba(160, 67, 10, 0.5) 100%)',
          width: '50%',
          height: '50%',
          transformOrigin: 'bottom right',
          borderRadius: '100% 0 0 0'
        }} className="absolute top-0 left-0" />
      </div>

      {/* Glowing Blips (Simulated Aircraft) */}
      <div className="absolute w-2 h-2 rounded-full bg-accent-copper shadow-[0_0_10px_3px_rgba(160,67,10,0.8)] animate-pulse-ring top-1/4 left-1/3" />
      <div className="absolute w-1.5 h-1.5 rounded-full bg-accent-copper shadow-[0_0_8px_2px_rgba(160,67,10,0.8)] animate-pulse-ring bottom-1/3 right-1/4" style={{ animationDelay: '1s' }} />
      <div className="absolute w-2 h-2 rounded-full bg-accent-copper shadow-[0_0_10px_3px_rgba(160,67,10,0.8)] animate-pulse-ring top-1/2 right-1/3" style={{ animationDelay: '2s' }} />
    </div>
  );
}

function SectionBackground() {
  return (
    <>
      <RadarWidget />
    </>
  );
}

function SectionDivider() {
  return (
    <div className="w-full h-12 flex items-center justify-center relative z-20">
      <div className="absolute w-full h-[1px] bg-linear-to-r from-transparent via-accent-copper/40 to-transparent" />
      <div className="relative w-4 h-4 rounded-full border border-accent-copper/50 bg-bg-primary z-10 flex items-center justify-center shadow-[0_0_10px_rgba(160,67,10,0.5)]">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-copper animate-pulse" />
      </div>
    </div>
  );
}

/* -- page -- */
export default function Home() {
  return (
    <div className="flex flex-col bg-bg-primary">
      {/* ---- Hero ---- */}
      <section className="relative min-h-[90vh] flex items-center py-16 md:py-24 overflow-hidden">
        <SectionBackground />

        <div className="relative max-w-6xl mx-auto px-4 text-center z-10 w-full mt-10 md:mt-0">
          {/* Overline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-effect border-accent-copper/30 rounded-full mb-8 animate-fade-up opacity-0" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-copper opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-copper"></span>
            </div>
            <span className="text-xs font-bold text-accent-copper tracking-[0.15em] uppercase">System Online • Live Tracking</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-text-primary tracking-tighter mb-6 leading-[1.05] animate-fade-up opacity-0 drop-shadow-sm" style={{ animationDelay: '60ms', animationFillMode: 'forwards' }}>
            YOUR FLIGHT. <br />
            <span className="gradient-text">FULLY HANDLED.</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium animate-fade-up opacity-0" style={{ animationDelay: '120ms', animationFillMode: 'forwards' }}>
            Real-time tracking. Gate changes. Delay alerts. Cross-airline intelligence.
            <br className="hidden sm:block" />
            Never get surprised by a disruption again.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up opacity-0" style={{ animationDelay: '180ms', animationFillMode: 'forwards' }}>
            <Link
              href="/track"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-accent-copper text-white font-bold text-sm tracking-wide uppercase rounded-xl glow-neon hover:brightness-110 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Signal className="w-5 h-5 animate-pulse" />
              Initialize Radar
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-16 text-text-muted animate-fade-up opacity-0 glass-effect w-fit mx-auto px-6 py-3 rounded-2xl" style={{ animationDelay: '240ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['D', 'P', 'L', 'M'].map((initial, i) => (
                  <div
                    key={initial}
                    className="w-7 h-7 rounded-full bg-linear-to-br from-accent-copper/15 to-blue-300/10 border-2 border-bg-primary flex items-center justify-center text-[10px] font-semibold text-accent-copper hover:scale-110 transition-transform"
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
      <SectionDivider />
      <section className="py-24 md:py-32 relative overflow-hidden">
        <SectionBackground />

        <div className="relative max-w-6xl mx-auto px-4 z-10">
          <div className="text-center mb-16 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-border-subtle bg-bg-card/50">
              <span className="w-2 h-2 rounded-full bg-accent-copper animate-pulse"></span>
              <span className="text-xs font-bold text-text-secondary tracking-widest uppercase">Core Capabilities</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-text-primary mb-4 tracking-tight drop-shadow-sm">
              Intelligence at Scale
            </h2>
            <p className="text-text-muted text-lg max-w-xl mx-auto font-medium">
              A comprehensive suite of tools designed to anticipate disruptions and optimize your travel operations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr mt-16">
            {/* Card 1: Real-Time Tracking */}
            <div
              className={`lg:col-span-2 feature-card group relative overflow-hidden rounded-[2.5rem] border border-border-subtle bg-white/60 dark:bg-bg-card/50 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-bg-card/90 transition-all duration-500 animate-fade-up opacity-0 p-8 md:p-12 flex flex-col justify-between min-h-[360px]`}
              style={{ animationDelay: `0ms`, animationFillMode: 'forwards' }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(rgba(160,67,10,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(160,67,10,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute top-0 right-0 w-full md:w-2/3 h-full pointer-events-none overflow-hidden rounded-r-[2.5rem] z-0 opacity-20 group-hover:opacity-60 transition-opacity duration-700">
                <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-[500px] h-[500px] border border-accent-copper/20 rounded-full group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-[350px] h-[350px] border border-accent-copper/30 rounded-full border-dashed group-hover:rotate-[20deg] transition-transform duration-1000" />
                <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-[200px] h-[200px] border border-accent-copper/40 rounded-full animate-pulse-slow" />
                <Radar className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-accent-copper/60" />
              </div>

              <div className="relative z-10 w-full md:w-3/4 text-left mt-auto">
                <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-accent-copper/10 to-transparent border border-accent-copper/10 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 backdrop-blur-md mb-6 shadow-xl">
                  <Radar className="w-7 h-7 text-accent-copper" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-text-primary mb-4 group-hover:text-accent-copper transition-colors duration-300">Real-Time Aircraft Tracking</h3>
                <p className="text-[16px] text-text-secondary leading-relaxed font-medium">
                  Track your flight with 98% accuracy, from takeoff to landing. Our AI agents monitor your aircraft&apos;s location, speed, and status in real-time.
                </p>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent-copper/20 rounded-[2.5rem] transition-colors duration-500 pointer-events-none" />
            </div>

            {/* Card 2: Smart Connection */}
            <div
              className={`lg:col-span-1 feature-card group relative overflow-hidden rounded-[2.5rem] border border-border-subtle bg-white/60 dark:bg-bg-card/50 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-bg-card/90 transition-all duration-500 animate-fade-up opacity-0 p-8 flex flex-col justify-end min-h-[360px]`}
              style={{ animationDelay: `100ms`, animationFillMode: 'forwards' }}
            >
              <div className="absolute inset-0 bg-linear-to-bl from-accent-copper/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute top-8 right-8 w-32 h-32 pointer-events-none opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:translate-x-2 group-hover:-translate-y-2">
                <svg viewBox="0 0 100 100" className="w-full h-full text-accent-copper/50 stroke-current drop-shadow-xl" fill="none" strokeWidth="2.5" strokeDasharray="5 5">
                  <path d="M10,90 Q50,10 90,90" className="animate-dash" />
                  <circle cx="10" cy="90" r="5" fill="currentColor" stroke="none" />
                  <circle cx="90" cy="90" r="5" fill="currentColor" stroke="none" />
                  <circle cx="50" cy="30" r="6" fill="currentColor" stroke="none" className="text-accent-copper animate-pulse" />
                </svg>
              </div>

              <div className="relative z-10 w-full mt-auto">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-accent-copper/10 to-transparent border border-accent-copper/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 backdrop-blur-md mb-6">
                  <Route className="w-6 h-6 text-accent-copper" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-3 group-hover:text-accent-copper transition-colors duration-300">Smart Connection</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed font-medium">
                  Never miss a connection. Our AI calculates optimal routes through terminals.
                </p>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent-copper/20 rounded-[2.5rem] transition-colors duration-500 pointer-events-none" />
            </div>

            {/* Card 3: Proactive AI */}
            <div
              className={`lg:col-span-1 feature-card group relative overflow-hidden rounded-[2.5rem] border border-border-subtle bg-white/60 dark:bg-bg-card/50 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-bg-card/90 transition-all duration-500 animate-fade-up opacity-0 p-8 flex flex-col justify-end min-h-[360px]`}
              style={{ animationDelay: `200ms`, animationFillMode: 'forwards' }}
            >
              <div className="absolute inset-0 bg-linear-to-tr from-accent-copper/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-32 h-32 pointer-events-none flex items-center justify-center">
                <div className="absolute w-full h-full bg-accent-copper/10 rounded-full blur-[20px] group-hover:blur-[30px] group-hover:bg-accent-copper/20 transition-all duration-500 animate-pulse-slow" />
                <Headset className="relative z-10 w-16 h-16 text-accent-copper/20 group-hover:text-accent-copper/60 group-hover:scale-110 transition-all duration-500 drop-shadow-xl" />
              </div>

              <div className="relative z-10 w-full mt-auto">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-accent-copper/10 to-transparent border border-accent-copper/10 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 backdrop-blur-md mb-6">
                  <Headset className="w-6 h-6 text-accent-copper" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-3 group-hover:text-accent-copper transition-colors duration-300">Proactive AI</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed font-medium">
                  Receive instant solutions for disruptions before they impact your journey.
                </p>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent-copper/20 rounded-[2.5rem] transition-colors duration-500 pointer-events-none" />
            </div>

            {/* Card 4: Multi-Flight Monitoring */}
            <div
              className={`lg:col-span-2 feature-card group relative overflow-hidden rounded-[2.5rem] border border-border-subtle bg-white/60 dark:bg-bg-card/50 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-bg-card/90 transition-all duration-500 animate-fade-up opacity-0 p-8 md:p-12 flex flex-col justify-between min-h-[360px]`}
              style={{ animationDelay: `300ms`, animationFillMode: 'forwards' }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(rgba(160,67,10,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(160,67,10,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute top-4 right-[-10%] md:right-[5%] w-[80%] md:w-1/2 h-full pointer-events-none flex flex-col gap-4 justify-center opacity-30 group-hover:opacity-100 transition-all duration-700">
                <div className="w-[85%] h-14 bg-white/80 dark:bg-black/10 rounded-2xl border border-white/50 dark:border-white/10 flex items-center px-5 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-[800ms] shadow-lg backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-full bg-accent-copper/10 mr-4 shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-accent-copper" />
                  </div>
                  <div className="h-2.5 w-32 bg-accent-copper/10 rounded-full" />
                </div>
                <div className="w-[95%] h-14 bg-white/80 dark:bg-black/10 rounded-2xl border border-border-subtle flex items-center px-5 transform translate-x-16 group-hover:translate-x-4 transition-transform duration-[800ms] shadow-xl backdrop-blur-sm shadow-accent-copper/5">
                  <div className="w-8 h-8 rounded-full bg-accent-copper/10 mr-4 shrink-0 flex items-center justify-center">
                    <Plane className="w-4 h-4 text-accent-copper rotate-45" />
                  </div>
                  <div className="h-2.5 w-40 bg-accent-copper/10 rounded-full" />
                </div>
                <div className="w-[75%] h-14 bg-white/80 dark:bg-black/10 rounded-2xl border border-white/50 dark:border-white/10 flex items-center px-5 transform translate-x-20 group-hover:translate-x-8 transition-transform duration-[800ms] shadow-md backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-full bg-accent-copper/10 mr-4 shrink-0" />
                  <div className="h-2.5 w-24 bg-accent-copper/10 rounded-full" />
                </div>
              </div>

              <div className="relative z-10 w-full md:w-3/4 text-left mt-auto">
                <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-accent-copper/10 to-transparent border border-accent-copper/10 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 backdrop-blur-md mb-6 shadow-xl">
                  <LayoutGrid className="w-7 h-7 text-accent-copper" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-text-primary mb-4 group-hover:text-accent-copper transition-colors duration-300">Multi-Flight Monitoring</h3>
                <p className="text-[16px] text-text-secondary leading-relaxed font-medium">
                  Track multiple flights simultaneously. Perfect for complex itineraries and connecting flights across different airlines.
                </p>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent-copper/20 rounded-[2.5rem] transition-colors duration-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Mobile App Preview ---- */}
      <SectionDivider />
      <section className="py-24 md:py-32 relative overflow-hidden">
        <SectionBackground />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-up relative z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-copper/20 bg-accent-copper/5 backdrop-blur-sm">
                <span className="text-xs font-bold text-accent-copper tracking-widest uppercase shadow-sm">Pocket HUD</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary leading-[1.1] tracking-tight drop-shadow-sm">
                Take BoardAndGo
                <span className="gradient-text block mt-2">Wherever You Fly</span>
              </h2>

              <p className="text-text-muted text-lg max-w-lg leading-relaxed font-medium">
                Transform your device into a portable flight intelligence radar. Receive push alerts for gate changes, instant re-routing options, and live tracking on the go.
              </p>

              <ul className="space-y-5 pt-4">
                {[
                  'Instant push notifications for delays and gate changes',
                  'Live flight-path tracking and weather overlays',
                  'One-tap proactive rebooking via our AI agents'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent-copper/10 border border-accent-copper/20 flex items-center justify-center shrink-0 shadow-sm">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent-copper animate-pulse" />
                    </div>
                    <span className="text-[16px] font-semibold text-text-primary">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 pt-8 w-full">
                <a href="#" className="flex items-center justify-center sm:justify-start gap-3 px-6 py-3 bg-white hover:bg-gray-100 text-black dark:bg-black dark:text-white dark:hover:bg-neutral-900 transition-all duration-300 rounded-xl border border-border-subtle hover:border-accent-copper/50 hover:shadow-[0_10px_30px_-10px_rgba(160,67,10,0.3)] hover:-translate-y-1 group w-full sm:w-auto">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 group-hover:scale-110 transition-transform duration-300 text-black dark:text-white">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.31-.88 3.5-.83 1.5.06 2.76.68 3.54 1.71-3.09 1.83-2.58 5.86.32 7.02-.68 1.69-1.55 3.32-2.44 4.27zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.45-1.92 4.41-3.74 4.25z" />
                  </svg>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] text-current opacity-70 font-semibold mb-0.5 uppercase tracking-wide">Download on the</span>
                    <span className="text-[15px] font-black tracking-wide">App Store</span>
                  </div>
                </a>

                <a href="#" className="flex items-center justify-center sm:justify-start gap-3 px-6 py-3 bg-white hover:bg-gray-100 text-black dark:bg-black dark:text-white dark:hover:bg-neutral-900 transition-all duration-300 rounded-xl border border-border-subtle hover:border-accent-copper/50 hover:shadow-[0_10px_30px_-10px_rgba(160,67,10,0.3)] hover:-translate-y-1 group w-full sm:w-auto">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 group-hover:scale-110 transition-transform duration-300 text-black dark:text-white">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.98 1.98 0 01-.19-.834V2.648c0-.312.068-.606.189-.834zM20.301 10.334l-4.965-2.853-2.617 2.618 2.61 2.609 4.972-2.852a1.47 1.47 0 000-2.522zM4.698 1.143c.277-.16.604-.209.914-.143l8.031 4.615-3.321 3.32L4.698 1.144zM10.322 15.064l3.328 3.328-8.039 4.62c-.31.178-.636.216-.913.14l5.624-8.088z" />
                  </svg>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] text-current opacity-70 font-semibold mb-0.5 uppercase tracking-wide">Get it on</span>
                    <span className="text-[15px] font-black tracking-wide">Google Play</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Interactive Mockups */}
            <div className="relative flex justify-center items-center gap-8 lg:gap-12 perspective-1000 mt-10 lg:mt-0">
              <div className="absolute inset-0 bg-accent-copper/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />

              {/* Decorative Floating Data Cards */}
              <div className="absolute top-0 right-[-5%] glass-card rounded-2xl p-4 z-30 animate-float shadow-2xl flex items-center gap-4 border-accent-copper/30 hidden md:flex min-w-[200px]">
                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                  <span className="animate-ping absolute h-4 w-4 rounded-full bg-red-400 opacity-75"></span>
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-0.5">Alert</p>
                  <p className="text-[15px] font-black text-text-primary">Gate Changed</p>
                </div>
              </div>

              <div className="absolute bottom-10 left-[-10%] glass-card rounded-2xl p-4 z-30 animate-float-delay shadow-2xl flex items-center gap-4 border-accent-copper/30 hidden md:flex min-w-[220px]">
                <div className="w-10 h-10 rounded-full bg-accent-copper/10 border border-accent-copper/20 text-accent-copper flex items-center justify-center shrink-0">
                  <Plane className="w-5 h-5 -rotate-45" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-0.5">Flight AA123</p>
                  <p className="text-[15px] font-black text-text-primary">Boarding Now</p>
                </div>
              </div>

              {/* iOS Device */}
              <div className="animate-float relative z-20 group">
                <div className="absolute inset-0 bg-accent-copper opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500 rounded-3xl" />
                <div className="glass-card rounded-[2.5rem] p-2 shadow-2xl transition-transform duration-700 hover:rotate-y-12 bg-white/40 dark:bg-black/40">
                  <Image
                    src="/mockups/ios-device.png"
                    alt="BoardAndGo iOS App"
                    width={220}
                    height={440}
                    className="rounded-4xl border border-border-subtle/50 shadow-inner"
                  />
                </div>
              </div>

              {/* Android Device */}
              <div className="animate-float-delay mt-20 relative z-10 group hidden sm:block">
                <div className="absolute inset-0 bg-accent-copper opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500 rounded-3xl" />
                <div className="glass-card rounded-[2.5rem] p-2 shadow-xl opacity-80 group-hover:opacity-100 transition-all duration-700 hover:-rotate-y-12 bg-white/20 dark:bg-black/20">
                  <Image
                    src="/mockups/android-device.png"
                    alt="BoardAndGo Android App"
                    width={200}
                    height={400}
                    className="rounded-4xl border border-border-subtle/50 shadow-inner"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Testimonials ---- */}
      <SectionDivider />
      <section className="py-24 md:py-32 relative overflow-hidden">
        <SectionBackground />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-border-subtle bg-bg-card/50">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-xs font-bold text-text-secondary tracking-widest uppercase">Flight Logs</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-text-primary tracking-tight mb-4 drop-shadow-sm">
              Voices from the <span className="gradient-text">Network</span>
            </h2>
            <p className="text-text-muted text-lg max-w-xl mx-auto font-medium">
              Thousands of business travelers trust BoardAndGo to handle complex itineraries with military precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`glass-card rounded-[2.5rem] p-8 md:p-10 group relative overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(160,67,10,0.15)] dark:hover:shadow-[0_40px_80px_-20px_rgba(160,67,10,0.3)] border border-border-subtle bg-white/60 dark:bg-bg-card/50 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-bg-card/90 flex flex-col justify-between h-full animate-fade-up opacity-0`}
                style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'forwards' }}
              >
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-bl from-accent-copper/10 via-accent-copper/5 to-transparent rounded-bl-full pointer-events-none transition-transform duration-700 group-hover:scale-125 group-hover:from-accent-copper/20" />
                <Quote className="absolute top-8 right-8 w-24 h-24 text-accent-copper/5 -rotate-12 group-hover:text-accent-copper/10 group-hover:rotate-0 transition-all duration-700 pointer-events-none" />

                <div className="relative z-10">
                  {/* Flight tag & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-border-subtle bg-white/50 dark:bg-black/20 shadow-sm backdrop-blur-md group-hover:border-accent-copper/30 transition-colors duration-300">
                      <span className="text-[15px] font-black text-text-primary tracking-wider">{t.flight}</span>
                      <Plane className="w-4 h-4 text-accent-copper" />
                      <span className="text-[15px] font-black text-text-primary tracking-wider">{t.dest}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-accent-copper/10 dark:bg-accent-copper/5 px-3 py-1.5 rounded-full border border-accent-copper/20">
                      <div className="w-2 h-2 rounded-full bg-accent-copper animate-pulse-slow" />
                      <span className="text-[11px] font-bold text-accent-copper uppercase tracking-widest">{t.status}</span>
                    </div>
                  </div>

                  {/* Rating
                  <div className="flex gap-1.5 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] group-hover:scale-110 transition-transform duration-500"
                        style={{ transitionDelay: `${j * 50}ms` }}
                      />
                    ))}
                  </div> */}

                  <p className="text-[17px] md:text-[19px] text-text-secondary leading-relaxed font-medium mb-10 group-hover:text-text-primary transition-colors duration-500 relative">
                    <span className="text-accent-copper/50 text-2xl leading-none absolute -left-4 top-0">&ldquo;</span>
                    {t.content}
                    <span className="text-accent-copper/50 text-2xl leading-none">&rdquo;</span>
                  </p>
                </div>

                {/* Footer/Author */}
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-border-subtle/60 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-accent-copper/20 to-transparent border border-accent-copper/30 flex items-center justify-center text-lg font-black text-accent-copper shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(160,67,10,0.4)] transition-all duration-500 backdrop-blur-sm">
                        {t.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1.5 -right-1.5 bg-bg-primary rounded-full p-0.5 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-50 dark:fill-bg-primary" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[16px] font-black text-text-primary group-hover:text-accent-copper transition-colors duration-300">
                        {t.name}
                      </p>
                      <p className="text-xs font-bold text-text-muted tracking-wide uppercase mt-1">{t.role}</p>
                    </div>
                  </div>

                  {/* Premium line accent */}
                  <div className="w-16 h-[2px] bg-linear-to-r from-transparent via-accent-copper/50 to-transparent scale-0 group-hover:scale-100 transition-transform duration-700 origin-right" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Final CTA ---- */}
      <SectionDivider />
      <section className="py-24 md:py-32 relative overflow-hidden">
        <SectionBackground />

        <div className="relative max-w-6xl mx-auto px-4 text-center z-10">
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
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent-copper text-white font-semibold text-sm rounded-xl glow-primary hover:brightness-110 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            >
              Track a Flight <span>&rarr;</span>
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/60 dark:bg-bg-elevated border border-border-subtle text-text-primary text-sm rounded-xl hover:bg-white dark:hover:bg-bg-card hover:border-accent-copper/15 transition-all duration-300"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
