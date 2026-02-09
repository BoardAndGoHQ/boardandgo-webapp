'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { IconUser, IconLogout, IconMenu, IconX } from './icons';

/* Links swap depending on auth state */
const publicLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

const appLinks = [
  { href: '/search', label: 'Search' },
  { href: '/bookings', label: 'Bookings' },
  { href: '/settings', label: 'Settings' },
];

export function Header() {
  const { user, signOut, loading } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = user ? appLinks : publicLinks;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/') || (href === '/search' && pathname.startsWith('/search'));

  return (
    <header className="sticky top-0 z-50 glass border-b border-border-subtle">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-text-primary font-semibold text-lg tracking-tight">
          <Image src="/logo.svg" alt="BoardAndGo" width={24} height={34} className="w-6 h-auto" />
          <span>BoardAndGo</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                isActive(link.href)
                  ? 'text-text-primary bg-bg-elevated'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-20 h-8 bg-bg-elevated rounded animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">{user.email}</span>
              <button
                onClick={signOut}
                className="p-2 text-text-muted hover:text-text-primary transition-colors"
                title="Sign out"
              >
                <IconLogout className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 px-4 py-2 text-sm text-bg-primary bg-accent-teal rounded-lg hover:bg-accent-teal/90 transition-colors"
              >
                <IconUser className="w-4 h-4" />
                Get Started
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-text-secondary hover:text-text-primary"
        >
          {mobileOpen ? <IconX className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border-subtle bg-bg-secondary">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 text-sm rounded-lg ${
                  isActive(link.href)
                    ? 'text-text-primary bg-bg-elevated'
                    : 'text-text-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border-subtle my-2" />
            {user ? (
              <>
                <span className="px-4 py-2 text-sm text-text-secondary">{user.email}</span>
                <button
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                  className="px-4 py-3 text-sm text-text-secondary text-left"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm text-text-secondary"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm text-accent-teal font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
