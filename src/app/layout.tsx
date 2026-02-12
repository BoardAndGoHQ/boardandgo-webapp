import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { ConditionalFooter } from '@/components/conditional-footer';
import { ScrollToTop } from '@/components/scroll-to-top';
import { AuthProvider } from '@/context/auth';

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
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
          <ScrollToTop />
        </AuthProvider>
      </body>
    </html>
  );
}

