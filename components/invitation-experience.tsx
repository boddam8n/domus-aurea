"use client";

import Image from "next/image";
import { FormEvent, ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { CalendarDays, Check, Clock3, MapPin, Music2, Send, X } from "lucide-react";
import type { PublicInvitation } from "@/lib/invitations";

type RsvpResponse = "accepted" | "declined";

const assets = {
  background: "/assets/invitation-luxury/cinematic-background.webp",
  light: "/assets/invitation-luxury/gold-light-overlay.webp",
  closedEnvelope: "/assets/invitation-luxury/envelope-closed.webp",
  openEnvelope: "/assets/invitation-luxury/envelope-open.webp",
  card: "/assets/invitation-luxury/invitation-card.webp",
  seal: "/assets/invitation-luxury/wax-seal.webp",
  crackedSeal: "/assets/invitation-luxury/wax-seal-cracked.webp"
};

const fallbackMessage =
  "بكل الحب والفرحة، ندعوكم لحضور حفل زفافنا ومشاركتنا أجمل لحظات العمر. حضوركم يملأ الليلة بهجة ودفء.";

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

function playSealBreakSound() {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const duration = 0.46;
    const sampleCount = Math.floor(context.sampleRate * duration);
    const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let index = 0; index < sampleCount; index += 1) {
      const progress = index / sampleCount;
      const fade = 1 - progress;
      const porcelainSnap = Math.sin(index * 0.18) * Math.pow(fade, 7) * 0.2;
      const silkGrain = (Math.random() * 2 - 1) * Math.pow(fade, 3.6) * 0.18;
      data[index] = porcelainSnap + silkGrain;
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    filter.type = "bandpass";
    filter.frequency.value = 980;
    filter.Q.value = 1.1;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.1, context.currentTime + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start();
    window.setTimeout(() => void context.close(), 800);
  } catch {
    // AudioContext can be unavailable in some privacy modes.
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
    playSealBreakSound();
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
    <section dir="rtl" className="relative min-h-[100svh] overflow-x-hidden bg-[#020504] text-[#fbf2df]">
      <Image src={assets.background} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_4%,rgba(238,202,122,.18),transparent_30%),linear-gradient(180deg,rgba(2,5,4,.08),#020504_98%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,7,6,.78),transparent_34%,transparent_66%,rgba(1,7,6,.78))]" />
      <Image src={assets.light} alt="" fill sizes="100vw" className="object-cover opacity-30 mix-blend-screen" />
      <GoldDust />

      <main className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col items-center px-4 pb-14 pt-8 sm:px-6 md:pt-8 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="mb-1 text-center"
        >
          <div className="mx-auto mb-2 flex items-center justify-center gap-3 text-[#e6bd67]">
            <span className="h-px w-16 bg-[linear-gradient(90deg,transparent,#e6bd67)]" />
            <span className="grid h-9 w-9 place-items-center rounded-full border border-[#e6bd67]/46 bg-black/18 text-[10px] font-black tracking-[0.16em] shadow-[0_0_32px_rgba(230,189,103,.18)]">
              DA
            </span>
            <span className="h-px w-16 bg-[linear-gradient(90deg,#e6bd67,transparent)]" />
          </div>
          <p className="font-display text-[clamp(1.75rem,4.2vw,3.45rem)] leading-none tracking-[0.14em] text-[#e6bd67] [text-shadow:0_0_42px_rgba(230,189,103,.3)]">
            DOMUS AUREA
          </p>
          <p className="mt-2 text-[11px] font-extrabold uppercase tracking-[0.42em] text-[#fff1c8]/78">PRIVATE INVITATION</p>
        </motion.header>

        <AssetInvitationStage
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              onClick={openInvitation}
              className="mt-5 rounded-full border border-[#e6bd67]/30 bg-black/28 px-6 py-3 text-sm font-bold text-[#e6bd67] shadow-[0_18px_70px_rgba(0,0,0,.34)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#f6d98f] hover:bg-[#e6bd67] hover:text-[#130d07]"
            >
              اضغط على الختم لفتح الدعوة
            </motion.button>
          ) : null}
        </AnimatePresence>

        <motion.div
          initial={false}
          animate={isReading ? { opacity: 1, y: 0, height: "auto" } : { opacity: 0, y: 18, height: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-4xl overflow-hidden"
        >
          <div className="mt-7 rounded-[1.35rem] border border-[#e6bd67]/24 bg-[#020504]/52 p-4 shadow-[0_24px_90px_rgba(0,0,0,.36)] backdrop-blur-xl sm:p-5">
            <p className="text-center text-sm font-extrabold tracking-[0.16em] text-[#e6bd67]">الوقت المتبقي</p>
            <LuxuryAssetCountdown target={invitation.wedding_date} />
          </div>
        </motion.div>

        <motion.form
          onSubmit={submitRsvp}
          initial={false}
          animate={isReading ? { opacity: 1, y: 0, height: "auto" } : { opacity: 0, y: 22, height: 0 }}
          transition={{ duration: 0.8, delay: isReading ? 0.12 : 0, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-4xl overflow-hidden"
        >
          <div className="mt-5 rounded-[1.5rem] border border-[#e6bd67]/18 bg-white/[0.06] p-4 shadow-[0_24px_90px_rgba(0,0,0,.26)] backdrop-blur-xl sm:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <label className="flex-1">
                <span className="mb-2 block text-sm font-bold text-[#fbf2df]/72">اسم الضيف</span>
                <input
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  className="w-full rounded-2xl border border-[#e6bd67]/16 bg-black/32 px-5 py-4 text-[#fbf2df] outline-none transition placeholder:text-[#fbf2df]/35 focus:border-[#e6bd67] focus:bg-black/44"
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
                className="rounded-full bg-[#e6bd67] px-7 py-4 font-extrabold text-[#120d08] shadow-[0_18px_48px_rgba(230,189,103,.22)] transition hover:-translate-y-0.5 hover:bg-[#f6d98f] disabled:translate-y-0 disabled:opacity-55 md:w-[170px]"
              >
                <Send className="ml-2 inline h-4 w-4" />
                {loading ? "جار الحفظ..." : "إرسال"}
              </button>
            </div>
            {error ? <p className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
            {status ? <p className="mt-4 rounded-2xl border border-emerald-300/25 bg-emerald-500/10 p-3 text-sm text-emerald-100">{status}</p> : null}
          </div>
        </motion.form>
      </main>
    </section>
  );
}

export function LuxuryInvitationMiniature({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#020504] ${className}`}>
      <Image src={assets.background} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/25" />
      <Image src={assets.closedEnvelope} alt="" fill sizes="(min-width: 768px) 35vw, 100vw" className="object-contain p-[7%] drop-shadow-[0_24px_50px_rgba(0,0,0,.45)]" />
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

  return <AssetInvitationStage {...props} isReading={isReading} onReading={handleReading} compact />;
}

function AssetInvitationStage({
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
  const closedRef = useRef<HTMLDivElement | null>(null);
  const openRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const lightRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLButtonElement | null>(null);
  const crackedSealRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const nodes = [closedRef.current, openRef.current, cardRef.current, lightRef.current, sealRef.current, crackedSealRef.current, contentRef.current].filter(Boolean);

    if (!isOpen) {
      gsap.set(nodes, { clearProps: "all" });
      gsap.set(openRef.current, { autoAlpha: 0, scale: 0.94, clipPath: "inset(0% 48% 0% 48%)" });
      gsap.set(lightRef.current, { autoAlpha: 0, scale: 0.6 });
      gsap.set(cardRef.current, { autoAlpha: 0, y: 74, scale: 0.78, filter: "blur(10px)" });
      gsap.set(crackedSealRef.current, { autoAlpha: 0, scale: 0.86, y: 0 });
      gsap.set(contentRef.current, { autoAlpha: 0, y: 10 });
      return;
    }

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(closedRef.current, { autoAlpha: 0 });
        gsap.set(openRef.current, { autoAlpha: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(lightRef.current, { autoAlpha: 0.75, scale: 1 });
        gsap.set(cardRef.current, { autoAlpha: 1, y: -52, scale: 1, filter: "blur(0px)" });
        gsap.set(sealRef.current, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(crackedSealRef.current, { autoAlpha: 0 });
        gsap.set(contentRef.current, { autoAlpha: 1, y: 0 });
        onReading();
        return;
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: onReading
      });

      timeline
        .to(sealRef.current, { scale: 1.08, duration: 0.16, ease: "power2.out" }, 0)
        .to(sealRef.current, { autoAlpha: 0, scale: 0.82, duration: 0.34 }, 0.18)
        .to(crackedSealRef.current, { autoAlpha: 1, scale: 1.03, duration: 0.18 }, 0.2)
        .to(crackedSealRef.current, { autoAlpha: 0, y: 90, scale: 0.62, rotate: -8, duration: 1.05 }, 0.62)
        .to(closedRef.current, { autoAlpha: 0, y: -4, scale: 1.015, filter: "blur(2px)", duration: 1.15 }, 0.55)
        .to(openRef.current, { autoAlpha: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.45, ease: "power4.out" }, 0.52)
        .to(lightRef.current, { autoAlpha: 0.9, scale: 1.18, duration: 1.4 }, 0.72)
        .to(cardRef.current, { autoAlpha: 1, y: -52, scale: 1, filter: "blur(0px)", duration: 1.35, ease: "power4.out" }, 1.15)
        .to(contentRef.current, { autoAlpha: 1, y: 0, duration: 0.8 }, 1.78)
        .set(sealRef.current, { pointerEvents: "none" }, 0);
    }, stageRef);

    return () => ctx.revert();
  }, [isOpen, onReading, reduceMotion]);

  return (
    <div className="relative w-full">
      <div
        ref={stageRef}
        data-reading={isReading ? "true" : "false"}
        className={`relative mx-auto grid w-full place-items-center ${compact ? "min-h-[520px]" : "min-h-[clamp(360px,60svh,610px)]"}`}
      >
        <div className="absolute left-1/2 top-[82%] h-20 w-[min(86vw,880px)] -translate-x-1/2 rounded-full bg-black/62 blur-3xl" />
        <div ref={lightRef} className="absolute left-1/2 top-[48%] h-[min(58vw,620px)] w-[min(84vw,860px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,221,134,.72),rgba(224,181,89,.18)_42%,transparent_72%)] opacity-0 blur-3xl" />

        <div ref={closedRef} className="absolute left-1/2 top-[24%] z-20 w-[min(82vw,680px)] -translate-x-1/2 -translate-y-1/2">
          <Image src={assets.closedEnvelope} alt="" width={1200} height={800} priority className="h-auto w-full drop-shadow-[0_44px_110px_rgba(0,0,0,.62)]" />
        </div>

        <div ref={openRef} className="absolute left-1/2 top-[32%] z-20 w-[min(94vw,860px)] -translate-x-1/2 -translate-y-1/2 opacity-0">
          <Image src={assets.openEnvelope} alt="" width={1280} height={720} className="h-auto w-full drop-shadow-[0_48px_120px_rgba(0,0,0,.62)]" />
        </div>

        <div ref={cardRef} className="relative z-30 mt-4 w-[min(92vw,500px)] opacity-0 md:w-[min(46vw,520px)]">
          <div className="relative aspect-[2/3] w-full drop-shadow-[0_38px_110px_rgba(0,0,0,.55)]">
            <Image src={assets.card} alt="" fill sizes="(min-width: 768px) 620px, 90vw" className="object-contain" />
            <div ref={contentRef} className="absolute inset-[13%_10%_12%] flex flex-col items-center justify-center text-center text-[#2b1d13] opacity-0">
              <p className="text-[clamp(.62rem,1.2vw,.88rem)] font-extrabold tracking-[0.12em] text-[#a77c35]">دعوة خاصة</p>
              <div className="my-[3%] flex items-center gap-3 text-[#b88736]">
                <span className="h-px w-14 bg-[linear-gradient(90deg,transparent,#b88736)]" />
                <span className="text-sm">◆</span>
                <span className="h-px w-14 bg-[linear-gradient(90deg,#b88736,transparent)]" />
              </div>
              <h1 className="font-display text-[clamp(2rem,5.2vw,4.15rem)] leading-[1.12] text-[#9d7634] [text-shadow:0_10px_28px_rgba(82,48,18,.12)]">
                {groomName} & {brideName}
              </h1>
              <p className="mt-[3%] max-w-[82%] text-[clamp(.82rem,1.7vw,1.08rem)] font-bold leading-[1.85] text-[#3d2d1f]/82">{message}</p>

              <div className="mt-[5%] grid w-full grid-cols-3 gap-2 text-[#2b2118]">
                <InvitationInfo icon={<MapPin className="h-4 w-4" />} label="المكان" value={venue} />
                <InvitationInfo icon={<CalendarDays className="h-4 w-4" />} label="التاريخ" value={date} />
                <InvitationInfo icon={<Clock3 className="h-4 w-4" />} label="الساعة" value={time || "قريبًا"} />
              </div>

              <div className="mt-[5%] h-px w-[82%] bg-[linear-gradient(90deg,transparent,rgba(184,135,54,.58),transparent)]" />
              <p className="mt-[3%] text-[clamp(.78rem,1.4vw,.96rem)] font-extrabold text-[#9d7634]">نتشرف بحضوركم</p>
            </div>
          </div>
        </div>

        <button
          ref={sealRef}
          type="button"
          disabled={isOpen}
          onClick={onOpen}
          aria-label="Open invitation seal"
          className="absolute left-1/2 top-[35%] z-40 grid h-[clamp(72px,9.5vw,112px)] w-[clamp(72px,9.5vw,112px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none transition duration-500 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#f6d98f]"
        >
          {sealImageUrl ? (
            <>
              <Image
                src={sealImageUrl}
                alt=""
                fill
                sizes="132px"
                className="object-contain drop-shadow-[0_20px_44px_rgba(55,23,6,.42)]"
                unoptimized
              />
              <span className="pointer-events-none absolute font-display text-[clamp(1.2rem,3vw,2rem)] text-[#fff0b6]">{initials}</span>
            </>
          ) : (
            <span className="h-full w-full rounded-full" />
          )}
        </button>

        <div ref={crackedSealRef} className="absolute left-1/2 top-[35%] z-40 h-[clamp(78px,10vw,122px)] w-[clamp(78px,10vw,122px)] -translate-x-1/2 -translate-y-1/2 opacity-0">
          <Image src={assets.crackedSeal} alt="" fill sizes="142px" className="object-contain drop-shadow-[0_20px_44px_rgba(55,23,6,.42)]" />
        </div>
      </div>
    </div>
  );
}

function InvitationInfo({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#b88736]/16 bg-white/34 px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,.35)]">
      <div className="mx-auto mb-1 grid h-7 w-7 place-items-center rounded-full bg-[#b88736]/10 text-[#a1752c]">{icon}</div>
      <p className="text-[clamp(.52rem,1.25vw,.68rem)] font-extrabold text-[#9d7634]">{label}</p>
      <p className="mt-0.5 text-[clamp(.54rem,1.2vw,.75rem)] font-bold leading-4 text-[#2f2419]/82">{value}</p>
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
          ? "border-[#e6bd67]/55 bg-[#e6bd67] text-[#120d08] shadow-[0_14px_40px_rgba(230,189,103,.2)]"
          : "border-[#e6bd67]/14 bg-black/26 text-[#fbf2df]/70 hover:border-[#e6bd67]/40 hover:text-[#fbf2df]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function LuxuryAssetCountdown({ target }: { target: string }) {
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
          className="relative overflow-hidden rounded-[1.05rem] border border-[#e6bd67]/32 bg-[#06100d]/78 px-4 py-4 text-center shadow-[0_18px_55px_rgba(0,0,0,.25),inset_0_0_0_1px_rgba(255,255,255,.03)]"
        >
          <span className="absolute inset-x-3 top-0 h-px bg-[linear-gradient(90deg,transparent,#f6d98f,transparent)]" />
          <p className="font-display text-3xl leading-none text-[#f6d98f] sm:text-4xl">{String(unit.value).padStart(2, "0")}</p>
          <p className="mt-2 text-xs font-bold text-[#fbf2df]/62">{unit.label}</p>
        </div>
      ))}
    </div>
  );
}

function GoldDust() {
  const reduceMotion = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        id: index,
        left: (index * 41) % 100,
        delay: (index % 8) * 0.8,
        size: 2 + (index % 4),
        duration: 11 + (index % 7) * 1.45,
        drift: index % 2 === 0 ? 16 : -14
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className={`absolute top-[-8%] rounded-full bg-[#f6d98f] shadow-[0_0_18px_rgba(246,217,143,.5)] ${
            particle.id % 3 === 0 ? "hidden sm:block" : ""
          }`}
          style={{ left: `${particle.left}%`, width: particle.size, height: particle.size, opacity: 0.34 }}
          animate={
            reduceMotion
              ? { opacity: [0.16, 0.32, 0.16] }
              : { y: ["0vh", "112vh"], x: [0, particle.drift, -particle.drift / 2], opacity: [0, 0.42, 0.14, 0] }
          }
          transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: "linear" }}
        />
      ))}
      <div className="absolute inset-x-0 top-0 hidden h-28 bg-[radial-gradient(circle_at_50%_0%,rgba(246,217,143,.2),transparent_64%)] sm:block" />
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
