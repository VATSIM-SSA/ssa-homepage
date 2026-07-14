"use client";

import { useEffect, useState } from "react";

export interface Policy {
  id: string;
  title: string;
  description: string;
  url: string;
}

type PoliciesResponse =
  | { policies: Policy[] }
  | { data: { policies: Policy[] } };

function isPolicy(value: unknown): value is Policy {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Policy).id === "string" &&
    typeof (value as Policy).title === "string" &&
    typeof (value as Policy).description === "string" &&
    typeof (value as Policy).url === "string"
  );
}

function normalisePolicies(payload: unknown): Policy[] {
  let policies: unknown;

  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload
  ) {
    policies = (payload as { data: { policies?: unknown } }).data.policies;
  } else if (
    typeof payload === "object" &&
    payload !== null &&
    "policies" in payload
  ) {
    policies = (payload as { policies?: unknown }).policies;
  }

  if (!Array.isArray(policies) || !policies.every(isPolicy)) {
    throw new Error("Invalid policy response.");
  }

  return policies;
}

export function usePolicies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadPolicies() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/policies", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const payload = await response.json();

        if (!isActive) return;

        setPolicies(normalisePolicies(payload));
      } catch (error) {
        if (!isActive) return;

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch policies.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadPolicies();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    policies,
    isLoading,
    error,
  };
}