"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Music2 } from "lucide-react";
import { invitationContent, type InvitationLanguage } from "@/src/data/invitation";
import type { PublicInvitation } from "@/lib/invitations";

type RsvpResponse = "accepted" | "declined";

type DateParts = {
  weekday: string;
  day: string;
  month: string;
  year: string;
  time: string;
  fullDate: string;
};

function MonogramMark({ value, className = "", style }: { value: string; className?: string; style?: CSSProperties }) {
  const parts = value.includes("+") ? value.split("+").map((part) => part.trim()) : null;

  if (parts?.length === 2) {
    return (
      <span dir="ltr" className={`inline-flex items-center justify-center gap-1 [unicode-bidi:isolate] ${className}`} style={style}>
        <span>{parts[0]}</span>
        <span className="text-[.74em] opacity-80">+</span>
        <span>{parts[1]}</span>
      </span>
    );
  }

  return (
    <span dir="ltr" className={`inline-flex items-center justify-center [unicode-bidi:isolate] ${className}`} style={style}>
      {value}
    </span>
  );
}

const assets = {
  background: "/assets/invitation/bg-soft-ivory.webp",
  paper: "/assets/invitation/bg-paper-texture.webp",
  closedEnvelope: "/assets/invitation/closed-envelope.webp",
  openedEnvelope: "/assets/invitation/opened-envelope.webp",
  waxSeal: "/assets/invitation/wax-seal.webp",
  waxSealOpen: "/assets/invitation/wax-seal-open.webp",
  heroFrame: "/assets/invitation/invitation-hero-frame.webp",
  floralTop: "/assets/invitation/floral-top-frame.webp",
  floralBottom: "/assets/invitation/floral-bottom-frame.webp",
  swans: "/assets/invitation/swans-lake.webp",
  venue: "/assets/invitation/venue-illustration.webp",
  mapFrame: "/assets/invitation/map-frame.webp",
  petals: "/assets/invitation/petals.webp",
  floralDivider: "/assets/invitation/floral-divider.svg",
  goldDivider: "/assets/invitation/gold-divider.svg",
  ornamentalCorners: "/assets/invitation/ornamental-corners.svg"
};

const nameMap: Record<string, { ar: string; en: string }> = {
  "أحمد": { ar: "أحمد", en: "Ahmed" },
  "احمد": { ar: "أحمد", en: "Ahmed" },
  Ahmed: { ar: "أحمد", en: "Ahmed" },
  "مايار": { ar: "مايار", en: "Mayar" },
  Mayar: { ar: "مايار", en: "Mayar" },
  "بودي": { ar: "أحمد", en: "Ahmed" },
  bobi: { ar: "أحمد", en: "Ahmed" },
  "يوري": { ar: "مايار", en: "Mayar" },
  yori: { ar: "مايار", en: "Mayar" }
};

function getSafeDate(value?: string | null) {
  const date = new Date(value || invitationContent.event.date);
  return Number.isFinite(date.getTime()) ? date : new Date(invitationContent.event.date);
}

