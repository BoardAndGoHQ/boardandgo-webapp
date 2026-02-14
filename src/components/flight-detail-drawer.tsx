'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  api,
  type TrackedFlight,
  type FlightStatusEvent,
  type FlightPosition,
} from '@/lib/api';
import {
  generateIntelligenceReport,
  getTrackedDelayRisk,
  getRecommendedArrival,
  type UserIntelligenceProfile,
  type AgentBriefing,
} from '@/lib/insights';
import { useIntelligenceMode } from '@/hooks/use-intelligence-mode';
import {
  Plane,
  Loader2,
  Map,
  Share2,
  Clock,
  Gauge,
  ArrowUp,
  Radio,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  Car,
  ExternalLink,
  BarChart3,
  Shield,
} from 'lucide-react';

type FlightWithEvents = TrackedFlight & { statusEvents: FlightStatusEvent[] };

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

function eventIcon(type: string) {
  switch (type) {
    case 'gate_change':
      return <Map className="w-3 h-3 text-accent-blue" />;
    case 'delay':
      return <AlertTriangle className="w-3 h-3 text-amber-400" />;
    case 'cancellation':
      return <AlertTriangle className="w-3 h-3 text-red-400" />;
    case 'landed':
      return <Plane className="w-3 h-3 text-emerald-400" />;
    default:
      return <Radio className="w-3 h-3 text-text-muted" />;
  }
}

/* ── Status line derivation (deterministic) ── */
function getStatusLine(flight: FlightWithEvents): { line: string; explanation: string; color: string } {
  const report = generateIntelligenceReport(flight);

  if (flight.flightStatus === 'cancelled') {
    return { line: 'Flight cancelled.', explanation: 'Contact your airline for rebooking.', color: 'text-red-400' };
  }
  if (flight.flightStatus === 'active') {
    return { line: 'In flight.', explanation: `${flight.airlineCode}${flight.flightNumber} is currently airborne.`, color: 'text-emerald-400' };
  }
  if (flight.flightStatus === 'landed') {
    return { line: 'Arrived.', explanation: `${flight.airlineCode}${flight.flightNumber} has landed.`, color: 'text-text-muted' };
  }
  if (report.minutesUntilRecommendedArrival <= 0 && report.hoursUntilDeparture > 0) {
    return { line: 'Leave now.', explanation: 'You should already be heading to the airport.', color: 'text-red-400' };
  }
  if (report.minutesUntilRecommendedArrival <= 60 && report.minutesUntilRecommendedArrival > 0) {
    return { line: `Leave in ${report.minutesUntilRecommendedArrival} min.`, explanation: 'Head to the airport soon.', color: 'text-amber-400' };
  }
  if (report.currentDelayMinutes > 30) {
    return { line: `Delayed ${report.currentDelayMinutes} min.`, explanation: 'Significant delays detected. Monitor closely.', color: 'text-red-400' };
  }
  if (report.monitoringLevel === 'high') {
    return { line: 'Monitor closely.', explanation: 'Elevated risk factors detected.', color: 'text-amber-400' };
  }
  if (report.monitoringLevel === 'medium') {
    return { line: 'Some concerns.', explanation: 'Minor risk factors detected. We\'re watching.', color: 'text-amber-400' };
  }
  return { line: 'You\'re clear.', explanation: 'All systems normal. We\'re monitoring your flight.', color: 'text-emerald-400' };
}

/* ── Component ── */
interface FlightDetailDrawerProps {
  flight: FlightWithEvents;
  token: string;
  positions: FlightPosition[];
}

