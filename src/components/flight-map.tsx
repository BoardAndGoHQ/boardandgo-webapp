'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { TrackedFlight, FlightPosition } from '@/lib/api';
import { greatCircleArc, pointAlongArc, bearing, splitArcAtProgress, type Coord } from '@/lib/arc-utils';

/* ── Types ── */
export interface AirportCoord {
  iata: string;
  name: string;
  latitude: number;
  longitude: number;
}

export type MapViewMode = 'route' | '3d' | 'follow';

interface FlightMapProps {
  flights: TrackedFlight[];
  positions?: FlightPosition[];
  selectedFlightId?: string | null;
  onSelectFlight?: (id: string) => void;
  className?: string;
  viewMode?: MapViewMode;
  onAirportsResolved?: (airports: Map<string, AirportCoord>) => void;
  /** When true, render for full-screen tracker (trail, popup, etc.) */
  trackerMode?: boolean;
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
    } catch { /* skip */ }
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

function findPosition(flight: TrackedFlight, positions?: FlightPosition[]): FlightPosition | undefined {
  if (!positions || positions.length === 0) return undefined;
  const iata = `${flight.airlineCode}${flight.flightNumber.replace(/\D/g, '')}`;
  return positions.find((p) => p.flightIata === iata);
}

/* ── Style ── */
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

/* ── Trail / route colors ── */
const TRAIL_COLOR = '#e040fb';        // Magenta — flown path
const REMAINING_COLOR = '#9e9e9e';    // Gray — remaining route
const PLANE_COLOR = '#FF6D00';        // Deep orange (FlightRadar24 style)

/* ── Airline logo CDN ── */
const AIRLINE_LOGO_URL = (iata: string) => `https://images.kiwi.com/airlines/64/${iata}.png`;