function formatDateParts(value: string, language: InvitationLanguage): DateParts {
  const date = getSafeDate(value);
  const locale = language === "ar" ? "ar-EG" : "en-US";
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
  const day = new Intl.DateTimeFormat(locale, { day: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
  const year = new Intl.DateTimeFormat(locale, { year: "numeric" }).format(date);
  const rawTime = new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", hour12: true }).format(date);
  const time =
    language === "ar"
      ? rawTime.replace(/\s?م$/, " مساءً").replace(/\s?ص$/, " صباحًا")
      : rawTime.replace(/\s/g, " ");

  return {
    weekday,
    day,
    month,
    year,
    time,
    fullDate: language === "ar" ? `${weekday}، ${day} ${month} ${year}` : `${weekday}, ${month} ${day}, ${year}`
  };
}

function localizeName(value: string | null | undefined, fallback: { ar: string; en: string }, language: InvitationLanguage) {
  const cleaned = (value || "").trim();
  if (!cleaned) return fallback[language];
  return nameMap[cleaned]?.[language] || cleaned;
}

function getMonogram(groomName: string, brideName: string, language: InvitationLanguage) {
  const groom = groomName.trim().charAt(0);
  const bride = brideName.trim().charAt(0);
  if (!groom && !bride) return language === "ar" ? "أ م" : "A & M";
  return language === "ar" ? `${groom} ${bride}` : `${groom.toUpperCase()} & ${bride.toUpperCase()}`;
}

function cleanCustomMessage(message?: string | null) {
  const value = (message || "").trim();
  const blocked = ["بكل الحب والفرحة", "من العريس", "اختارها قلبي", "from the groom", "heart chose"];
  if (!value || blocked.some((phrase) => value.toLowerCase().includes(phrase.toLowerCase()))) return "";
  return value;
}

function playOpenSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2600;
    master.gain.value = 0.035;
    master.connect(filter);
    filter.connect(context.destination);

    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, context.currentTime + index * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.04, context.currentTime + 0.12 + index * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.15 + index * 0.07);
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(context.currentTime + index * 0.06);
      oscillator.stop(context.currentTime + 1.4 + index * 0.07);
    });

    window.setTimeout(() => void context.close(), 1600);
  } catch {
    // The invitation must never depend on sound.
  }
}

