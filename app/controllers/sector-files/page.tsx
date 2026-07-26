"use client";

import { useMemo, useState } from "react";
import {
  Code,
  Download,
  ExternalLink,
  FileJson,
  Radio,
  Search,
  Settings,
  TriangleAlert,
} from "lucide-react";
import { Header } from "@/components/ui/header";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { useSectors, type Sector, type SectorStatus } from "@/hooks/useSectors";

const AIRPORTS_JSON_URL =
  "https://raw.githubusercontent.com/VATSIM-SSA/sectorfile-overview/main/vatis/airports-json/airports.json";
const VATIS_GUIDE_URL = "https://vatis.clowd.io/#/?id=what-is-vatis";
const ORG_URL = "https://github.com/VATSIM-SSA";
const TRACKER_URL = "https://github.com/VATSIM-SSA/sectorfile-overview/issues";
const FEEDBACK_URL = "https://cc.vatssa.com/feedback";

// The four states airac.py can emit, with the same colours the Discord board
// uses. Keyed off `status` rather than the emoji so the two stay in lock-step.
const statusStyles: Record<
  SectorStatus,
  { dot: string; text: string; chip: string; label: string }
> = {
  current: {
    dot: "bg-secondary",
    text: "text-secondary",
    chip: "bg-secondary/15 text-secondary",
    label: "Current",
  },
  one_behind: {
    dot: "bg-primary",
    text: "text-primary",
    chip: "bg-primary/15 text-primary",
    label: "One behind",
  },
  two_behind: {
    dot: "bg-amber-400",
    text: "text-amber-400",
    chip: "bg-amber-400/15 text-amber-400",
    label: "Two behind",
  },
  // Neutral rather than zinc: the zinc scale is remapped to VATSSA teal in
  // globals.css, so a zinc dot would read as another shade of "behind" instead
  // of as grey.
  older: {
    dot: "bg-neutral-400",
    text: "text-neutral-300",
    chip: "bg-neutral-700 text-neutral-200",
    label: "Older",
  },
};

type StatusFilter = "all" | "current" | "behind";

function StatTile({
  value,
  label,
  accent = "text-white",
}: {
  value: string | number;
  label: string;
  accent?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-zinc-800 px-4 py-6 text-center">
      <span className={`text-3xl font-semibold sm:text-4xl ${accent}`}>
        {value}
      </span>
      <span className="text-xs uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </span>
    </div>
  );
}

