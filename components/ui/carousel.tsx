"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselProps = {
  children: ReactNode;
  label: string;
  className?: string;
  itemClassName?: string;
};

export function Carousel({
  children,
  label,
  className = "",
  itemClassName = "",
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const items = Children.toArray(children);

  const measure = useCallback(() => {
    const track = trackRef.current;

    if (!track || track.clientWidth === 0) {
      return;
    }

    const pages = Math.max(1, Math.ceil(track.scrollWidth / track.clientWidth));
    setPageCount(pages);
    setPage((current) => Math.min(current, pages - 1));
  }, []);

  useEffect(() => {
    measure();

    const track = trackRef.current;

    if (!track) {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(track);

    return () => observer.disconnect();
  }, [measure, items.length]);

  const handleScroll = () => {
    const track = trackRef.current;

    if (!track || track.clientWidth === 0) {
      return;
    }

    setPage(Math.round(track.scrollLeft / track.clientWidth));
  };

  const scrollToPage = (target: number) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const clamped = Math.max(0, Math.min(target, pageCount - 1));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  };

  if (items.length === 0) {
    return null;
  }

  const hasPages = pageCount > 1;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={`relative w-full ${className}`.trim()}
    >
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex w-full snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex w-full shrink-0 snap-start px-2 md:px-4 ${itemClassName}`.trim()}
          >
            {item}
          </div>
        ))}
      </div>

      {hasPages && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            disabled={page === 0}
            onClick={() => scrollToPage(page - 1)}
            className="absolute -left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-800/90 text-white transition-all duration-200 hover:bg-zinc-700 disabled:cursor-default disabled:opacity-30 md:-left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            disabled={page === pageCount - 1}
            onClick={() => scrollToPage(page + 1)}
            className="absolute -right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-800/90 text-white transition-all duration-200 hover:bg-zinc-700 disabled:cursor-default disabled:opacity-30 md:-right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-6 flex w-full items-center justify-center gap-2">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === page}
                onClick={() => scrollToPage(index)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  index === page
                    ? "w-6 bg-primary"
                    : "w-2 bg-zinc-600 hover:bg-zinc-500"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
