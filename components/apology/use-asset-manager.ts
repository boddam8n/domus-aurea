"use client";

import { useEffect, useState } from "react";
import { apologyAssetUrls } from "@/lib/apology-assets";

export function useAssetManager() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let completed = 0;

    const markComplete = () => {
      completed += 1;
      if (!cancelled) setProgress(Math.round((completed / (apologyAssetUrls.length + 1)) * 100));
    };

    const preload = apologyAssetUrls.map(async (url) => {
      try {
        const response = await fetch(url, { cache: "force-cache" });
        if (!response.ok) throw new Error(`Unable to preload ${url}`);
        await response.blob();
      } finally {
        markComplete();
      }
    });

    const fonts = document.fonts.ready.finally(markComplete);

    Promise.allSettled([...preload, fonts]).then(() => {
      if (cancelled) return;
      setProgress(100);
      window.setTimeout(() => setReady(true), 180);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { progress, ready };
}
