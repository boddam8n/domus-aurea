"use client";

/* eslint-disable @next/next/no-img-element -- sprite frames are pre-sized, cached assets swapped in place */

import { memo, useEffect, useState } from "react";

const frameCache = new Map<string, Promise<void>>();

function preloadFrame(src: string) {
  const cached = frameCache.get(src);
  if (cached) return cached;

  const request = new Promise<void>((resolve) => {
    const image = new window.Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
  frameCache.set(src, request);
  return request;
}

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

export const SpriteEngine = memo(function SpriteEngine({
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
  const [framesReady, setFramesReady] = useState(frames.length < 2);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    let active = true;
    setFramesReady(frames.length < 2);
    if (frames.length < 2 || reducedMotion) return;

    const preload = () => {
      void Promise.all(frames.map(preloadFrame)).then(() => {
        if (active) setFramesReady(true);
      });
    };
    const timer = window.setTimeout(preload, loading === "eager" ? 0 : 120);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [frames, loading, reducedMotion]);

  useEffect(() => {
    setFrameIndex(0);
    if (!playing || !framesReady || reducedMotion || frames.length < 2) return;

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
  }, [frameDuration, frames, framesReady, loop, onComplete, playing, reducedMotion]);

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
});
