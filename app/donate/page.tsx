import { Profile } from "@/components/ui/profile";
import { Header } from "@/components/ui/header";
import { Image } from "@/components/ui/image";
import staff from "@/assets/staff.json";

type StaffMember = {
  id: string;
  name: string;
  role: string;
  email?: string;
  cid?: string;
};

type StaffGroups = Record<string, StaffMember[]>;

export default function Donate() {
  const staffGroups = Object.entries(staff as StaffGroups);

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
        <div className="bg-zinc-800/50 w-full flex flex-col gap-10 items-center p-10 rounded-xl">
          <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-10 lg:gap-20">
            <div className="flex flex-col gap-4">
              <h1 className="text-left text-2xl md:text-4xl text-white font-bold">
                Our Promise
              </h1>
              <ul className="text-sm list-disc space-y-2 md:space-y-4 pl-5 text-left text-white marker:text-white">
                <li>
                  We are committed to using your donations responsibly towards
                  funding our servers, and other operational costs.
                </li>
                <li>
                  VATSIM Sub-Sahara Africa is a non-profit organisation, and all
                  donations go directly towards improving the final product for
                  our members.
                </li>
                <li>
                  Personnal information of those who have donated will not be
                  disclosed, nor the sum of their donations.
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
                  By donating, you commit that your financial contribution is
                  purely a donation and that said donation does not grant you
                  any special treatment or higher say in how the division is
                  run. You agree to never use the fact of your donation as an
                  attempt to influence or intimidate staff members of the
                  division.
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
                <li>You confirm that you are over the age of 18.</li>
              </ul>
            </div>
          </div>
          <div className="w-full h-px bg-zinc-700/50" />
          <div className="flex flex-col gap-2 items-center">
          <p className="text-white text-center md:text-left">
            To donate, please visit our
            <a
              href="https://opencollective.com/vatssa-division"
              className="text-blue-500 underline"
            >
              {" "}
              Open Collective
            </a>{" "}
            page.
          </p>

          <p className="text-zinc-400 text-center md:text-left">
            To read the full policy, {" "}
            <a
              href="https://opencollective.com/vatssa-division"
              className="text-blue-500 underline"
            >
              click here
            </a>
            .
          </p></div>
        </div>
      </section>
    </div>
  );
}
