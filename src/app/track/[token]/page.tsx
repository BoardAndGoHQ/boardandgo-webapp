'use client';

import { useEffect, useState, use } from 'react';
import { api, type TrackedFlight, type FlightStatusEvent } from '@/lib/api';
import { FlightStatusCard, FlightTimeline } from '@/components/flight-tracker';
import { IconLoader, IconPlane } from '@/components/icons';

export default function PublicTrackPage({ params }: { params: Promise<{ token: string }> }) {
  const { token: shareToken } = use(params);
  const [flight, setFlight] = useState<(TrackedFlight & { statusEvents: FlightStatusEvent[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const { flight: data } = await api.tracking.getSharedFlight(shareToken);
        setFlight(data);
      } catch {
        setError('This tracking link is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [shareToken]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <IconLoader className="w-6 h-6 text-text-muted animate-spin" />
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <IconPlane className="w-12 h-12 text-text-muted/50 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-secondary mb-2">{error || 'Flight not found'}</h3>
        <p className="text-sm text-text-muted">The link may have expired or the flight is no longer being tracked.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-xl font-semibold text-text-primary">Flight Tracking</h1>
        <p className="text-sm text-text-muted mt-1">Shared via BoardAndGo</p>
      </div>

      <FlightStatusCard flight={flight} />

      <div className="mt-8">
        <h3 className="text-sm font-medium text-text-secondary mb-4">Status Timeline</h3>
        <FlightTimeline events={flight.statusEvents} />
      </div>
    </div>
  );
}
