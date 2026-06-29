"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { Music2 } from "lucide-react";
import type { PublicInvitation } from "@/lib/invitations";

type RsvpResponse = "accepted" | "declined";
type InvitationLanguage = "ar" | "en";

const assets = {
  background: "/assets/invitation-blush/background.webp",
  doorsClosed: "/assets/invitation-blush/doors-closed-wide.webp",
  cardTall: "/assets/invitation-blush/invitation-card-tall.webp",
  seal: "/assets/invitation-blush/wax-seal.webp",
  petals: "/assets/invitation-blush/petals.webp",
  light: "/assets/invitation-blush/light-burst.webp"
};

const fallbackMessage = "يسرّنا دعوتكم لمشاركتنا حفل زفافنا، لتكتمل فرحتنا بحضوركم الكريم ودعواتكم الصادقة.";
const arabicOpening = "تشرفت حكايتنا ببدايتها... ويشرّفها أن تكونوا شهودًا على أجمل فصولها.";
const englishOpening = "Our story was blessed by its beginning, and it would be honored by your presence as witnesses to its most beautiful chapter.";
const englishFormalMessage = "We are delighted to invite you to share our wedding celebration, so our joy may be complete with your presence and heartfelt blessings.";

function getInvitationDateParts(value: string, language: InvitationLanguage) {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return { date: value || (language === "ar" ? "قريبًا" : "Soon"), time: "" };
  }

  const locale = language === "ar" ? "ar-EG" : "en-US";

  return {
    date: new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date),
    time: new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit"
    }).format(date)
  };
}

function getInitials(brideName: string, groomName: string) {
  const bride = brideName.trim().charAt(0);
  const groom = groomName.trim().charAt(0);
  return `${groom}${bride}`.trim().toUpperCase() || "DA";
}

function playRoyalOpenSound() {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const master = context.createGain();
    const shimmer = context.createGain();
    const filter = context.createBiquadFilter();
    master.gain.value = 0.045;
    shimmer.gain.value = 0.0001;
    filter.type = "lowpass";
    filter.frequency.value = 2400;
    filter.Q.value = 0.5;
    master.connect(filter);
    filter.connect(context.destination);

    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, context.currentTime + index * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.06, context.currentTime + 0.08 + index * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.2 + index * 0.08);
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(context.currentTime + index * 0.06);
      oscillator.stop(context.currentTime + 1.45 + index * 0.08);
    });

    window.setTimeout(() => void context.close(), 1800);
  } catch {
    // Some browsers block short gesture sounds in privacy modes.
  }
}

