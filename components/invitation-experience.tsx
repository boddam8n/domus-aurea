"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Check, MapPin, Send, X } from "lucide-react";
import { Countdown } from "@/components/countdown";
import type { PublicInvitation } from "@/lib/invitations";

type InvitationMechanism = "burgundy-scroll" | "navy-gate";

function getCoupleInitials(brideName: string, groomName: string) {
  const first = brideName.trim().charAt(0);
  const second = groomName.trim().charAt(0);
  return `${first}${second}`.toUpperCase() || "DA";
}

function formatWeddingDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "full",
    timeStyle: "short"
  }).format(date);
}

function resolveMechanism(templateName: string): InvitationMechanism {
  const normalized = templateName.toLowerCase();
  if (normalized.includes("navy") || normalized.includes("laser") || normalized.includes("gate")) {
    return "navy-gate";
  }
  return "burgundy-scroll";
}

export function InvitationExperience({ invitation }: { invitation: PublicInvitation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [response, setResponse] = useState<"accepted" | "declined">("accepted");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const initials = getCoupleInitials(invitation.bride_name, invitation.groom_name);
  const couple = `${invitation.bride_name} و ${invitation.groom_name}`;
  const mechanism = resolveMechanism(invitation.template_name);
  const readableDate = useMemo(() => formatWeddingDate(invitation.wedding_date), [invitation.wedding_date]);
  const invitationText =
    invitation.invitation_text ||
    "بكل الحب والفرحة، نتشرف بدعوتكم لمشاركتنا بداية حكايتنا الجديدة في ليلة صُممت لتبقى في الذاكرة.";

  useEffect(() => {
    if (!isOpen || invitation.id === "demo") return;
    fetch(`/api/invitations/${invitation.slug}/view`, { method: "POST" }).catch(() => undefined);
  }, [invitation.id, invitation.slug, isOpen]);

  async function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    setLoading(true);

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

  const sceneData = { invitation, initials, couple, readableDate, invitationText, isOpen };

  return (
    <section className="relative min-h-screen overflow-x-hidden bg-[#090806] px-4 pb-20 pt-24 text-[#f7efe2] md:px-8 md:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(218,179,103,.18),transparent_34%),radial-gradient(circle_at_88%_24%,rgba(6,47,39,.45),transparent_34%),linear-gradient(145deg,#080705_0%,#17110c_48%,#031d18_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[linear-gradient(to_bottom,rgba(255,238,192,.12),transparent)]" />

      <div className="relative z-10 mx-auto grid max-w-[1500px] gap-8 xl:grid-cols-[minmax(0,1fr)_390px] xl:items-start">
        <div className="rounded-[2rem] border border-white/10 bg-black/20 p-3 shadow-[0_44px_150px_rgba(0,0,0,.46)] backdrop-blur-xl md:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4 px-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#c89b46]">Domus Aurea Wedding Invitation</p>
              <h1 className="mt-3 font-display text-4xl leading-tight md:text-6xl">{couple}</h1>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="rounded-full border border-[#c89b46]/45 bg-[#c89b46] px-6 py-3 text-sm font-bold text-[#120d08] shadow-[0_18px_48px_rgba(200,155,70,.22)] transition hover:-translate-y-0.5 hover:bg-[#f0cf84]"
            >
              {isOpen ? "إغلاق الدعوة" : "فتح الدعوة"}
            </button>
          </div>

          {mechanism === "navy-gate" ? <NavyGateScene {...sceneData} /> : <BurgundyScrollScene {...sceneData} />}
        </div>

        <aside className="grid gap-5 xl:sticky xl:top-28">
          <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.06] p-5 shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#c89b46]">Wedding countdown</p>
            <div className="mt-4">
              <Countdown target={invitation.wedding_date} />
            </div>
          </div>

          <form onSubmit={submitRsvp} className="rounded-[1.7rem] border border-white/10 bg-white/[0.07] p-5 shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#c89b46]">تأكيد الحضور</p>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold text-[#f7efe2]/70">اسم الضيف</span>
              <input
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-[#f7efe2] outline-none transition focus:border-[#c89b46]"
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
              disabled={loading}
              className="mt-5 w-full rounded-full bg-[#c89b46] px-7 py-4 font-bold text-[#120d08] transition hover:bg-[#f0cf84] disabled:opacity-60"
            >
              <Send className="ml-2 inline h-4 w-4" />
              {loading ? "جاري الحفظ..." : "إرسال الرد"}
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
}

function BurgundyScrollScene({
  invitation,
  initials,
  readableDate,
  invitationText,
  isOpen
}: {
  invitation: PublicInvitation;
  initials: string;
  couple: string;
  readableDate: string;
  invitationText: string;
  isOpen: boolean;
}) {
  return (
    <div className="relative min-h-[660px] overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#d8d1c4] shadow-[inset_0_0_0_1px_rgba(255,255,255,.18)] sm:min-h-[720px]">
      <MarbleSurface />
      <GlassKeepsakeBox />
      <WindowLight />

      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        className="absolute left-1/2 top-1/2 h-[580px] w-[900px] max-w-none -translate-x-1/2 -translate-y-1/2 scale-[.56] sm:scale-[.68] md:scale-[.78] lg:scale-[.9] xl:scale-100"
        style={{ transformStyle: "preserve-3d" }}
      >
        <ObjectShadow className="left-[13%] top-[74%] h-28 w-[720px] -rotate-[10deg]" />

        <motion.div
          variants={{
            closed: { x: 160, y: 26, rotate: -9, scaleX: 0.18, opacity: 0.96 },
            open: { x: 0, y: 0, rotate: -7, scaleX: 1, opacity: 1 }
          }}
          transition={{ duration: 1.95, ease: [0.2, 0.82, 0.18, 1] }}
          className="absolute left-[130px] top-[94px] h-[410px] w-[620px] origin-left overflow-hidden rounded-sm bg-[#7f1230] shadow-[0_30px_80px_rgba(55,7,20,.35),inset_0_0_0_1px_rgba(255,255,255,.08)]"
        >
          <BurgundyPaperTexture />
          <GoldInvitationCopy invitation={invitation} initials={initials} readableDate={readableDate} invitationText={invitationText} isOpen={isOpen} />
        </motion.div>

        <ScrollRoll className="left-[76px] top-[70px] h-[470px]" />
        <motion.div
          variants={{
            closed: { x: -444, rotate: -8 },
            open: { x: 0, rotate: -8 }
          }}
          transition={{ duration: 1.95, ease: [0.2, 0.82, 0.18, 1] }}
        >
          <ScrollRoll className="left-[720px] top-[70px] h-[470px]" />
        </motion.div>

        <DryFlorals isOpen={isOpen} />
        <CordAndWaxSeal isOpen={isOpen} initials={initials} />
      </motion.div>
    </div>
  );
}

function NavyGateScene({
  invitation,
  initials,
  readableDate,
  invitationText,
  isOpen
}: {
  invitation: PublicInvitation;
  initials: string;
  couple: string;
  readableDate: string;
  invitationText: string;
  isOpen: boolean;
}) {
  return (
    <div className="relative min-h-[660px] overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#a46e37] shadow-[inset_0_0_0_1px_rgba(255,255,255,.12)] sm:min-h-[720px]">
      <WoodSurface />
      <WindowLight warm />

      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        className="absolute left-1/2 top-1/2 h-[600px] w-[900px] max-w-none -translate-x-1/2 -translate-y-1/2 scale-[.55] sm:scale-[.68] md:scale-[.8] lg:scale-[.92] xl:scale-100"
        style={{ transformStyle: "preserve-3d", perspective: "1800px" }}
      >
        <ObjectShadow className="left-[10%] top-[76%] h-28 w-[730px] -rotate-[6deg]" />
        <div className="absolute left-[150px] top-[80px] h-[460px] w-[600px] -rotate-[6deg]" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute inset-0 rounded-sm bg-[#111d36] shadow-[0_36px_95px_rgba(4,9,22,.38)]" />
          <InnerPaper invitation={invitation} initials={initials} readableDate={readableDate} invitationText={invitationText} />

          <motion.div
            variants={{
              closed: { rotateY: 0, x: 0 },
              open: { rotateY: -112, x: -18 }
            }}
            transition={{ duration: 1.75, ease: [0.2, 0.82, 0.18, 1] }}
            className="absolute left-0 top-0 z-30 h-full w-[300px] origin-left"
            style={{ transformStyle: "preserve-3d" }}
          >
            <LaserCutPanel side="left" />
          </motion.div>

          <motion.div
            variants={{
              closed: { rotateY: 0, x: 0 },
              open: { rotateY: 112, x: 18 }
            }}
            transition={{ duration: 1.75, ease: [0.2, 0.82, 0.18, 1] }}
            className="absolute right-0 top-0 z-30 h-full w-[300px] origin-right"
            style={{ transformStyle: "preserve-3d" }}
          >
            <LaserCutPanel side="right" />
          </motion.div>

          <motion.div
            variants={{
              closed: { opacity: 1, scale: 1, y: 0, rotate: 0 },
              open: { opacity: 1, scale: 0.92, x: -210, y: 95, rotate: -7 }
            }}
            transition={{ duration: 1.45, ease: [0.2, 0.82, 0.18, 1] }}
            className="absolute left-1/2 top-1/2 z-40 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[#081124] shadow-[0_18px_44px_rgba(0,0,0,.36)]"
            style={{ background: "linear-gradient(135deg,#7b5520,#f6d783_42%,#a2712d_72%,#fff1a7)" }}
          >
            <span className="font-display text-5xl">{initials}</span>
            <span className="absolute inset-2 rounded-full border border-[#081124]/20" />
            <span className="absolute inset-4 rounded-full border border-[#081124]/15" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function GoldInvitationCopy({
  invitation,
  initials,
  readableDate,
  invitationText,
  isOpen
}: {
  invitation: PublicInvitation;
  initials: string;
  readableDate: string;
  invitationText: string;
  isOpen: boolean;
}) {
  return (
    <motion.div
      animate={isOpen ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 10, filter: "blur(3px)" }}
      transition={{ duration: 0.85, delay: isOpen ? 0.95 : 0, ease: [0.2, 0.82, 0.18, 1] }}
      className="relative z-10 ml-[270px] flex h-full w-[300px] flex-col items-center justify-center px-4 text-center text-[#d8af61]"
    >
      <LaurelCrest initials={initials} />
      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#f0cf84] [text-shadow:0_1px_0_rgba(255,255,255,.22),0_8px_16px_rgba(0,0,0,.22)]">Together with their families</p>
      <h2 className="mt-6 bg-[linear-gradient(110deg,#ffe8a8,#b7792c_35%,#fff0b8_52%,#c18b3a_75%,#f8d98c)] bg-clip-text font-display text-4xl leading-tight text-transparent [text-shadow:0_12px_24px_rgba(0,0,0,.28)]">
        {invitation.bride_name}
        <span className="block py-2 text-lg text-[#c89b46]">و</span>
        {invitation.groom_name}
      </h2>
      <p className="mt-5 max-w-xs text-xs leading-6 text-[#e7c477]/90 [text-shadow:0_8px_18px_rgba(0,0,0,.2)]">{invitationText}</p>
      <p className="mt-5 text-xs font-bold uppercase leading-6 tracking-[0.14em] text-[#f0cf84] [text-shadow:0_8px_18px_rgba(0,0,0,.24)]">{readableDate}</p>
      <p className="mt-3 bg-[linear-gradient(110deg,#ffe8a8,#b7792c_42%,#fff0b8_60%,#c18b3a)] bg-clip-text font-display text-2xl text-transparent [text-shadow:0_12px_24px_rgba(0,0,0,.28)]">{invitation.venue}</p>
      <SmallOrnament />
    </motion.div>
  );
}

function InnerPaper({
  invitation,
  initials,
  readableDate,
  invitationText
}: {
  invitation: PublicInvitation;
  initials: string;
  readableDate: string;
  invitationText: string;
}) {
  return (
    <motion.div
      variants={{
        closed: { opacity: 0.68, scale: 0.985 },
        open: { opacity: 1, scale: 1 }
      }}
      transition={{ duration: 1.25, ease: [0.2, 0.82, 0.18, 1] }}
      className="absolute left-[160px] top-[34px] z-10 h-[392px] w-[280px] bg-[#f6efe0] p-7 text-center text-[#1a2337] shadow-[0_26px_70px_rgba(0,0,0,.24),inset_0_0_0_1px_rgba(16,28,53,.18)]"
    >
      <div className="absolute inset-4 border border-[#1a2337]/35" />
      <div className="absolute inset-6 border border-[#1a2337]/15" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#1a2337]/65">Domus Aurea</p>
        <p className="mt-4 font-display text-5xl text-[#b8894b]">{initials}</p>
        <h2 className="mt-5 font-display text-4xl leading-tight">
          {invitation.bride_name}
          <span className="block py-1 text-base text-[#b8894b]">&</span>
          {invitation.groom_name}
        </h2>
        <p className="mt-4 text-xs leading-6 text-[#1a2337]/72">{invitationText}</p>
        <div className="my-4 h-px w-24 bg-[#1a2337]/35" />
        <p className="text-[11px] font-bold uppercase leading-5 tracking-[0.12em]">{readableDate}</p>
        <p className="mt-3 font-display text-xl text-[#b8894b]">{invitation.venue}</p>
      </div>
    </motion.div>
  );
}

function MarbleSurface() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,.65),transparent_25%),radial-gradient(circle_at_75%_85%,rgba(92,72,54,.18),transparent_36%),linear-gradient(135deg,#e1d8cb,#cdbfaf_48%,#eee5d7)]" />
      <div className="absolute inset-0 opacity-[.22] [background-image:radial-gradient(circle_at_30%_20%,#7d715f_1px,transparent_1px),linear-gradient(120deg,transparent_0_46%,rgba(120,103,82,.38)_47%,transparent_49%)] [background-size:18px_18px,220px_180px]" />
    </>
  );
}

function WoodSurface() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#7b451f,#bc7d3f_34%,#d69a55_58%,#8b522b)]" />
      <div className="absolute inset-0 opacity-[.28] [background-image:linear-gradient(105deg,rgba(255,255,255,.28)_0_9%,transparent_9%_18%,rgba(68,31,12,.24)_18%_20%,transparent_20%_100%),repeating-linear-gradient(8deg,rgba(48,22,8,.28)_0_2px,transparent_2px_18px)] [background-size:380px_100%,100%_100%]" />
    </>
  );
}

