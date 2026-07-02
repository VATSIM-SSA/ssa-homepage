"use client";

import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { ExternalLink } from "lucide-react";
import PolicyList from "@/public/assets/data/policies-config.json";

export default function Policies() {
  const policies = PolicyList.policies;

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
          Our Policies
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg">
          View all major policies that govern our operations, including our
          privacy policy, code of conduct, and more.
        </p>
      </section>

      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 items-center justify-center px-6 mx-12 py-16 text-center">
        <div className="grid grid-cols-1 w-full gap-4">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className="bg-zinc-800 rounded-xl p-6 flex items-center justify-between"
            >
              <div className="flex flex-col items-start justify-center">
                <h2 className="text-2xl font-semibold text-white">
                  {policy.title}
                </h2>
                <p className="mt-2 text-zinc-300">{policy.description}</p>{" "}
              </div>
              <Button
                variant="filled"
                onClick={() => window.open(policy.url, "_blank")}
                className="mt-4 flex items-center gap-2"
              >
                View Policy <ExternalLink className="h-4 w-auto" />
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