/* ── Component ── */
export function FlightMap({
  flights,
  positions,
  selectedFlightId,
  onSelectFlight,
  className,
  viewMode = 'route',
  onAirportsResolved,
  trackerMode = false,
}: FlightMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [airports, setAirports] = useState<Map<string, AirportCoord>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);
  const followingRef = useRef(false);
  const terrainActiveRef = useRef(false);

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
    resolveAirports(airportCodes).then((resolved) => {
      setAirports(resolved);
      onAirportsResolved?.(resolved);
    });
  }, [airportCodes, onAirportsResolved]);

  /* Initialize map */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const container = containerRef.current;

    const map = new maplibregl.Map({
      container,
      style: MAP_STYLE,
      center: [10, 25],
      zoom: 1.8,
      attributionControl: false,
      pitch: 0,
      bearing: 0,
    });

    // MapLibre's constructor sets container.style.position = 'relative' (inline),
    // which overrides Tailwind's 'absolute' from 'absolute inset-0' and collapses
    // the container height to 0. Restore absolute positioning immediately.
    container.style.position = 'absolute';

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

    map.on('load', () => {
      map.resize();

      // Add plane icon — detailed top-down jet with engines & shadow (FR24 style)
      try {
        const svgStr = [
          '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">',
          '<defs>',
          '  <filter id="ds" x="-10%" y="-5%" width="120%" height="115%">',
          '    <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#000" flood-opacity=".45"/>',
          '  </filter>',
          '  <linearGradient id="bf" x1="0" y1="0" x2="0" y2="1">',
          `    <stop offset="0%" stop-color="${PLANE_COLOR}"/>`,
          `    <stop offset="100%" stop-color="#E65100"/>`,
          '  </linearGradient>',
          '</defs>',
          '<g filter="url(#ds)">',
          // Fuselage — elongated rounded body
          '  <path d="M32 3c-1.6 0-2.8 1.4-3 4l-.4 10.5-1.2 5.5v12l1.2 8 .8 4 .6 3.5c.5 2 1.5 3 2 3s1.5-1 2-3l.6-3.5.8-4 1.2-8V23l-1.2-5.5L35 7c-.2-2.6-1.4-4-3-4z" fill="url(#bf)"/>',
          // Main wings — swept back with taper
          '  <path d="M28.6 21L6 30.5v2.5l22.6-6V21z" fill="url(#bf)"/>',
          '  <path d="M35.4 21l22.6 9.5v2.5l-22.6-6V21z" fill="url(#bf)"/>',
          // Engine nacelles — left wing
          '  <ellipse cx="18" cy="27.5" rx="1.6" ry="3.2" fill="#BF360C"/>',
          // Engine nacelles — right wing
          '  <ellipse cx="46" cy="27.5" rx="1.6" ry="3.2" fill="#BF360C"/>',
          // Horizontal tail stabilizers
          '  <path d="M29 47l-8 5.5v1.8l8-3.8V47z" fill="url(#bf)"/>',
          '  <path d="M35 47l8 5.5v1.8l-8-3.8V47z" fill="url(#bf)"/>',
          // Fuselage center highlight
          '  <path d="M31 8c-.1 0-.2.5-.2 1.5v30c0 1 .1 1.5.2 1.5h2c.1 0 .2-.5.2-1.5v-30c0-1-.1-1.5-.2-1.5h-2z" fill="rgba(255,255,255,.15)"/>',
          '</g>',
          '</svg>',
        ].join('');

        const img = new Image(64, 64);
        img.onload = () => {
          if (map.getStyle()) map.addImage('plane-icon', img, { sdf: false });
        };
        img.onerror = () => {
          console.warn('Plane icon SVG failed to load');
        };
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`;
      } catch { /* icon failed, map still works */ }

      // Add terrain source (for 3D mode toggle)
      try {
        map.addSource('terrain-dem', {
          type: 'raster-dem',
          url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
          tileSize: 256,
        });
      } catch { /* terrain source failed */ }

      setMapLoaded(true);
    });

    map.on('error', (e: { error?: { message?: string } }) => {
      console.warn('MapLibre error:', e.error?.message || e);
      setMapLoaded(true);
    });

    map.on('styleimagemissing', ({ id }: { id: string }) => {
      if (!map.hasImage(id)) {
        map.addImage(id, { width: 1, height: 1, data: new Uint8Array(4) });
      }
    });

    // Disable follow on user interaction
    map.on('dragstart', () => { followingRef.current = false; });
    map.on('zoomstart', () => { if (!followingRef.current) return; });

    mapRef.current = map;

    // Delayed resize with position guard
    const resizeTimer = setTimeout(() => {
      container.style.position = 'absolute';
      map.resize();
    }, 100);

    // ResizeObserver: recover from 0-height if position gets overridden again
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (r && r.height === 0) {
        container.style.position = 'absolute';
        requestAnimationFrame(() => map.resize());
        return;
      }
      map.resize();
    });
    ro.observe(container);

    return () => {
      clearTimeout(resizeTimer);
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
  }, []);

  /* Handle view mode changes (3D terrain, follow) */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (viewMode === '3d') {
      if (!terrainActiveRef.current && map.getSource('terrain-dem')) {
        try {
          map.setTerrain({ source: 'terrain-dem', exaggeration: 1.5 });
          terrainActiveRef.current = true;
        } catch { /* terrain not supported */ }
      }
      map.easeTo({ pitch: 60, duration: 1000 });
    } else {
      if (terrainActiveRef.current) {
        try {
          map.setTerrain(undefined as unknown as Parameters<typeof map.setTerrain>[0]);
          terrainActiveRef.current = false;
        } catch { /* ignore */ }
      }
      if (viewMode === 'route') {
        map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
      }
    }

    followingRef.current = viewMode === 'follow';
  }, [viewMode, mapLoaded]);

  /* Render flight layers */
  const renderFlights = useCallback(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || airports.size === 0) return;

    /* Clean previous layers */
    const layerPrefixes = ['trail-glow-', 'trail-', 'remaining-', 'arc-glow-', 'arc-', 'plane-'];
    const srcPrefixes = ['trail-', 'remaining-', 'arc-', 'plane-'];
    const staticLayers = ['airports-circle', 'airports-label'];
    const staticSources = ['airports'];

    // Remove existing layers/sources
    flights.forEach((f) => {
      layerPrefixes.forEach((p) => { if (map.getLayer(`${p}${f.id}`)) map.removeLayer(`${p}${f.id}`); });
      srcPrefixes.forEach((p) => { if (map.getSource(`${p}${f.id}`)) map.removeSource(`${p}${f.id}`); });
    });
    staticLayers.forEach((id) => { if (map.getLayer(id)) map.removeLayer(id); });
    staticSources.forEach((id) => { if (map.getSource(id)) map.removeSource(id); });

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
        'circle-radius': 6,
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
        'text-size': 12,
        'text-offset': [0, 1.6],
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

      const livePos = findPosition(flight, positions);
      const progress = getFlightProgress(flight);
      const isActive = flight.flightStatus === 'active';
      const isSelected = flight.id === selectedFlightId;

      if (trackerMode && (isActive || flight.flightStatus === 'landed')) {
        // ── Tracker mode: trail through actual plane position ──
        // When we have a live GPS position, draw DEP → plane → ARR
        // so the trail always connects to where the plane actually is.
        const planePos = livePos
          ? { lat: livePos.latitude, lon: livePos.longitude }
          : pointAlongArc(from, to, Math.max(0.02, Math.min(0.98, progress)));

        const flown = greatCircleArc(from, planePos, 60);
        const remainingArc = greatCircleArc(planePos, to, 60);

        if (flown.length > 1) {
          map.addSource(`trail-${flight.id}`, {
            type: 'geojson',
            data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: flown } },
          });
          map.addLayer({
            id: `trail-glow-${flight.id}`,
            type: 'line',
            source: `trail-${flight.id}`,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': TRAIL_COLOR, 'line-width': 6, 'line-opacity': 0.25, 'line-blur': 4 },
          });
          map.addLayer({
            id: `trail-${flight.id}`,
            type: 'line',
            source: `trail-${flight.id}`,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': TRAIL_COLOR, 'line-width': 3, 'line-opacity': 0.9 },
          });
        }

        if (remainingArc.length > 1) {
          map.addSource(`remaining-${flight.id}`, {
            type: 'geojson',
            data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: remainingArc } },
          });
          map.addLayer({
            id: `remaining-${flight.id}`,
            type: 'line',
            source: `remaining-${flight.id}`,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': REMAINING_COLOR, 'line-width': 2, 'line-opacity': 0.3, 'line-dasharray': [4, 3] },
          });
        }
      } else {
        // ── Dashboard mode: single arc ──
        const arcPoints = greatCircleArc(from, to, 80);
        const color = isActive ? '#14b8a6' : flight.flightStatus === 'landed' ? '#64748b' : '#14b8a6';

        map.addSource(`arc-${flight.id}`, {
          type: 'geojson',
          data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: arcPoints } },
        });
        map.addLayer({
          id: `arc-glow-${flight.id}`,
          type: 'line',
          source: `arc-${flight.id}`,
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': color, 'line-width': isSelected ? 6 : 3, 'line-opacity': isSelected ? 0.25 : 0.1, 'line-blur': 4 },
        });
        map.addLayer({
          id: `arc-${flight.id}`,
          type: 'line',
          source: `arc-${flight.id}`,
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': color, 'line-width': isSelected ? 3 : 1.5, 'line-opacity': isSelected ? 0.9 : 0.5, 'line-dasharray': isActive ? [1, 0] : [4, 3] },
        });

        map.on('click', `arc-${flight.id}`, () => { onSelectFlight?.(flight.id); });
        map.on('mouseenter', `arc-${flight.id}`, () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', `arc-${flight.id}`, () => { map.getCanvas().style.cursor = ''; });
      }

      // ── Plane icon ──
      if (isActive || isSelected) {
        let planeCoord: Coord;
        let planeBearingDeg: number;

        if (livePos) {
          planeCoord = { lat: livePos.latitude, lon: livePos.longitude };
          planeBearingDeg = livePos.heading;
        } else {
          const p = Math.max(0.02, Math.min(0.98, progress));
          planeCoord = pointAlongArc(from, to, p);
          planeBearingDeg = bearing(
            pointAlongArc(from, to, Math.max(0, p - 0.02)),
            pointAlongArc(from, to, Math.min(1, p + 0.02))
          );
        }

        const planeProps: Record<string, unknown> = {
          bearing: planeBearingDeg,
          flight: `${flight.airlineCode}${flight.flightNumber}`,
          airlineCode: flight.airlineCode,
          route: `${depAirport.name ?? flight.departureAirport} → ${arrAirport.name ?? flight.arrivalAirport}`,
          aircraft: flight.aircraftType ?? '',
          status: flight.flightStatus,
          depCode: flight.departureAirport,
          arrCode: flight.arrivalAirport,
          eta: flight.estimatedArrival ?? flight.scheduledArrival ?? '',
          gate: flight.departureGate ?? '',
          terminal: flight.departureTerminal ?? '',
          delay: flight.departureDelayMinutes ?? 0,
        };
        if (livePos) {
          planeProps.altitude = livePos.altitude;
          planeProps.speed = livePos.speed;
        }

        map.addSource(`plane-${flight.id}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: planeProps,
            geometry: { type: 'Point', coordinates: [planeCoord.lon, planeCoord.lat] },
          },
        });

        map.addLayer({
          id: `plane-${flight.id}`,
          type: 'symbol',
          source: `plane-${flight.id}`,
          layout: {
            'icon-image': 'plane-icon',
            'icon-size': trackerMode ? 0.9 : 0.8,
            'icon-rotate': ['get', 'bearing'],
            'icon-rotation-alignment': 'map',
            'icon-allow-overlap': true,
            'text-field': trackerMode ? '' : ['get', 'flight'],
            'text-font': ['Open Sans Bold'],
            'text-size': 10,
            'text-offset': [0, 2],
            'text-anchor': 'top',
            'text-allow-overlap': true,
          },
          paint: {
            'text-color': '#14b8a6',
            'text-halo-color': '#050a14',
            'text-halo-width': 1,
          },
        });

        // Click on plane → popup
        map.on('click', `plane-${flight.id}`, (e) => {
          if (popupRef.current) popupRef.current.remove();
          const coords = e.lngLat;
          const props = e.features?.[0]?.properties ?? {};
          const alt = props.altitude ? Math.round(Number(props.altitude)) : null;
          const spd = props.speed ? Math.round(Number(props.speed) * 0.539957) : null;

          const airlineCode = String(props.airlineCode ?? '');
          const logoUrl = airlineCode ? AIRLINE_LOGO_URL(airlineCode) : '';
          const flightStatus = String(props.status ?? 'unknown');
          const delay = Number(props.delay ?? 0);
          const eta = String(props.eta ?? '');
          const gate = String(props.gate ?? '');
          const terminal = String(props.terminal ?? '');

          // Status badge
          const statusLabel = flightStatus === 'active' ? 'In Flight' : flightStatus === 'scheduled' ? 'Scheduled' : flightStatus === 'landed' ? 'Landed' : flightStatus;
          const statusColor = flightStatus === 'active' ? '#4ade80' : flightStatus === 'landed' ? '#94a3b8' : '#14b8a6';

          // ETA display
          let etaStr = '';
          if (eta) {
            try { etaStr = new Date(eta).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }); } catch { /* skip */ }
          }

          // Build info rows
          const infoRows: string[] = [];
          if (alt || spd) {
            const parts = [];
            if (alt) parts.push(`${alt.toLocaleString()} ft`);
            if (spd) parts.push(`${spd} kts`);
            infoRows.push(`<div style="display:flex;gap:10px;color:#f1f5f9;font-size:13px;font-weight:600;">${parts.map(p => `<span>${p}</span>`).join('<span style="color:#64748b;">·</span>')}</div>`);
          }
          if (gate || terminal) {
            const parts = [];
            if (terminal) parts.push(`Terminal ${terminal}`);
            if (gate) parts.push(`Gate ${gate}`);
            infoRows.push(`<div style="color:#94a3b8;font-size:11px;">${parts.join(' · ')}</div>`);
          }
          if (etaStr) {
            infoRows.push(`<div style="color:#94a3b8;font-size:11px;">ETA: <span style="color:#f1f5f9;font-weight:600;">${etaStr}</span></div>`);
          }

          const html = `
            <div style="background:#1a1f2e;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px 14px;min-width:240px;font-family:system-ui,sans-serif;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                ${logoUrl ? `<img src="${logoUrl}" alt="" width="24" height="24" style="border-radius:4px;object-fit:contain;background:rgba(255,255,255,0.08);" onerror="this.style.display='none'"/>` : ''}
                <span style="font-weight:700;color:#f1f5f9;font-size:14px;">${props.flight ?? ''}</span>
                ${props.aircraft ? `<span style="background:rgba(255,255,255,0.1);padding:1px 6px;border-radius:4px;font-size:10px;color:#94a3b8;">${props.aircraft}</span>` : ''}
                <span style="margin-left:auto;font-size:10px;font-weight:600;color:${statusColor};background:${statusColor}15;padding:1px 6px;border-radius:4px;">${statusLabel}</span>
              </div>
              ${props.route ? `<div style="color:#94a3b8;font-size:12px;margin-bottom:6px;">${props.route}</div>` : ''}
              ${delay > 0 ? `<div style="color:#f87171;font-size:11px;margin-bottom:6px;">Delayed +${delay}min</div>` : ''}
              <div style="background:rgba(255,255,255,0.05);border-radius:6px;height:4px;margin-bottom:8px;overflow:hidden;">
                <div style="width:${Math.round(progress * 100)}%;height:100%;background:linear-gradient(90deg,#22c55e,#4ade80);border-radius:6px;"></div>
              </div>
              ${infoRows.length > 0 ? `<div style="display:flex;flex-direction:column;gap:4px;">${infoRows.join('')}</div>` : ''}
            </div>
          `;

          const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: true, className: 'plane-popup', offset: [0, -20] })
            .setLngLat(coords)
            .setHTML(html)
            .addTo(map);

          popupRef.current = popup;
          onSelectFlight?.(flight.id);
        });

        map.on('mouseenter', `plane-${flight.id}`, () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', `plane-${flight.id}`, () => { map.getCanvas().style.cursor = ''; });

        // Follow mode: track the plane
        if (followingRef.current) {
          map.easeTo({
            center: [planeCoord.lon, planeCoord.lat],
            zoom: viewMode === '3d' ? 7 : 5,
            bearing: planeBearingDeg,
            pitch: viewMode === '3d' ? 60 : viewMode === 'follow' ? 45 : 0,
            duration: 2000,
          });
        }
      }
    });
  }, [flights, positions, airports, mapLoaded, selectedFlightId, onSelectFlight, trackerMode, viewMode]);

  useEffect(() => {
    renderFlights();
  }, [renderFlights]);

  /* Fit bounds to show all flights */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || airports.size === 0) return;
    if (followingRef.current) return; // Don't refit if following

    const bounds = new maplibregl.LngLatBounds();
    let hasPoints = false;
    airports.forEach((a) => {
      bounds.extend([a.longitude, a.latitude]);
      hasPoints = true;
    });

    if (hasPoints) {
      map.fitBounds(bounds, { padding: trackerMode ? { top: 80, right: 80, bottom: 120, left: 420 } : 80, maxZoom: 6, duration: 1200 });
    }
  }, [airports, mapLoaded, trackerMode]);

  return (
    <div className={`relative w-full ${className ?? 'h-[500px]'}`}>
      <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${trackerMode ? '' : 'rounded-xl'}`} />
      {!mapLoaded && (
        <div className={`absolute inset-0 flex items-center justify-center bg-bg-elevated/50 ${trackerMode ? '' : 'rounded-xl'}`}>
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <div className="w-4 h-4 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
            Loading map...
          </div>
        </div>
      )}
    </div>
  );
}
