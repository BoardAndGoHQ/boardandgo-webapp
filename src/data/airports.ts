import airportsData from './airports.json';

export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
}

/**
 * Comprehensive dataset of 4,500+ airports worldwide.
 * Sourced from airports-json, filtered to airports with IATA codes
 * that are large/medium or have scheduled commercial service.
 * Sorted alphabetically by IATA code.
 */
export const airports: Airport[] = airportsData as Airport[];

/** Quick lookup map: IATA code → Airport */
const airportMap = new Map<string, Airport>();
for (const a of airports) {
  airportMap.set(a.iata, a);
}

/** Get airport by IATA code */
export function getAirport(iata: string): Airport | undefined {
  return airportMap.get(iata.toUpperCase());
}

/**
 * Search airports by query string.
 * Matches against IATA code, city name, airport name, and country.
 * Returns max `limit` results sorted by relevance.
 */
export function searchAirports(query: string, limit = 8): Airport[] {
  if (!query || query.length === 0) return [];

  const q = query.toLowerCase().trim();

  // Score each airport
  const scored: { airport: Airport; score: number }[] = [];

  for (const airport of airports) {
    const iata = airport.iata.toLowerCase();
    const city = airport.city.toLowerCase();
    const name = airport.name.toLowerCase();
    const country = airport.country.toLowerCase();

    let score = 0;

    // Exact IATA match = highest priority
    if (iata === q) {
      score = 100;
    }
    // IATA starts with query
    else if (iata.startsWith(q)) {
      score = 80;
    }
    // City starts with query
    else if (city.startsWith(q)) {
      score = 70;
    }
    // City contains query (word boundary)
    else if (city.includes(q)) {
      score = 50;
    }
    // Country starts with query
    else if (country.startsWith(q)) {
      score = 40;
    }
    // Airport name contains query
    else if (name.includes(q)) {
      score = 30;
    }
    // Country contains query
    else if (country.includes(q)) {
      score = 20;
    }

    if (score > 0) {
      scored.push({ airport, score });
    }
  }

  // Sort by score desc, then by city alphabetically
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.airport.city.localeCompare(b.airport.city);
  });

  return scored.slice(0, limit).map((s) => s.airport);
}
