"use client";

import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type variant = "ghost";

type DropdownContextValue = {
  variant: variant;
  close: () => void;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

const panelAnim = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
};

const isDev = process.env.NODE_ENV !== "production";

function useCloseOnOutside<T extends HTMLElement = HTMLElement>(
  rootRef: React.RefObject<T | null>,
  isOpen: boolean,
  onClose: () => void,
) {
  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isOpen, onClose, rootRef]);
}

export function Dropdown({
  text,
  triggerChildren,
  children,
  variant,
  className = "",
  chevron = true,
  disabled = false,
}: {
  text?: React.ReactNode;
  triggerChildren?: React.ReactNode;
  children?: React.ReactNode;
  variant?: variant;
  className?: string;
  chevron?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [matchedWidth, setMatchedWidth] = useState<number | null>(null);

  useCloseOnOutside(rootRef, open, () => setOpen(false));

  useLayoutEffect(() => {
    const measure = () => {
      const t = triggerRef.current;
      const w = t ? Math.ceil(t.getBoundingClientRect().width) : 0;
      setMatchedWidth(w || null);
    };

    measure();

    let ro: ResizeObserver | null = null;
    try {
      if (typeof ResizeObserver !== "undefined" && triggerRef.current) {
        ro = new ResizeObserver(measure);
        ro.observe(triggerRef.current);
      }
    } catch {
      // ignore
    }

    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      if (ro) ro.disconnect();
    };
  }, [variant, text]);

  if (!variant) {
    if (isDev) {
      console.warn(
        "Dropdown: `variant` prop is required and must be 'ghost' — rendering null.",
      );
    }
    return null;
  }

  const close = () => setOpen(false);

  const ghost = {
    root: "transition-all relative inline-block text-left",
    trigger:
      "flex justify-center items-center gap-2 h-full whitespace-nowrap px-4 py-2 text-primary-text dark:text-primary-text-dark transition-all duration-200",
    panel:
      "text-lg max-h-[350px] overflow-y-auto mt-3 absolute -left-1 bg-zinc-900 rounded-lg  shadow-lg z-50 p-2",
  };

  const style = ghost;

  const panelStyle: React.CSSProperties = matchedWidth
    ? { minWidth: matchedWidth }
    : {};

  return (
    <div ref={rootRef} className={`${style.root} ${className}`}>
      <div
        ref={triggerRef}
        onClick={() => {
          if (disabled) return;
          setOpen((s) => !s);
        }}
        aria-expanded={open}
        aria-disabled={disabled}
        className={`${style.trigger} ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:text-white"
        }`}
      >
        {triggerChildren}
        {text !== undefined && <span className="truncate">{text}</span>}
        {chevron && (
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            className={style.panel}
            initial={panelAnim.initial}
            animate={panelAnim.animate}
            exit={panelAnim.exit}
            style={panelStyle}
          >
            <DropdownContext.Provider value={{ variant: variant, close }}>
              {children}
            </DropdownContext.Provider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
  className = "",
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const ctx = useContext(DropdownContext);
  if (!ctx) {
    if (isDev) {
      console.warn(
        "DropdownItem must be used inside <Dropdown type='navbar'|'menu'|'ghost'>",
      );
    }
    return null;
  }

  const { close } = ctx;

  const base = "block";
  const ghostItem =
    "whitespace-nowrap py-2 px-4 hover:bg-zinc-800 rounded-md text-sm text-white cursor-pointer";

  const classes = `${base} ${ghostItem} ${className}`;

  return (
    <div
      role="menuitem"
      className={classes}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
        close();
      }}
    >
      {children}
    </div>
  );
}

export function DropdownSeperator({ className = "" }: { className?: string }) {
  const ctx = useContext(DropdownContext);
  if (!ctx) {
    if (isDev) {
      console.warn(
        "DropdownItem must be used inside <Dropdown type='navbar'|'menu'|'ghost'>",
      );
    }
    return null;
  }

  const classes = `mx-1 my-1 h-px bg-zinc-800 ${className}`;

  return (
    <div role="separator" aria-orientation="horizontal" className={classes} />
  );
}
