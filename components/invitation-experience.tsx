"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CalendarDays, Check, Clock3, MapPin, Send, Sparkles, X } from "lucide-react";
import type { PublicInvitation } from "@/lib/invitations";

type RsvpResponse = "accepted" | "declined";

type InvitationDateParts = {
  date: string;
  time: string;
};

const arabicFallbackMessage =
  "بكل الحب والفرحة، نتشرف بدعوتكم لمشاركتنا ليلة صممت لتبقى في الذاكرة، بحضوركم تكتمل البهجة وتبدأ الحكاية.";

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
    const duration = 0.34;
    const sampleCount = Math.floor(context.sampleRate * duration);
    const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let index = 0; index < sampleCount; index += 1) {
      const fade = 1 - index / sampleCount;
      const dryCrack = (Math.random() * 2 - 1) * Math.pow(fade, 3.1);
      const brittleSnap = Math.sin(index * 0.19) * Math.pow(fade, 5) * 0.36;
      data[index] = (dryCrack + brittleSnap) * 0.18;
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    filter.type = "bandpass";
    filter.frequency.value = 1350;
    filter.Q.value = 1.2;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.11, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start();
    window.setTimeout(() => void context.close(), 700);
  } catch {
    // Browsers may block audio contexts until a gesture is fully trusted.
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
  const invitationText = invitation.invitation_text || arabicFallbackMessage;

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
    <section dir="rtl" className="relative min-h-[100svh] overflow-x-hidden bg-[#030604] text-[#fbf2df]">
      <InvitationTopBar />
      <LuxuryAmbientParticles />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,171,82,.22),transparent_34%),radial-gradient(circle_at_12%_34%,rgba(14,74,58,.55),transparent_35%),radial-gradient(circle_at_86%_46%,rgba(6,54,43,.48),transparent_36%),linear-gradient(180deg,#020302_0%,#06100d_46%,#020302_100%)]" />
      <div className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,rgba(245,213,145,.16),transparent)]" />
      <div className="absolute inset-x-[-10%] bottom-0 h-40 bg-[radial-gradient(ellipse_at_center,rgba(217,171,82,.18),transparent_62%)] blur-2xl" />

      <main className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col items-center justify-center px-4 pb-24 pt-24 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.82, 0.18, 1] }}
          className="mb-2 text-center sm:mb-4"
        >
          <div className="mx-auto mb-2 flex items-center justify-center gap-3 text-[#d9ab52]">
            <span className="h-px w-16 bg-[linear-gradient(90deg,transparent,#d9ab52)]" />
            <span className="rounded-full border border-[#d9ab52]/35 px-3 py-1 text-[10px] font-extrabold tracking-[0.24em]">DA</span>
            <span className="h-px w-16 bg-[linear-gradient(90deg,#d9ab52,transparent)]" />
          </div>
          <p className="font-display text-[clamp(1.85rem,4.7vw,4.2rem)] leading-none tracking-[0.14em] text-[#d9ab52] [text-shadow:0_0_34px_rgba(217,171,82,.24)]">
            DOMUS AUREA
          </p>
          <p className="mt-2 text-[11px] font-extrabold uppercase tracking-[0.36em] text-[#f9e7b4]/78">PRIVATE INVITATION</p>
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
              className="mt-5 rounded-full border border-[#d9ab52]/20 bg-black/18 px-6 py-3 text-sm font-bold text-[#d9ab52] shadow-[0_16px_60px_rgba(0,0,0,.28)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#f1cf84] hover:bg-[#d9ab52] hover:text-[#120d08]"
            >
              Click the seal to open the invitation
            </motion.button>
          ) : null}
        </AnimatePresence>

        <motion.div
          initial={false}
          animate={isOpen ? { opacity: 1, y: 0, height: "auto" } : { opacity: 0, y: 18, height: 0 }}
          transition={{ duration: 0.85, delay: isOpen ? 1.2 : 0, ease: [0.2, 0.82, 0.18, 1] }}
          className="w-full max-w-4xl overflow-hidden"
        >
          <div className="mt-6 rounded-[1.4rem] border border-[#d9ab52]/20 bg-black/24 p-4 shadow-[0_24px_90px_rgba(0,0,0,.28)] backdrop-blur-xl sm:p-5">
            <p className="text-center text-sm font-extrabold tracking-[0.16em] text-[#d9ab52]">الوقت المتبقي</p>
            <LuxuryCountdown target={invitation.wedding_date} />
          </div>
        </motion.div>

        <motion.form
          onSubmit={submitRsvp}
          initial={false}
          animate={isOpen ? { opacity: 1, y: 0, height: "auto" } : { opacity: 0, y: 22, height: 0 }}
          transition={{ duration: 0.85, delay: isOpen ? 1.35 : 0, ease: [0.2, 0.82, 0.18, 1] }}
          className="w-full max-w-4xl overflow-hidden"
        >
          <div className="mt-5 rounded-[1.5rem] border border-[#d9ab52]/18 bg-white/[0.055] p-4 shadow-[0_24px_90px_rgba(0,0,0,.24)] backdrop-blur-xl sm:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <label className="flex-1">
                <span className="mb-2 block text-sm font-bold text-[#fbf2df]/72">اسم الضيف</span>
                <input
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  className="w-full rounded-2xl border border-[#d9ab52]/16 bg-black/32 px-5 py-4 text-[#fbf2df] outline-none transition placeholder:text-[#fbf2df]/35 focus:border-[#d9ab52] focus:bg-black/44"
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
                className="rounded-full bg-[#d9ab52] px-7 py-4 font-extrabold text-[#120d08] shadow-[0_18px_48px_rgba(217,171,82,.22)] transition hover:-translate-y-0.5 hover:bg-[#f3d88f] disabled:translate-y-0 disabled:opacity-55 md:w-[170px]"
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

function InvitationTopBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-full border border-[#d9ab52]/20 bg-black/26 px-4 py-2 text-center shadow-[0_16px_55px_rgba(0,0,0,.25)] backdrop-blur-xl">
          <p className="font-display text-lg leading-none tracking-[0.16em] text-[#d9ab52]">DOMUS AUREA</p>
          <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.32em] text-[#fbf2df]/56">Private Invitation</p>
        </div>
      </div>
    </div>
  );
}

export function LuxuryInvitationMiniature({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#050806] ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(217,171,82,.22),transparent_34%),radial-gradient(circle_at_14%_46%,rgba(6,67,52,.55),transparent_36%),linear-gradient(180deg,#030504,#07130f_58%,#030504)]" />
      <LuxuryAmbientParticles compact />
      <div className="absolute left-1/2 top-1/2 h-[72%] w-[82%] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-x-0 bottom-0 h-12 rounded-full bg-black/50 blur-2xl" />
        <div className="absolute inset-0 rounded-[1.4rem] border border-[#d9ab52]/35 bg-[#eadcc1] shadow-[0_32px_90px_rgba(0,0,0,.48),inset_0_0_0_1px_rgba(255,255,255,.45)]">
          <PaperTexture />
          <EmbossedFlorals />
          <div className="absolute inset-3 rounded-[1rem] border border-[#c89742]/28" />
          <div className="absolute inset-x-0 top-0 h-[48%] [clip-path:polygon(0_0,100%_0,50%_100%)] bg-[linear-gradient(180deg,#fff6df,#d7bd8e)] shadow-[0_18px_40px_rgba(77,49,18,.22)]" />
          <div className="absolute left-1/2 top-[52%] grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#f5d98c]/50 bg-[radial-gradient(circle_at_30%_24%,#fff0b6,#d5a04a_42%,#6b381c_88%)] text-xl font-black text-[#34200f] shadow-[0_18px_40px_rgba(48,25,8,.36),inset_0_3px_9px_rgba(255,255,255,.45)]">
            DA
          </div>
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
  message
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
}) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.01 : 1.85;
  const cardDelay = reduceMotion ? 0 : 0.82;

  function handleSealClick() {
    if (!isOpen) playSealBreakSound();
    onOpen();
  }

  return (
    <div className="relative w-full">
      <div className="relative mx-auto grid min-h-[clamp(340px,58svh,530px)] w-full max-w-[1000px] place-items-center">
        <motion.div
          initial={false}
          animate={isOpen ? { y: -6, scale: 0.99, rotateX: 0 } : { y: 0, scale: 1, rotateX: 2 }}
          transition={{ duration, ease: [0.2, 0.82, 0.18, 1] }}
          className="relative h-[clamp(300px,52svh,520px)] w-[min(94vw,980px)] [perspective:1800px]"
        >
          <div className="absolute left-1/2 top-[91%] h-20 w-[82%] -translate-x-1/2 rounded-full bg-black/55 blur-3xl" />

          <motion.div
            initial={false}
            animate={isOpen ? { opacity: 1, scale: 1.08 } : { opacity: 0, scale: 0.62 }}
            transition={{ duration: reduceMotion ? 0.01 : 1.5, delay: isOpen ? 0.35 : 0, ease: "easeOut" }}
            className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(255,225,149,.7),rgba(217,171,82,.2)_36%,transparent_70%)] blur-2xl"
          />

          <div className="absolute inset-x-[3%] bottom-[7%] top-[13%] overflow-hidden rounded-[1.6rem] border border-[#d9ab52]/28 bg-[#ecdec3] shadow-[0_42px_120px_rgba(0,0,0,.5),inset_0_0_0_1px_rgba(255,255,255,.5)]">
            <PaperTexture />
            <EmbossedFlorals />
            <div className="absolute inset-4 rounded-[1.15rem] border border-[#c89742]/20" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,rgba(78,44,18,.16))]" />
          </div>

          <motion.div
            initial={false}
            animate={isOpen ? { y: -66, rotateX: -62, opacity: 0.24 } : { y: 0, rotateX: 0, opacity: 1 }}
            transition={{ duration, ease: [0.2, 0.82, 0.18, 1] }}
            className="absolute inset-x-[3%] top-[13%] z-20 h-[39%] origin-top rounded-t-[1.6rem] border-x border-t border-[#d9ab52]/30 bg-[linear-gradient(180deg,#fff6df,#dfc393)] shadow-[0_22px_52px_rgba(68,41,18,.28)] [clip-path:polygon(0_0,100%_0,50%_100%)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <PaperTexture />
            <EmbossedFlorals />
          </motion.div>

          <EnvelopeDoor side="left" isOpen={isOpen} duration={duration} />
          <EnvelopeDoor side="right" isOpen={isOpen} duration={duration} />

          <div className="absolute left-1/2 top-1/2 z-30 h-full w-[min(92%,630px)] -translate-x-1/2 -translate-y-1/2 sm:w-[min(80%,630px)]">
            <motion.article
              initial={false}
              animate={
                isOpen
                  ? { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 34, scale: 0.87, rotateX: 5, filter: "blur(5px)" }
              }
              transition={{ duration: reduceMotion ? 0.01 : 1.18, delay: isOpen ? cardDelay : 0, ease: [0.2, 0.82, 0.18, 1] }}
              className="relative flex h-full w-full flex-col justify-center overflow-hidden rounded-[1.25rem] border border-[#d1a255]/35 bg-[#fbefd8] px-5 py-5 text-center text-[#23170e] shadow-[0_34px_100px_rgba(0,0,0,.42),inset_0_0_0_1px_rgba(255,255,255,.64),inset_0_22px_50px_rgba(255,255,255,.45)] sm:px-7 sm:py-6"
            >
              <PaperTexture />
              <div className="absolute inset-3 rounded-[.95rem] border border-[#c89742]/42" />
              <div className="absolute inset-6 rounded-[.7rem] border border-[#c89742]/14" />
              <FloralCorner className="right-5 top-5 rotate-90" />
              <FloralCorner className="bottom-5 left-5 -rotate-90" />

              <motion.div
                initial={false}
                animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ duration: 0.9, delay: isOpen ? cardDelay + 0.22 : 0, ease: [0.2, 0.82, 0.18, 1] }}
                className="relative z-10 mx-auto flex w-full max-w-[470px] flex-col items-center"
              >
                <p className="text-xs font-extrabold tracking-[0.18em] text-[#9d7634] sm:text-sm">دعوة خاصة</p>
                <div className="my-2 flex items-center gap-3 text-[#b88736] sm:my-3">
                  <span className="h-px w-16 bg-[linear-gradient(90deg,transparent,#b88736)]" />
                  <span className="text-lg">✦</span>
                  <span className="h-px w-16 bg-[linear-gradient(90deg,#b88736,transparent)]" />
                </div>
                <h2 className="font-display text-[clamp(1.9rem,5.4vw,3.8rem)] leading-tight text-[#9d7634] [text-shadow:0_10px_26px_rgba(82,48,18,.1)]">
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
              </motion.div>
            </motion.article>
          </div>

          <WaxSeal initials={initials || "DA"} isOpen={isOpen} onOpen={handleSealClick} />
        </motion.div>
      </div>
    </div>
  );
}

