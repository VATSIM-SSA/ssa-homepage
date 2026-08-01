"use client";

import { createContext, useContext } from "react";
import { FALLBACK_HERO, type Hero } from "@/lib/hero";

// The hero is resolved once per request in the root layout and handed down.
// Context rather than props because most pages are client components several
// levels below the layout, and threading one object through all of them would
// mean touching every page again the next time it changes.
const HeroContext = createContext<Hero>(FALLBACK_HERO);

export function HeroProvider({
  hero,
  children,
}: {
  hero: Hero;
  children: React.ReactNode;
}) {
  return <HeroContext.Provider value={hero}>{children}</HeroContext.Provider>;
}

export function useHero(): Hero {
  return useContext(HeroContext);
}
