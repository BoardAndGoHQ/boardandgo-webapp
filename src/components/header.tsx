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
    <header className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.svg"
            alt="BoardAndGo"
            width={24}
            height={34}
            className="w-6 h-auto transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-text-primary font-semibold text-base tracking-tight">
            BoardAndGo
          </span>
        </Link>

        {/* Desktop Nav — pill-style links */}
        <nav className="hidden md:flex items-center bg-bg-elevated/40 border border-border-subtle rounded-full px-1 py-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200 ${
                isActive(link.href)
                  ? 'text-bg-primary bg-accent-teal shadow-sm shadow-accent-teal/25'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-2">
          {loading ? (
            <div className="w-20 h-8 bg-bg-elevated/50 rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-elevated/40 border border-border-subtle rounded-full">
                <div className="w-6 h-6 rounded-full bg-accent-teal/15 flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-accent-teal">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-[13px] text-text-secondary max-w-[140px] truncate">
                  {user.email}
                </span>
              </div>
              <button
                onClick={signOut}
                className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-elevated/50 rounded-full transition-all duration-200"
                title="Sign out"
              >
                <IconLogout className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-1.5 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-medium text-bg-primary bg-accent-teal rounded-full hover:brightness-110 shadow-sm shadow-accent-teal/25 transition-all duration-200"
              >
                <IconUser className="w-3.5 h-3.5" />
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50 rounded-lg transition-colors"
        >
          {mobileOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border-subtle bg-bg-primary/95 backdrop-blur-xl">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 text-sm rounded-xl transition-all ${
                  isActive(link.href)
                    ? 'text-bg-primary bg-accent-teal font-medium'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border-subtle my-2" />
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2">
                  <div className="w-7 h-7 rounded-full bg-accent-teal/15 flex items-center justify-center">
                    <span className="text-xs font-semibold text-accent-teal">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-text-secondary truncate">{user.email}</span>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                  className="px-4 py-3 text-sm text-text-secondary text-left rounded-xl hover:bg-bg-elevated/50 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-4 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm text-text-secondary text-center rounded-xl hover:bg-bg-elevated/50 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm text-bg-primary bg-accent-teal text-center font-medium rounded-xl"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
