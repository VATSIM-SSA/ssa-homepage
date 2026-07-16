"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FIRS_GEOJSON_URL, type Atc, type Pilot, type VatssaData } from "@/lib/vatssa";

// Display window: sub-Saharan Africa plus the Indian Ocean islands.
const VIEW_BOUNDS: L.LatLngBoundsExpression = [
  [-38, -30],
  [30, 64],
];

// Base sectors are OUTLINE ONLY — filling every FIR stacks overlapping sectors
// into a muddy teal wash. Crisp teal borders read as clean airspace; only the
// sectors with a controller online get a green fill so active airspace pops.
const FIR_BASE_STYLE: L.PathOptions = {
  color: "#0197B0",
  weight: 1,
  opacity: 0.55,
  fillColor: "#0197B0",
  fillOpacity: 0,
};

const FIR_ONLINE_STYLE: L.PathOptions = {
  color: "#7BD758",
  weight: 1.8,
  opacity: 1,
  fillColor: "#7BD758",
  fillOpacity: 0.14,
};

const ATC_COLORS: Record<string, string> = {
  APP: "#f59e0b",
  TWR: "#ef4444",
  GND: "#34d399",
  DEL: "#a78bfa",
  ATIS: "#94a3b8",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) =>
    char === "&"
      ? "&amp;"
      : char === "<"
        ? "&lt;"
        : char === ">"
          ? "&gt;"
          : char === '"'
            ? "&quot;"
            : "&#39;",
  );
}

