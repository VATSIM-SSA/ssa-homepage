"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, ExternalLink, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Image } from "../ui/image";
import { Dropdown, DropdownItem, DropdownSeperator } from "../ui/dropdown";

// The mobile menu mirrors the desktop dropdowns, but collapsed: laid out flat it
// ran past the bottom of a phone screen and had to be scrolled to reach the last
// section. Kept as data rather than markup so the two menus cannot drift apart
// item by item.
type MobileLink = {
  label: string;
  route?: string;
  href?: string;
};

type MobileSection = {
  title: string;
  links: MobileLink[];
};

const mobileSections: MobileSection[] = [
  {
    title: "About Us",
    links: [
      { label: "About VATSSA", route: "/about" },
      { label: "Staff Team", route: "/about/staff-team" },
      { label: "Donate", route: "/donate" },
      { label: "Our Policies", href: "https://vatssa.com/about/policies" },
      { label: "Meeting Minutes", route: "/about/meeting-minutes" },
      { label: "Transfer/Visit", route: "/join" },
    ],
  },
  {
    title: "Pilots",
    links: [
      {
        label: "Resources",
        href: "https://docs.vatssa.com/Pilot%27s%20Corner/",
      },
      {
        label: "Pilot Briefings",
        href: "https://docs.vatssa.com/Pilot%27s%20Corner",
      },
      { label: "Partner rVAs", route: "/about/partner-rvas" },
      { label: "Pilot Bookings", href: "https://bookings.vatssa.com/" },
    ],
  },
  {
    title: "Controllers",
    links: [
      { label: "Control Centre", href: "https://cc.vatssa.com/" },
      { label: "Sector Files & vATIS", route: "/controllers/sector-files" },
      {
        label: "Resources",
        href: "https://docs.vatssa.com/General/Resources/Links/",
      },
      { label: "Docs Site", href: "https://docs.vatssa.com/" },
      { label: "Active Roster", href: "https://cc.vatssa.com/" },
      {
        label: "Volunteer as Mentor",
        href: "https://docs.google.com/forms/d/e/1FAIpQLSfgShseBkNtRv-5nk-RnmgfJhDk0c_9JlI2N8todfkEdEBM5Q/viewform",
      },
      { label: "Training Registration", href: "https://cc.vatssa.com/" },
    ],
  },
  {
    title: "Our Services",
    links: [
      { label: "Forum", href: "https://forum.vatssa.com/" },
      { label: "Training Platform", href: "https://training.vatssa.com/" },
      { label: "Control Centre", href: "https://cc.vatssa.com/" },
      { label: "Pilot Bookings", href: "https://bookings.vatssa.com/" },
      { label: "Docs", href: "https://docs.vatssa.com/" },
      { label: "GitHub", href: "https://github.com/VATSIM-SSA" },
      { label: "Discord", href: "https://community.vatsim.net/" },
    ],
  },
];

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  // One section open at a time, so the menu stays short whichever one you pick.
  const [openSection, setOpenSection] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showMobileMenu]);

  // Collapse everything when the drawer closes, so reopening it always starts
  // from the short list rather than whatever was last expanded.
  function closeMobileMenu() {
    setShowMobileMenu(false);
    setOpenSection(null);
  }

  function followMobileLink(link: MobileLink) {
    closeMobileMenu();

    if (link.route) {
      router.push(link.route);
      return;
    }

    if (link.href) {
      window.open(link.href, "_blank");
    }
  }

  return (
    <>
      <nav className="text-zinc-300 absolute top-0 left-0 z-50 flex w-full items-center justify-center bg-zinc-800 px-6 shadow-2xl">
        <div className="flex h-full w-full max-w-7xl items-center justify-between px-6 py-2">
          <div className="shrink-0">
            <Image
              src="/assets/logo.png"
              alt="VATSSA Logo"
              className="py-2 h-18 w-auto max-w-none cursor-pointer md:h-20 xl:h-22"
              onClick={() => router.push("/")}
            />
          </div>

          <div className="hidden w-full items-center justify-end lg:flex gap-2 ">
            <Dropdown text="About Us" chevron={true} variant="ghost">
              <DropdownItem onClick={() => router.push("/about")}>
                About VATSSA
              </DropdownItem>
              <DropdownItem onClick={() => router.push("/about/staff-team")}>
                Staff Team
              </DropdownItem>
              <DropdownItem onClick={() => router.push("/donate")}>
                Donate
              </DropdownItem>
              <DropdownSeperator />
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  (window.location.href = "https://vatssa.com/about/policies")
                }
              >
                Our Policies
              </DropdownItem>
              <DropdownItem
                onClick={() => router.push("/about/meeting-minutes")}
              >
                Meeting Minutes
              </DropdownItem>
              <DropdownSeperator />
              <DropdownItem onClick={() => router.push("/join")}>
                Transfer/Visit
              </DropdownItem>
            </Dropdown>

            <Dropdown text="Pilots" chevron={true} variant="ghost">
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  window.open("https://docs.vatssa.com/Pilot%27s%20Corner/", "_blank")
                }
              >
                Resources <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  window.open("https://docs.vatssa.com/Pilot%27s%20Corner", "_blank")
                }
              >
                Pilot Briefings <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownItem onClick={() => router.push("/about/partner-rvas")}>
                Partner rVAs
              </DropdownItem>
              <DropdownSeperator />
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  window.open("https://bookings.vatssa.com/", "_blank")
                }
              >
                Pilot Bookings <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
            </Dropdown>

            <Dropdown text="Controllers" chevron={true} variant="ghost">
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  window.open("https://cc.vatssa.com/", "_blank")
                }
              >
                Control Centre <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownItem
                onClick={() => router.push("/controllers/sector-files")}
              >
                Sector Files &amp; vATIS
              </DropdownItem>
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  window.open("https://docs.vatssa.com/General/Resources/Links/", "_blank")
                }
              >
                Resources <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  window.open("https://docs.vatssa.com/", "_blank")
                }
              >
                Docs Site <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownSeperator />
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  window.open("https://cc.vatssa.com/", "_blank")
                }
              >
                Active Roster <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownSeperator />
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  window.open("https://docs.google.com/forms/d/e/1FAIpQLSfgShseBkNtRv-5nk-RnmgfJhDk0c_9JlI2N8todfkEdEBM5Q/viewform", "_blank")
                }
              >
                Volunteer as Mentor <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  window.open("https://cc.vatssa.com/", "_blank")
                }
              >
                Training Registration <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
            </Dropdown>

            <Dropdown text="Our Services" chevron={true} variant="ghost">
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() => window.open("https://forum.vatssa.com/", "_blank")}
              >
                Forum <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() => window.open("https://training.vatssa.com/", "_blank")}
              >
                Training Platform <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() => window.open("https://cc.vatssa.com/", "_blank")}
              >
                Control Centre <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() => window.open("https://bookings.vatssa.com/", "_blank")}
              >
                Pilot Bookings <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() => window.open("https://docs.vatssa.com/", "_blank")}
              >
                Docs <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownSeperator />
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() => window.open("https://github.com/VATSIM-SSA", "_blank")}
              >
                GitHub <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() => window.open("https://community.vatsim.net/", "_blank")}
              >
                Discord <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
            </Dropdown>

            <Button
              variant="feedback"
              className="ml-2"
              onClick={() =>
                window.open("https://cc.vatssa.com/feedback", "_blank")
              }
            >
              Feedback <ExternalLink className="h-4 w-auto" />
            </Button>
          </div>

          <div className="flex w-full items-center justify-end lg:hidden">
            <button onClick={() => setShowMobileMenu((prev) => !prev)}>
              <Menu
                size={28}
                className="cursor-pointer text-zinc-300 transition-all duration-200 hover:text-white"
              />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/30 lg:hidden"
            onClick={closeMobileMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="ml-auto flex h-[100dvh] w-full max-w-[85vw] flex-col overflow-x-hidden bg-zinc-800 px-4 py-6 shadow-2xl sm:max-w-sm"
              onClick={(event) => event.stopPropagation()}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="scrollbar flex w-full min-w-0 min-h-0 flex-1 flex-col items-stretch gap-1 overflow-x-hidden overflow-y-auto text-sm">
                {mobileSections.map((section) => {
                  const isOpen = openSection === section.title;

                  return (
                    <div
                      key={section.title}
                      // min-w-0 or the widest nowrap link below sets the row's
                      // min-content width, the row grows past the drawer, and the
                      // chevron ends up outside it.
                      className="w-full min-w-0 border-b border-zinc-700 last:border-b-0"
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() =>
                          setOpenSection(isOpen ? null : section.title)
                        }
                        // Grid rather than justify-between: the label takes the
                        // free column and the chevron its own, so the chevron
                        // cannot be pushed out by a long label.
                        className="grid w-full min-w-0 cursor-pointer grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-4 py-3 text-left font-bold text-white transition-colors duration-200 hover:bg-zinc-700"
                      >
                        <span className="truncate">{section.title}</span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-primary transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="flex w-full min-w-0 flex-col items-stretch pb-2">
                          {section.links.map((link) => (
                            <Button
                              key={`${section.title}-${link.label}`}
                              variant="menu"
                              className="flex w-full min-w-0 items-center gap-2 pl-6"
                              onClick={() => followMobileLink(link)}
                            >
                              <span className="truncate">{link.label}</span>
                              {link.href ? (
                                <ExternalLink className="h-4 w-auto shrink-0" />
                              ) : null}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* A single item, so it stays a plain link rather than a
                    one-entry accordion. */}
                <Button
                  variant="menu"
                  className="mt-4 flex items-center gap-2 font-bold"
                  onClick={() =>
                    followMobileLink({
                      label: "Feedback",
                      href: "https://cc.vatssa.com/feedback",
                    })
                  }
                >
                  Feedback <ExternalLink className="h-4 w-auto" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
