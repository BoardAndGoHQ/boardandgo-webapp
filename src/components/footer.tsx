import Link from 'next/link';
import Image from 'next/image';
import { Mail, Linkedin, Radar, Signal } from 'lucide-react';

const footerSections = [
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Help',
    links: [
      { name: 'Support', href: '/support' },
      { name: 'Status', href: '/status' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Terms & Conditions', href: '/legal/terms' },
      { name: 'Privacy Policy', href: '/legal/privacy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-accent-copper/20 bg-bg-primary">
      {/* Subtle radar background shimmer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border border-accent-copper/10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full border border-accent-copper/10 border-dashed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-full h-[1px] bg-accent-copper/5 top-1/2" />
        <div className="absolute w-[1px] h-full bg-accent-copper/5 left-1/2" />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-16 pb-8">
        {/* Top CTA Banner */}
        <div className="relative rounded-[2rem] bg-linear-to-r from-accent-copper/10 via-accent-copper/5 to-transparent border border-accent-copper/20 p-8 md:p-12 mb-16 overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent-copper/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-accent-copper/20 transition-colors duration-700" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight mb-2">
                Ready for Takeoff?
              </h3>
              <p className="text-text-muted text-sm md:text-base font-medium max-w-md">
                Join thousands of travelers who never worry about disruptions again.
              </p>
            </div>
            <Link
              href="/track"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-accent-copper text-white font-bold text-sm tracking-wide uppercase rounded-xl glow-neon hover:brightness-110 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <Signal className="w-4 h-4 animate-pulse" />
              Initialize Radar
            </Link>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-8">
          {/* Logo & contact */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 text-text-primary font-black text-lg mb-5 group">
              <div className="w-8 h-8 rounded-xl bg-accent-copper/10 border border-accent-copper/20 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(160,67,10,0.3)] transition-all duration-300">
                <Image src="/logo.svg" alt="BoardAndGo" width={20} height={28} className="w-5 h-auto" />
              </div>
              <span className="tracking-tight">BoardAndGo</span>
            </Link>
            <p className="text-sm text-text-muted max-w-xs leading-relaxed mb-6 font-medium">
              AI Agents that handle your travel for you, so you can just Board-and-Go.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:contact@boardandgo.com"
                className="flex items-center gap-3 text-sm text-text-muted hover:text-accent-copper transition-all duration-300 group/link w-fit"
              >
                <div className="w-8 h-8 rounded-lg bg-accent-copper/5 border border-accent-copper/10 flex items-center justify-center group-hover/link:bg-accent-copper/15 group-hover/link:border-accent-copper/30 transition-all duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-medium">contact@boardandgo.com</span>
              </a>
              <a
                href="https://www.linkedin.com/company/boardandgo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-text-muted hover:text-accent-copper transition-all duration-300 group/link w-fit"
              >
                <div className="w-8 h-8 rounded-lg bg-accent-copper/5 border border-accent-copper/10 flex items-center justify-center group-hover/link:bg-accent-copper/15 group-hover/link:border-accent-copper/30 transition-all duration-300">
                  <Linkedin className="w-4 h-4" />
                </div>
                <span className="font-medium">Follow us on LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-accent-copper/80 mb-5">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-accent-copper hover:translate-x-1 transition-all duration-300 inline-block font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-accent-copper/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">

              </div>
              <span className="text-text-muted/30 hidden md:inline">|</span>
              <p className="text-xs text-text-muted font-medium hidden md:block">
                © 2026 BoardAndGo. All rights reserved.
              </p>
            </div>
            <p className="text-xs text-text-muted font-medium text-center md:text-right">
              Flight data powered by airline partners. Prices may vary.
            </p>
            <p className="text-xs text-text-muted font-medium md:hidden">
              © 2026 BoardAndGo. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer >
  );
}
