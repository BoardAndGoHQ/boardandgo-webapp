/**
 * Connection Card — Journey Intelligence UI
 *
 * Displays connection information between legs of a multi-leg journey.
 * Uses HUMAN LANGUAGE — never shows "buffer" or internal terms.
 *
 * Display rules by intelligence mode:
 *   Minimal → only show if risk is medium or higher
 *   Balanced → show time to next flight + risk status
 *   Deep → show landing time, boarding close, estimated walk time
 */

'use client';

import type { ConnectionAnalysis, JourneyConnectionReport } from '@/lib/api';
import type { IntelligenceMode } from '@/hooks/use-intelligence-mode';
import { IconClock, IconArrowRight } from '@/components/icons';
import { CircleCheck, AlertTriangle, CircleX } from 'lucide-react';

interface ConnectionCardProps {
  connection: ConnectionAnalysis;
  mode: IntelligenceMode;
  /** Arriving flight's estimated/actual arrival time (ISO) */
  arrivingFlightArrival: string | null;
  /** Departing flight's scheduled departure time (ISO) */
  departingFlightDeparture: string;
}

function formatTimeShort(iso: string | null): string {
  if (!iso) return '--:--';
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Risk status emoji + color
 */
function getRiskDisplay(level: ConnectionAnalysis['riskLevel']): {
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  borderClass: string;
} {
  switch (level) {
    case 'low':
      return { icon: <CircleCheck className="w-4 h-4" />, colorClass: 'text-emerald-400', bgClass: 'bg-emerald-400/5', borderClass: 'border-emerald-400/20' };
    case 'medium':
      return { icon: <AlertTriangle className="w-4 h-4" />, colorClass: 'text-amber-400', bgClass: 'bg-amber-400/5', borderClass: 'border-amber-400/20' };
    case 'high':
    case 'critical':
      return { icon: <CircleX className="w-4 h-4" />, colorClass: 'text-red-400', bgClass: 'bg-red-400/5', borderClass: 'border-red-400/20' };
  }
}

export function ConnectionCard({ connection, mode, arrivingFlightArrival, departingFlightDeparture }: ConnectionCardProps) {
  // In minimal mode, only show if there's risk
  if (mode === 'minimal' && connection.riskLevel === 'low') return null;

  const risk = getRiskDisplay(connection.riskLevel);
  const landingTime = formatTimeShort(arrivingFlightArrival);
  const nextDepartureTime = formatTimeShort(departingFlightDeparture);

  return (
    <div className={`rounded-xl border ${risk.borderClass} ${risk.bgClass} p-4 transition-all`}>
      {/* Header: Connection airport + status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <IconArrowRight className="w-4 h-4 text-text-muted" />
          <span className="text-sm font-medium text-text-secondary">
            {connection.connectionAirport} Connection
          </span>
        </div>
        <span className={`text-sm font-medium flex items-center gap-1.5 ${risk.colorClass}`}>
          {risk.icon} {connection.humanStatus}
        </span>
      </div>

      {/* Main: Time to next flight */}
      <div className="mb-2">
        <div className="flex items-center gap-2">
          <IconClock className={`w-4 h-4 ${risk.colorClass}`} />
          <span className="text-base font-semibold text-text-primary">
            Time to your next flight: {connection.minutesToNextFlight} min
          </span>
        </div>
      </div>

      {/* Balanced mode: show terminal change + status explanation */}
      {mode !== 'minimal' && (
        <div className="space-y-1.5 text-sm">
          {connection.terminalChange && (
            <div className="flex items-center gap-2 text-text-muted">
              <span>Terminal change:</span>
              <span className="text-text-secondary font-medium">
                T{connection.arrivingTerminal} → T{connection.departingTerminal}
              </span>
            </div>
          )}

          {connection.selfTransfer && (
            <div className="text-text-muted">
              Self-transfer — you must collect and recheck your luggage
            </div>
          )}

          <div className="text-text-muted">
            {connection.humanExplanation}
          </div>
        </div>
      )}

      {/* Deep mode: show the math — landing time, boarding close, walk estimate */}
      {mode === 'deep' && (
        <div className="mt-3 pt-3 border-t border-border-subtle space-y-1 text-xs text-text-secondary">
          <div className="flex justify-between">
            <span className="text-text-muted">You land at</span>
            <span className="font-medium">{landingTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Next flight departs</span>
            <span className="font-medium">{nextDepartureTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Min connection time ({connection.connectionAirport})</span>
            <span className="font-medium">{connection.minimumConnectionTime} min</span>
          </div>
          {connection.factors.length > 0 && (
            <div className="pt-2 space-y-0.5">
              {connection.factors.map((factor, i) => (
                <div key={i} className="flex items-start gap-1.5 text-text-muted">
                  <span className="text-text-muted/60 mt-0.5">•</span>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Journey Connection Summary — Shows all connections for a multi-leg journey
 */
interface JourneyConnectionsProps {
  connectionReport: JourneyConnectionReport;
  flights: Array<{
    legIndex: number;
    estimatedArrival: string | null;
    scheduledArrival: string;
    scheduledDeparture: string;
    estimatedDeparture: string | null;
  }>;
  mode: IntelligenceMode;
}

export function JourneyConnections({ connectionReport, flights, mode }: JourneyConnectionsProps) {
  if (!connectionReport.isMultiLeg || connectionReport.connections.length === 0) return null;

  // In minimal mode, only show if any connection has risk
  if (mode === 'minimal' && connectionReport.worstRiskLevel === 'low') return null;

  return (
    <div className="space-y-3">
      {connectionReport.connections.map((conn, i) => {
        const arrivingFlight = flights.find((f) => f.legIndex === conn.arrivingLegIndex);
        const departingFlight = flights.find((f) => f.legIndex === conn.departingLegIndex);

        return (
          <ConnectionCard
            key={i}
            connection={conn}
            mode={mode}
            arrivingFlightArrival={arrivingFlight?.estimatedArrival ?? arrivingFlight?.scheduledArrival ?? null}
            departingFlightDeparture={departingFlight?.estimatedDeparture ?? departingFlight?.scheduledDeparture ?? ''}
          />
        );
      })}
    </div>
  );
}