function SectorRow({ sector }: { sector: Sector }) {
  const style = statusStyles[sector.status] ?? statusStyles.older;

  return (
    <div className="flex flex-col gap-4 border-b border-zinc-800 px-4 py-4 last:border-b-0 lg:flex-row lg:items-center lg:justify-between lg:px-6">
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-base font-semibold text-white">
              {sector.label}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold ${style.chip}`}
            >
              AIRAC {sector.cycle}
            </span>
            <span className="sr-only">{style.label}</span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            {sector.name}
            {sector.includes ? (
              <span className="text-zinc-500"> · incl. {sector.includes}</span>
            ) : null}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {/* A standard aero-nav link is a file. Anything else is an override the
            tracker points elsewhere (e.g. while a sector is unavailable), so it
            must not pretend to be a download — same rule as the Discord board. */}
        {sector.download_is_override ? (
          <Button
            variant="outline"
            href={sector.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs"
          >
            <TriangleAlert className="h-4 w-4" /> How to get it
          </Button>
        ) : (
          <Button
            variant="filled"
            href={sector.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs"
          >
            <Download className="h-4 w-4" /> Sector file
          </Button>
        )}

        {/* Only ever rendered when the tracker supplies a profile. The URL is the
            GitHub release asset, which downloads; a raw file would open in the
            browser instead. Never constructed here. */}
        {sector.vatis_url ? (
          <Button
            variant="outline"
            href={sector.vatis_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs"
          >
            <FileJson className="h-4 w-4" /> vATIS
          </Button>
        ) : (
          <span className="rounded-full border border-zinc-700 px-4 py-2 text-xs text-zinc-500">
            No vATIS
          </span>
        )}

        <a
          href={sector.github_url}
          target="_blank"
          rel="noopener noreferrer"
          title={`${sector.repo} on GitHub`}
          className="rounded-full p-2 text-zinc-400 transition-colors duration-200 hover:text-white"
        >
          <Code className="h-4 w-4" />
          <span className="sr-only">{sector.repo} on GitHub</span>
        </a>
        <a
          href={sector.gng_url}
          target="_blank"
          rel="noopener noreferrer"
          title={`${sector.code} on GNG`}
          className="rounded-full p-2 text-zinc-400 transition-colors duration-200 hover:text-white"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">{sector.code} on GNG</span>
        </a>
      </div>
    </div>
  );
}

function SetupStep({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-2xl bg-zinc-800 p-6 text-left">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-zinc-950">
        {number}
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-white">{title}</h3>
        <div className="text-sm leading-6 text-zinc-300">{children}</div>
      </div>
    </div>
  );
}

export default function SectorFiles() {
  const { board, regions, sectors, isLoading, error } = useSectors();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const counts = useMemo(() => {
    return {
      total: sectors.length,
      current: sectors.filter((sector) => sector.status === "current").length,
      behind: sectors.filter((sector) => sector.status !== "current").length,
      vatis: sectors.filter((sector) => sector.vatis_url).length,
    };
  }, [sectors]);

  const normalisedSearch = searchTerm.trim().toLowerCase();

  const filteredRegions = regions
    .map((region) => ({
      region: region.region,
      sectors: region.sectors.filter((sector) => {
        const matchesSearch =
          normalisedSearch.length === 0 ||
          sector.code.toLowerCase().includes(normalisedSearch) ||
          sector.label.toLowerCase().includes(normalisedSearch) ||
          sector.name.toLowerCase().includes(normalisedSearch) ||
          (sector.includes ?? "").toLowerCase().includes(normalisedSearch);

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "current" && sector.status === "current") ||
          (statusFilter === "behind" && sector.status !== "current");

        return matchesSearch && matchesStatus;
      }),
    }))
    .filter((region) => region.sectors.length > 0);

  const hasResults = filteredRegions.length > 0;

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center overflow-hidden bg-zinc-950 px-4">
      <Image
        src="/images/south-african-a340.webp"
        alt="Hero Banner"
        className="absolute top-0 left-0 h-[50vh] w-full object-cover"
      />

      <div className="absolute inset-0 h-[50vh] bg-gradient-to-b from-zinc-950/30 via-zinc-950/45 to-zinc-950" />

      <section className="relative z-10 flex h-[50vh] w-full max-w-7xl flex-col items-center justify-center px-6 pt-[104px] text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-secondary">
          Controller Resources
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          Sector Files &amp; vATIS
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg">
          Every VATSSA sector file, the AIRAC cycle it is currently published
          on, and its vATIS profile. This page reads the same status data as the
          board in our Discord, so the two can never disagree.
        </p>
      </section>

      {/* ---- Current cycle ---- */}
      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-zinc-800/60 p-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400">
            Current AIRAC cycle
          </span>
          <span className="font-mono text-5xl font-semibold text-white sm:text-6xl">
            {isLoading ? "····" : (board?.current_cycle ?? "unknown")}
          </span>
          {board?.current_cycle_effective_human ? (
            <span className="text-sm text-zinc-300">
              Effective {board.current_cycle_effective_human}
            </span>
          ) : null}
          {board?.generated_at ? (
            <span className="text-xs text-zinc-500">
              Status last generated{" "}
              {new Date(board.generated_at).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "UTC",
              })}{" "}
              UTC
            </span>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile value={isLoading ? "—" : counts.total} label="Sector files" />
          <StatTile
            value={isLoading ? "—" : counts.current}
            label="On current cycle"
            accent="text-secondary"
          />
          <StatTile
            value={isLoading ? "—" : counts.behind}
            label="Behind"
            // Nothing behind is good news, so it should not glow amber.
            accent={counts.behind > 0 ? "text-amber-400" : "text-zinc-300"}
          />
          <StatTile
            value={isLoading ? "—" : counts.vatis}
            label="vATIS profiles"
            accent="text-primary"
          />
        </div>
      </section>

      {/* ---- The board ---- */}
      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
        <Header text="Downloads" />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-400">
            {(
              ["current", "one_behind", "two_behind", "older"] as SectorStatus[]
            ).map((status) => (
              <span key={status} className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${statusStyles[status].dot}`}
                  aria-hidden="true"
                />
                {board?.legend?.[status] ?? statusStyles[status].label}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex rounded-xl bg-zinc-900 p-1">
              {(
                [
                  { value: "all", label: "All" },
                  { value: "current", label: "Current" },
                  { value: "behind", label: "Behind" },
                ] as { value: StatusFilter; label: string }[]
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatusFilter(option.value)}
                  className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                    statusFilter === option.value
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search
                className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-500"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search sector or FIR"
                className="h-11 w-full rounded-xl bg-zinc-900 pr-4 pl-11 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:bg-zinc-800"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-sm text-zinc-400">
            Loading sector status...
          </p>
        ) : null}

        {!isLoading && error ? (
          <p className="py-10 text-center text-sm text-red-300">
            We could not load the sector status right now. The files are always
            available on{" "}
            <a
              href="https://files.aero-nav.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              files.aero-nav.com
            </a>
            .
          </p>
        ) : null}

        {!isLoading && !error
          ? filteredRegions.map((region) => (
              <div key={region.region} className="flex w-full flex-col gap-3">
                <h2 className="mt-4 text-lg font-semibold tracking-tight text-white">
                  {region.region}
                </h2>
                <div className="overflow-hidden rounded-2xl bg-zinc-900/70">
                  {region.sectors.map((sector) => (
                    <SectorRow key={sector.repo} sector={sector} />
                  ))}
                </div>
              </div>
            ))
          : null}

        {!isLoading && !error && !hasResults ? (
          <p className="py-10 text-center text-sm text-zinc-400">
            No sector matches that search or filter.
          </p>
        ) : null}
      </section>

      {/* ---- vATIS setup ---- */}
      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
        <Header text="Setting Up vATIS" />

        <p className="max-w-4xl text-base leading-7 text-zinc-200">
          Download the profile for the FIR you are controlling from the list
          above — one file per FIR. Then follow the four steps below. Sectors
          marked <span className="text-zinc-400">No vATIS</span> have no ATIS to
          publish, which is why oceanic and FSS packages carry no profile.
        </p>

        <div className="grid gap-4 lg:grid-cols-2">
          <SetupStep number={1} title="Replace your airports file">
            Some VATSSA airports are missing from the default vATIS install.
            Right-click{" "}
            <a
              href={AIRPORTS_JSON_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              airports.json
            </a>{" "}
            and save it, then replace the file of the same name in your vATIS
            folder:{" "}
            <code className="rounded bg-zinc-950 px-1.5 py-0.5 font-mono text-xs text-zinc-200">
              C:\Users\&lt;you&gt;\AppData\Local\vATIS-4.0\
            </code>
          </SetupStep>

          <SetupStep number={2} title="Import the profile">
            Open vATIS, click <strong className="text-white">IMPORT</strong> and
            select the profile you downloaded for your FIR.
          </SetupStep>

          <SetupStep number={3} title="Pick your configuration">
            In the dropdown at the bottom of the vATIS window, choose the airport
            configuration you need, set your initial ATIS letter, click{" "}
            <strong className="text-white">CONNECT</strong>, then{" "}
            <strong className="text-white">TX ATIS</strong>. Repeat for each
            airport you are working.
          </SetupStep>

          <SetupStep number={4} title="Know the limits">
            Only connect an ATIS for an airport{" "}
            <strong className="text-white">under your control</strong>, to a
            maximum of four airports. Transition levels are included
            automatically — do not add them to your information.
          </SetupStep>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl bg-zinc-800/60 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Radio className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm leading-6 text-zinc-300">
              New to vATIS? The official user guide walks through installation
              and every field in the profile.
            </p>
          </div>
          <Button
            variant="outline"
            href={VATIS_GUIDE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            vATIS User Guide <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* ---- Contribute / report ---- */}
      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 px-6 py-10 pb-20">
        <Header text="Found A Problem?" />

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-4 rounded-3xl bg-zinc-800 p-8">
            <h3 className="text-xl font-semibold text-white">
              Report it, or fix it
            </h3>
            <p className="text-sm leading-6 text-zinc-300">
              Every sector file lives on the VATSIM SSA GitHub organisation.
              Anyone with a GitHub account can open an issue to report a problem
              with a sector or a vATIS profile, or send a pull request to fix
              one. VATSSA welcomes contributions to the operations department
              from any member.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="filled"
                href={ORG_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                VATSIM SSA on GitHub <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                href={FEEDBACK_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Send feedback <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 rounded-3xl bg-zinc-800 p-8">
            <h3 className="text-xl font-semibold text-white">
              How a cycle gets published
            </h3>
            <p className="text-sm leading-6 text-zinc-300">
              Each AIRAC cycle opens a deployment tracker in{" "}
              <code className="rounded bg-zinc-950 px-1.5 py-0.5 font-mono text-xs text-zinc-200">
                sectorfile-overview
              </code>
              . A sector is only marked off once its package is built, its pull
              requests are reviewed, the GitHub release is tagged and the install
              package is published on GNG. The cycle you see against each sector
              above comes straight from that tracker.
            </p>
            <Button
              variant="outline"
              href={TRACKER_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View the trackers <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
