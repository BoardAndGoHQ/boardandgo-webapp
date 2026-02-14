/**
 * Situation Room — The Concierge Experience
 *
 * Big status line + one sentence explanation.
 * Intelligence card only appears when needed.
 * Deep view on tap.
 *
 * Rule: "When I open it, I immediately know:
 *        Am I safe? Do I need to act? Or can I relax?"
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, type TrackedFlight, type FlightStatusEvent, type JourneyConnectionReport, type JourneyStatus } from '@/lib/api';
import { generateIntelligenceReport, type FlightIntelligenceReport, type AgentBriefing, type UserIntelligenceProfile } from '@/lib/insights';
import { useIntelligenceMode } from '@/hooks/use-intelligence-mode';
import { useAuth } from '@/context/auth';
import { IconPlane, IconArrowRight, IconLoader } from '@/components/icons';
import { ArrowRight, Layers, ChevronDown } from 'lucide-react';
import { JourneyConnections } from '@/components/connection-card';

type FlightWithEvents = TrackedFlight & { statusEvents: FlightStatusEvent[] };

interface SituationRoomProps {
  flight: FlightWithEvents;
  token: string;
  allFlightsCount: number;
  onViewAll?: () => void;
  /** All flights in the booking (for multi-leg journey display) */
  allFlights?: FlightWithEvents[];
  /** Connection analysis from backend (if multi-leg) */
  connectionReport?: JourneyConnectionReport | null;
  /** Journey-level status from backend */
  journeyStatus?: JourneyStatus | null;
}

