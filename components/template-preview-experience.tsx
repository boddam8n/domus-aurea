"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { CalendarDays, MapPin, Play, Send, X } from "lucide-react";
import { getTemplatePreviewConfig, type TemplateMechanism, type TemplatePreviewConfig } from "@/lib/template-preview-config";

const SHOWCASE_WIDTH = 960;
const SHOWCASE_HEIGHT = 680;

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

type SceneProps = {
  config: TemplatePreviewConfig;
  initials: string;
  data: TemplatePreviewSample;
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
  const { viewportRef, scale } = useShowcaseScale(isOpen);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isOpen || !sceneRef.current) return;

    document.body.style.overflow = "hidden";
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      gsap.set(".product-stage", { opacity: 0, scale: 0.985, y: 18 });
      gsap.set(".object-note, .object-date, .object-rsvp", { opacity: 0, y: 18 });
      gsap.set(".wax-shard", { opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 });
      gsap.set(".reveal-card, .acrylic-panel, .scroll-sheet, .bottle-scroll, .pocket-insert, .pocket-rsvp", { opacity: 0 });
      gsap.set(".loose-flower", { opacity: 0, y: 10, rotate: 0 });

      tl.to(".product-stage", { opacity: 1, scale: 1, y: 0, duration: 0.85 });
      animatePhysicalObject(tl, config.mechanism);
      tl.to(".object-note, .object-date, .object-rsvp", { opacity: 1, y: 0, duration: 0.62, stagger: 0.08 }, "-=.35");
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
    const fadeTo = (target: number, duration = 2400, onDone?: () => void) => {
      if (interval) window.clearInterval(interval);
      const start = audio.volume;
      const startedAt = performance.now();
      interval = window.setInterval(() => {
        const progress = Math.min(1, (performance.now() - startedAt) / duration);
        audio.volume = start + (target - start) * (1 - Math.pow(1 - progress, 3));
        if (progress >= 1) {
          if (interval) window.clearInterval(interval);
          interval = null;
          onDone?.();
        }
      }, 40);
    };

    audio.volume = 0;
    audio.currentTime = 0;
    audio.playbackRate = 1;
    window.setTimeout(() => {
      void audio.play().then(() => fadeTo(0.15, 3000)).catch(() => undefined);
    }, 950);

    return () => {
      fadeTo(0, 700, () => {
        audio.pause();
        audio.currentTime = 0;
      });
      if (interval) window.clearInterval(interval);
    };
  }, [data.musicSrc, isOpen]);

  const modal = (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[90] overflow-y-auto bg-[#090806]/86 px-3 py-4 text-pearl backdrop-blur-xl md:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <audio ref={audioRef} src={data.musicSrc} preload="metadata" loop playsInline />
          <button
            type="button"
            onClick={onClose}
            className="fixed right-4 top-4 z-[95] grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/45 text-white shadow-xl backdrop-blur transition hover:bg-white hover:text-night"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>

          <div ref={sceneRef} className="mx-auto grid min-h-[calc(100svh-2rem)] max-w-[1500px] items-start gap-5 py-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-7">
            <div className="product-stage relative min-w-0 rounded-[2rem] border border-white/10 shadow-[0_45px_160px_rgba(0,0,0,.58)]">
              <ProductTable config={config}>
                <div className="relative p-3 md:p-5 xl:p-7">
                  <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-1 md:mb-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: config.palette.gold }}>
                        Luxury product showcase
                      </p>
                      <h2 className="mt-2 font-display text-3xl leading-none text-pearl md:text-4xl">{config.label}</h2>
                    </div>
                    <p className="max-w-md text-xs leading-6 text-pearl/62 md:text-sm">
                      Full-object view with the opening motion scaled to fit your screen.
                    </p>
                  </div>

                  <div
                    ref={viewportRef}
                    className="showcase-viewport relative h-[clamp(390px,70svh,680px)] overflow-hidden rounded-[1.8rem] border border-white/12 bg-black/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)] sm:h-[clamp(430px,70svh,680px)]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_44%_26%,rgba(255,255,255,.28),transparent_34%),radial-gradient(circle_at_64%_72%,rgba(0,0,0,.16),transparent_40%)]" />
                    <div
                      className="absolute left-1/2 top-1/2"
                      style={{
                        width: SHOWCASE_WIDTH,
                        height: SHOWCASE_HEIGHT,
                        transform: `translate(-50%, -50%) scale(${scale})`,
                        transformOrigin: "50% 50%"
                      }}
                    >
                      <MechanismScene config={config} initials={initials} data={data} />
                    </div>
                  </div>
                </div>
              </ProductTable>
            </div>
            <ProductNotes config={config} data={data} />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return isMounted ? createPortal(modal, document.body) : null;
}

function useShowcaseScale(active: boolean) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!active || !viewport) return;

    const updateScale = () => {
      const bounds = viewport.getBoundingClientRect();
      const paddedWidth = Math.max(320, bounds.width - 28);
      const paddedHeight = Math.max(280, bounds.height - 28);
      setScale(Number(Math.min(1, paddedWidth / SHOWCASE_WIDTH, paddedHeight / SHOWCASE_HEIGHT).toFixed(4)));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(viewport);
    window.addEventListener("resize", updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [active]);

  return { viewportRef, scale };
}

