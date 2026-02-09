import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Status | BoardAndGo',
  description: "Check the current status of BoardAndGo's services and systems.",
};

const services = [
  { name: 'Flight Tracking', status: 'operational' as const, uptime: 99.98 },
  { name: 'AI Voice Calling', status: 'operational' as const, uptime: 99.95 },
  { name: 'Real-time Updates', status: 'operational' as const, uptime: 99.99 },
  { name: 'Mobile App', status: 'operational' as const, uptime: 99.97 },
  { name: 'Authentication', status: 'operational' as const, uptime: 100 },
  { name: 'Payment Processing', status: 'operational' as const, uptime: 99.99 },
];

const statusColors = {
  operational: 'bg-green-500',
  degraded: 'bg-yellow-500',
  outage: 'bg-red-500',
};

export default function StatusPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative pt-16 md:pt-24 pb-12 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">
            System Status
            <span className="gradient-text block mt-2">All Systems Operational</span>
          </h1>
          <p className="text-lg text-text-muted max-w-3xl mx-auto">
            Track the performance and availability of BoardAndGo&apos;s services in real-time.
          </p>
        </div>
      </section>

      {/* Status Grid */}
      <section className="py-10 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s) => (
              <div key={s.name} className="glass-effect rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text-primary">{s.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${statusColors[s.status]} animate-pulse`} />
                    <span className="text-sm text-text-secondary capitalize">{s.status}</span>
                  </div>
                </div>
                <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-teal rounded-full transition-all duration-500"
                    style={{ width: `${s.uptime}%` }}
                  />
                </div>
                <p className="text-xs text-text-muted mt-2">{s.uptime}% uptime last 30 days</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Incident History */}
      <section className="py-10 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">Past Incidents</h2>
          <div className="glass-effect rounded-xl p-6">
            <p className="text-text-muted text-center py-8 text-sm">
              No incidents reported in the last 90 days.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
