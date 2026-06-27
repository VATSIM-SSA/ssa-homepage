// Shared types and constants for the VATSSA live network map.
// Safe to import from both server (route handler) and client (map) code —
// keep this file free of any Node- or browser-only APIs.

export const VATSIM_DATA_URL = "https://data.vatsim.net/v3/vatsim-data.json";

// Static assets served from /public, fetched by the client map.
export const FIRS_GEOJSON_URL = "/data/vatssa-firs.geojson";

// VATSIM controller facility ids -> short labels.
export const FACILITIES: Record<number, string> = {
  0: "OBS",
  1: "FSS",
  2: "DEL",
  3: "GND",
  4: "TWR",
  5: "APP",
  6: "CTR",
};

// An aircraft currently inside VATSSA airspace.
export type Pilot = {
  cid: number;
  callsign: string;
  name: string;
  lat: number;
  lon: number;
  heading: number;
  altitude: number;
  groundspeed: number;
  aircraft: string;
  departure: string;
  arrival: string;
};

// "fir" positions colour an airspace sector; "airport" positions drop a marker.
export type AtcKind = "fir" | "airport";

// An online VATSSA controller (or ATIS) position.
export type Atc = {
  callsign: string;
  frequency: string;
  name: string;
  type: string; // CTR | APP | TWR | GND | DEL | FSS | ATIS
  kind: AtcKind;
  lat: number | null;
  lon: number | null;
  firs: string[]; // FIR ids this position lights up (CTR/FSS only)
  logon: string;
};

export type VatssaData = {
  updatedAt: string;
  pilots: Pilot[];
  atc: Atc[];
  firsOnline: string[]; // union of FIR ids with an online CTR/FSS
};

// Properties carried on each feature of vatssa-firs.geojson.
export type FirProperties = {
  id: string;
  name: string;
  oceanic: boolean;
  lat: number; // label centroid
  lon: number;
};
