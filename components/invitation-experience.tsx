"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  introPoster: "/invitation/closed-invitation.webp",
  swanHero: "/invitation/swan-hero.webp",
  paper: "/invitation/paper-bg.webp",
  floralFrame: "/invitation/floral-frame.webp",
  countdownFrame: "/invitation/countdown-frame.webp",
  locationPalace: "/invitation/location-palace.webp",
  rsvpEnvelope: "/invitation/rsvp-envelope.webp",
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
  const [intro, setIntro] = useState<"checking" | "show" | "done">("checking");
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

  const finishIntro = () => {
    window.localStorage.setItem("invitationOpened", "true");
    setIntro("done");
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className="relative min-h-screen overflow-x-hidden bg-[#f8ddd5] text-[#6f4d38] [color-scheme:light]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,#fff8f1_0,#f9e5dc_38%,#f8ddd5_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-[.55]" style={{ backgroundImage: `url(${assets.paper})`, backgroundSize: "cover", backgroundPosition: "center top" }} />
      <FloatingPetals />
      <LanguageSwitcher language={language} onChange={setLanguage} />

      <main
        className={`mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#fff4ef] shadow-[0_0_80px_rgba(111,77,56,.16)] transition-opacity duration-700 ${
          intro === "show" || intro === "checking" ? "opacity-0" : "opacity-100"
        }`}
      >
        <SwanHeroSection language={language} groomName={groomName} brideName={brideName} />
        <VenueSection language={language} />
        <CountdownSection language={language} target={invitation.wedding_date || invitationData.wedding.dateISO} />
        <WeddingTimeSection language={language} />
        <LocationSection language={language} venueName={venueName} venueAddress={venueAddress} mapUrl={mapUrl} />
        <RSVPSection invitation={invitation} language={language} />
        <FooterSection language={language} />
      </main>

      <AnimatePresence>
        {intro === "show" ? <IntroVideo key="intro" language={language} onComplete={finishIntro} /> : null}
      </AnimatePresence>
    </section>
  );
}

function IntroVideo({ language, onComplete }: { language: InvitationLanguage; onComplete: () => void }) {
  const [isFading, setIsFading] = useState(false);
  const copy = invitationData.copy[language];

  const finish = () => {
    setIsFading(true);
    window.setTimeout(onComplete, 700);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80] grid place-items-center bg-[#f8ddd5]"
      initial={{ opacity: 1 }}
      animate={{ opacity: isFading ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: easing }}
    >
      <div className="relative h-full w-full max-w-[430px] overflow-hidden bg-[#fff4ef] shadow-[0_0_80px_rgba(111,77,56,.28)]">
        <video className="h-full w-full object-cover" src={assets.introVideo} poster={assets.introPoster} autoPlay muted playsInline onEnded={finish} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(248,221,213,.08),rgba(71,44,29,.12))]" />
        <button
          type="button"
          onClick={finish}
          className="absolute bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-1/2 -translate-x-1/2 rounded-full border border-[#b98b5f]/45 bg-[#fff8f1]/76 px-4 py-2 text-xs font-semibold text-[#8a6240] shadow-[0_14px_32px_rgba(111,77,56,.18)] backdrop-blur-md"
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

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <Image src={assets.swanHero} alt="" fill priority sizes="430px" className="object-cover object-top" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,244,239,.2)_0%,rgba(255,244,239,.08)_46%,rgba(61,38,26,.1)_100%)]" />
      <motion.div
        className="relative z-10 mx-auto flex min-h-[100svh] w-full flex-col items-center px-7 pt-[calc(env(safe-area-inset-top)+4.3rem)] text-center"
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

function RevealSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.section
      className={className}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 45, scale: 0.985, filter: "blur(14px)" }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: false, amount: 0.22 }}
      transition={{ duration: reduceMotion ? 0.01 : 1, ease: easing }}
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
                  selected ? "border-[#7b9a5b]/70 bg-[#dfead0]/68" : "border-[#b98b5f]/45 bg-[#fff8f1]/72"
                }`}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.35 }}
              >
                <div className="relative aspect-[1.18/1] overflow-hidden rounded-[.9rem] border border-[#b98b5f]/20 bg-[#f9efe6]">
                  <Image src={venue.image} alt="" fill sizes="190px" className="object-cover object-left" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#fff8f1] to-transparent" />
                </div>
                <p className={`mt-2 text-center text-[#8a6240] ${language === "ar" ? "arabic-title text-xl" : "script-title text-[1.72rem] leading-none"}`}>
                  {text(venue.name, language)}
                </p>
                <div className="mx-auto mt-2 grid h-6 w-6 place-items-center rounded-full border border-[#b98b5f] bg-[#fff8f1] text-[#7b9a5b]">
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
        <div className="grid grid-cols-[1.05fr_.95fr] items-center gap-3">
          <div className="relative aspect-[1.25/1] overflow-hidden rounded-[1rem] border border-[#b98b5f]/35 bg-[#fff8f1] shadow-[0_12px_28px_rgba(111,77,56,.1)]">
            <Image src={assets.locationPalace} alt="" fill sizes="210px" className="object-cover" />
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
        <div className="relative overflow-hidden rounded-[1.35rem] border border-[#b98b5f]/42 bg-[#fff8f1]/72 px-4 pb-5 pt-5 shadow-[0_18px_42px_rgba(111,77,56,.1)]">
          <Image src={assets.rsvpEnvelope} alt="" width={230} height={166} className="pointer-events-none absolute -bottom-6 -left-10 w-44 opacity-70" />
          <div className="relative z-10 mx-auto max-w-[310px] text-center">
            <ScriptHeading language={language}>{copy.rsvpTitle}</ScriptHeading>
            <Image src={assets.goldDivider} alt="" width={210} height={24} className="mx-auto mt-1 h-auto w-32 opacity-85" />
            <p className={`mt-2 text-[.92rem] text-[#7b5941] ${language === "ar" ? "arabic-body" : "serif-text"}`}>{copy.rsvpSubtitle}</p>

            {status === "success" ? (
              <div className="mt-5 rounded-[1rem] border border-[#b98b5f]/38 bg-[#fff4ef]/72 px-4 py-4 text-[#8a6240]">
                <p className={`text-xl ${language === "ar" ? "arabic-title" : "script-title"}`}>{copy.successTitle}</p>
                <p className={`mt-1 text-sm ${language === "ar" ? "arabic-body" : "serif-text"}`}>{copy.successBody}</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-4 space-y-3">
                <label className="relative block">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b98b5f] rtl:left-auto rtl:right-3" />
                  <input
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                    placeholder={copy.guestName}
                    className="h-12 w-full rounded-[.7rem] border border-[#b98b5f]/45 bg-[#fff8f1]/82 px-10 text-sm text-[#6f4d38] outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.65)] placeholder:text-[#9b7358]/70 focus:border-[#a8785a]"
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
                  className="serif-text mx-auto flex h-12 min-w-40 items-center justify-center gap-2 rounded-[.85rem] border border-[#8a6240]/40 bg-[linear-gradient(180deg,#c69a63,#98683c)] px-7 text-base font-semibold text-[#fff8f1] shadow-[inset_0_1px_rgba(255,255,255,.45),0_10px_24px_rgba(111,77,56,.2)] transition hover:brightness-105 disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {status === "submitting" ? copy.sending : copy.send}
                </button>
                {status === "error" ? <p className="text-sm text-[#9d473f]">{copy.error}</p> : null}
              </form>
            )}
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
        active ? "border-[#b98b5f]/60 bg-[#dfead0]/78 text-[#6f5f38]" : "border-[#b98b5f]/38 bg-[#fff4ef]/58 text-[#8a6240]"
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
  const petals = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        id: index,
        left: `${8 + ((index * 23) % 84)}%`,
        delay: (index % 7) * 1.3,
        duration: 16 + (index % 5) * 3,
        size: 18 + (index % 4) * 6
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[3] mx-auto max-w-[430px] overflow-hidden opacity-70">
      {petals.map((petal) => (
        <motion.img
          key={petal.id}
          src={assets.petals}
          alt=""
          className="absolute -top-16"
          style={{ left: petal.left, width: petal.size }}
          animate={{ y: ["0vh", "112vh"], x: [0, petal.id % 2 ? 18 : -14, 0], rotate: [0, 25, -12], opacity: [0, 0.4, 0.18, 0] }}
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
            <ChoiceMiniCard image="/invitation/venue-hall.webp" label={venue || text(invitationData.venue.name, language)} selected />
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
