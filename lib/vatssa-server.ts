// Server-only logic: pulls the live VATSIM data feed and narrows it down to
// VATSSA airspace — aircraft inside a VATSSA FIR and online VATSSA ATC.
// Imported exclusively by the /api/vatssa route handler (uses fs + global fetch).

import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  FACILITIES,
  VATSIM_DATA_URL,
  type Atc,
  type Pilot,
  type VatssaData,
} from "@/lib/vatssa";

// --- bundled VATSSA reference data (generated from the VAT-Spy data project) ---

type FirFeature = {
  properties: { id: string; name: string; lat: number; lon: number };
  geometry:
    | { type: "Polygon"; coordinates: number[][][] }
    | { type: "MultiPolygon"; coordinates: number[][][][] };
};

type PreparedFir = {
  id: string;
  lat: number; // label centroid
  lon: number;
  bbox: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  geometry: FirFeature["geometry"];
};

type ReferenceData = {
  firs: PreparedFir[];
  firById: Map<string, PreparedFir>;
  airports: Record<string, [number, number]>; // ICAO -> [lat, lon]
  stations: Set<string>; // 4-letter ICAO prefixes that belong to VATSSA
};

// A controller covering the South Africa national bandbox lights both ACCs.
const FASA_FIRS = ["FACA", "FAJA"];

function boundingBox(
  geometry: FirFeature["geometry"],
): [number, number, number, number] {
  let minLon = 180;
  let minLat = 90;
  let maxLon = -180;
  let maxLat = -90;

  const walk = (coords: unknown): void => {
    if (Array.isArray(coords) && typeof coords[0] === "number") {
      const [lon, lat] = coords as number[];
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      return;
    }
    if (Array.isArray(coords)) {
      for (const child of coords) walk(child);
    }
  };

  walk(geometry.coordinates);
  return [minLon, minLat, maxLon, maxLat];
}

let referencePromise: Promise<ReferenceData> | null = null;

function loadReferenceData(): Promise<ReferenceData> {
  if (!referencePromise) {
    referencePromise = (async () => {
      const dir = path.join(process.cwd(), "public", "data");

      const [geojsonRaw, airportsRaw] = await Promise.all([
        readFile(path.join(dir, "vatssa-firs.geojson"), "utf8"),
        readFile(path.join(dir, "vatssa-airports.json"), "utf8"),
      ]);

      const geojson = JSON.parse(geojsonRaw) as { features: FirFeature[] };
      const airports = JSON.parse(airportsRaw) as Record<string, [number, number]>;

      const firs: PreparedFir[] = geojson.features.map((feature) => ({
        id: feature.properties.id,
        lat: feature.properties.lat,
        lon: feature.properties.lon,
        bbox: boundingBox(feature.geometry),
        geometry: feature.geometry,
      }));

      const firById = new Map(firs.map((fir) => [fir.id, fir]));

      // A callsign belongs to VATSSA if its 4-letter ICAO prefix is one of our
      // FIR ids or one of the airports that sit inside VATSSA airspace.
      const stations = new Set<string>([
        ...Object.keys(airports),
        ...firById.keys(),
        "FASA",
        "FAMR",
      ]);

      return { firs, firById, airports, stations };
    })().catch((error) => {
      // Reset so a transient read failure can be retried on the next request.
      referencePromise = null;
      throw error;
    });
  }

  return referencePromise;
}

// --- point-in-polygon (ray casting, supports holes + multipolygons) ---

