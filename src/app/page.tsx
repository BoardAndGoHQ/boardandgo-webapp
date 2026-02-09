import Link from 'next/link';
import { IconMail, IconPlane, IconCheck, IconSparkles, IconSearch } from '@/components/icons';

const features = [
  {
    icon: IconPlane,
    title: 'Real-time flight search',
    desc: 'Compare prices across airlines instantly',
  },
  {
    icon: IconMail,
    title: 'Gmail sync',
    desc: 'Auto-import bookings from your inbox',
  },
  {
    icon: IconCheck,
    title: 'Centralized dashboard',
    desc: 'All your trips in one place',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-16 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-bg-secondary/50 to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-teal/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-amber/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-14">
            <h1 className="text-3xl md:text-5xl font-semibold text-text-primary tracking-tight mb-4 leading-tight">
              Book your next flight
              <br />
              <span className="text-text-secondary">without the noise</span>
            </h1>
            <p className="text-text-muted text-base md:text-lg max-w-lg mx-auto mb-8">
              Search flights, sync bookings from Gmail, and manage all your travel in one clean interface.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent-teal text-bg-primary font-medium text-sm rounded-lg hover:bg-accent-teal/90 transition-colors"
              >
                <IconSearch className="w-4 h-4" />
                Search Flights
              </Link>
              <Link
                href="/search?mode=ai"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-bg-elevated border border-border-subtle text-text-primary font-medium text-sm rounded-lg hover:bg-bg-card transition-colors"
              >
                <IconSparkles className="w-4 h-4 text-accent-teal" />
                Try AI Search
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((f) => (
              <div key={f.title} className="group p-6 rounded-xl border border-border-subtle bg-bg-secondary/50 hover:bg-bg-card/50 transition-colors">
                <f.icon className="w-6 h-6 text-accent-teal mb-4" />
                <h3 className="text-sm font-medium text-text-primary mb-1">{f.title}</h3>
                <p className="text-sm text-text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-border-subtle bg-bg-secondary/30">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-text-primary mb-3">
            Ready to simplify your travel?
          </h2>
          <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">
            Create an account to save searches, sync your Gmail, and never lose a booking confirmation again.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-teal text-bg-primary font-medium text-sm rounded-lg hover:bg-accent-teal/90 transition-colors"
          >
            Get started free
          </Link>
        </div>
      </section>
    </div>
  );
}

