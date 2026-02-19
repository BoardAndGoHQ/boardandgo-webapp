import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { ConditionalFooter } from '@/components/conditional-footer';
import { ScrollToTop } from '@/components/scroll-to-top';
import { AuthProvider } from '@/context/auth';
import { ConciergeWidget } from '@/components/concierge-widget';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BoardAndGo | Flight Intelligence Platform',
  description: 'Real-time flight tracking, delay alerts, gate changes, and cross-airline intelligence. Your flight, fully handled.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} light`}>
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
        {/* Global decorative gradient blobs */}
        <div aria-hidden="true" className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -left-40 w-175 h-175 rounded-full bg-[radial-gradient(circle,rgba(15,115,247,0.10)_0%,transparent_70%)] animate-drift" />
          <div className="absolute top-1/3 -right-32 w-125 h-125 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)] animate-drift-reverse" />
          <div className="absolute -bottom-40 left-1/3 w-150 h-150 rounded-full bg-[radial-gradient(circle,rgba(15,115,247,0.06)_0%,transparent_70%)] animate-drift" />
        </div>
        <AuthProvider>
          <Header />
          <main className="flex-1 relative z-10">{children}</main>
          <ConditionalFooter />
          <ScrollToTop />
          <ConciergeWidget />
        </AuthProvider>
      </body>
    </html>
  );
}