function pointInRing(lon: number, lat: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersects =
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInPolygon(lon: number, lat: number, polygon: number[][][]): boolean {
  if (!pointInRing(lon, lat, polygon[0])) return false;
  for (let i = 1; i < polygon.length; i++) {
    if (pointInRing(lon, lat, polygon[i])) return false; // inside a hole
  }
  return true;
}

function firContains(fir: PreparedFir, lon: number, lat: number): boolean {
  const [minLon, minLat, maxLon, maxLat] = fir.bbox;
  if (lon < minLon || lon > maxLon || lat < minLat || lat > maxLat) return false;
  if (fir.geometry.type === "Polygon") {
    return pointInPolygon(lon, lat, fir.geometry.coordinates);
  }
  return fir.geometry.coordinates.some((poly) => pointInPolygon(lon, lat, poly));
}

function insideVatssa(firs: PreparedFir[], lon: number, lat: number): boolean {
  return firs.some((fir) => firContains(fir, lon, lat));
}

// --- VATSIM feed shapes (only the fields we use) ---

type FeedPilot = {
  cid: number;
  name: string;
  callsign: string;
  latitude: number;
  longitude: number;
  altitude: number;
  groundspeed: number;
  heading: number;
  flight_plan?: {
    aircraft_short?: string | null;
    departure?: string | null;
    arrival?: string | null;
  } | null;
};

type FeedController = {
  cid: number;
  name: string;
  callsign: string;
  frequency: string;
  facility: number;
  logon_time: string;
};

type Feed = {
  general?: { update_timestamp?: string };
  pilots?: FeedPilot[];
  controllers?: FeedController[];
  atis?: FeedController[];
};

function mapPilot(pilot: FeedPilot): Pilot {
  const fp = pilot.flight_plan ?? {};
  return {
    cid: pilot.cid,
    callsign: pilot.callsign,
    name: pilot.name,
    lat: pilot.latitude,
    lon: pilot.longitude,
    heading: pilot.heading,
    altitude: pilot.altitude,
    groundspeed: pilot.groundspeed,
    aircraft: fp.aircraft_short ?? "",
    departure: fp.departure ?? "",
    arrival: fp.arrival ?? "",
  };
}

function resolveFirs(prefix: string, firById: Map<string, PreparedFir>): string[] {
  if (prefix === "FASA") return FASA_FIRS.filter((id) => firById.has(id));
  return firById.has(prefix) ? [prefix] : [];
}

export async function loadVatssaData(): Promise<VatssaData> {
  const { firs, firById, airports, stations } = await loadReferenceData();

  const response = await fetch(VATSIM_DATA_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`VATSIM data feed responded ${response.status}`);
  }
  const feed = (await response.json()) as Feed;

  const pilots: Pilot[] = (feed.pilots ?? [])
    .filter(
      (pilot) =>
        Number.isFinite(pilot.latitude) &&
        Number.isFinite(pilot.longitude) &&
        insideVatssa(firs, pilot.longitude, pilot.latitude),
    )
    .map(mapPilot);

  const atc: Atc[] = [];
  const firsOnline = new Set<string>();

  const controllers = (feed.controllers ?? []).filter((c) => c.facility !== 0);
  // ATIS lives in its own feed array; tag it so we can tell it apart.
  const atisStations = (feed.atis ?? []).map((c) => ({ ...c, facility: -1 }));

  for (const station of [...controllers, ...atisStations]) {
    const prefix = station.callsign.slice(0, 4);
    if (!stations.has(prefix)) continue;

    const isAtis = station.facility === -1 || station.callsign.endsWith("_ATIS");
    const type = isAtis ? "ATIS" : (FACILITIES[station.facility] ?? "ATC");
    const isFirPosition = type === "CTR" || type === "FSS";

    const coveredFirs = isFirPosition ? resolveFirs(prefix, firById) : [];
    coveredFirs.forEach((id) => firsOnline.add(id));

    let lat: number | null = null;
    let lon: number | null = null;
    if (isFirPosition) {
      const fir = firById.get(coveredFirs[0] ?? prefix);
      if (fir) {
        lat = fir.lat;
        lon = fir.lon;
      }
    } else if (airports[prefix]) {
      [lat, lon] = airports[prefix];
    }

    atc.push({
      callsign: station.callsign,
      frequency: station.frequency,
      name: station.name,
      type,
      kind: isFirPosition ? "fir" : "airport",
      lat,
      lon,
      firs: coveredFirs,
      logon: station.logon_time,
    });
  }

  return {
    updatedAt: feed.general?.update_timestamp ?? new Date().toISOString(),
    pilots,
    atc,
    firsOnline: [...firsOnline],
  };
}
