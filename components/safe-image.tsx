"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type SafeImageProps = ImageProps & {
  fallbackLabel?: string;
};

export function SafeImage({ fallbackLabel = "Domus Aurea", alt, className, onError, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(200,155,70,.24),transparent_32%),linear-gradient(135deg,#10100e,#2a2117_48%,#070707)] text-center">
        <div className="px-6">
          <span className="mx-auto block h-px w-20 bg-gold/70" />
          <p className="mt-4 font-display text-3xl text-pearl">{fallbackLabel}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-pearl/55">Luxury preview</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
