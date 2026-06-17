"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Check, MapPin, QrCode, Send, X } from "lucide-react";
import { Countdown } from "@/components/countdown";
import { LuxuryAudioPlayer } from "@/components/luxury-audio-player";
import type { PublicInvitation } from "@/lib/invitations";

export function InvitationExperience({ invitation }: { invitation: PublicInvitation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [response, setResponse] = useState<"accepted" | "declined">("accepted");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      if (!result.ok) throw new Error(json.error || "��& �`ت�& حفظ ا�رد.");
      setStatus("ت�& تسج�`� ردْ ب� جاح. شْر�9ا ��&شارْتْ.");
      setGuestName("");
    } catch (rsvpError) {
      setError(rsvpError instanceof Error ? rsvpError.message : "حدث خطأ غ�`ر �&ت���ع.");
    } finally {
      setLoading(false);
    }
  }

  const couple = `${invitation.bride_name} �� ${invitation.groom_name}`;
  const musicSrc = invitation.music_file_name ? `/audio/${invitation.music_file_name}` : "/audio/wedding-music.mp3";

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-28 pt-28 md:px-8">
      <div className="absolute inset-0">
        <Image src="/assets/domus-hero.webp" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/46 to-night" />
      </div>

      {!isOpen ? (
        <div className="relative z-10 grid min-h-[calc(100vh-8rem)] place-items-center">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative h-[min(72vh,430px)] w-full max-w-[620px] rounded-[1.4rem] border border-gold/25 bg-[#ead9b7] shadow-[0_40px_120px_rgba(0,0,0,.35)] transition duration-500 hover:-translate-y-1"
            aria-label="Open wedding invitation"
          >
            <span className="absolute inset-0 rounded-[1.4rem] bg-[linear-gradient(135deg,transparent_49%,rgba(151,109,45,.22)_50%,transparent_51%),linear-gradient(225deg,transparent_49%,rgba(151,109,45,.18)_50%,transparent_51%)]" />
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-[1.4rem] bg-gradient-to-b from-[#fff0cf] to-[#d5b47a]"
              animate={{ rotateX: isOpen ? 64 : 0 }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 78%)" }}
            />
            <span className="absolute left-1/2 top-[54%] grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_32%_25%,#c53b36,#781016_56%,#350608)] shadow-[inset_0_8px_14px_rgba(255,210,190,.24),inset_0_-14px_24px_rgba(0,0,0,.42),0_18px_42px_rgba(67,4,8,.4)]">
              <span className="font-display text-3xl text-[#4c070b] opacity-60">DA</span>
            </span>
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[.92fr_1.08fr]"
        >
          <div className="paper-card relative overflow-hidden rounded-[2.5rem] p-8 text-center text-night md:p-12">
            <p className="gold-text text-sm font-extrabold tracking-[0.35em]">بْ� ا�حب ��ا�فرحة</p>
            <h1 className="mt-8 font-display text-6xl text-rose md:text-8xl">{couple}</h1>
            <p className="mx-auto mt-6 max-w-md text-lg leading-9 text-night/62">
              �`شرف� ا حض��رْ�& ���&شارْتْ�& ��`�ة �&�  ا�ع�&ر�R ح�`ث تبدأ حْا�`ة جد�`دة تحت ض��ء ا�ذ�!ب ��ا���رد.
            </p>
            <div className="mt-10">
              <Countdown target={invitation.wedding_date} />
            </div>
          </div>
          <div className="glass rounded-[2.5rem] p-7 md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.34em] text-gold">دع��ة خاصة</p>
            <h2 className="mt-5 font-display text-4xl text-pearl md:text-6xl">�`سعد� ا تأْ�`د حض��رْ�&.</h2>
            <div className="mt-8 grid gap-4">
              {[
                { icon: Calendar, label: invitation.wedding_date },
                { icon: MapPin, label: invitation.venue },
                { icon: QrCode, label: "رابط دع��ة شخص�` �اب� ���&شارْة" }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 rounded-2xl bg-white/[0.06] p-4 text-pearl/78">
                  <item.icon className="h-5 w-5 text-gold" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <form onSubmit={submitRsvp} className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-pearl/65">اس�& ا�ض�`ف</span>
                <input value={guestName} onChange={(event) => setGuestName(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-night/35 px-5 py-4 text-pearl outline-none transition focus:border-gold" required />
              </label>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => setResponse("accepted")} className={`rounded-2xl border px-4 py-4 font-bold transition ${response === "accepted" ? "border-gold bg-gold/15 text-gold" : "border-white/10 text-pearl/70"}`}>
                  <Check className="ml-2 inline h-4 w-4" />
                  �ب��� ا�دع��ة
                </button>
                <button type="button" onClick={() => setResponse("declined")} className={`rounded-2xl border px-4 py-4 font-bold transition ${response === "declined" ? "border-gold bg-gold/15 text-gold" : "border-white/10 text-pearl/70"}`}>
                  <X className="ml-2 inline h-4 w-4" />
                  اعتذار
                </button>
              </div>
              {error ? <p className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
              {status ? <p className="mt-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-3 text-sm text-emerald-100">{status}</p> : null}
              <button disabled={loading} className="mt-5 w-full rounded-full bg-pearl px-7 py-4 font-bold text-night transition hover:bg-gold disabled:opacity-60">
                <Send className="ml-2 inline h-4 w-4" />
                {loading ? "جار�` ا�حفظ..." : "إرسا� ا�رد"}
              </button>
            </form>
          </div>
        </motion.div>
      )}

      <LuxuryAudioPlayer src={musicSrc} shouldStart={isOpen} startDelayMs={2600} />
    </section>
  );
}