function WindowLight({ warm = false }: { warm?: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-75"
      style={{
        background: warm
          ? "linear-gradient(108deg, transparent 0 18%, rgba(255,232,177,.34) 18% 30%, transparent 30% 55%, rgba(255,232,177,.24) 55% 66%, transparent 66%)"
          : "linear-gradient(108deg, rgba(255,255,255,.28) 0 12%, transparent 12% 45%, rgba(255,255,255,.2) 45% 54%, transparent 54% 100%)"
      }}
    />
  );
}

function GlassKeepsakeBox() {
  return (
    <div className="pointer-events-none absolute right-[-8%] top-[-5%] h-[560px] w-[460px] rotate-[18deg] opacity-90">
      <div className="absolute inset-0 border-[6px] border-[#9b6d31]/75 bg-white/10 shadow-[inset_0_0_35px_rgba(255,255,255,.22),0_22px_70px_rgba(88,61,27,.25)] backdrop-blur-[2px]" />
      <div className="absolute inset-8 border border-white/35" />
      <div className="absolute left-1/2 top-0 h-full w-[8px] -translate-x-1/2 bg-[#9b6d31]/80 shadow-[0_0_18px_rgba(0,0,0,.24)]" />
      <div className="absolute right-8 top-0 h-full w-[5px] bg-[#6f4b22]/80" />
    </div>
  );
}

