"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Image } from "../ui/image";
import { Dropdown, DropdownItem, DropdownSeperator } from "../ui/dropdown";

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
              <DropdownItem onClick={() => router.push("/about/staff-team")}>
                Staff Team
              </DropdownItem>
              <DropdownItem onClick={() => router.push("/donate")}>
                Donate
              </DropdownItem>
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  window.open("https://docs.vatssa.com/", "_blank")
                }
              >
                Transfer/Visit <ExternalLink className="h-4 w-auto" />
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
                Bookings <ExternalLink className="h-4 w-auto" />
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
            onClick={() => setShowMobileMenu(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="ml-auto flex h-[100dvh] w-full max-w-[70vw] flex-col bg-zinc-800 px-4 py-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex min-h-0 flex-1 flex-col items-start overflow-y-auto text-sm">
                <p className="px-4 text-zinc-400 font-bold text-sm mb-1">
                  About Us
                </p>
                <Button
                  variant="menu"
                  onClick={() => {
                    setShowMobileMenu(false);
                    router.push("/about");
                  }}
                >
                  About VATSSA
                </Button>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.location.href = "https://vatssa.com/about/policies";
                  }}
                >
                  Our Policies
                </Button>
                <Button
                  variant="menu"
                  onClick={() => {
                    setShowMobileMenu(false);
                    router.push("/about/meeting-minutes");
                  }}
                >
                  Meeting Minutes
                </Button>
                <Button
                  variant="menu"
                  onClick={() => {
                    setShowMobileMenu(false);
                    router.push("/about/staff-team");
                  }}
                >
                  Staff Team
                </Button>
                <Button
                  variant="menu"
                  onClick={() => {
                    setShowMobileMenu(false);
                    router.push("/donate");
                  }}
                >
                  Donate
                </Button>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.open("https://docs.vatssa.com/", "_blank");
                  }}
                >
                  Transfer/Visit <ExternalLink className="h-4 w-auto" />
                </Button>

                <p className="px-4 text-zinc-400 font-bold text-sm mt-6 mb-1">
                  Pilots
                </p>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.open("https://docs.vatssa.com/Pilot%27s%20Corner/", "_blank");
                  }}
                >
                  Resources <ExternalLink className="h-4 w-auto" />
                </Button>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.open("https://docs.vatssa.com/Pilot%27s%20Corner", "_blank");
                  }}
                >
                  Pilot Briefings <ExternalLink className="h-4 w-auto" />
                </Button>
                <Button
                  variant="menu"
                  onClick={() => {
                    setShowMobileMenu(false);
                    router.push("/about/partner-rvas");
                  }}
                >
                  Partner rVAs
                </Button>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.open("https://bookings.vatssa.com/", "_blank");
                  }}
                >
                  Pilot Bookings <ExternalLink className="h-4 w-auto" />
                </Button>

                <p className="px-4 text-zinc-400 font-bold text-sm mt-6 mb-1">
                  Controllers
                </p>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.open("https://cc.vatssa.com/", "_blank");
                  }}
                >
                  Control Centre <ExternalLink className="h-4 w-auto" />
                </Button>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.open("https://docs.vatssa.com/General/Resources/Links/", "_blank");
                  }}
                >
                  Resources <ExternalLink className="h-4 w-auto" />
                </Button>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.open("https://docd.vatssa.com/", "_blank");
                  }}
                >
                  Docs Site <ExternalLink className="h-4 w-auto" />
                </Button>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.open("https://cc.vatssa.com/", "_blank");
                  }}
                >
                  Active Roster <ExternalLink className="h-4 w-auto" />
                </Button>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.open("https://docs.google.com/forms/d/e/1FAIpQLSfgShseBkNtRv-5nk-RnmgfJhDk0c_9JlI2N8todfkEdEBM5Q/viewform", "_blank");
                  }}
                >
                  Volunteer as Mentor <ExternalLink className="h-4 w-auto" />
                </Button>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.open("https://cc.vatssa.com/", "_blank");
                  }}
                >
                  Training Registration <ExternalLink className="h-4 w-auto" />
                </Button>

                <p className="px-4 text-zinc-400 font-bold text-sm mt-6 mb-1">
                  Our Services
                </p>
                {[
                  { label: "Forum", href: "https://forum.vatssa.com/" },
                  { label: "Training Platform", href: "https://training.vatssa.com/" },
                  { label: "Control Centre", href: "https://cc.vatssa.com/" },
                  { label: "Bookings", href: "https://bookings.vatssa.com/" },
                  { label: "Docs", href: "https://docs.vatssa.com/" },
                  { label: "GitHub", href: "https://github.com/VATSIM-SSA" },
                  { label: "Discord", href: "https://community.vatsim.net/" },
                ].map((service) => (
                  <Button
                    key={service.href}
                    variant="menu"
                    className="flex items-center gap-2"
                    onClick={() => {
                      setShowMobileMenu(false);
                      window.open(service.href, "_blank");
                    }}
                  >
                    {service.label} <ExternalLink className="h-4 w-auto" />
                  </Button>
                ))}

                <p className="px-4 text-zinc-400 font-bold text-sm mt-6 mb-1">
                  Feedback
                </p>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.open("https://cc.vatssa.com/feedback", "_blank");
                  }}
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