function formatTime(iso: string | null) {
  if (!iso) return '--:--';
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Determine the big status line based on flight state.
 * This is the deterministic fallback — Gemini enriches it when available.
 */
function getStatusLineFromReport(
  report: FlightIntelligenceReport,
  flight: FlightWithEvents,
): { statusLine: string; explanation: string; showAction: boolean } {
  const recTime = new Date(report.recommendedArrivalTime);
  const recTimeStr = recTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  if (flight.flightStatus === 'cancelled') {
    return {
      statusLine: 'Flight cancelled.',
      explanation: 'Contact your airline for rebooking options.',
      showAction: false,
    };
  }

  if (flight.flightStatus === 'active' || flight.flightStatus === 'en-route') {
    return {
      statusLine: 'In flight.',
      explanation: `${report.flightNumber} is currently airborne.`,
      showAction: false,
    };
  }

  if (flight.flightStatus === 'landed') {
    return {
      statusLine: 'Arrived.',
      explanation: `${report.flightNumber} has landed safely.`,
      showAction: false,
    };
  }

  // Upcoming flight logic
  if (report.minutesUntilRecommendedArrival <= 0 && report.hoursUntilDeparture > 0) {
    return {
      statusLine: 'Leave now.',
      explanation: 'You should already be heading to the airport.',
      showAction: true,
    };
  }

  if (report.minutesUntilRecommendedArrival <= 60 && report.minutesUntilRecommendedArrival > 0) {
    return {
      statusLine: `Leave in ${report.minutesUntilRecommendedArrival} min.`,
      explanation: `Recommended arrival at airport is ${recTimeStr}.`,
      showAction: true,
    };
  }

  if (report.currentDelayMinutes > 30) {
    return {
      statusLine: `Delayed ${report.currentDelayMinutes} min.`,
      explanation: 'Your flight is experiencing significant delays. Monitor closely.',
      showAction: false,
    };
  }

  if (report.monitoringLevel === 'high') {
    return {
      statusLine: 'Monitor closely.',
      explanation: 'Elevated risk factors detected for this flight.',
      showAction: false,
    };
  }

  if (report.monitoringLevel === 'medium') {
    return {
      statusLine: 'Some concerns.',
      explanation: 'Minor risk factors detected. We\'re keeping an eye on it.',
      showAction: false,
    };
  }

  // All clear
  return {
    statusLine: 'You\'re clear.',
    explanation: 'All systems normal. We\'re monitoring your flight.',
    showAction: false,
  };
}

export function SituationRoom({ flight, token, allFlightsCount, onViewAll, allFlights, connectionReport, journeyStatus }: SituationRoomProps) {
  const [intelligenceMode] = useIntelligenceMode();
  const { user } = useAuth(); // Get user context for personalization
  const [briefing, setBriefing] = useState<AgentBriefing | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Generate deterministic report
  const report = generateIntelligenceReport(flight);

  // Extract passenger name from user metadata
  const passengerName = user?.user_metadata?.full_name || null;

  // Mock location context (in real implementation, this would come from geolocation API)
  // For demo purposes, we'll simulate different scenarios
  const passengerLocation = {
    atAirport: false, // Would be determined by geofencing
    airportCode: null,
    estimatedWalkingTimeToGate: null,
    currentTerminal: null,
    userAgentLocation: 'At home', // Would come from geolocation
  };

  // Determine urgency level based on connection risk
  const urgencyLevel = connectionReport?.worstRiskLevel === 'high' ? 'urgent' : 
                      connectionReport?.worstRiskLevel === 'medium' ? 'alert' : 'calm';

  // Fetch AI briefing on mount (non-blocking)
  useEffect(() => {
    let cancelled = false;

    const fetchBriefing = async () => {
      setLoading(true);
      try {
        const profile: UserIntelligenceProfile = {
          mode: intelligenceMode,
          frequentTraveler: false, // TODO: Calculate from flight history
          preferredTone: 'professional',
        };

        // Build enhanced journey context for Amberlyn with passenger personalization
        const journeyCtx = connectionReport?.isMultiLeg && allFlights && allFlights.length > 1
          ? {
              isMultiLeg: true,
              journeyStatus: journeyStatus ?? 'upcoming',
              totalLegs: allFlights.length,
              currentLegIndex: flight.legIndex ?? 0,
              passengerName, // Personalization!
              passengerLocation, // Real-time context!
              connections: connectionReport.connections.map((c) => ({
                connectionAirport: c.connectionAirport,
                minutesToNextFlight: c.minutesToNextFlight,
                riskLevel: c.riskLevel,
                humanStatus: c.humanStatus,
                humanExplanation: c.humanExplanation,
                terminalChange: c.terminalChange,
                arrivingTerminal: c.arrivingTerminal ?? null,
                departingTerminal: c.departingTerminal ?? null,
                minimumConnectionTime: c.minimumConnectionTime,
                // Enhanced context for agentic behavior
                boardingClosesInMinutes: c.minutesToNextFlight > 30 ? 20 : Math.max(5, c.minutesToNextFlight - 10),
                gateWalkingTimeMinutes: c.terminalChange ? 15 : 8,
                securityWaitTimeMinutes: c.selfTransfer ? 25 : null,
              })),
              worstRiskLevel: connectionReport.worstRiskLevel,
              overallHumanStatus: connectionReport.overallHumanStatus,
              urgencyLevel, // Dynamic tone adjustment!
            }
          : undefined;

        const result = await api.briefing.generate(report, profile, token, journeyCtx);
        if (!cancelled) setBriefing(result);
      } catch {
        // Fallback to deterministic
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBriefing();
    return () => { cancelled = true; };
  }, [flight.id, intelligenceMode, token, connectionReport?.worstRiskLevel, journeyStatus, passengerName]); // eslint-disable-line react-hooks/exhaustive-deps

  // Use AI briefing if available, otherwise deterministic
  const deterministicStatus = getStatusLineFromReport(report, flight);
  const statusLine = briefing?.statusLine || deterministicStatus.statusLine;
  const explanation = briefing?.explanation || deterministicStatus.explanation;
  const keyWarnings = briefing?.keyWarnings || [];
  const actions = briefing?.actions || [];

  // Determine status color
  const isUrgent = report.monitoringLevel === 'high' || flight.flightStatus === 'cancelled';
  const isCaution = report.monitoringLevel === 'medium' || report.currentDelayMinutes > 15;
  const isOk = !isUrgent && !isCaution;

  const statusColor = isUrgent ? 'text-red-400' : isCaution ? 'text-amber-400' : 'text-emerald-400';
  const statusBg = isUrgent ? 'bg-red-400/5' : isCaution ? 'bg-amber-400/5' : 'bg-emerald-400/5';
  const statusBorder = isUrgent ? 'border-red-400/20' : isCaution ? 'border-amber-400/20' : 'border-emerald-400/20';

  return (
    <div className="space-y-4">
      {/* Main Status Card */}
      <div className={`rounded-2xl border ${statusBorder} ${statusBg} p-6 transition-all`}>
        {/* Flight identifier */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <IconPlane className={`w-4 h-4 ${statusColor}`} />
            <span className="text-sm font-medium text-text-secondary">
              {flight.airlineCode}{flight.flightNumber}
            </span>
            <span className="text-text-muted">•</span>
            <span className="text-sm text-text-muted">
              {flight.departureAirport} → {flight.arrivalAirport}
            </span>
          </div>
          {allFlightsCount > 1 && onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              +{allFlightsCount - 1} more
            </button>
          )}
        </div>

        {/* Big Status Line */}
        <div className="mb-2">
          <h1 className={`text-3xl md:text-4xl font-bold ${statusColor} flex items-center gap-3`}>
            {statusLine}
            {loading && <IconLoader className="w-5 h-5 animate-spin text-text-muted" />}
          </h1>
        </div>

        {/* Explanation */}
        <p className="text-text-secondary text-base mb-4">
          {explanation}
        </p>

        {/* Key Warnings (if any, in balanced/deep mode) */}
        {intelligenceMode !== 'minimal' && keyWarnings.length > 0 && (
          <div className="mb-4 space-y-1.5">
            {keyWarnings.map((warning, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-text-muted">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>{warning}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((action, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-elevated/50 text-sm text-text-primary border border-border-subtle"
              >
                <ArrowRight className="w-3.5 h-3.5 text-accent-blue" />
                {action}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Connection Intelligence (multi-leg journeys) */}
      {connectionReport && connectionReport.isMultiLeg && allFlights && allFlights.length > 1 && (
        <JourneyConnections
          connectionReport={connectionReport}
          flights={allFlights}
          mode={intelligenceMode}
        />
      )}

      {/* Journey Status Badge (multi-leg) */}
      {journeyStatus && journeyStatus !== 'upcoming' && allFlights && allFlights.length > 1 && (
        <div className="glass-card rounded-xl border border-border-subtle px-4 py-2.5 flex items-center gap-2">
          <IconPlane className="w-4 h-4 text-accent-blue" />
          <span className="text-sm text-text-secondary">
            Journey: <span className="font-medium text-text-primary capitalize">
              {journeyStatus === 'connection_active' ? 'Connecting' :
               journeyStatus === 'checkin_window' ? 'Check-in Open' :
               journeyStatus === 'boarding_soon' ? 'Boarding Soon' :
               journeyStatus === 'in_air' ? 'In Flight' :
               journeyStatus === 'disrupted' ? 'Disruption' :
               journeyStatus}
            </span>
          </span>
        </div>
      )}

      {/* Intelligence Details (expandable, not in minimal mode) */}
      {intelligenceMode !== 'minimal' && report.monitoringLevel !== 'low' && (
        <div className="glass-card rounded-xl border border-border-subtle overflow-hidden">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-3 flex items-center justify-between text-sm text-text-secondary hover:bg-bg-elevated/30 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent-blue" />
              Flight Intelligence
              <span className="text-xs px-1.5 py-0.5 bg-accent-blue/10 text-accent-blue rounded">Beta</span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </button>

          {expanded && (
            <div className="px-4 pb-4 border-t border-border-subtle">
              <div className="grid grid-cols-2 gap-3 pt-3">
                <div className="bg-bg-elevated/50 rounded-lg p-3">
                  <div className="text-xs text-text-muted mb-1">Delay Probability</div>
                  <div className="text-lg font-semibold text-text-primary">{report.delayProbability}%</div>
                </div>
                <div className="bg-bg-elevated/50 rounded-lg p-3">
                  <div className="text-xs text-text-muted mb-1">Gate Change Risk</div>
                  <div className="text-lg font-semibold text-text-primary">{report.gateChangeRisk}%</div>
                </div>
                <div className="bg-bg-elevated/50 rounded-lg p-3">
                  <div className="text-xs text-text-muted mb-1">Overall Risk</div>
                  <div className="text-lg font-semibold text-text-primary">{report.overallRiskScore}%</div>
                </div>
                <div className="bg-bg-elevated/50 rounded-lg p-3">
                  <div className="text-xs text-text-muted mb-1">Monitoring</div>
                  <div className={`text-lg font-semibold capitalize ${
                    report.monitoringLevel === 'high' ? 'text-red-400' :
                    report.monitoringLevel === 'medium' ? 'text-amber-400' :
                    'text-emerald-400'
                  }`}>{report.monitoringLevel}</div>
                </div>
              </div>

              {/* Deep mode: show all factors */}
              {intelligenceMode === 'deep' && report.reasoningFactors.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border-subtle">
                  <div className="text-xs text-text-muted mb-2">Contributing Factors</div>
                  <div className="space-y-1">
                    {report.reasoningFactors.map((factor, i) => (
                      <div key={i} className="text-xs text-text-secondary flex items-start gap-2">
                        <span className="text-text-muted">•</span>
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick link to full tracking */}
      <Link
        href={`/bookings/${flight.bookingId}/track`}
        className="flex items-center justify-center gap-2 px-4 py-2.5 glass-card rounded-xl border border-border-subtle text-sm text-text-secondary hover:text-text-primary hover:border-accent-blue/30 transition-all"
      >
        <span>View Full Tracking</span>
        <IconArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

/**
 * Empty Situation Room — When no flights are being tracked
 */
export function EmptySituationRoom() {
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-elevated/30 p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-blue/10 flex items-center justify-center">
        <IconPlane className="w-8 h-8 text-accent-blue/50" />
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">No flights to monitor</h2>
      <p className="text-text-muted text-sm mb-6 max-w-sm mx-auto">
        Track a flight to see your personalized briefing and get proactive updates.
      </p>
      <Link
        href="/track"
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent-blue text-white font-medium text-sm rounded-xl hover:brightness-110 transition-all shadow-lg shadow-accent-blue/20"
      >
        <IconPlane className="w-4 h-4" />
        Track a Flight
      </Link>
    </div>
  );
}