function BurgundyPaperTexture() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,.12),transparent_32%),linear-gradient(90deg,rgba(255,255,255,.05),transparent_22%,rgba(0,0,0,.12)_88%)]" />
      <div className="absolute inset-0 opacity-[.18] [background-image:radial-gradient(circle_at_8px_8px,rgba(255,255,255,.22)_1px,transparent_1px),radial-gradient(circle_at_17px_16px,rgba(0,0,0,.28)_1px,transparent_1px)] [background-size:28px_28px]" />
      <svg className="absolute inset-0 h-full w-full opacity-[.14]" viewBox="0 0 620 410" aria-hidden="true">
        <defs>
          <pattern id="burgundy-emboss" width="96" height="96" patternUnits="userSpaceOnUse">
            <path d="M18 76 C44 36 56 34 78 16" fill="none" stroke="#ffd797" strokeWidth="1.1" />
            <path d="M34 54 q22 -22 44 -2 q-26 11 -44 2Z" fill="none" stroke="#ffd797" strokeWidth="1" />
            <path d="M16 78 q18 -18 34 0 q-18 9 -34 0Z" fill="none" stroke="#ffd797" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="620" height="410" fill="url(#burgundy-emboss)" />
      </svg>
      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/18 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/24 to-transparent" />
    </>
  );
}

