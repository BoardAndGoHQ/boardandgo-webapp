'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { TrackedFlight } from '@/lib/api';
import { greatCircleArc, pointAlongArc, bearing, type Coord } from '@/lib/arc-utils';

/* ── Types ── */
export interface AirportCoord {
  iata: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface FlightMapProps {
  flights: TrackedFlight[];
  selectedFlightId?: string | null;
  onSelectFlight?: (id: string) => void;
  className?: string;
}

/* ── Airport coord cache ── */
const airportCache = new Map<string, AirportCoord>();

async function resolveAirports(codes: string[]): Promise<Map<string, AirportCoord>> {
  const missing = codes.filter((c) => !airportCache.has(c));
  if (missing.length > 0) {
    try {
      const res = await fetch(`/api/airports?codes=${missing.join(',')}`);
      const data = await res.json();
      if (data.airports) {
        for (const [code, info] of Object.entries(data.airports)) {
          const a = info as AirportCoord;
          airportCache.set(code, a);
        }
      }
    } catch {
      // API failed, skip
    }
  }
  const result = new Map<string, AirportCoord>();
  for (const code of codes) {
    const cached = airportCache.get(code);
    if (cached) result.set(code, cached);
  }
  return result;
}

/* ── Helpers ── */
function getFlightProgress(flight: TrackedFlight): number {
  if (flight.flightStatus === 'landed') return 1;
  if (flight.flightStatus !== 'active') return 0;
  // Estimate progress based on time
  const dep = flight.actualDeparture ?? flight.estimatedDeparture ?? flight.scheduledDeparture;
  const arr = flight.estimatedArrival ?? flight.scheduledArrival;
  if (!dep || !arr) return 0.5;
  const start = new Date(dep).getTime();
  const end = new Date(arr).getTime();
  const now = Date.now();
  if (now <= start) return 0;
  if (now >= end) return 1;
  return (now - start) / (end - start);
}

function statusColor(status: string): string {
  switch (status) {
    case 'active': return '#14b8a6';
    case 'landed': return '#64748b';
    case 'cancelled': return '#ef4444';
    case 'delayed': return '#f59e0b';
    default: return '#14b8a6';
  }
}

/* ── Dark style (CartoDB Dark Matter — free, crisp vector tiles) ── */
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

/* ── Component ── */
export function FlightMap({ flights, selectedFlightId, onSelectFlight, className }: FlightMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [airports, setAirports] = useState<Map<string, AirportCoord>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);

  /* Collect all airport codes */
  const airportCodes = useMemo(() => {
    const codes = new Set<string>();
    flights.forEach((f) => {
      codes.add(f.departureAirport);
      codes.add(f.arrivalAirport);
    });
    return Array.from(codes);
  }, [flights]);

  /* Resolve airport coordinates */
  useEffect(() => {
    if (airportCodes.length === 0) return;
    resolveAirports(airportCodes).then(setAirports);
  }, [airportCodes]);

  /* Initialize map */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [10, 25],
      zoom: 1.8,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

