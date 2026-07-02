"use client";

import { useEffect, useState } from "react";

export type Booking = {
  id: number;
  source: string;
  vatsim_booking: string | null;
  name?: string;
  callsign?: string;
  position_id?: number;
  time_start: string;
  time_end: string;
  user_id?: number;
  training?: number;
  event?: number;
  exam?: number;
  deleted?: number;
  created_at?: string;
  updated_at?: string;
};

type BookingsResponse = {
  data: Booking[];
};

export function useBookings(limit?: number) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadBookings() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/data/bookings", {
          cache: "no-store",
        });

        if (!response.ok) {
          const message = await response.text();

          throw new Error(message || "Failed to fetch bookings.");
        }

        const payload = (await response.json()) as BookingsResponse;

        if (!isActive) {
          return;
        }

        const fetchedBookings = payload.data;

        setBookings(
          typeof limit === "number"
            ? fetchedBookings.slice(0, limit)
            : fetchedBookings,
        );
      } catch (caughtError) {
        if (!isActive) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to fetch bookings.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      isActive = false;
    };
  }, [limit]);

  return {
    bookings,
    isLoading,
    error,
  };
}

export default useBookings;
