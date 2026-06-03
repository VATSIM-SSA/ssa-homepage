"use client";

import { useEffect, useState } from "react";

export type EventType = "exam" | "event" | "training" | "booking";

export type EventBooking = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  type: EventType;
  description: string;
  link: string | null;
  banner: string | null;
  airportIcao: string | null;
};

type LegacyBooking = {
  id: number;
  callsign: string;
  time_start: string;
  time_end: string;
  training?: boolean;
  event?: boolean;
  exam?: boolean;
};

type ApiEvent = {
  id: number;
  type: string;
  name: string;
  link: string;
  airports?: Array<{ icao?: string | null }>;
  start_time: string;
  end_time: string;
  short_description?: string | null;
  description?: string | null;
  banner?: string | null;
};

type RawEvent = LegacyBooking | ApiEvent;

type EventsResponse =
  | RawEvent[]
  | { data: RawEvent[] }
  | Array<{ data: RawEvent[] }>;

function isDataEnvelope(value: unknown): value is { data: RawEvent[] } {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    Array.isArray((value as { data?: unknown }).data)
  );
}

function mapLegacyType(event: LegacyBooking): EventType {
  if (event.exam) {
    return "exam";
  }

  if (event.event) {
    return "event";
  }

  if (event.training) {
    return "training";
  }

  return "booking";
}

function mapApiType(type: string): EventType {
  const lowered = type.toLowerCase();

  if (lowered.includes("exam")) {
    return "exam";
  }

  if (lowered.includes("training")) {
    return "training";
  }

  if (lowered.includes("event")) {
    return "event";
  }

  return "booking";
}

function normaliseEvent(event: RawEvent): EventBooking {
  if ("start_time" in event) {
    return {
      id: event.id,
      title: event.name,
      startTime: event.start_time,
      endTime: event.end_time,
      type: mapApiType(event.type),
      description: event.short_description || event.description || "",
      link: event.link || null,
      banner: event.banner || null,
      airportIcao: event.airports?.[0]?.icao || null,
    };
  }

  return {
    id: event.id,
    title: event.callsign,
    startTime: event.time_start,
    endTime: event.time_end,
    type: mapLegacyType(event),
    description: "",
    link: null,
    banner: null,
    airportIcao: null,
  };
}

function normaliseEvents(payload: EventsResponse): EventBooking[] {
  let events: RawEvent[] = [];

  if (Array.isArray(payload)) {
    if (payload.length > 0 && isDataEnvelope(payload[0])) {
      events = payload[0].data;
    } else {
      events = payload as RawEvent[];
    }
  } else if (isDataEnvelope(payload)) {
    events = payload.data;
  }

  return events.map(normaliseEvent);
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