"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTimestamp } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Image } from "@/components/ui/image";
import { useEvents, type EventBooking } from "@/hooks/useEvents";
import { useBookings } from "@/hooks/useBookings";
import { useNews } from "@/hooks/useNews";
import { LiveMap } from "@/components/map/live-map";

function parseEventDate(value: string) {
  const parsed = new Date(value);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

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

function formatNewsDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

function formatBookingDate(start: string, end: string) {
  const startDate = parseEventDate(start);

  if (!end) {
    return new Intl.DateTimeFormat("en-ZA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      hour12: false,
    }).format(startDate);
  }

  return formatEventWindow(start, end) + " UTC";
}

function getEventDescription(event: EventBooking) {
  if (event.description) {
    return event.description;
  }

  if (event.type === "exam") {
    return "Help our students pass their exams by flying during their practical assessments.";
  }

  if (event.type === "event") {
    return "Join us for an exciting event and be part of the action.";
  }

  if (event.type === "training") {
    return "Support our training efforts by flying during our students' training sessions.";
  }

  return "This is a regular booking. Join us in supporting our members by flying during their bookings.";
}

export default function Home() {
  const { events, isLoading, error } = useEvents();
  const {
    bookings,
    isLoading: isBookingsLoading,
    error: bookingsError,
  } = useBookings(8);
  const { news, isLoading: isNewsLoading, error: newsError } = useNews(4);
  const upcomingEvents = [...events].sort(
    (left, right) =>
      parseEventDate(left.startTime).getTime() -
      parseEventDate(right.startTime).getTime(),
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
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-secondary">
          VATSIM Sub-Sahara Africa
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          Welcome to VATSSA.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg">
          VATSSA is the home of virtual aviation across Sub Saharan Africa, offering ATC training, realistic operations, and a welcoming community for pilots and controllers of every experience level.
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
          <div className="w-full xl:w-1/2 text-white flex flex-col items-start justify-start gap-4">
            <p className="text-center xl:text-left">
              VATSSA is a community first. We are students and engineers,
              real-world aviation professionals and complete beginners, united
              by a love of flight. Whether you are flying long-haul into Lagos,
              working approach into Nairobi, or learning your first
              top-of-descent, there is a place for you here.
            </p>
            <p className="text-center xl:text-left">
              We train and certify controllers from tower to oceanic, welcome
              pilots filing in from across the globe, and bring the continent
              together at events like our flagship Cross Africa. Structured
              training carries members from first login to first clearance to
              fully rated controller.
            </p>
            <p className="text-center xl:text-left">
              Sub-Saharan Africa is one of the most dynamic regions on earth,
              and its virtual skies deserve the same ambition as the real ones.
              This is a home for everyone who has ever looked up at the African
              sky and wanted to be part of it.
            </p>
            <p className="text-center xl:text-left text-lg font-semibold text-primary">
              The African skies are open, no matter what.
            </p>
          </div>
          <div className="h-full xl:flex justify-center items-center hidden w-1/2">
            <img
              src="/images/ssa-airspace.png"
              alt="Map of VATSSA airspace across Sub-Saharan Africa"
              className="aspect-square rounded-xl object-contain"
            />
          </div>
        </div>
      </section>

      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 items-center justify-center px-6 mx-12 py-16 text-center">
        <Header text="Latest News" />

        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8">
          {isNewsLoading && (
            <p className="text-zinc-300">Loading latest news...</p>
          )}

          {!isNewsLoading && newsError && (
            <p className="text-red-300">{newsError}</p>
          )}

          {!isNewsLoading && !newsError && news.length === 0 && (
            <p className="text-zinc-400">
              Hmm. There are no news posts available right now.
            </p>
          )}

          {!isNewsLoading &&
            !newsError &&
            news.slice(0, 4).map((post) => {
              const destination =
                post.url || "https://community.vatssa.com/latest";

              return (
                <Card
                  key={post.id}
                  onClick={() => window.open(destination, "_blank")}
                  className="cursor-pointer transition-all duration-200"
                >
                  <CardContent>
                    <CardHeader>{post.title}</CardHeader>
                    <CardTimestamp>
                      by {post.author} - {formatNewsDate(post.publishedAt)}
                    </CardTimestamp>
                    <p className="text-zinc-300 text-base overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
                      {post.excerpt}
                    </p>
                    <a className="text-white text-sm hover:underline cursor-pointer">
                      Read More →
                    </a>
                  </CardContent>
                </Card>
              );
            })}
        </div>

        <a className="text-neutral-400 text-sm hover:underline cursor-pointer">
          View All →
        </a>
      </section>

      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 items-center justify-center px-6 mx-12 py-16 text-center">
        <Header text="Upcoming Events" />

        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8">
          {isLoading && (
            <p className="text-zinc-300">Loading upcoming events...</p>
          )}

          {!isLoading && error && <p className="text-red-300">{error}</p>}

          {!isLoading && !error && upcomingEvents.length === 0 && (
            <p className="text-zinc-400">
              Hmm. Unfortunately, there are no upcoming events at the moment.
            </p>
          )}

          {!isLoading &&
            !error &&
            upcomingEvents.map((event) => {
              const destination = event.link || "https://cc.vatssa.com/booking";

              return (
                <Card
                  key={event.id}
                  onClick={() => window.open(destination, "_blank")}
                  className="cursor-pointer transition-all duration-200"
                  snap="top"
                  media={
                    <Image
                      src={event.banner || undefined}
                      alt={`${event.title} banner`}
                      className="aspect-video w-full object-cover"
                      fallbackContent="Event image unavailable"
                    />
                  }
                >
                  <CardContent>
                    <CardHeader>{event.title}</CardHeader>
                    <CardTimestamp>
                      {formatEventWindow(event.startTime, event.endTime)} UTC
                    </CardTimestamp>
                    <p className="text-zinc-300 text-base overflow-hidden h-12 overflow-y-hidden">
                      {getEventDescription(event)}
                    </p>
                    <p className="text-white text-sm hover:underline cursor-pointer">
                      Read More →{" "}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </section>

      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 items-center justify-center px-6 mx-12 py-16 text-center">
        <Header text="Upcoming Bookings" />

        <div className="grid grid-cols-1 w-full gap-2">
          {isBookingsLoading && (
            <p className="text-zinc-300">Loading upcoming bookings...</p>
          )}

          {!isBookingsLoading && bookingsError && (
            <p className="text-red-300">{bookingsError}</p>
          )}

          {!isBookingsLoading && !bookingsError && bookings.length === 0 && (
            <p className="text-zinc-400">
              Hmm. There are no upcoming bookings right now.
            </p>
          )}

          {!isBookingsLoading &&
            !bookingsError &&
            bookings.map((booking) => {
              const title = booking.callsign || booking.name || "Booking";

              return (
                <div
                  key={booking.id}
                  className="transition-all duration-200 px-6 py-3 flex w-full flex-row justify-between items-center overflow-hidden rounded-xl bg-zinc-800"
                >
                  <p className="text-left w-full text-lg font-semibold text-white">
                    {title}
                  </p>
                  <p className="text-zinc-400 flex w-full flex-col items-end justify-center text-left">
                    {formatBookingDate(booking.time_start, booking.time_end)}
                  </p>
                </div>
              );
            })}
        </div>
      </section>
      <LiveMap />
    </div>
  );
}
