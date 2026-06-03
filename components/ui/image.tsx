"use client";

import { useEffect, useState, type ImgHTMLAttributes } from "react";

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackClassName?: string;
  fallbackContent?: string;
};

export function Image({
  src,
  alt = "Image unavailable",
  className = "",
  fallbackClassName = "",
  fallbackContent,
  onError,
  onLoad,
  ...props
}: ImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-zinc-800 text-center text-sm text-zinc-300 ${className} ${fallbackClassName}`.trim()}
        role="img"
        aria-label={alt}
      >
        <span className="px-4 py-3">{fallbackContent ?? alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        setHasError(true);
        onError?.(event);
      }}
      onLoad={(event) => {
        setHasError(false);
        onLoad?.(event);
      }}
      {...props}
    />
  );
}
