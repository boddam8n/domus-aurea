"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Music2 } from "lucide-react";
import type { PublicInvitation } from "@/lib/invitations";

type RsvpResponse = "accepted" | "declined";
type InvitationLanguage = "ar" | "en";

type DateParts = {
  weekday: string;
  day: string;
  month: string;
  year: string;
  time: string;
  fullDate: string;
};

const assets = {
  background: "/assets/invitation/luxury-background.webp",
  closedEnvelope: "/assets/invitation/closed-envelope.webp",
  openedEnvelope: "/assets/invitation/opened-envelope.webp",
  paper: "/assets/invitation/invitation-paper.webp",
  seal: "/assets/invitation/wax-seal-gold.webp",
  brokenSeal: "/assets/invitation/wax-seal-broken.webp",
  petals: "/assets/invitation/petals.webp",
  burgundy: "/assets/invitation/burgundy-card-texture.webp",
  divider: "/assets/invitation/gold-divider.svg",
  calligraphy: "/assets/invitation/arabic-calligraphy-initials.svg"
};

const launchDate = "2026-12-12T20:00:00+02:00";
const arabicOpening = "تشرفت حكايتنا ببدايتها... ويشرّفها أن تكونوا شهودًا على أجمل فصولها.";
const arabicFormal = "يسرّنا دعوتكم لمشاركتنا حفل زفافنا، لتكتمل فرحتنا بحضوركم الكريم ودعواتكم الصادقة.";
const englishOpening = "Our story begins with love, and it would be our honor to have you witness one of its most beautiful chapters.";
const englishFormal = "We are delighted to invite you to celebrate our wedding day with us.";

const nameMap: Record<string, { ar: string; en: string }> = {
  "بودي": { ar: "بودي", en: "bobi" },
  "بدي": { ar: "بودي", en: "bobi" },
  bobi: { ar: "بودي", en: "bobi" },
  bobii: { ar: "بودي", en: "bobi" },
  "يوري": { ar: "يوري", en: "yori" },
  yori: { ar: "يوري", en: "yori" },
  "أحمد": { ar: "أحمد", en: "Ahmed" },
  "احمد": { ar: "أحمد", en: "Ahmed" },
  Ahmed: { ar: "أحمد", en: "Ahmed" },
  "مايار": { ar: "مايار", en: "Mayar" },
  Mayar: { ar: "مايار", en: "Mayar" }
};

