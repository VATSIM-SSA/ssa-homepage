"use client";

import { useEffect, useRef, useState } from "react";
import type { VatssaData } from "@/lib/vatssa";

const EMPTY: VatssaData = {
  updatedAt: "",
  pilots: [],
  atc: [],
  firsOnline: [],
};

const REFRESH_MS = 30_000;

export function useVatssa() {
  const [data, setData] = useState<VatssaData>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    let isActive = true;

    async function load() {
      try {
        const response = await fetch("/api/vatssa", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const payload = (await response.json()) as VatssaData;
        if (!isActive) return;
        setData(payload);
        setError(null);
        hasLoaded.current = true;
      } catch (caughtError) {
        if (!isActive) return;
        // Keep the last good data on screen; only surface an error on first load.
        if (!hasLoaded.current) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Failed to load live network data.",
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    load();
    const timer = setInterval(load, REFRESH_MS);

    return () => {
      isActive = false;
      clearInterval(timer);
    };
  }, []);

  return { data, isLoading, error };
}

export default useVatssa;
