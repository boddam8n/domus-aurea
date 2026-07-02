"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Heart, Home, Instagram, MapPin, MessageCircle, Music2, Send, UserRound } from "lucide-react";
import { invitationData, type InvitationLanguage, type LocalizedText } from "@/src/data/invitation";
import type { PublicInvitation } from "@/lib/invitations";

type RsvpChoice = "accepted" | "apologized";

type DateParts = {
  weekday: string;
  day: string;
  month: string;
  year: string;
  fullDate: string;
};

const assets = {
  introVideo: "/invitation/intro-opening.mp4",
  introPoster: "/invitation/closed-invitation.png",
  swanHeroVideo: "/invitation/swan-hero.mp4",
  swanHero: "/invitation/swan-hero.webp",
  paper: "/invitation/paper-bg.webp",
  sectionDivider: "/invitation/section-divider-floral.svg",
  locationPalace: "/invitation/location-palace.webp",
  petals: "/invitation/petals.svg",
  goldDivider: "/invitation/gold-divider.svg",
  ornament: "/invitation/ornament.svg"
};

const nameMap: Record<string, { ar: string; en: string }> = {
  أحمد: { ar: "أحمد", en: "Ahmed" },
  احمد: { ar: "أحمد", en: "Ahmed" },
  Ahmed: { ar: "أحمد", en: "Ahmed" },
  مايار: { ar: "مايار", en: "Mayar" },
  Mayar: { ar: "مايار", en: "Mayar" },
  بودي: { ar: "أحمد", en: "Ahmed" },
  bobi: { ar: "أحمد", en: "Ahmed" },
  يوري: { ar: "مايار", en: "Mayar" },
  yori: { ar: "مايار", en: "Mayar" }
};

const easing = [0.22, 1, 0.36, 1] as const;
const INTRO_VIDEO_START_TIME = 1.85;

function text(value: LocalizedText, language: InvitationLanguage) {
  return value[language];
}

function containsArabic(value: string) {
  return /[\u0600-\u06FF]/.test(value);
}

function localizeName(value: string | null | undefined, fallback: LocalizedText, language: InvitationLanguage) {
  const cleaned = (value || "").trim();
  if (!cleaned) return text(fallback, language);
  return nameMap[cleaned]?.[language] || cleaned;
}

function localizeExternalText(value: string | null | undefined, fallback: LocalizedText, language: InvitationLanguage) {
  const cleaned = (value || "").trim();
  if (!cleaned) return text(fallback, language);
  const isArabicValue = containsArabic(cleaned);
  if (language === "ar" && isArabicValue) return cleaned;
  if (language === "en" && !isArabicValue) return cleaned;
  return text(fallback, language);
}

function safeDate(value?: string | null) {
  const date = new Date(value || invitationData.wedding.dateISO);
  return Number.isFinite(date.getTime()) ? date : new Date(invitationData.wedding.dateISO);
}

function formatDateParts(value: string | null | undefined, language: InvitationLanguage): DateParts {
  const date = safeDate(value);
  const locale = language === "ar" ? "ar-EG" : "en-US";
  return {
    weekday: new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date),
    day: new Intl.DateTimeFormat(locale, { day: "numeric" }).format(date),
    month: new Intl.DateTimeFormat(locale, { month: "long" }).format(date),
    year: new Intl.DateTimeFormat(locale, { year: "numeric" }).format(date),
    fullDate:
      language === "ar"
        ? new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date)
        : new Intl.DateTimeFormat(locale, { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(date)
  };
}

function getRemaining(target: string) {
  const difference = Math.max(0, safeDate(target).getTime() - Date.now());
  const days = Math.floor(difference / 86_400_000);
  const hours = Math.floor((difference / 3_600_000) % 24);
  const minutes = Math.floor((difference / 60_000) % 60);
  const seconds = Math.floor((difference / 1_000) % 60);
  return [days, hours, minutes, seconds].map((value) => String(Number.isFinite(value) ? value : 0).padStart(2, "0"));
}

function getMapUrl(invitation: PublicInvitation) {
  if (invitation.venue_lat && invitation.venue_lng) {
    return `https://maps.google.com/?q=${invitation.venue_lat},${invitation.venue_lng}`;
  }
  return invitationData.venue.mapUrl;
}

