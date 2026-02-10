declare module 'airport-data-js' {
  interface AirportData {
    iata: string;
    icao: string;
    time: string;
    country_code: string;
    continent: string;
    airport: string;
    latitude: string;
    longitude: string;
    elevation: string;
    type: string;
    scheduled_service: boolean;
    wikipedia?: string;
    website?: string;
    runway_length?: string;
    flightradar24_url?: string;
    radarbox_url?: string;
    flightaware_url?: string;
  }

  export function getAirportByIata(code: string): Promise<AirportData[]>;
  export function getAirportByIcao(code: string): Promise<AirportData[]>;
  export function searchByName(query: string): Promise<AirportData[]>;
  export function findNearbyAirports(lat: number, lon: number, radiusKm: number): Promise<AirportData[]>;
  export function calculateDistance(code1: string, code2: string): Promise<number>;
  export function getAirportByCountryCode(code: string): Promise<AirportData[]>;
  export function getAirportByContinent(code: string): Promise<AirportData[]>;
  export function getAirportsByType(type: string): Promise<AirportData[]>;
  export function getAirportsByTimezone(tz: string): Promise<AirportData[]>;
  export function getMultipleAirports(codes: string[]): Promise<(AirportData | null)[]>;
  export function getAutocompleteSuggestions(query: string): Promise<AirportData[]>;
  export function validateIataCode(code: string): Promise<boolean>;
  export function getAirportCount(filters?: Record<string, unknown>): Promise<number>;
}