function getSafeDate(value?: string | null) {
  const date = new Date(value || launchDate);
  return Number.isFinite(date.getTime()) ? date : new Date(launchDate);
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

function displayName(value: string, language: InvitationLanguage) {
  const cleaned = value.trim();
  return nameMap[cleaned]?.[language] || cleaned || (language === "ar" ? "ضيفنا" : "Guest");
}

function getInitialLetter(value: string) {
  return value.trim().replace(/\s+/g, "").charAt(0);
}

function getMonogram(groom: string, bride: string, language: InvitationLanguage) {
  const groomInitial = getInitialLetter(groom);
  const brideInitial = getInitialLetter(bride);
  if (!groomInitial && !brideInitial) return language === "ar" ? "د + أ" : "D & A";
  return language === "ar" ? `${groomInitial} + ${brideInitial}` : `${groomInitial.toUpperCase()} & ${brideInitial.toUpperCase()}`;
}

function cleanCustomMessage(message?: string | null) {
  const value = (message || "").trim();
  const blocked = [
    "بكل الحب والفرحة",
    "من العريس",
    "إلى عروسه",
    "اختارها قلبي",
    "heart chose",
    "from the groom"
  ];
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
    filter.frequency.value = 2400;
    master.gain.value = 0.04;
    master.connect(filter);
    filter.connect(context.destination);

    [392, 493.88, 587.33].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, context.currentTime + index * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.12 + index * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.1 + index * 0.08);
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(context.currentTime + index * 0.07);
      oscillator.stop(context.currentTime + 1.35 + index * 0.08);
    });

    window.setTimeout(() => void context.close(), 1600);
  } catch {
    // Gesture sounds are optional; the invitation still opens without audio.
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
  const direction = isArabic ? "rtl" : "ltr";
  const dateParts = useMemo(() => formatDateParts(invitation.wedding_date, language), [invitation.wedding_date, language]);
  const groomName = displayName(invitation.groom_name, language);
  const brideName = displayName(invitation.bride_name, language);
  const monogram = getMonogram(groomName, brideName, language);
  const venue = invitation.venue || (isArabic ? "فندق ريتز كارلتون - القاهرة" : "The Ritz-Carlton, Cairo");
  const customMessage = cleanCustomMessage(invitation.invitation_text);

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
        setStatus(isArabic ? "تم تسجيل ردك بنجاح. شكرًا لمشاركتكم." : "Your reply has been saved. Thank you.");
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
      if (!result.ok) throw new Error(json.error || (isArabic ? "لم يتم حفظ الرد." : "Your reply could not be saved."));
      setStatus(isArabic ? "تم تسجيل ردك بنجاح. شكرًا لمشاركتكم." : "Your reply has been saved. Thank you.");
      setGuestName("");
    } catch (rsvpError) {
      setError(rsvpError instanceof Error ? rsvpError.message : isArabic ? "حدث خطأ غير متوقع." : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      dir={direction}
      className="relative min-h-[100svh] overflow-x-hidden bg-[#efe2cf] text-[#241812] [color-scheme:light]"
      aria-label={isArabic ? "دعوة زفاف رقمية" : "Digital wedding invitation"}
    >
      <Image src={assets.background} alt="" fill priority sizes="100vw" className="fixed inset-0 object-cover" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_6%,rgba(255,248,229,.72),transparent_28%),linear-gradient(180deg,rgba(239,226,207,.78),rgba(236,218,190,.9)_56%,rgba(246,236,220,.96))]" />
      <DriftingPetals />
      <LanguageToggle language={language} onChange={setLanguage} />

      <main className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[480px] flex-col items-center px-3 pb-8 pt-[calc(env(safe-area-inset-top)+4.75rem)] sm:max-w-[520px] sm:px-5 lg:max-w-[560px]">
        <ClosedInvitation
          isOpen={isOpen}
          language={language}
          monogram={monogram}
          sealImageUrl={invitation.seal_image_url}
          onOpen={openInvitation}
        />

        <AnimatePresence>
          {isOpen ? (
            <motion.div
              className="w-full"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: reduceMotion ? 0 : 1.3, duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <InvitationCard
                language={language}
                groomName={groomName}
                brideName={brideName}
                monogram={monogram}
                venue={venue}
                dateParts={dateParts}
                customMessage={customMessage}
              />
              <EditorialCountdown target={invitation.wedding_date} language={language} dateParts={dateParts} />
              <RsvpPanel
                language={language}
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
    <div className="fixed left-3 top-[calc(env(safe-area-inset-top)+.75rem)] z-50 rounded-full border border-[#b58b48]/25 bg-[#fff7ea]/78 p-1 text-[11px] font-extrabold text-[#6a421d] shadow-[0_12px_34px_rgba(77,45,22,.14)] backdrop-blur-md">
      <div className="flex gap-1">
        {(["ar", "en"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`rounded-full px-3 py-1.5 transition ${
              language === item ? "bg-[#17110d] text-[#f8e8bf] shadow-[0_8px_20px_rgba(0,0,0,.18)]" : "text-[#7b5122]/68 hover:bg-white/70"
            }`}
          >
            {item === "ar" ? "عربي" : "EN"}
          </button>
        ))}
      </div>
    </div>
  );
}

