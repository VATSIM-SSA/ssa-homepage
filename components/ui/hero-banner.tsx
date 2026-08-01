"use client";

import { useState } from "react";
import { useHero } from "@/components/ui/hero-context";
import { FALLBACK_HERO } from "@/lib/hero";

type HeroBannerProps = {
  // Every page bands the hero differently — half-height on the interior pages,
  // 60vh on /join, full height on the landing page — so the height stays a prop
  // rather than being flattened to one value in here.
  heightClass?: string;
  // The landing page pairs an `h-dvh` image with an `h-screen` overlay. Kept
  // separate so lifting these blocks into one component changes no page's
  // rendering, on mobile least of all, where dvh and vh genuinely differ.
  overlayHeightClass?: string;
};

/**
 * The hero image every page shares, with its credit.
 *
 * The photo is the current screenshot-competition winner, resolved server-side
 * in the root layout, so it is correct in the first HTML the browser sees —
 * no swap after hydration. Crowning a new winner changes every page at once
 * with no redeploy.
 */
export function HeroBanner({
  heightClass = "h-[50vh]",
  overlayHeightClass,
}: HeroBannerProps) {
  const resolved = useHero();
  // The JSON can name a file that is missing from the bucket, which would leave
  // a broken hero. Fall back to the shipped image, credit included.
  const [isBroken, setIsBroken] = useState(false);
  const hero = isBroken ? FALLBACK_HERO : resolved;

  const overlayHeight = overlayHeightClass ?? heightClass;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={hero.src}
        alt={hero.alt}
        className={`absolute top-0 left-0 ${heightClass} w-full object-cover`}
        onError={() => setIsBroken(true)}
      />

      <div
        className={`absolute ${overlayHeight} inset-0 bg-gradient-to-b from-zinc-950/30 via-zinc-950/45 to-zinc-950`}
      >
        <p className="absolute bottom-3 right-3 text-sm text-zinc-700">
          Image Credit: {hero.credit}
        </p>
      </div>
    </>
  );
}

export default HeroBanner;
