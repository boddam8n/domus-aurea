"use client";

import Image from "next/image";
import { FormEvent, ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { CalendarDays, Check, Clock3, MapPin, Music2, Send, X } from "lucide-react";
import type { PublicInvitation } from "@/lib/invitations";

type RsvpResponse = "accepted" | "declined";

const assets = {
  prelude: "/assets/invitation-blush/immersive-prelude.webp",
  background: "/assets/invitation-blush/background.webp",
  doorsClosed: "/assets/invitation-blush/doors-closed-wide.webp",
  doorsOpen: "/assets/invitation-blush/doors-open.webp",
  card: "/assets/invitation-blush/invitation-card.webp",
  cardTall: "/assets/invitation-blush/invitation-card-tall.webp",
  cardMobile: "/assets/invitation-blush/invitation-card-mobile.webp",
  seal: "/assets/invitation-blush/wax-seal.webp",
  petals: "/assets/invitation-blush/petals.webp",
  light: "/assets/invitation-blush/light-burst.webp"
};

const fallbackMessage = "بكل الحب والفرحة، ندعوكم لحضور حفل زفافنا ومشاركتنا أجمل لحظات العمر.";

function getInvitationDateParts(value: string) {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return { date: value || "قريبًا", time: "" };
  }

  return {
    date: new Intl.DateTimeFormat("ar-EG", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date),
    time: new Intl.DateTimeFormat("ar-EG", {
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
  const [guestName, setGuestName] = useState("");
  const [response, setResponse] = useState<RsvpResponse>("accepted");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dateParts = useMemo(() => getInvitationDateParts(invitation.wedding_date), [invitation.wedding_date]);
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
        setStatus("تم تسجيل ردك بنجاح. شكرًا لمشاركتك.");
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
      if (!result.ok) throw new Error(json.error || "لم يتم حفظ الرد.");
      setStatus("تم تسجيل ردك بنجاح. شكرًا لمشاركتك.");
      setGuestName("");
    } catch (rsvpError) {
      setError(rsvpError instanceof Error ? rsvpError.message : "حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section dir="rtl" className="relative overflow-x-hidden bg-[#fff5f1] text-[#432819]">
      <ImmersivePrelude />

      <div className="relative min-h-[100svh]">
        <Image src={assets.background} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_4%,rgba(255,245,236,.78),transparent_34%),linear-gradient(180deg,rgba(255,247,241,.45),rgba(255,234,226,.68)_56%,#fff8f4_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,251,246,.68),transparent_30%,transparent_70%,rgba(255,251,246,.68))]" />
        <div className="pointer-events-none absolute inset-3 hidden rounded-[2rem] border border-[#d8a887]/20 shadow-[inset_0_0_80px_rgba(255,255,255,.22)] sm:block" />
        <div className="pointer-events-none absolute inset-x-8 top-8 hidden h-px bg-[linear-gradient(90deg,transparent,rgba(185,124,96,.44),transparent)] md:block" />
        <div className="pointer-events-none absolute inset-x-8 bottom-8 hidden h-px bg-[linear-gradient(90deg,transparent,rgba(185,124,96,.28),transparent)] md:block" />
        <RosePetals />
        <GoldDust />

        <main className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1920px] flex-col items-center px-2 pb-16 pt-7 sm:px-5 md:pt-10 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-1 text-center"
        >
          <div className="mx-auto mb-2 flex items-center justify-center gap-3 text-[#b97c60]">
            <span className="h-px w-14 bg-[linear-gradient(90deg,transparent,#d7a57a)]" />
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[#d8a887]/55 bg-white/40 text-[10px] font-black tracking-[0.16em] shadow-[0_10px_34px_rgba(188,116,92,.16)] backdrop-blur">
              DA
            </span>
            <span className="h-px w-14 bg-[linear-gradient(90deg,#d7a57a,transparent)]" />
          </div>
          <p className="font-display text-[clamp(1.65rem,4.6vw,3.45rem)] leading-none tracking-[0.12em] text-[#8f5d39] [text-shadow:0_10px_40px_rgba(201,126,105,.22)]">
            DOMUS AUREA
          </p>
          <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.42em] text-[#8f5d39]/66">PRIVATE INVITATION</p>
        </motion.header>

        <RoyalDoorStage
          isOpen={isOpen}
          isReading={isReading}
          onOpen={openInvitation}
          onReading={handleReading}
          brideName={invitation.bride_name}
          groomName={invitation.groom_name}
          initials={initials}
          date={dateParts.date}
          time={dateParts.time}
          venue={invitation.venue}
          message={invitationText}
          sealImageUrl={invitation.seal_image_url}
        />

        <AnimatePresence>
          {!isOpen ? (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6 }}
              onClick={openInvitation}
              className="mt-4 rounded-full border border-[#d9a681]/40 bg-white/55 px-6 py-3 text-sm font-bold text-[#8f5d39] shadow-[0_18px_70px_rgba(206,134,112,.18)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#c98674] hover:bg-[#f2c4c0]"
            >
              اضغط على الختم لفتح الدعوة
            </motion.button>
          ) : null}
        </AnimatePresence>

        <motion.div
          initial={false}
          animate={isReading ? { opacity: 1, y: 0, height: "auto" } : { opacity: 0, y: 18, height: 0 }}
          transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-6xl overflow-hidden"
        >
          <div className="relative mt-6 overflow-hidden rounded-[1.6rem] border border-[#d9a681]/38 bg-[linear-gradient(135deg,rgba(255,255,255,.76),rgba(255,238,231,.58))] p-4 shadow-[0_26px_90px_rgba(173,99,82,.16),inset_0_1px_0_rgba(255,255,255,.7)] backdrop-blur-xl sm:p-5">
            <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,#d9a681,transparent)]" />
            <p className="text-center text-sm font-extrabold tracking-[0.16em] text-[#a46a43]">الوقت المتبقي</p>
            <LuxuryCountdown target={invitation.wedding_date} />
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
              <p className="font-display text-2xl text-[#9b653f]">تأكيد الحضور</p>
              <p className="mt-1 text-sm font-bold text-[#6e4a35]/62">اكتب اسمك واختر ردك بكل بساطة</p>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <label className="flex-1">
                <span className="mb-2 block text-sm font-bold text-[#6e4a35]/70">اسم الضيف</span>
                <input
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  className="w-full rounded-2xl border border-[#d9a681]/34 bg-white/76 px-5 py-4 text-[#432819] shadow-[inset_0_1px_0_rgba(255,255,255,.72)] outline-none transition placeholder:text-[#8f5d39]/42 focus:border-[#c98674] focus:bg-white"
                  placeholder="اكتب اسمك هنا"
                  required
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2 md:w-[330px]">
                <RsvpChoice active={response === "accepted"} onClick={() => setResponse("accepted")} label="قبول الدعوة" icon={<Check className="h-4 w-4" />} />
                <RsvpChoice active={response === "declined"} onClick={() => setResponse("declined")} label="اعتذار" icon={<X className="h-4 w-4" />} />
              </div>
              <button
                disabled={loading}
                className="rounded-full bg-[linear-gradient(135deg,#c98d62,#8f5d39)] px-7 py-4 font-extrabold text-white shadow-[0_18px_48px_rgba(183,122,90,.24)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_62px_rgba(183,122,90,.28)] disabled:translate-y-0 disabled:opacity-55 md:w-[170px]"
              >
                <Send className="ml-2 inline h-4 w-4" />
                {loading ? "جاري الحفظ..." : "إرسال"}
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

function ImmersivePrelude() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[112svh] overflow-hidden bg-[#fff3ef]">
      <Image src={assets.prelude} alt="" fill priority sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,247,243,.18),rgba(255,244,239,.08)_54%,#fff5f1_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(255,255,255,.42),transparent_34%),linear-gradient(90deg,rgba(255,245,239,.58),transparent_24%,transparent_74%,rgba(255,245,239,.5))]" />
      <GoldDust className="opacity-70" />
      <RosePetals className="opacity-55" />
      <AnimatedOutlineAngels />

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto flex min-h-[112svh] max-w-7xl flex-col items-center justify-end px-5 pb-[18svh] text-center"
      >
        <div className="rounded-full border border-[#d9a681]/34 bg-white/34 px-5 py-2 text-[10px] font-extrabold uppercase tracking-[0.38em] text-[#8f5d39] shadow-[0_22px_70px_rgba(183,122,90,.14)] backdrop-blur-xl">
          Domus Aurea Private Invitation
        </div>
        <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.6rem,8vw,7rem)] leading-[0.9] text-[#8f5d39] [text-shadow:0_18px_60px_rgba(161,92,70,.18)]">
          دعوة ملكية تبدأ كحلم
        </h1>
        <p className="mt-5 max-w-2xl text-base font-bold leading-8 text-[#5a3927]/72 md:text-lg">
          مرر بهدوء لفتح تجربة الدعوة، وسط الورود والضوء وملمس الورق الفاخر.
        </p>
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 10, 0], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="mt-8 flex flex-col items-center gap-2 text-[#a46a43]"
        >
          <span className="h-14 w-px bg-[linear-gradient(180deg,#c28a67,transparent)]" />
          <span className="text-xs font-extrabold tracking-[0.25em]">SCROLL</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

function AnimatedOutlineAngels() {
  const reduceMotion = useReducedMotion();
  const angels = [
    {
      key: "left",
      className: "left-[5%] top-[15%] w-[clamp(112px,13vw,205px)] text-[#9f6b4f]/58 md:left-[9%] md:top-[18%]",
      rotate: -7,
      delay: 0,
      flipped: false
    },
    {
      key: "right",
      className: "right-[4%] top-[14%] w-[clamp(118px,14vw,220px)] text-[#9f6b4f]/58 md:right-[8%] md:top-[17%]",
      rotate: 7,
      delay: 0.55,
      flipped: true
    },
    {
      key: "center",
      className: "left-1/2 top-[36%] hidden w-[clamp(70px,7vw,120px)] -translate-x-1/2 text-[#b78362]/45 md:block",
      rotate: 2,
      delay: 1.15,
      flipped: false
    }
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden" aria-hidden="true">
      {angels.map((angel) => (
        <motion.div
          key={angel.key}
          data-outline-angel
          className={`absolute ${angel.className} drop-shadow-[0_18px_34px_rgba(164,106,67,.12)]`}
          initial={{ opacity: 0, y: 14, rotate: angel.rotate }}
          animate={
            reduceMotion
              ? { opacity: 0.42, y: 0, rotate: angel.rotate }
              : { opacity: [0.2, 0.5, 0.32], y: [0, -14, 6, 0], x: [0, 8, -5, 0], rotate: [angel.rotate, angel.rotate + 2.5, angel.rotate - 1.5, angel.rotate] }
          }
          transition={{ duration: 7.8, repeat: Infinity, delay: angel.delay, ease: "easeInOut" }}
        >
          <OutlineCupid flipped={angel.flipped} />
        </motion.div>
      ))}
    </div>
  );
}

function OutlineCupid({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg viewBox="0 0 240 170" fill="none" className="h-auto w-full" aria-hidden="true">
      <g transform={flipped ? "translate(240 0) scale(-1 1)" : undefined}>
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="103" cy="44" r="12" strokeWidth="2" />
          <path d="M90 38c8-9 23-10 32-2" strokeWidth="1.35" opacity="0.72" />
          <path d="M103 58c-8 15-7 31 2 48" strokeWidth="2" />
          <path d="M93 75c13 8 30 8 43-1" strokeWidth="1.9" />
          <path d="M95 104c11 8 27 8 40-1" strokeWidth="1.65" opacity="0.74" />

          <path d="M88 62C62 37 32 39 16 66c24-5 45 4 63 25" strokeWidth="2" />
          <path d="M80 70C59 58 40 60 25 78" strokeWidth="1.45" opacity="0.62" />
          <path d="M75 82C54 75 40 82 31 99" strokeWidth="1.45" opacity="0.58" />
          <path d="M79 93c-18 0-29 8-35 24" strokeWidth="1.35" opacity="0.48" />

          <path d="M116 62c28-28 61-29 82-1-27-4-50 8-70 32" strokeWidth="2" />
          <path d="M126 71c23-14 44-13 61 5" strokeWidth="1.45" opacity="0.62" />
          <path d="M132 84c22-8 39-1 49 16" strokeWidth="1.45" opacity="0.58" />
          <path d="M130 96c19 1 31 10 38 27" strokeWidth="1.35" opacity="0.48" />

          <path d="M133 72c16-13 34-19 56-17" strokeWidth="1.9" />
          <path d="M181 48l14 7-13 9" strokeWidth="1.7" />
          <path d="M154 61c8-14 20-13 29 1" strokeWidth="1.75" />
          <path d="M154 61c4 15-1 26-15 34" strokeWidth="1.75" />
          <path d="M154 61c11 6 17 16 17 29" strokeWidth="1.45" opacity="0.68" />
          <path d="M72 129c23 15 60 16 86 1" strokeWidth="1.35" opacity="0.45" />
        </g>
      </g>
    </svg>
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

  return <RoyalDoorStage {...props} isReading={isReading} onReading={handleReading} compact />;
}

function RoyalDoorStage({
  isOpen,
  isReading,
  onOpen,
  onReading,
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
          <div className="relative aspect-[864/1821] w-full drop-shadow-[0_48px_130px_rgba(155,88,71,.3)]">
            <Image src={assets.cardTall} alt="" fill sizes={compact ? "(min-width: 768px) 86vw, 96vw" : "94vw"} className="object-contain" priority={isOpen} />
            <div className="pointer-events-none absolute inset-[3%] rounded-[1.25rem] border border-[#d9a681]/28 shadow-[inset_0_0_70px_rgba(255,255,255,.38)]" />
            <div className="pointer-events-none absolute inset-x-[8%] top-[6%] h-px bg-[linear-gradient(90deg,transparent,rgba(217,166,129,.64),transparent)]" />
            <div className="pointer-events-none absolute inset-x-[8%] bottom-[6%] h-px bg-[linear-gradient(90deg,transparent,rgba(217,166,129,.5),transparent)]" />
            <div ref={contentRef} className="absolute inset-[9%_10%_8%] flex flex-col items-center text-center text-[#432819] opacity-0 md:inset-[10%_11%_7%]">
              <p className="mt-[2%] text-[clamp(.62rem,1.05vw,1rem)] font-extrabold tracking-[0.18em] text-[#b77a5a]">دعوة زفاف</p>
              <div className="my-[4%] flex items-center gap-3 text-[#c28a67] md:my-[3.4%]">
                <span className="h-px w-16 bg-[linear-gradient(90deg,transparent,#c28a67)]" />
                <span className="text-xs">◆</span>
                <span className="h-px w-16 bg-[linear-gradient(90deg,#c28a67,transparent)]" />
              </div>
              <h1 className="font-display text-[clamp(1.75rem,8.4vw,2.55rem)] leading-[1.16] text-[#9b653f] [text-shadow:0_10px_28px_rgba(183,122,90,.12)] md:text-[clamp(3.4rem,5.7vw,7rem)]">
                {groomName} <span className="mx-2 text-[#c98778]">&</span> {brideName}
              </h1>
              <p className="mt-[8%] max-w-[82%] text-[clamp(.72rem,3.15vw,1rem)] font-bold leading-[1.9] text-[#5a3927]/84 md:mt-[5.2%] md:max-w-[68%] md:text-[clamp(1rem,1.35vw,1.45rem)]">{message}</p>

              <div className="mt-[8%] grid w-full max-w-[82%] grid-cols-1 gap-2.5 text-[#432819] md:mt-[6.6%] md:max-w-5xl md:grid-cols-3 md:gap-4">
                <InvitationInfo icon={<MapPin className="h-4 w-4" />} label="المكان" value={venue} />
                <InvitationInfo icon={<CalendarDays className="h-4 w-4" />} label="التاريخ" value={date} />
                <InvitationInfo icon={<Clock3 className="h-4 w-4" />} label="الساعة" value={time || "قريبًا"} />
              </div>

              <div className="mt-auto h-px w-[64%] bg-[linear-gradient(90deg,transparent,rgba(194,138,103,.55),transparent)]" />
              <p className="mt-[2%] text-[clamp(.68rem,1.1vw,.94rem)] font-extrabold text-[#b77a5a]">نتشرف بحضوركم</p>
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
      </div>
    </div>
  );
}

function InvitationInfo({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-[#d9a681]/30 bg-white/56 px-3 py-4 shadow-[0_14px_34px_rgba(183,122,90,.09),inset_0_1px_0_rgba(255,255,255,.62)] backdrop-blur md:px-5 md:py-5">
      <div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-full border border-[#d9a681]/24 bg-[#e7b6a8]/24 text-[#b77a5a] md:h-11 md:w-11">{icon}</div>
      <p className="text-[clamp(.58rem,1vw,.8rem)] font-extrabold text-[#b77a5a]">{label}</p>
      <p className="mt-1 text-[clamp(.62rem,1.05vw,.95rem)] font-bold leading-5 text-[#432819]/82">{value}</p>
    </div>
  );
}

function RsvpChoice({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: ReactNode }) {
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
      {icon}
      {label}
    </button>
  );
}

function LuxuryCountdown({ target }: { target: string }) {
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
      { label: "يوم", value: days },
      { label: "ساعة", value: hours },
      { label: "دقيقة", value: minutes },
      { label: "ثانية", value: seconds }
    ];
  }, [now, target]);

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
