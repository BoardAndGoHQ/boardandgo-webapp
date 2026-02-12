'use client';

import { useState } from 'react';
import type { TrackedFlight, FlightStatusEvent, FlightPosition } from '@/lib/api';
import type { AirportCoord } from '@/components/flight-map';
import { IconChevronDown, IconChevronUp, IconPlane } from '@/components/icons';
import { greatCircleDistance } from '@/lib/arc-utils';
import { getTrackedDelayRisk, getRecommendedArrival } from '@/lib/insights';

/* ── Helpers ── */
function formatTime(iso: string | null) {
  if (!iso) return '--:--';
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatDate(iso: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
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

function elapsedStr(flight: TrackedFlight, progress: number, totalDistanceMi: number): string {
  const dep = flight.actualDeparture ?? flight.estimatedDeparture ?? flight.scheduledDeparture;
  if (!dep) return '';
  const elapsed = Date.now() - new Date(dep).getTime();
  if (elapsed < 0) return '';
  const h = Math.floor(elapsed / 3_600_000);
  const m = Math.floor((elapsed % 3_600_000) / 60_000);
  const distFlown = Math.round(progress * totalDistanceMi);
  return `${h}h ${m}m · ${distFlown.toLocaleString()} mi ago`;
}

function remainingStr(flight: TrackedFlight, progress: number, totalDistanceMi: number): string {
  const arr = flight.estimatedArrival ?? flight.scheduledArrival;
  if (!arr) return '';
  const remaining = new Date(arr).getTime() - Date.now();
  if (remaining < 0) return 'Arrived';
  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const distLeft = Math.round((1 - progress) * totalDistanceMi);
  return `in ${h}h ${m}m · ${distLeft.toLocaleString()} mi`;
}

const statusColors: Record<string, { label: string; color: string }> = {
  scheduled: { label: 'Scheduled', color: 'text-accent-teal' },
  active: { label: 'In Flight', color: 'text-green-400' },
  landed: { label: 'Landed', color: 'text-text-muted' },
  cancelled: { label: 'Cancelled', color: 'text-red-400' },
  diverted: { label: 'Diverted', color: 'text-orange-400' },
  unknown: { label: 'Unknown', color: 'text-text-muted' },
};

/* ── Airline logo CDN ── */
const AIRLINE_LOGO_URL = (iata: string) => `https://images.kiwi.com/airlines/64/${iata}.png`;

/* ── Component ── */
interface FlightInfoPanelProps {
  flight: TrackedFlight & { statusEvents: FlightStatusEvent[] };
  position?: FlightPosition;
  airports: Map<string, AirportCoord>;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function FlightInfoPanel({ flight, position, airports, collapsed, onToggleCollapse }: FlightInfoPanelProps) {
  const [statusOpen, setStatusOpen] = useState(true);

  const depAirport = airports.get(flight.departureAirport);
  const arrAirport = airports.get(flight.arrivalAirport);

  const progress = getFlightProgress(flight);
  const statusCfg = statusColors[flight.flightStatus] ?? statusColors.unknown;

  // Distance calculation
  let totalDistanceKm = 0;
  let totalDistanceMi = 0;
  if (depAirport && arrAirport) {
    totalDistanceKm = greatCircleDistance(
      { lat: depAirport.latitude, lon: depAirport.longitude },
      { lat: arrAirport.latitude, lon: arrAirport.longitude }
    );
    totalDistanceMi = Math.round(totalDistanceKm * 0.621371);
  }

  const bestDep = flight.actualDeparture ?? flight.estimatedDeparture ?? flight.scheduledDeparture;
  const bestArr = flight.actualArrival ?? flight.estimatedArrival ?? flight.scheduledArrival;

  // Altitude/speed from live position
  const altFt = position?.altitude ? Math.round(position.altitude) : null;
  const speedKts = position?.speed ? Math.round(position.speed * 0.539957) : null; // km/h → knots

  if (collapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className="bg-[#1a1f2e]/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 hover:bg-[#1e2438]/95 transition-colors"
      >
        <IconPlane className="w-4 h-4 text-accent-teal" />
        <span className="text-sm font-semibold text-text-primary">{flight.airlineCode}{flight.flightNumber}</span>
        <span className={`text-xs ${statusCfg.color}`}>{statusCfg.label}</span>
      </button>
    );
  }

  return (
    <div className="bg-[#1a1f2e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl w-[380px] max-h-full overflow-y-auto scrollbar-thin flex flex-col">
      {/* ── Header ── */}
      <div className="px-5 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Airline logo */}
            <img
              src={AIRLINE_LOGO_URL(flight.airlineCode)}
              alt={flight.airlineCode}
              width={36}
              height={36}
              className="w-9 h-9 rounded-lg object-contain bg-white/10 p-1"
              onError={(e) => {
                // Fallback to icon if logo fails
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hidden">
              <IconPlane className="w-5 h-5 text-accent-teal" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-text-primary">{flight.airlineCode}{flight.flightNumber}</span>
                {flight.aircraftType && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-white/10 text-text-secondary rounded">
                    {flight.aircraftType}
                  </span>
                )}
              </div>
              <div className="text-xs text-text-muted">{flight.airlineName ?? flight.airlineCode}</div>
            </div>
          </div>
          <button onClick={onToggleCollapse} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-text-muted">
            <IconChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── STATUS INFO ── */}
      <div className="px-5 pt-3">
        <button
          onClick={() => setStatusOpen(!statusOpen)}
          className="flex items-center justify-between w-full text-xs font-medium text-text-muted uppercase tracking-wider mb-3"
        >
          Status Info
          {statusOpen ? <IconChevronUp className="w-3 h-3" /> : <IconChevronDown className="w-3 h-3" />}
        </button>

        {statusOpen && (
          <div className="space-y-4 pb-4">
            {/* Route row: DEP → ARR */}
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">{flight.departureAirport}</div>
                <div className="text-sm text-text-secondary">{formatTime(bestDep)}</div>
              </div>

              <div className="flex-1 flex items-center justify-center px-3">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-teal" />
                  <div className="w-12 h-px bg-text-muted/30 relative">
                    <IconPlane className="w-3.5 h-3.5 text-text-secondary absolute -top-[7px] left-1/2 -translate-x-1/2 rotate-90" />
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${flight.flightStatus === 'landed' ? 'bg-accent-teal' : 'bg-text-muted/40'}`} />
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">{flight.arrivalAirport}</div>
                <div className="text-sm text-text-secondary">{formatTime(bestArr)}</div>
              </div>
            </div>

            {/* Delay badges */}
            <div className="flex items-center justify-between text-xs">
              {flight.departureDelayMinutes > 0 ? (
                <span className="text-red-400">{flight.departureDelayMinutes}m Late · {formatTime(flight.scheduledDeparture)}</span>
              ) : (
                <span className={statusCfg.color}>{statusCfg.label}</span>
              )}
              {flight.arrivalDelayMinutes > 0 ? (
                <span className="text-red-400">{flight.arrivalDelayMinutes}m Late</span>
              ) : (
                <span className="text-green-400">On Time</span>
              )}
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex h-2 rounded-full overflow-hidden bg-white/5">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            </div>

            {/* Distance / Time stats */}
            {totalDistanceMi > 0 && flight.flightStatus === 'active' && (
              <div className="flex justify-between text-xs text-text-muted">
                <span>{elapsedStr(flight, progress, totalDistanceMi)}</span>
                <span>{remainingStr(flight, progress, totalDistanceMi)}</span>
              </div>
            )}

            {/* Departure details */}
            <div className="bg-white/5 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-accent-teal/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-accent-teal" />
                </div>
                <span className="text-xs font-medium text-text-primary">
                  {depAirport?.name ?? flight.departureAirportName ?? flight.departureAirport}
                </span>
              </div>
              <div className="pl-7 text-xs text-text-muted space-y-0.5">
                <div>{formatDate(bestDep)}</div>
                {flight.departureTerminal && <div>Terminal {flight.departureTerminal}</div>}
                {flight.departureGate && <div>Gate {flight.departureGate}</div>}
              </div>
            </div>

            {/* Arrival details */}
            <div className="bg-white/5 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-text-muted/20 flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-full ${flight.flightStatus === 'landed' ? 'bg-accent-teal' : 'bg-text-muted'}`} />
                </div>
                <span className="text-xs font-medium text-text-primary">
                  {arrAirport?.name ?? flight.arrivalAirportName ?? flight.arrivalAirport}
                </span>
              </div>
              <div className="pl-7 text-xs text-text-muted space-y-0.5">
                <div>{formatDate(bestArr)}</div>
                {flight.arrivalTerminal && <div>Terminal {flight.arrivalTerminal}</div>}
                {flight.arrivalGate && <div>Gate {flight.arrivalGate}</div>}
              </div>
            </div>

            {/* Live altitude + speed */}
            {flight.flightStatus === 'active' && (altFt || speedKts) && (
              <div className="flex items-center justify-center gap-4 py-2 bg-white/5 rounded-lg">
                {altFt && (
                  <div className="text-center">
                    <div className="text-sm font-semibold text-text-primary">{altFt.toLocaleString()} ft</div>
                    <div className="text-[10px] text-text-muted uppercase">Altitude</div>
                  </div>
                )}
                {altFt && speedKts && <div className="w-px h-6 bg-white/10" />}
                {speedKts && (
                  <div className="text-center">
                    <div className="text-sm font-semibold text-text-primary">{speedKts} kts</div>
                    <div className="text-[10px] text-text-muted uppercase">Speed</div>
                  </div>
                )}
              </div>
            )}

            {/* ── Flight Intelligence ── */}
            {(() => {
              const delayRisk = getTrackedDelayRisk(flight);
              const arrival = getRecommendedArrival(
                flight.scheduledDeparture,
                flight.departureAirport,
                flight.arrivalAirport,
                flight.departureDelayMinutes
              );
              const arrivalTime = arrival.recommendedTime.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', hour12: false,
              });

              return (
                <div className="bg-white/5 rounded-lg p-3 space-y-2.5">
                  <div className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
                    Flight Intelligence
                  </div>
                  {/* Delay Risk */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Delay Risk</span>
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${
                      delayRisk.level === 'high' ? 'text-red-400' :
                      delayRisk.level === 'medium' ? 'text-amber-400' :
                      'text-emerald-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        delayRisk.level === 'high' ? 'bg-red-400' :
                        delayRisk.level === 'medium' ? 'bg-amber-400' :
                        'bg-emerald-400'
                      }`} />
                      {delayRisk.level === 'high' ? 'High' : delayRisk.level === 'medium' ? 'Moderate' : 'Low'}
                    </span>
                  </div>
                  {/* Recommended Airport Arrival */}
                  {flight.flightStatus === 'scheduled' && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">Arrive at Airport</span>
                      <span className="text-xs font-medium text-text-primary">
                        {arrivalTime} ({arrival.label} {arrival.bufferHours}h)
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
