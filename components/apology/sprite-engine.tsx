"use client";

/* eslint-disable @next/next/no-img-element -- sprite frames are pre-sized, cached assets swapped in place */

import { useEffect, useState } from "react";

type SpriteEngineProps = {
  frames: readonly string[];
  frameDuration?: number;
  loop?: boolean;
  playing?: boolean;
  className?: string;
  alt?: string;
  loading?: "eager" | "lazy";
  onComplete?: () => void;
};

export function SpriteEngine({
  frames,
  frameDuration = 220,
  loop = true,
  playing = true,
  className = "",
  alt = "",
  loading = "lazy",
  onComplete
}: SpriteEngineProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    setFrameIndex(0);
    if (!playing || reducedMotion || frames.length < 2) return;

    const timer = window.setInterval(() => {
      setFrameIndex((current) => {
        const next = current + 1;
        if (next < frames.length) return next;
        if (loop) return 0;
        window.clearInterval(timer);
        onComplete?.();
        return frames.length - 1;
      });
    }, frameDuration);

    return () => window.clearInterval(timer);
  }, [frameDuration, frames, loop, onComplete, playing, reducedMotion]);

  return (
    <img
      src={frames[frameIndex]}
      alt={alt}
      draggable={false}
      loading={loading}
      decoding="async"
      className={className}
    />
  );
}
