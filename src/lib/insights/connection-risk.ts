/**
 * Connection Risk — Insight Layer v1
 *
 * O(1). No API calls. Pure deterministic.
 * Evaluates layover tightness for multi-stop itineraries.
 */

export type ConnectionRiskLevel = 'safe' | 'tight' | 'high';

export interface ConnectionRiskResult {
  level: ConnectionRiskLevel;
  minutesBuffer: number;
}

/**
 * Compute connection risk from a layover duration in minutes.
 * Call this for each connection in a multi-leg itinerary.
 *
 * Thresholds:
 *   < 45 min  → HIGH
 *   < 75 min  → TIGHT
 *   ≥ 75 min  → SAFE
 */
export function getConnectionRisk(layoverMinutes: number): ConnectionRiskResult {
  if (layoverMinutes < 45) {
    return { level: 'high', minutesBuffer: layoverMinutes };
  }
  if (layoverMinutes < 75) {
    return { level: 'tight', minutesBuffer: layoverMinutes };
  }
  return { level: 'safe', minutesBuffer: layoverMinutes };
}

/**
 * Estimate connection risk for a multi-stop search result.
 * When we don't have exact layover times, use total duration heuristic.
 */
export function estimateConnectionRiskFromStops(
  stops: number,
  totalDurationStr: string
): ConnectionRiskResult | null {
  if (stops === 0) return null; // direct flight, no connection

  // Parse duration string like "14h 30m" or "5h 10m"
  const match = totalDurationStr.match(/(\d+)h\s*(\d+)?m?/);
  if (!match) return null;

  const totalMinutes = parseInt(match[1]!) * 60 + parseInt(match[2] || '0');

  // Rough heuristic: average flight segment ~= totalMinutes / (stops + 1)
  // Remaining time split among layovers
  const avgSegmentMinutes = totalMinutes / (stops + 1);
  const totalLayover = totalMinutes - avgSegmentMinutes * (stops + 1);
  const avgLayoverPerStop = Math.max(0, totalLayover / stops);

  // If total duration is very tight relative to direct, flag it
  // For now, simple: short total duration with stops = risky
  if (avgLayoverPerStop < 45) {
    return { level: 'high', minutesBuffer: Math.round(avgLayoverPerStop) };
  }
  if (avgLayoverPerStop < 75) {
    return { level: 'tight', minutesBuffer: Math.round(avgLayoverPerStop) };
  }
  return { level: 'safe', minutesBuffer: Math.round(avgLayoverPerStop) };
}
