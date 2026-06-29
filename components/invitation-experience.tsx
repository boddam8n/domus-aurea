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
  cardPortrait: "/assets/invitation-blush/invitation-card-mobile.webp",
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
  const [rsvpVisible, setRsvpVisible] = useState(false);

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
    <section dir={direction} className="relative min-h-[100svh] overflow-x-hidden bg-[#fff5f1] text-[#432819] [color-scheme:light]">
      <div className="relative min-h-[100svh]">
        <Image src={assets.background} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_9%,rgba(255,247,240,.82),transparent_38%),linear-gradient(180deg,rgba(255,248,244,.62),rgba(255,237,230,.76)_58%,#fff8f4_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,251,246,.68),transparent_30%,transparent_70%,rgba(255,251,246,.68))]" />
        <div className="pointer-events-none absolute inset-3 hidden rounded-[2rem] border border-[#d8a887]/20 shadow-[inset_0_0_80px_rgba(255,255,255,.22)] sm:block" />
        <RosePetals />
        <GoldDust />

        <main className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1920px] flex-col items-center justify-center px-2 py-0 sm:px-5 lg:px-8">
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
          countdownTarget={invitation.wedding_date}
          sealImageUrl={invitation.seal_image_url}
          onRsvpClick={() => setRsvpVisible(true)}
        />
        </main>
        <RsvpModal
          open={rsvpVisible}
          language={language}
          guestName={guestName}
          response={response}
          loading={loading}
          error={error}
          status={status}
          onClose={() => setRsvpVisible(false)}
          onGuestNameChange={setGuestName}
          onResponseChange={setResponse}
          onSubmit={submitRsvp}
        />
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
  countdownTarget?: string;
  sealImageUrl?: string | null;
  onRsvpClick?: () => void;
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
  countdownTarget,
  sealImageUrl,
  onRsvpClick,
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
  countdownTarget?: string;
  sealImageUrl?: string | null;
  onRsvpClick?: () => void;
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
    };

    if (!isOpen) {
      gsap.set(nodes, { clearProps: "all" });
      gsap.set(openDoorsRef.current, { autoAlpha: 0, scale: 0.98 });
      gsap.set(lightRef.current, { autoAlpha: 0, scale: 0.7 });
      gsap.set(cardRef.current, { autoAlpha: 0, y: 18, scale: 0.95, filter: "blur(4px)" });
      gsap.set(contentRef.current, { autoAlpha: 0, y: 6 });
      return;
    }

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(leftDoorRef.current, { xPercent: -46, autoAlpha: 0 });
        gsap.set(rightDoorRef.current, { xPercent: 46, autoAlpha: 0 });
        gsap.set(openDoorsRef.current, { autoAlpha: 1, scale: 1 });
        gsap.set(lightRef.current, { autoAlpha: 0.54, scale: 1 });
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
        .to(sealRef.current, { scale: 1.04, duration: 0.38, ease: "power2.out" }, 0)
        .to(sealRef.current, { autoAlpha: 0, scale: 0.92, duration: 0.78, ease: "power2.inOut" }, 0.3)
        .to(leftDoorRef.current, { xPercent: -54, rotateY: -10, autoAlpha: 0.14, duration: 2.15, ease: "expo.inOut" }, 0.54)
        .to(rightDoorRef.current, { xPercent: 54, rotateY: 10, autoAlpha: 0.14, duration: 2.15, ease: "expo.inOut" }, 0.54)
        .to(openDoorsRef.current, { autoAlpha: 1, scale: 1.01, duration: 1.8, ease: "power3.out" }, 0.78)
        .to(lightRef.current, { autoAlpha: 0.58, scale: 1.12, duration: 1.9, ease: "power2.out" }, 0.7)
        .to(cardRef.current, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.55, ease: "expo.out" }, 1.46)
        .to(contentRef.current, { autoAlpha: 1, y: 0, duration: 0.92, ease: "power2.out" }, 2.06)
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
    hint: isArabic ? "اضغط على الختم لفتح الدعوة" : "Click the seal to open",
    countdown: isArabic ? "الوقت المتبقي" : "Countdown",
    rsvp: isArabic ? "تأكيد الحضور" : "RSVP"
  };

  return (
    <div className="relative w-full">
      <div
        ref={stageRef}
        data-reading={isReading ? "true" : "false"}
        className={`relative mx-auto grid w-full place-items-center ${
          compact ? "min-h-[560px]" : "min-h-[100svh]"
        }`}
      >
        <div className="absolute left-1/2 top-[86%] h-16 w-[min(82vw,560px)] -translate-x-1/2 rounded-full bg-[#b9796a]/14 blur-3xl" />

        <div ref={lightRef} className="pointer-events-none absolute inset-0 z-10 m-auto h-fit w-[min(132vw,1040px)] opacity-0">
          <Image src={assets.light} alt="" width={1600} height={900} className="h-auto w-full mix-blend-screen" />
        </div>

        <div ref={openDoorsRef} className="pointer-events-none absolute inset-0 z-20 m-auto aspect-[696/1221] w-[min(94vw,47svh,540px)] opacity-0">
          <div className="absolute inset-[2%] rounded-[1.4rem] border border-[#d9a681]/30 shadow-[0_28px_72px_rgba(155,88,71,.16),inset_0_0_70px_rgba(255,244,232,.42)]" />
          <div className="absolute inset-y-[9%] left-1/2 w-px bg-[linear-gradient(180deg,transparent,rgba(217,166,129,.44),transparent)]" />
        </div>

        <div data-closed-invitation className="absolute inset-0 z-30 m-auto aspect-[696/1221] w-[min(94vw,47svh,540px)] [perspective:1500px]">
          <div
            ref={leftDoorRef}
            className="absolute inset-y-0 left-0 w-1/2 rounded-l-[1.25rem] bg-[url('/assets/invitation-blush/invitation-card-mobile.webp')] bg-[length:200%_100%] bg-left bg-no-repeat drop-shadow-[0_26px_60px_rgba(155,88,71,.22)] will-change-transform"
          />
          <div
            ref={rightDoorRef}
            className="absolute inset-y-0 right-0 w-1/2 rounded-r-[1.25rem] bg-[url('/assets/invitation-blush/invitation-card-mobile.webp')] bg-[length:200%_100%] bg-right bg-no-repeat drop-shadow-[0_26px_60px_rgba(155,88,71,.22)] will-change-transform"
          />
        </div>

        <div
          ref={cardRef}
          data-invitation-card
          className={
            compact
              ? "relative z-40 mt-2 w-[min(94vw,410px)] opacity-0 md:w-[min(86vw,920px)]"
              : isReading
                ? "absolute inset-0 z-40 m-auto w-[min(94vw,47svh,540px)] opacity-0"
                : "absolute inset-0 z-40 m-auto w-[min(94vw,47svh,540px)] opacity-0"
          }
        >
          <div className="relative aspect-[696/1221] w-full overflow-hidden rounded-[1.25rem] drop-shadow-[0_34px_92px_rgba(155,88,71,.22)]">
            <Image src={assets.cardPortrait} alt="" fill sizes={compact ? "(min-width: 768px) 48vw, 94vw" : "94vw"} className="object-cover" priority={isOpen} />
            <div className="pointer-events-none absolute inset-[3%] rounded-[1.05rem] border border-[#d9a681]/24 shadow-[inset_0_0_46px_rgba(255,255,255,.34)]" />
            <div className="pointer-events-none absolute inset-x-[10%] top-[7%] h-px bg-[linear-gradient(90deg,transparent,rgba(217,166,129,.54),transparent)]" />
            <div className="pointer-events-none absolute inset-x-[10%] bottom-[7%] h-px bg-[linear-gradient(90deg,transparent,rgba(217,166,129,.45),transparent)]" />
            <CardSoftOverlays />
            <div ref={contentRef} dir={isArabic ? "rtl" : "ltr"} className="absolute inset-[8.5%_8.5%_6.8%] z-10 flex flex-col items-center text-center text-[#432819] opacity-0">
              <p className="mt-[1%] text-[clamp(.52rem,2.1vw,.72rem)] font-extrabold tracking-[0.16em] text-[#b77a5a] sm:text-[clamp(.62rem,1vw,.9rem)]">{labels.invite}</p>
              <div className="my-[3%] flex items-center gap-2 text-[#c28a67]">
                <span className="h-px w-12 bg-[linear-gradient(90deg,transparent,#c28a67)]" />
                <span className="text-[.58rem]">◆</span>
                <span className="h-px w-12 bg-[linear-gradient(90deg,#c28a67,transparent)]" />
              </div>
              <h1 className={`${isArabic ? "font-body" : "font-display"} text-[clamp(1.75rem,8vw,2.45rem)] font-extrabold leading-[1.12] text-[#9b653f] [text-shadow:0_8px_22px_rgba(183,122,90,.1)] sm:text-[clamp(2.3rem,4.2vw,4rem)]`}>
                {groomName} <span className="mx-2 text-[#c98778]">&</span> {brideName}
              </h1>
              <InvitationCopyBlock language={language} message={message} />

              <div className="mt-[5%] grid w-full grid-cols-3 gap-1.5 text-[#432819] sm:mt-[5.8%] sm:gap-3">
                <InvitationInfo label={labels.venue} value={venue} />
                <InvitationInfo label={labels.date} value={date} />
                <InvitationInfo label={labels.time} value={time || labels.soon} />
              </div>

              {countdownTarget ? <InlineCountdown target={countdownTarget} language={language} label={labels.countdown} /> : null}

              <div className="mt-auto h-px w-[58%] bg-[linear-gradient(90deg,transparent,rgba(194,138,103,.5),transparent)]" />
              <p className="mt-[2%] text-[clamp(.58rem,2vw,.72rem)] font-extrabold text-[#b77a5a] sm:text-[clamp(.7rem,1vw,.9rem)]">{labels.honor}</p>
              {onRsvpClick ? (
                <button
                  type="button"
                  onClick={onRsvpClick}
                  className="mt-[2.4%] rounded-full border border-[#c98674]/36 bg-[linear-gradient(135deg,rgba(255,255,255,.72),rgba(246,204,196,.62))] px-5 py-2 text-[clamp(.62rem,2.2vw,.78rem)] font-extrabold text-[#8f5d39] shadow-[0_10px_26px_rgba(183,122,90,.13)] transition hover:-translate-y-0.5 hover:border-[#c98674]/55"
                >
                  {labels.rsvp}
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <button
          ref={sealRef}
          type="button"
          disabled={isOpen}
          onClick={onOpen}
          aria-label="Open invitation seal"
          className="absolute inset-0 z-50 m-auto grid h-[clamp(72px,18vw,118px)] w-[clamp(72px,18vw,118px)] place-items-center rounded-full outline-none transition duration-500 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#d89688]"
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
              className="absolute bottom-[4.5%] z-40 rounded-full border border-[#d9a681]/28 bg-white/72 px-5 py-2 text-xs font-bold text-[#8f5d39]/76 shadow-[0_14px_36px_rgba(183,122,90,.12)] backdrop-blur-xl"
            >
              {labels.hint}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function InvitationCopyBlock({ language, message }: { language: InvitationLanguage; message: string }) {
  const isArabic = language === "ar";
  const cleanedMessage = message.trim();
  const blockedGeneratedPhrases = ["بكل الحب والفرحة", "من العريس إلى عروسه", "اختارها قلبي", "From the groom to his bride", "the one my heart chose"];
  const shouldShowCustomMessage = Boolean(
    cleanedMessage && cleanedMessage !== fallbackMessage && !blockedGeneratedPhrases.some((phrase) => cleanedMessage.includes(phrase))
  );
  const opening = isArabic ? arabicOpening : englishOpening;
  const formalMessage = isArabic ? fallbackMessage : englishFormalMessage;
  const customLabel = isArabic ? "رسالة الدعوة" : "Invitation note";

  return (
    <div className="relative mt-[5%] w-full max-w-[92%] text-[#5a3927] sm:mt-[5.5%]">
      <div className="pointer-events-none absolute -inset-x-2 -inset-y-3 rounded-[1.4rem] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.5),transparent_62%)] opacity-60" />
      <div className="relative rounded-[1.1rem] border border-[#d9a681]/16 bg-white/20 px-3 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,.46)] sm:px-5 sm:py-5">
        <div className="mx-auto mb-2.5 flex max-w-[180px] items-center justify-center gap-3 text-[#c28a67]">
          <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,#c28a67)]" />
          <span className="font-display text-sm leading-none">♡</span>
          <span className="h-px flex-1 bg-[linear-gradient(90deg,#c28a67,transparent)]" />
        </div>
        <div className="space-y-2.5 text-[clamp(.68rem,2.55vw,.86rem)] font-bold leading-[1.78] text-[#4d3124]/86 sm:text-[clamp(.84rem,1.05vw,1rem)] sm:leading-[1.9]">
          <p className={`${isArabic ? "font-body" : "font-display"} text-[clamp(.86rem,3.25vw,1.06rem)] font-extrabold leading-[1.58] text-[#9b653f] sm:text-[clamp(1rem,1.35vw,1.28rem)]`}>{opening}</p>
          <p className="text-[#6e4a35]">{formalMessage}</p>
          {shouldShowCustomMessage ? (
            <div className="mx-auto max-w-xl rounded-[.9rem] border border-[#d9a681]/16 bg-[#fff8f3]/32 px-3 py-2.5">
              <p className="text-[clamp(.54rem,1.8vw,.68rem)] font-black uppercase tracking-[0.18em] text-[#b77a5a]/70">{customLabel}</p>
              <p className="mt-1.5 text-[#8f5d39]/86">{cleanedMessage}</p>
            </div>
          ) : null}
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
    <div className="rounded-[.9rem] border border-[#d9a681]/18 bg-white/36 px-1.5 py-2.5 shadow-[0_10px_22px_rgba(183,122,90,.06),inset_0_1px_0_rgba(255,255,255,.5)] sm:px-3 sm:py-3.5">
      <div className="mx-auto mb-2 h-px w-8 bg-[linear-gradient(90deg,transparent,#d9a681,transparent)]" />
      <p className="text-[clamp(.48rem,1.7vw,.62rem)] font-extrabold text-[#b77a5a] sm:text-[clamp(.58rem,.82vw,.72rem)]">{label}</p>
      <p className="mt-1 text-[clamp(.54rem,1.95vw,.72rem)] font-bold leading-4 text-[#432819]/82 sm:text-[clamp(.66rem,.9vw,.88rem)] sm:leading-5">{value}</p>
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

function RsvpModal({
  open,
  language,
  guestName,
  response,
  loading,
  error,
  status,
  onClose,
  onGuestNameChange,
  onResponseChange,
  onSubmit
}: {
  open: boolean;
  language: InvitationLanguage;
  guestName: string;
  response: RsvpResponse;
  loading: boolean;
  error: string;
  status: string;
  onClose: () => void;
  onGuestNameChange: (value: string) => void;
  onResponseChange: (value: RsvpResponse) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const isArabic = language === "ar";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-end bg-[#432819]/22 px-3 py-4 backdrop-blur-[3px] sm:place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.form
            dir={isArabic ? "rtl" : "ltr"}
            onSubmit={onSubmit}
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md overflow-hidden rounded-[1.45rem] border border-[#d9a681]/34 bg-[linear-gradient(135deg,rgba(255,250,246,.96),rgba(255,235,229,.94))] p-4 text-[#432819] shadow-[0_30px_92px_rgba(112,61,45,.22),inset_0_1px_0_rgba(255,255,255,.7)] sm:p-5"
          >
            <div className="mb-4 text-center">
              <p className="font-display text-2xl text-[#9b653f]">{isArabic ? "تأكيد الحضور" : "Kindly RSVP"}</p>
              <p className="mt-1 text-sm font-bold text-[#6e4a35]/62">{isArabic ? "رد بسيط يكمل جمال الدعوة" : "A simple reply for the couple"}</p>
            </div>
            <label>
              <span className="mb-2 block text-sm font-bold text-[#6e4a35]/70">{isArabic ? "اسم الضيف" : "Guest name"}</span>
              <input
                value={guestName}
                onChange={(event) => onGuestNameChange(event.target.value)}
                className="w-full rounded-2xl border border-[#d9a681]/34 bg-white/78 px-5 py-3.5 text-[#432819] shadow-[inset_0_1px_0_rgba(255,255,255,.72)] outline-none transition placeholder:text-[#8f5d39]/42 focus:border-[#c98674] focus:bg-white [color-scheme:light]"
                placeholder={isArabic ? "اكتب اسمك هنا" : "Enter your name"}
                required
              />
            </label>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <RsvpChoice active={response === "accepted"} onClick={() => onResponseChange("accepted")} label={isArabic ? "قبول الدعوة" : "Accept"} />
              <RsvpChoice active={response === "declined"} onClick={() => onResponseChange("declined")} label={isArabic ? "اعتذار" : "Decline"} />
            </div>
            <button
              disabled={loading}
              className="mt-4 w-full rounded-full bg-[linear-gradient(135deg,#c98d62,#8f5d39)] px-7 py-3.5 font-extrabold text-white shadow-[0_18px_48px_rgba(183,122,90,.22)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-55"
            >
              {loading ? (isArabic ? "جاري الحفظ..." : "Saving...") : isArabic ? "إرسال الرد" : "Send reply"}
            </button>
            <button type="button" onClick={onClose} className="mt-3 w-full text-xs font-bold text-[#8f5d39]/60 transition hover:text-[#8f5d39]">
              {isArabic ? "إغلاق" : "Close"}
            </button>
            {error ? <p className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-800">{error}</p> : null}
            {status ? <p className="mt-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm text-emerald-800">{status}</p> : null}
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function InlineCountdown({ target, language, label }: { target: string; language: InvitationLanguage; label: string }) {
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
    <div className="mt-[4.2%] w-full max-w-[86%]">
      <p className="mb-2 text-[clamp(.48rem,1.75vw,.64rem)] font-extrabold tracking-[0.12em] text-[#b77a5a]/78 sm:text-[clamp(.58rem,.86vw,.72rem)]">{label}</p>
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
        {units.map((unit) => (
          <div key={unit.label} className="rounded-[.75rem] border border-[#d9a681]/20 bg-white/34 px-1 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.42)]">
            <p className="font-display text-[clamp(.86rem,3.2vw,1.1rem)] leading-none text-[#9b653f] sm:text-[clamp(1.1rem,1.5vw,1.55rem)]">{String(unit.value).padStart(2, "0")}</p>
            <p className="mt-1 text-[clamp(.42rem,1.45vw,.54rem)] font-bold text-[#6e4a35]/62 sm:text-[clamp(.5rem,.74vw,.62rem)]">{unit.label}</p>
          </div>
        ))}
      </div>
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
