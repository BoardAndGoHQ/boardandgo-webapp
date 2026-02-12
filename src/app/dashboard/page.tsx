'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { api, type TrackedFlight, type FlightStatusEvent, type FlightPosition } from '@/lib/api';
import { FlightMap } from '@/components/flight-map';
import { StatusBadge } from '@/components/flight-tracker';
import {
  IconLoader,
  IconPlane,
  IconSignal,
  IconClock,
  IconMapPin,
  IconArrowRight,
  IconMail,
} from '@/components/icons';

type FlightWithEvents = TrackedFlight & { statusEvents: FlightStatusEvent[] };

function formatTime(iso: string | null) {
  if (!iso) return '--:--';
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function timeUntil(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return 'Now';
  const hours = Math.floor(diff / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  const [flights, setFlights] = useState<FlightWithEvents[]>([]);
  const [positions, setPositions] = useState<FlightPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Gmail connect state
  const [gmailConnecting, setGmailConnecting] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailDismissed, setGmailDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('boardandgo_gmail_dismissed') === '1';
  });

  const handleConnectGmail = async () => {
    if (!token) return;
    setGmailConnecting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gmail/authorize`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      const popup = window.open(data.authUrl, 'gmail-auth', 'width=600,height=700,popup=yes');
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          setGmailConnecting(false);
          setGmailConnected(true);
        }
      }, 1000);
    } catch {
      setGmailConnecting(false);
    }
  };

  const dismissGmail = () => {
    setGmailDismissed(true);
    localStorage.setItem('boardandgo_gmail_dismissed', '1');
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (token) {
      api.tracking
        .myFlights(token)
        .then(({ flights: f }) => setFlights(f))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, token, router]);

  // Poll live positions every 30 seconds for active flights
  useEffect(() => {
    if (!token || flights.length === 0) return;
    const hasActive = flights.some((f) => f.flightStatus === 'active');
    if (!hasActive) return;

    const fetchPositions = () => {
      api.tracking.positions(token).then(({ positions: p }) => setPositions(p)).catch(() => {});
    };

    fetchPositions(); // Initial fetch
    const interval = setInterval(fetchPositions, 30_000); // Every 30s
    return () => clearInterval(interval);
  }, [token, flights]);

  const selectedFlight = flights.find((f) => f.id === selectedId) ?? null;

  // Stats
  const activeCount = flights.filter((f) => f.flightStatus === 'active').length;
  const scheduledCount = flights.filter((f) => f.flightStatus === 'scheduled').length;
  const totalCount = flights.length;

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <IconLoader className="w-6 h-6 text-text-muted animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header bar */}
      <div className="px-4 md:px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-text-primary flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-accent-teal/10 flex items-center justify-center">
                <IconSignal className="w-5 h-5 text-accent-teal" />
              </div>
              Flight Dashboard
            </h1>
            <p className="text-sm text-text-muted mt-1 ml-12">
              Real-time tracking and visualization
            </p>
          </div>
          <Link
            href="/track"
            className="flex items-center gap-2 px-4 py-2 bg-accent-teal text-bg-primary text-sm font-medium rounded-xl hover:brightness-110 transition-all"
          >
            <IconPlane className="w-4 h-4" />
            Track Flight
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-4 md:px-6 mb-5">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-3 md:gap-4">
          <div className="glass-card rounded-xl p-4 border border-border-subtle">
            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Active</div>
            <div className="text-2xl font-bold text-accent-teal">{activeCount}</div>
          </div>
          <div className="glass-card rounded-xl p-4 border border-border-subtle">
            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Scheduled</div>
            <div className="text-2xl font-bold text-accent-amber">{scheduledCount}</div>
          </div>
          <div className="glass-card rounded-xl p-4 border border-border-subtle">
            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Total Tracked</div>
            <div className="text-2xl font-bold text-text-primary">{totalCount}</div>
          </div>
        </div>
      </div>

      {/* Gmail Connect Card */}
      {!gmailDismissed && !gmailConnected && (
        <div className="px-4 md:px-6 mb-5">
          <div className="max-w-7xl mx-auto">
            <div className="glass-card rounded-xl p-4 border border-accent-teal/20 bg-accent-teal/[0.03] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                <IconMail className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-text-primary">Connect Gmail to auto-import flights</h3>
                <p className="text-xs text-text-muted mt-0.5">We&apos;ll scan for booking confirmations and add them to your dashboard automatically.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleConnectGmail}
                  disabled={gmailConnecting}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-teal text-bg-primary text-xs font-medium rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {gmailConnecting ? (
                    <><IconLoader className="w-3.5 h-3.5 animate-spin" /> Connecting...</>
                  ) : (
                    <><IconMail className="w-3.5 h-3.5" /> Connect Gmail</>
                  )}
                </button>
                <button
                  onClick={dismissGmail}
                  className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-elevated/50 transition-colors"
                  title="Dismiss"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {gmailConnected && (
        <div className="px-4 md:px-6 mb-5">
          <div className="max-w-7xl mx-auto">
            <div className="glass-card rounded-xl p-4 border border-emerald-500/20 bg-emerald-500/[0.03] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <p className="text-sm text-emerald-400 font-medium">Gmail connected! Your booking emails will be imported automatically.</p>
            </div>
          </div>
        </div>
      )}

      {/* Main content: Map + sidebar */}
      <div className="px-4 md:px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="h-[500px] flex items-center justify-center bg-bg-elevated/30 border border-border-subtle rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <IconLoader className="w-6 h-6 text-text-muted animate-spin" />
                <p className="text-sm text-text-muted">Loading your flights...</p>
              </div>
            </div>
          ) : flights.length === 0 ? (
            <div className="h-[500px] flex items-center justify-center bg-bg-elevated/30 border border-border-subtle rounded-xl">
              <div className="text-center">
                <IconPlane className="w-12 h-12 text-text-muted/20 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">No flights being tracked</h3>
                <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">
                  Search for any flight by number and start tracking with one click to see it visualized here.
                </p>
                <Link
                  href="/track"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent-teal text-bg-primary font-medium text-sm rounded-xl hover:brightness-110 transition-all"
                >
                  <IconPlane className="w-4 h-4" />
                  Track Your First Flight
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Map */}
              <div className="flex-1 min-w-0">
                <div className="glass-card rounded-xl border border-border-subtle overflow-hidden">
                  <FlightMap
                    flights={flights}
                    positions={positions}
                    selectedFlightId={selectedId}
                    onSelectFlight={setSelectedId}
                    className="h-[400px] md:h-[520px]"
                  />
                </div>
              </div>

              {/* Flight sidebar */}
              <div className="lg:w-80 xl:w-96 flex flex-col gap-3">
                {/* Selected flight detail */}
                {selectedFlight && (
                  <div className="glass-card rounded-xl p-5 border border-accent-teal/20 animate-in fade-in slide-in-from-right-2 duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <IconPlane className="w-4 h-4 text-accent-teal" />
                        <span className="text-base font-semibold text-text-primary">
                          {selectedFlight.airlineCode}{selectedFlight.flightNumber}
                        </span>
                      </div>
                      <StatusBadge status={selectedFlight.flightStatus} />
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-center flex-1">
                        <div className="text-xl font-bold text-text-primary">{selectedFlight.departureAirport}</div>
                        <div className="text-xs text-text-muted">{formatTime(selectedFlight.actualDeparture ?? selectedFlight.estimatedDeparture ?? selectedFlight.scheduledDeparture)}</div>
                        {selectedFlight.departureGate && (
                          <div className="text-xs text-accent-teal">Gate {selectedFlight.departureGate}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-text-muted">
                        <div className="w-6 h-px bg-border-subtle" />
                        <IconPlane className="w-3 h-3 -rotate-90" />
                        <div className="w-6 h-px bg-border-subtle" />
                      </div>
                      <div className="text-center flex-1">
                        <div className="text-xl font-bold text-text-primary">{selectedFlight.arrivalAirport}</div>
                        <div className="text-xs text-text-muted">{formatTime(selectedFlight.actualArrival ?? selectedFlight.estimatedArrival ?? selectedFlight.scheduledArrival)}</div>
                        {selectedFlight.arrivalGate && (
                          <div className="text-xs text-accent-teal">Gate {selectedFlight.arrivalGate}</div>
                        )}
                      </div>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-bg-elevated/50 rounded-lg p-2.5">
                        <div className="text-text-muted mb-0.5">Date</div>
                        <div className="text-text-primary font-medium">{formatDate(selectedFlight.scheduledDeparture)}</div>
                      </div>
                      <div className="bg-bg-elevated/50 rounded-lg p-2.5">
                        <div className="text-text-muted mb-0.5">Duration</div>
                        <div className="text-text-primary font-medium">
                          {selectedFlight.durationMinutes
                            ? `${Math.floor(selectedFlight.durationMinutes / 60)}h ${selectedFlight.durationMinutes % 60}m`
                            : '—'}
                        </div>
                      </div>
                      {selectedFlight.departureDelayMinutes > 0 && (
                        <div className="col-span-2 bg-amber-500/10 rounded-lg p-2.5">
                          <div className="text-amber-400 font-medium">
                            Delayed +{selectedFlight.departureDelayMinutes}min
                          </div>
                        </div>
                      )}
                      {selectedFlight.aircraftType && (
                        <div className="col-span-2 bg-bg-elevated/50 rounded-lg p-2.5">
                          <div className="text-text-muted mb-0.5">Aircraft</div>
                          <div className="text-text-primary font-medium">{selectedFlight.aircraftType}</div>
                        </div>
                      )}
                    </div>

                    {/* View full tracking */}
                    <Link
                      href={`/bookings/${selectedFlight.bookingId}/track`}
                      className="mt-4 flex items-center justify-center gap-2 w-full py-2 text-xs font-medium text-accent-teal bg-accent-teal/10 rounded-lg hover:bg-accent-teal/15 transition-colors"
                    >
                      View Full Tracking
                      <IconArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}

                {/* Flight list */}
                <div className="flex-1 min-h-0">
                  <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 px-1">
                    {flights.length} Flight{flights.length !== 1 ? 's' : ''} Tracked
                  </div>
                  <div className="space-y-2 max-h-[380px] overflow-y-auto scrollbar-thin pr-1">
                    {flights.map((flight) => {
                      const isSelected = flight.id === selectedId;
                      const depTime = flight.actualDeparture ?? flight.estimatedDeparture ?? flight.scheduledDeparture;
                      return (
                        <button
                          key={flight.id}
                          onClick={() => setSelectedId(isSelected ? null : flight.id)}
                          className={`w-full text-left glass-card rounded-xl p-3.5 border transition-all duration-150 ${
                            isSelected
                              ? 'border-accent-teal/40 bg-accent-teal/5'
                              : 'border-border-subtle hover:border-accent-teal/20'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <IconPlane className={`w-3.5 h-3.5 ${isSelected ? 'text-accent-teal' : 'text-text-muted'}`} />
                              <span className="text-sm font-semibold text-text-primary">
                                {flight.airlineCode}{flight.flightNumber}
                              </span>
                            </div>
                            <StatusBadge status={flight.flightStatus} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-text-secondary">
                              <IconMapPin className="w-3 h-3 text-text-muted" />
                              {flight.departureAirport}
                              <span className="text-text-muted">→</span>
                              {flight.arrivalAirport}
                            </div>
                            <div className="flex items-center gap-1 text-text-muted">
                              <IconClock className="w-3 h-3" />
                              {flight.flightStatus === 'scheduled'
                                ? timeUntil(depTime)
                                : formatTime(depTime)}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