function ScrollRoll({ className }: { className: string }) {
  return (
    <div className={`absolute z-20 w-72 -rotate-[8deg] rounded-full bg-[#851634] shadow-[inset_24px_0_36px_rgba(255,255,255,.08),inset_-28px_0_40px_rgba(0,0,0,.32),0_28px_58px_rgba(50,8,18,.34)] ${className}`}>
      <div className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,.14),transparent_20%,rgba(0,0,0,.22)_54%,transparent_76%,rgba(255,255,255,.08))]" />
      <div className="absolute inset-y-4 left-9 w-px bg-white/12" />
      <div className="absolute inset-y-8 left-20 w-px bg-black/18" />
      <div className="absolute inset-y-6 right-12 w-px bg-white/10" />
      <div className="absolute inset-y-6 left-[132px] w-px bg-black/20" />
      <div className="absolute inset-y-8 left-[180px] w-px bg-white/10" />
      <div className="absolute inset-0 rounded-full opacity-[.14] [background-image:radial-gradient(circle_at_12px_12px,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:26px_26px]" />
    </div>
  );
}

function DryFlorals({ isOpen }: { isOpen: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 260 310"
      variants={{
        closed: { x: 158, y: 32, rotate: -14, opacity: 0.9 },
        open: { x: 0, y: 12, rotate: -11, opacity: 1 }
      }}
      transition={{ duration: 1.7, ease: [0.2, 0.82, 0.18, 1] }}
      animate={isOpen ? "open" : "closed"}
      className="absolute left-[78px] top-[230px] z-40 h-[250px] w-[220px] overflow-visible"
      aria-hidden="true"
    >
      <g fill="none" stroke="#9b7842" strokeLinecap="round" strokeWidth="1.4">
        {Array.from({ length: 12 }).map((_, index) => (
          <path key={index} d={`M132 286 C${90 + index * 7} ${222 - index * 9}, ${48 + index * 13} ${144 - index * 6}, ${42 + index * 16} ${55 + index * 5}`} />
        ))}
      </g>
      <g fill="#efe6cd" stroke="#9b7842" strokeWidth=".45">
        {Array.from({ length: 24 }).map((_, index) => (
          <circle key={index} cx={38 + (index % 8) * 24} cy={48 + Math.floor(index / 8) * 31} r={4 + (index % 3)} opacity=".88" />
        ))}
      </g>
      <g fill="#d6b978">
        {Array.from({ length: 12 }).map((_, index) => (
          <circle key={`seed-${index}`} cx={58 + (index % 6) * 30} cy={82 + Math.floor(index / 6) * 44} r="2.5" opacity=".9" />
        ))}
      </g>
    </motion.svg>
  );
}

