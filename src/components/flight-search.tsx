'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconMapPin,
  IconCalendar,
  IconUsers,
  IconSearch,
  IconSwapHorizontal,
  IconPlus,
  IconMinus,
  IconChevronDown,
} from './icons';
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

interface FlightSearchProps {
  onSearch?: (params: URLSearchParams) => void;
}

/* ── helpers ───────────────────────────────────── */
function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

const cabinOptions: { value: CabinClass; label: string }[] = [
  { value: 'ECONOMY', label: 'Economy' },
  { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'FIRST', label: 'First Class' },
];

/* ── Stepper ───────────────────────────────────── */
function Stepper({
  label,
  sublabel,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div>
        <div className="text-sm font-medium text-text-primary">{label}</div>
        <div className="text-xs text-text-muted">{sublabel}</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-border-subtle flex items-center justify-center text-text-secondary hover:border-accent-teal hover:text-accent-teal transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <IconMinus className="w-3.5 h-3.5" />
        </button>
        <span className="w-6 text-center text-sm font-semibold text-text-primary tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-border-subtle flex items-center justify-center text-text-secondary hover:border-accent-teal hover:text-accent-teal transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <IconPlus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ── Main Component ────────────────────────────── */
export function FlightSearch({ onSearch }: FlightSearchProps) {
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

  const [travelersOpen, setTravelersOpen] = useState(false);
  const travelersRef = useRef<HTMLDivElement>(null);

  // Close travelers popover on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (travelersRef.current && !travelersRef.current.contains(e.target as Node)) {
        setTravelersOpen(false);
      }
    }
    if (travelersOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [travelersOpen]);

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
    if (onSearch) {
      onSearch(params);
    } else {
      router.push(`/search?${params.toString()}`);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const totalPassengers = form.adults + form.children + form.infants;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="boarding-pass relative">
        {/* Trip Type Toggle */}
        <div className="flex items-center gap-2 mb-5">
          {(['return', 'oneway'] as TripType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setForm((f) => ({ ...f, tripType: type }))}
              className={`px-5 py-2 text-[13px] font-medium rounded-full transition-all duration-200 ${
                form.tripType === type
                  ? 'bg-accent-teal text-bg-primary shadow-sm shadow-accent-teal/25'
                  : 'text-text-muted hover:text-text-primary bg-bg-elevated/50 border border-border-subtle'
              }`}
            >
              {type === 'return' ? 'Round Trip' : 'One Way'}
            </button>
          ))}
        </div>

        {/* ── Main Search Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 items-end">

          {/* ── From ── */}
          <div className="md:col-span-3 search-field-group">
            <label className="search-label">From</label>
            <div className="relative">
              <IconMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-teal" />
              <input
                type="text"
                placeholder="JFK"
                value={form.origin}
                onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value.toUpperCase() }))}
                maxLength={3}
                required
                className="search-input pl-10 uppercase tracking-widest font-semibold text-lg"
              />
            </div>
          </div>

          {/* ── Swap ── */}
          <div className="md:col-span-1 flex items-center justify-center py-2 md:py-0 md:pb-1">
            <button
              type="button"
              onClick={handleSwap}
              className="w-10 h-10 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-muted hover:text-accent-teal hover:border-accent-teal hover:rotate-180 transition-all duration-300"
              title="Swap origin and destination"
            >
              <IconSwapHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* ── To ── */}
          <div className="md:col-span-3 search-field-group">
            <label className="search-label">To</label>
            <div className="relative">
              <IconMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-teal" />
              <input
                type="text"
                placeholder="NBO"
                value={form.destination}
                onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value.toUpperCase() }))}
                maxLength={3}
                required
                className="search-input pl-10 uppercase tracking-widest font-semibold text-lg"
              />
            </div>
          </div>

          {/* ── Departure ── */}
          <div className={form.tripType === 'return' ? 'md:col-span-2 search-field-group' : 'md:col-span-2 search-field-group'}>
            <label className="search-label">Depart</label>
            <div className="relative">
              <IconCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-teal pointer-events-none" />
              <input
                type="date"
                value={form.departureDate}
                onChange={(e) => setForm((f) => ({ ...f, departureDate: e.target.value }))}
                min={today}
                required
                className="search-input pl-10 date-input"
              />
              {form.departureDate && (
                <div className="absolute inset-0 flex items-center pl-10 pr-3 pointer-events-none">
                  <span className="text-sm font-medium text-text-primary">
                    {formatDateDisplay(form.departureDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Return ── */}
          {form.tripType === 'return' && (
            <div className="md:col-span-2 search-field-group">
              <label className="search-label">Return</label>
              <div className="relative">
                <IconCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-teal pointer-events-none" />
                <input
                  type="date"
                  value={form.returnDate}
                  onChange={(e) => setForm((f) => ({ ...f, returnDate: e.target.value }))}
                  min={form.departureDate || today}
                  className="search-input pl-10 date-input"
                />
                {form.returnDate && (
                  <div className="absolute inset-0 flex items-center pl-10 pr-3 pointer-events-none">
                    <span className="text-sm font-medium text-text-primary">
                      {formatDateDisplay(form.returnDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Travelers ── */}
          <div className={form.tripType === 'return' ? 'md:col-span-1 search-field-group' : 'md:col-span-3 search-field-group'} ref={travelersRef}>
            <label className="search-label">Travelers</label>
            <button
              type="button"
              onClick={() => setTravelersOpen(!travelersOpen)}
              className="search-input flex items-center gap-2 text-left w-full"
            >
              <IconUsers className="w-4 h-4 text-accent-teal shrink-0" />
              <span className="text-sm font-medium text-text-primary">{totalPassengers}</span>
              <IconChevronDown className={`w-3.5 h-3.5 text-text-muted ml-auto transition-transform duration-200 ${travelersOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* ── Travelers Popover ── */}
            {travelersOpen && (
              <div className="absolute right-0 md:left-0 top-full mt-2 w-72 bg-bg-card border border-border-subtle rounded-xl shadow-2xl shadow-black/30 z-50 p-4 space-y-1">
                <Stepper
                  label="Adults"
                  sublabel="12+ years"
                  value={form.adults}
                  min={1}
                  max={9}
                  onChange={(v) => setForm((f) => ({ ...f, adults: v }))}
                />
                <div className="border-t border-border-subtle" />
                <Stepper
                  label="Children"
                  sublabel="2-11 years"
                  value={form.children}
                  min={0}
                  max={6}
                  onChange={(v) => setForm((f) => ({ ...f, children: v }))}
                />
                <div className="border-t border-border-subtle" />
                <Stepper
                  label="Infants"
                  sublabel="Under 2"
                  value={form.infants}
                  min={0}
                  max={4}
                  onChange={(v) => setForm((f) => ({ ...f, infants: v }))}
                />

                {/* Cabin Class inside popover */}
                <div className="border-t border-border-subtle pt-3 mt-2">
                  <div className="text-xs text-text-muted mb-2 font-medium">Cabin Class</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {cabinOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, cabin: opt.value }))}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                          form.cabin === opt.value
                            ? 'bg-accent-teal text-bg-primary shadow-sm'
                            : 'bg-bg-elevated text-text-secondary hover:text-text-primary border border-border-subtle'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTravelersOpen(false)}
                  className="w-full mt-3 py-2 text-xs font-medium text-accent-teal hover:bg-accent-teal/10 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Search Button ── */}
        <button
          type="submit"
          className="w-full mt-5 py-3.5 bg-accent-teal text-bg-primary font-semibold text-sm rounded-xl glow-teal hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2.5"
        >
          <IconSearch className="w-4.5 h-4.5" />
          Search Flights
        </button>
      </div>
    </form>
  );
}
