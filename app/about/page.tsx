import type { Metadata } from "next";
import { GraduationCap, PartyPopper, Plane, TowerControl } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About | VATSSA",
  description:
    "VATSSA is the VATSIM Sub-Saharan Africa Division, part of VATEMEA. Learn who we are, what we do, and why the region's virtual skies matter.",
};

const pillars = [
  {
    icon: TowerControl,
    title: "Air Traffic Control",
    description:
      "From tower to oceanic control, our ATC team trains and certifies controllers to bring Sub-Saharan Africa's skies to life with realism and professionalism.",
  },
  {
    icon: Plane,
    title: "Flight Simulation",
    description:
      "Pilots from across the globe file into our airspace daily, flying into the airports and across the routes that define this region.",
  },
  {
    icon: PartyPopper,
    title: "Community Events",
    description:
      "Our flagship event, Cross Africa, unites pilots and controllers across the continent in a single, sprawling celebration of African aviation, a tradition that continues to grow every year.",
  },
  {
    icon: GraduationCap,
    title: "Training & Growth",
    description:
      "Through structured ATC training programs and a dedicated support team, we help our members go from first login to first clearance to fully rated controller.",
  },
];

export default function About() {
  return (
    <div className="px-4 relative flex flex-col min-h-dvh w-full items-center justify-center overflow-hidden bg-zinc-950">
      <Image
        src="/images/south-african-a340.png"
        alt="Hero Banner"
        className="absolute top-0 left-0 h-[50vh] w-full object-cover"
      />

      <div className="absolute h-[50vh] inset-0 bg-gradient-to-b from-zinc-950/30 via-zinc-950/45 to-zinc-950" />

      <section className="pt-[104px] h-[50vh] relative z-10 flex w-full max-w-7xl flex-col items-center justify-center px-6 mx-12 text-center">
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          About VATSSA
        </h1>
        <p className="mt-6 max-w-2xl text-sm font-semibold uppercase tracking-[0.3em] text-secondary sm:text-base">
          Connecting the Skies of Sub-Saharan Africa
        </p>
      </section>

      <section className="relative z-10 flex w-full max-w-3xl flex-col gap-4 items-center justify-center px-6 mx-12 pt-6 pb-16 text-center">
        <p className="text-zinc-200 leading-7">
          From the bustling approach into OR Tambo to the long oceanic
          stretches off the West African coast, VATSSA brings the airspace of
          Sub-Saharan Africa to life.
        </p>
        <p className="text-zinc-200 leading-7">
          We are the VATSIM Sub-Saharan Africa Division, part of the VATEMEA
          region within the global VATSIM network. We exist to give pilots
          and air traffic controllers across the continent a place to
          simulate real-world aviation with passion, precision, and pride,
          building an airspace as vibrant and diverse as the continent
          itself.
        </p>
      </section>

      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 items-center justify-center px-6 mx-12 py-16 text-center">
        <Header text="Who We Are" />

        <div className="flex xl:flex-row flex-col w-full gap-12 items-center justify-center">
          <div className="w-full xl:w-1/2 text-white flex flex-col items-start justify-start gap-4">
            <p className="text-center xl:text-left">
              VATSSA is a community first. We&apos;re students and engineers,
              real-world aviation professionals and complete beginners,
              united by one thing: a love of flight. Whether you&apos;re
              flying long-haul into Lagos, working approach into Nairobi, or
              simply learning what a top-of-descent calculation is for the
              first time, there&apos;s a place for you here.
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

      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 items-center justify-center px-6 mx-12 py-16 text-center">
        <Header text="What We Do" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
          {pillars.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="h-full">
              <CardContent className="h-full gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <CardHeader>{title}</CardHeader>
                <p className="text-zinc-400 text-base">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 items-center justify-center px-6 mx-12 py-16 text-center">
        <Header text="Why It Matters" />

        <div className="bg-zinc-800/50 w-full flex flex-col gap-4 items-center p-10 rounded-xl">
          <p className="text-zinc-200 leading-7 max-w-4xl">
            Sub-Saharan Africa is one of the most diverse and dynamic regions
            in the world, and we believe its virtual skies deserve the same
            energy, ambition, and community spirit as the real ones.
          </p>
          <p className="text-lg font-semibold text-primary max-w-4xl">
            VATSSA is a home for everyone who has ever looked up at the
            African sky and wanted to be part of it.
          </p>
        </div>
      </section>

      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 items-center justify-center px-6 mx-12 py-16 text-center">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
          Join us. The African skies are open.
        </h2>
        <div className="mt-2 flex flex-row flex-wrap items-center justify-center gap-3">
          <Button variant="filled" href="https://eaip2.vatssa.com/">
            Join VATSSA
          </Button>
          <Button variant="outline" href="https://cc.vatssa.com/">
            Explore Training
          </Button>
        </div>
      </section>
    </div>
  );
}
