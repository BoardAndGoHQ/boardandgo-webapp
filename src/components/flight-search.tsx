'use client';

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
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
  IconChevronUp,
} from './icons';
import { AirportAutocomplete } from './airport-autocomplete';
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

function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

const cabinOptions: { value: CabinClass; label: string }[] = [
  { value: 'ECONOMY', label: 'Economy' },
  { value: 'PREMIUM_ECONOMY', label: 'Premium' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'FIRST', label: 'First' },
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/* ── Custom Date Picker ───────────────────────── */
function DatePicker({
  value,
  onChange,
  minDate,
  placeholder,
  label,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  minDate?: string;
  placeholder?: string;
  label: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  const effectiveMin = minDate || todayStr;

  // Derive initial view from current value (re-creates state when value changes via key prop pattern)
  const viewSeed = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState(viewSeed.getFullYear());
  const [viewMonth, setViewMonth] = useState(viewSeed.getMonth());

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  // Build calendar grid
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isDisabled = (day: number) => {
    const dateStr = toDateStr(viewYear, viewMonth, day);
    return dateStr < effectiveMin;
  };

  const isSelected = (day: number) => {
    return value === toDateStr(viewYear, viewMonth, day);
  };

  const isToday = (day: number) => {
    return todayStr === toDateStr(viewYear, viewMonth, day);
  };

  const canGoPrev = () => {
    const minD = new Date(effectiveMin + 'T00:00:00');
    return viewYear > minD.getFullYear() || (viewYear === minD.getFullYear() && viewMonth > minD.getMonth());
  };

  const handleSelect = (day: number) => {
    onChange(toDateStr(viewYear, viewMonth, day));
    setOpen(false);
  };

  return (
    <div className="search-field-group relative" ref={ref}>
      <label className="search-label">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`search-input flex items-center gap-2 text-left w-full ${required && !value ? 'border-red-400/0' : ''}`}
      >
        <IconCalendar className="w-4 h-4 text-accent-teal shrink-0" />
        <span className={`text-sm font-medium ${value ? 'text-text-primary' : 'text-text-muted'}`}>
          {value ? formatDateDisplay(value) : (placeholder || 'Select date')}
        </span>
      </button>

      {/* Hidden native input for form validation */}
      {required && (
        <input
          type="date"
          value={value}
          required
          tabIndex={-1}
          className="absolute inset-0 opacity-0 pointer-events-none"
          onChange={() => {}}
        />
      )}

      {open && (
        <div className="absolute left-0 bottom-full mb-2 w-[300px] bg-bg-card border border-border-subtle rounded-xl shadow-2xl shadow-black/40 z-[100] p-4">
          {/* Month/Year Header */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              disabled={!canGoPrev()}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-accent-teal hover:bg-bg-elevated transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <IconChevronUp className="w-4 h-4 -rotate-90" />
            </button>
            <span className="text-sm font-semibold text-text-primary">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-accent-teal hover:bg-bg-elevated transition-colors"
            >
              <IconChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[11px] font-semibold text-text-muted py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} />;
              }
              const disabled = isDisabled(day);
              const selected = isSelected(day);
              const todayMark = isToday(day);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelect(day)}
                  className={`
                    relative w-full aspect-square rounded-lg text-[13px] font-medium transition-all duration-150
                    flex items-center justify-center
                    ${selected
                      ? 'bg-accent-teal text-bg-primary shadow-sm shadow-accent-teal/30'
                      : disabled
                        ? 'text-text-muted/30 cursor-not-allowed'
                        : 'text-text-secondary hover:bg-accent-teal/10 hover:text-accent-teal cursor-pointer'
                    }
                  `}
                >
                  {day}
                  {todayMark && !selected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-teal" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => {
                const t = new Date();
                setViewYear(t.getFullYear());
                setViewMonth(t.getMonth());
                onChange(todayStr);
                setOpen(false);
              }}
              disabled={todayStr < effectiveMin}
              className="text-xs font-medium text-accent-teal hover:text-accent-teal/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                onClick={() => { onChange(''); setOpen(false); }}
                className="text-xs font-medium text-text-muted hover:text-text-secondary transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Stepper (inline) ─────────────────────────── */
function InlineStepper({
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

/* ── Custom Cabin Dropdown ─────────────────────── */
function CabinDropdown({
  value,
  onChange,
}: {
  value: CabinClass;
  onChange: (v: CabinClass) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open]);

  const selected = cabinOptions.find((o) => o.value === value);

  return (
    <div className="search-field-group relative" ref={ref}>
      <label className="search-label">Cabin</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="search-input flex items-center gap-2 text-left w-full"
      >
        <span className="text-sm font-medium text-text-primary truncate">{selected?.label}</span>
        <IconChevronDown className={`w-3.5 h-3.5 text-text-muted ml-auto shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 bottom-full mb-2 w-full min-w-[180px] bg-bg-card border border-border-subtle rounded-xl shadow-2xl shadow-black/40 z-[100] py-1.5">
          {cabinOptions.map((opt) => {
            const isActive = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 flex items-center justify-between ${
                  isActive
                    ? 'text-accent-teal bg-accent-teal/8 font-medium'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated/60'
                }`}
              >
                {opt.label}
                {isActive && (
                  <svg className="w-4 h-4 text-accent-teal shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
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

  const closeTravelers = useCallback((e: MouseEvent) => {
    if (travelersRef.current && !travelersRef.current.contains(e.target as Node)) {
      setTravelersOpen(false);
    }
  }, []);

  useEffect(() => {
    if (travelersOpen) {
      document.addEventListener('mousedown', closeTravelers);
      return () => document.removeEventListener('mousedown', closeTravelers);
    }
  }, [travelersOpen, closeTravelers]);

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
  const cabinLabel = cabinOptions.find((c) => c.value === form.cabin)?.label || 'Economy';

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

        {/* ── Row 1: From / Swap / To ── */}
        <div className="flex flex-col md:flex-row items-stretch gap-3 mb-4">
          <div className="flex-1 search-field-group">
            <label className="search-label">From</label>
            <AirportAutocomplete
              value={form.origin}
              onChange={(iata) => setForm((f) => ({ ...f, origin: iata }))}
              placeholder="City or airport"
              required
              icon={<IconMapPin className="w-4 h-4 text-accent-teal" />}
              className="search-input"
              label="Origin airport"
              id="origin"
              name="origin"
            />
          </div>

          <div className="flex items-end justify-center pb-1 shrink-0">
            <button
              type="button"
              onClick={handleSwap}
              className="w-10 h-10 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-muted hover:text-accent-teal hover:border-accent-teal hover:rotate-180 transition-all duration-300"
              title="Swap origin and destination"
            >
              <IconSwapHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 search-field-group">
            <label className="search-label">To</label>
            <AirportAutocomplete
              value={form.destination}
              onChange={(iata) => setForm((f) => ({ ...f, destination: iata }))}
              placeholder="City or airport"
              required
              icon={<IconMapPin className="w-4 h-4 text-accent-teal" />}
              className="search-input"
              label="Destination airport"
              id="destination"
              name="destination"
            />
          </div>
        </div>

        {/* ── Row 2: Dates + Travelers + Cabin ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Departure */}
          <DatePicker
            label="Depart"
            value={form.departureDate}
            onChange={(v) => setForm((f) => ({ ...f, departureDate: v }))}
            minDate={today}
            placeholder="Select date"
            required
          />

          {/* Return */}
          {form.tripType === 'return' ? (
            <DatePicker
              label="Return"
              value={form.returnDate}
              onChange={(v) => setForm((f) => ({ ...f, returnDate: v }))}
              minDate={form.departureDate || today}
              placeholder="Select date"
            />
          ) : (
            <CabinDropdown
              value={form.cabin}
              onChange={(v) => setForm((f) => ({ ...f, cabin: v }))}
            />
          )}

          {/* Travelers */}
          <div className="search-field-group relative" ref={travelersRef}>
            <label className="search-label">Travelers</label>
            <button
              type="button"
              onClick={() => setTravelersOpen(!travelersOpen)}
              className="search-input flex items-center gap-2 text-left w-full"
            >
              <IconUsers className="w-4 h-4 text-accent-teal shrink-0" />
              <span className="text-sm font-medium text-text-primary truncate">
                {form.adults} Adult{form.adults > 1 ? 's' : ''}
                {form.children > 0 && `, ${form.children} Child`}
                {form.infants > 0 && `, ${form.infants} Inf`}
              </span>
              <IconChevronDown className={`w-3.5 h-3.5 text-text-muted ml-auto shrink-0 transition-transform duration-200 ${travelersOpen ? 'rotate-180' : ''}`} />
            </button>

            {travelersOpen && (
              <div className="absolute left-0 md:left-auto md:right-0 top-full mt-2 w-72 bg-bg-card border border-border-subtle rounded-xl shadow-2xl shadow-black/30 z-[100] p-4">
                <InlineStepper label="Adults" sublabel="12+ years" value={form.adults} min={1} max={9} onChange={(v) => setForm((f) => ({ ...f, adults: v }))} />
                <div className="border-t border-border-subtle" />
                <InlineStepper label="Children" sublabel="2-11 years" value={form.children} min={0} max={6} onChange={(v) => setForm((f) => ({ ...f, children: v }))} />
                <div className="border-t border-border-subtle" />
                <InlineStepper label="Infants" sublabel="Under 2" value={form.infants} min={0} max={4} onChange={(v) => setForm((f) => ({ ...f, infants: v }))} />
                <div className="pt-3 mt-2 border-t border-border-subtle">
                  <button
                    type="button"
                    onClick={() => setTravelersOpen(false)}
                    className="w-full py-2 text-xs font-medium text-accent-teal hover:bg-accent-teal/10 rounded-lg transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cabin (round trip) */}
          {form.tripType === 'return' && (
            <CabinDropdown
              value={form.cabin}
              onChange={(v) => setForm((f) => ({ ...f, cabin: v }))}
            />
          )}
        </div>

        {/* ── Search Button ── */}
        <button
          type="submit"
          className="w-full mt-5 py-3.5 bg-accent-teal text-bg-primary font-semibold text-sm rounded-xl glow-teal hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2.5"
        >
          <IconSearch className="w-4.5 h-4.5" />
          Search {totalPassengers} Traveler{totalPassengers > 1 ? 's' : ''} &middot; {cabinLabel}
        </button>
      </div>
    </form>
  );
}