function ClosedInvitation({
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
  const isArabic = language === "ar";

  return (
    <motion.div
      className={`grid min-h-[calc(100svh-7.5rem)] w-full place-items-center ${isOpen ? "pointer-events-none absolute opacity-0" : "relative"}`}
      initial={false}
      animate={isOpen ? { opacity: 0, y: -18, scale: 0.95 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-full">
        <motion.button
          type="button"
          onClick={onOpen}
          className="group relative mx-auto block aspect-[1080/1680] w-[min(88vw,390px)] outline-none [perspective:1600px]"
          whileTap={reduceMotion ? undefined : { scale: 0.985 }}
          aria-label={isArabic ? "فتح الدعوة" : "Open invitation"}
        >
          <motion.div
            className="relative h-full w-full overflow-visible"
            animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={assets.closedEnvelope}
              alt=""
              fill
              priority
              sizes="(min-width: 520px) 390px, 88vw"
              className="object-contain drop-shadow-[0_26px_58px_rgba(45,25,15,.34)]"
            />
            <div className="absolute inset-x-[19%] top-[14%] text-center">
              <p className="font-display text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d7b368]/78">
                {isArabic ? "DOMUS AUREA" : "DOMUS AUREA"}
              </p>
              <p className="mt-2 font-body text-[clamp(.84rem,4vw,1.1rem)] font-extrabold tracking-[0.12em] text-[#f5e4b6]">
                {isArabic ? "دعوة زفاف" : "Save the Date"}
              </p>
            </div>
            <motion.span
              className="absolute left-1/2 top-[65.3%] grid h-[clamp(76px,21vw,106px)] w-[clamp(76px,21vw,106px)] -translate-x-1/2 -translate-y-1/2 place-items-center"
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            >
              <Image
                src={sealImageUrl || assets.seal}
                alt=""
                fill
                sizes="112px"
                className="object-contain drop-shadow-[0_18px_34px_rgba(0,0,0,.38)] transition duration-500 group-hover:scale-[1.035]"
                unoptimized={Boolean(sealImageUrl)}
              />
              <span className="relative z-10 font-display text-[clamp(1rem,5vw,1.42rem)] font-semibold tracking-[0.04em] text-[#ffe7a6]">
                {monogram}
              </span>
            </motion.span>
            <div className="absolute inset-x-[15%] bottom-[12%] h-px bg-[linear-gradient(90deg,transparent,rgba(248,220,150,.72),transparent)]" />
          </motion.div>
        </motion.button>

        <motion.p
          className="mx-auto mt-4 w-fit rounded-full border border-[#b58b48]/24 bg-[#fff7ea]/74 px-5 py-2 text-center text-xs font-extrabold text-[#6a421d]/74 shadow-[0_14px_34px_rgba(77,45,22,.1)] backdrop-blur-md"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          {isArabic ? "اضغط على الختم لفتح الدعوة" : "Tap the seal to open the invitation"}
        </motion.p>
      </div>
    </motion.div>
  );
}

function InvitationCard({
  language,
  groomName,
  brideName,
  monogram,
  venue,
  dateParts,
  customMessage
}: {
  language: InvitationLanguage;
  groomName: string;
  brideName: string;
  monogram: string;
  venue: string;
  dateParts: DateParts;
  customMessage: string;
}) {
  const isArabic = language === "ar";
  const label = isArabic ? "دعوة زفاف" : "Wedding Invitation";
  const opening = isArabic ? arabicOpening : englishOpening;
  const formal = isArabic ? arabicFormal : englishFormal;

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.article
      className="relative mx-auto mt-1 aspect-[1080/1680] w-[min(94vw,430px)] overflow-hidden rounded-[1.25rem] text-center shadow-[0_30px_76px_rgba(69,38,20,.26)]"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.28 } } }}
    >
      <Image src={assets.paper} alt="" fill priority sizes="(min-width: 520px) 430px, 94vw" className="object-cover" />
      <div className="absolute inset-[3.8%] rounded-[1rem] border border-[#a7792d]/22 shadow-[inset_0_0_48px_rgba(255,255,255,.45)]" />
      <div className="absolute inset-x-[10%] top-[9.2%] h-px bg-[linear-gradient(90deg,transparent,rgba(167,121,45,.5),transparent)]" />
      <div className="absolute inset-x-[10%] bottom-[9.2%] h-px bg-[linear-gradient(90deg,transparent,rgba(167,121,45,.46),transparent)]" />

      <div className="absolute inset-[7%_7.2%_6.3%] z-10 flex flex-col items-center">
        <motion.p variants={itemVariants} className="text-[clamp(.55rem,2.3vw,.68rem)] font-extrabold uppercase tracking-[0.24em] text-[#8d602a]/76">
          {label}
        </motion.p>

        <motion.div variants={itemVariants} className="relative mt-[3.2%] grid place-items-center">
          <span
            className={`relative font-display text-[clamp(1.72rem,7.5vw,2.34rem)] font-semibold leading-none text-[#a7792d] [text-shadow:0_8px_24px_rgba(167,121,45,.18)] ${
              isArabic ? "font-body" : ""
            }`}
          >
            {monogram}
          </span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="mt-[3.6%] flex items-center justify-center gap-2 font-display text-[clamp(1.72rem,8.8vw,2.56rem)] leading-[1.08] text-[#2a1d17]">
          <span>{groomName}</span>
          <span className="text-[#a7792d]">&</span>
          <span>{brideName}</span>
        </motion.h1>

        <motion.div variants={itemVariants} className="mt-[3.8%] w-full max-w-[86%]">
          <Image src={assets.divider} alt="" width={420} height={32} className="mx-auto h-auto w-[62%]" />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-[3.6%] space-y-2.5 rounded-[.95rem] bg-[#fff8ec]/42 px-2.5 py-2 text-[clamp(.72rem,2.72vw,.9rem)] font-bold leading-[1.72] text-[#5c3c28] shadow-[inset_0_1px_0_rgba(255,255,255,.38)]">
          <p className={`${isArabic ? "font-body" : "font-display"} text-[clamp(.83rem,3.25vw,1.04rem)] font-extrabold leading-[1.62] text-[#6a421d]`}>
            {opening}
          </p>
          <p>{formal}</p>
          {customMessage ? <p className="mx-auto mt-2 max-w-[92%] text-[#7b5122]/86">{customMessage}</p> : null}
        </motion.div>

        <motion.div variants={itemVariants} className="mt-[5.6%] w-full rounded-[.95rem] border-y border-[#a7792d]/18 py-[3.5%]">
          <div className="flex items-center justify-center gap-2 font-display text-[clamp(.88rem,3.8vw,1.15rem)] font-semibold uppercase tracking-[0.1em] text-[#2a1d17]">
            <span>{dateParts.weekday}</span>
            <span className="h-4 w-px bg-[#a7792d]/32" />
            <span className="text-[clamp(1.55rem,7vw,2.05rem)] text-[#7a1d21]">{dateParts.day}</span>
            <span className="h-4 w-px bg-[#a7792d]/32" />
            <span>{dateParts.month}</span>
          </div>
          <p className="mt-1 font-display text-[clamp(.82rem,3vw,1rem)] font-semibold text-[#8d602a]">{dateParts.year}</p>
          <p className="mt-1 text-[clamp(.74rem,2.6vw,.9rem)] font-extrabold text-[#4d3021]">{dateParts.time}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-[4.2%] grid w-full grid-cols-1 gap-2">
          <DetailLine label={isArabic ? "المكان" : "Venue"} value={venue} />
        </motion.div>
      </div>
    </motion.article>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[.78rem] border border-[#a7792d]/12 bg-[#fff8ec]/34 px-2.5 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.42)]">
      <p className="text-[clamp(.48rem,1.75vw,.58rem)] font-extrabold uppercase tracking-[0.16em] text-[#8d602a]/70">{label}</p>
      <p className="mt-1 text-[clamp(.64rem,2.28vw,.78rem)] font-bold leading-4 text-[#352216]">{value}</p>
    </div>
  );
}

