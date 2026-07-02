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
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  (window.location.href = "https://vats.im/ssa/privacy")
                }
              >
                Our Policies <ExternalLink className="h-4 w-auto" />
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
                  (window.location.href = "https://eaip2.vatssa.com/")
                }
              >
                Transfer/Visit <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
            </Dropdown>

            <Dropdown text="Pilots" chevron={true} variant="ghost">
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  (window.location.href =
                    "https://eaip2.vatssa.com/General/Resources/Links/")
                }
              >
                Resources <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  (window.location.href =
                    "https://eaip2.vatssa.com/Pilot%20Briefing/")
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
                  (window.location.href = "https://bookings.vatssa.com/")
                }
              >
                Pilot Bookings <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
            </Dropdown>

            <Dropdown text="Controllers" chevron={true} variant="ghost">
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  (window.location.href = "https://cc.vatssa.com/")
                }
              >
                Control Centre <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  (window.location.href =
                    "https://eaip2.vatssa.com/General/Resources/Links/")
                }
              >
                Resources <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  (window.location.href = "https://eaip2.vatssa.com/")
                }
              >
                eAIP <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownSeperator />
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  (window.location.href = "https://cc.vatssa.com/")
                }
              >
                Active Roster <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownSeperator />
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  (window.location.href =
                    "https://docs.google.com/forms/d/e/1FAIpQLSfgShseBkNtRv-5nk-RnmgfJhDk0c_9JlI2N8todfkEdEBM5Q/viewform")
                }
              >
                Volunteer as Mentor <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
              <DropdownItem
                className="flex items-center gap-1"
                onClick={() =>
                  (window.location.href = "https://cc.vatssa.com/")
                }
              >
                Training Registration <ExternalLink className="h-4 w-auto" />
              </DropdownItem>
            </Dropdown>

            <Button
              variant="ghost"
              onClick={() =>
                (window.location.href = "https://eaip2.vatssa.com/")
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
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.location.href = "https://eaip2.vatssa.com/";
                  }}
                >
                  Our Policies <ExternalLink className="h-4 w-auto" />
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
                    window.location.href = "https://eaip2.vatssa.com/";
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
                    window.location.href =
                      "https://eaip2.vatssa.com/General/Resources/Links/";
                  }}
                >
                  Resources <ExternalLink className="h-4 w-auto" />
                </Button>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.location.href =
                      "https://eaip2.vatssa.com/Pilot%20Briefing/";
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
                    window.location.href = "https://bookings.vatssa.com/";
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
                    window.location.href = "https://cc.vatssa.com/";
                  }}
                >
                  Control Centre <ExternalLink className="h-4 w-auto" />
                </Button>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.location.href =
                      "https://eaip2.vatssa.com/General/Resources/Links/";
                  }}
                >
                  Resources <ExternalLink className="h-4 w-auto" />
                </Button>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.location.href = "https://eaip2.vatssa.com/";
                  }}
                >
                  eAIP <ExternalLink className="h-4 w-auto" />
                </Button>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.location.href = "https://cc.vatssa.com/";
                  }}
                >
                  Active Roster <ExternalLink className="h-4 w-auto" />
                </Button>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.location.href =
                      "https://docs.google.com/forms/d/e/1FAIpQLSfgShseBkNtRv-5nk-RnmgfJhDk0c_9JlI2N8todfkEdEBM5Q/viewform";
                  }}
                >
                  Volunteer as Mentor <ExternalLink className="h-4 w-auto" />
                </Button>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.location.href = "https://cc.vatssa.com/";
                  }}
                >
                  Training Registration <ExternalLink className="h-4 w-auto" />
                </Button>

                <p className="px-4 text-zinc-400 font-bold text-sm mt-6 mb-1">
                  Feedback
                </p>
                <Button
                  variant="menu"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.location.href = "https://eaip2.vatssa.com/";
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