export function InvitationExperience({ invitation }: { invitation: PublicInvitation }) {
  const reduceMotion = useReducedMotion();
  const [language, setLanguage] = useState<InvitationLanguage>(invitationData.languageDefault);
  const [intro, setIntro] = useState<"show" | "done">("show");
  const isArabic = language === "ar";
  const copy = invitationData.copy[language];
  const groomName = localizeName(invitation.groom_name, invitationData.couple.groom, language);
  const brideName = localizeName(invitation.bride_name, invitationData.couple.bride, language);
  const dateParts = useMemo(() => formatDateParts(invitation.wedding_date, language), [invitation.wedding_date, language]);
  const venueName = localizeExternalText(invitation.venue, invitationData.venue.name, language);
  const venueAddress = localizeExternalText(invitation.venue_address, invitationData.venue.address, language);
  const mapUrl = getMapUrl(invitation);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("resetInvite") === "true") window.localStorage.removeItem("invitationOpened");
    const hasOpened = window.localStorage.getItem("invitationOpened") === "true";
    setIntro(hasOpened ? "done" : "show");
  }, []);

  useEffect(() => {
    if (intro !== "show") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [intro]);

  useEffect(() => {
    if (invitation.id === "demo") return;
    fetch(`/api/invitations/${invitation.slug}/view`, { method: "POST" }).catch(() => undefined);
  }, [invitation.id, invitation.slug]);

  useEffect(() => {
    const preventMediaAction = (event: Event) => {
      const target = event.target as Element | null;
      if (target?.closest("img, video, svg")) event.preventDefault();
    };
    document.addEventListener("contextmenu", preventMediaAction);
    document.addEventListener("dragstart", preventMediaAction);
    return () => {
      document.removeEventListener("contextmenu", preventMediaAction);
      document.removeEventListener("dragstart", preventMediaAction);
    };
  }, []);

  const finishIntro = () => {
    window.localStorage.setItem("invitationOpened", "true");
    setIntro("done");
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className="relative min-h-screen overflow-x-hidden bg-[#f8ddd5] text-[#6f4d38] [color-scheme:light]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,#fff8f1_0,#f9e5dc_38%,#f8ddd5_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-[.55]" style={{ backgroundImage: `url(${assets.paper})`, backgroundSize: "cover", backgroundPosition: "center top" }} />
      <div className="fixed inset-0 -z-10 hidden bg-[#f8ddd5] opacity-45 blur-2xl md:block" style={{ backgroundImage: `url(${assets.swanHero})`, backgroundSize: "cover", backgroundPosition: "center top" }} />
      <div className="fixed inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgba(248,221,213,.96),rgba(255,248,241,.34)_50%,rgba(248,221,213,.96))] md:block" />
      <FloatingPetals />
      <LanguageSwitcher language={language} onChange={setLanguage} />

      <main
        className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#fff4ef] opacity-100 shadow-[0_0_80px_rgba(111,77,56,.16)] md:my-8 md:min-h-[calc(100vh-4rem)] md:max-w-[480px] md:rounded-[2rem] md:border md:border-[#d7b48c]/35 md:shadow-[0_24px_110px_rgba(111,77,56,.22)]"
      >
        <SwanHeroSection language={language} groomName={groomName} brideName={brideName} />
        <SectionDivider />
        <VenueSection language={language} />
        <SectionDivider />
        <CountdownSection language={language} target={invitation.wedding_date || invitationData.wedding.dateISO} />
        <SectionDivider compact />
        <WeddingTimeSection language={language} />
        <SectionDivider compact />
        <LocationSection language={language} venueName={venueName} venueAddress={venueAddress} mapUrl={mapUrl} />
        <SectionDivider />
        <RSVPSection invitation={invitation} language={language} />
        <SectionDivider compact />
        <FooterSection language={language} />
      </main>

      <AnimatePresence>
        {intro === "show" ? <IntroVideo key="intro" language={language} onComplete={finishIntro} /> : null}
      </AnimatePresence>
    </section>
  );
}

