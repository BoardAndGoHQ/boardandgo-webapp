import Link from 'next/link';
import { IconPlane } from './icons';

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
    <footer className="border-t border-border-subtle bg-bg-secondary">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Logo & contact */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 text-text-primary font-semibold text-lg mb-4">
              <IconPlane className="w-6 h-6 text-accent-teal" />
              <span>BoardAndGo</span>
            </Link>
            <p className="text-sm text-text-muted max-w-sm leading-relaxed mb-4">
              AI Agents that handle your travel for you, so you can just Board-and-Go.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:contact@boardandgo.com"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                contact@boardandgo.com
              </a>
              <a
                href="https://www.linkedin.com/company/boardandgo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                Follow us on LinkedIn
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border-subtle mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            2026 BoardAndGo. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Flight data powered by airline partners. Prices may vary.
          </p>
        </div>
      </div>
    </footer>
  );
}
