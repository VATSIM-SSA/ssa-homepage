import { connection } from "next/server";

// The hero photo, resolved on the SERVER so the correct image is in the HTML
// on first paint.
//
// This is deliberately the one piece of bucket data the client does not fetch
// for itself. Everything else on the site (news, staff, bookings) can pop in a
// moment late without anyone noticing; a full-bleed hero cannot — swapping it
// after hydration means every visitor watches the old photo get replaced.

export interface ScreenshotWinner {
  // Displayed verbatim as the image credit, so the JSON carries the exact
  // "Name - CID" string rather than the two fields separately.
  name: string;
  link: string;
  month: string;
}

export interface Hero {
  src: string;
  alt: string;
  credit: string;
}

// Used until a winner resolves, and again if the JSON or the image behind it is
// unreachable. The credit travels with the file: a hero must never be captioned
// with someone else's name.
export const FALLBACK_HERO: Hero = {
  src: "/images/south-african-a340.webp",
  alt: "South African Airways A340",
  credit: "Nafan - 1708206",
};

export function heroFromWinner(winner: ScreenshotWinner): Hero {
  return {
    src: winner.link,
    alt: `VATSSA screenshot competition winner by ${winner.name}`,
    credit: winner.name,
  };
}

function isScreenshotWinner(value: unknown): value is ScreenshotWinner {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as ScreenshotWinner).name === "string" &&
    typeof (value as ScreenshotWinner).link === "string" &&
    typeof (value as ScreenshotWinner).month === "string"
  );
}

export function normaliseWinners(payload: unknown): ScreenshotWinner[] {
  let winners: unknown = payload;

  if (typeof payload === "object" && payload !== null && "data" in payload) {
    winners = (payload as { data?: unknown }).data;
  }

  if (!Array.isArray(winners) || !winners.every(isScreenshotWinner)) {
    throw new Error("Invalid screenshot competition response.");
  }

  return winners;
}

/**
 * The hero for this request.
 *
 * Never throws and never returns null: a bucket that is down, misconfigured or
 * serving nonsense degrades to the shipped photo rather than taking the layout
 * with it. The file is kept newest-first, so entry zero is the current winner.
 */
export async function getHero(): Promise<Hero> {
  // Stop prerendering here. Without this the layout resolves at BUILD time,
  // where SSC_API does not exist (it is set in the VPS `.env`, not baked into
  // the image), so every page would ship a statically prerendered fallback and
  // never show a winner at all.
  await connection();

  const sscApi = process.env.SSC_API;

  if (!sscApi) {
    return FALLBACK_HERO;
  }

  try {
    const response = await fetch(sscApi, {
      // Read fresh on every request. A cached value would be baked into the
      // build output, where SSC_API is not set — the first visitor after a
      // deploy would get the fallback until the cache expired.
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      return FALLBACK_HERO;
    }

    const winners = normaliseWinners(await response.json());

    return winners[0] ? heroFromWinner(winners[0]) : FALLBACK_HERO;
  } catch {
    // A slow or broken bucket must not block the page. Three seconds is well
    // inside what a visitor tolerates, and the fallback is always correct.
    return FALLBACK_HERO;
  }
}
