"use client";

import { useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useUsers } from "@/hooks/useUsers";
import { titleByRating, ratingLevel } from "@/util/ratings";

type Controller = {
  cid: string;
  name: string;
  rating: string;
  title: string;
  del: boolean;
  gnd: boolean;
  twr: boolean;
  app: boolean;
  ctr: boolean;
  afrx: boolean;
};

type SortField = "name" | "title";

type SortDirection = "asc" | "desc";

function StatusIcon({ active }: { active: boolean }) {
  return active ? (
    <Check
      className="mx-auto h-5 w-5 text-secondary"
      strokeWidth={2.5}
      aria-label="Available"
    />
  ) : (
    <X
      className="mx-auto h-5 w-5 text-red-500"
      strokeWidth={2.5}
      aria-label="Unavailable"
    />
  );
}

function RatingBadge({ rating }: { rating: string }) {
  return (
    <span className="inline-flex min-w-11 items-center justify-center rounded-full bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-300 uppercase">
      {rating}
    </span>
  );
}

export default function Roster() {
  const { users, isLoading, error } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const controllers: Controller[] = users
    .filter((user) => user.atc_active)
    .map((user) => {
      const cid = String(user.id);
      const level = ratingLevel[user.rating] ?? 0;
      const hasAfrxFss =
        user.endorsements?.facility?.some(
          (endorsement) => endorsement.rating === "AFRx FSS",
        ) ?? false;

      return {
        cid,
        name: `${user.first_name} ${user.last_name}`,
        rating: user.rating,
        title: titleByRating[user.rating] ?? user.rating,
        del: level >= 1,
        gnd: level >= 1,
        twr: level >= 2,
        app: level >= 3,
        ctr: level >= 4,
        afrx: hasAfrxFss,
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortDirection(field === "name" ? "asc" : "desc");
  }

  const normalisedSearch = searchTerm.trim().toLowerCase();
  const filteredControllers = controllers
    .filter((controller) => {
      const matchesSearch =
        normalisedSearch.length === 0 ||
        controller.name.toLowerCase().includes(normalisedSearch) ||
        controller.cid.includes(normalisedSearch);

      return matchesSearch;
    })
    .toSorted((left, right) => {
      if (sortField === "title") {
        const leftLevel = ratingLevel[left.rating] ?? 0;
        const rightLevel = ratingLevel[right.rating] ?? 0;

        if (leftLevel !== rightLevel) {
          return sortDirection === "asc"
            ? leftLevel - rightLevel
            : rightLevel - leftLevel;
        }

        const titleCompare = left.title.localeCompare(right.title);
        if (titleCompare !== 0) {
          return sortDirection === "asc" ? titleCompare : -titleCompare;
        }
      }

      const nameCompare = left.name.localeCompare(right.name);
      return sortDirection === "asc" ? nameCompare : -nameCompare;
    });

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4">
      <Image
        src="/images/south-african-a340.webp"
        alt="Hero Banner"
        className="absolute top-0 left-0 h-[50vh] w-full object-cover"
      />

      <div className="absolute inset-0 h-[50vh] bg-gradient-to-b from-zinc-950/30 via-zinc-950/45 to-zinc-950" />

      <section className="relative z-10 flex h-[50vh] w-full max-w-7xl flex-col items-center justify-center px-6 pt-[104px] text-center">
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          Controller Roster
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg">
          Find all active home and visiting controllers, and those operating on
          solo endorsements below.
        </p>
      </section>

      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 px-0 sm:px-6 py-16">
        <div className="flex w-full justify-end">
          <div className="relative w-full max-w-2/3 lg:max-w-md">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by CID"
              className="h-11 w-full rounded-xl bg-zinc-900 pr-4 pl-11 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:bg-zinc-800"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-black/55 backdrop-blur-sm">
          <div className="scrollbar overflow-x-auto">
            <table className="scrollbar min-w-[980px] w-full border-collapse text-left">
              <thead className="bg-zinc-900 text-sm uppercase text-zinc-400">
                <tr>
                  <th scope="col" className="px-4 py-4 font-semibold">
                    CID
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold">
                    Rating
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold">
                    <button
                      type="button"
                      onClick={() => toggleSort("title")}
                      className={`cursor-pointer inline-flex items-center gap-2 transition-colors ${
                        sortField === "title"
                          ? "text-white"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <span>Title</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          sortField === "title" && sortDirection === "desc"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-center font-semibold"
                  >
                    DEL
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-center font-semibold"
                  >
                    GND
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-center font-semibold"
                  >
                    TWR
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-center font-semibold"
                  >
                    APP
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-center font-semibold"
                  >
                    CTR
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-center font-semibold"
                  >
                    FSS
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-10 text-center text-sm text-zinc-400"
                    >
                      Loading controllers...
                    </td>
                  </tr>
                ) : null}

                {error ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-10 text-center text-sm text-red-400"
                    >
                      {error}
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !error
                  ? filteredControllers.map((controller) => (
                  <tr
                    key={controller.cid}
                    className="border-b border-zinc-900 text-sm text-zinc-200 transition-colors duration-150 hover:bg-zinc-900/70"
                  >
                    <td className="whitespace-nowrap px-4 py-4 text-zinc-300">
                      {controller.cid}
                    </td>
                    <td className="px-4 py-4">
                      <RatingBadge rating={controller.rating} />
                    </td>
                    <td className="px-4 py-4 text-zinc-300">
                      {controller.title}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusIcon active={controller.del} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusIcon active={controller.gnd} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusIcon active={controller.twr} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusIcon active={controller.app} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusIcon active={controller.ctr} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusIcon active={controller.afrx} />
                    </td>
                  </tr>
                    ))
                  : null}

                {!isLoading && !error && filteredControllers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-10 text-center text-sm text-zinc-400"
                    >
                      No controllers match the current search or rating filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