function CordAndWaxSeal({ isOpen, initials }: { isOpen: boolean; initials: string }) {
  return (
    <motion.div
      animate={isOpen ? "open" : "closed"}
      className="absolute left-[202px] top-[318px] z-50 h-36 w-56 -rotate-[8deg]"
      variants={{
        closed: { x: 330, y: -64, scale: 0.94 },
        open: { x: 0, y: 0, scale: 1 }
      }}
      transition={{ duration: 1.7, ease: [0.2, 0.82, 0.18, 1] }}
    >
      <div className="absolute left-0 top-14 h-3 w-56 rounded-full bg-[linear-gradient(90deg,transparent,#c89b46_20%,#7c5524_55%,#e5bd71_80%,transparent)] shadow-[0_5px_12px_rgba(0,0,0,.28)]" />
      <div className="absolute left-3 top-[74px] h-2 w-28 rotate-[26deg] rounded-full bg-[#c89b46] shadow-md" />
      <div className="absolute right-8 top-[76px] h-2 w-28 -rotate-[22deg] rounded-full bg-[#c89b46] shadow-md" />
      <WaxHalf isOpen={isOpen} initials={initials} side="left" />
      <WaxHalf isOpen={isOpen} initials={initials} side="right" />
    </motion.div>
  );
}

