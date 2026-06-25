"use client";

import Image from "next/image";
import { FormEvent, ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { CalendarDays, Check, Clock3, MapPin, Send, X } from "lucide-react";
import type { PublicInvitation } from "@/lib/invitations";

type RsvpResponse = "accepted" | "declined";

type InvitationDateParts = {
  date: string;
  time: string;
};

const fallbackMessage =
  "بكل الحب والفرحة، نتشرف بدعوتكم لمشاركتنا ليلة صممت لتبقى في الذاكرة، بحضوركم تكتمل البهجة وتبدأ الحكاية.";

const demoBackground = "/assets/generated/royal-emerald-stage.webp";

function getInvitationDateParts(value: string): InvitationDateParts {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return { date: value || "قريبا", time: "" };
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
    const duration = 0.42;
    const sampleCount = Math.floor(context.sampleRate * duration);
    const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let index = 0; index < sampleCount; index += 1) {
      const progress = index / sampleCount;
      const fade = 1 - progress;
      const snap = Math.sin(index * 0.23) * Math.pow(fade, 6) * 0.28;
      const grain = (Math.random() * 2 - 1) * Math.pow(fade, 3.4) * 0.2;
      data[index] = snap + grain;
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    filter.type = "bandpass";
    filter.frequency.value = 1180;
    filter.Q.value = 1.35;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start();
    window.setTimeout(() => void context.close(), 800);
  } catch {
    // Some browsers delay AudioContext playback until the click gesture fully resolves.
  }
}

