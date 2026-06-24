"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, MapPin, Send, X } from "lucide-react";
import { Countdown } from "@/components/countdown";
import { TestInvitationObject } from "@/components/test-invitation-object";
import type { PublicInvitation } from "@/lib/invitations";

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

  const couple = `${invitation.bride_name} و ${invitation.groom_name}`;
  const readableDate = useMemo(() => formatWeddingDate(invitation.wedding_date), [invitation.wedding_date]);
  const invitationText =
    invitation.invitation_text ||
    "بكل الحب والفرحة، نتشرف بدعوتكم لمشاركتنا بداية حكايتنا الجديدة في ليلة صممت لتبقى في الذاكرة.";

  useEffect(() => {
    if (invitation.id === "demo") return;
    fetch(`/api/invitations/${invitation.slug}/view`, { method: "POST" }).catch(() => undefined);
  }, [invitation.id, invitation.slug]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsOpen(true), 520);
    return () => window.clearTimeout(timer);
  }, []);

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
    <section dir="rtl" className="relative min-h-screen overflow-x-hidden bg-[#080705] px-4 pb-20 pt-20 text-[#f7efe2] md:px-8 md:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(218,179,103,.16),transparent_34%),radial-gradient(circle_at_88%_24%,rgba(6,47,39,.48),transparent_34%),linear-gradient(145deg,#080705_0%,#17110c_48%,#031d18_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[linear-gradient(to_bottom,rgba(255,238,192,.12),transparent)]" />

      <div className="relative z-10 mx-auto grid max-w-[1500px] gap-8 xl:grid-cols-[minmax(0,1fr)_390px] xl:items-start">
        <div className="rounded-[2rem] border border-white/10 bg-black/20 p-3 shadow-[0_44px_150px_rgba(0,0,0,.46)] backdrop-blur-xl md:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4 px-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#c89b46]">TEST / Domus Aurea</p>
              <h1 className="mt-3 font-display text-4xl leading-tight md:text-6xl">{couple}</h1>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#f7efe2]/66">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#c89b46]" />
                  {readableDate}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#c89b46]" />
                  {invitation.venue}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="rounded-full border border-[#c89b46]/45 bg-[#c89b46] px-6 py-3 text-sm font-bold text-[#120d08] shadow-[0_18px_48px_rgba(200,155,70,.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f0cf84]"
            >
              {isOpen ? "إغلاق الدعوة" : "فتح الدعوة"}
            </button>
          </div>

          <TestInvitationObject
            isOpen={isOpen}
            brideName={invitation.bride_name}
            groomName={invitation.groom_name}
            date={readableDate}
            venue={invitation.venue}
            message={invitationText}
            compact
          />
        </div>

        <aside className="grid gap-5 xl:sticky xl:top-28">
          <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.06] p-5 shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#c89b46]">العد التنازلي</p>
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
