'use client';

import { useState, useEffect } from 'react';
import type { TrackedFlight, FlightStatusEvent } from '@/lib/api';
import { getTrackedDelayRisk } from '@/lib/insights';
import {
  Plane,
  Loader2,
  Trash2,
  ChevronDown,
  Clock,
  AlertTriangle,
  MapPin,
  Radio,
} from 'lucide-react';

type FlightWithEvents = TrackedFlight & { statusEvents: FlightStatusEvent[] };

/* ── Airline logo CDN ── */
const AIRLINE_LOGO_URL = (iata: string) =>
  `https://images.kiwi.com/airlines/64/${iata}.png`;

/* ── Helpers ── */
function formatTime(iso: string | null) {
  if (!iso) return '--:--';
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function getFlightProgress(flight: TrackedFlight): number {
  if (flight.flightStatus === 'landed') return 1;
  if (flight.flightStatus !== 'active') return 0;
  const dep = flight.actualDeparture ?? flight.estimatedDeparture ?? flight.scheduledDeparture;
  const arr = flight.estimatedArrival ?? flight.scheduledArrival;
  if (!dep || !arr) return 0.5;
  const start = new Date(dep).getTime();
  const end = new Date(arr).getTime();
  const now = Date.now();
  if (now <= start) return 0;
  if (now >= end) return 1;
  return (now - start) / (end - start);
}

function formatEventType(type: string): string {
  const map: Record<string, string> = {
    status_change: 'Status changed',
    delay: 'Delay detected',
    gate_change: 'Gate changed',
    cancellation: 'Flight cancelled',
    landed: 'Flight landed',
  };
  return map[type] ?? type;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return 'just now';
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function timeUntil(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return 'Now';
  const hours = Math.floor(diff / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  scheduled: { label: 'Scheduled', color: 'text-accent-blue', bg: 'bg-accent-blue/10', dot: 'bg-accent-blue' },
  active: { label: 'In Flight', color: 'text-emerald-400', bg: 'bg-emerald-400/10', dot: 'bg-emerald-400' },
  landed: { label: 'Landed', color: 'text-text-muted', bg: 'bg-text-muted/10', dot: 'bg-text-muted' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10', dot: 'bg-red-400' },
  diverted: { label: 'Diverted', color: 'text-orange-400', bg: 'bg-orange-400/10', dot: 'bg-orange-400' },
  unknown: { label: 'Unknown', color: 'text-text-muted', bg: 'bg-text-muted/10', dot: 'bg-text-muted' },
};

interface FlightCardProps {
  flight: FlightWithEvents;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: (flightId: string, e: React.MouseEvent) => void;
  isDeleting: boolean;
}

export function FlightCard({
  flight,
  isExpanded,
  onToggle,
  onDelete,
  isDeleting,
}: FlightCardProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const [, setTick] = useState(0);

  const cfg = statusConfig[flight.flightStatus] ?? statusConfig.unknown;
  const isActive = flight.flightStatus === 'active';
  const isHistory = ['landed', 'cancelled'].includes(flight.flightStatus);
  const progress = getFlightProgress(flight);
  const delayRisk = !isHistory ? getTrackedDelayRisk(flight) : null;

  const bestDep = flight.actualDeparture ?? flight.estimatedDeparture ?? flight.scheduledDeparture;
  const bestArr = flight.actualArrival ?? flight.estimatedArrival ?? flight.scheduledArrival;

  // Last status event
  const lastEvent = flight.statusEvents.length > 0
    ? flight.statusEvents[flight.statusEvents.length - 1]
    : null;

  // Countdown ticker for scheduled flights
  useEffect(() => {
    if (isHistory) return;
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, [isHistory]);

  // Countdown label
  const countdownLabel = isActive
    ? 'In Flight'
    : flight.flightStatus === 'landed'
    ? 'Landed'
    : flight.flightStatus === 'cancelled'
    ? 'Cancelled'
    : `Departs in ${timeUntil(flight.scheduledDeparture)}`;

  return (
    <div
      className={`glass-card rounded-2xl border transition-all duration-200 overflow-hidden ${
        isHistory
          ? 'border-border-subtle/50 opacity-80 hover:opacity-100'
          : isActive
          ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/5'
          : 'border-border-subtle hover:border-accent-blue/30'
      }`}
    >
      {/* ── Main card (always visible) ── */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 md:p-5"
      >
        {/* Top row: Airline logo + flight number + status + delete */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Airline logo */}
            {!logoFailed ? (
              <img
                src={AIRLINE_LOGO_URL(flight.airlineCode)}
                alt={flight.airlineCode}
                width={36}
                height={36}
                className="w-9 h-9 rounded-lg object-contain bg-bg-elevated/50 p-1"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-bg-elevated/50 flex items-center justify-center">
                <Plane className="w-4 h-4 text-text-muted" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-primary">
                  {flight.airlineCode}{flight.flightNumber}
                </span>
                {flight.airlineName && (
                  <span className="text-xs text-text-muted hidden sm:inline">{flight.airlineName}</span>
                )}
              </div>
              <div className="text-xs text-text-muted mt-0.5">{countdownLabel}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status badge */}
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full ${cfg.bg} ${cfg.color}`}>
              <span className="relative flex h-1.5 w-1.5">
                {isActive && (
                  <span className={`absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-75 animate-ping`} />
                )}
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${cfg.dot}`} />
              </span>
              {cfg.label}
            </span>

            {/* Delete button */}
            <button
              onClick={(e) => onDelete(flight.id, e)}
              disabled={isDeleting}
              className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
              title="Remove flight"
            >
              {isDeleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Route row: DEP ---- progress ---- ARR */}
        <div className="flex items-center gap-3 mb-3">
          <div className="text-center min-w-13">
            <div className="text-lg font-bold text-text-primary">{flight.departureAirport}</div>
            <div className="text-xs text-text-muted">{formatTime(bestDep)}</div>
            {flight.departureGate && (
              <div className="text-[10px] text-accent-blue">Gate {flight.departureGate}</div>
            )}
          </div>

          {/* Progress bar */}
          <div className="flex-1 px-1">
            <div className="relative h-1 bg-border-subtle rounded-full overflow-visible">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                  isActive ? 'bg-emerald-400' : flight.flightStatus === 'landed' ? 'bg-accent-blue' : 'bg-accent-blue/30'
                }`}
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
              {isActive && (
                <div
                  className="absolute -top-1.75 transition-all duration-1000"
                  style={{ left: `calc(${Math.round(progress * 100)}% - 8px)` }}
                >
                  <Plane className="w-4 h-4 text-emerald-400 rotate-90" />
                </div>
              )}
            </div>
            {flight.durationMinutes && (
              <div className="text-center text-[10px] text-text-muted mt-1.5">
                {Math.floor(flight.durationMinutes / 60)}h {flight.durationMinutes % 60}m
              </div>
            )}
          </div>

          <div className="text-center min-w-13">
            <div className="text-lg font-bold text-text-primary">{flight.arrivalAirport}</div>
            <div className="text-xs text-text-muted">{formatTime(bestArr)}</div>
            {flight.arrivalGate && (
              <div className="text-[10px] text-accent-blue">Gate {flight.arrivalGate}</div>
            )}
          </div>
        </div>

        {/* Bottom row: delay + risk + last event + expand chevron */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Delay callout */}
            {flight.departureDelayMinutes > 0 && (
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                flight.departureDelayMinutes > 30 ? 'bg-red-400/10 text-red-400' : 'bg-amber-400/10 text-amber-400'
              }`}>
                <AlertTriangle className="w-3 h-3" />
                +{flight.departureDelayMinutes}m delay
              </span>
            )}

            {/* Delay risk */}
            {delayRisk && delayRisk.level !== 'low' && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                delayRisk.level === 'high' ? 'bg-red-400/10 text-red-400' : 'bg-amber-400/10 text-amber-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  delayRisk.level === 'high' ? 'bg-red-400' : 'bg-amber-400'
                }`} />
                {delayRisk.probability}% risk
              </span>
            )}

            {/* Last status event */}
            {lastEvent && (
              <span className="text-[10px] text-text-muted flex items-center gap-1">
                <Radio className="w-2.5 h-2.5" />
                {formatEventType(lastEvent.eventType)} · {relativeTime(lastEvent.eventTime)}
              </span>
            )}
          </div>

          <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`} />
        </div>
      </button>
    </div>
  );
}
