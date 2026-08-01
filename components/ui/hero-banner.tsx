"use client";

import { useState } from "react";
import { useScreenshotWinner } from "@/hooks/useScreenshotWinner";

// Shown until the screenshot-competition winner loads, and again if that JSON
// or the image behind it is unreachable. The credit travels with the file: a
// hero must never be captioned with someone else's name.
const FALLBACK = {
  src: "/images/south-african-a340.webp",
  alt: "South African Airways A340",
  credit: "Nafan - 1708206",
};

type HeroBannerProps = {
  // Every page banded the hero differently — half-height on the interior pages,
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
 * The photo is the current screenshot-competition winner from the MinIO
 * `homepage-data` bucket, so crowning a new winner changes every page at once
 * with no redeploy.
 */
export function HeroBanner({
  heightClass = "h-[50vh]",
  overlayHeightClass,
}: HeroBannerProps) {
  const { winner } = useScreenshotWinner();
  // The JSON can name a file that is missing from the bucket, which would leave
  // a broken hero. Fall back to the shipped image, credit included.
  const [isBroken, setIsBroken] = useState(false);

  const hero =
    winner && !isBroken
      ? {
          src: winner.link,
          alt: `VATSSA screenshot competition winner by ${winner.name}`,
          credit: winner.name,
        }
      : FALLBACK;

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