export function InvitationExperience({ invitation }: { invitation: PublicInvitation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [response, setResponse] = useState<RsvpResponse>("accepted");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dateParts = useMemo(() => getInvitationDateParts(invitation.wedding_date), [invitation.wedding_date]);
  const initials = useMemo(() => getInitials(invitation.bride_name, invitation.groom_name), [invitation.bride_name, invitation.groom_name]);
  const invitationText = invitation.invitation_text || fallbackMessage;

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
        setStatus("تم تسجيل ردك بنجاح. شكرا لمشاركتك.");
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
      setStatus("تم تسجيل ردك بنجاح. شكرا لمشاركتك.");
      setGuestName("");
    } catch (rsvpError) {
      setError(rsvpError instanceof Error ? rsvpError.message : "حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section dir="rtl" className="relative min-h-[100svh] overflow-x-hidden bg-[#020504] text-[#fbf2df]">
      <Image src={demoBackground} alt="" fill priority sizes="100vw" className="object-cover opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(238,202,122,.22),transparent_30%),linear-gradient(180deg,rgba(2,5,4,.2),#020504_96%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,7,6,.76),transparent_32%,transparent_68%,rgba(1,7,6,.76))]" />
      <LuxuryAmbientParticles />

      <main className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col items-center justify-center px-4 pb-24 pt-24 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-3 text-center sm:mb-5"
        >
          <div className="mx-auto mb-2 flex items-center justify-center gap-3 text-[#e6bd67]">
            <span className="h-px w-16 bg-[linear-gradient(90deg,transparent,#e6bd67)]" />
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[#e6bd67]/40 text-[10px] font-black tracking-[0.16em]">DA</span>
            <span className="h-px w-16 bg-[linear-gradient(90deg,#e6bd67,transparent)]" />
          </div>
          <p className="font-display text-[clamp(1.9rem,4.8vw,4.3rem)] leading-none tracking-[0.14em] text-[#e6bd67] [text-shadow:0_0_38px_rgba(230,189,103,.28)]">
            DOMUS AUREA
          </p>
          <p className="mt-2 text-[11px] font-extrabold uppercase tracking-[0.38em] text-[#fff1c8]/78">PRIVATE INVITATION</p>
        </motion.header>

        <LuxuryInvitationArtifact
          isOpen={isOpen}
          onOpen={openInvitation}
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
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.55 }}
              onClick={openInvitation}
              className="mt-5 rounded-full border border-[#e6bd67]/25 bg-black/24 px-6 py-3 text-sm font-bold text-[#e6bd67] shadow-[0_16px_60px_rgba(0,0,0,.32)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#f6d98f] hover:bg-[#e6bd67] hover:text-[#130d07]"
            >
              Click the seal to open the invitation
            </motion.button>
          ) : null}
        </AnimatePresence>

        <motion.div
          initial={false}
          animate={isOpen ? { opacity: 1, y: 0, height: "auto" } : { opacity: 0, y: 18, height: 0 }}
          transition={{ duration: 0.85, delay: isOpen ? 1.2 : 0, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-4xl overflow-hidden"
        >
          <div className="mt-6 rounded-[1.35rem] border border-[#e6bd67]/22 bg-[#020504]/50 p-4 shadow-[0_24px_90px_rgba(0,0,0,.34)] backdrop-blur-xl sm:p-5">
            <p className="text-center text-sm font-extrabold tracking-[0.16em] text-[#e6bd67]">الوقت المتبقي</p>
            <LuxuryCountdown target={invitation.wedding_date} />
          </div>
        </motion.div>

        <motion.form
          onSubmit={submitRsvp}
          initial={false}
          animate={isOpen ? { opacity: 1, y: 0, height: "auto" } : { opacity: 0, y: 22, height: 0 }}
          transition={{ duration: 0.85, delay: isOpen ? 1.35 : 0, ease: [0.22, 1, 0.36, 1] }}
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
    <div className={`relative h-full w-full overflow-hidden bg-[#030604] ${className}`}>
      <Image src={demoBackground} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(230,189,103,.2),transparent_36%),linear-gradient(180deg,rgba(0,0,0,.1),rgba(0,0,0,.58))]" />
      <div className="absolute left-1/2 top-1/2 h-[58%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-[1rem] border border-[#d9ab52]/38 bg-[#efe0c4] shadow-[0_28px_90px_rgba(0,0,0,.54),inset_0_0_0_1px_rgba(255,255,255,.6)]">
        <PaperTexture />
        <EmbossedFlorals />
        <div className="absolute inset-x-0 top-0 h-[48%] origin-top rounded-t-[1rem] bg-[linear-gradient(180deg,#fff2d7,#dbc092)] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
        <div className="absolute left-1/2 top-[52%] grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_24%,#fff0b6,#d7a453_38%,#805025_72%,#3d1d0e)] text-[#fff0b6] shadow-[0_18px_44px_rgba(48,25,8,.42),inset_0_3px_10px_rgba(255,255,255,.5)]">
          <span className="font-display text-2xl">DA</span>
        </div>
      </div>
    </div>
  );
}

