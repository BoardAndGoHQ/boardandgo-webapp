'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import type { FlightSearchParams, TripType, CabinClass, TrackBookClickParams } from '@/lib/api';
import { api } from '@/lib/api';
import { FlightSearch } from '@/components/flight-search';
import { AgentChat } from '@/components/agent-chat';
import { IconLoader, IconPlane, IconArrowRight, IconExternalLink, IconClock, IconSearch, IconSparkles } from '@/components/icons';

interface FlightOffer {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  price: number;
  currency: string;
  affiliateUrl: string;
  stops: number;
  duration: string;
  cabin: string;
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
  };
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
}

function buildFallbackUrl(params: {
  tripType: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  cabin?: string;
}): string {
  const urlParams = new URLSearchParams({
    dcity: params.origin.toUpperCase(),
    acity: params.destination.toUpperCase(),
    ddate: params.departureDate,
    triptype: params.tripType === 'oneway' ? 'oneway' : 'return',
    adult: params.adults.toString(),
  });
  if (params.returnDate && params.tripType !== 'oneway') {
    urlParams.set('rdate', params.returnDate);
  }
  if (params.children && params.children > 0) {
    urlParams.set('child', params.children.toString());
  }
  if (params.cabin) {
    const cabinMap: Record<string, string> = {
      'ECONOMY': 'Economy',
      'PREMIUM_ECONOMY': 'Premium Economy',
      'BUSINESS': 'Business',
      'FIRST': 'First',
    };
    urlParams.set('cabin', cabinMap[params.cabin] || 'Economy');
  }
  // Travelpayouts tracking
  urlParams.set('Allianceid', '3814851');
  urlParams.set('sid', '654591');
  return `https://www.trip.com/flights/?${urlParams.toString()}`;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [provider, setProvider] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const tripType = (searchParams.get('tripType') || 'return') as TripType;
  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const departureDate = searchParams.get('departureDate') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const adults = parseInt(searchParams.get('adults') || '1');
  const children = parseInt(searchParams.get('children') || '0');
  const infants = parseInt(searchParams.get('infants') || '0');
  const cabin = (searchParams.get('cabin') || 'ECONOMY') as CabinClass;

  const totalPassengers = adults + children + infants;

  const searchFlights = useCallback(async () => {
    if (!token || !origin || !destination || !departureDate) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params: FlightSearchParams = {
        tripType,
        origin,
        destination,
        departureDate,
        adults,
        cabin,
      };
      if (returnDate && tripType === 'return') params.returnDate = returnDate;
      if (children > 0) params.children = children;
      if (infants > 0) params.infants = infants;

      const response = await fetch(`http://localhost:3000/api/search/flights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setFlights(data.flights || []);
      setProvider(data.provider || 'amadeus');
    } catch {
      setError('Failed to search flights. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token, tripType, origin, destination, departureDate, returnDate, adults, children, infants, cabin]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    searchFlights();
  }, [user, authLoading, router, searchFlights]);

  const handleBookClick = async (flight: FlightOffer) => {
    if (!token) return;
    
    // Track the click in background, don't wait
    const trackParams: TrackBookClickParams = {
      tripType,
      origin,
      destination,
      departureDate,
      returnDate: returnDate || undefined,
      adults,
      children,
      infants,
      cabin,
      airline: flight.airline,
      airlineCode: flight.airlineCode,
      flightNumber: flight.flightNumber,
      price: flight.price,
      currency: flight.currency,
      stops: flight.stops,
      duration: flight.duration,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      returnDepartureTime: flight.returnDepartureTime,
      returnArrivalTime: flight.returnArrivalTime,
      affiliateUrl: flight.affiliateUrl,
    };
    
    // Fire and forget - don't block the user
    api.flights.trackBookClick(trackParams, token).catch(() => {
      // Silent fail - don't block user experience
    });
    
    // Open affiliate URL immediately
    window.open(flight.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

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
        <p className="text-text-muted mb-4">Enter your search above</p>
      </div>
    );
  }

  const fallbackUrl = buildFallbackUrl({
    tripType, origin, destination, departureDate, returnDate, adults, children, cabin,
  });

  return (
    <div>
      {/* Search Summary */}
      <div className="mb-6 p-4 bg-bg-card border border-border-subtle rounded-xl">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium text-text-primary">{origin}</span>
          <IconArrowRight className="w-4 h-4 text-text-muted" />
          <span className="font-medium text-text-primary">{destination}</span>
          <span className="text-text-muted mx-2">|</span>
          <span className="text-text-secondary">{departureDate}</span>
          {returnDate && tripType === 'return' && (
            <>
              <span className="text-text-muted">-</span>
              <span className="text-text-secondary">{returnDate}</span>
            </>
          )}
          <span className="text-text-muted mx-2">|</span>
          <span className="text-text-secondary">{totalPassengers} traveler{totalPassengers > 1 ? 's' : ''}</span>
          <span className="text-text-muted mx-2">|</span>
          <span className="text-text-secondary capitalize">{cabin.toLowerCase().replace('_', ' ')}</span>
          {tripType === 'oneway' && (
            <span className="px-2 py-0.5 text-xs bg-accent-amber/10 text-accent-amber rounded ml-2">One-way</span>
          )}
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
          <p className="text-sm text-text-muted">Searching real-time flight prices...</p>
        </div>
      ) : flights.length === 0 ? (
        <div className="text-center py-20">
          <IconPlane className="w-12 h-12 text-text-muted/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-secondary mb-2">No flights found</h3>
          <p className="text-sm text-text-muted mb-6">
            Try different dates, destinations, or search directly on our partner:
          </p>
          <a
            href={fallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-teal text-bg-primary font-medium rounded-lg hover:bg-accent-teal/90 transition-colors"
          >
            Search on Trip.com
            <IconExternalLink className="w-4 h-4" />
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Price Disclaimer */}
          <div className="px-4 py-3 bg-accent-amber/5 border border-accent-amber/20 rounded-lg">
            <p className="text-sm text-accent-amber">
              Fares update in real time. Final price confirmed at partner checkout.
            </p>
          </div>

          <p className="text-sm text-text-muted">
            Found {flights.length} flight{flights.length > 1 ? 's' : ''} • Powered by {provider === 'travelpayouts' ? 'Travelpayouts' : 'Amadeus'}
          </p>

          {flights.map((flight) => {
            const dep = formatDateTime(flight.departureTime);
            const arr = formatDateTime(flight.arrivalTime);
            
            return (
              <div
                key={flight.id}
                className="p-4 md:p-5 bg-bg-card border border-border-subtle rounded-xl hover:border-accent-teal/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    {/* Airline Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-text-primary">{flight.airline}</span>
                      <span className="text-xs text-text-muted">({flight.flightNumber})</span>
                      {flight.stops === 0 ? (
                        <span className="px-2 py-0.5 text-xs bg-accent-teal/10 text-accent-teal rounded">Direct</span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs bg-accent-amber/10 text-accent-amber rounded">
                          {flight.stops} stop{flight.stops > 1 ? 's' : ''}
                        </span>
                      )}
                      <span className="px-2 py-0.5 text-xs bg-bg-elevated text-text-muted rounded capitalize">
                        {flight.cabin.toLowerCase()}
                      </span>
                    </div>

                    {/* Outbound Flight */}
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-15">
                        <div className="text-lg font-semibold text-text-primary">{dep.time}</div>
                        <div className="text-xs text-text-muted">{flight.origin}</div>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <IconClock className="w-3 h-3" />
                          {flight.duration}
                        </div>
                        <div className="w-full h-px bg-border-subtle relative">
                          <IconPlane className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-accent-teal rotate-90" />
                        </div>
                      </div>
                      <div className="text-center min-w-15">
                        <div className="text-lg font-semibold text-text-primary">{arr.time}</div>
                        <div className="text-xs text-text-muted">{flight.destination}</div>
                      </div>
                    </div>

                    {/* Return Flight (if exists) */}
                    {flight.returnDepartureTime && (
                      <div className="mt-3 pt-3 border-t border-border-subtle">
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-15">
                            <div className="text-lg font-semibold text-text-primary">
                              {formatDateTime(flight.returnDepartureTime).time}
                            </div>
                            <div className="text-xs text-text-muted">{flight.destination}</div>
                          </div>
                          <div className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full h-px bg-border-subtle relative">
                              <IconPlane className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-accent-teal -rotate-90" />
                            </div>
                          </div>
                          <div className="text-center min-w-15">
                            <div className="text-lg font-semibold text-text-primary">
                              {flight.returnArrivalTime ? formatDateTime(flight.returnArrivalTime).time : '--'}
                            </div>
                            <div className="text-xs text-text-muted">{flight.origin}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price & Book Button */}
                  <div className="flex items-center gap-4 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-border-subtle md:pl-6">
                    <div className="text-right">
                      <div className="text-xl font-semibold text-text-primary">
                        {formatPrice(flight.price, flight.currency)}
                      </div>
                      <div className="text-xs text-text-muted">
                        {tripType === 'return' ? 'roundtrip' : 'one-way'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleBookClick(flight)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-accent-teal text-bg-primary text-sm font-medium rounded-lg hover:bg-accent-teal/90 transition-colors cursor-pointer"
                    >
                      Book now
                      <IconExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Urgency note */}
                <p className="mt-3 text-xs text-text-muted">
                  Complete your booking in this session to secure this fare.
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SearchModeToggle({
  mode,
  onChange,
}: {
  mode: 'manual' | 'ai';
  onChange: (mode: 'manual' | 'ai') => void;
}) {
  return (
    <div className="flex gap-1 p-1 bg-bg-elevated rounded-lg w-fit">
      <button
        onClick={() => onChange('manual')}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          mode === 'manual'
            ? 'bg-accent-teal text-bg-primary'
            : 'text-text-muted hover:text-text-primary'
        }`}
      >
        <IconSearch className="w-3.5 h-3.5" />
        Manual
      </button>
      <button
        onClick={() => onChange('ai')}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          mode === 'ai'
            ? 'bg-accent-teal text-bg-primary'
            : 'text-text-muted hover:text-text-primary'
        }`}
      >
        <IconSparkles className="w-3.5 h-3.5" />
        AI Search
      </button>
    </div>
  );
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'manual' | 'ai'>(() => {
    if (typeof window === 'undefined') return 'manual';
    // Support ?mode=ai from homepage "Try AI Search" button
    const urlMode = new URLSearchParams(window.location.search).get('mode');
    if (urlMode === 'ai') return 'ai';
    return (localStorage.getItem('searchMode') as 'manual' | 'ai') || 'manual';
  });

  const handleModeChange = (newMode: 'manual' | 'ai') => {
    setMode(newMode);
    localStorage.setItem('searchMode', newMode);
  };

  // Detect if URL has active search params (from agent confirm or manual search)
  const hasSearchParams = !!(
    searchParams.get('origin') &&
    searchParams.get('destination') &&
    searchParams.get('departureDate')
  );

  return (
    <div style={{ maxWidth: '1400px' }} className="mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center justify-between mb-6">
        <SearchModeToggle mode={mode} onChange={handleModeChange} />
      </div>

      {/* Manual mode — full width, same as before */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          mode === 'manual'
            ? 'opacity-100'
            : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'
        }`}
      >
        <div className="mb-8">
          <FlightSearch />
        </div>
        {mode === 'manual' && <SearchResults />}
      </div>

      {/* AI mode — side-by-side: chat left, results right */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          mode === 'ai'
            ? 'opacity-100'
            : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'
        }`}
      >
        <div className="flex gap-5">
          {/* Chat panel — sticky left side */}
          <div className="w-full md:w-85 lg:w-95 shrink-0">
            <div className="md:sticky md:top-4" style={{ height: 'calc(100vh - 140px)' }}>
              {mode === 'ai' && <AgentChat />}
            </div>
          </div>

          {/* Results panel — scrolls naturally on the right */}
          <div className="hidden md:block flex-1 min-w-0">
            {hasSearchParams ? (
              <SearchResults />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-32">
                <div className="w-16 h-16 rounded-2xl bg-bg-elevated flex items-center justify-center mb-4">
                  <IconPlane className="w-8 h-8 text-text-muted/40" />
                </div>
                <h3 className="text-base font-medium text-text-secondary mb-1.5">
                  Your flights will appear here
                </h3>
                <p className="text-sm text-text-muted max-w-xs">
                  Chat with the AI assistant to find flights, then confirm to see results.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: results below chat */}
        {hasSearchParams && (
          <div className="md:hidden mt-6">
            <SearchResults />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <IconLoader className="w-6 h-6 text-text-muted animate-spin" />
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
