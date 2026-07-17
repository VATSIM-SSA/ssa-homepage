"use client";

import { Header } from "@/components/ui/header";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRvas, type Rva } from "@/hooks/useRvas";

const rvaImageOverrides: Record<string, string> = {
  "flysafair virtual": "flysafari-virtual",
};

function getRvaImageSrc(name: string) {
  const normalizedName = name.trim().toLowerCase();
  const imageName =
    rvaImageOverrides[normalizedName] ?? normalizedName.replace(/\s+/g, "-");

  return `/rvas/${imageName}.png`;
}

function RvaCard({ rva }: { rva: Rva }) {
  return (
    <Card
      onClick={() => window.open(rva.site, "_blank")}
      className="cursor-pointer transition-all duration-200"
      snap="left"
      media={
        <Image
          src={getRvaImageSrc(rva.name)}
          alt={`${rva.name} logo`}
          className="w-full aspect-video object-contain"
          fallbackContent="Logo unavailable"
        />
      }
      mediaClassName="aspect-video w-full p-4"
    >
      <CardContent align="center">
        <div className="flex w-full flex-col items-start gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-2">
            <CardHeader>{rva.name}</CardHeader>
            <p className="text-zinc-300 text-base leading-7">
              {rva.description}
            </p>
          </div>

          {rva.signup && (
            <Button
              variant="filled"
              href={rva.signup}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="w-full shrink-0 px-8 py-4 text-lg xl:w-auto"
            >
              Sign Up
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RvaTier({
  title,
  rvas,
  isLoading,
  error,
}: {
  title: string;
  rvas: Rva[];
  isLoading: boolean;
  error: string | null;
}) {
  return (
    <>
      <Header text={title} />

      <div className="flex flex-col w-full gap-6 mb-8">
        {isLoading && <p className="text-zinc-300">Loading rVAs...</p>}

        {!isLoading && error && (
          <p className="text-red-300">
            Hmm. We encountered an unexpected error. If this keeps happening,
            please contact a website administrator.
          </p>
        )}

        {!isLoading && !error && rvas.length === 0 && (
          <p className="text-zinc-400">No {title} rVAs found.</p>
        )}

        {!isLoading &&
          !error &&
          rvas.map((rva) => <RvaCard key={rva.name} rva={rva} />)}
      </div>
    </>
  );
}

export default function PilotRVAS() {
  const { rvas, isLoading, error } = useRvas();

  return (
    <div className="px-4 relative flex flex-col min-h-dvh w-full items-center justify-center overflow-hidden bg-zinc-950">
      <Image
        src="/images/south-african-a340.png"
        alt="Hero Banner"
        className="absolute top-0 left-0 h-[50vh] w-full object-cover"
      />

      <div className="absolute h-[50vh] inset-0 bg-gradient-to-b from-zinc-950/30 via-zinc-950/45 to-zinc-950" />

      <section className="pt-[104px] h-[50vh] relative z-10 flex w-full max-w-7xl flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          Regional Virtual Airlines
        </h1>
      </section>

      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 items-center justify-center px-6 py-16 text-center">
        <div className="flex max-w-4xl flex-col gap-4 text-base leading-7 text-zinc-200 sm:text-lg">
          <p>
            VATSSA has a partner program to support and collaborate with
            Regional Virtual Airlines (rVAs) operating within its jurisdiction.
            This program is further outlined in the rVA policy available{" "}
            <a
              href="https://files.vatssa.com/policy/regional_virtual_airline_v1.1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary hover:text-primary/80"
            >
              here
            </a>
            .
          </p>
          <p>
            The VATSSA partnership program aims to assist rVAs by enhancing
            their visibility and establishing event-related partnerships as well
            as other benefits for them. It is designed to foster rVA growth and
            guide them toward becoming VATSIM-partnered rVAs. Of course, it also
            provides a big benefit to pilots looking to fly for a virtual
            airline in the African skies.
          </p>
          <p>
            Below is a list of all the rVAs currently partnered with VATSSA. If
            you are a virtual pilot, you are welcome to join any of these
            Regional Virtual Airlines. They operate within Africa, and
            frequently co-host events with VATSSA.
          </p>
        </div>

        <RvaTier
          title="Tier 1"
          rvas={rvas.filter((rva) => rva.tier === 1)}
          isLoading={isLoading}
          error={error}
        />

        <RvaTier
          title="Tier 2"
          rvas={rvas.filter((rva) => rva.tier === 2)}
          isLoading={isLoading}
          error={error}
        />
      </section>
    </div>
  );
}
