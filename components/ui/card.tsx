"use client";

import { type HTMLAttributes, type ReactNode } from "react";

type CardSnap = "top" | "left";

// How a card's content sits along the card's height. Cards stretched by a grid
// or carousel are taller than their content, so this decides whether the text
// hangs from the top or floats in the middle. It is a prop rather than a
// className because a caller-supplied `justify-*` cannot reliably beat the
// one baked in here.
type CardAlign = "start" | "center";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  media?: ReactNode;
  snap?: CardSnap;
  mediaClassName?: string;
};

type CardAvatarProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
};

type CardSectionProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  align?: CardAlign;
};

type CardHeaderProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode;
};

type CardTimestampProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
};

export function Card({
  children,
  media,
  snap = "left",
  className = "",
  mediaClassName = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center overflow-hidden rounded-4xl bg-zinc-800 ${snap === "left" ? "xl:flex-row" : ""} ${className}`.trim()}
      {...props}
    >
      {media && (
        <div
          className={`w-full ${snap === "left" ? "xl:w-1/3" : ""} ${mediaClassName}`.trim()}
        >
          {media}
        </div>
      )}
      {children}
    </div>
  );
}

export function CardAvatar({
  children,
  className = "",
  ...props
}: CardAvatarProps) {
  return (
    <div
      className={`-mt-20 flex h-28 w-28 items-center justify-center self-center overflow-hidden rounded-full border-4 border-zinc-800 bg-black ${className}`.trim()}
      {...props}
    >
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
        {children}
      </div>
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: CardHeaderProps) {
  return (
    <h2
      className={`text-lg md:text-xl lg:text-2xl font-semibold text-white ${className}`.trim()}
      {...props}
    >
      {children}
    </h2>
  );
}

export function CardContent({
  children,
  align = "start",
  className = "",
  ...props
}: CardSectionProps) {
  return (
    <div
      className={`flex w-full flex-col items-start gap-2 p-6 text-left ${
        align === "center" ? "justify-center" : "justify-start"
      } ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTimestamp({
  children,
  className = "",
  ...props
}: CardTimestampProps) {
  return (
    <p className={`text-left text-zinc-400 ${className}`.trim()} {...props}>
      {children}
    </p>
  );
}