function EnvelopeDoor({ side, isOpen, duration }: { side: "left" | "right"; isOpen: boolean; duration: number }) {
  const isLeft = side === "left";

  return (
    <motion.div
      initial={false}
      animate={
        isOpen
          ? {
              x: isLeft ? "-63%" : "63%",
              rotateY: isLeft ? -12 : 12,
              opacity: 0.98
            }
          : { x: "0%", rotateY: 0, opacity: 1 }
      }
      transition={{ duration, ease: [0.2, 0.82, 0.18, 1] }}
      className={`absolute top-[13%] z-25 h-[80%] w-[49%] overflow-hidden border-y border-[#d9ab52]/28 bg-[#e9dac1] shadow-[0_28px_72px_rgba(43,25,10,.24),inset_0_0_0_1px_rgba(255,255,255,.42)] ${
        isLeft ? "left-[3%] origin-right rounded-l-[1.6rem] border-l" : "right-[3%] origin-left rounded-r-[1.6rem] border-r"
      }`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <PaperTexture />
      <EmbossedFlorals />
      <div className={`absolute inset-y-0 ${isLeft ? "right-0" : "left-0"} w-px bg-[#8f6425]/24`} />
      <div className={`absolute top-0 h-full w-[130%] ${isLeft ? "right-0" : "left-0"} bg-[linear-gradient(140deg,rgba(255,255,255,.35),transparent_42%,rgba(93,61,23,.16))]`} />
      <div className="absolute inset-4 rounded-[1.1rem] border border-[#c89742]/16" />
    </motion.div>
  );
}

function WaxSeal({ initials, isOpen, onOpen }: { initials: string; isOpen: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      disabled={isOpen}
      onClick={onOpen}
      aria-label="Open invitation seal"
      className="absolute left-1/2 top-[52%] z-40 grid h-[clamp(82px,11vw,128px)] w-[clamp(82px,11vw,128px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none"
    >
      <motion.span
        initial={false}
        animate={isOpen ? { opacity: 0, scale: 0.78, filter: "blur(1px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_24%,#fff0b6,#d9a957_32%,#925626_68%,#4c2413_100%)] shadow-[0_22px_56px_rgba(42,20,5,.42),inset_0_4px_10px_rgba(255,255,255,.48),inset_0_-14px_22px_rgba(58,26,8,.38)]"
      >
        <span className="absolute inset-[13%] rounded-full border border-[#ffe29a]/38" />
        <span className="absolute inset-[23%] rounded-full border border-[#5b2d16]/24" />
        <span className="absolute inset-[30%] grid place-items-center rounded-full bg-black/8 font-display text-[clamp(1.45rem,3.8vw,2.8rem)] text-[#f8dda0] [text-shadow:0_2px_8px_rgba(42,20,5,.45)]">
          {initials}
        </span>
        <svg className="absolute inset-[18%] h-[64%] w-[64%] text-[#f8dda0]/75" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 5" />
          <path d="M28 64c10 10 34 10 44 0M30 36c10-10 30-10 40 0" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </motion.span>

      <motion.span
        initial={false}
        animate={isOpen ? { opacity: 1, x: -34, y: 26, rotate: -18, scale: 0.9 } : { opacity: 0, x: 0, y: 0, rotate: 0, scale: 1 }}
        transition={{ duration: 0.82, ease: [0.2, 0.82, 0.18, 1] }}
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_24%,#fff0b6,#d9a957_32%,#925626_68%,#4c2413_100%)] shadow-[0_18px_45px_rgba(42,20,5,.36)] [clip-path:polygon(0_0,55%_0,44%_40%,58%_62%,46%_100%,0_100%)]"
      />
      <motion.span
        initial={false}
        animate={isOpen ? { opacity: 1, x: 36, y: 25, rotate: 16, scale: 0.92 } : { opacity: 0, x: 0, y: 0, rotate: 0, scale: 1 }}
        transition={{ duration: 0.82, ease: [0.2, 0.82, 0.18, 1] }}
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_24%,#fff0b6,#d9a957_32%,#925626_68%,#4c2413_100%)] shadow-[0_18px_45px_rgba(42,20,5,.36)] [clip-path:polygon(55%_0,100%_0,100%_100%,48%_100%,60%_62%,45%_40%)]"
      />
    </button>
  );
}

function InvitationInfo({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#b88736]/18 bg-white/30 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,.35)]">
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
          ? "border-[#d9ab52]/55 bg-[#d9ab52] text-[#120d08] shadow-[0_14px_40px_rgba(217,171,82,.2)]"
          : "border-[#d9ab52]/14 bg-black/26 text-[#fbf2df]/70 hover:border-[#d9ab52]/40 hover:text-[#fbf2df]"
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
          className="relative overflow-hidden rounded-[1.1rem] border border-[#d9ab52]/32 bg-[#07100d]/70 px-4 py-4 text-center shadow-[0_18px_55px_rgba(0,0,0,.25),inset_0_0_0_1px_rgba(255,255,255,.03)]"
        >
          <span className="absolute inset-x-3 top-0 h-px bg-[linear-gradient(90deg,transparent,#f4d587,transparent)]" />
          <p className="font-display text-3xl leading-none text-[#f4d587] sm:text-4xl">{String(unit.value).padStart(2, "0")}</p>
          <p className="mt-2 text-xs font-bold text-[#fbf2df]/62">{unit.label}</p>
        </div>
      ))}
    </div>
  );
}

