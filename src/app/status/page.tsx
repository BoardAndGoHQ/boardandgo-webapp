'use client';

import { Activity, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const services = [
  { name: 'Flight Tracking', status: 'operational' as const, uptime: 99.98 },
  { name: 'AI Voice Calling', status: 'operational' as const, uptime: 99.95 },
  { name: 'Real-time Updates', status: 'operational' as const, uptime: 99.99 },
  { name: 'Mobile App', status: 'operational' as const, uptime: 99.97 },
  { name: 'Authentication', status: 'operational' as const, uptime: 100 },
  { name: 'Payment Processing', status: 'operational' as const, uptime: 99.99 },
];

const statusConfig = {
  operational: { color: 'bg-emerald-500', text: 'text-emerald-600', label: 'Operational', icon: CheckCircle },
  degraded: { color: 'bg-amber-500', text: 'text-amber-600', label: 'Degraded', icon: AlertTriangle },
  outage: { color: 'bg-red-500', text: 'text-red-600', label: 'Outage', icon: XCircle },
};

export default function StatusPage() {
  const heroRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();
  const historyRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="flex flex-col">
      {/* ═══ Hero ═══ */}
      <section className="relative pt-20 md:pt-28 pb-16 overflow-hidden">
        <div className="absolute top-16 left-1/4 w-[380px] h-[380px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-drift" />

        <div ref={heroRef} className="scroll-reveal max-w-6xl mx-auto px-5 text-center space-y-6">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs font-medium text-emerald-600">
            <Activity className="w-3.5 h-3.5" />
            All Systems Operational
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary leading-tight">
            System Status
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Track the performance and availability of BoardAndGo&apos;s services in real-time.
          </p>
        </div>
      </section>

      {/* ═══ Status Grid ═══ */}
      <section className="py-12 md:py-20">
        <div ref={gridRef} className="scroll-reveal max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {services.map((s, i) => {
              const cfg = statusConfig[s.status];
              const Icon = cfg.icon;
              return (
                <div
                  key={s.name}
                  className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-text-primary">{s.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${cfg.color} animate-pulse`} />
                      <span className={`text-sm font-medium ${cfg.text}`}>{cfg.label}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-blue to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${s.uptime}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-text-muted">Uptime (30d)</p>
                    <p className="text-xs font-semibold text-text-secondary">{s.uptime}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Incident History ═══ */}
      <section className="py-16 md:py-24 bg-bg-secondary/50">
        <div ref={historyRef} className="scroll-reveal max-w-6xl mx-auto px-5">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-accent-blue" />
            <h2 className="text-2xl font-bold text-text-primary">Past Incidents</h2>
          </div>
          <div className="glass-card rounded-2xl p-8">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4">
                <CheckCircle className="w-7 h-7" />
              </div>
              <p className="text-text-secondary font-medium">No incidents reported in the last 90 days.</p>
              <p className="text-text-muted text-sm mt-1">All systems have been running smoothly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