export function LuxuryInvitationArtifact({
  isOpen,
  onOpen,
  brideName,
  groomName,
  initials,
  date,
  time = "",
  venue,
  message,
  sealImageUrl
}: {
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
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const leftDoorRef = useRef<HTMLDivElement | null>(null);
  const rightDoorRef = useRef<HTMLDivElement | null>(null);
  const topFlapRef = useRef<HTMLDivElement | null>(null);
  const lightRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const sealRef = useRef<HTMLButtonElement | null>(null);

  useLayoutEffect(() => {
    const nodes = [leftDoorRef.current, rightDoorRef.current, topFlapRef.current, lightRef.current, cardRef.current, sealRef.current].filter(Boolean);
    const stage = stageRef.current;
    const sealCracks = stage ? Array.from(stage.querySelectorAll(".seal-crack")) : [];
    const sealPieces = stage ? Array.from(stage.querySelectorAll(".seal-piece")) : [];
    const sealFace = stage?.querySelector(".seal-face") ? [stage.querySelector(".seal-face") as Element] : [];
    const sealPieceLeft = stage?.querySelector(".seal-piece-left") ? [stage.querySelector(".seal-piece-left") as Element] : [];
    const sealPieceRight = stage?.querySelector(".seal-piece-right") ? [stage.querySelector(".seal-piece-right") as Element] : [];

    if (!isOpen) {
      gsap.set(nodes, { clearProps: "all" });
      gsap.set(lightRef.current, { autoAlpha: 0, scale: 0.62 });
      gsap.set(cardRef.current, { autoAlpha: 0, y: 34, scale: 0.9, filter: "blur(8px)" });
      gsap.set(sealCracks, { autoAlpha: 0, scale: 0.7 });
      gsap.set(sealPieces, { x: 0, y: 0, rotate: 0, autoAlpha: 0 });
      gsap.set(sealFace, { autoAlpha: 1, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(leftDoorRef.current, { xPercent: -98, rotateY: -8 });
        gsap.set(rightDoorRef.current, { xPercent: 98, rotateY: 8 });
        gsap.set(topFlapRef.current, { y: -60, rotateX: -58, autoAlpha: 0.25 });
        gsap.set(lightRef.current, { autoAlpha: 1, scale: 1.1 });
        gsap.set(cardRef.current, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)" });
        gsap.set(sealRef.current, { pointerEvents: "none" });
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .to(sealCracks, { autoAlpha: 1, scale: 1, duration: 0.18, stagger: 0.035 }, 0)
        .to(sealFace, { autoAlpha: 0, scale: 0.82, duration: 0.42 }, 0.12)
        .to(sealPieceLeft, { autoAlpha: 1, x: -34, y: 24, rotate: -18, duration: 0.5 }, 0.12)
        .to(sealPieceRight, { autoAlpha: 1, x: 34, y: 24, rotate: 16, duration: 0.5 }, 0.12)
        .to(sealCracks, { autoAlpha: 0, scale: 0.84, duration: 0.55 }, 0.52)
        .to(sealPieceLeft, { autoAlpha: 0, x: -78, y: 138, rotate: -34, scale: 0.62, duration: 1.05 }, 0.55)
        .to(sealPieceRight, { autoAlpha: 0, x: 78, y: 138, rotate: 32, scale: 0.62, duration: 1.05 }, 0.55)
        .to(topFlapRef.current, { y: -74, rotateX: -64, autoAlpha: 0.32, duration: 1.35 }, 0.28)
        .to(leftDoorRef.current, { xPercent: -98, rotateY: -11, duration: 1.55 }, 0.46)
        .to(rightDoorRef.current, { xPercent: 98, rotateY: 11, duration: 1.55 }, 0.46)
        .to(lightRef.current, { autoAlpha: 1, scale: 1.12, duration: 1.35 }, 0.64)
        .to(cardRef.current, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.15 }, 0.9)
        .set(sealRef.current, { pointerEvents: "none" }, 0);
    }, stageRef);

    return () => ctx.revert();
  }, [isOpen, reduceMotion]);

  function handleSealClick() {
    onOpen();
  }

  return (
    <div className="relative w-full">
      <div className="relative mx-auto grid min-h-[clamp(340px,58svh,540px)] w-full max-w-[1020px] place-items-center">
        <div ref={stageRef} className="relative h-[clamp(300px,52svh,530px)] w-[min(94vw,1000px)] [perspective:1800px]">
          <div className="absolute left-1/2 top-[92%] h-20 w-[82%] -translate-x-1/2 rounded-full bg-black/60 blur-3xl" />

          <div ref={lightRef} className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(255,224,142,.68),rgba(224,181,89,.2)_38%,transparent_72%)] opacity-0 blur-2xl" />

          <div className="absolute inset-x-[3%] bottom-[7%] top-[13%] overflow-hidden rounded-[1.5rem] border border-[#d9ab52]/32 bg-[#efdfc1] shadow-[0_44px_130px_rgba(0,0,0,.58),inset_0_0_0_1px_rgba(255,255,255,.58)]">
            <PaperTexture />
            <EmbossedFlorals />
            <div className="absolute inset-4 rounded-[1.05rem] border border-[#bd8e3c]/22" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,rgba(78,44,18,.16))]" />
          </div>

          <div
            ref={topFlapRef}
            className="absolute inset-x-[3%] top-[13%] z-20 h-[40%] origin-top rounded-t-[1.5rem] border-x border-t border-[#d9ab52]/30 bg-[linear-gradient(180deg,#fff6df,#dfc293)] shadow-[0_22px_58px_rgba(68,41,18,.34)] [clip-path:polygon(0_0,100%_0,50%_100%)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <PaperTexture />
            <EmbossedFlorals />
          </div>

          <EnvelopeDoor refNode={leftDoorRef} side="left" />
          <EnvelopeDoor refNode={rightDoorRef} side="right" />

          <div className="absolute left-1/2 top-1/2 z-30 h-full w-[min(92%,640px)] -translate-x-1/2 -translate-y-1/2 sm:w-[min(80%,640px)]">
            <article
              ref={cardRef}
              className="relative flex h-full w-full flex-col justify-center overflow-hidden rounded-[1.2rem] border border-[#d1a255]/36 bg-[#fbefd8] px-5 py-5 text-center text-[#23170e] opacity-0 shadow-[0_36px_110px_rgba(0,0,0,.46),inset_0_0_0_1px_rgba(255,255,255,.66),inset_0_22px_50px_rgba(255,255,255,.46)] sm:px-7 sm:py-6"
            >
              <PaperTexture />
              <GoldWash />
              <div className="absolute inset-3 rounded-[.92rem] border border-[#c89742]/44" />
              <div className="absolute inset-6 rounded-[.66rem] border border-[#c89742]/14" />
              <FloralCorner className="right-4 top-4 rotate-90" />
              <FloralCorner className="bottom-4 left-4 -rotate-90" />

              <div className="relative z-10 mx-auto flex w-full max-w-[485px] flex-col items-center">
                <p className="text-xs font-extrabold tracking-[0.18em] text-[#9d7634] sm:text-sm">دعوة خاصة</p>
                <div className="my-2 flex items-center gap-3 text-[#b88736] sm:my-3">
                  <span className="h-px w-16 bg-[linear-gradient(90deg,transparent,#b88736)]" />
                  <span className="text-lg">✦</span>
                  <span className="h-px w-16 bg-[linear-gradient(90deg,#b88736,transparent)]" />
                </div>
                <h2 className="font-display text-[clamp(1.9rem,5.4vw,3.9rem)] leading-tight text-[#9d7634] [text-shadow:0_10px_26px_rgba(82,48,18,.1)]">
                  {groomName} & {brideName}
                </h2>
                <p className="mt-1 max-w-sm text-sm font-bold leading-6 text-[#4b3928]/76 sm:text-[15px]">{message}</p>

                <div className="mt-3 grid w-full grid-cols-3 gap-2 text-[#2b2118] sm:mt-4">
                  <InvitationInfo icon={<Clock3 className="h-4 w-4" />} label="الساعة" value={time || "قريبا"} />
                  <InvitationInfo icon={<CalendarDays className="h-4 w-4" />} label="التاريخ" value={date} />
                  <InvitationInfo icon={<MapPin className="h-4 w-4" />} label="المكان" value={venue} />
                </div>

                <div className="mt-3 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(184,135,54,.55),transparent)] sm:mt-4" />
                <p className="mt-2 text-sm font-extrabold text-[#9d7634]">نتشرف بحضوركم</p>
              </div>
            </article>
          </div>

          <WaxSeal refNode={sealRef} initials={initials || "DA"} isOpen={isOpen} onOpen={handleSealClick} sealImageUrl={sealImageUrl} />
        </div>
      </div>
    </div>
  );
}

