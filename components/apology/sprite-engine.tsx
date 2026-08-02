"use client";

import { useEffect, useState } from "react";

type SpriteEngineProps = {
  frames: readonly string[];
  frameDuration?: number;
  loop?: boolean;
  playing?: boolean;
  className?: string;
  alt?: string;
  onComplete?: () => void;
};

export function SpriteEngine({
  frames,
  frameDuration = 220,
  loop = true,
  playing = true,
  className = "",
  alt = "",
  onComplete
}: SpriteEngineProps) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setFrameIndex(0);
    if (!playing || frames.length < 2) return;

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
  }, [frameDuration, frames, loop, onComplete, playing]);

  // These assets are intentionally preloaded and swapped frame-by-frame by the game engine.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={frames[frameIndex]} alt={alt} draggable={false} className={className} />;
}
