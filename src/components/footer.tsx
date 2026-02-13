import Link from 'next/link';
import Image from 'next/image';
import { Mail, Linkedin } from 'lucide-react';

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
    <footer className="border-t border-border-subtle bg-white dark:bg-bg-secondary">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Logo & contact */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 text-text-primary font-semibold text-lg mb-4">
              <Image src="/logo.svg" alt="BoardAndGo" width={24} height={34} className="w-6 h-auto" />
              <span>BoardAndGo</span>
            </Link>
            <p className="text-sm text-text-muted max-w-sm leading-relaxed mb-4">
              AI Agents that handle your travel for you, so you can just Board-and-Go.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:contact@boardandgo.com"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-blue transition-colors"
              >
                <Mail className="w-4 h-4" />
                contact@boardandgo.com
              </a>
              <a
                href="https://www.linkedin.com/company/boardandgo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-blue transition-colors"
              >
                <Linkedin className="w-4 h-4" />
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
                      className="text-sm text-text-muted hover:text-accent-blue transition-colors"
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
