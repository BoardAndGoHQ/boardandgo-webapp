const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const POST_BOOKING_API = process.env.NEXT_PUBLIC_POST_BOOKING_API_URL || 'http://localhost:3001';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  token?: string;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, data.error || 'Request failed');
  }

  return data;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type TripType = 'oneway' | 'return' | 'multicity';
export type CabinClass = 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';

export interface FlightOffer {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  duration: string;
  price: number;
  currency: string;
  affiliateUrl: string;
  stops: number;
  cabin: string;
}

export interface FlightSearchParams {
  tripType: TripType;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  cabin?: CabinClass;
}

export interface GmailStatus {
  connected: boolean;
  email: string | null;
  watchExpiration: string | null;
}

export interface Booking {
  id: string;
  source: 'gmail' | 'manual';
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  confirmationCode: string | null;
  passengerName: string | null;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface TrackBookClickParams {
  tripType: TripType;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabin?: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  price: number;
  currency: string;
  stops: number;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  affiliateUrl: string;
}

export interface AgentChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SearchIntent {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'oneway' | 'return';
  adults: number;
  children: number;
  infants: number;
  cabin: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
}

export interface AgentResponse {
  message: string;
  searchIntent: SearchIntent | null;
}

export interface FlightLookupResult {
  source: string;
  status: string;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: string | null;
  estimatedDeparture: string | null;
  actualDeparture: string | null;
  scheduledArrival: string | null;
  estimatedArrival: string | null;
  actualArrival: string | null;
  departureTerminal: string | null;
  departureGate: string | null;
  arrivalTerminal: string | null;
  arrivalGate: string | null;
  baggageCarousel: string | null;
  aircraftType: string | null;
  aircraftRegistration: string | null;
  airlineName: string | null;
  departureDelayMinutes: number;
  arrivalDelayMinutes: number;
  durationMinutes: number | null;
  liveLatitude: number | null;
  liveLongitude: number | null;
  liveAltitude: number | null;
  liveSpeed: number | null;
  liveHeading: number | null;
}

export interface TrackedFlight {
  id: string;
  bookingId: string;
  legIndex: number;
  flightNumber: string;
  airlineCode: string;
  airlineName: string | null;
  departureAirport: string;
  departureAirportName: string | null;
  arrivalAirport: string;
  arrivalAirportName: string | null;
  scheduledDeparture: string;
  scheduledArrival: string;
  estimatedDeparture: string | null;
  estimatedArrival: string | null;
  actualDeparture: string | null;
  actualArrival: string | null;
  flightStatus: string;
  departureDelayMinutes: number;
  arrivalDelayMinutes: number;
  departureGate: string | null;
  departureTerminal: string | null;
  arrivalGate: string | null;
  arrivalTerminal: string | null;
  aircraftType: string | null;
  durationMinutes: number | null;
  checkInUrl: string | null;
  delayPrediction: DelayPredictionData | null;
  airportOnTimeScore: number | null;
}

/** Amadeus ML delay prediction data stored on TrackedFlight */
export interface DelayPredictionData {
  id: string;
  probability: string;
  result: string;
  subType: string;
  type: string;
  buckets: Array<{ result: string; probability: string }>;
  fetchedAt: string;
}

export interface FlightStatusEvent {
  id: string;
  flightId: string;
  eventType: string;
  oldStatus: string | null;
  newStatus: string | null;
  delayMinutes: number | null;
  eventTime: string;
}

export interface FlightPosition {
  flightIata: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  heading: number;
  verticalSpeed: number;
  status: string;
  updated: number;
}

/* ── Connection Intelligence Types ── */

export type ConnectionRiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type HumanRiskLabel = 'You\'re on track' | 'Move quickly' | 'Very tight connection';

export interface ConnectionAnalysis {
  connectionAirport: string;
  minutesToNextFlight: number;
  minimumConnectionTime: number;
  riskScore: number;
  riskLevel: ConnectionRiskLevel;
  humanStatus: HumanRiskLabel;
  humanExplanation: string;
  terminalChange: boolean;
  arrivingTerminal: string | null;
  departingTerminal: string | null;
  selfTransfer: boolean;
  factors: string[];
  arrivingLegIndex: number;
  departingLegIndex: number;
}

export interface JourneyConnectionReport {
  isMultiLeg: boolean;
  connectionCount: number;
  connections: ConnectionAnalysis[];
  worstRiskLevel: ConnectionRiskLevel;
  overallHumanStatus: HumanRiskLabel;
}

export type JourneyStatus =
  | 'upcoming' | 'checkin_window' | 'boarding_soon' | 'in_air'
  | 'connection_active' | 'landed' | 'completed' | 'disrupted';

export interface JourneyData {
  booking: {
    id: string;
    journeyStatus: JourneyStatus;
    flights: (TrackedFlight & { statusEvents: FlightStatusEvent[] })[];
  };
  connectionReport: JourneyConnectionReport;
}

async function trackingRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${POST_BOOKING_API}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new ApiError(res.status, data.error?.message || 'Request failed');
  return data;
}