function EnvelopeDoor({ side, refNode }: { side: "left" | "right"; refNode: React.RefObject<HTMLDivElement> }) {
  const isLeft = side === "left";

  return (
    <div
      ref={refNode}
      className={`absolute top-[13%] z-[25] h-[80%] w-[49%] overflow-hidden border-y border-[#d9ab52]/30 bg-[#ead9ba] shadow-[0_28px_78px_rgba(43,25,10,.28),inset_0_0_0_1px_rgba(255,255,255,.46)] ${
        isLeft ? "left-[3%] origin-right rounded-l-[1.5rem] border-l" : "right-[3%] origin-left rounded-r-[1.5rem] border-r"
      }`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <PaperTexture />
      <EmbossedFlorals />
      <div className={`absolute inset-y-0 ${isLeft ? "right-0" : "left-0"} w-px bg-[#8f6425]/24`} />
      <div className={`absolute top-0 h-full w-[130%] ${isLeft ? "right-0" : "left-0"} bg-[linear-gradient(140deg,rgba(255,255,255,.34),transparent_42%,rgba(93,61,23,.16))]`} />
      <div className="absolute inset-4 rounded-[1rem] border border-[#c89742]/16" />
    </div>
  );
}

function WaxSeal({
  refNode,
  initials,
  isOpen,
  onOpen,
  sealImageUrl
}: {
  refNode: React.RefObject<HTMLButtonElement>;
  initials: string;
  isOpen: boolean;
  onOpen: () => void;
  sealImageUrl?: string | null;
}) {
  const sealContent = sealImageUrl ? (
    <img src={sealImageUrl} alt="" className="h-[68%] w-[68%] rounded-full object-contain drop-shadow-[0_4px_10px_rgba(42,20,5,.35)]" />
  ) : (
    <span className="font-display text-[clamp(1.45rem,3.8vw,2.8rem)] text-[#fff0b6] [text-shadow:0_2px_8px_rgba(42,20,5,.45)]">{initials}</span>
  );

  return (
    <button
      ref={refNode}
      type="button"
      disabled={isOpen}
      onClick={onOpen}
      aria-label="Open invitation seal"
      className="absolute left-1/2 top-[52%] z-40 grid h-[clamp(86px,11vw,132px)] w-[clamp(86px,11vw,132px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none"
    >
      <span className="seal-face absolute inset-0 grid place-items-center rounded-full bg-[radial-gradient(circle_at_30%_24%,#fff0b6,#d9a957_32%,#915426_68%,#4c2413_100%)] shadow-[0_22px_56px_rgba(42,20,5,.44),inset_0_4px_10px_rgba(255,255,255,.48),inset_0_-14px_22px_rgba(58,26,8,.38)]">
        <span className="absolute inset-[13%] rounded-full border border-[#ffe29a]/38" />
        <span className="absolute inset-[24%] rounded-full border border-[#5b2d16]/24" />
        {sealContent}
        <SealLaurel />
      </span>

      <span className="seal-piece seal-piece-left absolute inset-0 grid place-items-center rounded-full bg-[radial-gradient(circle_at_30%_24%,#fff0b6,#d9a957_32%,#915426_68%,#4c2413_100%)] opacity-0 shadow-[0_18px_45px_rgba(42,20,5,.36)] [clip-path:polygon(0_0,55%_0,44%_40%,58%_62%,46%_100%,0_100%)]">
        {sealContent}
      </span>
      <span className="seal-piece seal-piece-right absolute inset-0 grid place-items-center rounded-full bg-[radial-gradient(circle_at_30%_24%,#fff0b6,#d9a957_32%,#915426_68%,#4c2413_100%)] opacity-0 shadow-[0_18px_45px_rgba(42,20,5,.36)] [clip-path:polygon(55%_0,100%_0,100%_100%,48%_100%,60%_62%,45%_40%)]">
        {sealContent}
      </span>
      <svg className="seal-crack pointer-events-none absolute inset-[18%] h-[64%] w-[64%] opacity-0 text-[#3d1d0e]" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M52 4 45 24l11 16-13 18 10 15-7 23" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M46 42 26 50M54 58l21 9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function SealLaurel() {
  return (
    <svg className="pointer-events-none absolute inset-[19%] h-[62%] w-[62%] text-[#fff0b6]/72" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 5" />
      <path d="M28 64c10 10 34 10 44 0M30 36c10-10 30-10 40 0" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function InvitationInfo({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#b88736]/18 bg-white/30 px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,.35)] sm:px-3">
      <div className="mx-auto mb-1 grid h-7 w-7 place-items-center rounded-full bg-[#b88736]/10 text-[#a1752c]">{icon}</div>
      <p className="text-[10px] font-extrabold text-[#9d7634]">{label}</p>
      <p className="mt-0.5 text-[11px] font-bold leading-4 text-[#2f2419]/82">{value}</p>
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

function LuxuryAmbientParticles() {
  const reduceMotion = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: (index * 37) % 100,
        delay: (index % 9) * 0.72,
        size: 2 + (index % 4),
        duration: 10 + (index % 7) * 1.35,
        drift: index % 2 === 0 ? 18 : -16
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className={`absolute top-[-8%] rounded-full bg-[#f6d98f] shadow-[0_0_18px_rgba(246,217,143,.52)] ${
            particle.id % 3 === 0 ? "hidden sm:block" : ""
          }`}
          style={{ left: `${particle.left}%`, width: particle.size, height: particle.size, opacity: 0.38 }}
          animate={
            reduceMotion
              ? { opacity: [0.18, 0.32, 0.18] }
              : { y: ["0vh", "112vh"], x: [0, particle.drift, -particle.drift / 2], opacity: [0, 0.48, 0.16, 0] }
          }
          transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
}

function PaperTexture() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.46] mix-blend-multiply"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(126,84,35,.13) 0 1px, transparent 1.5px), radial-gradient(circle at 78% 34%, rgba(255,255,255,.36) 0 1px, transparent 1.5px), linear-gradient(115deg, transparent 0 38%, rgba(104,70,30,.08) 39%, transparent 41% 100%)",
        backgroundSize: "18px 18px, 24px 24px, 100% 100%"
      }}
    />
  );
}

function GoldWash() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-70"
      style={{
        backgroundImage:
          "radial-gradient(circle at 8% 12%, rgba(185,139,60,.2), transparent 22%), radial-gradient(circle at 92% 82%, rgba(185,139,60,.18), transparent 24%), linear-gradient(135deg, transparent, rgba(255,255,255,.38) 48%, transparent 52%)"
      }}
    />
  );
}

