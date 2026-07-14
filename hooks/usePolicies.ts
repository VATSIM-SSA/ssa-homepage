"use client";

import { useEffect, useState } from "react";

export type Policy = {
  id: string;
  title: string;
  description: string;
  url: string;
};

type PoliciesResponse =
  | { policies: Policy[] }
  | { data: { policies: Policy[] } };

function normalisePolicies(payload: PoliciesResponse): Policy[] {
  if ("data" in payload) {
    return payload.data.policies;
  }

  return payload.policies;
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

        const payload = (await response.json()) as PoliciesResponse;

        if (!isActive) return;

        setPolicies(normalisePolicies(payload));
      } catch (err) {
        if (!isActive) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch policies."
        );
      } finally {
        if (isActive) setIsLoading(false);
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