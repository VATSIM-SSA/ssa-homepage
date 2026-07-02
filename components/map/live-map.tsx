"use client";

import dynamic from "next/dynamic";
import { Header } from "@/components/ui/header";
import { useVatssa } from "@/hooks/useVatssa";
import type { Atc } from "@/lib/vatssa";

const VatssaMap = dynamic(() => import("@/components/map/vatssa-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-sm text-zinc-400">
      Loading live map…
    </div>
  ),
});

const TYPE_ORDER: Record<string, number> = {
  CTR: 0,
  FSS: 1,
  APP: 2,
  TWR: 3,
  GND: 4,
  DEL: 5,
  ATIS: 6,
};

const TYPE_DOT: Record<string, string> = {
  CTR: "bg-secondary",
  FSS: "bg-secondary",
  APP: "bg-amber-400",
  TWR: "bg-red-400",
  GND: "bg-emerald-400",
  DEL: "bg-violet-400",
  ATIS: "bg-slate-400",
};

function sortAtc(a: Atc, b: Atc) {
  const order = (TYPE_ORDER[a.type] ?? 9) - (TYPE_ORDER[b.type] ?? 9);
  return order !== 0 ? order : a.callsign.localeCompare(b.callsign);
}

function cleanName(name: string) {
  // VATSIM names are "Firstname Lastname CID"; drop the trailing id.
  return name.replace(/\s*\d+$/, "").trim();
}

export function LiveMap() {
  const { data, isLoading, error } = useVatssa();

  const updatedTime = data.updatedAt
    ? new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
        hour12: false,
      }).format(new Date(data.updatedAt))
    : null;

  const atc = [...data.atc].sort(sortAtc);

  return (
    <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 items-center justify-center px-6 mx-4 py-16">
      <Header text="Live Network" />

      <p className="text-zinc-300 text-center max-w-2xl -mt-2">
        Real-time traffic and air traffic control across VATSSA airspace, straight
        from the VATSIM network.
      </p>

      <div className="relative h-[480px] sm:h-[560px] w-full overflow-hidden rounded-2xl border border-primary/30 shadow-2xl shadow-black/40">
        <VatssaMap data={data} />

        {/* live counts */}
        <div className="pointer-events-none absolute left-3 top-3 z-[500] flex flex-col gap-1.5">
          <div className="flex items-center gap-2 rounded-full bg-zinc-950/80 px-3.5 py-1.5 text-sm font-semibold text-white ring-1 ring-white/10 backdrop-blur">
            <span className="text-secondary">✈</span>
            {data.pilots.length} flying
          </div>
          <div className="flex items-center gap-2 rounded-full bg-zinc-950/80 px-3.5 py-1.5 text-sm font-semibold text-white ring-1 ring-white/10 backdrop-blur">
            <span className="text-primary-light">🗼</span>
            {data.atc.length} ATC online
          </div>
        </div>

        {/* status */}
        <div className="pointer-events-none absolute right-3 bottom-3 z-[500] rounded-full bg-zinc-950/80 px-3 py-1 text-xs text-zinc-300 ring-1 ring-white/10 backdrop-blur">
          {error
            ? "Network data unavailable"
            : updatedTime
              ? `Updated ${updatedTime} UTC`
              : isLoading
                ? "Connecting…"
                : ""}
        </div>
      </div>

      {/* online ATC roster */}
      <div className="w-full">
        <h3 className="mb-3 text-left text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
          Online ATC
        </h3>
        {atc.length === 0 ? (
          <p className="text-left text-zinc-400 text-sm">
            No VATSSA controllers are online right now. Check back soon, or
            explore training to staff a position yourself.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {atc.map((position) => (
              <div
                key={position.callsign}
                className="flex items-center gap-2.5 rounded-lg bg-zinc-900/70 px-3 py-2 ring-1 ring-white/5"
              >
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${TYPE_DOT[position.type] ?? "bg-zinc-400"}`}
                />
                <div className="min-w-0 text-left">
                  <p className="truncate text-sm font-semibold text-white">
                    {position.callsign}
                  </p>
                  <p className="truncate text-xs text-zinc-400">
                    {position.frequency} · {cleanName(position.name) || position.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default LiveMap;