export function FlightDetailDrawer({ flight, token, positions }: FlightDetailDrawerProps) {
  const [intelligenceMode] = useIntelligenceMode();
  const [briefing, setBriefing] = useState<AgentBriefing | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [timeline, setTimeline] = useState<FlightStatusEvent[]>(flight.statusEvents ?? []);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);

  const progress = getFlightProgress(flight);
  const status = getStatusLine(flight);
  const delayRisk = getTrackedDelayRisk(flight);
  const isActive = flight.flightStatus === 'active';

  // Live position
  const posMatch = positions.find(
    (p) => p.flightIata === `${flight.airlineCode}${flight.flightNumber.replace(/\D/g, '')}`
  );
  const altFt = posMatch?.altitude ? Math.round(posMatch.altitude) : null;
  const speedKts = posMatch?.speed ? Math.round(posMatch.speed * 0.539957) : null;

  // Recommended airport arrival
  const arrival = getRecommendedArrival(
    flight.scheduledDeparture,
    flight.departureAirport,
    flight.arrivalAirport,
    flight.departureDelayMinutes
  );
  const arrivalTime = arrival.recommendedTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Fetch AI briefing
  useEffect(() => {
    let cancelled = false;
    setBriefingLoading(true);

    const fetchBriefing = async () => {
      try {
        const report = generateIntelligenceReport(flight);
        const profile: UserIntelligenceProfile = {
          mode: intelligenceMode,
          frequentTraveler: false,
          preferredTone: 'professional',
        };
        const result = await api.briefing.generate(report, profile, token);
        if (!cancelled) setBriefing(result);
      } catch {
        // fallback to deterministic
      } finally {
        if (!cancelled) setBriefingLoading(false);
      }
    };

    fetchBriefing();
    return () => { cancelled = true; };
  }, [flight.id, intelligenceMode, token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch timeline
  useEffect(() => {
    let cancelled = false;
    setTimelineLoading(true);

    api.tracking.getTimeline(flight.id, token)
      .then(({ events }) => {
        if (!cancelled) setTimeline(events.length > 0 ? events : flight.statusEvents ?? []);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setTimelineLoading(false); });

    return () => { cancelled = true; };
  }, [flight.id, token]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayStatusLine = briefing?.statusLine || status.line;
  const displayExplanation = briefing?.explanation || status.explanation;

  return (
    <div className="px-4 pb-4 pt-0 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
      {/* ── Amberlyn Status Line ── */}
      <div className={`rounded-xl p-4 border ${
        status.color === 'text-red-400' ? 'border-red-400/20 bg-red-400/5' :
        status.color === 'text-amber-400' ? 'border-amber-400/20 bg-amber-400/5' :
        status.color === 'text-emerald-400' ? 'border-emerald-400/20 bg-emerald-400/5' :
        'border-border-subtle bg-bg-elevated/30'
      }`}>
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent-blue" />
          <span className="text-[10px] font-medium text-accent-blue uppercase tracking-wider">Amberlyn</span>
          {briefingLoading && <Loader2 className="w-3 h-3 animate-spin text-text-muted" />}
        </div>
        <h2 className={`text-xl font-bold ${status.color} mb-1`}>
          {displayStatusLine}
        </h2>
        <p className="text-sm text-text-secondary">{displayExplanation}</p>

        {/* AI warnings */}
        {briefing && briefing.keyWarnings.length > 0 && (
          <div className="mt-2 space-y-1">
            {briefing.keyWarnings.map((w, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-text-muted">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}

        {/* AI actions */}
        {briefing && briefing.actions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {briefing.actions.map((a, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-bg-elevated/50 text-text-primary rounded-lg border border-border-subtle">
                {a}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Progress visualization ── */}
      <div className="bg-bg-elevated/30 rounded-xl p-4 border border-border-subtle">
        <div className="flex items-center justify-between mb-3">
          <div className="text-center">
            <div className="text-base font-bold text-text-primary">{flight.departureAirport}</div>
            <div className="text-xs text-text-muted">{formatTime(flight.actualDeparture ?? flight.estimatedDeparture ?? flight.scheduledDeparture)}</div>
            {flight.departureTerminal && <div className="text-[10px] text-text-muted">T{flight.departureTerminal}</div>}
            {flight.departureGate && <div className="text-[10px] text-accent-blue">Gate {flight.departureGate}</div>}
          </div>

          <div className="flex-1 mx-4">
            <div className="relative h-1.5 bg-border-subtle rounded-full">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                  isActive ? 'bg-linear-to-r from-emerald-500 to-emerald-400' :
                  flight.flightStatus === 'landed' ? 'bg-accent-blue' : 'bg-accent-blue/40'
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
          </div>

          <div className="text-center">
            <div className="text-base font-bold text-text-primary">{flight.arrivalAirport}</div>
            <div className="text-xs text-text-muted">{formatTime(flight.actualArrival ?? flight.estimatedArrival ?? flight.scheduledArrival)}</div>
            {flight.arrivalTerminal && <div className="text-[10px] text-text-muted">T{flight.arrivalTerminal}</div>}
            {flight.arrivalGate && <div className="text-[10px] text-accent-blue">Gate {flight.arrivalGate}</div>}
          </div>
        </div>

        {/* Live altitude + speed */}
        {isActive && (altFt || speedKts) && (
          <div className="flex items-center justify-center gap-6 py-2 bg-bg-elevated/50 rounded-lg mt-2">
            {altFt && (
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <ArrowUp className="w-3 h-3 text-text-muted" />
                  <span className="text-sm font-semibold text-text-primary">{altFt.toLocaleString()} ft</span>
                </div>
                <div className="text-[10px] text-text-muted">Altitude</div>
              </div>
            )}
            {speedKts && (
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-text-muted" />
                  <span className="text-sm font-semibold text-text-primary">{speedKts} kts</span>
                </div>
                <div className="text-[10px] text-text-muted">Speed</div>
              </div>
            )}
          </div>
        )}

        {/* Recommended airport arrival (scheduled flights) */}
        {flight.flightStatus === 'scheduled' && (
          <div className="flex items-center justify-between mt-2 py-2 px-3 bg-bg-elevated/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Car className="w-3.5 h-3.5 text-accent-blue" />
              <span className="text-xs text-text-secondary">Leave for airport</span>
            </div>
            <span className="text-xs font-medium text-text-primary">{arrivalTime}</span>
          </div>
        )}
      </div>

      {/* ── Amadeus Delay Prediction (ML-powered) ── */}
      {flight.delayPrediction && flight.delayPrediction.buckets && flight.flightStatus !== 'landed' && (
        <div className="bg-bg-elevated/30 rounded-xl p-4 border border-border-subtle">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-accent-blue" />
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Amadeus Delay Prediction</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {flight.delayPrediction.buckets.map((bucket) => {
              const pct = Math.round(parseFloat(bucket.probability) * 100);
              const label = bucket.result === 'LESS_THAN_30_MINUTES' ? '<30m'
                : bucket.result === 'BETWEEN_30_AND_60_MINUTES' ? '30-60m'
                : bucket.result === 'BETWEEN_60_AND_120_MINUTES' ? '1-2h'
                : '>2h/Cancel';
              const color = bucket.result === 'LESS_THAN_30_MINUTES' ? 'text-emerald-400'
                : bucket.result === 'BETWEEN_30_AND_60_MINUTES' ? 'text-amber-400'
                : 'text-red-400';
              return (
                <div key={bucket.result} className="text-center bg-bg-elevated/50 rounded-lg py-2 px-1">
                  <div className={`text-sm font-bold ${color}`}>{pct}%</div>
                  <div className="text-[9px] text-text-muted leading-tight mt-0.5">{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Intelligence grid ── */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-bg-elevated/30 rounded-lg p-3 text-center border border-border-subtle">
          <div className={`text-lg font-bold ${
            delayRisk.level === 'high' ? 'text-red-400' :
            delayRisk.level === 'medium' ? 'text-amber-400' :
            'text-emerald-400'
          }`}>
            {delayRisk.probability}%
          </div>
          <div className="text-[10px] text-text-muted">Delay Risk</div>
        </div>
        <div className="bg-bg-elevated/30 rounded-lg p-3 text-center border border-border-subtle">
          <div className="text-lg font-bold text-text-primary">
            {flight.durationMinutes ? `${Math.floor(flight.durationMinutes / 60)}h${flight.durationMinutes % 60 > 0 ? ` ${flight.durationMinutes % 60}m` : ''}` : '--'}
          </div>
          <div className="text-[10px] text-text-muted">Duration</div>
        </div>
        {flight.airportOnTimeScore !== null && flight.airportOnTimeScore !== undefined ? (
          <div className="bg-bg-elevated/30 rounded-lg p-3 text-center border border-border-subtle">
            <div className={`text-lg font-bold ${
              flight.airportOnTimeScore >= 0.8 ? 'text-emerald-400' :
              flight.airportOnTimeScore >= 0.6 ? 'text-amber-400' :
              'text-red-400'
            }`}>
              {Math.round(flight.airportOnTimeScore * 100)}%
            </div>
            <div className="text-[10px] text-text-muted">{flight.departureAirport} On-Time</div>
          </div>
        ) : (
          <div className="bg-bg-elevated/30 rounded-lg p-3 text-center border border-border-subtle">
            <div className="text-lg font-bold text-text-primary">
              {flight.aircraftType ?? '--'}
            </div>
            <div className="text-[10px] text-text-muted">Aircraft</div>
          </div>
        )}
      </div>

      {/* ── Status Event Timeline ── */}
      <div className="bg-bg-elevated/30 rounded-xl border border-border-subtle overflow-hidden">
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm text-text-secondary hover:bg-bg-elevated/30 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-accent-blue" />
            <span className="font-medium">Status Timeline</span>
            <span className="text-xs text-text-muted">({timeline.length})</span>
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${showTimeline ? 'rotate-180' : ''}`} />
        </button>

        {showTimeline && (
          <div className="px-4 pb-4 border-t border-border-subtle">
            {timelineLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin text-text-muted" />
              </div>
            ) : timeline.length === 0 ? (
              <div className="text-center py-4 text-xs text-text-muted">
                No status updates yet. We&apos;ll notify you when something changes.
              </div>
            ) : (
              <div className="space-y-0 pt-3">
                {timeline.map((event, i) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        i === 0 ? 'bg-accent-blue/10' : 'bg-bg-elevated/50'
                      }`}>
                        {i === 0 && isActive ? (
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75 animate-ping" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue" />
                          </span>
                        ) : (
                          eventIcon(event.eventType)
                        )}
                      </div>
                      {i < timeline.length - 1 && <div className="w-px flex-1 bg-border-subtle my-1" />}
                    </div>
                    <div className="pb-3 min-w-0">
                      <div className="text-sm font-medium text-text-primary">
                        {formatEventType(event.eventType)}
                      </div>
                      {event.oldStatus && event.newStatus && (
                        <div className="text-xs text-text-muted mt-0.5">
                          {event.oldStatus} → {event.newStatus}
                        </div>
                      )}
                      {event.delayMinutes && (
                        <div className="text-xs text-amber-400 mt-0.5">+{event.delayMinutes} min delay</div>
                      )}
                      <div className="text-[10px] text-text-muted mt-1">
                        {relativeTime(event.eventTime)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Action buttons ── */}
      <div className="flex gap-2">
        {/* Check-In button (when URL available and flight is in check-in window) */}
        {flight.checkInUrl && !['landed', 'cancelled'].includes(flight.flightStatus) && (
          <a
            href={flight.checkInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-xl hover:brightness-110 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Check In
          </a>
        )}
        <Link
          href={`/bookings/${flight.bookingId}/track`}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent-blue text-white text-sm font-medium rounded-xl hover:brightness-110 transition-all"
        >
          <Map className="w-4 h-4" />
          View on Map
        </Link>
      </div>
    </div>
  );
}
