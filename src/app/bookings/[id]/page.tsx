'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { api, type Booking } from '@/lib/api';
import { IconPlane, IconLoader, IconClock, IconCalendar, IconUser, IconMail, IconSignal } from '@/components/icons';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

const statusColors: Record<string, string> = {
  upcoming: 'bg-accent-teal/10 text-accent-teal border-accent-teal/20',
  completed: 'bg-text-muted/10 text-text-muted border-text-muted/20',
  cancelled: 'bg-red-400/10 text-red-400 border-red-400/20',
};

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBooking = useCallback(async () => {
    if (!token) return;
    try {
      const { booking: data } = await api.bookings.get(id, token);
      setBooking(data);
    } catch {
      setError('Booking not found');
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    fetchBooking();
  }, [user, authLoading, router, fetchBooking]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <IconLoader className="w-6 h-6 text-text-muted animate-spin" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <IconPlane className="w-12 h-12 text-text-muted/50 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-secondary mb-2">{error || 'Booking not found'}</h3>
        <Link href="/bookings" className="text-accent-teal hover:underline">
          Back to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Link href="/bookings" className="text-sm text-text-muted hover:text-text-secondary transition-colors">
          Back to Bookings
        </Link>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-medium text-text-primary">{booking.airline}</span>
              <span className="text-sm text-text-muted">{booking.flightNumber}</span>
            </div>
            <span className={`px-3 py-1 text-xs rounded border ${statusColors[booking.status]}`}>
              {booking.status}
            </span>
          </div>

          <div className="flex items-center justify-center gap-6 py-6">
            <div className="text-center">
              <div className="text-3xl font-semibold text-text-primary">{booking.origin}</div>
              <div className="text-sm text-text-muted mt-1">{formatTime(booking.departureTime)}</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <IconPlane className="w-6 h-6 text-accent-teal rotate-90" />
              <div className="w-24 h-px bg-border-subtle" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-text-primary">{booking.destination}</div>
              <div className="text-sm text-text-muted mt-1">{formatTime(booking.arrivalTime)}</div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <IconCalendar className="w-5 h-5 text-text-muted mt-0.5" />
            <div>
              <div className="text-xs text-text-muted mb-0.5">Date</div>
              <div className="text-sm text-text-primary">{formatDate(booking.departureTime)}</div>
            </div>
          </div>

          {booking.confirmationCode && (
            <div className="flex items-start gap-3">
              <IconClock className="w-5 h-5 text-text-muted mt-0.5" />
              <div>
                <div className="text-xs text-text-muted mb-0.5">Confirmation Code</div>
                <div className="text-sm text-text-primary font-mono">{booking.confirmationCode}</div>
              </div>
            </div>
          )}

          {booking.passengerName && (
            <div className="flex items-start gap-3">
              <IconUser className="w-5 h-5 text-text-muted mt-0.5" />
              <div>
                <div className="text-xs text-text-muted mb-0.5">Passenger</div>
                <div className="text-sm text-text-primary">{booking.passengerName}</div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <IconMail className="w-5 h-5 text-text-muted mt-0.5" />
            <div>
              <div className="text-xs text-text-muted mb-0.5">Source</div>
              <div className="text-sm text-text-primary capitalize">{booking.source}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Link
          href={`/bookings/${id}/track`}
          className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-bg-primary bg-accent-teal rounded-xl hover:bg-accent-teal/90 transition-colors"
        >
          <IconSignal className="w-4 h-4" />
          Track Flight
        </Link>
      </div>
    </div>
  );
}
