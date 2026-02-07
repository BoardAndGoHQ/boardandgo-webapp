'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { api, type Booking } from '@/lib/api';
import { IconPlane, IconPlus, IconMail, IconLoader, IconArrowRight, IconClock } from '@/components/icons';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

const statusColors: Record<string, string> = {
  upcoming: 'bg-accent-teal/10 text-accent-teal',
  completed: 'bg-text-muted/10 text-text-muted',
  cancelled: 'bg-red-400/10 text-red-400',
};

export default function BookingsPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connectingGmail, setConnectingGmail] = useState(false);

  const fetchBookings = useCallback(async () => {
    if (!token) return;
    try {
      const { bookings: data } = await api.bookings.list(token);
      setBookings(data);
    } catch {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    fetchBookings();
  }, [user, authLoading, router, fetchBookings]);

  const handleConnectGmail = async () => {
    if (!token) return;
    setConnectingGmail(true);
    try {
      const { url } = await api.gmail.getAuthUrl(token);
      window.location.href = url;
    } catch {
      setError('Failed to connect Gmail');
      setConnectingGmail(false);
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <IconLoader className="w-6 h-6 text-text-muted animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Your Bookings</h1>
          <p className="text-sm text-text-muted mt-1">Manage all your flight reservations</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleConnectGmail}
            disabled={connectingGmail}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary bg-bg-elevated border border-border-subtle rounded-lg hover:bg-bg-card transition-colors disabled:opacity-50"
          >
            {connectingGmail ? (
              <IconLoader className="w-4 h-4 animate-spin" />
            ) : (
              <IconMail className="w-4 h-4" />
            )}
            Sync Gmail
          </button>
          <Link
            href="/bookings/new"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-bg-primary bg-accent-teal rounded-lg hover:bg-accent-teal/90 transition-colors"
          >
            <IconPlus className="w-4 h-4" />
            Add Booking
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <IconLoader className="w-6 h-6 text-text-muted animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20">
          <IconPlane className="w-12 h-12 text-text-muted/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-secondary mb-2">No bookings yet</h3>
          <p className="text-sm text-text-muted mb-6">
            Search for flights or connect Gmail to import your reservations automatically.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/"
              className="px-4 py-2.5 text-sm text-bg-primary bg-accent-teal rounded-lg hover:bg-accent-teal/90 transition-colors"
            >
              Search Flights
            </Link>
            <button
              onClick={handleConnectGmail}
              disabled={connectingGmail}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary bg-bg-elevated border border-border-subtle rounded-lg hover:bg-bg-card transition-colors"
            >
              <IconMail className="w-4 h-4" />
              Connect Gmail
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/bookings/${booking.id}`}
              className="block p-4 md:p-5 bg-bg-card border border-border-subtle rounded-xl hover:bg-bg-elevated transition-colors group"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-text-primary">{booking.airline}</span>
                    <span className="text-xs text-text-muted">{booking.flightNumber}</span>
                    <span className={`px-2 py-0.5 text-xs rounded ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-text-primary font-medium">{booking.origin}</span>
                    <IconArrowRight className="w-4 h-4 text-text-muted" />
                    <span className="text-text-primary font-medium">{booking.destination}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <div className="text-xs text-text-muted mb-0.5">Departure</div>
                    <div className="text-text-secondary">{formatDate(booking.departureTime)}</div>
                    <div className="flex items-center gap-1 text-text-muted">
                      <IconClock className="w-3 h-3" />
                      {formatTime(booking.departureTime)}
                    </div>
                  </div>
                  {booking.confirmationCode && (
                    <div>
                      <div className="text-xs text-text-muted mb-0.5">Confirmation</div>
                      <div className="text-text-secondary font-mono text-xs">{booking.confirmationCode}</div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