export const api = {
  auth: {
    register: (email: string, password: string, name?: string) =>
      request<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: { email, password, name },
      }),

    login: (email: string, password: string) =>
      request<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      }),
  },

  flights: {
    search: (params: FlightSearchParams, token: string) =>
      request<{ flights: FlightOffer[]; provider: string }>('/api/search/flights', {
        method: 'POST',
        body: params,
        token,
      }),

    trackBookClick: (params: TrackBookClickParams, token: string) =>
      request<{ success: boolean; clickId: string }>('/api/search/track-book-click', {
        method: 'POST',
        body: params,
        token,
      }),
  },

  bookings: {
    list: (token: string) =>
      request<{ bookings: Booking[] }>('/api/bookings', { token }),

    get: (id: string, token: string) =>
      request<{ booking: Booking }>(`/api/bookings/${id}`, { token }),

    create: (booking: Omit<Booking, 'id' | 'source' | 'status' | 'createdAt'>, token: string) =>
      request<{ booking: Booking }>('/api/bookings/manual', {
        method: 'POST',
        body: booking,
        token,
      }),
  },

  gmail: {
    getAuthUrl: (token: string) =>
      request<{ authUrl: string }>('/api/gmail/authorize', { token }),

    getStatus: (token: string) =>
      request<GmailStatus>('/api/gmail/status', { token }),

    disconnect: (token: string) =>
      request<{ success: boolean }>('/api/gmail/disconnect', { method: 'POST', token }),

    scan: (token: string) =>
      request<{ success: boolean; message: string }>('/api/gmail/scan', { method: 'POST', token }),
  },

  agent: {
    chat: (messages: AgentChatMessage[], token: string) =>
      request<AgentResponse>('/api/agent/chat', {
        method: 'POST',
        body: { messages },
        token,
      }),
  },

  tracking: {
    lookup: (carrier: string, number: string, date: string, token: string) =>
      trackingRequest<{ flight: FlightLookupResult }>(
        `/api/flights/lookup?carrier=${encodeURIComponent(carrier)}&number=${encodeURIComponent(number)}&date=${encodeURIComponent(date)}`, { token }
      ),

    trackStandalone: (flight: { carrierCode: string; flightNumber: string; date: string; departureAirport: string; arrivalAirport: string; scheduledDeparture: string; scheduledArrival: string }, token: string) =>
      trackingRequest<{ flight: TrackedFlight & { statusEvents: FlightStatusEvent[] } }>(
        '/api/flights/track-standalone', { method: 'POST', body: flight, token }
      ),

    myFlights: (token: string, status: 'active' | 'history' | 'all' = 'active') =>
      trackingRequest<{ flights: (TrackedFlight & { statusEvents: FlightStatusEvent[] })[] }>(
        `/api/flights/my-flights?status=${status}`, { token }
      ),

    positions: (token: string) =>
      trackingRequest<{ positions: FlightPosition[] }>(
        '/api/flights/positions', { token }
      ),

    getByBooking: (bookingServiceId: string, token: string) =>
      trackingRequest<{ booking: { id: string; flights: (TrackedFlight & { statusEvents: FlightStatusEvent[] })[] } }>(
        `/api/flights/by-booking/${bookingServiceId}`, { token }
      ),

    getFlightStatus: (flightId: string, token: string) =>
      trackingRequest<{ flight: TrackedFlight & { statusEvents: FlightStatusEvent[] } }>(
        `/api/flights/${flightId}/status`, { token }
      ),

    deleteFlight: (flightId: string, token: string) =>
      trackingRequest<{ success: boolean }>(
        `/api/flights/${flightId}`, { method: 'DELETE', token }
      ),

    getTimeline: (flightId: string, token: string) =>
      trackingRequest<{ events: FlightStatusEvent[] }>(
        `/api/flights/${flightId}/timeline`, { token }
      ),

    createShareLink: (flightId: string, bookingId: string, token: string) =>
      trackingRequest<{ shareToken: string; expiresAt: string }>(
        '/api/share/create', { method: 'POST', body: { flightId, bookingId }, token }
      ),

    getSharedFlight: (shareToken: string) =>
      trackingRequest<{ flight: TrackedFlight & { statusEvents: FlightStatusEvent[] } }>(
        `/api/share/${shareToken}`
      ),

    getPreferences: (token: string) =>
      trackingRequest<{ preferences: Record<string, unknown> }>('/api/preferences', { token }),

    updatePreferences: (prefs: Record<string, unknown>, token: string) =>
      trackingRequest<{ preferences: Record<string, unknown> }>(
        '/api/preferences', { method: 'PUT', body: prefs, token }
      ),

    streamUrl: (flightId: string, token: string) =>
      `${POST_BOOKING_API}/api/flights/${flightId}/stream?token=${encodeURIComponent(token)}`,

    journeyStreamUrl: (bookingId: string, token: string) =>
      `${POST_BOOKING_API}/api/flights/journey/${bookingId}/stream?token=${encodeURIComponent(token)}`,

    getJourney: (bookingId: string, token: string) =>
      trackingRequest<JourneyData>(
        `/api/flights/journey/${bookingId}`, { token }
      ),
  },

  events: {
    track: (eventName: string, properties: Record<string, unknown> | undefined, token: string) =>
      trackingRequest<{ ok: boolean }>(
        '/api/events', { method: 'POST', body: { eventName, properties }, token }
      ),
  },

  briefing: {
    generate: (
      report: import('./insights').FlightIntelligenceReport,
      profile: import('./insights').UserIntelligenceProfile,
      token: string,
      journeyContext?: {
        isMultiLeg: boolean;
        journeyStatus: string;
        totalLegs: number;
        currentLegIndex: number;
        connections: Array<{
          connectionAirport: string;
          minutesToNextFlight: number;
          riskLevel: string;
          humanStatus: string;
          humanExplanation: string;
          terminalChange: boolean;
          arrivingTerminal: string | null;
          departingTerminal: string | null;
          minimumConnectionTime: number;
        }>;
        worstRiskLevel: string;
        overallHumanStatus: string;
      },
    ) =>
      trackingRequest<import('./insights').AgentBriefing>(
        '/api/briefing', { method: 'POST', body: { report, profile, journeyContext }, token }
      ),
  },
};

export { ApiError };
