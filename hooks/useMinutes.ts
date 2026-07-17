"use client";

import { useEffect, useState } from "react";

export interface Minute {
  id: string;
  title: string;
  // Meeting minutes are identified by when the meeting happened, so this is
  // normally just a date rather than a sentence.
  description: string;
  url: string;
}

function isMinute(value: unknown): value is Minute {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Minute).id === "string" &&
    typeof (value as Minute).title === "string" &&
    typeof (value as Minute).description === "string" &&
    typeof (value as Minute).url === "string"
  );
}

function normaliseMinutes(payload: unknown): Minute[] {
  let minutes: unknown;

  if (typeof payload === "object" && payload !== null && "data" in payload) {
    minutes = (payload as { data: { minutes?: unknown } }).data.minutes;
  } else if (
    typeof payload === "object" &&
    payload !== null &&
    "minutes" in payload
  ) {
    minutes = (payload as { minutes?: unknown }).minutes;
  }

  if (!Array.isArray(minutes) || !minutes.every(isMinute)) {
    throw new Error("Invalid minutes response.");
  }

  return minutes;
}

export function useMinutes() {
  const [minutes, setMinutes] = useState<Minute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadMinutes() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/data/minutes", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const payload = await response.json();

        if (!isActive) {
          return;
        }

        setMinutes(normaliseMinutes(payload));
      } catch (caughtError) {
        if (!isActive) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to fetch meeting minutes.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadMinutes();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    minutes,
    isLoading,
    error,
  };
}

export default useMinutes;