function EmbossedFlorals() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full text-[#9e7a3b]/24" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M92 408c98-118 178-122 292-98M126 384c20-54 10-112-36-170M188 344c28-72 10-128-44-190M248 322c40-48 52-96 24-152" />
        <path d="M110 396c30-8 52-28 66-60M174 352c38 0 74-22 104-62M250 320c48 12 96-2 144-38" />
        <path d="M908 160c-92 110-170 116-292 96M876 178c-22 56-12 112 34 170M816 216c-34 72-16 128 40 190M748 242c-42 52-54 100-28 156" />
        <path d="M890 174c-30 8-52 28-66 60M826 218c-38 0-74 22-104 62M750 244c-48-12-96 2-144 38" />
      </g>
    </svg>
  );
}

function FloralCorner({ className }: { className: string }) {
  return (
    <svg className={`pointer-events-none absolute h-20 w-20 text-[#b88736]/22 sm:h-28 sm:w-28 ${className}`} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <path d="M18 100C44 78 58 54 60 20M20 82c20-2 34-12 42-28M36 92c24 2 44-7 58-26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M46 54c-11 2-18-6-16-16 12-2 20 6 16 16ZM70 38c-9-6-9-17 0-24 10 7 10 18 0 24ZM78 70c2-11 12-17 22-12-2 12-13 18-22 12Z" fill="currentColor" opacity=".5" />
    </svg>
  );
}