function EditorialCountdown({ target, language, dateParts }: { target: string; language: InvitationLanguage; dateParts: DateParts }) {
  const [now, setNow] = useState(() => Date.now());
  const isArabic = language === "ar";

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const units = useMemo(() => {
    const targetMs = getSafeDate(target).getTime();
    const diff = Math.max(0, targetMs - now);
    return [
      { label: isArabic ? "يوم" : "Days", value: Math.floor(diff / 86_400_000) },
      { label: isArabic ? "ساعة" : "Hours", value: Math.floor((diff % 86_400_000) / 3_600_000) },
      { label: isArabic ? "دقيقة" : "Minutes", value: Math.floor((diff % 3_600_000) / 60_000) },
      { label: isArabic ? "ثانية" : "Seconds", value: Math.floor((diff % 60_000) / 1000) }
    ];
  }, [isArabic, now, target]);

  return (
    <motion.section
      className="relative mx-auto mt-5 w-[min(94vw,430px)] overflow-hidden rounded-[1.2rem] border border-[#c19446]/30 bg-[#36090c] px-4 py-5 text-center text-[#f8e8bf] shadow-[0_22px_62px_rgba(58,12,14,.22)]"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image src={assets.burgundy} alt="" fill sizes="430px" className="object-cover opacity-75" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,232,190,.2),transparent_56%)]" />
      <div className="relative z-10">
        <p className="font-display text-[.68rem] font-semibold uppercase tracking-[0.26em] text-[#e8c679]/82">
          {isArabic ? "الوقت المتبقي" : "Until the day"}
        </p>
        <div className="mt-2 flex items-center justify-center gap-2 font-display text-[clamp(.78rem,3vw,.95rem)] uppercase tracking-[0.08em] text-[#fff1c9]">
          <span>{dateParts.weekday}</span>
          <span className="h-3 w-px bg-[#d8ad5e]/45" />
          <span>{dateParts.day}</span>
          <span className="h-3 w-px bg-[#d8ad5e]/45" />
          <span>{dateParts.month}</span>
        </div>
        <div className="mt-4 grid grid-cols-4 divide-x divide-[#d8ad5e]/22 rtl:divide-x-reverse">
          {units.map((unit) => (
            <div key={unit.label} className="px-1">
              <p className="font-display text-[clamp(1.35rem,7vw,2.1rem)] leading-none text-[#f8d88a]">{String(unit.value).padStart(2, "0")}</p>
              <p className="mt-1 text-[clamp(.48rem,1.8vw,.6rem)] font-extrabold text-[#f8e8bf]/66">{unit.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function RsvpPanel({
  language,
  guestName,
  response,
  loading,
  error,
  status,
  onGuestNameChange,
  onResponseChange,
  onSubmit
}: {
  language: InvitationLanguage;
  guestName: string;
  response: RsvpResponse;
  loading: boolean;
  error: string;
  status: string;
  onGuestNameChange: (value: string) => void;
  onResponseChange: (value: RsvpResponse) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const isArabic = language === "ar";

  return (
    <motion.form
      onSubmit={onSubmit}
      className="mx-auto mt-4 w-[min(94vw,430px)] rounded-[1.2rem] border border-[#b58b48]/22 bg-[#fff8ec]/82 p-4 text-[#2a1d17] shadow-[0_20px_54px_rgba(77,45,22,.12),inset_0_1px_0_rgba(255,255,255,.62)] backdrop-blur-sm"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="text-center">
        <p className="font-display text-xl text-[#6a421d]">{isArabic ? "تأكيد الحضور" : "RSVP"}</p>
        <Image src={assets.divider} alt="" width={260} height={20} className="mx-auto mt-2 h-auto w-40 opacity-70" />
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-xs font-extrabold text-[#7b5122]/72">{isArabic ? "اسم الضيف" : "Guest Name"}</span>
        <input
          value={guestName}
          onChange={(event) => onGuestNameChange(event.target.value)}
          className="w-full rounded-full border border-[#b58b48]/24 bg-white/76 px-4 py-3 text-sm font-bold text-[#2a1d17] outline-none transition placeholder:text-[#7b5122]/35 focus:border-[#a7792d] focus:bg-white"
          placeholder={isArabic ? "اكتب اسمك هنا" : "Enter your name"}
          required
        />
      </label>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <RsvpChoice active={response === "accepted"} onClick={() => onResponseChange("accepted")} label={isArabic ? "قبول الدعوة" : "Accept"} />
        <RsvpChoice active={response === "declined"} onClick={() => onResponseChange("declined")} label={isArabic ? "اعتذار" : "Apologize"} />
      </div>

      <button
        disabled={loading}
        className="mt-3 w-full rounded-full bg-[linear-gradient(135deg,#17110d,#3f1013)] px-5 py-3 text-sm font-extrabold text-[#f8e8bf] shadow-[0_14px_34px_rgba(58,12,14,.18)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
      >
        {loading ? (isArabic ? "جاري الإرسال..." : "Sending...") : isArabic ? "إرسال" : "Send"}
      </button>

      {error ? <p className="mt-3 rounded-xl border border-red-400/25 bg-red-500/10 p-2.5 text-xs font-bold text-red-800">{error}</p> : null}
      {status ? <p className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-2.5 text-xs font-bold text-emerald-800">{status}</p> : null}
    </motion.form>
  );
}

function RsvpChoice({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-2.5 text-xs font-extrabold transition ${
        active
          ? "border-[#a7792d]/50 bg-[#3f1013] text-[#f8e8bf] shadow-[0_12px_26px_rgba(58,12,14,.16)]"
          : "border-[#b58b48]/24 bg-white/62 text-[#6a421d]/72 hover:border-[#a7792d]/45 hover:bg-white"
      }`}
    >
      {label}
    </button>
  );
}

function DriftingPetals() {
  const reduceMotion = useReducedMotion();
  const petals = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        id: index,
        left: (index * 41) % 100,
        delay: (index % 7) * 0.85,
        duration: 14 + (index % 5) * 2,
        size: 5 + (index % 4)
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      <Image src={assets.petals} alt="" fill sizes="100vw" className="object-cover opacity-[0.16] mix-blend-multiply" />
      {petals.map((petal) => (
        <motion.span
          key={petal.id}
          className="absolute top-[-8%] rounded-full bg-[#a7792d] shadow-[0_0_14px_rgba(167,121,45,.38)]"
          style={{ left: `${petal.left}%`, width: petal.size, height: Math.max(3, petal.size - 2), opacity: 0.24 }}
          animate={
            reduceMotion
              ? { opacity: [0.12, 0.2, 0.12] }
              : { y: ["0vh", "112vh"], x: [0, petal.id % 2 ? 18 : -16, 0], rotate: [0, 34, -18], opacity: [0, 0.3, 0.16, 0] }
          }
          transition={{ duration: petal.duration, repeat: Infinity, delay: petal.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
}

export function LuxuryInvitationMiniature({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#efe2cf] ${className}`}>
      <Image src={assets.background} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
      <div className="absolute inset-0 bg-[#f8ead2]/18" />
      <Image
        src={assets.closedEnvelope}
        alt=""
        fill
        sizes="(min-width: 768px) 35vw, 100vw"
        className="object-contain p-[8%] drop-shadow-[0_22px_55px_rgba(45,25,15,.32)]"
      />
      <Image
        src={assets.seal}
        alt=""
        width={92}
        height={92}
        className="absolute left-1/2 top-[64%] h-[22%] w-auto -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_12px_28px_rgba(0,0,0,.28)]"
      />
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
  time = "",
  venue,
  message,
  countdownTarget,
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
  const dateParts: DateParts = {
    weekday: language === "ar" ? "السبت" : "Saturday",
    day: language === "ar" ? "١٢" : "12",
    month: language === "ar" ? "ديسمبر" : "December",
    year: language === "ar" ? "٢٠٢٦" : "2026",
    time,
    fullDate: date || (language === "ar" ? "السبت، ١٢ ديسمبر ٢٠٢٦" : "Saturday, December 12, 2026")
  };

  return (
    <div className="relative grid min-h-[560px] w-full place-items-center overflow-hidden rounded-[1.5rem] bg-[#efe2cf] p-4">
      <Image src={assets.background} alt="" fill sizes="100vw" className="object-cover" />
      {!isOpen ? (
        <button type="button" onClick={onOpen} className="relative aspect-[1080/1680] w-[min(78vw,330px)]">
          <Image src={assets.closedEnvelope} alt="" fill sizes="330px" className="object-contain" />
          <Image src={sealImageUrl || assets.seal} alt="" width={92} height={92} className="absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2" />
          <span className="absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2 font-display text-[#ffe7a6]">{initials}</span>
        </button>
      ) : (
        <InvitationCard
          language={language}
          groomName={displayName(groomName, language)}
          brideName={displayName(brideName, language)}
          monogram={initials || getMonogram(groomName, brideName, language)}
          venue={venue}
          dateParts={dateParts}
          customMessage={cleanCustomMessage(message)}
        />
      )}
      {isOpen && countdownTarget ? null : null}
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
