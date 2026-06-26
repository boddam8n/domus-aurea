"use client";

import Image from "next/image";
import { FormEvent, ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { CalendarDays, Check, Clock3, MapPin, Music2, Send, X } from "lucide-react";
import type { PublicInvitation } from "@/lib/invitations";

type RsvpResponse = "accepted" | "declined";

const assets = {
  background: "/assets/invitation-blush/background.webp",
  doorsClosed: "/assets/invitation-blush/doors-closed.webp",
  doorsOpen: "/assets/invitation-blush/doors-open.webp",
  card: "/assets/invitation-blush/invitation-card.webp",
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
    <section dir="rtl" className="relative min-h-[100svh] overflow-x-hidden bg-[#fff5f1] text-[#432819]">
      <Image src={assets.background} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_4%,rgba(255,245,236,.7),transparent_34%),linear-gradient(180deg,rgba(255,247,241,.38),rgba(255,234,226,.62)_56%,#fff8f4_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,251,246,.64),transparent_30%,transparent_70%,rgba(255,251,246,.64))]" />
      <RosePetals />

      <main className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col items-center px-4 pb-14 pt-6 sm:px-6 md:pt-8 lg:px-8">
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
          className="w-full max-w-5xl overflow-hidden"
        >
          <div className="mt-6 rounded-[1.35rem] border border-[#d9a681]/34 bg-white/58 p-4 shadow-[0_26px_90px_rgba(173,99,82,.16)] backdrop-blur-xl sm:p-5">
            <p className="text-center text-sm font-extrabold tracking-[0.16em] text-[#a46a43]">الوقت المتبقي</p>
            <LuxuryCountdown target={invitation.wedding_date} />
          </div>
        </motion.div>

        <motion.form
          onSubmit={submitRsvp}
          initial={false}
          animate={isReading ? { opacity: 1, y: 0, height: "auto" } : { opacity: 0, y: 22, height: 0 }}
          transition={{ duration: 0.78, delay: isReading ? 0.1 : 0, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-5xl overflow-hidden"
        >
          <div className="mt-5 rounded-[1.5rem] border border-[#d9a681]/28 bg-white/62 p-4 shadow-[0_24px_90px_rgba(173,99,82,.14)] backdrop-blur-xl sm:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <label className="flex-1">
                <span className="mb-2 block text-sm font-bold text-[#6e4a35]/70">اسم الضيف</span>
                <input
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  className="w-full rounded-2xl border border-[#d9a681]/30 bg-white/72 px-5 py-4 text-[#432819] outline-none transition placeholder:text-[#8f5d39]/42 focus:border-[#c98674] focus:bg-white"
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
                className="rounded-full bg-[#b77a5a] px-7 py-4 font-extrabold text-white shadow-[0_18px_48px_rgba(183,122,90,.22)] transition hover:-translate-y-0.5 hover:bg-[#8f5d39] disabled:translate-y-0 disabled:opacity-55 md:w-[170px]"
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
    </section>
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
        onReading();
        return;
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: onReading
      });

      timeline
        .to(sealRef.current, { scale: 1.05, duration: 0.18, ease: "power2.out" }, 0)
        .to(sealRef.current, { autoAlpha: 0, scale: 0.86, duration: 0.5, ease: "power2.out" }, 0.24)
        .to(leftDoorRef.current, { xPercent: -57, rotateY: -9, autoAlpha: 0.12, duration: 1.62, ease: "power4.inOut" }, 0.44)
        .to(rightDoorRef.current, { xPercent: 57, rotateY: 9, autoAlpha: 0.12, duration: 1.62, ease: "power4.inOut" }, 0.44)
        .to(openDoorsRef.current, { autoAlpha: 1, scale: 1, duration: 1.28, ease: "power3.out" }, 0.64)
        .to(lightRef.current, { autoAlpha: 0.94, scale: 1.1, duration: 1.45, ease: "power2.out" }, 0.56)
        .to(cardRef.current, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.28, ease: "power4.out" }, 1.22)
        .to(contentRef.current, { autoAlpha: 1, y: 0, duration: 0.78, ease: "power2.out" }, 1.76)
        .set(sealRef.current, { pointerEvents: "none" }, 0.36);
    }, stageRef);

    return () => ctx.revert();
  }, [isOpen, onReading, reduceMotion]);

  return (
    <div className="relative w-full">
      <div
        ref={stageRef}
        data-reading={isReading ? "true" : "false"}
        className={`relative mx-auto grid w-full place-items-center ${
          compact ? "min-h-[560px]" : "min-h-[clamp(560px,82svh,760px)] md:min-h-[clamp(390px,64svh,620px)]"
        }`}
      >
        <div className="absolute left-1/2 top-[84%] h-20 w-[min(88vw,980px)] -translate-x-1/2 rounded-full bg-[#b9796a]/16 blur-3xl" />

        <div ref={lightRef} className="pointer-events-none absolute left-1/2 top-[45%] z-10 w-[min(112vw,1100px)] -translate-x-1/2 -translate-y-1/2 opacity-0">
          <Image src={assets.light} alt="" width={1600} height={900} className="h-auto w-full mix-blend-screen" />
        </div>

        <div ref={openDoorsRef} className="absolute left-1/2 top-[43%] z-20 w-[min(94vw,960px)] -translate-x-1/2 -translate-y-1/2 opacity-0">
          <Image src={assets.doorsOpen} alt="" width={1280} height={720} className="h-auto w-full drop-shadow-[0_34px_92px_rgba(155,88,71,.22)]" />
        </div>

        <div className="absolute left-1/2 top-[43%] z-30 h-[min(78vw,520px)] w-[min(78vw,520px)] -translate-x-1/2 -translate-y-1/2 [perspective:1200px]">
          <div
            ref={leftDoorRef}
            className="absolute inset-y-0 left-0 w-1/2 bg-[url('/assets/invitation-blush/doors-closed.webp')] bg-[length:200%_100%] bg-left bg-no-repeat drop-shadow-[0_30px_80px_rgba(155,88,71,.28)] will-change-transform"
          />
          <div
            ref={rightDoorRef}
            className="absolute inset-y-0 right-0 w-1/2 bg-[url('/assets/invitation-blush/doors-closed.webp')] bg-[length:200%_100%] bg-right bg-no-repeat drop-shadow-[0_30px_80px_rgba(155,88,71,.28)] will-change-transform"
          />
        </div>

        <div ref={cardRef} className="relative z-40 mt-2 w-[min(94vw,390px)] opacity-0 md:w-[min(88vw,940px)] 2xl:w-[min(84vw,1040px)]">
          <div className="relative aspect-[9/16] w-full drop-shadow-[0_36px_90px_rgba(155,88,71,.24)] md:aspect-[14/8.5]">
            <Image src={assets.cardMobile} alt="" fill sizes="94vw" className="object-contain md:hidden" priority={isOpen} />
            <Image src={assets.card} alt="" fill sizes="(min-width: 1024px) 940px, 88vw" className="hidden object-contain md:block" priority={isOpen} />
            <div ref={contentRef} className="absolute inset-[16%_9%_10%] flex flex-col items-center justify-center text-center text-[#432819] opacity-0 md:inset-[12%_9%_12%]">
              <p className="text-[clamp(.56rem,1vw,.9rem)] font-extrabold tracking-[0.16em] text-[#b77a5a]">دعوة زفاف</p>
              <div className="my-[2%] flex items-center gap-3 text-[#c28a67] md:my-[2%]">
                <span className="h-px w-16 bg-[linear-gradient(90deg,transparent,#c28a67)]" />
                <span className="text-xs">◆</span>
                <span className="h-px w-16 bg-[linear-gradient(90deg,#c28a67,transparent)]" />
              </div>
              <h1 className="font-display text-[clamp(1.35rem,7.4vw,2.05rem)] leading-[1.1] text-[#9b653f] [text-shadow:0_10px_28px_rgba(183,122,90,.12)] md:text-[clamp(2rem,5.4vw,4.85rem)]">
                {groomName} <span className="mx-2 text-[#c98778]">&</span> {brideName}
              </h1>
              <p className="mt-[4%] max-w-[72%] text-[clamp(.64rem,3vw,.86rem)] font-bold leading-[1.7] text-[#5a3927]/84 md:mt-[2.2%] md:max-w-[74%] md:text-[clamp(.72rem,1.32vw,1.08rem)]">{message}</p>

              <div className="mt-[4%] grid w-full max-w-[74%] grid-cols-1 gap-1.5 text-[#432819] md:mt-[3.4%] md:max-w-3xl md:grid-cols-3 md:gap-2">
                <InvitationInfo icon={<MapPin className="h-4 w-4" />} label="المكان" value={venue} />
                <InvitationInfo icon={<CalendarDays className="h-4 w-4" />} label="التاريخ" value={date} />
                <InvitationInfo icon={<Clock3 className="h-4 w-4" />} label="الساعة" value={time || "قريبًا"} />
              </div>

              <div className="mt-[3%] h-px w-[64%] bg-[linear-gradient(90deg,transparent,rgba(194,138,103,.55),transparent)]" />
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
          className="absolute left-1/2 top-[43%] z-50 grid h-[clamp(72px,10vw,116px)] w-[clamp(72px,10vw,116px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none transition duration-500 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#d89688]"
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
    <div className="rounded-2xl border border-[#d9a681]/22 bg-white/48 px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,.48)] backdrop-blur">
      <div className="mx-auto mb-1 grid h-7 w-7 place-items-center rounded-full bg-[#e7b6a8]/22 text-[#b77a5a]">{icon}</div>
      <p className="text-[clamp(.5rem,1vw,.68rem)] font-extrabold text-[#b77a5a]">{label}</p>
      <p className="mt-0.5 text-[clamp(.52rem,1.05vw,.78rem)] font-bold leading-4 text-[#432819]/82">{value}</p>
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
          ? "border-[#c98674]/55 bg-[#f2c4c0] text-[#432819] shadow-[0_14px_40px_rgba(201,134,116,.2)]"
          : "border-[#d9a681]/28 bg-white/52 text-[#6e4a35]/74 hover:border-[#c98674]/60 hover:bg-white"
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
          className="relative overflow-hidden rounded-[1.05rem] border border-[#d9a681]/42 bg-white/64 px-4 py-4 text-center shadow-[0_18px_55px_rgba(173,99,82,.14),inset_0_0_0_1px_rgba(255,255,255,.36)]"
        >
          <span className="absolute inset-x-3 top-0 h-px bg-[linear-gradient(90deg,transparent,#d9a681,transparent)]" />
          <p className="font-display text-3xl leading-none text-[#9b653f] sm:text-4xl">{String(unit.value).padStart(2, "0")}</p>
          <p className="mt-2 text-xs font-bold text-[#6e4a35]/62">{unit.label}</p>
        </div>
      ))}
    </div>
  );
}

function RosePetals() {
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
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
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

export function InvitationMusicCue() {
  return (
    <span className="inline-flex items-center gap-2">
      <Music2 className="h-4 w-4" />
      Music
    </span>
  );
}
