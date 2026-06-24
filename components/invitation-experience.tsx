"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Check, MapPin, Send, Sparkles, X } from "lucide-react";
import type { PublicInvitation } from "@/lib/invitations";

type RsvpResponse = "accepted" | "declined";

function formatWeddingDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "full",
    timeStyle: "short"
  }).format(date);
}

function getInitials(brideName: string, groomName: string) {
  const bride = brideName.trim().charAt(0);
  const groom = groomName.trim().charAt(0);
  return `${bride}${groom}`.toUpperCase() || "DA";
}

export function InvitationExperience({ invitation }: { invitation: PublicInvitation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [response, setResponse] = useState<RsvpResponse>("accepted");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const readableDate = useMemo(() => formatWeddingDate(invitation.wedding_date), [invitation.wedding_date]);
  const couple = `${invitation.bride_name} و ${invitation.groom_name}`;
  const initials = getInitials(invitation.bride_name, invitation.groom_name);
  const invitationText =
    invitation.invitation_text ||
    "بكل الحب والفرحة، نتشرف بدعوتكم لمشاركتنا بداية حكايتنا الجديدة في ليلة صممت لتبقى في الذاكرة.";

  useEffect(() => {
    if (invitation.id === "demo") return;
    fetch(`/api/invitations/${invitation.slug}/view`, { method: "POST" }).catch(() => undefined);
  }, [invitation.id, invitation.slug]);

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
    <section dir="rtl" className="relative min-h-screen overflow-hidden bg-[#070604] px-4 pb-16 pt-20 text-[#f9f0df] md:px-8 md:pt-24">
      <LuxuryAtmosphere />

      <div className="relative z-10 mx-auto grid max-w-[1480px] gap-7 xl:grid-cols-[minmax(0,1fr)_390px] xl:items-start">
        <main className="overflow-hidden rounded-[2rem] border border-[#e2bd69]/14 bg-[#0f0d09]/72 shadow-[0_40px_140px_rgba(0,0,0,.45)] backdrop-blur-xl">
          <header className="relative px-5 pb-3 pt-6 sm:px-8 lg:px-10 lg:pt-8">
            <div className="absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(226,189,105,.5),transparent)]" />
            <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#d7ad58]">
              <Sparkles className="h-4 w-4" />
              Domus Aurea Private Invitation
            </p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="font-display text-4xl leading-tight text-[#fff7e8] sm:text-5xl lg:text-6xl">{couple}</h1>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#f9f0df]/70">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-[#d7ad58]" />
                    {readableDate}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#d7ad58]" />
                    {invitation.venue}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="w-fit rounded-full border border-[#e2bd69]/35 bg-[#d4a64d] px-6 py-3 text-sm font-extrabold text-[#160f08] shadow-[0_18px_54px_rgba(212,166,77,.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f3d88f]"
              >
                {isOpen ? "إغلاق الدعوة" : "افتح الدعوة"}
              </button>
            </div>
          </header>

          <LuxuryInvitationArtifact
            isOpen={isOpen}
            onOpen={() => setIsOpen(true)}
            brideName={invitation.bride_name}
            groomName={invitation.groom_name}
            initials={initials}
            date={readableDate}
            venue={invitation.venue}
            message={invitationText}
          />
        </main>

        <motion.aside
          initial={false}
          animate={isOpen ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0.45, y: 18, filter: "blur(1px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-5 xl:sticky xl:top-24"
        >
          <div className="rounded-[1.65rem] border border-[#e2bd69]/14 bg-white/[0.055] p-5 shadow-[0_24px_80px_rgba(0,0,0,.24)] backdrop-blur-xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#d7ad58]">العد التنازلي</p>
            <LuxuryCountdown target={invitation.wedding_date} />
          </div>

          <motion.form
            onSubmit={submitRsvp}
            initial={false}
            animate={isOpen ? { opacity: 1, y: 0, pointerEvents: "auto" } : { opacity: 0.38, y: 12, pointerEvents: "none" }}
            transition={{ duration: 0.65, delay: isOpen ? 0.25 : 0, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[1.65rem] border border-[#e2bd69]/14 bg-white/[0.07] p-5 shadow-[0_24px_80px_rgba(0,0,0,.24)] backdrop-blur-xl"
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#d7ad58]">تأكيد الحضور</p>
            {!isOpen ? <p className="mt-3 text-sm leading-6 text-[#f9f0df]/58">افتح الدعوة أولًا ليظهر نموذج الرد بشكل كامل.</p> : null}

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold text-[#f9f0df]/72">اسم الضيف</span>
              <input
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                className="w-full rounded-2xl border border-[#e2bd69]/14 bg-black/30 px-5 py-4 text-[#f9f0df] outline-none transition focus:border-[#d7ad58] focus:bg-black/40"
                required
              />
            </label>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <RsvpChoice active={response === "accepted"} onClick={() => setResponse("accepted")} label="قبول الدعوة" icon={<Check className="h-4 w-4" />} />
              <RsvpChoice active={response === "declined"} onClick={() => setResponse("declined")} label="اعتذار" icon={<X className="h-4 w-4" />} />
            </div>

            {error ? <p className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
            {status ? <p className="mt-4 rounded-2xl border border-emerald-300/25 bg-emerald-500/10 p-3 text-sm text-emerald-100">{status}</p> : null}

            <button
              disabled={loading || !isOpen}
              className="mt-5 w-full rounded-full bg-[#d4a64d] px-7 py-4 font-extrabold text-[#160f08] shadow-[0_18px_48px_rgba(212,166,77,.2)] transition hover:-translate-y-0.5 hover:bg-[#f3d88f] disabled:translate-y-0 disabled:opacity-55"
            >
              <Send className="ml-2 inline h-4 w-4" />
              {loading ? "جاري الحفظ..." : "إرسال الرد"}
            </button>
          </motion.form>
        </motion.aside>
      </div>
    </section>
  );
}

export function LuxuryInvitationMiniature({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#e9dcc4] ${className}`}>
      <TableauSurface />
      <div className="absolute left-1/2 top-[54%] h-[430px] w-[300px] -translate-x-1/2 -translate-y-1/2 -rotate-3">
        <div className="absolute left-1/2 top-[94%] h-16 w-[112%] -translate-x-1/2 rounded-full bg-black/28 blur-2xl" />
        <div className="absolute inset-0 rounded-[1.6rem] bg-[#071c18] shadow-[0_26px_80px_rgba(0,0,0,.36),inset_0_0_0_1px_rgba(255,255,255,.08)]">
          <VelvetGrain />
          <div className="absolute inset-4 rounded-[1.15rem] border border-[#e2bd69]/22" />
        </div>
        <div className="absolute inset-x-[38px] top-[42px] h-[320px] overflow-hidden rounded-[1rem] bg-[#fbf2df] px-6 py-7 text-center text-[#25190e] shadow-[0_22px_58px_rgba(0,0,0,.3),inset_0_18px_32px_rgba(255,255,255,.44)]">
          <PaperTexture />
          <div className="absolute inset-4 rounded-[.8rem] border border-[#c99d49]/42" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center">
            <p className="text-[8px] font-extrabold uppercase tracking-[0.24em] text-[#a67a32]">Domus Aurea</p>
            <p className="mt-4 font-display text-4xl text-[#b8894b]">DA</p>
            <h3 className="mt-4 font-display text-3xl leading-tight text-[#24170f]">Layan<br />Yassin</h3>
            <div className="my-4 h-px w-20 bg-[linear-gradient(90deg,transparent,#bd8b3b,transparent)]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#2c2119]/62">Private invitation</p>
          </div>
        </div>
        <div className="absolute left-1/2 top-[40%] h-20 w-20 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_28%_24%,#ffe7a8,#c88639_44%,#5b2b18_84%)] opacity-0" />
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
  venue,
  message
}: {
  isOpen: boolean;
  onOpen: () => void;
  brideName: string;
  groomName: string;
  initials: string;
  date: string;
  venue: string;
  message: string;
}) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.01 : 1.75;
  const revealDelay = reduceMotion ? 0 : 0.82;

  return (
    <div className="relative px-3 pb-6 pt-2 sm:px-7 lg:px-10 lg:pb-10">
      <div className="relative mx-auto grid min-h-[560px] w-full max-w-[860px] place-items-center overflow-hidden rounded-[1.8rem] border border-[#e2bd69]/12 bg-[#e9dcc4] shadow-[inset_0_0_0_1px_rgba(255,255,255,.28),0_34px_120px_rgba(0,0,0,.35)] sm:min-h-[620px]">
        <TableauSurface />

        <motion.div
          initial={false}
          animate={isOpen ? { rotateX: 4, rotateZ: -1.2, y: -4, scale: 1 } : { rotateX: 8, rotateZ: -4, y: 14, scale: 0.94 }}
          transition={{ duration, ease: [0.2, 0.82, 0.18, 1] }}
          className="relative h-[470px] w-[322px] max-w-[82vw] sm:h-[545px] sm:w-[374px]"
          style={{ transformStyle: "preserve-3d", perspective: "1600px" }}
        >
          <div className="absolute left-1/2 top-[94%] h-20 w-[115%] -translate-x-1/2 rounded-full bg-black/32 blur-2xl" />
          <div className="absolute inset-0 rounded-[1.8rem] bg-[#071c18] shadow-[0_34px_100px_rgba(0,0,0,.45),inset_0_0_0_1px_rgba(255,255,255,.08)]">
            <VelvetGrain />
            <div className="absolute inset-4 rounded-[1.35rem] border border-[#e2bd69]/20" />
            <div className="absolute inset-x-12 bottom-5 h-px bg-[#e2bd69]/24" />
          </div>

          <motion.div
            initial={false}
            animate={isOpen ? { opacity: 1, y: -18, scale: 1, rotateX: 0 } : { opacity: 0, y: 58, scale: 0.84, rotateX: 6 }}
            transition={{ duration: reduceMotion ? 0.01 : 1.2, delay: isOpen ? 0.34 : 0, ease: [0.2, 0.82, 0.18, 1] }}
            className="absolute inset-x-[34px] top-[42px] z-20 h-[380px] overflow-hidden rounded-[1.15rem] bg-[#fbf2df] px-6 py-7 text-center text-[#25190e] shadow-[0_28px_74px_rgba(0,0,0,.32),inset_0_18px_32px_rgba(255,255,255,.44),inset_0_0_0_1px_rgba(107,65,25,.16)] sm:inset-x-[42px] sm:h-[450px] sm:px-8 sm:py-9"
          >
            <PaperTexture />
            <div className="absolute inset-4 rounded-[.85rem] border border-[#c99d49]/45" />
            <div className="absolute inset-7 rounded-[.65rem] border border-[#c99d49]/16" />
            <motion.div
              initial={false}
              animate={isOpen ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 10, filter: "blur(2px)" }}
              transition={{ duration: 0.85, delay: isOpen ? revealDelay : 0, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex h-full flex-col items-center justify-center"
            >
              <p className="text-[9px] font-extrabold uppercase tracking-[0.26em] text-[#a67a32]">Domus Aurea</p>
              <InvitationCrest initials={initials} />
              <h2 className="mt-4 bg-[linear-gradient(110deg,#7a4c1e,#d7ad58_44%,#8d642c_78%)] bg-clip-text font-display text-[2.15rem] leading-[1.06] text-transparent sm:text-[2.75rem]">
                {brideName}
                <span className="block py-1 text-base text-[#a67a32]">و</span>
                {groomName}
              </h2>
              <p className="mt-4 max-w-[250px] text-[11px] leading-5 text-[#3b2d20]/76 sm:text-xs sm:leading-6">{message}</p>
              <div className="my-4 h-px w-28 bg-[linear-gradient(90deg,transparent,#bd8b3b,transparent)]" />
              <p className="text-[10px] font-extrabold uppercase leading-5 tracking-[0.1em] text-[#2f251e]/78">{date}</p>
              <p className="mt-3 font-display text-[1.55rem] leading-tight text-[#9b7330] sm:text-3xl">{venue}</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={false}
            animate={isOpen ? { rotateX: -72, y: -118, opacity: 0.08 } : { rotateX: 0, y: 0, opacity: 1 }}
            transition={{ duration, ease: [0.18, 0.78, 0.16, 1] }}
            className="absolute inset-x-0 top-0 z-40 h-[46%] origin-top overflow-hidden rounded-t-[1.8rem] bg-[#071c18] shadow-[inset_0_-28px_70px_rgba(0,0,0,.38)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <VelvetGrain />
            <div className="absolute inset-x-10 top-8 h-px bg-[#e2bd69]/25" />
            <div className="absolute inset-x-7 bottom-0 h-px bg-[#e2bd69]/35" />
          </motion.div>

          <motion.div
            initial={false}
            animate={isOpen ? { x: -138, rotateY: -62, opacity: 0.18 } : { x: 0, rotateY: 0, opacity: 1 }}
            transition={{ duration, ease: [0.18, 0.78, 0.16, 1] }}
            className="absolute bottom-0 left-0 top-0 z-[35] w-[50%] origin-left rounded-l-[1.8rem] bg-[#071c18] shadow-[inset_-22px_0_50px_rgba(0,0,0,.3)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <VelvetGrain />
            <LaserVines side="left" />
          </motion.div>

          <motion.div
            initial={false}
            animate={isOpen ? { x: 138, rotateY: 62, opacity: 0.18 } : { x: 0, rotateY: 0, opacity: 1 }}
            transition={{ duration, ease: [0.18, 0.78, 0.16, 1] }}
            className="absolute bottom-0 right-0 top-0 z-[35] w-[50%] origin-right rounded-r-[1.8rem] bg-[#071c18] shadow-[inset_22px_0_50px_rgba(0,0,0,.3)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <VelvetGrain />
            <LaserVines side="right" />
          </motion.div>

          <motion.div
            initial={false}
            animate={isOpen ? { opacity: 0, scaleX: 0.35, y: 60 } : { opacity: 1, scaleX: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-[48%] z-50 h-3 w-[82%] -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,#7b551c,#f1d282_43%,#8a5c21)] shadow-[0_12px_30px_rgba(0,0,0,.35)]"
          />

          <WaxSeal isOpen={isOpen} initials={initials} />

          {!isOpen ? (
            <button
              type="button"
              onClick={onOpen}
              className="absolute inset-0 z-[70] cursor-pointer rounded-[1.8rem] focus:outline-none focus:ring-2 focus:ring-[#e2bd69]/70"
              aria-label="افتح الدعوة"
            >
              <span className="absolute bottom-7 left-1/2 -translate-x-1/2 rounded-full border border-[#e2bd69]/40 bg-black/42 px-5 py-3 text-sm font-extrabold text-[#f8e7bd] shadow-[0_18px_48px_rgba(0,0,0,.34)] backdrop-blur-md">
                اضغط لفتح الدعوة
              </span>
            </button>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}

function LuxuryAtmosphere() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(212,166,77,.18),transparent_30%),radial-gradient(circle_at_88%_20%,rgba(5,54,44,.5),transparent_34%),linear-gradient(145deg,#070604_0%,#15100b_48%,#031d18_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[linear-gradient(to_bottom,rgba(255,238,192,.12),transparent)]" />
      <div className="pointer-events-none absolute inset-0 hidden opacity-70 md:block">
        {Array.from({ length: 14 }).map((_, index) => (
          <motion.span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-[#d7ad58] shadow-[0_0_18px_rgba(215,173,88,.75)]"
            style={{ left: `${8 + ((index * 19) % 84)}%`, top: `${12 + ((index * 29) % 72)}%` }}
            animate={{ y: [0, -12, 0], opacity: [0.14, 0.58, 0.14], scale: [0.75, 1.15, 0.75] }}
            transition={{ duration: 8 + index * 0.42, delay: index * 0.25, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    </>
  );
}

function TableauSurface() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#d6c4a6,#f2e5cf_42%,#c8ad80_76%,#ead9bd)]" />
      <div className="absolute inset-0 opacity-[.26] [background-image:linear-gradient(110deg,rgba(255,255,255,.5)_0_10%,transparent_10%_34%,rgba(84,51,22,.15)_34%_36%,transparent_36%_100%),repeating-linear-gradient(9deg,rgba(101,71,36,.18)_0_1px,transparent_1px_18px)] [background-size:410px_100%,100%_100%]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,.5),transparent_26%),radial-gradient(circle_at_76%_86%,rgba(64,36,15,.18),transparent_36%)]" />
    </>
  );
}

function VelvetGrain() {
  return (
    <>
      <div className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_22%_16%,rgba(255,255,255,.1),transparent_30%),linear-gradient(135deg,#0a3028,#041411_62%,#09251f)]" />
      <div className="absolute inset-0 rounded-[inherit] opacity-[.14] [background-image:radial-gradient(circle_at_8px_8px,rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.22)_1px,transparent_1px)] [background-size:22px_22px,34px_100%]" />
    </>
  );
}

function PaperTexture() {
  return (
    <>
      <div className="absolute inset-0 opacity-[.22] [background-image:radial-gradient(circle_at_9px_9px,rgba(104,74,38,.32)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="absolute inset-0 opacity-[.16] [background-image:repeating-linear-gradient(98deg,rgba(92,67,36,.18)_0_1px,transparent_1px_9px),repeating-linear-gradient(7deg,rgba(255,255,255,.55)_0_1px,transparent_1px_14px)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,.38),transparent_34%,rgba(113,76,32,.08)_70%,transparent)]" />
    </>
  );
}

function LaserVines({ side }: { side: "left" | "right" }) {
  return (
    <svg className={`absolute inset-0 h-full w-full ${side === "right" ? "-scale-x-100" : ""}`} viewBox="0 0 190 560" aria-hidden="true">
      <g fill="#03100d" opacity=".68">
        {Array.from({ length: 12 }).map((_, index) => (
          <path
            key={index}
            d={`M${72 + (index % 2) * 12} ${44 + index * 38} C${32 + (index % 3) * 8} ${70 + index * 32}, ${28 + (index % 2) * 15} ${106 + index * 32}, ${70 + (index % 2) * 18} ${136 + index * 30} C${92 + (index % 2) * 8} ${100 + index * 32}, ${122 + (index % 2) * 7} ${86 + index * 31}, ${156} ${68 + index * 32} C${142} ${122 + index * 30}, ${102 + (index % 2) * 10} ${126 + index * 30}, ${72 + (index % 2) * 12} ${44 + index * 38}Z`}
          />
        ))}
      </g>
      <g fill="none" stroke="#1a4b3e" strokeLinecap="round" strokeWidth="4" opacity=".8">
        <path d="M98 22 C64 120 128 188 78 282 C42 358 76 454 40 538" />
        <path d="M98 22 C132 108 98 174 148 256 C184 322 150 428 176 538" />
        {Array.from({ length: 10 }).map((_, index) => (
          <path key={index} d={`M${78 + (index % 2) * 38} ${72 + index * 43} q${index % 2 ? 36 : -44} ${20 + index} ${index % 2 ? 70 : -76} ${54 + index}`} />
        ))}
      </g>
    </svg>
  );
}

function WaxSeal({ isOpen, initials }: { isOpen: boolean; initials: string }) {
  return (
    <motion.div
      initial={false}
      animate={isOpen ? { opacity: 0, scale: 0.72, y: 76, rotate: 8 } : { opacity: 1, scale: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, ease: [0.2, 0.82, 0.18, 1] }}
      className="absolute left-1/2 top-[38%] z-[60] h-24 w-24 -translate-x-1/2 sm:h-28 sm:w-28"
    >
      <div className="relative grid h-full w-full place-items-center rounded-full bg-[radial-gradient(circle_at_28%_24%,#ffe7a8,#c88639_44%,#5b2b18_84%)] text-[#2f190f] shadow-[0_22px_48px_rgba(0,0,0,.4),inset_10px_10px_22px_rgba(255,255,255,.18),inset_-12px_-14px_24px_rgba(0,0,0,.24)]">
        <span className="font-display text-4xl sm:text-5xl">{initials}</span>
        <span className="absolute inset-3 rounded-full border border-[#2f190f]/24" />
        <span className="absolute inset-6 rounded-full border border-[#2f190f]/16" />
        <span className="absolute left-2 top-7 h-4 w-5 rounded-full bg-white/18 blur-[1px]" />
      </div>
    </motion.div>
  );
}

function InvitationCrest({ initials }: { initials: string }) {
  return (
    <div className="relative mt-4 grid h-20 w-24 place-items-center">
      <svg viewBox="0 0 130 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <g fill="none" stroke="#b8894b" strokeLinecap="round" strokeWidth="1.8">
          <path d="M45 84 C18 62 20 30 52 14" />
          <path d="M85 84 C112 62 110 30 78 14" />
          {Array.from({ length: 7 }).map((_, index) => (
            <path key={index} d={`M${44 - index * 2} ${76 - index * 8} q-15 -5 -21 -17 q14 2 21 17Z`} />
          ))}
          {Array.from({ length: 7 }).map((_, index) => (
            <path key={`r-${index}`} d={`M${86 + index * 2} ${76 - index * 8} q15 -5 21 -17 q-14 2 -21 17Z`} />
          ))}
        </g>
      </svg>
      <span className="font-display text-3xl text-[#9b7330]">{initials}</span>
    </div>
  );
}

function LuxuryCountdown({ target }: { target: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const diff = Math.max(0, new Date(target).getTime() - now);
  const values = [
    ["الأيام", Math.floor(diff / 86400000)],
    ["الساعات", Math.floor((diff % 86400000) / 3600000)],
    ["الدقائق", Math.floor((diff % 3600000) / 60000)],
    ["الثواني", Math.floor((diff % 60000) / 1000)]
  ] as const;

  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      {values.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-[#e2bd69]/12 bg-black/24 p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
          <strong className="bg-[linear-gradient(110deg,#8f6324,#f4d78c,#9e702d)] bg-clip-text font-display text-4xl text-transparent">{String(value).padStart(2, "0")}</strong>
          <span className="mt-1 block text-xs font-bold text-[#f9f0df]/54">{label}</span>
        </div>
      ))}
    </div>
  );
}

function RsvpChoice({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 font-extrabold transition duration-300"
      style={{
        color: active ? "#160f08" : "rgba(249,240,223,.72)",
        background: active ? "#d4a64d" : "rgba(255,255,255,.04)",
        borderColor: active ? "#d4a64d" : "rgba(226,189,105,.14)"
      }}
    >
      {icon}
      {label}
    </button>
  );
}
