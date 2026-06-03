"use client";

import {
  createContext,
  useContext,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type CardSnap = "top" | "left";

const CardSnapContext = createContext<CardSnap>("left");

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
    <CardSnapContext.Provider value={snap}>
      <div
        className={`flex w-full flex-col items-center justify-center overflow-hidden rounded-4xl bg-zinc-800 ${snap === "left" ? "xl:flex-row" : ""} ${className}`.trim()}
        {...props}
      >
        {media && (
          <div
            className={`w-full ${snap === "left" ? "xl:w-3/5" : ""} ${mediaClassName}`.trim()}
          >
            {media}
          </div>
        )}
        {children}
      </div>
    </CardSnapContext.Provider>
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
  className = "",
  ...props
}: CardSectionProps) {
  const snap = useContext(CardSnapContext);

  return (
    <div
      className={`flex w-full flex-col items-start justify-center gap-2 p-6 text-left ${className}`.trim()}
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
