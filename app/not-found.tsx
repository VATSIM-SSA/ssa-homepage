"use client";

import { MoveRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Image
        src="/images/not-found.png"
        alt="Not Found"
        className="absolute top-0 left-0 w-full h-full inset-0 object-cover"
      />

      <div className="absolute h-screen inset-0 bg-gradient-to-b from-zinc-950/30 via-zinc-950/45 to-zinc-950">
        <p className="z-11 absolute bottom-3 right-3 text-zinc-700 text-sm">
          Image Credit: Bennet - 1808791
        </p>
      </div>

      <div className="z-10 backdrop-blur-sm w-full h-screen flex items-center justify-center">
        <div className="w-full max-w-7xl px-6 py-12 flex flex-col items-center justify-center gap-4">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <p className="text-xl font-bold text-primary">Page Not Found</p>
          <p className="text-zinc-400 mx-12 text-center">
            Looks like we can&apos;t find the page you&apos;re looking for. It
            may have been moved, deleted, or the URL may be incorrect.
          </p>
          <Button variant="filled" onClick={() => window.history.back()}>
            Back to Safety <MoveRight size={24} />
          </Button>
        </div>
      </div>
    </>
  );
}
