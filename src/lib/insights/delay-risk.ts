/**
 * Delay Risk — Insight Layer v1 (Heuristic)
 *
 * O(1). No API calls. Pure deterministic.
 * Works with both FlightOffer (search results) and TrackedFlight (tracking).
 */

export type DelayRiskLevel = 'low' | 'medium' | 'high';

export interface DelayRiskResult {
  level: DelayRiskLevel;
  score: number; // 0–100
  reason: string;
}

/* ── Simple deterministic hash for route-based mock delay rate ── */
function routeHash(origin: string, destination: string): number {
  const str = `${origin.toUpperCase()}-${destination.toUpperCase()}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Mock route delay rate — deterministic per airport pair.
 * Returns a value 0–0.5 representing "historical" delay probability.
 * Will be replaced with real data once historical DB is wired.
 */
function mockRouteDelayRate(origin: string, destination: string): number {
  return (routeHash(origin, destination) % 50) / 100; // 0.00 – 0.49
}

/* ── Search result data shape (minimal) ── */
interface SearchFlightData {
  origin: string;
  destination: string;
  stops: number;
}

/* ── Tracked flight data shape (richer) ── */
interface TrackedFlightData {
  departureAirport: string;
  arrivalAirport: string;
  departureDelayMinutes: number;
  flightStatus: string;
}

/**
 * Compute delay risk for a search result flight offer.
 * Only has route info — uses heuristic hash.
 */
export function getSearchDelayRisk(flight: SearchFlightData): DelayRiskResult {
  const rate = mockRouteDelayRate(flight.origin, flight.destination);

  // Multi-stop flights inherently riskier
  const stopPenalty = flight.stops * 10;
  const baseScore = Math.round(rate * 100) + stopPenalty;
  const score = Math.min(baseScore, 100);

  if (score >= 40) {
    return { level: 'high', score, reason: 'Route has elevated delay history' };
  }
  if (score >= 25) {
    return { level: 'medium', score, reason: 'Moderate delay risk based on route' };
  }
  return { level: 'low', score, reason: 'Low delay risk' };
}

/**
 * Compute delay risk for a tracked / live flight.
 * Has real-time delay data.
 */
export function getTrackedDelayRisk(flight: TrackedFlightData): DelayRiskResult {
  const delay = flight.departureDelayMinutes ?? 0;

  // Hard thresholds from real-time data
  if (delay > 30) {
    return { level: 'high', score: 90, reason: `Departure delayed ${delay} minutes` };
  }
  if (delay > 15) {
    return { level: 'medium', score: 60, reason: `Departure delayed ${delay} minutes` };
  }

  // Route heuristic as fallback
  const rate = mockRouteDelayRate(flight.departureAirport, flight.arrivalAirport);
  if (rate > 0.25) {
    return { level: 'medium', score: 50, reason: 'Route has elevated delay history' };
  }

  return { level: 'low', score: 10, reason: 'On time' };
}
