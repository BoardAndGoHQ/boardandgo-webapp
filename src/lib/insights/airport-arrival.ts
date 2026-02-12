/**
 * Recommended Airport Arrival — Insight Layer v1
 *
 * O(1). No API calls. Pure deterministic.
 * Calculates when a traveler should arrive at the airport.
 */

export interface AirportArrivalResult {
  recommendedTime: Date;
  bufferHours: number;
  label: string; // "Domestic" or "International"
}

/**
 * Naive heuristic: if origin and destination IATA codes differ in their
 * first character, it's probably international. This is wrong in many cases
 * but is O(1) and a decent first pass. Will be replaced with a proper
 * airport→country lookup.
 */
function isLikelyInternational(origin: string, destination: string): boolean {
  // Known same-country pairs by common prefixes (US domestic, etc.)
  // This is intentionally rough — v1 heuristic
  const sameCountryPrefixes = [
    // US airports generally have no single prefix, so we just compare first char
  ];

  if (origin.length !== 3 || destination.length !== 3) return true;

  // If both start with same letter AND both are in the same 'region', likely domestic
  // This is very approximate — just a v1 heuristic
  // For now: different first letter = international
  return origin[0] !== destination[0];
}

/**
 * Calculate recommended airport arrival time.
 *
 * @param departureTime — Scheduled departure ISO string
 * @param origin — Origin IATA code
 * @param destination — Destination IATA code
 * @param currentDelayMinutes — Current known delay in minutes (adjusts recommendation)
 */
export function getRecommendedArrival(
  departureTime: string,
  origin: string,
  destination: string,
  currentDelayMinutes: number = 0
): AirportArrivalResult {
  const depDate = new Date(departureTime);

  const international = isLikelyInternational(origin, destination);
  const bufferHours = international ? 3 : 2;

  // Start from scheduled departure, subtract buffer
  const recommendedMs = depDate.getTime() - bufferHours * 3_600_000;

  // If flight is delayed, push the recommendation forward
  // but only by half the delay (you still want buffer)
  const adjustmentMs = currentDelayMinutes > 20
    ? Math.floor(currentDelayMinutes * 0.5) * 60_000
    : 0;

  return {
    recommendedTime: new Date(recommendedMs + adjustmentMs),
    bufferHours,
    label: international ? 'International' : 'Domestic',
  };
}

/**
 * Format recommended time for display.
 */
export function formatRecommendedTime(result: AirportArrivalResult): string {
  const time = result.recommendedTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${time} (${result.label} buffer: ${result.bufferHours}h)`;
}
