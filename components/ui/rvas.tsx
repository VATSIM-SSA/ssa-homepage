"use client";

import { Image } from "@/components/ui/image";

const rvaImageOverrides: Record<string, string> = {
  "flysafair virtual": "flysafari-virtual",
};

function getRvaImageSrc(name: string) {
  const normalizedName = name.trim().toLowerCase();
  const imageName =
    rvaImageOverrides[normalizedName] ??
    normalizedName.replace(/\s+/g, "-");

  return `/rvas/${imageName}.png`;
}

export function RVAS({ name, link }: { name: string; link: string }) {
  return (
    <div
      onClick={() => window.open(link, "_blank")}
      className="hover:scale-101 transition-all duration-200 cursor-pointer px-4 relative flex rounded-lg w-full items-center justify-center overflow-hidden bg-zinc-800"
    >
      <Image
        className=""
        src={getRvaImageSrc(name)}
        alt={name}
      />
    </div>
  );
}
