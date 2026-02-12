/**
 * Connection Risk Score — Flight Intelligence v2
 *
 * Analyzes connection risk between consecutive flights in a multi-leg itinerary.
 * Uses MCT (Minimum Connection Time) tables, airport complexity modifiers,
 * terminal change penalties, and self-transfer risk weighting.
 *
 * O(1) per connection pair. No API calls. Pure deterministic.
 */

export type ConnectionRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ConnectionRiskResult {
  score: number;             // 0–100 risk score
  level: ConnectionRiskLevel;
  label: string;             // "LOW" / "MEDIUM" / "HIGH" / "CRITICAL"
  minutesBuffer: number;     // effective_connection_time - MCT
  effectiveMinutes: number;  // actual layover time available
  explanation: string;       // Human sentence
  factors: string[];         // Contributing modifiers
}

/* ── Minimum Connection Time (minutes) for major airports ── */
const MCT: Record<string, { domestic: number; international: number }> = {
  // United States
  JFK: { domestic: 60, international: 90 }, LAX: { domestic: 60, international: 90 },
  ORD: { domestic: 60, international: 75 }, ATL: { domestic: 45, international: 75 },
  DFW: { domestic: 50, international: 75 }, DEN: { domestic: 45, international: 75 },
  SFO: { domestic: 60, international: 90 }, MIA: { domestic: 50, international: 90 },
  EWR: { domestic: 60, international: 90 }, IAH: { domestic: 50, international: 90 },
  BOS: { domestic: 50, international: 75 }, SEA: { domestic: 45, international: 75 },
  // Europe
  LHR: { domestic: 60, international: 90 }, CDG: { domestic: 60, international: 90 },
  FRA: { domestic: 45, international: 60 }, AMS: { domestic: 40, international: 50 },
  IST: { domestic: 60, international: 90 }, FCO: { domestic: 50, international: 75 },
  MAD: { domestic: 45, international: 60 }, BCN: { domestic: 45, international: 60 },
  MUC: { domestic: 30, international: 45 }, ZRH: { domestic: 30, international: 40 },
  LGW: { domestic: 45, international: 60 }, VIE: { domestic: 30, international: 45 },
  // Middle East
  DXB: { domestic: 60, international: 90 }, DOH: { domestic: 45, international: 60 },
  AUH: { domestic: 45, international: 60 },
  // Asia
  HKG: { domestic: 45, international: 60 }, SIN: { domestic: 45, international: 60 },
  NRT: { domestic: 60, international: 90 }, HND: { domestic: 45, international: 75 },
  ICN: { domestic: 45, international: 60 }, BKK: { domestic: 45, international: 60 },
  PEK: { domestic: 60, international: 90 }, PVG: { domestic: 60, international: 90 },
  DEL: { domestic: 45, international: 75 }, BOM: { domestic: 45, international: 75 },
  KUL: { domestic: 45, international: 60 },
  // Africa
  JNB: { domestic: 45, international: 60 }, CPT: { domestic: 40, international: 60 },
  NBO: { domestic: 45, international: 60 }, ACC: { domestic: 30, international: 45 },
  LOS: { domestic: 45, international: 60 }, ADD: { domestic: 40, international: 60 },
  CAI: { domestic: 45, international: 60 }, CMN: { domestic: 40, international: 60 },
  DSS: { domestic: 30, international: 45 }, ABJ: { domestic: 30, international: 45 },
  // South America
  GRU: { domestic: 60, international: 90 }, BOG: { domestic: 45, international: 60 },
  SCL: { domestic: 45, international: 60 }, EZE: { domestic: 45, international: 75 },
  LIM: { domestic: 45, international: 60 },
  // Oceania
  SYD: { domestic: 45, international: 60 }, MEL: { domestic: 40, international: 60 },
  AKL: { domestic: 40, international: 60 },
};

const LARGE_AIRPORTS = new Set([
  'JFK', 'LHR', 'CDG', 'LAX', 'ORD', 'DXB', 'ATL', 'PEK',
  'HKG', 'IST', 'SIN', 'FRA', 'AMS', 'GRU', 'NRT', 'DFW',
  'DEN', 'EWR', 'MIA', 'SFO', 'PVG',
]);

const DEFAULT_MCT = { domestic: 45, international: 60 };

function getMCT(airport: string, isInternational: boolean): number {
  const mct = MCT[airport.toUpperCase()] ?? DEFAULT_MCT;
  return isInternational ? mct.international : mct.domestic;
}

function isLikelyInternational(dep: string, arr: string): boolean {
  if (dep.length !== 3 || arr.length !== 3) return true;
  return dep[0] !== arr[0];
}

/* ── Flight shape for connection analysis ── */
interface ConnectionFlight {
  departureAirport: string;
  arrivalAirport: string;
  airlineCode: string;
  departureTerminal: string | null;
  arrivalTerminal: string | null;
  scheduledDeparture: string;
  scheduledArrival: string;
  estimatedDeparture: string | null;
  estimatedArrival: string | null;
  departureDelayMinutes: number;
  arrivalDelayMinutes: number;
  flightStatus: string;
}

/**
 * Analyze connection risk between two consecutive flights.
 * Returns a 0–100 risk score with explanation and modifiers.
 */