function ProductTable({ config, children }: { config: TemplatePreviewConfig; children: ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-[2rem]"
      style={{
        background:
          `radial-gradient(circle at 24% 12%, rgba(255,255,255,.38), transparent 28%),
           radial-gradient(circle at 78% 18%, ${config.palette.gold}30, transparent 24%),
           linear-gradient(135deg, ${config.palette.scene}, ${config.palette.accent}55)`
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(90deg,rgba(255,255,255,.45)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="pointer-events-none absolute -left-28 top-0 h-[120%] w-72 rotate-12 bg-white/18 blur-2xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,.22),transparent_34%,rgba(0,0,0,.12)_70%)]" />
      {children}
    </div>
  );
}

function animatePhysicalObject(tl: gsap.core.Timeline, mechanism: TemplateMechanism) {
  if (mechanism === "acrylic-slide") {
    tl.fromTo(".material-stack", { y: 24, rotate: -5 }, { y: 0, rotate: -4, duration: 0.75 })
      .to(".foil-clasp", { scale: 0.9, rotate: 8, duration: 0.32 })
      .to(".foil-clasp", { opacity: 0, scale: 0, duration: 0.34 })
      .to(".wax-shard", { opacity: 1, scale: 1, x: "random(-34,34)", y: "random(-24,24)", rotate: "random(-32,32)", duration: 0.42, stagger: 0.025 }, "<")
      .to(".acrylic-panel", { opacity: 1, x: 112, y: -18, rotate: 3.4, duration: 1.15 }, "-=.08");
    return;
  }

  if (mechanism === "wax-scroll") {
    tl.fromTo(".scroll-roll", { rotate: -9, y: 28 }, { rotate: -7, y: 0, duration: 0.8 })
      .to(".ribbon-left", { x: -72, rotate: -18, duration: 0.76 })
      .to(".ribbon-right", { x: 76, rotate: 18, duration: 0.76 }, "<")
      .to(".wax-seal", { scale: 0.86, rotate: 7, duration: 0.34 }, "-=.55")
      .to(".wax-seal", { opacity: 0, scale: 0, duration: 0.34 })
      .to(".wax-shard", { opacity: 1, scale: 1, x: "random(-50,50)", y: "random(-38,28)", rotate: "random(-60,60)", duration: 0.48, stagger: 0.03 }, "<")
      .to(".scroll-top", { y: -94, duration: 0.85 }, "-=.18")
      .to(".scroll-bottom", { y: 96, duration: 0.85 }, "<")
      .fromTo(".scroll-sheet", { scaleY: 0.16, transformOrigin: "50% 50%" }, { opacity: 1, scaleY: 1, duration: 1.18 }, "-=.42");
    return;
  }

  if (mechanism === "floral-aisle") {
    tl.fromTo(".floral-photo-card", { y: 34, scale: 0.96 }, { y: 0, scale: 1, duration: 0.82 })
      .to(".floral-gate", { scale: 1.03, duration: 1.05 })
      .to(".wax-seal", { opacity: 0, scale: 0, duration: 0.36 }, "-=.65")
      .to(".reveal-card", { opacity: 1, y: -34, rotate: 0, duration: 1.02 }, "-=.2")
      .to(".loose-flower", { opacity: 1, y: "random(-30,-10)", rotate: "random(-12,12)", duration: 0.9, stagger: 0.035 }, "-=.75");
    return;
  }

  if (mechanism === "royal-scroll") {
    tl.fromTo(".scroll-box", { y: 26, rotate: -2 }, { y: 0, rotate: -2, duration: 0.82 })
      .to(".scroll-top", { y: -104, duration: 0.88 })
      .to(".scroll-bottom", { y: 108, duration: 0.88 }, "<")
      .fromTo(".scroll-sheet", { scaleY: 0.2, transformOrigin: "50% 50%" }, { opacity: 1, scaleY: 1, duration: 1.15 }, "-=.55")
      .to(".ribbon-left", { x: -64, y: -16, rotate: -16, duration: 0.7 }, "-=.75")
      .to(".ribbon-right", { x: 68, y: -16, rotate: 16, duration: 0.7 }, "<");
    return;
  }

  if (mechanism === "message-bottle") {
    tl.fromTo(".glass-bottle", { y: 28, rotate: -4 }, { y: 0, rotate: -3, duration: 0.82 })
      .to(".bottle-cork", { y: -54, rotate: 18, duration: 0.62 })
      .to(".tag-string", { rotate: -12, x: -18, duration: 0.72 }, "-=.45")
      .to(".bottle-scroll", { opacity: 1, y: -78, rotate: 5, duration: 1.05 }, "-=.18");
    return;
  }

  if (mechanism === "gate-fold") {
    tl.fromTo(".gate-product", { y: 22, rotate: -4 }, { y: 0, rotate: -4, duration: 0.75 })
      .to(".wax-seal", { scale: 0.84, opacity: 0, duration: 0.38 })
      .to(".wax-shard", { opacity: 1, scale: 1, x: "random(-44,44)", y: "random(-28,28)", rotate: "random(-45,45)", duration: 0.42, stagger: 0.025 }, "<")
      .to(".left-gate", { rotateY: -76, x: -22, duration: 1.15, transformOrigin: "0% 50%" }, "-=.12")
      .to(".right-gate", { rotateY: 76, x: 22, duration: 1.15, transformOrigin: "100% 50%" }, "<")
      .to(".reveal-card", { opacity: 1, y: -16, duration: 0.9 }, "-=.55");
    return;
  }

  if (mechanism === "velvet-book") {
    tl.fromTo(".velvet-book", { rotate: -4, y: 22 }, { rotate: -4, y: 0, duration: 0.8 })
      .to(".book-cover", { rotateY: -72, x: -28, duration: 1.15, transformOrigin: "0% 50%" })
      .to(".crest-lock", { opacity: 0, scale: 0.84, duration: 0.38 }, "-=.88")
      .to(".acrylic-panel", { opacity: 1, x: 76, y: -18, rotate: 3, duration: 1.08 }, "-=.42");
    return;
  }

  if (mechanism === "letterpress-fold") {
    tl.fromTo(".letterpress-suite", { y: 26, rotate: -3 }, { y: 0, rotate: -3, duration: 0.8 })
      .to(".envelope-flap", { rotateX: -86, y: -18, duration: 1.08, transformOrigin: "50% 0%" })
      .to(".wax-seal", { scale: 0.84, opacity: 0, duration: 0.36 }, "-=.82")
      .to(".wax-shard", { opacity: 1, scale: 1, x: "random(-36,36)", y: "random(-24,24)", rotate: "random(-38,38)", duration: 0.42, stagger: 0.025 }, "<")
      .to(".reveal-card", { opacity: 1, y: -42, duration: 1.05 }, "-=.3");
    return;
  }

  tl.fromTo(".noir-suite", { y: 24, rotate: -5 }, { y: 0, rotate: -5, duration: 0.8 })
    .to(".foil-clasp", { opacity: 0, scale: 0.82, duration: 0.34 })
    .to(".pocket-insert", { opacity: 1, x: 92, y: -28, rotate: 5, duration: 1.05 }, "-=.1")
    .to(".pocket-rsvp", { opacity: 1, x: -88, y: 48, rotate: -6, duration: 0.92 }, "-=.75");
}

function MechanismScene({ config, initials, data }: SceneProps) {
  const props = { config, initials, data };
  switch (config.mechanism) {
    case "acrylic-slide":
      return <MirrorAcrylicObject {...props} />;
    case "wax-scroll":
      return <BurgundyScrollObject {...props} />;
    case "floral-aisle":
      return <OceanFloralObject {...props} />;
    case "royal-scroll":
      return <RoyalScrollObject {...props} />;
    case "message-bottle":
      return <MessageBottleObject {...props} />;
    case "gate-fold":
      return <NavyGateObject {...props} />;
    case "velvet-book":
      return <EmeraldVelvetObject {...props} />;
    case "letterpress-fold":
      return <VintageLetterpressObject {...props} />;
    default:
      return <NoirGoldObject {...props} />;
  }
}

function MirrorAcrylicObject({ config, initials, data }: SceneProps) {
  return (
    <ObjectStage>
      <ObjectShadow className="left-[18%] top-[70%] h-24 w-[620px] -rotate-6" color={config.palette.shadow} />
      <BareBranches />
      <div className="material-stack absolute left-[17%] top-[14%] h-[510px] w-[360px] -rotate-6 rounded-[1.2rem] bg-[#f4f0e5] shadow-[0_24px_70px_rgba(58,48,34,.22)]">
        <FloralSleevePattern />
        <div className="absolute right-[-70px] top-16 h-[420px] w-[190px] rounded-xl border border-white/50 bg-[linear-gradient(135deg,#4f4a3b,#d7c486_32%,#6c6247_58%,#fff2b4_76%,#393326)] shadow-[0_18px_50px_rgba(0,0,0,.25)]" />
        <FoilMonogram className="foil-clasp absolute right-[-38px] top-[220px]" initials={initials} />
      </div>
      <AcrylicPanel className="acrylic-panel absolute left-[34%] top-[18%] h-[470px] w-[390px] -rotate-2" config={config} initials={initials} data={data} />
      <WaxFragments color={config.palette.gold} />
    </ObjectStage>
  );
}

function BurgundyScrollObject({ config, initials, data }: SceneProps) {
  return (
    <ObjectStage>
      <ObjectShadow className="left-[21%] top-[70%] h-24 w-[540px] -rotate-[15deg]" color={config.palette.shadow} />
      <GlassBox className="absolute left-[52%] top-[8%] h-[520px] w-[270px] rotate-[17deg]" />
      <DriedFlorals className="absolute left-[17%] top-[18%] -rotate-[23deg]" />
      <div className="scroll-roll absolute left-[23%] top-[16%] h-[520px] w-[300px] rounded-[9rem] bg-[#78182c] shadow-[0_38px_90px_rgba(48,11,21,.38)]">
        <div className="scroll-top absolute left-8 right-8 top-8 h-8 rounded-full bg-[#9b2c45] shadow-inner" />
        <div className="scroll-bottom absolute bottom-8 left-8 right-8 h-8 rounded-full bg-[#561224] shadow-inner" />
        <Grooves />
        <Ribbon className="ribbon-left left-[-72px] top-[250px] w-[225px] rotate-2" color="#b88b54" />
        <Ribbon className="ribbon-right right-[-78px] top-[250px] w-[235px] -rotate-2" color="#b88b54" />
        <ScrollSheet className="scroll-sheet absolute left-1/2 top-1/2 h-[430px] w-[270px] -translate-x-1/2 -translate-y-1/2" config={config} initials={initials} data={data} />
        <WaxSeal initials={initials} className="left-1/2 top-1/2" wax />
      </div>
      <WaxFragments color="#9d6033" />
    </ObjectStage>
  );
}

function OceanFloralObject({ config, initials, data }: SceneProps) {
  return (
    <ObjectStage>
      <ObjectShadow className="left-[16%] top-[73%] h-24 w-[610px]" color={config.palette.shadow} />
      <div className="floral-photo-card absolute left-[13%] top-[8%] h-[610px] w-[440px] rounded-[1.5rem] bg-[linear-gradient(to_bottom,#cdd6d7,#f7edda_44%,#7f956b_84%)] shadow-[0_36px_90px_rgba(60,74,62,.26)]">
        <PalmSilhouettes />
        <div className="floral-gate absolute left-1/2 top-[23%] h-[315px] w-[78%] -translate-x-1/2 rounded-t-full border-[28px] border-white/85 shadow-[0_0_0_14px_rgba(255,255,255,.25)]" />
        <div className="absolute bottom-[24%] left-1/2 h-64 w-20 -translate-x-1/2 bg-white/70 [clip-path:polygon(45%_0,55%_0,100%_100%,0_100%)]" />
        {Array.from({ length: 26 }).map((_, index) => (
          <span key={index} className="loose-flower absolute h-4 w-4 rounded-full bg-white shadow" style={{ left: `${10 + (index % 13) * 6.5}%`, top: `${50 + Math.floor(index / 13) * 18}%` }} />
        ))}
      </div>
      <PaperCard className="reveal-card absolute left-[45%] top-[29%] h-[380px] w-[300px]" config={config} initials={initials} data={data} />
      <WaxSeal initials={initials} className="left-[48%] top-[42%]" color="#f2ead8" textColor="#2e3b31" />
    </ObjectStage>
  );
}

function RoyalScrollObject({ config, initials, data }: SceneProps) {
  return (
    <ObjectStage>
      <ObjectShadow className="left-[16%] top-[74%] h-24 w-[660px] -rotate-1" color={config.palette.shadow} />
      <div className="scroll-box absolute left-[13%] top-[10%] h-[560px] w-[620px] rounded-[1.2rem] border border-[#8c6d43]/35 bg-[#d0beb1] shadow-[0_34px_90px_rgba(72,44,34,.3)]">
        <OrnateBoxBorder />
        <ScrollSheet className="scroll-sheet absolute left-1/2 top-1/2 h-[390px] w-[410px] -translate-x-1/2 -translate-y-1/2 bg-[#b9958b]" config={config} initials={initials} data={data} />
        <GoldRod className="scroll-top left-[86px] top-[112px] w-[450px]" />
        <GoldRod className="scroll-bottom bottom-[112px] left-[86px] w-[450px]" />
        <Ribbon className="ribbon-left left-[245px] top-[62px] w-[120px] rotate-[20deg]" color="#d3b8a7" />
        <Ribbon className="ribbon-right left-[310px] top-[62px] w-[120px] -rotate-[20deg]" color="#d3b8a7" />
      </div>
    </ObjectStage>
  );
}

function MessageBottleObject({ config, initials, data }: SceneProps) {
  return (
    <ObjectStage>
      <ObjectShadow className="left-[22%] top-[75%] h-24 w-[410px] -rotate-2" color={config.palette.shadow} />
      <div className="glass-bottle absolute left-[27%] top-[9%] h-[590px] w-[210px] -rotate-3 rounded-[5rem] border border-white/65 bg-white/20 shadow-[inset_20px_0_45px_rgba(255,255,255,.34),inset_-18px_0_35px_rgba(0,0,0,.12),0_34px_90px_rgba(44,37,29,.25)] backdrop-blur">
        <div className="bottle-cork absolute left-1/2 top-3 h-24 w-16 -translate-x-1/2 rounded-xl bg-[linear-gradient(90deg,#5b3d22,#9b7043,#5f4227)]" />
        <div className="absolute bottom-7 left-8 right-8 h-16 rounded-[50%] bg-[#74634b]/65" />
        <div className="bottle-scroll absolute left-1/2 top-[150px] h-[360px] w-20 -translate-x-1/2 rounded-2xl bg-[#c79b62] shadow-[0_12px_24px_rgba(0,0,0,.18)]">
          <p className="mt-20 rotate-90 whitespace-nowrap text-center font-display text-5xl text-[#3a291b]">{initials}</p>
        </div>
      </div>
      <div className="tag-string absolute left-[36%] top-[130px] h-52 w-16 origin-top rotate-6 border-l border-[#7d613f]">
        <div className="mt-8 h-48 w-20 rounded-sm bg-[#d1b486] p-3 text-[10px] uppercase tracking-[0.18em] text-[#4d321d] shadow-xl [writing-mode:vertical-rl]">Domus Aurea</div>
      </div>
      <ShellAccent className="absolute left-[31%] top-[105px]" />
      <PaperCard className="absolute left-[49%] top-[25%] h-[360px] w-[280px] rotate-3" config={config} initials={initials} data={data} />
    </ObjectStage>
  );
}

function NavyGateObject({ config, initials, data }: SceneProps) {
  return (
    <ObjectStage wood>
      <ObjectShadow className="left-[15%] top-[72%] h-24 w-[660px] -rotate-6" color={config.palette.shadow} />
      <div className="gate-product absolute left-[15%] top-[15%] h-[510px] w-[640px] -rotate-3 [perspective:1400px]">
        <PaperCard className="reveal-card absolute left-[245px] top-[35px] h-[440px] w-[300px]" config={config} initials={initials} data={data} />
        <LaserGate className="left-gate left-[70px]" side="left" config={config} />
        <LaserGate className="right-gate left-[300px]" side="right" config={config} />
        <FoilMonogram className="foil-clasp absolute left-[268px] top-[218px]" initials={initials} ornate />
        <WaxFragments color={config.palette.gold} />
      </div>
    </ObjectStage>
  );
}

function EmeraldVelvetObject({ config, initials, data }: SceneProps) {
  return (
    <ObjectStage>
      <ObjectShadow className="left-[18%] top-[75%] h-24 w-[620px] -rotate-3" color={config.palette.shadow} />
      <div className="velvet-book absolute left-[18%] top-[12%] h-[540px] w-[540px] -rotate-3 [perspective:1500px]">
        <div className="absolute inset-0 rounded-[1.7rem] bg-[#06351f] shadow-[0_36px_95px_rgba(2,20,13,.36)]" />
        <AcrylicPanel className="acrylic-panel absolute left-[210px] top-[62px] h-[410px] w-[300px]" config={config} initials={initials} data={data} dark />
        <div className="book-cover absolute left-0 top-0 h-full w-[310px] rounded-l-[1.7rem] bg-[radial-gradient(circle_at_30%_18%,#0b4b2d,#052b1a)] shadow-[inset_0_0_45px_rgba(255,255,255,.06),0_22px_70px_rgba(0,0,0,.25)]">
          <div className="absolute inset-10 rounded-[1.2rem] border border-[#d8bd74]/38" />
          <CrestLock className="crest-lock absolute left-[96px] top-[205px]" initials={initials} />
        </div>
        <CornerPocket className="right-7 top-8" />
        <CornerPocket className="bottom-8 right-7 rotate-180" />
      </div>
    </ObjectStage>
  );
}

function VintageLetterpressObject({ config, initials, data }: SceneProps) {
  return (
    <ObjectStage fabric>
      <ObjectShadow className="left-[18%] top-[74%] h-24 w-[620px] -rotate-5" color={config.palette.shadow} />
      <SunlightStripes />
      <div className="letterpress-suite absolute left-[18%] top-[10%] h-[570px] w-[520px] -rotate-3 [perspective:1400px]">
        <PaperCard className="reveal-card absolute left-[70px] top-[25px] h-[515px] w-[360px]" config={config} initials={initials} data={data} floral />
        <div className="absolute bottom-0 right-0 h-[370px] w-[380px] bg-[#596a45] shadow-[0_28px_70px_rgba(69,55,39,.28)]" />
        <div className="envelope-flap absolute bottom-[215px] right-0 h-[270px] w-[380px] origin-top bg-[#596a45] shadow-xl [clip-path:polygon(0_0,100%_0,100%_100%,0_40%)]" />
        <WaxSeal initials={initials} className="left-[215px] top-[360px]" color="#eee7d7" textColor="#8b7350" />
        <WaxFragments color="#eee7d7" />
      </div>
    </ObjectStage>
  );
}

function NoirGoldObject({ config, initials, data }: SceneProps) {
  return (
    <ObjectStage>
      <ObjectShadow className="left-[14%] top-[74%] h-24 w-[660px] -rotate-6" color={config.palette.shadow} />
      <div className="noir-suite absolute left-[13%] top-[13%] h-[550px] w-[660px] -rotate-3">
        <div className="absolute left-0 top-2 h-[130px] w-[310px] rounded-sm bg-[#090909] shadow-[0_18px_45px_rgba(0,0,0,.32)]">
          <FoilMonogram className="foil-clasp absolute left-[120px] top-[38px]" initials={initials} />
        </div>
        <div className="absolute bottom-0 left-[70px] h-[440px] w-[500px] rounded-sm bg-[#080808] shadow-[0_34px_90px_rgba(0,0,0,.42)]">
          <div className="absolute inset-x-0 bottom-0 h-48 bg-[#111]" />
        </div>
        <PaperCard className="pocket-insert absolute left-[220px] top-[92px] h-[390px] w-[300px]" config={config} initials={initials} data={data} inkWash />
        <div className="pocket-rsvp absolute left-[95px] top-[190px] h-[320px] w-[150px] rounded-sm bg-[#f5f2ea] p-4 text-[#111] shadow-[0_16px_42px_rgba(0,0,0,.24)]">
          <p className="font-display text-3xl text-[#d0a24a]">RSVP</p>
          <div className="mt-10 h-24 rounded-lg border border-black/15" />
          <p className="mt-5 text-[10px] uppercase tracking-[0.2em]">guest card</p>
        </div>
      </div>
    </ObjectStage>
  );
}

function ObjectStage({ children, wood = false, fabric = false }: { children: ReactNode; wood?: boolean; fabric?: boolean }) {
  let background = "linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,.05))";
  if (wood) background = "linear-gradient(135deg,#d9bd90,#b78953 48%,#e2c69a)";
  if (fabric) background = "linear-gradient(135deg,#ded3bd,#c9b99a)";

  return (
    <div className="relative h-full w-full overflow-visible rounded-[1.7rem]" style={{ background }}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(120deg,rgba(255,255,255,.55)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="pointer-events-none absolute left-[-12%] top-[-18%] h-[58%] w-[80%] rotate-[-18deg] bg-white/26 blur-2xl" />
      {children}
    </div>
  );
}

function PaperCard({ config, initials, data, className = "", floral = false, inkWash = false }: SceneProps & { className?: string; floral?: boolean; inkWash?: boolean }) {
  return (
    <div className={`${className} relative rounded-sm border p-7 text-center shadow-[0_22px_65px_rgba(0,0,0,.2)]`} style={{ background: config.palette.paper, color: config.palette.ink, borderColor: `${config.palette.gold}77` }}>
      <PaperTexture />
      {inkWash ? <InkWash /> : null}
      {floral ? <FloralBorder color={config.palette.gold} /> : <FineBorder color={config.palette.gold} />}
      <InvitationText config={config} initials={initials} data={data} />
    </div>
  );
}

function AcrylicPanel({ config, initials, data, className = "", dark = false }: SceneProps & { className?: string; dark?: boolean }) {
  return (
    <div
      className={`${className} relative rounded-xl border p-7 text-center shadow-[0_25px_70px_rgba(0,0,0,.28)] backdrop-blur-md`}
      style={{
        background: dark
          ? "linear-gradient(135deg,rgba(10,45,34,.72),rgba(255,255,255,.12))"
          : "linear-gradient(135deg,rgba(255,255,255,.34),rgba(84,78,56,.28),rgba(255,244,190,.26))",
        borderColor: "rgba(255,255,255,.55)",
        color: dark ? "#f5e8c1" : config.palette.ink
      }}
    >
      <div className="absolute inset-0 rounded-xl bg-[linear-gradient(118deg,transparent_18%,rgba(255,255,255,.5)_42%,transparent_58%)] opacity-80" />
      <div className="absolute inset-5 rounded-lg border" style={{ borderColor: `${config.palette.gold}88` }} />
      <InvitationText config={config} initials={initials} data={data} />
    </div>
  );
}

function ScrollSheet({ config, initials, data, className = "" }: SceneProps & { className?: string }) {
  return (
    <div className={`${className} rounded-sm border p-6 text-center shadow-xl`} style={{ background: config.palette.paper, color: config.palette.ink, borderColor: `${config.palette.gold}66` }}>
      <PaperTexture />
      <InvitationText config={config} initials={initials} data={data} />
    </div>
  );
}

function InvitationText({ config, initials, data }: SceneProps) {
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.26em]" style={{ color: config.palette.gold }}>Domus Aurea</p>
      <p className="mt-5 font-display text-6xl leading-none" style={{ color: config.palette.gold }}>{initials}</p>
      <h3 className="mt-7 font-display text-4xl leading-tight">
        {data.brideName}
        <span className="block text-2xl">&</span>
        {data.groomName}
      </h3>
      <div className="my-6 h-px w-28" style={{ background: config.palette.gold }} />
      <p className="text-xs uppercase tracking-[0.18em]" style={{ color: config.palette.muted }}>{data.date}</p>
      <p className="mt-4 text-sm leading-6" style={{ color: config.palette.muted }}>{data.venue}</p>
    </div>
  );
}

function ProductNotes({ config, data }: { config: TemplatePreviewConfig; data: TemplatePreviewSample }) {
  return (
    <div className="relative rounded-[1.6rem] border border-white/12 bg-black/28 p-5 shadow-[0_24px_80px_rgba(0,0,0,.24)] backdrop-blur-xl md:p-6">
      <p className="object-note text-xs font-bold uppercase tracking-[0.26em]" style={{ color: config.palette.gold }}>
        Physical product reveal
      </p>
      <h2 className="object-note mt-4 font-display text-4xl leading-tight">{config.label}</h2>
      <p className="object-note mt-4 text-sm leading-7 text-pearl/70">
        {config.analysis.details} Materials: {config.analysis.palette}. The animation moves the physical object parts, not a website transition.
      </p>
      <div className="object-date mt-5 grid gap-3">
        <InfoLine icon={<CalendarDays className="h-4 w-4" />} label={data.date} color={config.palette.gold} />
        <InfoLine icon={<MapPin className="h-4 w-4" />} label={data.venue} color={config.palette.gold} />
      </div>
      <div className="object-rsvp mt-5 rounded-[1.25rem] border border-white/12 bg-white/[0.06] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: config.palette.gold }}>RSVP card preview</p>
        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-pearl/60">Guest name</div>
          <button type="button" className="rounded-2xl px-5 py-3 text-sm font-bold text-night" style={{ background: config.palette.gold }}>
            <Send className="mr-2 inline h-4 w-4" />
            Accept invitation
          </button>
        </div>
      </div>
    </div>
  );
}

function ObjectShadow({ className, color }: { className: string; color: string }) {
  return <div className={`absolute rounded-full blur-2xl ${className}`} style={{ background: color }} />;
}

function PaperTexture() {
  return <div className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:radial-gradient(circle_at_30%_20%,#000_1px,transparent_1px)] [background-size:9px_9px]" />;
}

function FineBorder({ color }: { color: string }) {
  return <div className="absolute inset-5 border" style={{ borderColor: `${color}88` }} />;
}

function FloralBorder({ color }: { color: string }) {
  return (
    <svg className="absolute inset-5 h-[calc(100%-2.5rem)] w-[calc(100%-2.5rem)]" viewBox="0 0 300 430" aria-hidden="true">
      <rect x="5" y="5" width="290" height="420" fill="none" stroke={color} strokeOpacity=".55" />
      {[0, 1].map((side) => (
        <g key={side} transform={side ? "translate(300 0) scale(-1 1)" : undefined} fill="none" stroke={color} strokeOpacity=".62" strokeWidth="1.2">
          {Array.from({ length: 7 }).map((_, index) => (
            <path key={index} d={`M26 ${42 + index * 50} C62 ${30 + index * 50}, 72 ${58 + index * 50}, 44 ${76 + index * 50}`} />
          ))}
        </g>
      ))}
    </svg>
  );
}

function InkWash() {
  return <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_20%_10%,#111,transparent_32%),radial-gradient(circle_at_80%_0%,#111,transparent_38%)] opacity-85" />;
}

function WaxSeal({ initials, className, wax = false, color, textColor }: { initials: string; className: string; wax?: boolean; color?: string; textColor?: string }) {
  const background = color ?? (wax ? "radial-gradient(circle at 28% 22%, #d5a46b, #9b6033 42%, #5d2217 78%)" : "radial-gradient(circle at 28% 22%, #e6c27b, #b3833f 48%, #6c421e)");
  return (
    <div className={`absolute z-30 -translate-x-1/2 -translate-y-1/2 ${className}`}>
      <div className="wax-seal relative grid h-24 w-24 place-items-center rounded-full text-3xl font-black shadow-[0_16px_42px_rgba(0,0,0,.32)]" style={{ background, color: textColor ?? (wax ? "#4a1b12" : "#3a2815") }}>
        <span className="font-display">{initials}</span>
        <span className="absolute inset-3 rounded-full border border-current opacity-30" />
        <span className="absolute inset-0 rounded-full border-[7px] border-black/5" />
      </div>
    </div>
  );
}

function WaxFragments({ color }: { color: string }) {
  return (
    <>
      {Array.from({ length: 9 }).map((_, index) => (
        <span key={index} className="wax-shard absolute left-1/2 top-1/2 z-20 h-3 w-5 rounded-full" style={{ background: color }} />
      ))}
    </>
  );
}

function Ribbon({ className, color }: { className: string; color: string }) {
  return <div className={`absolute h-3 rounded-full shadow-md ${className}`} style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />;
}

function GoldRod({ className }: { className: string }) {
  return <div className={`absolute h-8 rounded-full bg-gradient-to-r from-[#84643a] via-[#e5c779] to-[#8a6538] shadow-xl ${className}`} />;
}

function FoilMonogram({ initials, className, ornate = false }: { initials: string; className: string; ornate?: boolean }) {
  return (
    <div className={`${className} grid h-24 w-24 place-items-center rounded-full text-4xl font-black text-[#2a1a08] shadow-[0_14px_34px_rgba(0,0,0,.28)]`} style={{ background: "linear-gradient(135deg,#8a612a,#f6d985,#a6772e)" }}>
      <span className="font-display">{initials}</span>
      {ornate ? <span className="absolute inset-2 rounded-full border border-[#2a1a08]/30" /> : null}
    </div>
  );
}

function Grooves() {
  return (
    <>
      <div className="absolute inset-y-6 left-10 w-px bg-white/12" />
      <div className="absolute inset-y-6 left-20 w-px bg-black/14" />
      <div className="absolute inset-y-6 right-12 w-px bg-white/10" />
    </>
  );
}

function FloralSleevePattern() {
  return (
    <svg className="absolute inset-0 h-full w-full p-7" viewBox="0 0 280 460" aria-hidden="true">
      <g fill="none" stroke="#6f685f" strokeOpacity=".55" strokeWidth="1.2">
        {Array.from({ length: 10 }).map((_, index) => (
          <g key={index} transform={`translate(${28 + (index % 2) * 145} ${26 + index * 42}) rotate(${index % 2 ? -14 : 12})`}>
            <circle cx="25" cy="25" r="20" />
            <path d="M5 25 C20 8 30 8 45 25 C30 42 20 42 5 25Z" />
            <path d="M53 22 q26 -18 48 7 q-28 8 -48 -7Z" />
          </g>
        ))}
      </g>
    </svg>
  );
}

function BareBranches() {
  return (
    <svg className="absolute left-0 top-0 h-56 w-[460px] opacity-45" viewBox="0 0 460 220" aria-hidden="true">
      <g fill="none" stroke="#4a382f" strokeWidth="1.2">
        <path d="M0 55 C120 38 180 80 260 20 C310 0 380 22 460 4" />
        {Array.from({ length: 18 }).map((_, index) => (
          <path key={index} d={`M${20 + index * 24} ${52 + (index % 3) * 8} q${20 + (index % 2) * 16} -${38 + (index % 4) * 8} ${54 + (index % 2) * 12} -${42 + (index % 3) * 12}`} />
        ))}
      </g>
    </svg>
  );
}

function GlassBox({ className }: { className: string }) {
  return (
    <div className={`${className} border-4 border-[#9b7842]/70 bg-white/12 shadow-[inset_0_0_28px_rgba(255,255,255,.24),0_28px_80px_rgba(0,0,0,.2)] backdrop-blur-sm`}>
      <div className="absolute inset-4 border border-white/35" />
    </div>
  );
}

function DriedFlorals({ className }: { className: string }) {
  return (
    <svg className={`${className} h-64 w-56`} viewBox="0 0 220 260" aria-hidden="true">
      <g fill="none" stroke="#8b7349" strokeWidth="1">
        {Array.from({ length: 9 }).map((_, index) => (
          <path key={index} d={`M110 245 C${70 + index * 9} ${170 - index * 12}, ${40 + index * 12} ${110 - index * 7}, ${42 + index * 17} ${40 + index * 8}`} />
        ))}
      </g>
      <g fill="#ede5cf">
        {Array.from({ length: 18 }).map((_, index) => (
          <circle key={index} cx={36 + (index % 6) * 28} cy={36 + Math.floor(index / 6) * 30} r={5 + (index % 3)} opacity=".78" />
        ))}
      </g>
    </svg>
  );
}

function PalmSilhouettes() {
  return (
    <svg className="absolute inset-x-0 top-0 h-40 w-full opacity-65" viewBox="0 0 420 150" aria-hidden="true">
      <g fill="none" stroke="#172018" strokeWidth="3">
        <path d="M28 0 C80 24 126 20 190 54" />
        <path d="M390 0 C340 42 310 48 255 80" />
        {Array.from({ length: 16 }).map((_, index) => (
          <path key={index} d={`M${index < 8 ? 58 : 360} ${index < 8 ? 12 + index * 3 : 10 + (index - 8) * 5} q${index < 8 ? 50 : -54} ${20 + index * 2} ${index < 8 ? 96 : -96} ${36 + index * 2}`} />
        ))}
      </g>
    </svg>
  );
}

function OrnateBoxBorder() {
  return (
    <svg className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)]" viewBox="0 0 600 520" aria-hidden="true">
      <rect x="12" y="12" width="576" height="496" fill="none" stroke="#8c6d43" strokeOpacity=".45" />
      <g fill="none" stroke="#8c6d43" strokeOpacity=".65" strokeWidth="1.4">
        <path d="M32 42 C92 12 132 16 182 42" />
        <path d="M568 42 C508 12 468 16 418 42" />
        <path d="M32 478 C92 508 132 504 182 478" />
        <path d="M568 478 C508 508 468 504 418 478" />
      </g>
    </svg>
  );
}

function ShellAccent({ className }: { className: string }) {
  return <div className={`${className} h-12 w-16 rounded-[50%] bg-[radial-gradient(circle_at_35%_28%,#fff7dd,#d8a36e_56%,#8d5d39)] shadow-xl`} />;
}

function LaserGate({ side, config, className }: { side: "left" | "right"; config: TemplatePreviewConfig; className: string }) {
  const radius = side === "left" ? "1.3rem 0 0 1.3rem" : "0 1.3rem 1.3rem 0";
  return (
    <div className={`${className} absolute top-0 h-[500px] w-[250px] overflow-hidden shadow-[0_24px_70px_rgba(4,10,22,.32)]`} style={{ background: config.palette.surface, borderRadius: radius }}>
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:14px_14px]" />
      {Array.from({ length: 10 }).map((_, index) => (
        <span key={index} className="absolute h-28 w-16 rounded-full border border-black/35" style={{ left: `${30 + (index % 2) * 95}px`, top: `${20 + index * 46}px` }} />
      ))}
      <div className="absolute inset-8 rounded-full border border-black/30" />
    </div>
  );
}

function CrestLock({ initials, className }: { initials: string; className: string }) {
  return (
    <div className={`${className} grid h-28 w-28 place-items-center rounded-full bg-[#f2e7bf] text-[#07351f] shadow-[0_18px_45px_rgba(0,0,0,.32)]`}>
      <span className="font-display text-4xl">{initials}</span>
      <span className="absolute inset-3 rounded-full border border-[#07351f]/25" />
    </div>
  );
}

function CornerPocket({ className }: { className: string }) {
  return <div className={`absolute h-28 w-28 border-b-[56px] border-r-[56px] border-b-[#052616] border-r-[#0b4a2e] ${className}`} />;
}

function SunlightStripes() {
  return <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(108deg,rgba(255,255,255,.24)_0_18px,transparent_18px_86px)] opacity-75" />;
}

function InfoLine({ icon, label, color }: { icon: ReactNode; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-pearl/76">
      <span style={{ color }}>{icon}</span>
      <span>{label}</span>
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
