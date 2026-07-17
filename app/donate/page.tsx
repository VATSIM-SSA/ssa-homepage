import { Heart, ExternalLink } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function Donate() {
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
          Donate
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg">
          Your contributions help us continue our mission and support our
          dedicated team.
        </p>
      </section>

      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 items-center justify-center px-6 mx-12 py-16 text-center">
        <div className="bg-zinc-800/50 w-full flex flex-col gap-8 items-center p-10 rounded-xl">
          <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-10 lg:gap-20">
            <div className="flex flex-col gap-4">
              <h1 className="text-left text-2xl md:text-4xl text-white font-bold">
                Our Promise
              </h1>
              <ul className="text-sm list-disc space-y-4 pl-5 text-left text-white marker:text-white">
                <li>
                  We are committed to using your donations responsibly towards
                  funding our servers, and other operational costs.
                </li>
                <li>
                  VATSIM Sub-Sahara Africa is run by volunteers and is not a
                  registered non-profit. Every donation goes towards improving
                  the division for our members.
                </li>
                <li>
                  We will not disclose who has donated, or how much. Donations
                  run through Open Collective, whose public ledger shows only
                  what your own settings choose to reveal.
                </li>
                <li>
                  We will provide no special treatment to those who have
                  donated, and all members will be treated equally regardless of
                  their contributions.
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="text-left text-2xl md:text-4xl text-white font-bold">
                Your Promise
              </h1>
              <ul className="text-sm list-disc space-y-4 pl-5 text-left text-white marker:text-white">
                <li>
                  By donating, you confirm that your contribution is purely a
                  donation, and that it grants you no special treatment or
                  greater say in how the division is run.
                </li>
                <li>
                  You agree never to use the fact of your donation as an attempt
                  to influence or intimidate staff members of the division.
                </li>
                <li>
                  You will not use your donation to elevate your status or gain
                  any advantages within the division.
                </li>
                <li>
                  Once you have donated, you agree that the money has been
                  surrendered and that you cannot request your money back at any
                  time.
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full h-px bg-zinc-700/50" />
          <div className="flex flex-col gap-8 items-center">
            <a
              href="https://vats.im/ssa/opencollective"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Donate via Open Collective"
              className="group flex h-60 w-60 sm:h-72 sm:w-72 flex-col items-center justify-center gap-2 rounded-full bg-primary text-center text-zinc-950 shadow-2xl shadow-primary/30 ring-4 ring-primary/20 transition-all duration-200 hover:scale-105 hover:bg-primary/85 hover:shadow-primary/50 hover:ring-primary/40"
            >
              <Heart
                className="h-10 w-10 transition-transform duration-200 group-hover:scale-110"
                strokeWidth={2.5}
              />
              <span className="text-3xl font-extrabold tracking-tight">
                Donate
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold opacity-80">
                via Open Collective <ExternalLink className="h-4 w-4" />
              </span>
            </a>

            <p className="text-zinc-400 text-center text-sm">
              Read our full{" "}
              <a
                href="https://vats.im/ssa/donations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                Donations Policy
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
