/**
 * Flight Intelligence — Unified export
 *
 * v2: Multi-factor predictions, connection risk scoring,
 * personal travel insights. All O(1) or O(n), pure, no API calls.
 */

// Delay prediction
export { predictDepartureDelay, getSearchDelayRisk, getTrackedDelayRisk } from './delay-risk';
export type { DelayRiskLevel, DelayPrediction, DelayRiskResult } from './delay-risk';

// Connection risk
export {
  analyzeConnectionRisk,
  analyzeItineraryConnections,
  getConnectionRisk,
  estimateConnectionRiskFromStops,
} from './connection-risk';
export type { ConnectionRiskLevel, ConnectionRiskResult } from './connection-risk';

// Airport arrival
export { getRecommendedArrival, formatRecommendedTime } from './airport-arrival';
export type { AirportArrivalResult } from './airport-arrival';

// Personal insights
export { generateTravelInsights } from './personal-insights';
export type { TravelInsight } from './personal-insights';

// Intelligence report (canonical contract for Gemini)
export { generateIntelligenceReport } from './intelligence-report';
export type {
  FlightIntelligenceReport,
  UserIntelligenceProfile,
  AgentBriefing,
  MonitoringLevel,
} from './intelligence-report';