function IntroVideo({ language, onComplete }: { language: InvitationLanguage; onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const openingRequestedRef = useRef(false);
  const queuedOpeningRef = useRef(false);
  const [phase, setPhase] = useState<"closed" | "playing">("closed");
  const [isFading, setIsFading] = useState(false);
  const [posterReady, setPosterReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const copy = invitationData.copy[language];
  const openLabel = language === "ar" ? "اضغط على الختم لفتح الدعوة" : "Tap the seal to open the invitation";
  const canOpen = phase === "closed" && videoReady && !isFading;

  const finish = () => {
    if (isFading) return;
    setIsFading(true);
    window.setTimeout(onComplete, 700);
  };

  const playOpeningVideo = useCallback(() => {
    if (phase !== "closed" || isFading || openingRequestedRef.current) return;
    const video = videoRef.current;
    if (!video) {
      return;
    }
    openingRequestedRef.current = true;
    queuedOpeningRef.current = false;
    video.currentTime = INTRO_VIDEO_START_TIME;
    const revealVideo = () => setPhase("playing");
    video.addEventListener("playing", revealVideo, { once: true });
    const playPromise = video.play();
    if (playPromise) {
      playPromise
        .then(() => window.setTimeout(revealVideo, 40))
        .catch(() => {
          openingRequestedRef.current = false;
          queuedOpeningRef.current = true;
          video.removeEventListener("playing", revealVideo);
          video.load();
        });
    } else {
      revealVideo();
    }
  }, [isFading, phase]);

  const startOpening = (event?: { preventDefault?: () => void; stopPropagation?: () => void }) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    if (phase !== "closed" || isFading || openingRequestedRef.current) return;
    if (!videoReady) {
      queuedOpeningRef.current = true;
      videoRef.current?.load();
      return;
    }
    playOpeningVideo();
  };

  useEffect(() => {
    if (phase !== "playing") return;
    const fallbackTimer = window.setTimeout(finish, 4500);
    return () => window.clearTimeout(fallbackTimer);
  }, [phase]);

  useEffect(() => {
    if (videoReady) return;
    const video = videoRef.current;
    if (!video) return;
    const syncVideoReady = () => {
      if (video.readyState >= 1) setVideoReady(true);
    };
    video.load();
    syncVideoReady();
    const timer = window.setInterval(syncVideoReady, 250);
    return () => window.clearInterval(timer);
  }, [videoReady]);

  useEffect(() => {
    if (!videoReady || !queuedOpeningRef.current || phase !== "closed" || isFading) return;
    playOpeningVideo();
  }, [isFading, phase, playOpeningVideo, videoReady]);

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[80] grid h-[100dvh] min-h-[100svh] place-items-center overflow-hidden bg-[#f8ddd5]"
      initial={{ opacity: 1 }}
      animate={{ opacity: isFading ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: easing }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,#fff9f4_0,#f8ddd5_50%,#eec8bd_100%)]" />
      <div className="relative flex h-[100dvh] min-h-[100svh] w-full max-w-[430px] items-center justify-center overflow-hidden bg-[#fff4ef] shadow-[0_0_80px_rgba(111,77,56,.28)] md:h-[calc(100dvh-4rem)] md:min-h-[calc(100svh-4rem)] md:max-w-[480px] md:rounded-[2rem] md:border md:border-[#d7b48c]/35">
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full select-none object-contain transition-opacity duration-500 ${phase === "playing" ? "opacity-100" : "opacity-0"}`}
          src={assets.introVideo}
          poster={assets.introPoster}
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => setVideoReady(true)}
          onEnded={finish}
          onError={() => setVideoReady(true)}
        />
        <AnimatePresence>
          {phase === "closed" ? (
            <motion.div
              key="closed-invitation"
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.012 }}
              transition={{ duration: 0.75, ease: easing }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#fff8f1_0%,#f8ddd5_52%,#e9beb1_100%)]" />
              <Image
                src={assets.introPoster}
                alt=""
                fill
                priority
                sizes="430px"
                draggable={false}
                className={`select-none object-contain transition-opacity duration-500 ${posterReady ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setPosterReady(true)}
                onError={() => setPosterReady(true)}
              />
              <button
                type="button"
                onClick={startOpening}
                onMouseDown={startOpening}
                onPointerDown={startOpening}
                onPointerUp={startOpening}
                onTouchStart={startOpening}
                onTouchEnd={startOpening}
                aria-label={openLabel}
                aria-disabled={!canOpen}
                className={`absolute inset-0 z-20 touch-manipulation outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c99b65] ${
                  canOpen ? "cursor-pointer opacity-100" : "cursor-default opacity-70"
                }`}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5.1rem)] px-5 text-center">
                <p
                  className={`text-[11px] font-medium tracking-[.08em] text-[#8a6240]/72 drop-shadow-[0_1px_0_rgba(255,248,241,.8)] transition-opacity duration-500 ${
                    canOpen ? "opacity-100" : "opacity-45"
                  } ${language === "ar" ? "arabic-body" : "serif-text"}`}
                >
                  {openLabel}
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(248,221,213,.04),rgba(71,44,29,.08))]" />
        <button
          type="button"
          onClick={finish}
          className="absolute bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-1/2 z-30 -translate-x-1/2 rounded-full border border-[#b98b5f]/45 bg-[#fff8f1]/76 px-4 py-2 text-xs font-semibold text-[#8a6240] shadow-[0_14px_32px_rgba(111,77,56,.18)] backdrop-blur-md"
        >
          {copy.introSkip}
        </button>
      </div>
    </motion.div>
  );
}

