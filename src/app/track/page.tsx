'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { api, type FlightLookupResult, type TrackedFlight, type FlightStatusEvent, type FlightPosition } from '@/lib/api';
import { FlightStatusCard } from '@/components/flight-tracker';
import { FlightCard } from '@/components/flight-card';
import { FlightDetailDrawer } from '@/components/flight-detail-drawer';
import { Search as IconSearch, Loader2 as IconLoader, Plane as IconPlane, Radio as IconSignal, ArrowRight as IconArrowRight } from 'lucide-react';
import { trackEvent } from '@/lib/events';

export default function TrackFlightPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  // Search state
  const [flightInput, setFlightInput] = useState('');
  const [date, setDate] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Result state
  const [lookupResult, setLookupResult] = useState<FlightLookupResult | null>(null);
  const [parsedCarrier, setParsedCarrier] = useState('');
  const [parsedNumber, setParsedNumber] = useState('');

  // Tracking state
  const [tracking, setTracking] = useState(false);
  const [trackedFlight, setTrackedFlight] = useState<(TrackedFlight & { statusEvents: FlightStatusEvent[] }) | null>(null);

  // My tracked flights
  const [myFlights, setMyFlights] = useState<(TrackedFlight & { statusEvents: FlightStatusEvent[] })[]>([]);
  const [historyFlights, setHistoryFlights] = useState<(TrackedFlight & { statusEvents: FlightStatusEvent[] })[]>([]);
  const [loadingMyFlights, setLoadingMyFlights] = useState(true);
  const [trackTab, setTrackTab] = useState<'live' | 'history'>('live');

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Expanded card state
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Live position polling
  const [positions, setPositions] = useState<FlightPosition[]>([]);

  // SSE ref
  const eventSourceRef = useRef<EventSource | null>(null);

  const refreshFlights = useCallback(async () => {
    if (!token) return;
    try {
      const [active, history] = await Promise.all([
        api.tracking.myFlights(token, 'active'),
        api.tracking.myFlights(token, 'history'),
      ]);
      setMyFlights(active.flights);
      setHistoryFlights(history.flights);
    } catch {}
  }, [token]);

  useEffect(() => {
    if (authLoading) return;
    // Load tracked flights only if logged in (tracking list requires auth)
    if (user && token) {
      refreshFlights().finally(() => setLoadingMyFlights(false));
      trackEvent('track_page_viewed', undefined, token);
    } else {
      setLoadingMyFlights(false);
    }
  }, [user, authLoading, token, refreshFlights]);

  // Position polling for active flights (every 30s)
  useEffect(() => {
    if (!token || myFlights.length === 0) return;
    const hasActive = myFlights.some((f) => f.flightStatus === 'active');
    if (!hasActive) return;

    const poll = () => {
      api.tracking.positions(token).then(({ positions: p }) => setPositions(p)).catch(() => {});
    };
    poll();
    const interval = setInterval(poll, 30_000);
    return () => clearInterval(interval);
  }, [token, myFlights]);

  // SSE stream for the expanded flight (live status updates)
  useEffect(() => {
    if (!token || !expandedId) {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      return;
    }
    const flight = myFlights.find((f) => f.id === expandedId);
    if (!flight || flight.flightStatus === 'landed' || flight.flightStatus === 'cancelled') return;

    const url = api.tracking.streamUrl(flight.id, token);
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status) {
          setMyFlights((prev) =>
            prev.map((f) => (f.id === data.flightId ? { ...f, flightStatus: data.status } : f))
          );
        }
        // Refresh full data on any event
        refreshFlights();
      } catch {}
    };

    return () => { es.close(); eventSourceRef.current = null; };
  }, [token, expandedId, myFlights, refreshFlights]);

  // Set default date to today
  useEffect(() => {
    setDate(new Date().toISOString().slice(0, 10));
  }, []);

  function parseFlightInput(input: string): { carrier: string; number: string } | null {
    const cleaned = input.trim().toUpperCase().replace(/\s+/g, '');
    // Match patterns like AA100, AA 100, BA2490, QR920
    const match = cleaned.match(/^([A-Z]{2,3})(\d{1,5})$/);
    if (!match) return null;
    return { carrier: match[1]!, number: match[2]! };
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    // Lookup requires auth — prompt login if needed
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent('/track')}`);
      return;
    }

    const parsed = parseFlightInput(flightInput);
    if (!parsed) {
      setSearchError('Enter a valid flight number (e.g. AA100, BA2490, QR920)');
      return;
    }

    setSearching(true);
    setSearchError('');
    setLookupResult(null);
    setTrackedFlight(null);
    setParsedCarrier(parsed.carrier);
    setParsedNumber(parsed.number);

    try {
      const { flight } = await api.tracking.lookup(parsed.carrier, parsed.number, date, token);
      setLookupResult(flight);
    } catch (err: any) {
      setSearchError(err.message || 'Flight not found. Check the airline code, flight number, and date.');
    } finally {
      setSearching(false);
    }
  }

  async function handleTrack() {
    if (!token || !lookupResult) {
      router.push(`/login?redirect=${encodeURIComponent('/track')}`);
      return;
    }

    setTracking(true);
    try {
      const { flight } = await api.tracking.trackStandalone({
        carrierCode: parsedCarrier,
        flightNumber: parsedNumber,
        date,
        departureAirport: lookupResult.departureAirport,
        arrivalAirport: lookupResult.arrivalAirport,
        scheduledDeparture: lookupResult.scheduledDeparture || new Date().toISOString(),
        scheduledArrival: lookupResult.scheduledArrival || new Date().toISOString(),
      }, token);
      setTrackedFlight(flight);
      trackEvent('flight_tracked', { flightNumber: `${parsedCarrier}${parsedNumber}`, departureAirport: lookupResult.departureAirport, arrivalAirport: lookupResult.arrivalAirport }, token);
      // Refresh my flights list
      const { flights } = await api.tracking.myFlights(token, 'active');
      setMyFlights(flights);
    } catch (err: any) {
      setSearchError(err.message || 'Failed to start tracking');
    } finally {
      setTracking(false);
    }
  }

  function handleDelete(flightId: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!token) return;
    setDeletingId(flightId);
    api.tracking.deleteFlight(flightId, token)
      .then(() => {
        setMyFlights((prev) => prev.filter((f) => f.id !== flightId));
        setHistoryFlights((prev) => prev.filter((f) => f.id !== flightId));
        if (expandedId === flightId) setExpandedId(null);
      })
      .catch(() => {})
      .finally(() => setDeletingId(null));
  }

  function handleToggleExpand(flightId: string) {
    setExpandedId((prev) => (prev === flightId ? null : flightId));
  }

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <IconLoader className="w-6 h-6 text-text-muted animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10 md:py-14 relative">
      {/* Decorative */}
      <div className="absolute -top-20 right-0 w-100 h-100 bg-accent-blue/4 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-blue/10 mb-4">
          <IconSignal className="w-7 h-7 text-accent-blue" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Track My Flight</h1>
        <p className="text-text-muted text-sm max-w-md mx-auto">
          Enter a flight number to get real-time status. Start tracking with one click to get proactive alerts.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative mb-10">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <IconPlane className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={flightInput}
              onChange={(e) => { setFlightInput(e.target.value); setSearchError(''); }}
              placeholder="Flight number (e.g. AA100)"
              className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-text-primary placeholder:text-text-muted/50 text-sm"
              autoFocus
            />
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-3 glass-input rounded-xl text-text-primary text-sm sm:w-44"
          />
          <button
            type="submit"
            disabled={searching || !flightInput.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-accent-blue text-white font-semibold text-sm rounded-xl hover:bg-accent-blue/90 transition-all hover:scale-105 glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {searching ? <IconLoader className="w-4 h-4 animate-spin" /> : <IconSearch className="w-4 h-4" />}
            {searching ? 'Searching...' : 'Look Up'}
          </button>
        </div>
        {searchError && (
          <p className="mt-3 text-sm text-red-400">{searchError}</p>
        )}
      </form>

      {/* Lookup Result */}
      {lookupResult && !trackedFlight && (
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="glass-card rounded-xl p-6 border border-border-subtle">
            {/* Flight header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center">
                  <IconPlane className="w-5 h-5 text-accent-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{parsedCarrier}{parsedNumber}</h3>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                    lookupResult.status === 'landed' ? 'bg-emerald-500/10 text-emerald-400' :
                    lookupResult.status === 'active' ? 'bg-blue-500/10 text-blue-400' :
                    lookupResult.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      lookupResult.status === 'landed' ? 'bg-emerald-400' :
                      lookupResult.status === 'active' ? 'bg-blue-400 animate-pulse' :
                      lookupResult.status === 'cancelled' ? 'bg-red-400' :
                      'bg-amber-400'
                    }`} />
                    {lookupResult.status.charAt(0).toUpperCase() + lookupResult.status.slice(1)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleTrack}
                disabled={tracking}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent-blue text-white font-medium text-sm rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
              >
                {tracking ? <IconLoader className="w-4 h-4 animate-spin" /> : <IconSignal className="w-4 h-4" />}
                {tracking ? 'Starting...' : 'Track This Flight'}
              </button>
            </div>

            {/* Route */}
            <div className="flex items-center gap-4 mb-5">
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">{lookupResult.departureAirport}</div>
                {lookupResult.departureTerminal && <div className="text-xs text-text-muted">T{lookupResult.departureTerminal}</div>}
                {lookupResult.departureGate && <div className="text-xs text-accent-blue">Gate {lookupResult.departureGate}</div>}
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-px bg-border-subtle" />
                <IconPlane className="w-4 h-4 text-text-muted -rotate-90" />
                <div className="flex-1 h-px bg-border-subtle" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">{lookupResult.arrivalAirport}</div>
                {lookupResult.arrivalTerminal && <div className="text-xs text-text-muted">T{lookupResult.arrivalTerminal}</div>}
                {lookupResult.arrivalGate && <div className="text-xs text-accent-blue">Gate {lookupResult.arrivalGate}</div>}
              </div>
            </div>

            {/* Times */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-bg-elevated/50 rounded-lg p-3">
                <div className="text-text-muted text-xs mb-1">Departure</div>
                <div className="text-text-primary font-medium">
                  {lookupResult.scheduledDeparture ? new Date(lookupResult.scheduledDeparture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                </div>
                {lookupResult.departureDelayMinutes > 0 && (
                  <div className="text-xs text-amber-400 mt-0.5">+{lookupResult.departureDelayMinutes}min delay</div>
                )}
              </div>
              <div className="bg-bg-elevated/50 rounded-lg p-3">
                <div className="text-text-muted text-xs mb-1">Arrival</div>
                <div className="text-text-primary font-medium">
                  {lookupResult.scheduledArrival ? new Date(lookupResult.scheduledArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                </div>
                {lookupResult.durationMinutes && (
                  <div className="text-xs text-text-muted mt-0.5">{Math.floor(lookupResult.durationMinutes / 60)}h {lookupResult.durationMinutes % 60}m</div>
                )}
              </div>
            </div>

            {lookupResult.aircraftType && (
              <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
                <span>Aircraft: {lookupResult.aircraftType}</span>
                {lookupResult.aircraftRegistration && <span>Reg: {lookupResult.aircraftRegistration}</span>}
                {lookupResult.airlineName && <span>{lookupResult.airlineName}</span>}
                {lookupResult.source && (
                  <span className="ml-auto px-1.5 py-0.5 rounded bg-bg-elevated text-text-muted/60 text-[10px] uppercase tracking-wider">{lookupResult.source}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Just tracked — success state */}
      {trackedFlight && (
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mb-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <IconSignal className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-400">Tracking started!</p>
              <p className="text-xs text-text-muted">You&apos;ll get alerts for delays, cancellations, and gate changes.</p>
            </div>
          </div>
          <FlightStatusCard flight={trackedFlight} />
        </div>
      )}

      {/* My Tracked Flights */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <IconSignal className="w-5 h-5 text-accent-blue" />
          My Tracked Flights
        </h2>

        {/* Live / History Tabs */}
        <div className="flex items-center gap-1 mb-4 bg-bg-elevated/50 rounded-lg p-1">
          <button
            onClick={() => setTrackTab('live')}
            className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors ${
              trackTab === 'live'
                ? 'bg-accent-blue/10 text-accent-blue'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Live ({myFlights.length})
          </button>
          <button
            onClick={() => setTrackTab('history')}
            className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors ${
              trackTab === 'history'
                ? 'bg-accent-blue/10 text-accent-blue'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            History ({historyFlights.length})
          </button>
        </div>

        {loadingMyFlights ? (
          <div className="flex items-center justify-center py-12">
            <IconLoader className="w-5 h-5 text-text-muted animate-spin" />
          </div>
        ) : (() => {
          const displayFlights = trackTab === 'live' ? myFlights : historyFlights;
          if (displayFlights.length === 0) {
            return (
              <div className="text-center py-12 bg-bg-elevated/30 border border-border-subtle rounded-xl">
                <IconPlane className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
                <p className="text-sm text-text-muted">
                  {trackTab === 'live' ? 'No active flights being tracked.' : 'No completed flights yet.'}
                </p>
                {trackTab === 'live' && (
                  <p className="text-xs text-text-muted/70 mt-1">Search for a flight above to start tracking.</p>
                )}
              </div>
            );
          }
          return (
            <div className="space-y-3">
              {displayFlights.map((flight) => (
                <div key={flight.id}>
                  <FlightCard
                    flight={flight}
                    isExpanded={expandedId === flight.id}
                    onToggle={() => handleToggleExpand(flight.id)}
                    onDelete={handleDelete}
                    isDeleting={deletingId === flight.id}
                  />
                  {/* Expandable detail drawer */}
                  {expandedId === flight.id && token && (
                    <div className="glass-card rounded-b-2xl border border-t-0 border-border-subtle -mt-2 pt-2">
                      <FlightDetailDrawer
                        flight={flight}
                        token={token}
                        positions={positions}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
