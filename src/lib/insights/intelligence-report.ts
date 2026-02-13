/**
 * Flight Intelligence Report — Canonical Contract
 *
 * Aggregates all deterministic intelligence modules into a single structured report.
 * This is the "contract" fed to Gemini for interpretation.
 * 
 * IMPORTANT: This object is generated purely by deterministic logic.
 * No LLM involvement. No hallucination possible.
 */

import { predictDepartureDelay, type DelayPrediction } from './delay-risk';
import { getRecommendedArrival, type AirportArrivalResult } from './airport-arrival';

export type MonitoringLevel = 'low' | 'medium' | 'high';

export interface FlightIntelligenceReport {
  // Core metrics (deterministic)
  delayProbability: number;           // 0–95%
  delayLevel: 'low' | 'medium' | 'high';
  connectionRiskScore: number | null; // 0–100, null if direct flight
  connectionRiskLevel: 'low' | 'medium' | 'high' | 'critical' | null;
  gateChangeRisk: number;             // 0–100 heuristic
  
  // Recommendations
  recommendedArrivalTime: string;     // ISO string
  recommendedArrivalLabel: string;    // "International" or "Domestic"
  checkInRecommendation: string;      // "Online check-in opens in X hours"
  
  // Aggregated assessment
  monitoringLevel: MonitoringLevel;
  overallRiskScore: number;           // 0–100 weighted composite
  
  // Contributing factors (for transparency)
  reasoningFactors: string[];
  
  // Flight context
  flightNumber: string;
  route: string;                      // "ACC → LHR"
  departureTime: string;              // ISO
  status: string;
  currentDelayMinutes: number;
  
  // Time context
  hoursUntilDeparture: number;
  minutesUntilRecommendedArrival: number;
}

/** Minimal flight data needed to generate report */
interface FlightForReport {
  airlineCode: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: string;
  estimatedDeparture?: string | null;
  departureDelayMinutes: number;
  departureGate?: string | null;
  flightStatus: string;
  // Optional connection data
  connectionRiskScore?: number | null;
  connectionRiskLevel?: 'low' | 'medium' | 'high' | 'critical' | null;
}

/**
 * Generate the canonical FlightIntelligenceReport from flight data.
 * Pure deterministic. O(1).
 */
export function generateIntelligenceReport(flight: FlightForReport): FlightIntelligenceReport {
  const now = Date.now();
  const depTime = new Date(flight.estimatedDeparture ?? flight.scheduledDeparture).getTime();
  const hoursUntilDeparture = Math.max(0, (depTime - now) / 3_600_000);
  
  // Delay prediction
  const delayPred = predictDepartureDelay({
    departureAirport: flight.departureAirport,
    arrivalAirport: flight.arrivalAirport,
    scheduledDeparture: flight.scheduledDeparture,
    estimatedDeparture: flight.estimatedDeparture,
    departureDelayMinutes: flight.departureDelayMinutes,
    flightStatus: flight.flightStatus,
  });
  
  // Airport arrival recommendation
  const arrivalRec = getRecommendedArrival(
    flight.estimatedDeparture ?? flight.scheduledDeparture,
    flight.departureAirport,
    flight.arrivalAirport,
    flight.departureDelayMinutes,
  );
  
  const minutesUntilRecommendedArrival = Math.round(
    (arrivalRec.recommendedTime.getTime() - now) / 60_000
  );
  
  // Gate change risk heuristic
  // Higher risk closer to departure if no gate assigned yet
  let gateChangeRisk = 10; // baseline
  if (!flight.departureGate) {
    if (hoursUntilDeparture < 2) gateChangeRisk = 50;
    else if (hoursUntilDeparture < 4) gateChangeRisk = 30;
    else if (hoursUntilDeparture < 8) gateChangeRisk = 20;
  }
  
  // Check-in recommendation
  const checkInHours = hoursUntilDeparture > 24 
    ? Math.round(hoursUntilDeparture - 24)
    : 0;
  const checkInRecommendation = hoursUntilDeparture > 24
    ? `Online check-in opens in ~${checkInHours} hours`
    : hoursUntilDeparture > 0
      ? 'Check-in is open — check in now if you haven\'t'
      : 'Check-in closed';
  
  // Aggregated reasoning factors
  const reasoningFactors = [...delayPred.factors.map(f => f.label)];
  
  if (flight.connectionRiskLevel === 'high' || flight.connectionRiskLevel === 'critical') {
    reasoningFactors.push(`Connection risk is ${flight.connectionRiskLevel}`);
  }
  
  if (gateChangeRisk >= 30) {
    reasoningFactors.push('Gate not yet assigned — may change');
  }
  
  if (flight.departureDelayMinutes > 15) {
    reasoningFactors.push(`Currently delayed ${flight.departureDelayMinutes} minutes`);
  }
  
  // Overall risk score (weighted composite)
  let overallRiskScore = delayPred.probability * 0.4; // 40% delay
  if (flight.connectionRiskScore !== null && flight.connectionRiskScore !== undefined) {
    overallRiskScore += flight.connectionRiskScore * 0.4; // 40% connection
  }
  overallRiskScore += gateChangeRisk * 0.2; // 20% gate
  overallRiskScore = Math.round(Math.min(100, overallRiskScore));
  
  // Monitoring level determination
  let monitoringLevel: MonitoringLevel = 'low';
  if (overallRiskScore >= 50 || delayPred.level === 'high' || 
      flight.connectionRiskLevel === 'critical' || flight.connectionRiskLevel === 'high') {
    monitoringLevel = 'high';
  } else if (overallRiskScore >= 25 || delayPred.level === 'medium' || 
             flight.connectionRiskLevel === 'medium') {
    monitoringLevel = 'medium';
  }
  
  return {
    delayProbability: delayPred.probability,
    delayLevel: delayPred.level,
    connectionRiskScore: flight.connectionRiskScore ?? null,
    connectionRiskLevel: flight.connectionRiskLevel ?? null,
    gateChangeRisk,
    recommendedArrivalTime: arrivalRec.recommendedTime.toISOString(),
    recommendedArrivalLabel: arrivalRec.label,
    checkInRecommendation,
    monitoringLevel,
    overallRiskScore,
    reasoningFactors,
    flightNumber: `${flight.airlineCode}${flight.flightNumber}`,
    route: `${flight.departureAirport} → ${flight.arrivalAirport}`,
    departureTime: flight.estimatedDeparture ?? flight.scheduledDeparture,
    status: flight.flightStatus,
    currentDelayMinutes: flight.departureDelayMinutes,
    hoursUntilDeparture: Math.round(hoursUntilDeparture * 10) / 10,
    minutesUntilRecommendedArrival,
  };
}

/** User profile for Gemini context */
export interface UserIntelligenceProfile {
  mode: 'minimal' | 'balanced' | 'deep';
  frequentTraveler: boolean;  // > 5 tracked flights
  preferredTone?: 'professional' | 'friendly' | 'casual';
}

/** Gemini's structured briefing output */
export interface AgentBriefing {
  statusLine: string;         // Big headline: "You're clear." / "Leave in 42 minutes."
  explanation: string;        // One sentence context
  keyWarnings: string[];      // Bullet points (max 3)
  actions: string[];          // Actionable recommendations (max 2)
  confidence: 'low' | 'medium' | 'high';
}
