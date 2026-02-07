'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { api, type FlightOffer, type FlightSearchParams } from '@/lib/api';
import { FlightSearch } from '@/components/flight-search';
import { IconLoader, IconPlane, IconClock, IconArrowRight, IconExternalLink } from '@/components/icons';

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
}

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const departureDate = searchParams.get('departureDate') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const passengers = parseInt(searchParams.get('passengers') || '1');

  const searchFlights = useCallback(async () => {
    if (!token || !origin || !destination || !departureDate) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params: FlightSearchParams = {
        origin,
        destination,
        departureDate,
        passengers,
      };
      if (returnDate) params.returnDate = returnDate;

      const { flights: results } = await api.flights.search(params, token);
      setFlights(results);
    } catch {
      setError('Failed to search flights. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token, origin, destination, departureDate, returnDate, passengers]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    searchFlights();
  }, [user, authLoading, router, searchFlights]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <IconLoader className="w-6 h-6 text-text-muted animate-spin" />
      </div>
    );
  }

  if (!origin || !destination || !departureDate) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted mb-4">Invalid search parameters</p>
        <Link href="/" className="text-accent-teal hover:underline">
          Start a new search
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 p-4 bg-bg-card border border-border-subtle rounded-xl">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium text-text-primary">{origin}</span>
          <IconArrowRight className="w-4 h-4 text-text-muted" />
          <span className="font-medium text-text-primary">{destination}</span>
          <span className="text-text-muted mx-2">|</span>
          <span className="text-text-secondary">{departureDate}</span>
          {returnDate && (
            <>
              <span className="text-text-muted">-</span>
              <span className="text-text-secondary">{returnDate}</span>
            </>
          )}
          <span className="text-text-muted mx-2">|</span>
          <span className="text-text-secondary">{passengers} passenger{passengers > 1 ? 's' : ''}</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <IconLoader className="w-6 h-6 text-accent-teal animate-spin mb-4" />
          <p className="text-sm text-text-muted">Searching flights...</p>
        </div>
      ) : flights.length === 0 ? (
        <div className="text-center py-20">
          <IconPlane className="w-12 h-12 text-text-muted/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-secondary mb-2">No flights found</h3>
          <p className="text-sm text-text-muted mb-6">
            Try different dates or destinations
          </p>
          <Link href="/" className="text-accent-teal hover:underline">
            Modify search
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {flights.map((flight) => (
            <div
              key={flight.id}
              className="p-4 md:p-5 bg-bg-card border border-border-subtle rounded-xl hover:border-border-subtle/80 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-text-primary">{flight.airline}</span>
                    {flight.stops === 0 ? (
                      <span className="px-2 py-0.5 text-xs bg-accent-teal/10 text-accent-teal rounded">Direct</span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs bg-accent-amber/10 text-accent-amber rounded">
                        {flight.stops} stop{flight.stops > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-medium text-text-primary">{formatTime(flight.departureTime)}</div>
                      <div className="text-xs text-text-muted">{flight.origin}</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <IconClock className="w-3 h-3" />
                        {flight.duration}
                      </div>
                      <div className="w-full h-px bg-border-subtle relative">
                        <IconPlane className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-text-muted rotate-90" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium text-text-primary">{formatTime(flight.arrivalTime)}</div>
                      <div className="text-xs text-text-muted">{flight.destination}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-border-subtle md:pl-6">
                  <div className="text-right">
                    <div className="text-xl font-semibold text-text-primary">
                      {formatPrice(flight.price, flight.currency)}
                    </div>
                    <div className="text-xs text-text-muted">per person</div>
                  </div>
                  <a
                    href={flight.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-accent-teal text-bg-primary text-sm font-medium rounded-lg hover:bg-accent-teal/90 transition-colors"
                  >
                    Book
                    <IconExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <FlightSearch />
      </div>
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <IconLoader className="w-6 h-6 text-text-muted animate-spin" />
        </div>
      }>
        <SearchResults />
      </Suspense>
    </div>
  );
}
