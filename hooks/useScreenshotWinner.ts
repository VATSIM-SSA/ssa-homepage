"use client";

import { useEffect, useState } from "react";

export interface ScreenshotWinner {
  // Displayed verbatim as the image credit, so the JSON carries the exact
  // "Name - CID" string rather than the two fields separately.
  name: string;
  link: string;
  month: string;
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

function normaliseWinners(payload: unknown): ScreenshotWinner[] {
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
 * Screenshot-competition winners from the MinIO `homepage-data` bucket.
 *
 * The file is kept newest-first, so the first entry is the winner currently on
 * display. Past months stay in the array as a record.
 */
export function useScreenshotWinner() {
  const [winners, setWinners] = useState<ScreenshotWinner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadWinners() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/data/ssc", {
          cache: "no-store",
        });

        if (!response.ok) {
          const message = await response.text();

          throw new Error(
            message || "Failed to fetch screenshot competition winners.",
          );
        }

        const payload = await response.json();

        if (!isActive) {
          return;
        }

        setWinners(normaliseWinners(payload));
      } catch (caughtError) {
        if (!isActive) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to fetch screenshot competition winners.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadWinners();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    winners,
    winner: winners[0] ?? null,
    isLoading,
    error,
  };
}

export default useScreenshotWinner;
