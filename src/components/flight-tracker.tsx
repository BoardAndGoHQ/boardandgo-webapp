'use client';

import type { TrackedFlight, FlightStatusEvent } from '@/lib/api';
import { IconPlane, IconClock, IconSignal } from '@/components/icons';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  scheduled: { label: 'Scheduled', color: 'text-accent-teal', bg: 'bg-accent-teal/10' },
  active: { label: 'In Flight', color: 'text-green-400', bg: 'bg-green-400/10' },
  landed: { label: 'Landed', color: 'text-text-muted', bg: 'bg-text-muted/10' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10' },
  diverted: { label: 'Diverted', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  unknown: { label: 'Unknown', color: 'text-text-muted', bg: 'bg-text-muted/10' },
};

function formatTime(iso: string | null) {
  if (!iso) return '--:--';
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
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

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.unknown;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${config.bg} ${config.color}`}>
      <span className="relative flex h-2 w-2">
        {status === 'active' && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'active' ? 'bg-green-400' : 'bg-current'}`} />
      </span>
      {config.label}
    </span>
  );
}

export function FlightProgress({ status }: { status: string }) {
  const pct = status === 'landed' ? 100 : status === 'active' ? 60 : 0;
  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-accent-teal" />
        <div className="flex-1 h-0.5 bg-border-subtle relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-accent-teal transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
          {status === 'active' && (
            <svg className="absolute w-4 h-4 text-accent-teal -top-1.5 rotate-90 transition-all duration-1000" style={{ left: `calc(${pct}% - 8px)` }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z" />
            </svg>
          )}
        </div>
        <div className={`w-3 h-3 rounded-full ${status === 'landed' ? 'bg-accent-teal' : 'bg-border-subtle'}`} />
      </div>
    </div>
  );
}

export function FlightStatusCard({ flight }: { flight: TrackedFlight }) {
  const bestDep = flight.actualDeparture ?? flight.estimatedDeparture ?? flight.scheduledDeparture;
  const bestArr = flight.actualArrival ?? flight.estimatedArrival ?? flight.scheduledArrival;

  return (
    <div className="bg-bg-card border border-border-subtle rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <IconSignal className="w-5 h-5 text-accent-teal" />
          <span className="text-sm font-medium text-text-secondary">{flight.flightNumber}</span>
          {flight.airlineName && <span className="text-xs text-text-muted">{flight.airlineName}</span>}
        </div>
        <StatusBadge status={flight.flightStatus} />
      </div>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="text-center flex-1">
          <div className="text-3xl font-bold text-text-primary">{flight.departureAirport}</div>
          <div className="text-sm text-text-muted mt-1">{formatTime(bestDep)}</div>
          {flight.departureGate && (
            <div className="text-xs text-accent-teal mt-1">Gate {flight.departureGate}</div>
          )}
          {flight.departureTerminal && (
            <div className="text-xs text-text-muted">T{flight.departureTerminal}</div>
          )}
        </div>

        <div className="flex-1 pt-3">
          <FlightProgress status={flight.flightStatus} />
          {flight.durationMinutes && (
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-text-muted">
              <IconClock className="w-3 h-3" />
              {Math.floor(flight.durationMinutes / 60)}h {flight.durationMinutes % 60}m
            </div>
          )}
        </div>

        <div className="text-center flex-1">
          <div className="text-3xl font-bold text-text-primary">{flight.arrivalAirport}</div>
          <div className="text-sm text-text-muted mt-1">{formatTime(bestArr)}</div>
          {flight.arrivalGate && (
            <div className="text-xs text-accent-teal mt-1">Gate {flight.arrivalGate}</div>
          )}
          {flight.arrivalTerminal && (
            <div className="text-xs text-text-muted">T{flight.arrivalTerminal}</div>
          )}
        </div>
      </div>

      {flight.departureDelayMinutes > 0 && (
        <div className="px-3 py-2 bg-orange-400/10 border border-orange-400/20 rounded-lg text-sm text-orange-400">
          Delayed by {flight.departureDelayMinutes} min
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
        <div>
          <div className="text-xs text-text-muted">Scheduled</div>
          <div className="text-text-secondary">{formatDate(flight.scheduledDeparture)} {formatTime(flight.scheduledDeparture)}</div>
        </div>
        {flight.estimatedDeparture && (
          <div>
            <div className="text-xs text-text-muted">Estimated</div>
            <div className="text-text-secondary">{formatTime(flight.estimatedDeparture)}</div>
          </div>
        )}
        {flight.aircraftType && (
          <div>
            <div className="text-xs text-text-muted">Aircraft</div>
            <div className="text-text-secondary">{flight.aircraftType}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function FlightTimeline({ events }: { events: FlightStatusEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-text-muted">
        No status updates yet. We&apos;ll notify you when something changes.
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {events.map((event, i) => (
        <div key={event.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${i === 0 ? 'bg-accent-teal' : 'bg-border-subtle'}`} />
            {i < events.length - 1 && <div className="w-px flex-1 bg-border-subtle my-1" />}
          </div>
          <div className="pb-4">
            <div className="text-sm font-medium text-text-primary">{formatEventType(event.eventType)}</div>
            {event.oldStatus && event.newStatus && (
              <div className="text-xs text-text-muted mt-0.5">
                {event.oldStatus} → {event.newStatus}
              </div>
            )}
            {event.delayMinutes && (
              <div className="text-xs text-orange-400 mt-0.5">+{event.delayMinutes} min delay</div>
            )}
            <div className="text-xs text-text-muted mt-1">
              {new Date(event.eventTime).toLocaleString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
