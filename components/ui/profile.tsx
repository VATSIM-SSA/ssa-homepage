"use client";

import { Mail } from "lucide-react";
import { Image } from "@/components/ui/image";

function getInitials(name: string) {
  if (name === "Vacant") {
    return "?";
  }
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export type ProfileProps = {
  cid?: string | number;
  name: string;
  role: string;
  contact?: string;
  avatar: string;
  className?: string;
};

export function Profile({
  cid,
  name,
  role,
  contact,
  avatar,
  className = "",
}: ProfileProps) {
  const initials = getInitials(name);

  return (
    <div
      className={`bg-zinc-900 flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-white ${className}`.trim()}
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={avatar}
          alt={name}
          className="h-full w-full object-cover rounded-xl"
          fallbackClassName="text-xl font-semibold tracking-wide text-white"
          fallbackContent={initials}
        />
      </div>

      <div className="h-full flex min-w-0 flex-1 flex-col items-start justify-center">
        {cid ? (
          <p className="text-[12px] sm:text-xs font-medium uppercase text-primary">
            {cid}
          </p>
        ) : <p className="text-[12px] sm:text-xs font-medium uppercase text-primary">
            Error Fetching
          </p>}
        <h2 className="truncate text-lg sm:text-xl font-semibold leading-tight text-white">
          {name}
        </h2>
        <p className="truncate text-xs sm:text-sm font-medium text-primary-light">{role}</p>

        {contact ? (
          <a
            href={`mailto:${contact}`}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors duration-200 hover:text-white"
            aria-label={`Contact ${name}`}
          >
            <Mail size={14} />
            <span>Contact</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default Profile;