function LanguageSwitcher({ language, onChange }: { language: InvitationLanguage; onChange: (language: InvitationLanguage) => void }) {
  return (
    <div className="fixed left-3 top-[calc(env(safe-area-inset-top)+.75rem)] z-[70] rounded-full border border-[#b98b5f]/35 bg-[#fff8f1]/82 p-1 text-[11px] font-semibold text-[#8a6240] shadow-[0_12px_34px_rgba(111,77,56,.14)] backdrop-blur-md">
      <div className="flex gap-1">
        {(["ar", "en"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`rounded-full px-3 py-1.5 transition ${
              language === item ? "bg-[#c99780] text-white shadow-[0_8px_18px_rgba(168,120,90,.24)]" : "hover:bg-white/65"
            }`}
          >
            {item === "ar" ? "عربي" : "EN"}
          </button>
        ))}
      </div>
    </div>
  );
}

function SwanHeroSection({
  language,
  groomName,
  brideName
}: {
  language: InvitationLanguage;
  groomName: string;
  brideName: string;
}) {
  const copy = invitationData.copy[language];
  const isArabic = language === "ar";
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <Image src={assets.swanHero} alt="" fill priority sizes="430px" draggable={false} className="select-none object-cover object-top" />
      {!videoFailed ? (
        <video
          className="absolute inset-0 h-full w-full select-none object-cover object-top"
          src={assets.swanHeroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={assets.swanHero}
          onError={() => setVideoFailed(true)}
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,244,239,.2)_0%,rgba(255,244,239,.08)_46%,rgba(61,38,26,.1)_100%)]" />
      <motion.div
        className="relative z-10 mx-auto flex min-h-[100svh] w-full flex-col items-center px-7 pt-[calc(env(safe-area-inset-top)+6.9rem)] text-center"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: easing, delay: 0.15 }}
      >
        <p className={`text-[1.05rem] text-[#8a6240] ${isArabic ? "arabic-body" : "serif-text"}`}>{copy.heroLabel}</p>
        <Image src={assets.goldDivider} alt="" width={190} height={22} className="mt-1 h-auto w-28 opacity-85" />
        <h1
          className={`mt-1 text-[#8a6240] drop-shadow-[0_2px_5px_rgba(255,248,241,.72)] ${
            isArabic ? "arabic-title text-[3.25rem] leading-[1.02]" : "script-title text-[4.1rem] leading-[.88]"
          }`}
        >
          <span className="block">{groomName}</span>
          <span className={`block text-[#9b7358] ${isArabic ? "text-3xl" : "text-4xl"}`}>&</span>
          <span className="block">{brideName}</span>
        </h1>
        <Image src={assets.goldDivider} alt="" width={240} height={28} className="mt-3 h-auto w-36 opacity-90" />
        <p
          className={`mt-4 whitespace-pre-line text-[1.04rem] font-medium leading-6 text-[#6f4d38] ${
            isArabic ? "arabic-body" : "serif-text"
          }`}
        >
          {copy.heroText}
        </p>
      </motion.div>
    </section>
  );
}

function SectionDivider({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={`relative overflow-hidden bg-[#fff4ef] px-7 ${compact ? "py-2.5" : "py-4"} select-none`}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10, filter: "blur(8px)" }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, amount: 0.45 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.95, ease: easing }}
    >
      <div className="absolute inset-x-10 top-1/2 h-px bg-gradient-to-r from-transparent via-[#c99b65]/20 to-transparent" />
      <Image src={assets.sectionDivider} alt="" width={360} height={58} draggable={false} className="mx-auto h-auto w-60 opacity-82 drop-shadow-[0_6px_12px_rgba(185,139,95,.12)]" />
    </motion.div>
  );
}

function RevealSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.section
      className={className}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 36, scale: 0.988, filter: "blur(12px)" }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: false, amount: 0.18 }}
      transition={{ duration: reduceMotion ? 0.01 : 1.08, ease: easing }}
    >
      {children}
    </motion.section>
  );
}

function SectionShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden border-y border-[#b98b5f]/24 bg-[#fff4ef] px-4 py-7 shadow-[inset_0_1px_rgba(255,255,255,.72)] ${className}`}
      style={{ backgroundImage: `linear-gradient(rgba(255,244,239,.72),rgba(255,244,239,.88)), url(${assets.paper})`, backgroundSize: "cover" }}
    >
      {children}
    </div>
  );
}

function ScriptHeading({ children, language }: { children: ReactNode; language: InvitationLanguage }) {
  return (
    <h2 className={`text-center text-[#8a6240] ${language === "ar" ? "arabic-title text-[2.05rem]" : "script-title text-[2.85rem] leading-none"}`}>
      {children}
    </h2>
  );
}

