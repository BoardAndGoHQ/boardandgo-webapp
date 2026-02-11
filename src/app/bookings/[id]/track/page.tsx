'use client';

import { useEffect, useState, useCallback, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { api, type TrackedFlight, type FlightStatusEvent, type FlightPosition } from '@/lib/api';
import { FlightMap, type AirportCoord, type MapViewMode } from '@/components/flight-map';
import { FlightInfoPanel } from '@/components/flight-info-panel';
import { IconLoader, IconShare, IconCopy, IconArrowRight } from '@/components/icons';

type FlightWithEvents = TrackedFlight & { statusEvents: FlightStatusEvent[] };

export default function TrackFlightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  const [flights, setFlights] = useState<FlightWithEvents[]>([]);
  const [positions, setPositions] = useState<FlightPosition[]>([]);
  const [airports, setAirports] = useState<Map<string, AirportCoord>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [viewMode, setViewMode] = useState<MapViewMode>('route');
  const [panelCollapsed, setPanelCollapsed] = useState(false);

  const eventSourceRef = useRef<EventSource | null>(null);
  const trackedBookingId = useRef<string>('');

  /* ── Fetch tracking data ── */
  const fetchTracking = useCallback(async () => {
    if (!token) return;
    try {
      const { booking } = await api.tracking.getByBooking(id, token);
      trackedBookingId.current = booking.id;
      setFlights(booking.flights);
    } catch {
      try {
        const { flights: myFlights } = await api.tracking.myFlights(token);
        const match = myFlights.filter((f) => f.bookingId === id);
        if (match.length > 0) {
          setFlights(match);
          setIsStandalone(true);
        } else {
          const { flight } = await api.tracking.getFlightStatus(id, token);
          setFlights([flight]);
          setIsStandalone(true);
        }
      } catch {
        setError('Flight not found.');
      }
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  /* ── SSE for live status updates ── */
  useEffect(() => {
    if (!token || flights.length === 0) return;
    const flight = flights[0];
    if (!flight || flight.flightStatus === 'landed' || flight.flightStatus === 'cancelled') return;

    const url = api.tracking.streamUrl(flight.id, token);
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status) {
          setFlights((prev) =>
            prev.map((f) => (f.id === data.flightId ? { ...f, flightStatus: data.status } : f))
          );
        }
      } catch { /* ignore */ }
    };

    return () => { es.close(); eventSourceRef.current = null; };
  }, [token, flights]);

  /* ── Auth gate ── */
  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    fetchTracking();
  }, [user, authLoading, router, fetchTracking]);

  /* ── Position polling (every 30s for active flights) ── */
  useEffect(() => {
    if (!token || flights.length === 0) return;
    const hasActive = flights.some((f) => f.flightStatus === 'active');
    if (!hasActive) return;

    const poll = () => {
      api.tracking.positions(token).then(({ positions: p }) => setPositions(p)).catch(() => {});
    };
    poll();
    const interval = setInterval(poll, 30_000);
    return () => clearInterval(interval);
  }, [token, flights]);

  /* ── Share link ── */
  const handleShare = async () => {
    if (!token || flights.length === 0) return;
    const flight = flights[0];
    if (!flight) return;
    try {
      const { shareToken } = await api.tracking.createShareLink(flight.id, flight.bookingId, token);
      const url = `${window.location.origin}/track/${shareToken}`;
      setShareUrl(url);
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    } catch { setError('Failed to create share link'); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAirportsResolved = useCallback((resolved: Map<string, AirportCoord>) => {
    setAirports(resolved);
  }, []);

  const primaryFlight = flights[0] ?? null;
  const primaryPosition = primaryFlight
    ? positions.find((p) => p.flightIata === `${primaryFlight.airlineCode}${primaryFlight.flightNumber.replace(/\D/g, '')}`)
    : undefined;

  /* ── Loading state ── */
  if (authLoading || loading) {
    return (
      <div className="w-full h-[calc(100dvh-4rem)] flex items-center justify-center bg-bg-primary">
        <IconLoader className="w-6 h-6 text-text-muted animate-spin" />
      </div>
    );
  }

  /* ── Error state ── */
  if (error && flights.length === 0) {
    return (
      <div className="w-full h-[calc(100dvh-4rem)] flex items-center justify-center bg-bg-primary">
        <div className="text-center space-y-3">
          <div className="text-text-muted text-sm">{error}</div>
          <Link href={isStandalone ? '/track' : `/bookings/${id}`} className="text-sm text-accent-teal hover:underline">
            Go back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100dvh-4rem)] overflow-hidden">
      {/* ── Full-screen Map ── */}
      <FlightMap
        flights={flights}
        positions={positions}
        selectedFlightId={primaryFlight?.id}
        className="h-full"
        viewMode={viewMode}
        onAirportsResolved={handleAirportsResolved}
        trackerMode
      />

      {/* ── Back Button ── */}
      <div className="absolute top-4 left-4 z-20 md:hidden">
        <Link
          href={isStandalone ? '/track' : `/bookings/${id}`}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1f2e]/90 backdrop-blur-xl border border-white/10 rounded-lg text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          <IconArrowRight className="w-3 h-3 rotate-180" />
          Back
        </Link>
      </div>

      {/* ── Floating Info Panel (Desktop) ── */}
      {primaryFlight && (
        <div className="absolute top-4 left-4 bottom-20 z-10 hidden md:block">
          <FlightInfoPanel
            flight={primaryFlight}
            position={primaryPosition}
            airports={airports}
            collapsed={panelCollapsed}
            onToggleCollapse={() => setPanelCollapsed(!panelCollapsed)}
          />
        </div>
      )}

      {/* ── Mobile Bottom Sheet ── */}
      {primaryFlight && (
        <div className="absolute bottom-20 left-0 right-0 z-10 md:hidden px-3">
          <FlightInfoPanel
            flight={primaryFlight}
            position={primaryPosition}
            airports={airports}
            collapsed={panelCollapsed}
            onToggleCollapse={() => setPanelCollapsed(!panelCollapsed)}
          />
        </div>
      )}

      {/* ── Top-right Controls ── */}
      <div className="absolute top-4 right-16 z-10 flex items-center gap-2">
        {/* Share button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1f2e]/90 backdrop-blur-xl border border-white/10 rounded-lg text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          {copied ? <IconCopy className="w-3.5 h-3.5 text-green-400" /> : <IconShare className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Share'}
        </button>
        {/* Back (desktop) */}
        <Link
          href={isStandalone ? '/track' : `/bookings/${id}`}
          className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-[#1a1f2e]/90 backdrop-blur-xl border border-white/10 rounded-lg text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          <IconArrowRight className="w-3 h-3 rotate-180" />
          {isStandalone ? 'Tracking' : 'Booking'}
        </Link>
      </div>

      {/* ── Share URL Toast ── */}
      {shareUrl && !copied && (
        <div className="absolute top-16 right-16 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-[#1a1f2e]/95 backdrop-blur-xl border border-white/10 rounded-lg p-3 flex items-center gap-2 max-w-xs">
            <input readOnly value={shareUrl} className="flex-1 text-xs bg-transparent border-none text-text-primary outline-none min-w-0" />
            <button onClick={handleCopy} className="shrink-0 px-2 py-1 text-xs bg-accent-teal text-bg-primary rounded">
              Copy
            </button>
          </div>
        </div>
      )}

      {/* ── Mode Bar (bottom center) ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <div className="flex items-center bg-[#1a1f2e]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <ModeButton
            icon={<RouteIcon />}
            label="Route"
            active={viewMode === 'route'}
            onClick={() => setViewMode('route')}
          />
          <div className="w-px h-8 bg-white/10" />
          <ModeButton
            icon={<TerrainIcon />}
            label="3D"
            active={viewMode === '3d'}
            onClick={() => setViewMode('3d')}
          />
          <div className="w-px h-8 bg-white/10" />
          <ModeButton
            icon={<FollowIcon />}
            label="Follow"
            active={viewMode === 'follow'}
            onClick={() => setViewMode('follow')}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Mode bar button ── */
function ModeButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-5 py-2.5 transition-colors ${
        active ? 'bg-white/10 text-accent-teal' : 'text-text-muted hover:text-text-secondary hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

/* ── Icons for mode bar ── */
function RouteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" />
    </svg>
  );
}

function TerrainIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" /><path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19" />
    </svg>
  );
}

function FollowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
    </svg>
  );
}
