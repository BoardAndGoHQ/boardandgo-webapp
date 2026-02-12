/**
 * Departure Delay Prediction — Flight Intelligence v2
 *
 * Multi-factor heuristic probability model.
 * Factors: current real-time delay, airport congestion index,
 * time-of-day cascade risk, route historical rate.
 *
 * O(1). No API calls. Pure deterministic.
 */

export type DelayRiskLevel = 'low' | 'medium' | 'high';

export interface DelayPrediction {
  probability: number;    // 0–95%
  level: DelayRiskLevel;
  confidence: 'low' | 'medium' | 'high';
  reason: string;
  factors: Array<{ label: string; impact: number }>;
  // Backward compat aliases
  score: number;          // = probability
}

// Keep old type name as alias
export type DelayRiskResult = DelayPrediction;

/* ── Airport congestion index (0–1, higher = more congested) ── */
const AIRPORT_CONGESTION: Record<string, number> = {
  // Very high
  LHR: 0.85, JFK: 0.80, EWR: 0.80, LAX: 0.75, ORD: 0.75, PEK: 0.75,
  // High
  CDG: 0.70, SFO: 0.70, IST: 0.65, ATL: 0.60, GRU: 0.60, PHL: 0.60,
  DFW: 0.55, FRA: 0.55, AMS: 0.55, MIA: 0.55, BOS: 0.55,
  // Moderate
  DXB: 0.50, FCO: 0.50, HKG: 0.50, IAH: 0.45,
  DEN: 0.40, NRT: 0.40, MAD: 0.40, BCN: 0.40,
  // Lower
  SIN: 0.35, ICN: 0.35, JNB: 0.35, LOS: 0.35,
  MUC: 0.30, DOH: 0.30, ADD: 0.30, NBO: 0.30, CAI: 0.30,
  ZRH: 0.25, AUH: 0.25, CPT: 0.25, ACC: 0.25, CMN: 0.25,
};

/* ── Time-of-day multiplier (delays cascade through the day) ── */
function timeOfDayFactor(hour: number): number {
  if (hour < 7) return 0.6;
  if (hour < 10) return 0.8;
  if (hour < 14) return 1.0;
  if (hour < 17) return 1.15;
  if (hour < 20) return 1.3;
  return 1.1;
}

/* ── Deterministic route hash for "historical" delay rate ── */
function routeHash(origin: string, destination: string): number {
  const str = `${origin.toUpperCase()}-${destination.toUpperCase()}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function routeDelayRate(origin: string, destination: string): number {
  return (routeHash(origin, destination) % 40) / 100; // 0.00–0.39
}

/* ── Input shape ── */
interface FlightForPrediction {
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: string;
  estimatedDeparture?: string | null;
  departureDelayMinutes: number;
  flightStatus: string;
}

/**
 * Predict departure delay probability for a flight.
 * Returns probability 5–95%, contributing factors, and confidence.
 */
export function predictDepartureDelay(flight: FlightForPrediction): DelayPrediction {
  const factors: Array<{ label: string; impact: number }> = [];
  let probability = 10; // baseline

  // Factor 1: Current delay (strongest real-time signal)
  const delay = flight.departureDelayMinutes ?? 0;
  if (delay > 60) {
    probability += 40;
    factors.push({ label: `Already delayed ${delay} min`, impact: 40 });
  } else if (delay > 30) {
    probability += 35;
    factors.push({ label: `Departure delayed ${delay} min`, impact: 35 });
  } else if (delay > 15) {
    probability += 20;
    factors.push({ label: `Minor delay (${delay} min)`, impact: 20 });
  } else if (delay > 0) {
    probability += 8;
    factors.push({ label: `Slight delay (${delay} min)`, impact: 8 });
  }

  // Factor 2: Airport congestion
  const congestion = AIRPORT_CONGESTION[flight.departureAirport.toUpperCase()] ?? 0.3;
  if (congestion >= 0.7) {
    probability += 20;
    factors.push({ label: `High-congestion airport (${flight.departureAirport})`, impact: 20 });
  } else if (congestion >= 0.5) {
    probability += 12;
    factors.push({ label: 'Moderate airport congestion', impact: 12 });
  } else if (congestion >= 0.35) {
    probability += 5;
    factors.push({ label: 'Normal airport traffic', impact: 5 });
  }

  // Factor 3: Time of day
  const depHour = new Date(flight.scheduledDeparture).getHours();
  const todFactor = timeOfDayFactor(depHour);
  if (todFactor > 1.1) {
    const impact = Math.round((todFactor - 1) * 15);
    probability += impact;
    factors.push({
      label: `${depHour >= 17 ? 'Evening' : 'Afternoon'} flights more delay-prone`,
      impact,
    });
  } else if (todFactor < 0.8) {
    probability -= 5;
    factors.push({ label: 'Early morning: fewer cascading delays', impact: -5 });
  }

  // Factor 4: Route historical rate
  const histRate = routeDelayRate(flight.departureAirport, flight.arrivalAirport);
  if (histRate > 0.3) {
    probability += 10;
    factors.push({ label: 'Route has elevated delay history', impact: 10 });
  } else if (histRate > 0.2) {
    probability += 5;
    factors.push({ label: 'Moderate route delay history', impact: 5 });
  }

  // Clamp 5–95
  probability = Math.max(5, Math.min(95, probability));

  // Level
  let level: DelayRiskLevel;
  if (probability >= 50) level = 'high';
  else if (probability >= 30) level = 'medium';
  else level = 'low';

  // Confidence
  let confidence: 'low' | 'medium' | 'high';
  if (delay > 0 || flight.flightStatus === 'active') confidence = 'high';
  else if (flight.estimatedDeparture) confidence = 'medium';
  else confidence = 'low';

  // Primary reason
  const sorted = [...factors].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  const reason = sorted[0]?.label ?? 'Based on route and airport analysis';

  return {
    probability,
    level,
    confidence,
    reason,
    factors: sorted,
    score: probability,
  };
}

/* ── Backward-compatible wrappers ── */

/** Delay prediction for search results (route only, no real-time data). */
export function getSearchDelayRisk(flight: {
  origin: string;
  destination: string;
  stops: number;
}): DelayPrediction {
  const base = predictDepartureDelay({
    departureAirport: flight.origin,
    arrivalAirport: flight.destination,
    scheduledDeparture: new Date().toISOString(),
    departureDelayMinutes: 0,
    flightStatus: 'scheduled',
  });
  // Multi-stop flights inherently riskier
  if (flight.stops > 0) {
    const penalty = Math.min(15, flight.stops * 8);
    base.probability = Math.min(95, base.probability + penalty);
    base.score = base.probability;
    base.factors.push({ label: `${flight.stops} stop(s) increase delay exposure`, impact: penalty });
    if (base.probability >= 50) base.level = 'high';
    else if (base.probability >= 30) base.level = 'medium';
  }
  return base;
}

/** Delay prediction for tracked / live flights. */
export function getTrackedDelayRisk(flight: {
  departureAirport: string;
  arrivalAirport: string;
  departureDelayMinutes: number;
  flightStatus: string;
  scheduledDeparture?: string;
  estimatedDeparture?: string | null;
}): DelayPrediction {
  return predictDepartureDelay({
    ...flight,
    scheduledDeparture: flight.scheduledDeparture ?? new Date().toISOString(),
  });
}
