const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const POST_BOOKING_API = process.env.NEXT_PUBLIC_POST_BOOKING_API_URL || 'http://localhost:3001';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  token?: string;
  cache?: RequestCache;
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
  const { method = 'GET', body, token, cache } = options;

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
    cache,
  });

  const data = await parseJsonResponse(res);

  if (!res.ok) {
    throw new ApiError(res.status, getErrorMessage(data, res.status));
  }

  return (data ?? ({} as T)) as T;
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

export type NotificationChannel =
  | 'email'
  | 'telegram'
  | 'sms'
  | 'whatsapp'
  | 'in_app'
  | 'web_push';

export interface NotificationChannelSetup {
  emailReady: boolean;
  telegramReady: boolean;
  smsReady: boolean;
  whatsappReady: boolean;
  inAppReady: boolean;
  webPushReady: boolean;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  enabledChannels: NotificationChannel[];
  smsNumber: string | null;
  whatsappNumber: string | null;
  telegramChatId: string | null;
  webPushEnabled: boolean;
  intelligenceMode: 'minimal' | 'balanced' | 'deep';
  preferredTone: 'professional' | 'friendly' | 'casual';
  delayThresholdMinutes: number;
  notifyOnDelays: boolean;
  notifyOnCancellations: boolean;
  notifyOnGateChanges: boolean;
  notifyOnBoarding: boolean;
  notifyOnDepartures: boolean;
  notifyOnArrivals: boolean;
  quietHours: Record<string, unknown> | null;
  smsOptedOutAt?: string | null;
  whatsappOptedOutAt?: string | null;
  channelSetup: NotificationChannelSetup;
}

export interface NotificationPreferencesUpdate {
  enabledChannels?: NotificationChannel[];
  smsNumber?: string | null;
  whatsappNumber?: string | null;
  webPushEnabled?: boolean;
  intelligenceMode?: 'minimal' | 'balanced' | 'deep';
  preferredTone?: 'professional' | 'friendly' | 'casual';
  delayThresholdMinutes?: number;
  notifyOnDelays?: boolean;
  notifyOnCancellations?: boolean;
  notifyOnGateChanges?: boolean;
  notifyOnBoarding?: boolean;
  notifyOnDepartures?: boolean;
  notifyOnArrivals?: boolean;
  quietHours?: Record<string, unknown> | null;
}

