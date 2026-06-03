"use client";

import { Header } from "@/components/ui/header";
import { Image } from "@/components/ui/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRvas } from "@/hooks/useRvas";

const rvaImageOverrides: Record<string, string> = {
  "flysafair virtual": "flysafari-virtual",
};

function getRvaImageSrc(name: string) {
  const normalizedName = name.trim().toLowerCase();
  const imageName =
    rvaImageOverrides[normalizedName] ?? normalizedName.replace(/\s+/g, "-");

  return `/rvas/${imageName}.png`;
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

      <section className="pt-[104px] h-[50vh] relative z-10 flex w-full max-w-7xl flex-col items-center justify-center px-6 mx-12 text-center">
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          Regional Virtual Airlines
        </h1>
      </section>

      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 items-center justify-center px-6 mx-12 py-16 text-center">
        <p className="mt-6 max-w-7xl text-base leading-7 text-zinc-200 sm:text-lg">
          VATSSA has a partner program to support and collaborate with Regional
          Virtual Airlines (rVAs) operating within its jurisdiction. This
          program is further outlined in the rVA policy available{" "}
          <a
            href="https://vatssa.com/hq/docs/pdf/ssa_policy_regionalvirtualairline_v1-0_20250201.pdf"
            className="underline text-blue-500"
          >
            here
          </a>
          .
          <br />
          <br />
          The VATSSA partnership program aims to assist rVAs by enhancing their
          visibility and establishing event-related partnerships as well as
          other benefits for them. It is designed to foster rVA growth and guide
          them toward becoming VATSIM-partnered rVAs. Of course, it also provide
          a big benefit to pilot's looking to fly for a virtual airline in the
          African skies!
          <br />
          <br />
          Below is a list of all the rVA's currently partnered with VATSSA. If
          you are a virtual pilot, you are welcome to join any of these Regional
          Virtual Airlines. The're operating within Africa, and frequently
          co-host events with VATSSA.
        </p>

        <Header text="Tier 1" />

        <div className="flex flex-col w-full gap-6 mb-8">
          {isLoading && <p className="text-zinc-300">Loading rVAs...</p>}
          {!isLoading && error && <p className="text-red-300">Hmm. We encountered an unexpected error. If this keeps happening, please contact a website administrator.</p>}

          {!isLoading &&
            !error &&
            rvas
            .filter((rva) => rva.tier === 1)
            .map((rva) => (
              <Card
                onClick={() => window.open(rva.site, "_blank")}
                className="cursor-pointer transition-all duration-200"
                snap="left"
                media={
                  <Image
                    src={getRvaImageSrc(rva.name)}
                    alt={`${rva.name} banner`}
                    className="w-full aspect-video object-contain"
                    fallbackContent="Event image unavailable"
                  />
                }
                mediaClassName="aspect-video w-full p-4"
              >
                <CardContent className="flex flex-col">
                  <CardHeader>{rva.name}</CardHeader>
                  <p className="text-zinc-400 text-base">{rva.description}</p>
                  {rva.signup && (
                    <p
                      className="text-white text-sm hover:underline cursor-pointer"
                      onClick={() => window.open(rva.signup, "_blank")}
                    >
                      Sign Up →
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}

          {!isLoading &&
            !error &&
            rvas.filter((rva) => rva.tier === 1).length === 0 && (
              <p className="text-zinc-400">No Tier 1 rVAs found.</p>
            )}
        </div>

        <Header text="Tier 2" />

        <div className="flex flex-col w-full gap-6 mb-8">
          {isLoading && <p className="text-zinc-300">Loading rVAs...</p>}
          {!isLoading && error && <p className="text-red-300">Hmm. We encountered an unexpected error. If this keeps happening, please contact a website administrator.</p>}

          {!isLoading &&
            !error &&
            rvas
            .filter((rva) => rva.tier === 2)
            .map((rva) => (
              <Card
                onClick={() => window.open(rva.site, "_blank")}
                className="cursor-pointer transition-all duration-200"
                snap="left"
                media={
                  <Image
                    src={getRvaImageSrc(rva.name)}
                    alt={`${rva.name} banner`}
                    className="w-full aspect-video object-contain"
                    fallbackContent="Event image unavailable"
                  />
                }
                mediaClassName="aspect-video w-full p-4"
              >
                <CardContent className="flex flex-col">
                  <CardHeader>{rva.name}</CardHeader>
                  <p className="text-zinc-400 text-base">{rva.description}</p>
                  {rva.signup && (
                    <p
                      className="text-white text-sm hover:underline cursor-pointer"
                      onClick={() => window.open(rva.signup, "_blank")}
                    >
                      Sign Up →
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}

          {!isLoading &&
            !error &&
            rvas.filter((rva) => rva.tier === 2).length === 0 && (
              <p className="text-zinc-400">No Tier 2 rVAs found.</p>
            )}
        </div>
      </section>
    </div>
  );
}
