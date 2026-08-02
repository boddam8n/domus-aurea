"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apologyAssets } from "@/lib/apology-assets";

type SoundName = keyof typeof apologyAssets.audio;

export function useSoundManager() {
  const soundsRef = useRef<Partial<Record<SoundName, HTMLAudioElement>>>({});
  const enabledRef = useRef(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sounds = Object.fromEntries(
      Object.entries(apologyAssets.audio).map(([name, src]) => {
        const audio = new Audio(src);
        audio.preload = "auto";
        audio.volume = name === "ambience" ? 0.13 : name === "lamp" ? 0.05 : 0.2;
        audio.loop = name === "ambience" || name === "lamp";
        return [name, audio];
      })
    ) as Record<SoundName, HTMLAudioElement>;

    soundsRef.current = sounds;
    return () => Object.values(sounds).forEach((audio) => audio.pause());
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!enabledRef.current && name !== "click") return;
      const audio = soundsRef.current[name];
      if (!audio) return;
      audio.currentTime = 0;
      void audio.play().catch(() => undefined);
    },
    []
  );

  const enable = useCallback(() => {
    enabledRef.current = true;
    setEnabled(true);
    for (const name of ["ambience", "lamp"] as const) {
      const audio = soundsRef.current[name];
      if (audio?.paused) void audio.play().catch(() => undefined);
    }
  }, []);

  const toggle = useCallback(() => {
    setEnabled((current) => {
      const next = !current;
      enabledRef.current = next;
      for (const name of ["ambience", "lamp"] as const) {
        const audio = soundsRef.current[name];
        if (!audio) continue;
        if (next) void audio.play().catch(() => undefined);
        else audio.pause();
      }
      return next;
    });
  }, []);

  return { enabled, enable, toggle, play };
}
