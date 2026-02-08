'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { IconMapPin, IconCalendar, IconUsers, IconSearch, IconSwap } from './icons';
import type { TripType, CabinClass } from '@/lib/api';

interface FlightSearchData {
  tripType: TripType;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
  cabin: CabinClass;
}

export function FlightSearch() {
  const router = useRouter();
  const [form, setForm] = useState<FlightSearchData>({
    tripType: 'return',
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    cabin: 'ECONOMY',
  });

  const handleSwap = () => {
    setForm((f) => ({ ...f, origin: f.destination, destination: f.origin }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      tripType: form.tripType,
      origin: form.origin,
      destination: form.destination,
      departureDate: form.departureDate,
      adults: form.adults.toString(),
      cabin: form.cabin,
    });
    if (form.returnDate && form.tripType === 'return') {
      params.set('returnDate', form.returnDate);
    }
    if (form.children > 0) {
      params.set('children', form.children.toString());
    }
    if (form.infants > 0) {
      params.set('infants', form.infants.toString());
    }
    router.push(`/search?${params.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];
  const totalPassengers = form.adults + form.children + form.infants;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-bg-card border border-border-subtle rounded-xl p-4 md:p-6">
        {/* Trip Type Tabs */}
        <div className="flex gap-1 mb-4 p-1 bg-bg-elevated rounded-lg w-fit">
          {(['return', 'oneway'] as TripType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setForm((f) => ({ ...f, tripType: type }))}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                form.tripType === type
                  ? 'bg-accent-teal text-bg-primary'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {type === 'return' ? 'Round Trip' : 'One Way'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
          {/* Origin */}
          <div className="md:col-span-3 relative">
            <label className="text-xs text-text-muted mb-1.5 block">From</label>
            <div className="relative">
              <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="City or airport"
                value={form.origin}
                onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value.toUpperCase() }))}
                maxLength={3}
                required
                className="w-full pl-10 pr-4 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-accent-teal/50 transition-colors"
              />
            </div>
          </div>

          {/* Swap button */}
          <div className="md:col-span-1 flex items-end justify-center pb-1">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2.5 text-text-muted hover:text-accent-teal hover:bg-bg-elevated rounded-lg transition-colors"
              title="Swap"
            >
              <IconSwap className="w-5 h-5" />
            </button>
          </div>

          {/* Destination */}
          <div className="md:col-span-3 relative">
            <label className="text-xs text-text-muted mb-1.5 block">To</label>
            <div className="relative">
              <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="City or airport"
                value={form.destination}
                onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value.toUpperCase() }))}
                maxLength={3}
                required
                className="w-full pl-10 pr-4 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-accent-teal/50 transition-colors"
              />
            </div>
          </div>

          {/* Departure Date */}
          <div className="md:col-span-2">
            <label className="text-xs text-text-muted mb-1.5 block">Departure</label>
            <div className="relative">
              <IconCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type="date"
                value={form.departureDate}
                onChange={(e) => setForm((f) => ({ ...f, departureDate: e.target.value }))}
                min={today}
                required
                className="w-full pl-10 pr-3 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary focus:border-accent-teal/50 transition-colors appearance-none"
              />
            </div>
          </div>

          {/* Return Date */}
          {form.tripType === 'return' && (
            <div className="md:col-span-2">
              <label className="text-xs text-text-muted mb-1.5 block">Return</label>
              <div className="relative">
                <IconCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  type="date"
                  value={form.returnDate}
                  onChange={(e) => setForm((f) => ({ ...f, returnDate: e.target.value }))}
                  min={form.departureDate || today}
                  className="w-full pl-10 pr-3 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary focus:border-accent-teal/50 transition-colors appearance-none"
                />
              </div>
            </div>
          )}

          {/* Passengers */}
          <div className={form.tripType === 'return' ? 'md:col-span-1' : 'md:col-span-3'}>
            <label className="text-xs text-text-muted mb-1.5 block">Travelers</label>
            <div className="relative">
              <IconUsers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <select
                value={form.adults}
                onChange={(e) => setForm((f) => ({ ...f, adults: parseInt(e.target.value) }))}
                className="w-full pl-10 pr-3 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary focus:border-accent-teal/50 transition-colors appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>
                    {n} Adult{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Advanced Options Row */}
        <div className="mt-4 pt-4 border-t border-border-subtle">
          <div className="flex flex-wrap gap-4">
            {/* Cabin Class */}
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Cabin Class</label>
              <select
                value={form.cabin}
                onChange={(e) => setForm((f) => ({ ...f, cabin: e.target.value as CabinClass }))}
                className="px-4 py-2 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary focus:border-accent-teal/50 transition-colors cursor-pointer"
              >
                <option value="ECONOMY">Economy</option>
                <option value="PREMIUM_ECONOMY">Premium Economy</option>
                <option value="BUSINESS">Business</option>
                <option value="FIRST">First Class</option>
              </select>
            </div>

            {/* Children */}
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Children (2-11)</label>
              <select
                value={form.children}
                onChange={(e) => setForm((f) => ({ ...f, children: parseInt(e.target.value) }))}
                className="px-4 py-2 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary focus:border-accent-teal/50 transition-colors cursor-pointer"
              >
                {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Infants */}
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Infants (0-2)</label>
              <select
                value={form.infants}
                onChange={(e) => setForm((f) => ({ ...f, infants: parseInt(e.target.value) }))}
                className="px-4 py-2 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary focus:border-accent-teal/50 transition-colors cursor-pointer"
              >
                {[0, 1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-3.5 bg-accent-teal text-bg-primary font-medium text-sm rounded-lg hover:bg-accent-teal/90 transition-colors flex items-center justify-center gap-2"
        >
          <IconSearch className="w-4 h-4" />
          Search Flights ({totalPassengers} traveler{totalPassengers > 1 ? 's' : ''})
        </button>
      </div>
    </form>
  );
}
