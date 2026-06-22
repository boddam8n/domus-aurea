"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Check, MapPin, Send, Sparkles, X } from "lucide-react";
import { Countdown } from "@/components/countdown";
import type { PublicInvitation } from "@/lib/invitations";

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

export function InvitationExperience({ invitation }: { invitation: PublicInvitation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [response, setResponse] = useState<"accepted" | "declined">("accepted");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const initials = getCoupleInitials(invitation.bride_name, invitation.groom_name);
  const couple = `${invitation.bride_name} و ${invitation.groom_name}`;
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

  return (
    <section className="relative min-h-screen overflow-x-hidden bg-[#090806] px-4 pb-20 pt-24 text-[#f7efe2] md:px-8 md:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(200,155,70,.18),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(6,47,39,.52),transparent_34%),linear-gradient(145deg,#090806_0%,#17110b_48%,#041e18_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,rgba(255,238,192,.12),transparent)]" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div className="rounded-[2rem] border border-white/10 bg-black/20 p-3 shadow-[0_40px_140px_rgba(0,0,0,.42)] backdrop-blur-xl md:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4 px-2">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.26em] text-[#c89b46]">
                <Sparkles className="h-4 w-4" />
                Domus Aurea Invitation
              </p>
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

          <div className="relative grid min-h-[620px] place-items-center overflow-hidden rounded-[1.7rem] border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(255,247,226,.18),transparent_30%),linear-gradient(135deg,#1a130d,#0f0b08_55%,#041b16)] p-4 sm:min-h-[680px] md:p-8">
            <div className="pointer-events-none absolute left-1/2 top-[78%] h-24 w-[min(74vw,680px)] -translate-x-1/2 rounded-full bg-black/45 blur-3xl" />

            <div className="relative h-[min(72vh,650px)] w-full max-w-[560px] [perspective:1600px]">
              <motion.div
                initial={false}
                animate={isOpen ? "open" : "closed"}
                className="absolute inset-x-0 bottom-0 mx-auto h-[78%] w-full max-w-[520px]"
              >
                <motion.div
                  variants={{
                    closed: { y: "18%", scale: 0.92, opacity: 0.18 },
                    open: { y: "-10%", scale: 1, opacity: 1 }
                  }}
                  transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-[4%] top-[2%] z-20 min-h-[92%] rounded-[1.1rem] bg-[#f7ead3] p-6 text-center text-[#2b1d12] shadow-[0_28px_80px_rgba(0,0,0,.38),inset_0_0_0_1px_rgba(151,103,42,.25)] md:p-8"
                >
                  <div className="absolute inset-4 rounded-[.9rem] border border-[#b8894b]/35" />
                  <div className="absolute inset-7 rounded-[.7rem] border border-[#b8894b]/20" />
                  <div className="relative z-10 flex min-h-[calc(100%-1rem)] flex-col items-center justify-center py-8">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#9b7330]">Domus Aurea</p>
                    <p className="mt-6 font-display text-6xl leading-none text-[#9b7330] md:text-7xl">{initials}</p>
                    <h2 className="mt-7 font-display text-5xl leading-tight md:text-6xl">
                      {invitation.bride_name}
                      <span className="block py-2 text-2xl text-[#9b7330]">&</span>
                      {invitation.groom_name}
                    </h2>
                    <p className="mt-6 max-w-md text-base leading-8 text-[#5a4432]">{invitationText}</p>
                    <div className="my-7 h-px w-32 bg-[#b8894b]" />
                    <div className="grid gap-3 text-sm leading-7 text-[#5a4432]">
                      <span className="inline-flex items-center justify-center gap-2">
                        <CalendarDays className="h-4 w-4 text-[#9b7330]" />
                        {readableDate}
                      </span>
                      <span className="inline-flex items-center justify-center gap-2">
                        <MapPin className="h-4 w-4 text-[#9b7330]" />
                        {invitation.venue}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <div className="absolute inset-x-0 bottom-0 z-30 h-[58%] rounded-b-[1.5rem] bg-[linear-gradient(155deg,#24170f,#4d3524_52%,#1a100b)] shadow-[0_34px_95px_rgba(0,0,0,.46)]" />
                <div className="absolute inset-x-0 bottom-0 z-40 h-[58%] rounded-b-[1.5rem] bg-[linear-gradient(35deg,rgba(255,255,255,.08),transparent_38%),linear-gradient(325deg,rgba(255,255,255,.1),transparent_42%)] [clip-path:polygon(0_0,50%_48%,100%_0,100%_100%,0_100%)]" />
                <motion.div
                  variants={{
                    closed: { rotateX: 0, y: 0 },
                    open: { rotateX: -168, y: -7 }
                  }}
                  transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-0 top-[11%] z-50 h-[48%] origin-bottom rounded-t-[1.5rem] bg-[linear-gradient(180deg,#5a3a25,#24170f)] shadow-[0_18px_70px_rgba(0,0,0,.38)] [clip-path:polygon(0_0,100%_0,50%_100%)]"
                />
                <motion.div
                  variants={{
                    closed: { scale: 1, opacity: 1, y: 0 },
                    open: { scale: 0.75, opacity: 0, y: 24 }
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="absolute left-1/2 top-[48%] z-[60] grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_32%_25%,#e0a954,#9f1f25_44%,#4a0d12_82%)] text-3xl font-black text-[#f8dca2] shadow-[inset_0_8px_14px_rgba(255,255,255,.18),inset_0_-14px_24px_rgba(0,0,0,.36),0_18px_42px_rgba(0,0,0,.34)]"
                >
                  <span className="font-display">{initials}</span>
                  <span className="absolute inset-3 rounded-full border border-[#f4d08b]/35" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        <aside className="grid gap-5 lg:sticky lg:top-28">
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
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
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

function RsvpChoice({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode }) {
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