function LuxuryAmbientParticles({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: compact ? 14 : 32 }, (_, index) => ({
        id: index,
        left: (index * 37) % 100,
        delay: (index % 9) * 0.7,
        size: 2 + (index % 4),
        duration: 10 + (index % 7) * 1.4,
        drift: index % 2 === 0 ? 22 : -18
      })),
    [compact]
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className={`absolute top-[-8%] rounded-full bg-[#f4d587] shadow-[0_0_18px_rgba(244,213,135,.5)] ${
            particle.id % 3 === 0 ? "hidden sm:block" : ""
          }`}
          style={{
            left: `${particle.left}%`,
            width: particle.size,
            height: particle.size,
            opacity: 0.42
          }}
          animate={
            reduceMotion
              ? { opacity: [0.18, 0.32, 0.18] }
              : {
                  y: ["0vh", "112vh"],
                  x: [0, particle.drift, -particle.drift / 2],
                  opacity: [0, 0.48, 0.16, 0]
                }
          }
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

function PaperTexture() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.42] mix-blend-multiply"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(126,84,35,.13) 0 1px, transparent 1.5px), radial-gradient(circle at 78% 34%, rgba(255,255,255,.36) 0 1px, transparent 1.5px), linear-gradient(115deg, transparent 0 38%, rgba(104,70,30,.08) 39%, transparent 41% 100%)",
        backgroundSize: "18px 18px, 24px 24px, 100% 100%"
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
