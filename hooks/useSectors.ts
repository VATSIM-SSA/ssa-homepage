"use client";

import { useEffect, useState } from "react";

// Mirrors data/status.json in VATSIM-SSA/sectorfile-overview. Every field is
// produced by airac.py --status-json from the AIRAC tracker issue; nothing here
// is derived on the client. In particular `vatis_url` is the GitHub *release
// asset* (which downloads properly) and is null for sectors with no profile —
// so a vATIS link is only ever shown when the JSON supplies one.
export type SectorStatus = "current" | "one_behind" | "two_behind" | "older";

export type Sector = {
  repo: string;
  code: string;
  name: string;
  label: string;
  region: string;
  cycle: string;
  cycle_effective: string | null;
  status: SectorStatus;
  marker: string;
  cycles_behind: number | null;
  download_url: string;
  download_is_override: boolean;
  vatis_url: string | null;
  github_url: string;
  gng_url: string;
  includes: string | null;
};

export type SectorRegion = {
  region: string;
  sectors: Sector[];
};

export type SectorStatusBoard = {
  generated_at: string;
  current_cycle: string;
  current_cycle_effective: string | null;
  current_cycle_effective_human: string | null;
  legend: Record<SectorStatus, string>;
  regions: SectorRegion[];
};

export function useSectors() {
  const [board, setBoard] = useState<SectorStatusBoard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadSectors() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/data/sectors", {
          cache: "no-store",
        });

        if (!response.ok) {
          const message = await response.text();

          throw new Error(message || "Failed to fetch sector status.");
        }

        const payload = (await response.json()) as SectorStatusBoard;

        if (!isActive) {
          return;
        }

        setBoard(payload);
      } catch (caughtError) {
        if (!isActive) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to fetch sector status.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadSectors();

    return () => {
      isActive = false;
    };
  }, []);

  const sectors = board?.regions.flatMap((region) => region.sectors) ?? [];

  return {
    board,
    regions: board?.regions ?? [],
    sectors,
    isLoading,
    error,
  };
}

export default useSectors;
