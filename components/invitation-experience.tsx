"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCoupleInitials, InvitationTemplateRenderer, resolveTemplate } from "@/components/invitation-template-renderer";
import type { PublicInvitation } from "@/lib/invitations";

export function InvitationExperience({ invitation }: { invitation: PublicInvitation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [response, setResponse] = useState<"accepted" | "declined">("accepted");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const template = resolveTemplate(invitation.template_name);
  const couple = `${invitation.bride_name} و ${invitation.groom_name}`;
  const initials = getCoupleInitials(invitation.bride_name, invitation.groom_name);

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
    <section className="relative min-h-screen overflow-hidden px-4 pb-28 pt-28 md:px-8" style={{ background: template.palette.bg }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(255,255,255,.18),transparent_28%),radial-gradient(circle_at_86%_12%,rgba(208,162,74,.16),transparent_32%)]" />
      {!isOpen ? (
        <div className="relative z-10 grid min-h-[calc(100vh-8rem)] place-items-center">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative h-[min(72vh,430px)] w-full max-w-[620px] overflow-hidden rounded-[1.4rem] border shadow-[0_40px_120px_rgba(0,0,0,.35)] transition duration-500 hover:-translate-y-1"
            style={{ borderColor: template.palette.accent, background: template.palette.card }}
            aria-label="Open wedding invitation"
          >
            <span className="absolute inset-0 bg-[linear-gradient(135deg,transparent_49%,rgba(255,255,255,.16)_50%,transparent_51%),linear-gradient(225deg,transparent_49%,rgba(0,0,0,.16)_50%,transparent_51%)]" />
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 origin-top"
              style={{ background: `linear-gradient(to bottom, ${template.palette.soft}, ${template.palette.card})`, clipPath: "polygon(0 0, 100% 0, 50% 78%)" }}
              animate={{ rotateX: isOpen ? 64 : 0 }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="absolute left-1/2 top-[54%] grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-[inset_0_8px_14px_rgba(255,255,255,.2),inset_0_-14px_24px_rgba(0,0,0,.28),0_18px_42px_rgba(0,0,0,.28)]" style={{ background: `radial-gradient(circle at 32% 25%, ${template.palette.accent}, ${template.palette.card} 62%, #1c1208)` }}>
              <span className="font-display text-3xl" style={{ color: template.palette.ink }}>{initials}</span>
            </span>
            <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm font-bold uppercase tracking-[0.24em]" style={{ color: template.palette.ink }}>
              افتح الدعوة
            </span>
          </button>
        </div>
      ) : (
        <InvitationTemplateRenderer
          invitation={invitation}
          initials={initials}
          couple={couple}
          rsvp={{ guestName, response, loading, status, error, setGuestName, setResponse, submit: submitRsvp }}
        />
      )}
    </section>
  );
}