export function analyzeConnectionRisk(
  arriving: ConnectionFlight,
  departing: ConnectionFlight,
): ConnectionRiskResult {
  const arrivalTime = arriving.estimatedArrival ?? arriving.scheduledArrival;
  const departureTime = departing.estimatedDeparture ?? departing.scheduledDeparture;

  const arrMs = new Date(arrivalTime).getTime();
  const depMs = new Date(departureTime).getTime();
  const effectiveMinutes = Math.round((depMs - arrMs) / 60_000);

  const connectionAirport = arriving.arrivalAirport;
  const isIntl = isLikelyInternational(arriving.departureAirport, departing.arrivalAirport);
  const mct = getMCT(connectionAirport, isIntl);
  const buffer = effectiveMinutes - mct;

  let score = 0;
  const factors: string[] = [];

  // Base risk from buffer relative to MCT
  if (buffer < 0) {
    score = 90;
    factors.push(`${Math.abs(buffer)} min under minimum connection time (${mct} min MCT)`);
  } else if (buffer < 15) {
    score = 70;
    factors.push(`Only ${buffer} min buffer above ${mct} min MCT`);
  } else if (buffer < 30) {
    score = 45;
    factors.push(`${buffer} min buffer above MCT`);
  } else if (buffer < 45) {
    score = 25;
    factors.push(`Adequate ${buffer} min buffer`);
  } else {
    score = 10;
    factors.push(`Comfortable ${buffer} min buffer`);
  }

  // Modifier: large / complex airport
  if (LARGE_AIRPORTS.has(connectionAirport.toUpperCase())) {
    score = Math.min(100, score + 10);
    factors.push(`Large / complex airport (${connectionAirport})`);
  }

  // Modifier: terminal change required
  if (
    arriving.arrivalTerminal &&
    departing.departureTerminal &&
    arriving.arrivalTerminal !== departing.departureTerminal
  ) {
    score = Math.min(100, score + 15);
    factors.push(`Terminal change: T${arriving.arrivalTerminal} → T${departing.departureTerminal}`);
  }

  // Modifier: self-transfer (different airlines)
  if (arriving.airlineCode !== departing.airlineCode) {
    score = Math.min(100, score + 20);
    factors.push(`Self-transfer (${arriving.airlineCode} → ${departing.airlineCode})`);
  }

  // Modifier: inbound delay worsening
  if (arriving.arrivalDelayMinutes > 15) {
    const extra = Math.min(20, Math.round(arriving.arrivalDelayMinutes / 3));
    score = Math.min(100, score + extra);
    factors.push(`Inbound delayed ${arriving.arrivalDelayMinutes} min`);
  }

  score = Math.max(0, Math.min(100, score));

  let level: ConnectionRiskLevel;
  let label: string;
  if (score >= 75) { level = 'critical'; label = 'CRITICAL'; }
  else if (score >= 50) { level = 'high'; label = 'HIGH'; }
  else if (score >= 30) { level = 'medium'; label = 'MEDIUM'; }
  else { level = 'low'; label = 'LOW'; }

  const topFactor = factors[0] ?? '';
  const explanation =
    level === 'critical' || level === 'high'
      ? `${score}% risk of missing connection. ${topFactor}.`
      : level === 'medium'
        ? `Moderate connection risk (${score}%). ${topFactor}.`
        : `Connection looks safe. ${effectiveMinutes} min layover at ${connectionAirport}.`;

  return { score, level, label, minutesBuffer: buffer, effectiveMinutes, explanation, factors };
}

/**
 * Analyze every connection in a multi-leg itinerary.
 * Pass all flights from the same booking, sorted by scheduledDeparture.
 */
export function analyzeItineraryConnections(
  flights: ConnectionFlight[],
): ConnectionRiskResult[] {
  const sorted = [...flights].sort(
    (a, b) => new Date(a.scheduledDeparture).getTime() - new Date(b.scheduledDeparture).getTime(),
  );
  const results: ConnectionRiskResult[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const arriving = sorted[i]!;
    const departing = sorted[i + 1]!;
    if (arriving.arrivalAirport === departing.departureAirport) {
      results.push(analyzeConnectionRisk(arriving, departing));
    }
  }
  return results;
}

/* ── Backward-compatible helpers (used by search page) ── */

/**
 * Simple layover-minutes check.
 */
export function getConnectionRisk(layoverMinutes: number): ConnectionRiskResult {
  let score: number;
  let level: ConnectionRiskLevel;
  if (layoverMinutes < 45)  { score = 80; level = 'high'; }
  else if (layoverMinutes < 75) { score = 45; level = 'medium'; }
  else { score = 10; level = 'low'; }

  return {
    score, level, label: level.toUpperCase(),
    minutesBuffer: layoverMinutes, effectiveMinutes: layoverMinutes,
    explanation: `${layoverMinutes} min layover`, factors: [],
  };
}

/**
 * Estimate connection risk from search result with stops + total duration string.
 */
export function estimateConnectionRiskFromStops(
  stops: number,
  totalDurationStr: string,
): ConnectionRiskResult | null {
  if (stops === 0) return null;

  const match = totalDurationStr.match(/(\d+)h\s*(\d+)?m?/);
  if (!match) return null;

  const totalMinutes = parseInt(match[1]!) * 60 + parseInt(match[2] || '0');
  const avgSegmentMinutes = totalMinutes / (stops + 1);
  const totalLayover = totalMinutes - avgSegmentMinutes * (stops + 1);
  const avgLayoverPerStop = Math.max(30, totalLayover / stops || 60);

  let score: number;
  let level: ConnectionRiskLevel;
  if (avgLayoverPerStop < 45)  { score = 75; level = 'high'; }
  else if (avgLayoverPerStop < 75) { score = 45; level = 'medium'; }
  else { score = 15; level = 'low'; }

  return {
    score, level, label: level.toUpperCase(),
    minutesBuffer: Math.round(avgLayoverPerStop) - 60,
    effectiveMinutes: Math.round(avgLayoverPerStop),
    explanation: `~${Math.round(avgLayoverPerStop)} min layover per stop`,
    factors: [`${stops} stop(s), ~${Math.round(avgLayoverPerStop)} min per layover`],
  };
}
