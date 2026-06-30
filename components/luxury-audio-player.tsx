"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Pause, Play, Volume1, Volume2, VolumeX } from "lucide-react";

type Speed = 1 | 0.9 | 0.8;

type AudioGraph = {
  context: AudioContext;
  gain: GainNode;
  source: MediaElementAudioSourceNode;
  bass: BiquadFilterNode;
  warmth: BiquadFilterNode;
  smoothing: BiquadFilterNode;
};

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

const speedOptions: Array<{ label: string; value: Speed }> = [
  { label: "Normal", value: 1 },
  { label: "Slightly Slower", value: 0.9 },
  { label: "Romantic Slow", value: 0.8 }
];

function getStoredNumber(key: string, fallback: number) {
  if (typeof window === "undefined") return fallback;
  const stored = window.sessionStorage.getItem(key);
  return stored ? Number(stored) : fallback;
}

export function LuxuryAudioPlayer({
  src,
  shouldStart = false,
  startDelayMs = 2600,
  variant = "full"
}: {
  src: string;
  shouldStart?: boolean;
  startDelayMs?: number;
  variant?: "full" | "nav";
}) {
  const pathname = usePathname();
  const isInvitationPage = pathname?.startsWith("/invitation/");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const graphRef = useRef<AudioGraph | null>(null);
  const fadeRef = useRef<number | null>(null);
  const unlockedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [guestEnabledMusic, setGuestEnabledMusic] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.sessionStorage.getItem("domus_music_enabled") !== "false";
  });
  const [volume, setVolume] = useState(() => getStoredNumber("domus_music_volume", 0.18));
  const [speed, setSpeed] = useState<Speed>(() => (getStoredNumber("domus_music_speed", 1) as Speed) || 1);

  const ensureGraph = useCallback(() => {
    if (!audioRef.current) return null;
    if (graphRef.current) return graphRef.current;

    const audioWindow = window as AudioWindow;
    const AudioContextClass = audioWindow.AudioContext || audioWindow.webkitAudioContext;
    if (!AudioContextClass) return null;

    const context = new AudioContextClass();
    const source = context.createMediaElementSource(audioRef.current);
    const bass = context.createBiquadFilter();
    const warmth = context.createBiquadFilter();
    const smoothing = context.createBiquadFilter();
    const gain = context.createGain();

    bass.type = "lowshelf";
    bass.frequency.value = 120;
    bass.gain.value = 1.4;

    warmth.type = "peaking";
    warmth.frequency.value = 520;
    warmth.Q.value = 0.65;
    warmth.gain.value = 0.8;

    smoothing.type = "highshelf";
    smoothing.frequency.value = 7600;
    smoothing.gain.value = -0.7;

    gain.gain.value = 0;
    source.connect(bass);
    bass.connect(warmth);
    warmth.connect(smoothing);
    smoothing.connect(gain);
    gain.connect(context.destination);

    graphRef.current = { context, source, bass, warmth, smoothing, gain };
    return graphRef.current;
  }, []);

  const fadeTo = useCallback((target: number, durationMs: number, onDone?: () => void) => {
    const graph = ensureGraph();
    if (!graph) return;
    if (fadeRef.current) window.clearInterval(fadeRef.current);

    const start = graph.gain.gain.value;
    const startedAt = performance.now();

    fadeRef.current = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      graph.gain.gain.value = start + (target - start) * eased;
      if (progress >= 1) {
        if (fadeRef.current) window.clearInterval(fadeRef.current);
        fadeRef.current = null;
        onDone?.();
      }
    }, 40);
  }, [ensureGraph]);

  const playSoftly = useCallback(async () => {
    const audio = audioRef.current;
    const graph = ensureGraph();
    if (!audio || !graph) return;

    try {
      await graph.context.resume();
      audio.playbackRate = speed;
      audio.muted = false;
      await audio.play();
      setNeedsGesture(false);
      setGuestEnabledMusic(true);
      window.sessionStorage.setItem("domus_music_enabled", "true");
      setIsPlaying(true);
      fadeTo(isMuted ? 0 : volume, 3200);
    } catch {
      setNeedsGesture(true);
      setIsPlaying(false);
    }
  }, [ensureGraph, fadeTo, isMuted, speed, volume]);

  const unlockSilently = useCallback(async () => {
    if (unlockedRef.current) return;
    const audio = audioRef.current;
    const graph = ensureGraph();
    if (!audio || !graph) return;

    try {
      await graph.context.resume();
      audio.loop = true;
      audio.playbackRate = speed;
      graph.gain.gain.value = 0;
      await audio.play();
      unlockedRef.current = true;
      setNeedsGesture(false);
    } catch {
      setNeedsGesture(true);
    }
  }, [ensureGraph, speed]);

  const pauseSoftly = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    fadeTo(0, 2400, () => {
      audio.pause();
      setIsPlaying(false);
      setGuestEnabledMusic(false);
      window.sessionStorage.setItem("domus_music_enabled", "false");
    });
  }, [fadeTo]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = speed;
    window.sessionStorage.setItem("domus_music_speed", String(speed));
  }, [speed]);

  useEffect(() => {
    window.sessionStorage.setItem("domus_music_volume", String(volume));
    if (isPlaying && !isMuted) fadeTo(volume, 450);
  }, [fadeTo, isMuted, isPlaying, volume]);

  useEffect(() => {
    if (!shouldStart || !guestEnabledMusic) return;
    const timer = window.setTimeout(() => {
      void playSoftly();
    }, startDelayMs);
    return () => window.clearTimeout(timer);
  }, [guestEnabledMusic, playSoftly, shouldStart, startDelayMs]);

  useEffect(() => {
    if (!isPlaying) return;
    fadeTo(isMuted ? 0 : volume, 700);
  }, [fadeTo, isMuted, isPlaying, volume]);

  useEffect(() => {
    return () => {
      if (fadeRef.current) window.clearInterval(fadeRef.current);
      graphRef.current?.context.close();
    };
  }, []);

  if (variant === "nav") {
    return (
      <div
        className={
          isInvitationPage
            ? "fixed right-3 top-[calc(env(safe-area-inset-top)+.75rem)] z-[60]"
            : "fixed left-4 top-[5.25rem] z-[60] md:left-auto md:right-8 md:top-5"
        }
      >
        <audio ref={audioRef} src={src} preload="metadata" loop playsInline />
        <div
          className={
            isInvitationPage
              ? "flex items-center gap-1 rounded-full border border-[#b98b5f]/35 bg-[#fff8f1]/82 p-1 text-[#8a6240] shadow-[0_12px_34px_rgba(111,77,56,.14)] backdrop-blur-md"
              : "flex items-center gap-1 rounded-full border border-gold/25 bg-black/35 p-1.5 text-pearl shadow-[0_18px_60px_rgba(0,0,0,.22)] backdrop-blur-xl"
          }
        >
          <button
            type="button"
            onClick={() => (isPlaying ? pauseSoftly() : playSoftly())}
            className={
              isInvitationPage
                ? "grid h-8 w-8 place-items-center rounded-full bg-[#c99780] text-white transition hover:bg-[#b98b5f]"
                : "grid h-9 w-9 place-items-center rounded-full bg-pearl text-night transition hover:bg-gold"
            }
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? <Pause className={isInvitationPage ? "h-3.5 w-3.5" : "h-4 w-4"} /> : <Play className={isInvitationPage ? "h-3.5 w-3.5" : "h-4 w-4"} />}
          </button>
          <button
            type="button"
            onClick={() => setIsMuted((current) => !current)}
            className={
              isInvitationPage
                ? "grid h-8 w-8 place-items-center rounded-full text-[#8a6240]/80 transition hover:bg-[#fff4ef]"
                : "grid h-9 w-9 place-items-center rounded-full text-pearl/80 transition hover:bg-white/10"
            }
            aria-label={isMuted ? "Unmute music" : "Mute music"}
          >
            {isMuted ? <VolumeX className={isInvitationPage ? "h-3.5 w-3.5" : "h-4 w-4"} /> : <Volume2 className={isInvitationPage ? "h-3.5 w-3.5" : "h-4 w-4"} />}
          </button>
          {needsGesture ? (
            <button type="button" onClick={playSoftly} className={isInvitationPage ? "rounded-full px-2 py-1.5 text-[10px] font-bold text-[#8a6240]" : "rounded-full px-3 py-2 text-xs font-bold text-gold"}>
              Enable
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 rounded-full border border-white/12 bg-black/35 px-3 py-3 text-[#f7efe2] shadow-[0_18px_60px_rgba(0,0,0,.28)] backdrop-blur-xl md:px-4">
      <audio ref={audioRef} src={src} preload="metadata" loop playsInline />
      <div className="flex flex-wrap items-center justify-center gap-3 md:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => (isPlaying ? pauseSoftly() : playSoftly())}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#f7efe2] text-night transition hover:bg-gold"
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setIsMuted((current) => !current)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-[#f7efe2] transition hover:bg-white/10"
            aria-label={isMuted ? "Unmute music" : "Mute music"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : volume > 0.12 ? <Volume2 className="h-4 w-4" /> : <Volume1 className="h-4 w-4" />}
          </button>
          {needsGesture ? (
            <button type="button" onClick={playSoftly} className="rounded-full border border-gold/40 px-4 py-2 text-xs font-bold text-gold">
              Enable Music
            </button>
          ) : null}
        </div>

        <label className="flex min-w-44 items-center gap-3 text-xs text-[#f7efe2]/70">
          Volume
          <input
            aria-label="Music volume"
            type="range"
            min="0"
            max="0.4"
            step="0.01"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="w-28 accent-[#c89b46]"
          />
        </label>

        <div className="flex gap-1 rounded-full border border-white/10 p-1">
          {speedOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSpeed(option.value)}
              className={`rounded-full px-3 py-1.5 text-xs transition ${
                speed === option.value ? "bg-[#f7efe2] text-night" : "text-[#f7efe2]/70 hover:bg-white/10"
              }`}
            >
              {option.value}x
            </button>
          ))}
        </div>
      </div>
      <button type="button" className="sr-only" onClick={unlockSilently}>
        Prepare audio
      </button>
    </div>
  );
}
