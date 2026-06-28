"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { LiveMap } from "@/components/map/live-map";

export default function Home() {
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
          <div className="h-full xl:flex justify-center items-center hidden xl:w-1/2">
            <img
              src="/images/ssa-airspace.png"
              alt="Map of VATSSA airspace across Sub-Saharan Africa"
              className="aspect-square rounded-xl object-contain"
            />
          </div>
        </div>
      </section>

      <LiveMap />
    </div>
  );
}
