"use client";

import { SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTimestamp,
} from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { useEvents, type EventBooking } from "@/hooks/useEvents";

function parseEventDate(value: string) {
  return new Date(value.replace(" ", "T") + "Z");
}

function formatEventWindow(start: string, end: string) {
  const startDate = parseEventDate(start);
  const endDate = parseEventDate(end);

  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hour12: false,
  }).formatRange(startDate, endDate);
}

function getBookingTypeBadge(event: EventBooking) {
  if (event.exam) {
    return {
      label: "Exam",
      className: "bg-rose-500/20 text-rose-200 ring-1 ring-rose-400/30",
    };
  }

  if (event.event) {
    return {
      label: "Event",
      className: "bg-sky-500/20 text-sky-200 ring-1 ring-sky-400/30",
    };
  }

  if (event.training) {
    return {
      label: "Training",
      className: "bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/30",
    };
  }

  return {
    label: "Booking",
    className: "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/30",
  };
}

function getBookingDescription(event: EventBooking) {
  if (event.exam) {
    return "Help our students pass their exams by flying during their practical assessments.";
  }

  if (event.event) {
    return "Join us for an exciting event and be part of the action.";
  }

  if (event.training) {
    return "Support our training efforts by flying during our students' training sessions.";
  }

  return "This is a regular booking. Join us in supporting our members by flying during their bookings.";
}

export default function Home() {
  const { events, isLoading, error } = useEvents();
  const upcomingEvents = events.sort(
    (left, right) =>
      parseEventDate(left.time_start).getTime() -
      parseEventDate(right.time_start).getTime(),
  );

  return (
    <div className="px-4 relative flex flex-col min-h-dvh w-full items-center justify-center overflow-hidden bg-zinc-950">
      <img
        src="/images/south-african-a340.png"
        alt="South African Airways A340"
        className="absolute top-0 left-0 h-dvh w-full object-cover"
      />

      <div className="absolute h-screen inset-0 bg-gradient-to-b from-zinc-950/30 via-zinc-950/45 to-zinc-950">
        <p className="absolute bottom-3 right-3 text-zinc-700 text-sm">
          Image Credit: Nafan - 1708206
        </p>
      </div>

      <section className="h-[100vh] relative z-10 flex w-full max-w-7xl flex-col items-center justify-center px-6 mx-4 py-16 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-amber-300">
          VATSIM Sub-Sahara Africa
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          Welcome to VATSSA.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg">
          Some sort of catchy, whitty, and informative description about VATSSA
          and what we do. This is just placeholder text for now.
        </p>
        <div className="mt-8 flex items-center gap-3 flex-row">
          <Button variant="filled" href="https://eaip2.vatssa.com/">
            Join VATSSA
          </Button>
          <Button variant="outline" href="https://cc.vatssa.com/">
            Explore Training
          </Button>
        </div>
      </section>

      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 items-center justify-center px-6 mx-4 py-16 text-center">
        <Header text="About Us" />

        <div className="flex xl:flex-row flex-col w-full gap-12 items-center justify-center">
          <div className="w-full xl:w-1/2 text-white flex flex-col items-start justify-start gap-2">
            {/* <h1 className="font-semibold whitespace-nowrap text-base sm:text-xl md:text-3xl">Heading</h1> */}
            <p className="text-center xl:text-left">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris id
              ultrices massa. Quisque quis justo sed augue volutpat pulvinar sit
              amet sed ligula. Donec eu ante sed metus molestie dictum. Maecenas
              vitae augue quis nisi molestie aliquet sed quis nunc. In eget mi
              et sem rhoncus elementum a quis ligula. Sed sagittis dolor quis
              hendrerit molestie. Curabitur eget sem a leo ornare varius et a
              turpis. Integer sit amet mattis metus. Pellentesque luctus egestas
              metus, sit amet ornare massa tincidunt vel. Donec efficitur velit
              mauris, eget porta lorem convallis tincidunt. Curabitur a ante
              quis libero vulputate pellentesque. Ut rhoncus arcu in lobortis
              tempus. Donec blandit mauris nisl, non lacinia mi vulputate sit
              amet. Proin congue magna lobortis nisi faucibus tristique vitae
              sit amet velit. Integer efficitur orci a dui tincidunt gravida.
              <br />
              <br />
              Mauris malesuada velit euismod dui placerat, in aliquet tellus
              volutpat. Cras sit amet sapien ex. Sed dignissim sapien nunc, eu
              bibendum erat commodo sit amet. Sed viverra metus eget nulla
              bibendum euismod. Sed lacinia ante ac lacus porttitor scelerisque.
              Quisque luctus risus leo, ullamcorper maximus lorem aliquam non.
              Maecenas volutpat purus non dui congue, non maximus velit tempus.
              Phasellus et lacus luctus, venenatis mauris vitae, interdum quam.
              Phasellus vel mauris eget lorem placerat aliquam ac quis mauris.
              Morbi risus purus, tempor non consectetur vel, imperdiet id neque.
              Nullam cursus tempus leo sit amet semper. Pellentesque varius
              purus quis bibendum dignissim. Pellentesque dapibus, massa eget
              vulputate hendrerit, risus est rhoncus dui, a pharetra metus lorem
              et arcu.
            </p>
          </div>
          <div className="h-full xl:flex justify-center items-center hidden xl:w-1/2">
            <img
              src="/images/ssa-firs.svg"
              alt="Upcoming Event"
              className="aspect-square rounded-xl object-contain"
            />
          </div>
        </div>
      </section>

      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 items-center justify-center px-6 mx-12 py-16 text-center">
        <Header text="Upcoming Bookings" />

        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8">
          {isLoading && (
            <p className="text-zinc-300">Loading upcoming bookings...</p>
          )}

          {!isLoading && error && <p className="text-red-300">{error}</p>}

          {!isLoading && !error && upcomingEvents.length === 0 && (
            <p className="text-zinc-400">
              Hmm. Unfortunately, there are no upcoming bookings at the moment.
            </p>
          )}

          {!isLoading &&
            !error &&
            upcomingEvents.map((event) => {
              const badge = getBookingTypeBadge(event);

              return (
                <Card key={event.id} onClick={() =>
                        window.open("https://cc.vatssa.com/booking", "_blank")
                      } className="cursor-pointer transition-all duration-200">
                  <CardContent>
                    <CardHeader>
                      {event.callsign}
                    </CardHeader>
                    <CardTimestamp>
                      {formatEventWindow(event.time_start, event.time_end)} UTC
                    </CardTimestamp>
                    <p
                      className={`rounded-full px-4 py-1 text-sm font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </p>
                    <p className="text-zinc-400 text-base">
                      {getBookingDescription(event)}
                    </p>
                    <p className="text-white text-sm hover:underline cursor-pointer">Read More → </p>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </section>
    </div>
  );
}