export function InvitationExperience({ invitation }: { invitation: PublicInvitation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<InvitationLanguage>("ar");
  const [guestName, setGuestName] = useState("");
  const [response, setResponse] = useState<RsvpResponse>("accepted");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const reduceMotion = useReducedMotion();

  const isArabic = language === "ar";
  const copy = invitationContent.copy[language];
  const dateParts = useMemo(() => formatDateParts(invitation.wedding_date || invitationContent.event.date, language), [invitation.wedding_date, language]);
  const groomName = localizeName(invitation.groom_name, invitationContent.couple.groom, language);
  const brideName = localizeName(invitation.bride_name, invitationContent.couple.bride, language);
  const monogram = getMonogram(groomName, brideName, language);
  const defaultVenue = invitationContent.event.venue[language];
  const venue = invitation.venue || defaultVenue;
  const address = invitation.venue_address || invitationContent.event.address[language];
  const customMessage = cleanCustomMessage(invitation.invitation_text);
  const mapsUrl =
    invitation.venue_lat && invitation.venue_lng
      ? `https://www.google.com/maps?q=${invitation.venue_lat},${invitation.venue_lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`;

  useEffect(() => {
    if (invitation.id === "demo") return;
    fetch(`/api/invitations/${invitation.slug}/view`, { method: "POST" }).catch(() => undefined);
  }, [invitation.id, invitation.slug]);

  function openInvitation() {
    if (isOpen) return;
    playOpenSound();
    setIsOpen(true);
  }

  async function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    setLoading(true);

    if (invitation.id === "demo") {
      window.setTimeout(() => {
        setStatus(copy.success);
        setGuestName("");
        setLoading(false);
      }, 420);
      return;
    }

    try {
      const result = await fetch(`/api/invitations/${invitation.slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestName, response })
      });
      const json = await result.json();
      if (!result.ok) throw new Error(json.error || copy.error);
      setStatus(copy.success);
      setGuestName("");
    } catch (rsvpError) {
      setError(rsvpError instanceof Error ? rsvpError.message : copy.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="relative min-h-[100svh] overflow-x-hidden bg-[#fff6ed] text-[#3f291e] [color-scheme:light]"
      aria-label={isArabic ? "دعوة زفاف رقمية" : "Digital wedding invitation"}
    >
      <Image src={assets.background} alt="" fill priority sizes="100vw" className="fixed inset-0 object-cover" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_7%,rgba(255,255,255,.62),transparent_30%),linear-gradient(180deg,rgba(255,246,237,.74),rgba(252,236,225,.94))]" />
      <SoftParticles />
      <LanguageToggle language={language} onChange={setLanguage} />

      <main className="relative z-10 mx-auto min-h-[100svh] w-full max-w-[430px] px-3 pb-7 pt-[calc(env(safe-area-inset-top)+4.2rem)] sm:px-4">
        <ClosedEnvelope
          isOpen={isOpen}
          language={language}
          monogram={monogram}
          sealImageUrl={invitation.seal_image_url}
          onOpen={openInvitation}
        />

        <AnimatePresence>
          {isOpen ? (
            <motion.div
              className="relative w-full"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: reduceMotion ? 0 : 1.05, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <InvitationHero
                language={language}
                copy={copy}
                groomName={groomName}
                brideName={brideName}
                monogram={monogram}
                dateParts={dateParts}
                customMessage={customMessage}
              />
              <BismillahSection language={language} />
              <CountdownSection target={invitation.wedding_date || invitationContent.event.date} language={language} />
              <ScheduleSection language={language} />
              <LocationSection copy={copy} venue={venue} address={address} language={language} />
              <MapSection copy={copy} mapsUrl={mapsUrl} />
              <DressCodeSection copy={copy} language={language} />
              <RsvpSection
                copy={copy}
                guestName={guestName}
                response={response}
                loading={loading}
                error={error}
                status={status}
                onGuestNameChange={setGuestName}
                onResponseChange={setResponse}
                onSubmit={submitRsvp}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </section>
  );
}

function LanguageToggle({ language, onChange }: { language: InvitationLanguage; onChange: (language: InvitationLanguage) => void }) {
  return (
    <div className="fixed left-3 top-[calc(env(safe-area-inset-top)+.75rem)] z-50 rounded-full border border-[#d7b98a]/34 bg-[#fffaf2]/78 p-1 text-[11px] font-extrabold text-[#8a5b25] shadow-[0_12px_34px_rgba(135,91,50,.12)] backdrop-blur-md">
      <div className="flex gap-1">
        {(["ar", "en"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`rounded-full px-3 py-1.5 transition ${
              language === item ? "bg-[#c88f82] text-white shadow-[0_8px_20px_rgba(175,111,96,.22)]" : "hover:bg-white/70"
            }`}
          >
            {item === "ar" ? "عربي" : "EN"}
          </button>
        ))}
      </div>
    </div>
  );
}

function ClosedEnvelope({
  isOpen,
  language,
  monogram,
  sealImageUrl,
  onOpen
}: {
  isOpen: boolean;
  language: InvitationLanguage;
  monogram: string;
  sealImageUrl?: string | null;
  onOpen: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const copy = invitationContent.copy[language];

  return (
    <motion.div
      className={`grid min-h-[calc(100svh-6rem)] w-full place-items-center ${isOpen ? "pointer-events-none absolute inset-x-3 top-16 opacity-0" : "relative"}`}
      animate={isOpen ? { opacity: 0, y: -24, scale: 0.95 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.95, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-full">
        <motion.button
          type="button"
          onClick={onOpen}
          className="group relative mx-auto block aspect-[900/1220] w-[min(88vw,360px)] outline-none"
          whileTap={reduceMotion ? undefined : { scale: 0.985 }}
          aria-label={copy.openHint}
        >
          <motion.div
            className="relative h-full w-full"
            animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src={assets.closedEnvelope} alt="" fill priority sizes="360px" className="object-contain drop-shadow-[0_28px_58px_rgba(125,86,52,.24)]" />
            <AnimatePresence>
              {isOpen ? (
                <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Image src={assets.openedEnvelope} alt="" fill sizes="360px" className="object-contain" />
                </motion.div>
              ) : null}
            </AnimatePresence>
            <div className="absolute inset-x-[19%] top-[28%] text-center">
              <p className="text-xs font-extrabold tracking-[0.18em] text-[#8a5b25]/72">{copy.closedLabel}</p>
            </div>
            <motion.span className="absolute left-1/2 top-[56%] grid h-[clamp(82px,22vw,110px)] w-[clamp(82px,22vw,110px)] -translate-x-1/2 -translate-y-1/2 place-items-center">
              <Image
                src={isOpen ? assets.waxSealOpen : sealImageUrl || assets.waxSeal}
                alt=""
                fill
                sizes="120px"
                className="object-contain drop-shadow-[0_18px_32px_rgba(120,72,58,.3)] transition duration-500 group-hover:scale-[1.03]"
                unoptimized={Boolean(sealImageUrl)}
              />
              {!isOpen ? <MonogramMark value={language === "ar" ? "DA" : monogram} className="relative z-10 font-display text-[clamp(1.02rem,5vw,1.42rem)] font-bold text-[#fff4da]" /> : null}
            </motion.span>
          </motion.div>
        </motion.button>

        <motion.p
          className="mx-auto mt-4 w-fit rounded-full border border-[#d7b98a]/34 bg-[#fffaf2]/76 px-5 py-2 text-center text-xs font-extrabold text-[#8a5b25]/78 shadow-[0_14px_34px_rgba(135,91,50,.1)] backdrop-blur-md"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          {copy.openHint}
        </motion.p>
      </div>
    </motion.div>
  );
}

function InvitationHero({
  language,
  copy,
  groomName,
  brideName,
  monogram,
  dateParts,
  customMessage
}: {
  language: InvitationLanguage;
  copy: (typeof invitationContent.copy)[InvitationLanguage];
  groomName: string;
  brideName: string;
  monogram: string;
  dateParts: DateParts;
  customMessage: string;
}) {
  const isArabic = language === "ar";

  return (
    <motion.section
      className="relative min-h-[calc(100svh-5.2rem)] overflow-hidden rounded-[2rem] text-center shadow-[0_30px_82px_rgba(125,86,52,.16)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image src={assets.heroFrame} alt="" fill priority sizes="430px" className="object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,243,.3),rgba(255,250,243,.04)_52%,rgba(255,246,237,.44))]" />
      <div className="relative z-10 flex min-h-[calc(100svh-5.2rem)] flex-col items-center px-7 pb-8 pt-8">
        <motion.p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-[#a7792d]/76" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {copy.heroLabel}
        </motion.p>
        <p className="mt-2 text-xs font-bold text-[#8a5b25]/62">{dateParts.fullDate}</p>
        <div className="mt-6 grid place-items-center">
          <MonogramMark
            value={monogram}
            className="text-[clamp(1.35rem,8vw,2rem)] font-bold leading-none text-[#b48245]"
            style={{ fontFamily: isArabic ? "var(--font-arabic-luxury)" : "var(--font-cormorant)" }}
          />
        </div>
        <h1
          className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[clamp(2.4rem,13vw,4rem)] font-bold leading-[.98] text-[#493023]"
          style={{ fontFamily: isArabic ? "var(--font-arabic-luxury)" : "var(--font-cormorant)" }}
        >
          <span>{groomName}</span>
          <span className="text-[#c88f82]">&</span>
          <span>{brideName}</span>
        </h1>
        <Image src={assets.floralDivider} alt="" width={260} height={28} className="mt-4 h-auto w-44 opacity-80" />
        <div className="mt-5 space-y-3 text-[clamp(.95rem,4vw,1.12rem)] font-bold leading-8 text-[#5c3a2a]">
          <p>{copy.opening}</p>
          <p>{copy.formal}</p>
          {customMessage ? <p className="text-[#8a5b25]/86">{customMessage}</p> : null}
        </div>
        <div className="mt-auto w-full">
          <Image src={assets.swans} alt="" width={900} height={520} priority sizes="430px" className="mx-auto h-auto w-full opacity-95" />
          <motion.p
            className="mx-auto -mt-2 w-fit rounded-full bg-white/62 px-4 py-1.5 text-[11px] font-extrabold text-[#8a5b25]/65 shadow-[0_10px_28px_rgba(135,91,50,.1)]"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {copy.scrollHint}
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}

function PaperSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.section
      className={`relative mt-4 overflow-hidden rounded-[1.8rem] border border-[#d7b98a]/28 bg-[#fffaf2]/76 px-6 py-8 text-center shadow-[0_22px_62px_rgba(125,86,52,.1)] backdrop-blur-sm ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image src={assets.paper} alt="" fill sizes="430px" className="object-cover opacity-[.58]" />
      <Image src={assets.ornamentalCorners} alt="" fill sizes="430px" className="object-cover opacity-20" />
      <div className="relative z-10">{children}</div>
    </motion.section>
  );
}

function BismillahSection({ language }: { language: InvitationLanguage }) {
  const copy = invitationContent.copy[language];
  const isArabic = language === "ar";
  return (
    <PaperSection>
      <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#a7792d]/70">{language === "ar" ? "بداية مباركة" : "Blessed Beginning"}</p>
      <p
        className="mt-5 text-[clamp(1.55rem,7vw,2.15rem)] font-bold leading-[1.35] text-[#5a3628]"
        style={{ fontFamily: isArabic ? "var(--font-arabic-luxury)" : "var(--font-cormorant)" }}
      >
        {copy.bismillah}
      </p>
      <Image src={assets.floralDivider} alt="" width={300} height={32} className="mx-auto mt-5 h-auto w-48 opacity-70" />
    </PaperSection>
  );
}

function CountdownSection({ target, language }: { target: string; language: InvitationLanguage }) {
  const [now, setNow] = useState(() => Date.now());
  const copy = invitationContent.copy[language];
  const labels = invitationContent.countdownLabels[language];

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const units = useMemo(() => {
    const targetMs = getSafeDate(target).getTime();
    const diff = Math.max(0, targetMs - now);
    return [
      Math.floor(diff / 86_400_000),
      Math.floor((diff % 86_400_000) / 3_600_000),
      Math.floor((diff % 3_600_000) / 60_000),
      Math.floor((diff % 60_000) / 1000)
    ];
  }, [now, target]);

  return (
    <PaperSection>
      <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-[#a7792d]/74">{copy.countdownTitle}</p>
      <div className="mt-6 grid grid-cols-4 divide-x divide-[#c8a36a]/28 rtl:divide-x-reverse">
        {units.map((value, index) => (
          <div key={labels[index]} className="px-1">
            <p className="font-display text-[clamp(2.05rem,10vw,3rem)] leading-none text-[#7a1d21]">{String(value).padStart(2, "0")}</p>
            <p className="mt-1 text-[10px] font-extrabold text-[#8a5b25]/62">{labels[index]}</p>
          </div>
        ))}
      </div>
    </PaperSection>
  );
}

function ScheduleSection({ language }: { language: InvitationLanguage }) {
  const copy = invitationContent.copy[language];
  return (
    <PaperSection>
      <SectionTitle title={copy.scheduleTitle} />
      <div className="relative mt-7 space-y-5 text-start">
        <span className="absolute bottom-2 top-2 h-auto w-px bg-[#d7b98a]/42 ltr:left-4 rtl:right-4" />
        {invitationContent.schedule.map((item, index) => (
          <motion.div
            key={`${item.time.en}-${item.title.en}`}
            className="relative grid grid-cols-[2rem_1fr] gap-3 rtl:grid-cols-[1fr_2rem]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
          >
            <span className="relative z-10 mt-1 grid h-8 w-8 place-items-center rounded-full border border-[#d7b98a]/40 bg-[#fffaf2] text-[#c88f82] rtl:order-2">
              ✦
            </span>
            <div className="rounded-[1rem] bg-white/42 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,.55)]">
              <p className="text-xs font-extrabold text-[#a7792d]">{item.time[language]}</p>
              <p className="mt-1 text-sm font-bold text-[#4d3021]">{item.title[language]}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </PaperSection>
  );
}

function LocationSection({ copy, venue, address, language }: { copy: (typeof invitationContent.copy)[InvitationLanguage]; venue: string; address: string; language: InvitationLanguage }) {
  return (
    <PaperSection>
      <SectionTitle title={copy.locationTitle} />
      <Image src={assets.venue} alt="" width={900} height={520} sizes="430px" className="mx-auto mt-4 h-auto w-full opacity-90" />
      <p className="mt-2 text-lg font-extrabold text-[#4d3021]">{venue}</p>
      <p className="mt-1 text-sm font-bold text-[#8a5b25]/66">{address}</p>
      {language === "ar" ? <p className="mt-4 text-xs font-bold text-[#8a5b25]/56">يسعدنا حضوركم في الموعد المحدد.</p> : null}
    </PaperSection>
  );
}

function MapSection({ copy, mapsUrl }: { copy: (typeof invitationContent.copy)[InvitationLanguage]; mapsUrl: string }) {
  return (
    <PaperSection>
      <SectionTitle title={copy.mapTitle} />
      <div className="relative mt-4 overflow-hidden rounded-[1.35rem]">
        <Image src={assets.mapFrame} alt="" width={900} height={560} sizes="430px" className="h-auto w-full" />
      </div>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex rounded-full border border-[#d7b98a]/38 bg-white/60 px-5 py-2.5 text-xs font-extrabold text-[#7a1d21] shadow-[0_12px_28px_rgba(125,86,52,.1)] transition hover:-translate-y-0.5"
      >
        {copy.openMaps}
      </a>
    </PaperSection>
  );
}

function DressCodeSection({ copy, language }: { copy: (typeof invitationContent.copy)[InvitationLanguage]; language: InvitationLanguage }) {
  return (
    <PaperSection>
      <SectionTitle title={copy.dressTitle} />
      <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-[#d7b98a]/28 bg-white/46 px-4 py-2">
        {["#fffaf2", "#ead8c0", "#c88f82", "#7a1d21"].map((color) => (
          <span key={color} className="h-6 w-6 rounded-full border border-[#d7b98a]/38" style={{ backgroundColor: color }} />
        ))}
      </div>
      <p className="mt-4 text-lg font-extrabold text-[#4d3021]">{copy.dressValue}</p>
      <p className="mt-2 text-xs font-bold text-[#8a5b25]/58">{language === "ar" ? "ألوان هادئة ولمسة أنيقة تكمل جمال اليوم." : "Soft tones and elegant details for a beautiful day."}</p>
    </PaperSection>
  );
}

function RsvpSection({
  copy,
  guestName,
  response,
  loading,
  error,
  status,
  onGuestNameChange,
  onResponseChange,
  onSubmit
}: {
  copy: (typeof invitationContent.copy)[InvitationLanguage];
  guestName: string;
  response: RsvpResponse;
  loading: boolean;
  error: string;
  status: string;
  onGuestNameChange: (value: string) => void;
  onResponseChange: (value: RsvpResponse) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <PaperSection className="mb-3">
      <form onSubmit={onSubmit}>
        <SectionTitle title={copy.rsvpTitle} />
        <label className="mt-5 block text-start">
          <span className="mb-2 block text-xs font-extrabold text-[#8a5b25]/64">{copy.guestName}</span>
          <input
            value={guestName}
            onChange={(event) => onGuestNameChange(event.target.value)}
            className="w-full rounded-full border border-[#d7b98a]/30 bg-white/72 px-4 py-3 text-sm font-bold text-[#3f291e] outline-none transition placeholder:text-[#8a5b25]/34 focus:border-[#c88f82] focus:bg-white"
            placeholder={copy.guestName}
            required
          />
        </label>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <RsvpChoice active={response === "accepted"} onClick={() => onResponseChange("accepted")} label={copy.accept} />
          <RsvpChoice active={response === "declined"} onClick={() => onResponseChange("declined")} label={copy.decline} />
        </div>
        <button
          disabled={loading}
          className="mt-3 w-full rounded-full bg-[linear-gradient(135deg,#c88f82,#7a1d21)] px-5 py-3 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(122,29,33,.16)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
        >
          {loading ? copy.sending : copy.send}
        </button>
        {error ? <p className="mt-3 rounded-xl border border-red-400/25 bg-red-500/10 p-2.5 text-xs font-bold text-red-800">{error}</p> : null}
        {status ? <p className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-2.5 text-xs font-bold text-emerald-800">{status}</p> : null}
      </form>
    </PaperSection>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-[clamp(1.65rem,7vw,2.2rem)] font-semibold leading-none text-[#7a1d21]">{title}</p>
      <Image src={assets.floralDivider} alt="" width={260} height={28} className="mx-auto mt-3 h-auto w-44 opacity-72" />
    </div>
  );
}

function RsvpChoice({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-2.5 text-xs font-extrabold transition ${
        active
          ? "border-[#c88f82]/50 bg-[#7a1d21] text-white shadow-[0_12px_26px_rgba(122,29,33,.15)]"
          : "border-[#d7b98a]/30 bg-white/56 text-[#8a5b25]/72 hover:border-[#c88f82]/45 hover:bg-white"
      }`}
    >
      {label}
    </button>
  );
}

function SoftParticles() {
  const reduceMotion = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        id: index,
        left: (index * 43) % 100,
        delay: (index % 8) * 0.75,
        duration: 13 + (index % 5) * 1.8,
        size: 5 + (index % 4)
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      <Image src={assets.petals} alt="" fill sizes="100vw" className="object-cover opacity-[0.14] mix-blend-multiply" />
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute top-[-7%] rounded-full bg-[#c88f82] shadow-[0_0_14px_rgba(200,143,130,.32)]"
          style={{ left: `${particle.left}%`, width: particle.size, height: Math.max(3, particle.size - 2), opacity: 0.22 }}
          animate={
            reduceMotion
              ? { opacity: [0.12, 0.2, 0.12] }
              : { y: ["0vh", "112vh"], x: [0, particle.id % 2 ? 16 : -14, 0], rotate: [0, 32, -16], opacity: [0, 0.28, 0.16, 0] }
          }
          transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
}

export function LuxuryInvitationMiniature({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#fff6ed] ${className}`}>
      <Image src={assets.background} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
      <Image src={assets.closedEnvelope} alt="" fill sizes="(min-width: 768px) 35vw, 100vw" className="object-contain p-[9%] drop-shadow-[0_24px_54px_rgba(125,86,52,.22)]" />
      <Image src={assets.waxSeal} alt="" width={90} height={90} className="absolute left-1/2 top-[55%] h-[21%] w-auto -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

export function LuxuryInvitationArtifact({
  isOpen,
  onOpen,
  language = "ar",
  brideName,
  groomName,
  initials,
  date,
  venue,
  message,
  sealImageUrl
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
  const copy = invitationContent.copy[language];
  const dateParts = formatDateParts(date || invitationContent.event.date, language);

  return (
    <div className="relative mx-auto grid min-h-[680px] max-w-[430px] place-items-center overflow-hidden rounded-[2rem] bg-[#fff6ed] p-3">
      <Image src={assets.background} alt="" fill sizes="430px" className="object-cover" />
      {!isOpen ? (
        <button type="button" onClick={onOpen} className="relative aspect-[900/1220] w-[min(84vw,360px)]">
          <Image src={assets.closedEnvelope} alt="" fill sizes="360px" className="object-contain" />
          <Image src={sealImageUrl || assets.waxSeal} alt="" width={90} height={90} className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2" />
          <MonogramMark value={language === "ar" ? "DA" : initials} className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 font-display text-[#fff4da]" />
        </button>
      ) : (
        <InvitationHero
          language={language}
          copy={copy}
          groomName={localizeName(groomName, invitationContent.couple.groom, language)}
          brideName={localizeName(brideName, invitationContent.couple.bride, language)}
          monogram={initials || getMonogram(groomName, brideName, language)}
          dateParts={dateParts}
          customMessage={cleanCustomMessage(message)}
        />
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
