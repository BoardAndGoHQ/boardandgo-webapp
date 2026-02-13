'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { api, ApiError } from '@/lib/api';
import { IconPlane, IconMapPin, IconCalendar, IconUser, IconLoader, IconArrowRight } from '@/components/icons';
import { AirportAutocomplete } from '@/components/airport-autocomplete';

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
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12 relative">
      {/* Decorative background */}
      <div className="fixed top-20 right-1/4 w-[500px] h-[500px] bg-accent-blue/3 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-1/4 w-[400px] h-[400px] bg-accent-blue/2 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-8 animate-fade-up">
        <Link href="/bookings" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-blue transition-colors">
          <IconArrowRight className="w-3.5 h-3.5 rotate-180" />
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

        <div className="glass-card rounded-2xl p-5 animate-fade-up" style={{ animationDelay: '60ms' }}>
          <h2 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
            <IconPlane className="w-4 h-4 text-accent-blue" />
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
                className="w-full px-4 py-3 glass-input rounded-xl text-sm text-text-primary placeholder:text-text-muted transition-colors"
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
                className="w-full px-4 py-3 glass-input rounded-xl text-sm text-text-primary placeholder:text-text-muted transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 animate-fade-up" style={{ animationDelay: '120ms' }}>
          <h2 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
            <IconMapPin className="w-4 h-4 text-accent-blue" />
            Route
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-text-muted mb-1.5 block">Origin</label>
              <AirportAutocomplete
                value={form.origin}
                onChange={(iata) => setForm((f) => ({ ...f, origin: iata }))}
                placeholder="City or airport"
                required
                className="w-full px-4 py-3 glass-input rounded-xl text-sm text-text-primary placeholder:text-text-muted transition-colors"
                label="Origin airport"
                name="origin"
              />
            </div>
            <IconArrowRight className="w-5 h-5 text-text-muted mt-5" />
            <div className="flex-1">
              <label className="text-xs text-text-muted mb-1.5 block">Destination</label>
              <AirportAutocomplete
                value={form.destination}
                onChange={(iata) => setForm((f) => ({ ...f, destination: iata }))}
                placeholder="City or airport"
                required
                className="w-full px-4 py-3 glass-input rounded-xl text-sm text-text-primary placeholder:text-text-muted transition-colors"
                label="Destination airport"
                name="destination"
              />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 animate-fade-up" style={{ animationDelay: '180ms' }}>
          <h2 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
            <IconCalendar className="w-4 h-4 text-accent-blue" />
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
                className="w-full px-4 py-3 glass-input rounded-xl text-sm text-text-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Arrival</label>
              <input
                type="datetime-local"
                value={form.arrivalTime}
                onChange={(e) => setForm((f) => ({ ...f, arrivalTime: e.target.value }))}
                required
                className="w-full px-4 py-3 glass-input rounded-xl text-sm text-text-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 animate-fade-up" style={{ animationDelay: '240ms' }}>
          <h2 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
            <IconUser className="w-4 h-4 text-accent-blue" />
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
                className="w-full px-4 py-3 glass-input rounded-xl text-sm text-text-primary placeholder:text-text-muted transition-colors font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Passenger Name</label>
              <input
                type="text"
                value={form.passengerName}
                onChange={(e) => setForm((f) => ({ ...f, passengerName: e.target.value }))}
                placeholder="John Doe"
                className="w-full px-4 py-3 glass-input rounded-xl text-sm text-text-primary placeholder:text-text-muted transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: '300ms' }}>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-accent-blue text-white font-medium text-sm rounded-xl hover:bg-accent-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-accent-blue/20"
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
            className="px-6 py-3 text-sm text-text-secondary glass-card rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
