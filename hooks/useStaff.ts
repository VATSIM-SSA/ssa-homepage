"use client";

import { useEffect, useState } from "react";

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  email?: string;
  cid?: string;
};

export type StaffGroups = Record<string, StaffMember[]>;

type StaffResponse =
  | StaffGroups
  | { data: StaffGroups }
  | Array<{ data: StaffGroups }>;

function isStaffGroups(value: unknown): value is StaffGroups {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDataEnvelope(value: unknown): value is { data: StaffGroups } {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    isStaffGroups((value as { data?: unknown }).data)
  );
}

function normaliseStaff(payload: StaffResponse): StaffGroups {
  if (Array.isArray(payload)) {
    if (payload.length > 0 && isDataEnvelope(payload[0])) {
      return payload[0].data;
    }

    return {};
  }

  if (isDataEnvelope(payload)) {
    return payload.data;
  }

  if (isStaffGroups(payload)) {
    return payload;
  }

  return {};
}

export function useStaff() {
  const [staffGroups, setStaffGroups] = useState<StaffGroups>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadStaff() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/staff", {
          cache: "no-store",
        });

        if (!response.ok) {
          const message = await response.text();

          throw new Error(message || "Failed to fetch staff.");
        }

        const payload = (await response.json()) as StaffResponse;

        if (!isActive) {
          return;
        }

        setStaffGroups(normaliseStaff(payload));
      } catch (caughtError) {
        if (!isActive) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to fetch staff.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadStaff();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    staffGroups,
    isLoading,
    error,
  };
}

export default useStaff;
