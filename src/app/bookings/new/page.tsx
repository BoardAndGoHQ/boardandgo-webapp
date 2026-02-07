'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, ApiError } from '@/context/auth';
import { api } from '@/lib/api';
import { IconPlane, IconMapPin, IconCalendar, IconUser, IconLoader, IconArrowRight } from '@/components/icons';

export default function NewBookingPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    airline: '',
    flightNumber: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    confirmationCode: '',
    passengerName: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError('');
    setLoading(true);

    try {
      await api.bookings.create(
        {
          airline: form.airline,
          flightNumber: form.flightNumber,
          origin: form.origin.toUpperCase(),
          destination: form.destination.toUpperCase(),
          departureTime: new Date(form.departureTime).toISOString(),
          arrivalTime: new Date(form.arrivalTime).toISOString(),
          confirmationCode: form.confirmationCode || null,
          passengerName: form.passengerName || null,
        },
        token
      );
      router.push('/bookings');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create booking');
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <IconLoader className="w-6 h-6 text-text-muted animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Link href="/bookings" className="text-sm text-text-muted hover:text-text-secondary transition-colors">
          Back to Bookings
        </Link>
        <h1 className="text-2xl font-semibold text-text-primary mt-2">Add Booking</h1>
        <p className="text-sm text-text-muted mt-1">Manually add a flight reservation</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="px-4 py-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-bg-card border border-border-subtle rounded-xl p-5">
          <h2 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
            <IconPlane className="w-4 h-4 text-accent-teal" />
            Flight Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Airline</label>
              <input
                type="text"
                value={form.airline}
                onChange={(e) => setForm((f) => ({ ...f, airline: e.target.value }))}
                required
                placeholder="e.g., United Airlines"
                className="w-full px-4 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-accent-teal/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Flight Number</label>
              <input
                type="text"
                value={form.flightNumber}
                onChange={(e) => setForm((f) => ({ ...f, flightNumber: e.target.value.toUpperCase() }))}
                required
                placeholder="e.g., UA123"
                className="w-full px-4 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-accent-teal/50 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="bg-bg-card border border-border-subtle rounded-xl p-5">
          <h2 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
            <IconMapPin className="w-4 h-4 text-accent-teal" />
            Route
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-text-muted mb-1.5 block">Origin</label>
              <input
                type="text"
                value={form.origin}
                onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value.toUpperCase() }))}
                required
                maxLength={3}
                placeholder="SFO"
                className="w-full px-4 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-accent-teal/50 transition-colors"
              />
            </div>
            <IconArrowRight className="w-5 h-5 text-text-muted mt-5" />
            <div className="flex-1">
              <label className="text-xs text-text-muted mb-1.5 block">Destination</label>
              <input
                type="text"
                value={form.destination}
                onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value.toUpperCase() }))}
                required
                maxLength={3}
                placeholder="JFK"
                className="w-full px-4 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-accent-teal/50 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="bg-bg-card border border-border-subtle rounded-xl p-5">
          <h2 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
            <IconCalendar className="w-4 h-4 text-accent-teal" />
            Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Departure</label>
              <input
                type="datetime-local"
                value={form.departureTime}
                onChange={(e) => setForm((f) => ({ ...f, departureTime: e.target.value }))}
                required
                className="w-full px-4 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary focus:border-accent-teal/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Arrival</label>
              <input
                type="datetime-local"
                value={form.arrivalTime}
                onChange={(e) => setForm((f) => ({ ...f, arrivalTime: e.target.value }))}
                required
                className="w-full px-4 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary focus:border-accent-teal/50 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="bg-bg-card border border-border-subtle rounded-xl p-5">
          <h2 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
            <IconUser className="w-4 h-4 text-accent-teal" />
            Additional Info (Optional)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Confirmation Code</label>
              <input
                type="text"
                value={form.confirmationCode}
                onChange={(e) => setForm((f) => ({ ...f, confirmationCode: e.target.value.toUpperCase() }))}
                placeholder="ABC123"
                className="w-full px-4 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-accent-teal/50 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Passenger Name</label>
              <input
                type="text"
                value={form.passengerName}
                onChange={(e) => setForm((f) => ({ ...f, passengerName: e.target.value }))}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-accent-teal/50 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-accent-teal text-bg-primary font-medium text-sm rounded-lg hover:bg-accent-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <IconLoader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Booking'
            )}
          </button>
          <Link
            href="/bookings"
            className="px-6 py-3 text-sm text-text-secondary bg-bg-elevated border border-border-subtle rounded-lg hover:bg-bg-card transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
