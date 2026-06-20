"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { CalendarDays, MapPin, Play, Send, X } from "lucide-react";
import { getTemplatePreviewConfig, type TemplateMechanism, type TemplatePreviewConfig } from "@/lib/template-preview-config";

export type TemplatePreviewSample = {
  brideName: string;
  groomName: string;
  date: string;
  venue: string;
  musicSrc?: string;
};

type TemplatePreviewModalProps = {
  isOpen: boolean;
  templateName: string;
  onClose: () => void;
  sample?: TemplatePreviewSample;
};

const defaultSample: TemplatePreviewSample = {
  brideName: "Layan",
  groomName: "Yassin",
  date: "12 December 2026",
  venue: "Emerald Palace, Cairo",
  musicSrc: "/audio/wedding-music.mp3"
};

export function TemplatePreviewModal({ isOpen, templateName, onClose, sample = defaultSample }: TemplatePreviewModalProps) {
  const config = useMemo(() => getTemplatePreviewConfig(templateName), [templateName]);
  const data = { ...defaultSample, ...sample };
  const initials = getInitials(data.brideName, data.groomName);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isOpen || !sceneRef.current) return;

    document.body.style.overflow = "hidden";
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      gsap.set(".preview-stage", { opacity: 0, y: 24, scale: 0.985 });
      gsap.set(".preview-seal-shard", { opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 });
      gsap.set(".preview-copy-line", { opacity: 0, y: 18 });
      gsap.set(".preview-rsvp-preview", { opacity: 0, y: 24 });
      gsap.set(".preview-invitation-card, .preview-acrylic-card, .preview-scroll-paper, .preview-bottle-message, .preview-pocket-insert, .preview-pocket-rsvp", { opacity: 0, y: 46 });

      tl.to(".preview-stage", { opacity: 1, y: 0, scale: 1, duration: 0.9 });
      animateMechanism(tl, config.mechanism);
      tl.to(".preview-copy-line", { opacity: 1, y: 0, duration: 0.62, stagger: 0.11 }, "-=.35");
      tl.to(".preview-rsvp-preview", { opacity: 1, y: 0, duration: 0.7 }, "-=.25");
    }, sceneRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [config.mechanism, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const audio = audioRef.current;
    if (!audio) return;

    let interval: number | null = null;
    audio.volume = 0;
    audio.currentTime = 0;
    audio.playbackRate = 1;

    const fadeTo = (target: number, duration = 2600, onDone?: () => void) => {
      if (interval) window.clearInterval(interval);
      const start = audio.volume;
      const startedAt = performance.now();
      interval = window.setInterval(() => {
        const progress = Math.min(1, (performance.now() - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        audio.volume = start + (target - start) * eased;
        if (progress >= 1) {
          if (interval) window.clearInterval(interval);
          interval = null;
          onDone?.();
        }
      }, 40);
    };

    window.setTimeout(() => {
      void audio.play().then(() => fadeTo(0.16, 3200)).catch(() => undefined);
    }, 850);

    return () => {
      fadeTo(0, 900, () => {
        audio.pause();
        audio.currentTime = 0;
      });
      if (interval) window.clearInterval(interval);
    };
  }, [data.musicSrc, isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[90] overflow-y-auto bg-black/75 px-4 py-5 text-pearl backdrop-blur-xl md:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <audio ref={audioRef} src={data.musicSrc} preload="metadata" loop playsInline />
          <button
            type="button"
            onClick={onClose}
            className="fixed right-4 top-4 z-[95] grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition hover:bg-white hover:text-night"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>

          <div ref={sceneRef} className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl items-center">
            <div className="preview-stage relative w-full overflow-hidden rounded-[2rem] border border-white/12 p-4 shadow-[0_40px_140px_rgba(0,0,0,.48)] md:p-8" style={{ background: config.palette.scene }}>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,.25),transparent_30%),radial-gradient(circle_at_82%_8%,rgba(209,164,82,.22),transparent_26%)]" />
              <div className="relative grid gap-8 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
                <div className="min-h-[620px]">
                  <MechanismScene config={config} initials={initials} data={data} />
                </div>
                <div className="rounded-[2rem] border border-white/14 bg-black/28 p-6 shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl md:p-8">
                  <p className="preview-copy-line text-xs font-bold uppercase tracking-[0.28em]" style={{ color: config.palette.gold }}>
                    {config.label}
                  </p>
                  <h2 className="preview-copy-line mt-5 font-display text-5xl leading-tight md:text-7xl">
                    {data.brideName} & {data.groomName}
                  </h2>
                  <p className="preview-copy-line mt-5 leading-8 text-pearl/72">
                    A cinematic guest preview inspired by the physical invitation structure: {config.analysis.details}
                  </p>
                  <div className="preview-copy-line mt-6 grid gap-3">
                    <InfoLine icon={<CalendarDays className="h-4 w-4" />} label={data.date} color={config.palette.gold} />
                    <InfoLine icon={<MapPin className="h-4 w-4" />} label={data.venue} color={config.palette.gold} />
                  </div>
                  <AnalysisList config={config} />
                  <RsvpPreview config={config} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function animateMechanism(tl: gsap.core.Timeline, mechanism: TemplateMechanism) {
  if (mechanism === "acrylic-slide") {
    tl.fromTo(".preview-acrylic-sleeve", { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9 })
      .to(".preview-seal", { scale: 0.86, rotate: 9, duration: 0.34 })
      .to(".preview-seal", { scale: 0, opacity: 0, duration: 0.36 })
      .to(".preview-seal-shard", { opacity: 1, scale: 1, x: "random(-48,48)", y: "random(-36,28)", rotate: "random(-40,40)", duration: 0.55, stagger: 0.035 }, "<")
      .to(".preview-acrylic-card", { opacity: 1, x: 70, y: 0, duration: 1.1 }, "-=.1");
    return;
  }

  if (mechanism === "wax-scroll") {
    tl.fromTo(".preview-scroll-shell", { y: 34, rotate: -5, opacity: 0 }, { y: 0, rotate: -2, opacity: 1, duration: 0.9 })
      .to(".preview-seal", { scale: 0.88, rotate: 8, duration: 0.38 })
      .to(".preview-seal", { scale: 0, opacity: 0, duration: 0.36 })
      .to(".preview-seal-shard", { opacity: 1, scale: 1, x: "random(-52,52)", y: "random(-38,30)", rotate: "random(-50,50)", duration: 0.55, stagger: 0.035 }, "<")
      .to(".preview-scroll-top", { y: -54, duration: 0.75 }, "-=.2")
      .to(".preview-scroll-bottom", { y: 54, duration: 0.75 }, "<")
      .fromTo(".preview-scroll-paper", { scaleY: 0.22, transformOrigin: "50% 50%" }, { opacity: 1, y: 0, scaleY: 1, duration: 1.15 }, "-=.25");
    return;
  }

  if (mechanism === "floral-aisle") {
    tl.fromTo(".preview-floral-arch", { scale: 0.86, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 })
      .to(".preview-seal", { scale: 0.9, duration: 0.32 })
      .to(".preview-seal", { scale: 0, opacity: 0, duration: 0.35 })
      .to(".preview-invitation-card", { opacity: 1, y: 0, duration: 1.05 }, "-=.1")
      .to(".preview-flower", { opacity: 1, y: "random(-22,-8)", rotate: "random(-8,8)", duration: 1.2, stagger: 0.04 }, "-=.9");
    return;
  }

  if (mechanism === "royal-scroll") {
    tl.fromTo(".preview-scroll-paper", { scaleY: 0.18, transformOrigin: "50% 50%" }, { opacity: 1, y: 0, scaleY: 1, duration: 1.25 })
      .fromTo(".preview-scroll-top", { y: 150 }, { y: 0, duration: 0.8 }, "-=1")
      .fromTo(".preview-scroll-bottom", { y: -150 }, { y: 0, duration: 0.8 }, "<")
      .to(".preview-seal", { scale: 0.88, rotate: 6, duration: 0.34 })
      .to(".preview-seal", { scale: 0, opacity: 0, duration: 0.34 })
      .to(".preview-seal-shard", { opacity: 1, scale: 1, x: "random(-42,42)", y: "random(-30,30)", rotate: "random(-35,35)", duration: 0.45, stagger: 0.03 }, "<");
    return;
  }

  if (mechanism === "message-bottle") {
    tl.fromTo(".preview-bottle", { rotate: -10, y: 30, opacity: 0 }, { rotate: -3, y: 0, opacity: 1, duration: 0.95 })
      .to(".preview-bottle-cork", { y: -48, rotate: 18, duration: 0.58 })
      .to(".preview-seal", { scale: 0, opacity: 0, duration: 0.34 }, "-=.25")
      .to(".preview-bottle-message", { opacity: 1, y: -26, rotate: 4, duration: 1.1 }, "-=.1");
    return;
  }

  if (mechanism === "gate-fold") {
    tl.fromTo(".preview-left-gate", { rotateY: 0 }, { rotateY: -72, duration: 1.2, transformOrigin: "0% 50%" })
      .to(".preview-right-gate", { rotateY: 72, duration: 1.2, transformOrigin: "100% 50%" }, "<")
      .to(".preview-seal", { scale: 0.82, opacity: 0, duration: 0.42 }, "-=.95")
      .to(".preview-seal-shard", { opacity: 1, scale: 1, x: "random(-42,42)", y: "random(-28,28)", duration: 0.42, stagger: 0.03 }, "<")
      .to(".preview-invitation-card", { opacity: 1, y: 0, duration: 0.9 }, "-=.35");
    return;
  }

  if (mechanism === "velvet-book") {
    tl.fromTo(".preview-book-cover", { rotateY: 0 }, { rotateY: -68, duration: 1.15, transformOrigin: "0% 50%" })
      .to(".preview-seal", { scale: 0.84, opacity: 0, duration: 0.38 }, "-=.9")
      .to(".preview-acrylic-card", { opacity: 1, x: 42, y: 0, duration: 1.05 }, "-=.35");
    return;
  }

  if (mechanism === "letterpress-fold") {
    tl.fromTo(".preview-envelope-flap", { rotateX: 0 }, { rotateX: -82, duration: 1.05, transformOrigin: "50% 0%" })
      .to(".preview-seal", { scale: 0.84, opacity: 0, duration: 0.38 }, "-=.8")
      .to(".preview-invitation-card", { opacity: 1, y: -24, duration: 1.05 }, "-=.25");
    return;
  }

  tl.fromTo(".preview-pocket", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
    .to(".preview-seal", { scale: 0.82, opacity: 0, duration: 0.36 })
    .to(".preview-pocket-insert", { opacity: 1, x: 62, y: -18, rotate: 3, duration: 1.05 }, "-=.05")
    .to(".preview-pocket-rsvp", { opacity: 1, x: -64, y: 34, rotate: -5, duration: 0.9 }, "-=.72");
}

function MechanismScene({ config, initials, data }: { config: TemplatePreviewConfig; initials: string; data: TemplatePreviewSample }) {
  const common = { config, initials, data };
  switch (config.mechanism) {
    case "acrylic-slide":
      return <AcrylicSlide {...common} />;
    case "wax-scroll":
      return <WaxScroll {...common} />;
    case "floral-aisle":
      return <FloralAisle {...common} />;
    case "royal-scroll":
      return <RoyalScrollPreview {...common} />;
    case "message-bottle":
      return <BottlePreview {...common} />;
    case "gate-fold":
      return <GateFoldPreview {...common} />;
    case "velvet-book":
      return <VelvetBookPreview {...common} />;
    case "letterpress-fold":
      return <LetterpressPreview {...common} />;
    default:
      return <NoirPocketPreview {...common} />;
  }
}

function AcrylicSlide({ config, initials, data }: SceneProps) {
  return (
    <div className="relative grid min-h-[620px] place-items-center">
      <div className="preview-acrylic-sleeve absolute h-[500px] w-[310px] -translate-x-24 rounded-[1.4rem] border border-white/55 bg-white/55 shadow-2xl backdrop-blur">
        <FloralEtching color={config.palette.muted} />
      </div>
      <InvitationCard className="preview-acrylic-card" config={config} initials={initials} data={data} glass />
      <WaxSeal initials={initials} config={config} className="left-[42%] top-[45%]" />
    </div>
  );
}

function WaxScroll({ config, initials, data }: SceneProps) {
  return (
    <div className="relative grid min-h-[620px] place-items-center">
      <div className="preview-scroll-shell relative h-[520px] w-[290px] rounded-[9rem] shadow-2xl" style={{ background: config.palette.surface }}>
        <div className="preview-scroll-top absolute inset-x-8 top-8 h-8 rounded-full bg-white/10 shadow-inner" />
        <div className="preview-scroll-bottom absolute inset-x-8 bottom-8 h-8 rounded-full bg-black/15 shadow-inner" />
        <InvitationCard className="preview-scroll-paper absolute left-1/2 top-1/2 h-[430px] w-[270px] -translate-x-1/2 -translate-y-1/2" config={config} initials={initials} data={data} />
        <WaxSeal initials={initials} config={config} wax className="left-1/2 top-1/2" />
      </div>
    </div>
  );
}

function FloralAisle({ config, initials, data }: SceneProps) {
  return (
    <div className="relative min-h-[620px] overflow-hidden rounded-[1.6rem] bg-gradient-to-b from-[#dbe2e2] via-[#f8efdc] to-[#84976f] p-6">
      <div className="preview-floral-arch absolute left-1/2 top-16 h-[360px] w-[78%] -translate-x-1/2 rounded-t-full border-[28px] border-white/75 shadow-[0_0_0_18px_rgba(255,255,255,.22)]" />
      {Array.from({ length: 18 }).map((_, index) => (
        <span
          key={index}
          className="preview-flower absolute h-5 w-5 rounded-full bg-white opacity-0 shadow"
          style={{ left: `${16 + (index % 9) * 8}%`, top: `${58 + Math.floor(index / 9) * 18}%` }}
        />
      ))}
      <InvitationCard className="preview-invitation-card absolute bottom-10 left-1/2 w-[340px] -translate-x-1/2" config={config} initials={initials} data={data} />
      <WaxSeal initials={initials} config={config} className="left-1/2 top-[42%]" />
    </div>
  );
}

function RoyalScrollPreview({ config, initials, data }: SceneProps) {
  return (
    <div className="relative grid min-h-[620px] place-items-center">
      <InvitationCard className="preview-scroll-paper h-[460px] w-[360px]" config={config} initials={initials} data={data} />
      <div className="preview-scroll-top absolute top-[78px] h-9 w-[520px] rounded-full bg-gradient-to-r from-[#8c6d43] via-[#e4c47a] to-[#8c6d43] shadow-xl" />
      <div className="preview-scroll-bottom absolute bottom-[78px] h-9 w-[520px] rounded-full bg-gradient-to-r from-[#8c6d43] via-[#e4c47a] to-[#8c6d43] shadow-xl" />
      <WaxSeal initials={initials} config={config} className="left-1/2 top-1/2" />
    </div>
  );
}

function BottlePreview({ config, initials, data }: SceneProps) {
  return (
    <div className="relative grid min-h-[620px] place-items-center">
      <div className="preview-bottle relative h-[560px] w-[210px] rounded-[5rem] border border-white/65 bg-white/20 shadow-[inset_0_0_35px_rgba(255,255,255,.38),0_32px_90px_rgba(0,0,0,.25)] backdrop-blur">
        <div className="preview-bottle-cork absolute left-1/2 top-4 h-20 w-16 -translate-x-1/2 rounded-xl bg-[#75512e]" />
        <div className="absolute bottom-8 left-8 right-8 h-14 rounded-[50%] bg-[#7a674f]/55" />
        <div className="preview-bottle-message absolute left-1/2 top-28 h-[380px] w-20 -translate-x-1/2 rounded-2xl" style={{ background: config.palette.paper }}>
          <p className="mt-20 rotate-90 whitespace-nowrap text-center font-display text-5xl" style={{ color: config.palette.ink }}>{initials}</p>
        </div>
      </div>
      <WaxSeal initials={initials} config={config} className="left-[56%] top-[28%]" />
      <div className="preview-copy-line absolute bottom-12 rounded-2xl bg-white/50 px-5 py-3 text-sm font-bold" style={{ color: config.palette.ink }}>
        Pull the message to reveal the invitation
      </div>
    </div>
  );
}

function GateFoldPreview({ config, initials, data }: SceneProps) {
  return (
    <div className="relative grid min-h-[620px] place-items-center [perspective:1200px]">
      <InvitationCard className="preview-invitation-card h-[480px] w-[350px]" config={config} initials={initials} data={data} />
      <GatePanel side="left" config={config} />
      <GatePanel side="right" config={config} />
      <WaxSeal initials={initials} config={config} className="left-1/2 top-1/2" />
    </div>
  );
}

function VelvetBookPreview({ config, initials, data }: SceneProps) {
  return (
    <div className="relative grid min-h-[620px] place-items-center [perspective:1300px]">
      <div className="absolute h-[500px] w-[380px] rounded-[1.5rem] border border-[#d8bd74]/35 bg-[#052616] shadow-2xl" />
      <InvitationCard className="preview-acrylic-card h-[440px] w-[330px] translate-x-8" config={config} initials={initials} data={data} glass />
      <div className="preview-book-cover absolute h-[500px] w-[380px] rounded-[1.5rem] border border-[#d8bd74]/25 bg-[#06351f] shadow-2xl">
        <div className="absolute inset-10 rounded-[1rem] border border-[#d8bd74]/35" />
      </div>
      <WaxSeal initials={initials} config={config} className="left-1/2 top-[42%]" />
    </div>
  );
}

function LetterpressPreview({ config, initials, data }: SceneProps) {
  return (
    <div className="relative grid min-h-[620px] place-items-center [perspective:1200px]">
      <InvitationCard className="preview-invitation-card h-[500px] w-[360px]" config={config} initials={initials} data={data} />
      <div className="absolute bottom-[70px] h-[360px] w-[430px] rounded-b-[2rem] bg-[#596a45] shadow-2xl" />
      <div className="preview-envelope-flap absolute bottom-[430px] h-[230px] w-[430px] origin-top rounded-t-[2rem] bg-[#596a45] shadow-2xl" />
      <WaxSeal initials={initials} config={config} wax className="left-1/2 top-[58%]" />
    </div>
  );
}

function NoirPocketPreview({ config, initials, data }: SceneProps) {
  return (
    <div className="relative grid min-h-[620px] place-items-center">
      <div className="preview-pocket absolute h-[430px] w-[420px] rounded-[1.4rem] bg-[#080808] shadow-2xl">
        <div className="absolute inset-x-0 bottom-0 h-44 rounded-b-[1.4rem] bg-[#111]" />
      </div>
      <InvitationCard className="preview-pocket-insert h-[420px] w-[300px]" config={config} initials={initials} data={data} />
      <div className="preview-pocket-rsvp absolute h-[330px] w-[150px] rounded-xl bg-[#f5f2ea] p-4 text-[#111] shadow-xl">
        <p className="font-display text-3xl text-[#d0a24a]">RSVP</p>
        <div className="mt-10 h-24 rounded-lg border border-black/15" />
        <p className="mt-5 text-xs uppercase tracking-[0.2em]">guest card</p>
      </div>
      <WaxSeal initials={initials} config={config} className="left-1/2 top-[43%]" />
    </div>
  );
}

type SceneProps = {
  config: TemplatePreviewConfig;
  initials: string;
  data: TemplatePreviewSample;
};

function InvitationCard({ config, initials, data, className = "", glass = false }: SceneProps & { className?: string; glass?: boolean }) {
  return (
    <div
      className={`${className} relative rounded-[1.25rem] border p-7 text-center shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur`}
      style={{
        background: glass ? "linear-gradient(135deg,rgba(255,255,255,.34),rgba(255,255,255,.12))" : config.palette.paper,
        borderColor: glass ? "rgba(255,255,255,.58)" : `${config.palette.gold}66`,
        color: config.palette.ink
      }}
    >
      <div className="absolute inset-5 rounded-[1rem] border" style={{ borderColor: `${config.palette.gold}66` }} />
      <p className="preview-copy-line text-xs font-bold uppercase tracking-[0.26em]" style={{ color: config.palette.gold }}>
        Domus Aurea
      </p>
      <p className="preview-copy-line mt-8 font-display text-6xl leading-none" style={{ color: config.palette.gold }}>
        {initials}
      </p>
      <h3 className="preview-copy-line mt-7 font-display text-4xl leading-tight">
        {data.brideName}
        <span className="block text-2xl">&</span>
        {data.groomName}
      </h3>
      <div className="preview-copy-line mx-auto my-7 h-px w-28" style={{ background: config.palette.gold }} />
      <p className="preview-copy-line text-sm uppercase tracking-[0.18em]" style={{ color: config.palette.muted }}>{data.date}</p>
      <p className="preview-copy-line mt-4 text-sm leading-6" style={{ color: config.palette.muted }}>{data.venue}</p>
    </div>
  );
}

function WaxSeal({ initials, config, wax = false, className = "" }: { initials: string; config: TemplatePreviewConfig; wax?: boolean; className?: string }) {
  return (
    <div className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 ${className}`}>
      <div
        className="preview-seal relative grid h-24 w-24 place-items-center rounded-full text-3xl font-black shadow-[0_18px_50px_rgba(0,0,0,.34)]"
        style={{
          background: wax
            ? "radial-gradient(circle at 30% 22%, #d8a66d, #9d6033 42%, #5d2217 78%)"
            : `radial-gradient(circle at 30% 22%, ${config.palette.gold}, ${config.palette.surface})`,
          color: wax ? "#4d1c13" : config.palette.ink
        }}
      >
        <span className="font-display">{initials}</span>
        <span className="absolute inset-3 rounded-full border border-current opacity-30" />
      </div>
      {Array.from({ length: 7 }).map((_, index) => (
        <span key={index} className="preview-seal-shard absolute left-10 top-10 h-3 w-5 rounded-full" style={{ background: wax ? "#9d6033" : config.palette.gold }} />
      ))}
    </div>
  );
}

function GatePanel({ side, config }: { side: "left" | "right"; config: TemplatePreviewConfig }) {
  const isLeft = side === "left";
  return (
    <div
      className={`preview-${side}-gate absolute h-[510px] w-[220px] overflow-hidden shadow-2xl`}
      style={{
        left: isLeft ? "calc(50% - 220px)" : "50%",
        background: config.palette.surface,
        border: `1px solid ${config.palette.gold}44`,
        borderRadius: isLeft ? "1.4rem 0 0 1.4rem" : "0 1.4rem 1.4rem 0"
      }}
    >
      <div className="absolute inset-8 rounded-full border border-black/30" />
      <div className="absolute inset-y-8 left-1/2 w-px bg-white/15" />
      {Array.from({ length: 8 }).map((_, index) => (
        <span key={index} className="absolute h-24 w-14 rounded-full border border-black/30" style={{ left: `${20 + (index % 2) * 84}px`, top: `${34 + index * 52}px` }} />
      ))}
    </div>
  );
}

function FloralEtching({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 300 500" className="h-full w-full p-7" aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.3" opacity="0.8">
        {Array.from({ length: 8 }).map((_, index) => (
          <g key={index} transform={`translate(${40 + (index % 2) * 145} ${34 + index * 52}) rotate(${index % 2 ? -12 : 10})`}>
            <circle cx="24" cy="24" r="20" />
            <path d="M4 24 C20 8 28 8 44 24 C28 40 20 40 4 24Z" />
            <path d="M52 20 q26 -18 46 6 q-28 8 -46 -6Z" />
          </g>
        ))}
      </g>
    </svg>
  );
}

function InfoLine({ icon, label, color }: { icon: ReactNode; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-pearl/76">
      <span style={{ color }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function AnalysisList({ config }: { config: TemplatePreviewConfig }) {
  const rows = [
    ["Envelope", config.analysis.envelope],
    ["Seal", config.analysis.seal],
    ["Paper", config.analysis.paper],
    ["Details", config.analysis.details]
  ];

  return (
    <div className="preview-copy-line mt-6 grid gap-2 text-sm">
      {rows.map(([label, value]) => (
        <div key={label} className="grid gap-1 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 md:grid-cols-[110px_1fr]">
          <span className="font-bold uppercase tracking-[0.16em]" style={{ color: config.palette.gold }}>{label}</span>
          <span className="text-pearl/68">{value}</span>
        </div>
      ))}
    </div>
  );
}

function RsvpPreview({ config }: { config: TemplatePreviewConfig }) {
  return (
    <div className="preview-rsvp-preview mt-6 rounded-[1.5rem] border border-white/12 bg-white/[0.06] p-5">
      <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: config.palette.gold }}>RSVP preview</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-pearl/60">Guest name</div>
        <button type="button" className="rounded-2xl px-5 py-3 text-sm font-bold text-night" style={{ background: config.palette.gold }}>
          <Send className="mr-2 inline h-4 w-4" />
          Accept
        </button>
      </div>
    </div>
  );
}

function getInitials(brideName: string, groomName: string) {
  const first = brideName.trim().charAt(0);
  const second = groomName.trim().charAt(0);
  return `${first}${second}`.toUpperCase() || "DA";
}

export function PlayPreviewButton({ onClick, isArabic }: { onClick: () => void; isArabic: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-5 py-3 text-sm font-bold text-white shadow-[0_16px_40px_rgba(0,0,0,.25)] backdrop-blur-md transition hover:border-gold hover:bg-gold hover:text-night"
    >
      <Play className="h-4 w-4" />
      {isArabic ? "تشغيل المعاينة" : "Play Preview"}
    </button>
  );
}