function planeIcon(heading: number): L.DivIcon {
  return L.divIcon({
    className: "vatssa-plane",
    html: `<div style="transform: rotate(${heading}deg)"><svg viewBox="0 0 24 24" width="22" height="22" fill="#7BD758" stroke="#02141a" stroke-width="0.6" stroke-linejoin="round"><path d="M12 2.2 13 9 21 13.2 21 15 13 12.4 13 18.2 15.6 20 15.6 21.2 12 19.8 8.4 21.2 8.4 20 11 18.2 11 12.4 3 15 3 13.2 11 9 Z"/></svg></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function flightLevel(altitude: number): string {
  if (altitude >= 18000) return `FL${Math.round(altitude / 100)}`;
  return `${altitude.toLocaleString("en")} ft`;
}

function pilotPopup(pilot: Pilot): string {
  const route =
    pilot.departure || pilot.arrival
      ? `<div class="mp-row">${escapeHtml(pilot.departure || "????")} &rarr; ${escapeHtml(pilot.arrival || "????")}</div>`
      : "";
  const aircraft = pilot.aircraft
    ? `<div class="mp-sub">${escapeHtml(pilot.aircraft)}</div>`
    : "";
  return `<div class="map-popup">
    <div class="mp-title">${escapeHtml(pilot.callsign)}</div>
    ${aircraft}
    ${route}
    <div class="mp-row">${flightLevel(pilot.altitude)} &middot; ${pilot.groundspeed} kts</div>
    <div class="mp-name">${escapeHtml(pilot.name.replace(/\s*\d+$/, ""))}</div>
  </div>`;
}

function atcPopup(atc: Atc): string {
  return `<div class="map-popup">
    <div class="mp-title">${escapeHtml(atc.callsign)}</div>
    <div class="mp-freq">${escapeHtml(atc.frequency)}</div>
    <div class="mp-name">${escapeHtml(atc.name)}</div>
    <div class="mp-row mp-type">${escapeHtml(atc.type)}</div>
  </div>`;
}

export default function VatssaMap({ data }: { data: VatssaData }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const pilotLayerRef = useRef<L.LayerGroup | null>(null);
  const atcLayerRef = useRef<L.LayerGroup | null>(null);
  const firLayersRef = useRef<Map<string, L.Path>>(new Map());
  const latestData = useRef<VatssaData>(data);

  // Keep a ref to the freshest data so the geojson load can paint highlights
  // even if it resolves after the first poll.
  latestData.current = data;

  // --- mount: build the map once ---
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
      minZoom: 2,
      maxZoom: 9,
      worldCopyJump: true,
    });
    map.zoomControl.setPosition("topright");

    // The container may still be mid-layout right after mount (dynamic
    // import swap), so fitBounds run here can measure a zero-size element
    // and clamp to minZoom, showing the whole world. Defer to the next
    // frame, once the browser has settled the container's real size.
    const fitFrame = requestAnimationFrame(() => {
      if (mapRef.current !== map) return;
      map.invalidateSize();
      map.fitBounds(VIEW_BOUNDS);
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        subdomains: "abcd",
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
    ).addTo(map);

    pilotLayerRef.current = L.layerGroup().addTo(map);
    atcLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    let cancelled = false;
    fetch(FIRS_GEOJSON_URL)
      .then((res) => res.json())
      .then((geojson: GeoJSON.FeatureCollection) => {
        if (cancelled || !mapRef.current) return;
        const layer = L.geoJSON(geojson, {
          style: FIR_BASE_STYLE,
          interactive: false,
          onEachFeature: (feature, lyr) => {
            const id = feature.properties?.id as string | undefined;
            if (id) firLayersRef.current.set(id, lyr as L.Path);
          },
        });
        layer.addTo(mapRef.current);
        layer.bringToBack();
        applyHighlights(latestData.current.firsOnline);
      })
      .catch(() => {
        /* boundaries are decorative; the map still works without them */
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(fitFrame);
      map.remove();
      mapRef.current = null;
      pilotLayerRef.current = null;
      atcLayerRef.current = null;
      firLayersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyHighlights(firsOnline: string[]) {
    const online = new Set(firsOnline);
    firLayersRef.current.forEach((layer, id) => {
      layer.setStyle(online.has(id) ? FIR_ONLINE_STYLE : FIR_BASE_STYLE);
    });
  }

  // --- update: repaint live traffic whenever a new snapshot arrives ---
  useEffect(() => {
    const map = mapRef.current;
    const pilotLayer = pilotLayerRef.current;
    const atcLayer = atcLayerRef.current;
    if (!map || !pilotLayer || !atcLayer) return;

    applyHighlights(data.firsOnline);

    pilotLayer.clearLayers();
    for (const pilot of data.pilots) {
      L.marker([pilot.lat, pilot.lon], {
        icon: planeIcon(pilot.heading),
        keyboard: false,
      })
        .bindPopup(pilotPopup(pilot), { closeButton: true })
        .bindTooltip(pilot.callsign, { direction: "top", offset: [0, -10] })
        .addTo(pilotLayer);
    }

    atcLayer.clearLayers();
    for (const atc of data.atc) {
      if (atc.lat == null || atc.lon == null) continue;
      if (atc.kind === "airport") {
        L.circleMarker([atc.lat, atc.lon], {
          radius: 6,
          color: "#02141a",
          weight: 1.5,
          fillColor: ATC_COLORS[atc.type] ?? "#9cc8d5",
          fillOpacity: 1,
        })
          .bindPopup(atcPopup(atc))
          .bindTooltip(`${atc.callsign} · ${atc.frequency}`, {
            direction: "top",
            offset: [0, -6],
          })
          .addTo(atcLayer);
      } else {
        // CTR / FSS: a labelled pill at the sector centroid.
        L.marker([atc.lat, atc.lon], {
          icon: L.divIcon({
            className: "vatssa-atc-label",
            html: `<span class="atc-pill">${escapeHtml(atc.callsign)}<em>${escapeHtml(atc.frequency)}</em></span>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          }),
          keyboard: false,
        })
          .bindPopup(atcPopup(atc))
          .addTo(atcLayer);
      }
    }
  }, [data]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full bg-zinc-900"
      role="application"
      aria-label="Live map of VATSSA airspace showing online aircraft and air traffic control"
    />
  );
}
