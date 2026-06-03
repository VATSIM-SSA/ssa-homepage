"use client";

import { useEffect, useState } from "react";

export type Rva = {
  name: string;
  site: string;
  tier: number;
  signup?: string;
  description: string;
};

type RvasResponse = Rva[] | { data: Rva[] } | Array<{ data: Rva[] }>;

function isDataEnvelope(value: unknown): value is { data: Rva[] } {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    Array.isArray((value as { data?: unknown }).data)
  );
}

function normaliseRvas(payload: RvasResponse): Rva[] {
  if (Array.isArray(payload)) {
    if (payload.length > 0 && isDataEnvelope(payload[0])) {
      return payload[0].data;
    }

    return payload as Rva[];
  }

  return payload.data;
}

export function useRvas() {
  const [rvas, setRvas] = useState<Rva[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadRvas() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/data/rvas", {
          cache: "no-store",
        });

        if (!response.ok) {
          const message = await response.text();

          throw new Error(message || "Failed to fetch rVAs.");
        }

        const payload = (await response.json()) as RvasResponse;

        if (!isActive) {
          return;
        }

        setRvas(normaliseRvas(payload));
      } catch (caughtError) {
        if (!isActive) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to fetch rVAs.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadRvas();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    rvas,
    isLoading,
    error,
  };
}

export default useRvas;
