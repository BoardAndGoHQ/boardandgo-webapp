'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { IconUser, IconLogout, IconMenu, IconX } from './icons';
import { NotificationCenter } from './notification-center';

/* Links swap depending on auth state */
const publicLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

const appLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/track', label: 'Track' },
  { href: '/search', label: 'Flights' },
  { href: '/bookings', label: 'Bookings' },
  { href: '/settings', label: 'Settings' },
];

export function Header() {
  const { user, signOut, loading } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = user ? appLinks : publicLinks;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/') || (href === '/search' && pathname.startsWith('/search'));

  // Scroll-aware header: increase glass effect on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-nav shadow-sm'
          : 'bg-transparent'
      }`}
    >
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
        <nav className="hidden md:flex items-center bg-white/50 dark:bg-bg-elevated/40 border border-black/4 dark:border-border-subtle rounded-full px-1 py-1 backdrop-blur-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200 ${
                isActive(link.href)
                  ? 'text-white bg-accent-blue shadow-sm shadow-accent-blue/25'
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
            <div className="w-20 h-8 bg-black/4 dark:bg-bg-elevated/50 rounded-full animate-shimmer" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 dark:bg-bg-elevated/40 border border-black/4 dark:border-border-subtle rounded-full backdrop-blur-sm">
                <div className="w-6 h-6 rounded-full bg-accent-blue/10 flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-accent-blue">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-[13px] text-text-secondary max-w-35 truncate">
                  {user.email}
                </span>
              </div>
              <button
                onClick={signOut}
                className="p-2 text-text-muted hover:text-text-primary hover:bg-black/4 dark:hover:bg-bg-elevated/50 rounded-full transition-all duration-200"
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
                className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-medium text-white bg-accent-blue rounded-full hover:bg-accent-blue/90 shadow-sm shadow-accent-blue/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
          className="md:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-black/4:hover:bg-bg-elevated/50 rounded-lg transition-colors"
        >
          {mobileOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-nav animate-slide-down">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 text-sm rounded-xl transition-all animate-fade-up opacity-0 ${
                  isActive(link.href)
                    ? 'text-white bg-accent-blue font-medium'
                    : 'text-text-secondary hover:text-text-primary hover:bg-black/3 dark:hover:bg-bg-elevated/50'
                }`}
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border-subtle my-2" />
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 animate-fade-up opacity-0" style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}>
                  <div className="w-7 h-7 rounded-full bg-accent-blue/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-accent-blue">
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
                  className="px-4 py-3 text-sm text-text-secondary text-left rounded-xl hover:bg-black/3 dark:hover:bg-bg-elevated/50 transition-colors animate-fade-up opacity-0"
                  style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-4 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm text-text-secondary text-center rounded-xl hover:bg-black/3 dark:hover:bg-bg-elevated/50 transition-colors animate-fade-up opacity-0"
                  style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm text-white bg-accent-blue text-center font-medium rounded-xl animate-fade-up opacity-0"
                  style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
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