function WaxHalf({ isOpen, initials, side }: { isOpen: boolean; initials: string; side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <motion.div
      animate={isOpen ? "open" : "closed"}
      variants={{
        closed: { x: isLeft ? 0 : -34, rotate: 0 },
        open: { x: isLeft ? -18 : 18, y: isLeft ? 12 : -2, rotate: isLeft ? -14 : 11 }
      }}
      transition={{ duration: 1.25, delay: 0.25, ease: [0.2, 0.82, 0.18, 1] }}
      className={`absolute top-4 h-24 w-14 overflow-hidden shadow-[0_18px_34px_rgba(0,0,0,.32)] ${isLeft ? "left-[57px] rounded-l-full" : "left-[111px] rounded-r-full"}`}
      style={{ background: "radial-gradient(circle at 34% 24%,#f0bf72,#b9823c 42%,#6b371d 78%)" }}
    >
      <span className={`absolute top-1/2 -translate-y-1/2 font-display text-3xl text-[#4b2615] ${isLeft ? "left-9" : "-left-5"}`}>{initials}</span>
      <span className={`absolute inset-y-3 w-20 rounded-full border border-[#4b2615]/20 ${isLeft ? "left-3" : "-left-9"}`} />
      <span className={`absolute inset-y-0 w-4 bg-black/12 ${isLeft ? "right-0" : "left-0"}`} />
    </motion.div>
  );
}

