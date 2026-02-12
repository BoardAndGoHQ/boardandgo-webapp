/**
 * Flight Insights — Unified export
 *
 * All insight functions are O(1), pure, and deterministic.
 * No external API calls. No ML. Just structured heuristics.
 */

export { getSearchDelayRisk, getTrackedDelayRisk } from './delay-risk';
export type { DelayRiskLevel, DelayRiskResult } from './delay-risk';

export { getConnectionRisk, estimateConnectionRiskFromStops } from './connection-risk';
export type { ConnectionRiskLevel, ConnectionRiskResult } from './connection-risk';

export { getRecommendedArrival, formatRecommendedTime } from './airport-arrival';
export type { AirportArrivalResult } from './airport-arrival';