    map.on('load', () => setMapLoaded(true));

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
  }, []);

  /* Render flight layers */
  const renderFlights = useCallback(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || airports.size === 0) return;

    /* Clean previous layers */
    const layerIds = flights.flatMap((f) => [
      `arc-${f.id}`,
      `arc-glow-${f.id}`,
      `plane-${f.id}`,
    ]);
    const sourceIds = flights.flatMap((f) => [
      `arc-${f.id}`,
      `plane-${f.id}`,
    ]);
    layerIds.forEach((id) => { if (map.getLayer(id)) map.removeLayer(id); });
    sourceIds.forEach((id) => { if (map.getSource(id)) map.removeSource(id); });

    // Also clean airport layers/sources from previous render
    if (map.getLayer('airports-circle')) map.removeLayer('airports-circle');
    if (map.getLayer('airports-label')) map.removeLayer('airports-label');
    if (map.getSource('airports')) map.removeSource('airports');

    /* Airport markers */
    const airportFeatures = Array.from(airports.entries()).map(([code, a]) => ({
      type: 'Feature' as const,
      properties: { code, name: a.name },
      geometry: { type: 'Point' as const, coordinates: [a.longitude, a.latitude] },
    }));

    map.addSource('airports', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: airportFeatures },
    });

    map.addLayer({
      id: 'airports-circle',
      type: 'circle',
      source: 'airports',
      paint: {
        'circle-radius': 5,
        'circle-color': '#14b8a6',
        'circle-stroke-color': '#0a1628',
        'circle-stroke-width': 2,
        'circle-opacity': 0.9,
      },
    });

    map.addLayer({
      id: 'airports-label',
      type: 'symbol',
      source: 'airports',
      layout: {
        'text-field': ['get', 'code'],
        'text-font': ['Open Sans Bold'],
        'text-size': 11,
        'text-offset': [0, 1.5],
        'text-anchor': 'top',
      },
      paint: {
        'text-color': '#f1f5f9',
        'text-halo-color': '#050a14',
        'text-halo-width': 1.5,
      },
    });

    /* Flight arcs + plane icons */
    flights.forEach((flight) => {
      const depAirport = airports.get(flight.departureAirport);
      const arrAirport = airports.get(flight.arrivalAirport);
      if (!depAirport || !arrAirport) return;

      const from: Coord = { lat: depAirport.latitude, lon: depAirport.longitude };
      const to: Coord = { lat: arrAirport.latitude, lon: arrAirport.longitude };
      const arcPoints = greatCircleArc(from, to, 80);
      const isSelected = flight.id === selectedFlightId;
      const color = statusColor(flight.flightStatus);

      // Arc glow (wider, transparent)
      map.addSource(`arc-${flight.id}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: arcPoints },
        },
      });

      map.addLayer({
        id: `arc-glow-${flight.id}`,
        type: 'line',
        source: `arc-${flight.id}`,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': color,
          'line-width': isSelected ? 6 : 3,
          'line-opacity': isSelected ? 0.25 : 0.1,
          'line-blur': 4,
        },
      });

      map.addLayer({
        id: `arc-${flight.id}`,
        type: 'line',
        source: `arc-${flight.id}`,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': color,
          'line-width': isSelected ? 3 : 1.5,
          'line-opacity': isSelected ? 0.9 : 0.5,
          'line-dasharray': flight.flightStatus === 'active' ? [1, 0] : [4, 3],
        },
      });

      // Make arcs clickable
      map.on('click', `arc-${flight.id}`, () => {
        onSelectFlight?.(flight.id);
      });
      map.on('mouseenter', `arc-${flight.id}`, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', `arc-${flight.id}`, () => {
        map.getCanvas().style.cursor = '';
      });

      // Plane icon for active flights
      if (flight.flightStatus === 'active' || isSelected) {
        const progress = getFlightProgress(flight);
        const planePos = pointAlongArc(from, to, Math.max(0.02, Math.min(0.98, progress)));
        const planeBearing = bearing(
          pointAlongArc(from, to, Math.max(0, progress - 0.02)),
          pointAlongArc(from, to, Math.min(1, progress + 0.02))
        );

        map.addSource(`plane-${flight.id}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { bearing: planeBearing, flight: `${flight.airlineCode}${flight.flightNumber}` },
            geometry: { type: 'Point', coordinates: [planePos.lon, planePos.lat] },
          },
        });

        map.addLayer({
          id: `plane-${flight.id}`,
          type: 'symbol',
          source: `plane-${flight.id}`,
          layout: {
            'icon-image': 'airport',
            'icon-size': 1.2,
            'icon-rotate': ['get', 'bearing'],
            'icon-rotation-alignment': 'map',
            'icon-allow-overlap': true,
            'text-field': ['get', 'flight'],
            'text-font': ['Open Sans Bold'],
            'text-size': 10,
            'text-offset': [0, 1.8],
            'text-anchor': 'top',
            'text-allow-overlap': true,
          },
          paint: {
            'text-color': '#14b8a6',
            'text-halo-color': '#050a14',
            'text-halo-width': 1,
          },
        });
      }
    });
  }, [flights, airports, mapLoaded, selectedFlightId, onSelectFlight]);

  useEffect(() => {
    renderFlights();
  }, [renderFlights]);

  /* Fit bounds to show all flights */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || airports.size === 0) return;

    const bounds = new maplibregl.LngLatBounds();
    let hasPoints = false;
    airports.forEach((a) => {
      bounds.extend([a.longitude, a.latitude]);
      hasPoints = true;
    });

    if (hasPoints) {
      map.fitBounds(bounds, { padding: 80, maxZoom: 6, duration: 1200 });
    }
  }, [airports, mapLoaded]);

  return (
    <div className={`relative w-full ${className ?? 'h-[500px]'}`}>
      <div ref={containerRef} className="absolute inset-0 rounded-xl overflow-hidden" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-elevated/50 rounded-xl">
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <div className="w-4 h-4 border-2 border-accent-teal/30 border-t-accent-teal rounded-full animate-spin" />
            Loading map...
          </div>
        </div>
      )}
    </div>
  );
}
