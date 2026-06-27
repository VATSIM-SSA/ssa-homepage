import { loadVatssaData } from "@/lib/vatssa-server";
import type { VatssaData } from "@/lib/vatssa";

// Always run on the Node runtime (needs fs) and never prerender — this is live data.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The VATSIM data feed refreshes every ~15s and asks consumers to cache between
// polls. Share a single fetch across all visitors with a short-lived cache.
const TTL_MS = 15_000;

let cache: { at: number; data: VatssaData } | null = null;
let inFlight: Promise<VatssaData> | null = null;

async function getData(): Promise<VatssaData> {
  if (cache && Date.now() - cache.at < TTL_MS) {
    return cache.data;
  }
  if (!inFlight) {
    inFlight = loadVatssaData()
      .then((data) => {
        cache = { at: Date.now(), data };
        return data;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

export async function GET() {
  try {
    const data = await getData();
    return Response.json(data, {
      headers: { "cache-control": "public, max-age=15" },
    });
  } catch (error) {
    // Serve the last good snapshot if the upstream feed hiccups.
    if (cache) {
      return Response.json(cache.data, {
        headers: { "cache-control": "public, max-age=15" },
      });
    }
    return new Response(
      error instanceof Error ? error.message : "Failed to load VATSIM data.",
      { status: 502 },
    );
  }
}
