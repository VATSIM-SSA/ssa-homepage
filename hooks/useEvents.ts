"use client";

import { useEffect, useState } from "react";

export type EventBooking = {
  id: number;
  callsign: string;
  time_start: string;
  time_end: string;
  training: boolean;
  event: boolean;
  exam: boolean;
  created_at: string;
  updated_at: string;
};

type EventsResponse =
  | EventBooking[]
  | { data: EventBooking[] }
  | Array<{ data: EventBooking[] }>;

function normaliseEvents(payload: EventsResponse): EventBooking[] {
  if (Array.isArray(payload)) {
    if (payload.length > 0 && "data" in payload[0]) {
      return payload[0].data;
    }

    return payload as EventBooking[];
  }

  return payload.data;
}

export function useEvents() {
  const [events, setEvents] = useState<EventBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadEvents() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/data/events", {
          cache: "no-store",
        });

        if (!response.ok) {
          const message = await response.text();

          throw new Error(message || "Failed to fetch events.");
        }

        const payload = (await response.json()) as EventsResponse;

        if (!isActive) {
          return;
        }

        setEvents(normaliseEvents(payload));
      } catch (caughtError) {
        if (!isActive) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to fetch events.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    events,
    isLoading,
    error,
  };
}

export default useEvents;