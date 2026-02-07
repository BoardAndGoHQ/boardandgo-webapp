const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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

export interface FlightOffer {
  id: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  affiliateUrl: string;
  stops: number;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  cabinClass?: 'economy' | 'business' | 'first';
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
      request<{ flights: FlightOffer[] }>('/api/search/flights', {
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
      request<{ url: string }>('/api/gmail/authorize', { token }),
  },
};

export { ApiError };
