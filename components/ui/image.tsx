"use client";

import { useState, type ImgHTMLAttributes } from "react";

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
  const [renderedSrc, setRenderedSrc] = useState(src);

  // Reset the error when a new src arrives. Adjusting state during render is
  // React's recommended alternative to doing this in an effect, which would
  // render the stale fallback once before correcting itself.
  if (src !== renderedSrc) {
    setRenderedSrc(src);
    setHasError(false);
  }

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
