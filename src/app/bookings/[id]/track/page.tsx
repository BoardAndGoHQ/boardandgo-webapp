'use client';

import { useEffect, useState, useCallback, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { api, type TrackedFlight, type FlightStatusEvent } from '@/lib/api';
import { FlightStatusCard, FlightTimeline } from '@/components/flight-tracker';
import { IconLoader, IconShare, IconCopy, IconArrowRight } from '@/components/icons';

export default function TrackFlightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: bookingId } = use(params);
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [flights, setFlights] = useState<(TrackedFlight & { statusEvents: FlightStatusEvent[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const trackedBookingId = useRef<string>('');

  const fetchTracking = useCallback(async () => {
    if (!token) return;
    try {
      const { booking } = await api.tracking.getByBooking(bookingId, token);
      trackedBookingId.current = booking.id;
      setFlights(booking.flights);
    } catch {
      setError('Flight tracking will begin once your booking is processed. Check back shortly.');
    } finally {
      setLoading(false);
    }
  }, [token, bookingId]);

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
            prev.map((f) =>
              f.id === data.flightId ? { ...f, flightStatus: data.status } : f
            )
          );
        }
      } catch { /* ignore */ }
    };

    return () => { es.close(); eventSourceRef.current = null; };
  }, [token, flights]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    fetchTracking();
  }, [user, authLoading, router, fetchTracking]);

  const handleShare = async () => {
    if (!token || flights.length === 0) return;
    const flight = flights[0];
    if (!flight) return;
    try {
      const { shareToken } = await api.tracking.createShareLink(flight.id, flight.bookingId, token);
      setShareUrl(`${window.location.origin}/track/${shareToken}`);
    } catch { setError('Failed to create share link'); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <IconLoader className="w-6 h-6 text-text-muted animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-6">
        <Link href={`/bookings/${bookingId}`} className="text-sm text-text-muted hover:text-text-secondary transition-colors flex items-center gap-1">
          <IconArrowRight className="w-3 h-3 rotate-180" /> Back to Booking
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-text-primary">Flight Tracking</h1>
        {flights.length > 0 && (
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary bg-bg-elevated border border-border-subtle rounded-lg hover:bg-bg-card transition-colors"
          >
            <IconShare className="w-4 h-4" /> Share
          </button>
        )}
      </div>

      {error && flights.length === 0 && (
        <div className="mb-6 px-4 py-3 text-sm text-text-muted bg-bg-card border border-border-subtle rounded-lg">{error}</div>
      )}

      {shareUrl && (
        <div className="mb-6 p-4 bg-bg-card border border-accent-teal/20 rounded-lg">
          <div className="text-xs text-text-muted mb-2">Share this link</div>
          <div className="flex items-center gap-2">
            <input readOnly value={shareUrl} className="flex-1 text-sm bg-bg-elevated border border-border-subtle rounded px-3 py-2 text-text-primary" />
            <button onClick={handleCopy} className="px-3 py-2 text-sm bg-accent-teal text-bg-primary rounded hover:bg-accent-teal/90 transition-colors">
              {copied ? 'Copied!' : <IconCopy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {flights.map((flight) => (
          <div key={flight.id}>
            <FlightStatusCard flight={flight} />
            <div className="mt-6">
              <h3 className="text-sm font-medium text-text-secondary mb-4">Status Timeline</h3>
              <FlightTimeline events={flight.statusEvents} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