function LaserCutPanel({ side }: { side: "left" | "right" }) {
  const flipped = side === "right";
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#111d36] shadow-[inset_0_0_28px_rgba(255,255,255,.05),0_22px_55px_rgba(4,8,20,.32)]">
      <div className={`absolute inset-y-0 z-20 w-5 bg-[linear-gradient(90deg,rgba(0,0,0,.34),rgba(255,255,255,.06),rgba(0,0,0,.18))] ${side === "left" ? "left-0" : "right-0"}`} />
      <div className={`absolute inset-y-0 z-10 w-16 bg-gradient-to-r from-black/35 to-transparent ${side === "left" ? "right-0" : "left-0 rotate-180"}`} />
      <div className="absolute inset-0 opacity-[.16] [background-image:linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px),radial-gradient(circle_at_12px_12px,rgba(255,255,255,.32)_1px,transparent_1px)] [background-size:22px_22px]" />
      <svg className={`absolute inset-0 h-full w-full ${flipped ? "-scale-x-100" : ""}`} viewBox="0 0 300 460" aria-hidden="true">
        <rect width="300" height="460" fill="transparent" />
        <g fill="#071023" opacity=".78">
          {Array.from({ length: 13 }).map((_, index) => (
            <path
              key={index}
              d={`M${110 + (index % 2) * 18} ${34 + index * 31} C${52 + (index % 3) * 10} ${66 + index * 28}, ${46 + (index % 2) * 18} ${98 + index * 30}, ${94 + (index % 2) * 24} ${122 + index * 28} C${112 + (index % 2) * 18} ${86 + index * 28}, ${158 + (index % 2) * 6} ${72 + index * 29}, ${194 + (index % 2) * 16} ${56 + index * 30} C${178 + (index % 2) * 6} ${108 + index * 28}, ${142 + (index % 2) * 12} ${112 + index * 28}, ${110 + (index % 2) * 18} ${34 + index * 31}Z`}
            />
          ))}
        </g>
        <g fill="none" stroke="#2a395b" strokeLinecap="round" strokeWidth="6" opacity=".95">
          <path d="M150 18 C120 96 166 148 126 224 C94 286 118 372 78 440" />
          <path d="M150 18 C178 82 150 142 196 210 C236 270 198 350 238 440" />
          {Array.from({ length: 10 }).map((_, index) => (
            <path key={index} d={`M${128 + (index % 2) * 42} ${54 + index * 37} q${index % 2 ? 48 : -58} ${24 + index * 2} ${index % 2 ? 86 : -96} ${62 + index * 2}`} />
          ))}
        </g>
      </svg>
      <div className="absolute inset-5 border border-[#2c3b5f]/75" />
      <div className="absolute inset-y-0 right-0 w-4 bg-black/20" />
    </div>
  );
}

function LaurelCrest({ initials }: { initials: string }) {
  return (
    <div className="relative grid h-24 w-28 place-items-center">
      <svg viewBox="0 0 140 110" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <g fill="none" stroke="#d8af61" strokeWidth="2" strokeLinecap="round">
          <path d="M48 92 C18 68 18 32 52 13" />
          <path d="M92 92 C122 68 122 32 88 13" />
          {Array.from({ length: 8 }).map((_, index) => (
            <path key={index} d={`M${45 - index * 2} ${82 - index * 8} q-18 -4 -24 -18 q16 2 24 18Z`} />
          ))}
          {Array.from({ length: 8 }).map((_, index) => (
            <path key={`r-${index}`} d={`M${95 + index * 2} ${82 - index * 8} q18 -4 24 -18 q-16 2 -24 18Z`} />
          ))}
        </g>
      </svg>
      <span className="font-display text-4xl text-[#f0cf84]">{initials}</span>
    </div>
  );
}

function SmallOrnament() {
  return (
    <svg viewBox="0 0 180 54" className="mt-5 h-10 w-40" aria-hidden="true">
      <g fill="none" stroke="#d8af61" strokeLinecap="round" strokeWidth="2">
        <path d="M24 28 C58 4 118 4 156 28" />
        {Array.from({ length: 8 }).map((_, index) => (
          <path key={index} d={`M${42 + index * 13} ${23 + (index % 2) * 5} q10 -13 21 0 q-11 6 -21 0Z`} />
        ))}
      </g>
    </svg>
  );
}

function ObjectShadow({ className }: { className: string }) {
  return <div className={`absolute rounded-full bg-black/35 blur-3xl ${className}`} />;
}

function RsvpChoice({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 font-bold transition"
      style={{
        color: active ? "#120d08" : "rgba(247,239,226,.72)",
        background: active ? "#c89b46" : "rgba(255,255,255,.04)",
        borderColor: active ? "#c89b46" : "rgba(255,255,255,.12)"
      }}
    >
      {icon}
      {label}
    </button>
  );
}
