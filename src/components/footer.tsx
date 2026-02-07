import Link from 'next/link';
import { IconPlane } from './icons';

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-secondary">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-text-primary font-semibold text-lg mb-4">
              <IconPlane className="w-6 h-6 text-accent-teal" />
              <span>BoardAndGo</span>
            </Link>
            <p className="text-sm text-text-muted max-w-sm leading-relaxed">
              End-to-end travel management. Search flights, sync your Gmail for automatic booking detection, and keep all your trips organized in one place.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-primary mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-text-muted hover:text-text-secondary transition-colors">
                  Flight Search
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="text-sm text-text-muted hover:text-text-secondary transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-primary mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-text-muted hover:text-text-secondary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-text-muted hover:text-text-secondary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-subtle mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
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