function VenueSection({ language }: { language: InvitationLanguage }) {
  const copy = invitationData.copy[language];
  return (
    <RevealSection>
      <SectionShell className="pt-8">
        <CornerOrnaments />
        <ScriptHeading language={language}>{copy.venueTitle}</ScriptHeading>
        <Image src={assets.goldDivider} alt="" width={240} height={28} className="mx-auto mt-1 h-auto w-36 opacity-80" />
        <p className={`mt-2 text-center text-[1rem] text-[#7b5941] ${language === "ar" ? "arabic-body" : "serif-text"}`}>{copy.venueSubtitle}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {invitationData.venueOptions.map((venue) => {
            const selected = venue.id === invitationData.venue.selected;
            return (
              <motion.div
                key={venue.id}
                className={`relative overflow-hidden rounded-[1.15rem] border p-1.5 shadow-[0_12px_30px_rgba(111,77,56,.1)] ${
                  selected
                    ? "border-[#8ba367]/85 bg-[#e6efd8]/78 shadow-[0_16px_36px_rgba(113,139,76,.18)]"
                    : "border-[#b98b5f]/45 bg-[#fff8f1]/72"
                }`}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.35 }}
              >
                {selected ? <div className="pointer-events-none absolute inset-1 rounded-[1rem] ring-1 ring-[#f7d9a4]/65" /> : null}
                <div className="relative aspect-square overflow-hidden rounded-[.9rem] border border-[#b98b5f]/22 bg-[#fff8f1]">
                  <Image src={venue.image} alt="" fill sizes="(max-width: 430px) 45vw, 190px" className="object-cover object-center" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#fff8f1] to-transparent" />
                </div>
                <p className={`mt-2 px-1 text-center text-[#8a6240] ${language === "ar" ? "arabic-title text-xl" : "script-title whitespace-nowrap text-[clamp(1.35rem,6vw,1.68rem)] leading-none"}`}>
                  {text(venue.name, language)}
                </p>
                <div
                  className={`mx-auto mt-2 grid h-6 w-6 place-items-center rounded-full border ${
                    selected ? "border-[#7b9a5b] bg-[#fff8f1] text-[#6e8e52] shadow-[0_5px_12px_rgba(123,154,91,.2)]" : "border-[#b98b5f] bg-[#fff8f1] text-[#7b9a5b]"
                  }`}
                >
                  {selected ? <Check className="h-4 w-4 stroke-[2.8]" /> : null}
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionShell>
    </RevealSection>
  );
}

function CountdownSection({ language, target }: { language: InvitationLanguage; target: string }) {
  const copy = invitationData.copy[language];
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    const tick = () => setRemaining(getRemaining(target));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  return (
    <RevealSection>
      <SectionShell className="px-5 py-6">
        <FloralSprig side="left" />
        <FloralSprig side="right" />
        <ScriptHeading language={language}>{copy.countdownTitle}</ScriptHeading>
        <Image src={assets.goldDivider} alt="" width={240} height={28} className="mx-auto mt-1 h-auto w-40 opacity-90" />
        <div className="relative mx-auto mt-5 rounded-[1.65rem] border border-[#b98b5f]/70 bg-[#fff8f1]/52 px-2 py-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,.62),0_18px_42px_rgba(111,77,56,.08)]">
          <div className="grid grid-cols-4 divide-x divide-[#b98b5f]/34 rtl:divide-x-reverse">
            {remaining.map((value, index) => (
              <div key={copy.countdownLabels[index]} className="px-1 text-center">
                <p className="display-serif text-[2.05rem] leading-none text-[#8a6240]">{value}</p>
                <p className={`mt-2 text-[.63rem] uppercase tracking-[.12em] text-[#9b7358] ${language === "ar" ? "arabic-body" : "serif-text"}`}>
                  {copy.countdownLabels[index]}
                </p>
              </div>
            ))}
          </div>
          <Heart className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 fill-[#efc0b2] stroke-[#b98b5f]" />
        </div>
      </SectionShell>
    </RevealSection>
  );
}

function WeddingTimeSection({ language }: { language: InvitationLanguage }) {
  const copy = invitationData.copy[language];
  return (
    <RevealSection>
      <SectionShell className="px-6 py-5 text-center">
        <FloralSprig side="left" />
        <FloralSprig side="right" />
        <ScriptHeading language={language}>{copy.weddingTimeTitle}</ScriptHeading>
        <Image src={assets.goldDivider} alt="" width={220} height={24} className="mx-auto mt-1 h-auto w-36 opacity-85" />
        <p className={`mt-4 text-[1.45rem] text-[#8a6240] ${language === "ar" ? "arabic-title" : "display-serif italic"}`}>
          {copy.weddingTimeText}
        </p>
      </SectionShell>
    </RevealSection>
  );
}

function LocationSection({
  language,
  venueName,
  venueAddress,
  mapUrl
}: {
  language: InvitationLanguage;
  venueName: string;
  venueAddress: string;
  mapUrl: string;
}) {
  const copy = invitationData.copy[language];
  return (
    <RevealSection>
      <SectionShell className="px-4 py-5">
        <CornerOrnaments />
        <div className="grid grid-cols-[1.08fr_.92fr] items-center gap-3">
          <div className="relative aspect-[1.34/1] overflow-hidden rounded-[1rem] border border-[#b98b5f]/35 bg-[#fff8f1] p-1.5 shadow-[0_12px_28px_rgba(111,77,56,.1)]">
            <Image src={assets.locationPalace} alt="" fill sizes="210px" className="object-contain object-left-bottom p-1" />
          </div>
          <div className="text-center">
            <ScriptHeading language={language}>{copy.locationTitle}</ScriptHeading>
            <Image src={assets.goldDivider} alt="" width={180} height={20} className="mx-auto mt-1 h-auto w-28 opacity-80" />
            <h3 className={`mt-3 text-[1.28rem] font-semibold text-[#8a6240] ${language === "ar" ? "arabic-title" : "serif-text"}`}>{venueName}</h3>
            <p className={`mt-1 text-[.85rem] leading-5 text-[#7b5941] ${language === "ar" ? "arabic-body" : "serif-text"}`}>{venueAddress}</p>
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#b98b5f]/55 bg-[#fff8f1]/72 px-3.5 py-2 text-[.78rem] font-semibold text-[#8a6240] shadow-[0_8px_20px_rgba(111,77,56,.1)]"
            >
              <MapPin className="h-3.5 w-3.5" />
              {copy.openMaps}
            </a>
          </div>
        </div>
      </SectionShell>
    </RevealSection>
  );
}

function RSVPSection({ invitation, language }: { invitation: PublicInvitation; language: InvitationLanguage }) {
  const copy = invitationData.copy[language];
  const [guestName, setGuestName] = useState("");
  const [choice, setChoice] = useState<RsvpChoice>("accepted");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!guestName.trim()) return;
    setStatus("submitting");

    if (invitation.id === "demo") {
      window.setTimeout(() => setStatus("success"), 520);
      return;
    }

    try {
      const response = await fetch(`/api/invitations/${invitation.slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: guestName.trim(),
          response: choice === "accepted" ? "accepted" : "declined",
          language,
          invitationId: invitation.id,
          submittedAt: new Date().toISOString()
        })
      });
      if (!response.ok) throw new Error("RSVP failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <RevealSection>
      <SectionShell className="px-4 py-6">
        <CornerOrnaments />
        <div className="relative overflow-hidden rounded-[1.45rem] border border-[#b98b5f]/45 bg-[#fff8f1]/78 px-4 pb-5 pt-6 shadow-[inset_0_1px_rgba(255,255,255,.72),0_18px_42px_rgba(111,77,56,.1)]">
          <div className="pointer-events-none absolute inset-x-4 top-3 h-20 rounded-full bg-[radial-gradient(circle,rgba(255,244,239,.9),rgba(255,244,239,0)_70%)]" />
          <div className="relative z-10 mx-auto max-w-[318px] text-center">
            <ScriptHeading language={language}>{copy.rsvpTitle}</ScriptHeading>
            <Image src={assets.goldDivider} alt="" width={210} height={24} className="mx-auto mt-1 h-auto w-32 opacity-85" />
            <p className={`mt-2 text-[.92rem] text-[#7b5941] ${language === "ar" ? "arabic-body" : "serif-text"}`}>{copy.rsvpSubtitle}</p>

            {status === "success" ? (
              <div className="mt-5 rounded-[1.1rem] border border-[#b98b5f]/38 bg-[#fff4ef]/72 px-4 py-5 text-[#8a6240] shadow-[inset_0_1px_rgba(255,255,255,.7)]">
                <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full border border-[#7b9a5b]/70 bg-[#eef3e2] text-[#6e8e52] shadow-[0_10px_24px_rgba(123,154,91,.14)]">
                  <Check className="h-8 w-8 stroke-[1.8]" />
                </div>
                <p className={`text-2xl ${language === "ar" ? "arabic-title" : "script-title"}`}>{copy.successTitle}</p>
                <p className={`mx-auto mt-2 max-w-[220px] text-sm leading-5 ${language === "ar" ? "arabic-body" : "serif-text"}`}>{copy.successBody}</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-4 space-y-3">
                <label className="relative block">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b98b5f] rtl:left-auto rtl:right-3" />
                  <input
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                    placeholder={copy.guestName}
                    className="h-12 w-full rounded-[.78rem] border border-[#b98b5f]/45 bg-[#fffdf8]/88 px-10 text-sm text-[#6f4d38] outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.78),0_8px_20px_rgba(111,77,56,.06)] placeholder:text-[#9b7358]/62 focus:border-[#a8785a]"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <ChoiceButton active={choice === "accepted"} onClick={() => setChoice("accepted")}>
                    <Heart className="h-3.5 w-3.5 fill-current" />
                    {copy.accept}
                  </ChoiceButton>
                  <ChoiceButton active={choice === "apologized"} onClick={() => setChoice("apologized")}>
                    <Send className="h-3.5 w-3.5" />
                    {copy.apologize}
                  </ChoiceButton>
                </div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="serif-text mx-auto flex h-11 min-w-44 items-center justify-center gap-2 rounded-[.85rem] border border-[#8a6240]/40 bg-[linear-gradient(180deg,#cda66e,#a97943)] px-7 text-base font-semibold text-[#fff8f1] shadow-[inset_0_1px_rgba(255,255,255,.45),0_10px_24px_rgba(111,77,56,.18)] transition hover:brightness-105 disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {status === "submitting" ? copy.sending : copy.send}
                </button>
                {status === "error" ? <p className="text-sm text-[#9d473f]">{copy.error}</p> : null}
              </form>
            )}
            <div className="mt-5 flex items-center justify-center gap-3">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#b98b5f]/40" />
              <span className="grid h-12 w-12 place-items-center rounded-full border border-[#8a6240]/35 bg-[radial-gradient(circle_at_35%_28%,#e4bd80,#b67b42_62%,#8f5d33)] text-[#fff8f1] shadow-[inset_0_1px_rgba(255,255,255,.45),0_8px_18px_rgba(111,77,56,.18)]">
                <Heart className="h-5 w-5 fill-current stroke-[1.2]" />
              </span>
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#b98b5f]/40" />
            </div>
          </div>
        </div>
      </SectionShell>
    </RevealSection>
  );
}

function ChoiceButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11 items-center justify-center gap-1.5 rounded-[.7rem] border px-2 text-[.76rem] font-semibold transition ${
        active
          ? "border-[#9aaa67]/62 bg-[#edf3df]/84 text-[#6f5f38] shadow-[0_8px_18px_rgba(123,154,91,.12)]"
          : "border-[#b98b5f]/34 bg-[#fff8f1]/62 text-[#8a6240] shadow-[inset_0_1px_rgba(255,255,255,.52)]"
      }`}
    >
      {children}
    </button>
  );
}

function FooterSection({ language }: { language: InvitationLanguage }) {
  const copy = invitationData.copy[language];
  return (
    <RevealSection>
      <footer className="relative bg-[#fff4ef] px-4 pb-[calc(env(safe-area-inset-bottom)+1.35rem)] pt-5 text-center">
        <div className="relative rounded-[1.25rem] border border-[#b98b5f]/30 bg-[#fff8f1]/46 px-5 py-5">
          <CornerOrnaments />
          <ScriptHeading language={language}>{copy.thankYou}</ScriptHeading>
          <p className={`mt-1 text-sm text-[#7b5941] ${language === "ar" ? "arabic-body" : "serif-text"}`}>{copy.thankYouBody}</p>
          <Link
            href={invitationData.mainWebsiteUrl}
            className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-[#b98b5f]/42 bg-[#fff8f1] px-5 py-2 text-sm font-semibold text-[#8a6240] shadow-[0_8px_18px_rgba(111,77,56,.1)]"
          >
            <Home className="h-4 w-4" />
            {copy.backHome}
          </Link>
        </div>
        <div className="mt-4 flex items-center justify-center gap-5 text-[#8a6240]">
          <Instagram className="h-4 w-4" />
          <MessageCircle className="h-4 w-4" />
          <Heart className="h-4 w-4 fill-current" />
        </div>
        <div className="mt-3 flex items-center justify-center gap-5 text-[.75rem] text-[#8a6240]/72">
          <span>{copy.designed}</span>
          <span>•</span>
          <span>{copy.copyright}</span>
        </div>
      </footer>
    </RevealSection>
  );
}

function ChoiceMiniCard({
  image,
  label,
  selected
}: {
  image: string;
  label: string;
  selected?: boolean;
}) {
  return (
    <div className={`overflow-hidden rounded-[1rem] border bg-[#fff8f1]/82 p-1 ${selected ? "border-[#7b9a5b]" : "border-[#b98b5f]/45"}`}>
      <div className="relative aspect-[1.22/1] overflow-hidden rounded-[.75rem]">
        <Image src={image} alt="" fill sizes="160px" className="object-cover" />
      </div>
      <p className="script-title mt-1 text-center text-xl text-[#8a6240]">{label}</p>
    </div>
  );
}

function FloatingPetals() {
  const reduceMotion = useReducedMotion();
  const petals = useMemo(
    () =>
      Array.from({ length: reduceMotion ? 0 : 22 }, (_, index) => ({
        id: index,
        left: `${5 + ((index * 29) % 90)}%`,
        delay: (index % 10) * 1.15,
        duration: 15 + (index % 8) * 1.22,
        size: 10 + (index % 6) * 2.6,
        drift: index % 2 ? 16 + (index % 4) * 5 : -14 - (index % 4) * 5,
        peakOpacity: 0.25 + (index % 5) * 0.052
      })),
    [reduceMotion]
  );

  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[3] mx-auto max-w-[430px] overflow-hidden opacity-80">
      {petals.map((petal) => (
        <motion.img
          key={petal.id}
          src={assets.petals}
          alt=""
          draggable={false}
          className="absolute -top-16 select-none"
          style={{ left: petal.left, width: petal.size }}
          animate={{
            y: ["0vh", "112vh"],
            x: [0, petal.drift, petal.drift * 0.25, 0],
            rotate: [0, petal.id % 2 ? 22 : -18, petal.id % 2 ? -10 : 14],
            opacity: [0, petal.peakOpacity, petal.peakOpacity * 0.55, 0]
          }}
          transition={{ duration: petal.duration, repeat: Infinity, delay: petal.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
}

function CornerOrnaments() {
  return (
    <>
      <Image src={assets.ornament} alt="" width={72} height={72} className="pointer-events-none absolute left-3 top-3 h-10 w-10 opacity-45" />
      <Image src={assets.ornament} alt="" width={72} height={72} className="pointer-events-none absolute right-3 top-3 h-10 w-10 rotate-90 opacity-45" />
      <Image src={assets.ornament} alt="" width={72} height={72} className="pointer-events-none absolute bottom-3 left-3 h-10 w-10 -rotate-90 opacity-40" />
      <Image src={assets.ornament} alt="" width={72} height={72} className="pointer-events-none absolute bottom-3 right-3 h-10 w-10 rotate-180 opacity-40" />
    </>
  );
}

function FloralSprig({ side }: { side: "left" | "right" }) {
  return (
    <Image
      src={assets.petals}
      alt=""
      width={140}
      height={90}
      className={`pointer-events-none absolute top-4 h-12 w-20 opacity-45 ${side === "left" ? "left-1 -rotate-12" : "right-1 rotate-12"}`}
    />
  );
}

export function LuxuryInvitationMiniature({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#fff4ef] ${className}`}>
      <Image src={assets.swanHero} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-top" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,244,239,.08),rgba(255,244,239,.2)_55%,rgba(255,244,239,.65))]" />
      <div className="absolute inset-x-4 top-[16%] text-center">
        <p className="serif-text text-sm text-[#8a6240]">Wedding Invitation</p>
        <p className="script-title text-5xl leading-[.92] text-[#8a6240]">Ahmed<br />&<br />Mayar</p>
      </div>
    </div>
  );
}

export function LuxuryInvitationArtifact({
  isOpen,
  onOpen,
  language = "en",
  brideName,
  groomName,
  date,
  venue
}: {
  isOpen: boolean;
  onOpen: () => void;
  language?: InvitationLanguage;
  brideName: string;
  groomName: string;
  initials: string;
  date: string;
  time?: string;
  venue: string;
  message: string;
  countdownTarget?: string;
  sealImageUrl?: string | null;
  onRsvpClick?: () => void;
}) {
  const groom = localizeName(groomName, invitationData.couple.groom, language);
  const bride = localizeName(brideName, invitationData.couple.bride, language);
  const dateParts = formatDateParts(date, language);

  return (
    <div className="relative mx-auto min-h-[680px] max-w-[430px] overflow-hidden rounded-[1.8rem] bg-[#fff4ef]">
      {!isOpen ? (
        <button type="button" onClick={onOpen} className="relative block h-[680px] w-full overflow-hidden">
          <Image src={assets.introPoster} alt="" fill sizes="430px" className="object-cover" />
          <div className="serif-text absolute inset-x-0 bottom-8 text-center text-sm font-semibold text-[#8a6240]">Tap to preview</div>
        </button>
      ) : (
        <>
          <div className="relative h-[430px]">
            <Image src={assets.swanHero} alt="" fill sizes="430px" className="object-cover object-top" />
            <div className="absolute inset-x-6 top-16 text-center">
              <p className="serif-text text-sm text-[#8a6240]">{dateParts.fullDate}</p>
              <p className="script-title text-5xl leading-none text-[#8a6240]">{groom}<br />&<br />{bride}</p>
            </div>
          </div>
          <div className="p-5 text-center">
            <ScriptHeading language={language}>{language === "ar" ? "المكان" : "Venue"}</ScriptHeading>
            <ChoiceMiniCard image="/invitation/venue-wedding-hall.webp" label={venue || text(invitationData.venue.name, language)} selected />
          </div>
        </>
      )}
    </div>
  );
}

export function InvitationMusicCue() {
  return (
    <span className="inline-flex items-center gap-2">
      <Music2 className="h-4 w-4" />
      Music
    </span>
  );
}
