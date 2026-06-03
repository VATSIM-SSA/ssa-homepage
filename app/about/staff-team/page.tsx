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

export default function Staff() {
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
          Our Staff Team
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg">
          Get to know the dedicated individuals who keep the division running.
        </p>
      </section>

      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 items-center justify-center px-6 mx-12 py-16 text-center">
        {staffGroups.map(([groupName, members]) => (
          <div key={groupName} className="contents">
            <Header text={groupName} className="mt-4" />

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
              {members.map((member) => (
                <Profile
                  key={member.id}
                  cid={member.cid}
                  name={member.name}
                  role={member.role}
                  contact={member.email}
                  avatar={`/staff/${member.id}.png`}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