export interface NotificationDeliverySummary {
  channel: NotificationChannel | string;
  deliveryStatus: 'pending' | 'sent' | 'delivered' | 'failed' | string;
  provider: string | null;
  providerStatus: string | null;
  attemptCount: number;
  lastAttemptAt: string | null;
  lastWebhookAt: string | null;
  isTerminal: boolean;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface NotificationItem {
  id: string;
  bookingId: string;
  flightId: string | null;
  notificationType: string;
  subject: string | null;
  messageText: string;
  messageHtml: string | null;
  status: string;
  channels: NotificationChannel[];
  readAt: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  deliveries: NotificationDeliverySummary[];
}

export interface NotificationListResponse {
  items: NotificationItem[];
  nextCursor: string | null;
  unreadCount: number;
}

export interface WebPushPublicKeyResponse {
  publicKey: string;
}

export interface WebPushSubscriptionInput {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface ConciergeChatSession {
  id: string;
  userId: string;
  title: string | null;
  context: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConciergeChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | string;
  content: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface ConciergeActionProposal {
  id: string;
  type: string;
  summary: string;
  payload: Record<string, unknown>;
}

async function trackingRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, cache } = options;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${POST_BOOKING_API}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache,
  });

  const data = await parseJsonResponse(res);
  if (!res.ok) throw new ApiError(res.status, getErrorMessage(data, res.status));
  return (data ?? ({} as T)) as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function parseJsonResponse(res: Response): Promise<unknown | null> {
  if (res.status === 204 || res.status === 205 || res.status === 304) {
    return null;
  }

  const contentLength = res.headers.get('content-length');
  if (contentLength === '0') {
    return null;
  }

  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  if (!contentType.includes('application/json')) {
    return null;
  }

  const text = await res.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function getErrorMessage(payload: unknown, status: number): string {
  if (isRecord(payload)) {
    const directError = payload.error;
    if (typeof directError === 'string' && directError.length > 0) {
      return directError;
    }

    if (isRecord(directError) && typeof directError.message === 'string' && directError.message.length > 0) {
      return directError.message;
    }

    const directMessage = payload.message;
    if (typeof directMessage === 'string' && directMessage.length > 0) {
      return directMessage;
    }
  }

  return `Request failed (${status})`;
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

  notifications: {
    getPreferences: (token: string) =>
      trackingRequest<{ preferences: NotificationPreferences }>('/api/preferences', { token, cache: 'no-store' }),

    updatePreferences: (prefs: NotificationPreferencesUpdate, token: string) =>
      trackingRequest<{ preferences: NotificationPreferences }>('/api/preferences', {
        method: 'PUT',
        body: prefs,
        token,
      }),

    getTelegramLink: (token: string) =>
      trackingRequest<{ link: string }>('/api/preferences/telegram/connect-link', { token, cache: 'no-store' }),

    list: (
      token: string,
      options?: {
        limit?: number;
        cursor?: string;
        unreadOnly?: boolean;
      }
    ) => {
      const query = new URLSearchParams();
      if (options?.limit) query.set('limit', String(options.limit));
      if (options?.cursor) query.set('cursor', options.cursor);
      if (options?.unreadOnly !== undefined) query.set('unreadOnly', String(options.unreadOnly));
      const suffix = query.toString().length > 0 ? `?${query.toString()}` : '';
      return trackingRequest<NotificationListResponse>(`/api/notifications${suffix}`, {
        token,
        cache: 'no-store',
      });
    },

    markRead: (notificationId: string, token: string) =>
      trackingRequest<{ success: boolean }>(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        token,
      }),

    markAllRead: (token: string) =>
      trackingRequest<{ updated: number }>('/api/notifications/read-all', {
        method: 'POST',
        token,
      }),

    streamUrl: (token: string) =>
      `${POST_BOOKING_API}/api/notifications/stream?token=${encodeURIComponent(token)}`,

    getWebPushPublicKey: (token: string) =>
      trackingRequest<WebPushPublicKeyResponse>('/api/preferences/web-push/public-key', {
        token,
        cache: 'no-store',
      }),

    subscribeWebPush: (subscription: WebPushSubscriptionInput, token: string) =>
      trackingRequest<{ subscription: { id: string; endpoint: string; isActive: boolean } }>(
        '/api/preferences/web-push/subscriptions',
        { method: 'POST', body: subscription, token }
      ),

    unsubscribeWebPush: (token: string, endpoint?: string) =>
      trackingRequest<{ removed: number }>('/api/preferences/web-push/subscriptions', {
        method: 'DELETE',
        body: endpoint ? { endpoint } : {},
        token,
      }),
  },

  agent: {
    chat: (messages: AgentChatMessage[], token: string) =>
      request<AgentResponse>('/api/agent/chat', {
        method: 'POST',
        body: { messages },
        token,
      }),
  },

  concierge: {
    createSession: (token: string, payload?: { title?: string; context?: Record<string, unknown> }) =>
      trackingRequest<{ session: ConciergeChatSession }>('/api/concierge/chat/sessions', {
        method: 'POST',
        body: payload ?? {},
        token,
      }),

    listSessions: (token: string, limit = 20) =>
      trackingRequest<{ sessions: ConciergeChatSession[] }>(
        `/api/concierge/chat/sessions?limit=${encodeURIComponent(String(limit))}`,
        { token, cache: 'no-store' }
      ),

    listMessages: (sessionId: string, token: string, limit = 100) =>
      trackingRequest<{ messages: ConciergeChatMessage[] }>(
        `/api/concierge/chat/sessions/${encodeURIComponent(sessionId)}/messages?limit=${encodeURIComponent(String(limit))}`,
        { token, cache: 'no-store' }
      ),

    sendMessage: (sessionId: string, content: string, token: string) =>
      trackingRequest<{
        message: ConciergeChatMessage;
        action: ConciergeActionProposal | null;
      }>(`/api/concierge/chat/sessions/${encodeURIComponent(sessionId)}/messages`, {
        method: 'POST',
        body: { content },
        token,
      }),

    confirmAction: (actionId: string, token: string) =>
      trackingRequest<{
        actionId: string;
        status: string;
        result: Record<string, unknown> | null;
        followUp: ConciergeChatMessage | null;
      }>(`/api/concierge/chat/actions/${encodeURIComponent(actionId)}/confirm`, {
        method: 'POST',
        body: { confirm: true },
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
      trackingRequest<{ preferences: Record<string, unknown> }>('/api/preferences', { token, cache: 'no-store' }),

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