export function InvitationExperience({ invitation }: { invitation: PublicInvitation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [language, setLanguage] = useState<InvitationLanguage>("ar");
  const [guestName, setGuestName] = useState("");
  const [response, setResponse] = useState<RsvpResponse>("accepted");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const direction = language === "ar" ? "rtl" : "ltr";
  const dateParts = useMemo(() => getInvitationDateParts(invitation.wedding_date, language), [invitation.wedding_date, language]);
  const initials = useMemo(() => getInitials(invitation.bride_name, invitation.groom_name), [invitation.bride_name, invitation.groom_name]);
  const invitationText = invitation.invitation_text || fallbackMessage;
  const handleReading = useCallback(() => setIsReading(true), []);

  useEffect(() => {
    if (invitation.id === "demo") return;
    fetch(`/api/invitations/${invitation.slug}/view`, { method: "POST" }).catch(() => undefined);
  }, [invitation.id, invitation.slug]);

  function openInvitation() {
    if (isOpen) return;
    playRoyalOpenSound();
    setIsOpen(true);
  }

  async function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    setLoading(true);

    if (invitation.id === "demo") {
      window.setTimeout(() => {
        setStatus(language === "ar" ? "تم تسجيل ردك بنجاح. شكرًا لمشاركتك." : "Your reply has been saved. Thank you for sharing this moment.");
        setGuestName("");
        setLoading(false);
      }, 520);
      return;
    }

    try {
      const result = await fetch(`/api/invitations/${invitation.slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestName, response })
      });
      const json = await result.json();
      if (!result.ok) throw new Error(json.error || (language === "ar" ? "لم يتم حفظ الرد." : "Your reply could not be saved."));
      setStatus(language === "ar" ? "تم تسجيل ردك بنجاح. شكرًا لمشاركتك." : "Your reply has been saved. Thank you for sharing this moment.");
      setGuestName("");
    } catch (rsvpError) {
      setError(rsvpError instanceof Error ? rsvpError.message : language === "ar" ? "حدث خطأ غير متوقع." : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section dir={direction} className="relative min-h-[100svh] overflow-x-hidden bg-[#fff5f1] text-[#432819]">
      <div className="relative min-h-[100svh]">
        <Image src={assets.background} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_9%,rgba(255,247,240,.82),transparent_38%),linear-gradient(180deg,rgba(255,248,244,.62),rgba(255,237,230,.76)_58%,#fff8f4_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,251,246,.68),transparent_30%,transparent_70%,rgba(255,251,246,.68))]" />
        <div className="pointer-events-none absolute inset-3 hidden rounded-[2rem] border border-[#d8a887]/20 shadow-[inset_0_0_80px_rgba(255,255,255,.22)] sm:block" />
        <RosePetals />
        <GoldDust />

        <main className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1920px] flex-col items-center justify-center px-2 py-6 sm:px-5 lg:px-8">
        <LanguageToggle language={language} onChange={setLanguage} />

        <RoyalDoorStage
          isOpen={isOpen}
          isReading={isReading}
          onOpen={openInvitation}
          onReading={handleReading}
          language={language}
          brideName={invitation.bride_name}
          groomName={invitation.groom_name}
          initials={initials}
          date={dateParts.date}
          time={dateParts.time}
          venue={invitation.venue}
          message={invitationText}
          sealImageUrl={invitation.seal_image_url}
        />

        <motion.div
          initial={false}
          animate={isReading ? { opacity: 1, y: 0, height: "auto" } : { opacity: 0, y: 18, height: 0 }}
          transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-6xl overflow-hidden"
        >
          <div className="relative mt-6 overflow-hidden rounded-[1.6rem] border border-[#d9a681]/38 bg-[linear-gradient(135deg,rgba(255,255,255,.76),rgba(255,238,231,.58))] p-4 shadow-[0_26px_90px_rgba(173,99,82,.16),inset_0_1px_0_rgba(255,255,255,.7)] backdrop-blur-xl sm:p-5">
            <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,#d9a681,transparent)]" />
            <p className="text-center text-sm font-extrabold tracking-[0.16em] text-[#a46a43]">{language === "ar" ? "الوقت المتبقي" : "Countdown"}</p>
            <LuxuryCountdown target={invitation.wedding_date} language={language} />
          </div>
        </motion.div>

        <motion.form
          onSubmit={submitRsvp}
          initial={false}
          animate={isReading ? { opacity: 1, y: 0, height: "auto" } : { opacity: 0, y: 22, height: 0 }}
          transition={{ duration: 0.78, delay: isReading ? 0.1 : 0, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-6xl overflow-hidden"
        >
          <div className="relative mt-5 overflow-hidden rounded-[1.6rem] border border-[#d9a681]/30 bg-[linear-gradient(135deg,rgba(255,255,255,.78),rgba(255,240,234,.62))] p-4 shadow-[0_24px_90px_rgba(173,99,82,.14),inset_0_1px_0_rgba(255,255,255,.7)] backdrop-blur-xl sm:p-5">
            <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,#d9a681,transparent)]" />
            <div className="mb-5 text-center">
              <p className="font-display text-2xl text-[#9b653f]">{language === "ar" ? "تأكيد الحضور" : "Kindly RSVP"}</p>
              <p className="mt-1 text-sm font-bold text-[#6e4a35]/62">{language === "ar" ? "اكتب اسمك واختر ردك بكل بساطة" : "Write your name and choose your reply"}</p>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <label className="flex-1">
                <span className="mb-2 block text-sm font-bold text-[#6e4a35]/70">{language === "ar" ? "اسم الضيف" : "Guest name"}</span>
                <input
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  className="w-full rounded-2xl border border-[#d9a681]/34 bg-white/76 px-5 py-4 text-[#432819] shadow-[inset_0_1px_0_rgba(255,255,255,.72)] outline-none transition placeholder:text-[#8f5d39]/42 focus:border-[#c98674] focus:bg-white"
                  placeholder={language === "ar" ? "اكتب اسمك هنا" : "Enter your name"}
                  required
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2 md:w-[330px]">
                <RsvpChoice active={response === "accepted"} onClick={() => setResponse("accepted")} label={language === "ar" ? "قبول الدعوة" : "Accept"} />
                <RsvpChoice active={response === "declined"} onClick={() => setResponse("declined")} label={language === "ar" ? "اعتذار" : "Decline"} />
              </div>
              <button
                disabled={loading}
                className="rounded-full bg-[linear-gradient(135deg,#c98d62,#8f5d39)] px-7 py-4 font-extrabold text-white shadow-[0_18px_48px_rgba(183,122,90,.24)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_62px_rgba(183,122,90,.28)] disabled:translate-y-0 disabled:opacity-55 md:w-[170px]"
              >
                {loading ? (language === "ar" ? "جاري الحفظ..." : "Saving...") : language === "ar" ? "إرسال" : "Send"}
              </button>
            </div>
            {error ? <p className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-800">{error}</p> : null}
            {status ? <p className="mt-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm text-emerald-800">{status}</p> : null}
          </div>
        </motion.form>
        </main>
      </div>
    </section>
  );
}

function LanguageToggle({ language, onChange }: { language: InvitationLanguage; onChange: (language: InvitationLanguage) => void }) {
  return (
    <div className="absolute left-4 top-4 z-30 inline-flex rounded-full border border-[#d9a681]/34 bg-white/54 p-1 text-[11px] font-extrabold text-[#8f5d39] shadow-[0_16px_44px_rgba(183,122,90,.14)] backdrop-blur-xl sm:left-6 sm:top-6">
      {(["ar", "en"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`rounded-full px-3 py-2 transition ${
            language === item ? "bg-[#d9a681] text-white shadow-[0_8px_22px_rgba(183,122,90,.18)]" : "text-[#8f5d39]/70 hover:bg-white/55"
          }`}
        >
          {item === "ar" ? "عربي" : "EN"}
        </button>
      ))}
    </div>
  );
}

export function LuxuryInvitationMiniature({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#fff4f0] ${className}`}>
      <Image src={assets.background} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
      <div className="absolute inset-0 bg-white/22" />
      <Image src={assets.doorsClosed} alt="" fill sizes="(min-width: 768px) 35vw, 100vw" className="object-contain p-[7%] drop-shadow-[0_22px_55px_rgba(160,90,70,.28)]" />
    </div>
  );
}

export function LuxuryInvitationArtifact(props: {
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
  sealImageUrl?: string | null;
}) {
  const [isReading, setIsReading] = useState(props.isOpen);
  const handleReading = useCallback(() => setIsReading(true), []);

  useEffect(() => {
    setIsReading(props.isOpen);
  }, [props.isOpen]);

  return <RoyalDoorStage {...props} language={props.language ?? "ar"} isReading={isReading} onReading={handleReading} compact />;
}

function RoyalDoorStage({
  isOpen,
  isReading,
  onOpen,
  onReading,
  language,
  brideName,
  groomName,
  initials,
  date,
  time = "",
  venue,
  message,
  sealImageUrl,
  compact = false
}: {
  isOpen: boolean;
  isReading: boolean;
  onOpen: () => void;
  onReading: () => void;
  language: InvitationLanguage;
  brideName: string;
  groomName: string;
  initials: string;
  date: string;
  time?: string;
  venue: string;
  message: string;
  sealImageUrl?: string | null;
  compact?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const leftDoorRef = useRef<HTMLDivElement | null>(null);
  const rightDoorRef = useRef<HTMLDivElement | null>(null);
  const openDoorsRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const lightRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const nodes = [leftDoorRef.current, rightDoorRef.current, openDoorsRef.current, cardRef.current, lightRef.current, sealRef.current, contentRef.current].filter(Boolean);
    const finishReveal = () => {
      onReading();
      if (!compact && cardRef.current) {
        window.setTimeout(() => {
          cardRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        }, 80);
      }
    };

    if (!isOpen) {
      gsap.set(nodes, { clearProps: "all" });
      gsap.set(openDoorsRef.current, { autoAlpha: 0, scale: 0.98 });
      gsap.set(lightRef.current, { autoAlpha: 0, scale: 0.7 });
      gsap.set(cardRef.current, { autoAlpha: 0, y: 42, scale: 0.88, filter: "blur(9px)" });
      gsap.set(contentRef.current, { autoAlpha: 0, y: 10 });
      return;
    }

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(leftDoorRef.current, { xPercent: -58, autoAlpha: 0 });
        gsap.set(rightDoorRef.current, { xPercent: 58, autoAlpha: 0 });
        gsap.set(openDoorsRef.current, { autoAlpha: 1, scale: 1 });
        gsap.set(lightRef.current, { autoAlpha: 0.92, scale: 1 });
        gsap.set(sealRef.current, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(cardRef.current, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)" });
        gsap.set(contentRef.current, { autoAlpha: 1, y: 0 });
        finishReveal();
        return;
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: finishReveal
      });

      timeline
        .to(sealRef.current, { scale: 1.07, duration: 0.34, ease: "power2.out" }, 0)
        .to(sealRef.current, { autoAlpha: 0, scale: 0.88, duration: 0.86, ease: "power2.inOut" }, 0.34)
        .to(leftDoorRef.current, { xPercent: -74, rotateY: -18, autoAlpha: 0.08, duration: 2.65, ease: "expo.inOut" }, 0.64)
        .to(rightDoorRef.current, { xPercent: 74, rotateY: 18, autoAlpha: 0.08, duration: 2.65, ease: "expo.inOut" }, 0.64)
        .to(openDoorsRef.current, { autoAlpha: 1, scale: 1.04, duration: 2.1, ease: "power3.out" }, 0.92)
        .to(lightRef.current, { autoAlpha: 0.98, scale: 1.34, duration: 2.35, ease: "power2.out" }, 0.8)
        .to(cardRef.current, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.92, ease: "expo.out" }, 1.86)
        .to(contentRef.current, { autoAlpha: 1, y: 0, duration: 1.08, ease: "power2.out" }, 2.58)
        .set(sealRef.current, { pointerEvents: "none" }, 0.36);
    }, stageRef);

    return () => ctx.revert();
  }, [compact, isOpen, onReading, reduceMotion]);

  const isArabic = language === "ar";
  const labels = {
    invite: isArabic ? "دعوة زفاف" : "Wedding Invitation",
    venue: isArabic ? "المكان" : "Venue",
    date: isArabic ? "التاريخ" : "Date",
    time: isArabic ? "الساعة" : "Time",
    soon: isArabic ? "قريبًا" : "Soon",
    honor: isArabic ? "نتشرف بحضوركم" : "With love and joy",
    hint: isArabic ? "اضغط على الختم لفتح الدعوة" : "Click the seal to open"
  };

  return (
    <div className="relative w-full">
      <div
        ref={stageRef}
        data-reading={isReading ? "true" : "false"}
        className={`relative mx-auto grid w-full place-items-center ${
          compact ? "min-h-[560px]" : "min-h-[clamp(640px,100svh,980px)] md:min-h-[100svh]"
        }`}
      >
        <div className="absolute left-1/2 top-[84%] h-20 w-[min(88vw,980px)] -translate-x-1/2 rounded-full bg-[#b9796a]/16 blur-3xl" />

        <div ref={lightRef} className="pointer-events-none absolute left-1/2 top-[44%] z-10 w-[min(132vw,1500px)] -translate-x-1/2 -translate-y-1/2 opacity-0">
          <Image src={assets.light} alt="" width={1600} height={900} className="h-auto w-full mix-blend-screen" />
        </div>

        <div ref={openDoorsRef} className="pointer-events-none absolute left-1/2 top-[43%] z-20 aspect-[1672/941] w-[min(100vw,1280px)] -translate-x-1/2 -translate-y-1/2 opacity-0">
          <div className="absolute inset-[2%] rounded-[2rem] border border-[#d9a681]/38 shadow-[0_34px_92px_rgba(155,88,71,.18),inset_0_0_90px_rgba(255,244,232,.5)]" />
          <div className="absolute inset-y-[9%] left-1/2 w-px bg-[linear-gradient(180deg,transparent,rgba(217,166,129,.62),transparent)]" />
        </div>

        <div data-closed-invitation className="absolute left-1/2 top-[43%] z-30 aspect-[1672/941] w-[min(96vw,1240px)] -translate-x-1/2 -translate-y-1/2 md:w-[min(94vw,1320px)] [perspective:1700px]">
          <div
            ref={leftDoorRef}
            className="absolute inset-y-0 left-0 w-1/2 bg-[url('/assets/invitation-blush/doors-closed-wide.webp')] bg-[length:200%_100%] bg-left bg-no-repeat drop-shadow-[0_30px_80px_rgba(155,88,71,.28)] will-change-transform"
          />
          <div
            ref={rightDoorRef}
            className="absolute inset-y-0 right-0 w-1/2 bg-[url('/assets/invitation-blush/doors-closed-wide.webp')] bg-[length:200%_100%] bg-right bg-no-repeat drop-shadow-[0_30px_80px_rgba(155,88,71,.28)] will-change-transform"
          />
        </div>

        <div
          ref={cardRef}
          data-invitation-card
          className={
            compact
              ? "relative z-40 mt-2 w-[min(94vw,410px)] opacity-0 md:w-[min(86vw,920px)]"
              : isReading
                ? "relative z-40 mt-8 w-[min(96vw,430px)] scroll-mt-28 opacity-0 md:mt-10 md:w-[94vw] md:scroll-mt-28 2xl:w-[92vw]"
                : "absolute left-0 right-0 top-[clamp(110px,12svh,170px)] z-40 mx-auto w-[min(96vw,430px)] opacity-0 md:w-[94vw] 2xl:w-[92vw]"
          }
        >
          <div className="relative min-h-[1180px] w-full overflow-hidden rounded-[1.35rem] drop-shadow-[0_48px_130px_rgba(155,88,71,.3)] md:aspect-[864/1821] md:min-h-0">
            <Image src={assets.cardTall} alt="" fill sizes={compact ? "(min-width: 768px) 86vw, 96vw" : "94vw"} className="object-cover md:object-contain" priority={isOpen} />
            <div className="pointer-events-none absolute inset-[3%] rounded-[1.25rem] border border-[#d9a681]/28 shadow-[inset_0_0_70px_rgba(255,255,255,.38)]" />
            <div className="pointer-events-none absolute inset-x-[8%] top-[6%] h-px bg-[linear-gradient(90deg,transparent,rgba(217,166,129,.64),transparent)]" />
            <div className="pointer-events-none absolute inset-x-[8%] bottom-[6%] h-px bg-[linear-gradient(90deg,transparent,rgba(217,166,129,.5),transparent)]" />
            <CardSoftOverlays />
            <div ref={contentRef} dir={isArabic ? "rtl" : "ltr"} className="absolute inset-[8%_8%_7%] z-10 flex flex-col items-center text-center text-[#432819] opacity-0 md:inset-[9%_10%_7%]">
              <p className="mt-[2%] text-[clamp(.62rem,1.05vw,1rem)] font-extrabold tracking-[0.18em] text-[#b77a5a]">{labels.invite}</p>
              <div className="my-[3.5%] flex items-center gap-3 text-[#c28a67] md:my-[3%]">
                <span className="h-px w-16 bg-[linear-gradient(90deg,transparent,#c28a67)]" />
                <span className="text-xs">◆</span>
                <span className="h-px w-16 bg-[linear-gradient(90deg,#c28a67,transparent)]" />
              </div>
              <h1 className="font-display text-[clamp(1.65rem,7.4vw,2.35rem)] leading-[1.16] text-[#9b653f] [text-shadow:0_10px_28px_rgba(183,122,90,.12)] md:text-[clamp(3.2rem,5.45vw,6.6rem)]">
                {groomName} <span className="mx-2 text-[#c98778]">&</span> {brideName}
              </h1>
              <InvitationCopyBlock language={language} brideName={brideName} message={message} />

              <div className="mt-[7%] grid w-full max-w-[86%] grid-cols-1 gap-2.5 text-[#432819] md:mt-[5.6%] md:max-w-5xl md:grid-cols-3 md:gap-4">
                <InvitationInfo label={labels.venue} value={venue} />
                <InvitationInfo label={labels.date} value={date} />
                <InvitationInfo label={labels.time} value={time || labels.soon} />
              </div>

              <div className="mt-auto h-px w-[64%] bg-[linear-gradient(90deg,transparent,rgba(194,138,103,.55),transparent)]" />
              <p className="mt-[2%] text-[clamp(.68rem,1.1vw,.94rem)] font-extrabold text-[#b77a5a]">{labels.honor}</p>
            </div>
          </div>
        </div>

        <button
          ref={sealRef}
          type="button"
          disabled={isOpen}
          onClick={onOpen}
          aria-label="Open invitation seal"
          className="absolute left-1/2 top-[43%] z-50 grid h-[clamp(84px,12vw,150px)] w-[clamp(84px,12vw,150px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none transition duration-500 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#d89688]"
        >
          <Image
            src={sealImageUrl || assets.seal}
            alt=""
            fill
            sizes="132px"
            className="object-contain drop-shadow-[0_18px_42px_rgba(156,79,71,.3)]"
            unoptimized={Boolean(sealImageUrl)}
          />
          {sealImageUrl ? <span className="pointer-events-none absolute font-display text-[clamp(1.05rem,2.6vw,1.9rem)] text-[#fff7ec]">{initials}</span> : null}
        </button>

        <AnimatePresence>
          {!isOpen ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-[10%] z-40 rounded-full border border-[#d9a681]/28 bg-white/46 px-5 py-2 text-xs font-bold text-[#8f5d39]/76 shadow-[0_18px_48px_rgba(183,122,90,.12)] backdrop-blur-xl md:bottom-[8%]"
            >
              {labels.hint}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function InvitationCopyBlock({ language, brideName, message }: { language: InvitationLanguage; brideName: string; message: string }) {
  const isArabic = language === "ar";
  const cleanedMessage = message.trim();
  const shouldShowCustomMessage = Boolean(cleanedMessage && cleanedMessage !== fallbackMessage && !cleanedMessage.includes("بكل الحب والفرحة"));
  const opening = isArabic ? arabicOpening : englishOpening;
  const formalMessage = isArabic ? fallbackMessage : englishFormalMessage;
  const groomLabel = isArabic ? "من العريس إلى عروسه" : "From the groom to his bride";
  const groomMessage = isArabic
    ? `إلى ${brideName}، من اختارها قلبي شريكةً للعمر... بكِ تكتمل الحكاية، وبقربك يصبح الفرح بيتًا نعود إليه.`
    : `To ${brideName}, the one my heart chose for a lifetime... with you, every chapter becomes softer, brighter, and complete.`;

  return (
    <div className="relative mt-[5.8%] w-full max-w-[90%] text-[#5a3927] md:mt-[4.6%] md:max-w-[74%]">
      <div className="pointer-events-none absolute -inset-x-3 -inset-y-4 rounded-[2rem] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.6),transparent_62%)] opacity-70" />
      <div className="relative rounded-[1.35rem] border border-[#d9a681]/18 bg-white/18 px-3 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,.5)] backdrop-blur-[1px] md:px-7 md:py-6">
        <div className="mx-auto mb-3 flex max-w-[220px] items-center justify-center gap-3 text-[#c28a67]">
          <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,#c28a67)]" />
          <span className="font-display text-lg leading-none">♡</span>
          <span className="h-px flex-1 bg-[linear-gradient(90deg,#c28a67,transparent)]" />
        </div>
        <div className="space-y-3 text-[clamp(.7rem,2.65vw,.94rem)] font-bold leading-[1.88] text-[#4d3124]/86 md:space-y-4 md:text-[clamp(.84rem,1.03vw,1.05rem)] md:leading-[2.02]">
          <p className="font-display text-[clamp(.98rem,3.75vw,1.34rem)] leading-[1.55] text-[#9b653f] md:text-[clamp(1.08rem,1.5vw,1.5rem)]">{opening}</p>
          <p className="text-[#6e4a35]">{formalMessage}</p>
          <div className="mx-auto max-w-2xl rounded-[1.1rem] border border-[#d9a681]/18 bg-[#fff8f3]/38 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,.44)]">
            <p className="text-[clamp(.58rem,1.85vw,.76rem)] font-black uppercase tracking-[0.2em] text-[#b77a5a]/72">{groomLabel}</p>
            <p className="mt-2 font-display text-[clamp(.88rem,3vw,1.18rem)] leading-[1.8] text-[#8f5d39]">{groomMessage}</p>
          </div>
          {shouldShowCustomMessage ? <p className="text-[#8f5d39]/86">{cleanedMessage}</p> : null}
        </div>
      </div>
    </div>
  );
}

function CardSoftOverlays() {
  const reduceMotion = useReducedMotion();
  const sparkles = useMemo(
    () => [
      { left: "18%", top: "20%", delay: 0 },
      { left: "82%", top: "24%", delay: 0.8 },
      { left: "26%", top: "55%", delay: 1.6 },
      { left: "74%", top: "62%", delay: 2.2 },
      { left: "50%", top: "83%", delay: 1.1 }
    ],
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
      <Image src={assets.petals} alt="" fill sizes="94vw" className="object-cover opacity-[0.08] mix-blend-multiply" />
      <motion.span
        className="absolute inset-x-[11%] top-[7%] h-px bg-[linear-gradient(90deg,transparent,rgba(217,166,129,.7),transparent)]"
        animate={reduceMotion ? undefined : { opacity: [0.28, 0.64, 0.3] }}
        transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {sparkles.map((sparkle) => (
        <motion.span
          key={`${sparkle.left}-${sparkle.top}`}
          className="absolute h-1.5 w-1.5 rotate-45 rounded-[2px] bg-[#d9a681] shadow-[0_0_16px_rgba(217,166,129,.5)]"
          style={{ left: sparkle.left, top: sparkle.top, opacity: 0.18 }}
          animate={reduceMotion ? { opacity: 0.16 } : { opacity: [0.08, 0.42, 0.12], scale: [0.85, 1.25, 0.9], y: [0, -6, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, delay: sparkle.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function InvitationInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-[#d9a681]/24 bg-white/46 px-3 py-4 shadow-[0_14px_34px_rgba(183,122,90,.08),inset_0_1px_0_rgba(255,255,255,.62)] backdrop-blur md:px-5 md:py-5">
      <div className="mx-auto mb-3 h-px w-14 bg-[linear-gradient(90deg,transparent,#d9a681,transparent)]" />
      <p className="text-[clamp(.58rem,1vw,.8rem)] font-extrabold text-[#b77a5a]">{label}</p>
      <p className="mt-1 text-[clamp(.66rem,1.08vw,.98rem)] font-bold leading-6 text-[#432819]/82">{value}</p>
    </div>
  );
}

function RsvpChoice({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-sm font-extrabold transition ${
        active
          ? "border-[#c98674]/55 bg-[linear-gradient(135deg,#f4c9c2,#f0b9b4)] text-[#432819] shadow-[0_14px_40px_rgba(201,134,116,.2)]"
          : "border-[#d9a681]/30 bg-white/58 text-[#6e4a35]/74 shadow-[inset_0_1px_0_rgba(255,255,255,.65)] hover:border-[#c98674]/60 hover:bg-white"
      }`}
    >
      {label}
    </button>
  );
}

function LuxuryCountdown({ target, language }: { target: string; language: InvitationLanguage }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const units = useMemo(() => {
    const targetMs = new Date(target).getTime();
    const diff = Number.isFinite(targetMs) ? Math.max(0, targetMs - now) : 0;
    const days = Math.floor(diff / 86_400_000);
    const hours = Math.floor((diff % 86_400_000) / 3_600_000);
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    const seconds = Math.floor((diff % 60_000) / 1000);

    return [
      { label: language === "ar" ? "يوم" : "Days", value: days },
      { label: language === "ar" ? "ساعة" : "Hours", value: hours },
      { label: language === "ar" ? "دقيقة" : "Minutes", value: minutes },
      { label: language === "ar" ? "ثانية" : "Seconds", value: seconds }
    ];
  }, [language, now, target]);

  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="relative overflow-hidden rounded-[1.15rem] border border-[#d9a681]/44 bg-[linear-gradient(180deg,rgba(255,255,255,.74),rgba(255,239,232,.64))] px-4 py-4 text-center shadow-[0_18px_55px_rgba(173,99,82,.14),inset_0_0_0_1px_rgba(255,255,255,.42)]"
        >
          <span className="absolute inset-x-3 top-0 h-px bg-[linear-gradient(90deg,transparent,#d9a681,transparent)]" />
          <p className="font-display text-3xl leading-none text-[#9b653f] sm:text-4xl">{String(unit.value).padStart(2, "0")}</p>
          <p className="mt-2 text-xs font-bold text-[#6e4a35]/62">{unit.label}</p>
        </div>
      ))}
    </div>
  );
}

function RosePetals({ className = "" }: { className?: string } = {}) {
  const reduceMotion = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        left: (index * 47) % 100,
        delay: (index % 9) * 0.75,
        size: 5 + (index % 5),
        duration: 13 + (index % 6) * 1.6,
        drift: index % 2 === 0 ? 20 : -18
      })),
    []
  );

  return (
    <div className={`pointer-events-none absolute inset-0 z-[1] overflow-hidden ${className}`}>
      <Image src={assets.petals} alt="" fill sizes="100vw" className="object-cover opacity-30 mix-blend-multiply" />
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className={`absolute top-[-8%] rounded-full bg-[#d89688] shadow-[0_0_18px_rgba(216,150,136,.35)] ${
            particle.id % 3 === 0 ? "hidden sm:block" : ""
          }`}
          style={{ left: `${particle.left}%`, width: particle.size, height: Math.max(3, particle.size - 2), opacity: 0.34 }}
          animate={
            reduceMotion
              ? { opacity: [0.16, 0.3, 0.16] }
              : { y: ["0vh", "112vh"], x: [0, particle.drift, -particle.drift / 2], rotate: [0, 35, -22], opacity: [0, 0.42, 0.18, 0] }
          }
          transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
}

function GoldDust({ className = "" }: { className?: string } = {}) {
  const reduceMotion = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, index) => ({
        id: index,
        left: (index * 37) % 100,
        top: (index * 19) % 100,
        delay: (index % 8) * 0.45,
        size: 2 + (index % 4),
        duration: 9 + (index % 7) * 1.2
      })),
    []
  );

  return (
    <div className={`pointer-events-none absolute inset-0 z-[2] overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className={`absolute rounded-full bg-[#d7a57a] shadow-[0_0_18px_rgba(215,165,122,.58)] ${particle.id % 2 === 0 ? "hidden sm:block" : ""}`}
          style={{ left: `${particle.left}%`, top: `${particle.top}%`, width: particle.size, height: particle.size, opacity: 0.26 }}
          animate={
            reduceMotion
              ? { opacity: [0.16, 0.28, 0.16] }
              : { y: [0, -18, 0], x: [0, 10, -6, 0], opacity: [0.12, 0.38, 0.18] }
          }
          transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}
        />
      ))}
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
