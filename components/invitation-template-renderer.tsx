"use client";

import { FormEvent } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Calendar, Check, MapPin, QrCode, Send, X } from "lucide-react";
import { Countdown } from "@/components/countdown";
import type { PublicInvitation } from "@/lib/invitations";

type TemplateKey =
  | "mirror-acrylic"
  | "burgundy-scroll"
  | "ocean-floral-arch"
  | "royal-scroll"
  | "message-bottle"
  | "navy-laser-gate"
  | "emerald-velvet"
  | "vintage-letterpress"
  | "noir-gold-pocket";

type TemplateDefinition = {
  key: TemplateKey;
  names: string[];
  label: string;
  palette: {
    bg: string;
    card: string;
    ink: string;
    muted: string;
    accent: string;
    soft: string;
  };
};

type RsvpState = {
  guestName: string;
  response: "accepted" | "declined";
  loading: boolean;
  status: string;
  error: string;
  setGuestName: (value: string) => void;
  setResponse: (value: "accepted" | "declined") => void;
  submit: (event: FormEvent<HTMLFormElement>) => void;
};

type TemplateProps = {
  invitation: PublicInvitation;
  initials: string;
  couple: string;
  rsvp: RsvpState;
};

export const templateDefinitions: TemplateDefinition[] = [
  {
    key: "mirror-acrylic",
    names: ["Mirror Acrylic", "Tamil Mirror Acrylic", "Acrylic Floral", "Royal Gold"],
    label: "Mirror Acrylic Floral",
    palette: { bg: "#e7e3dc", card: "rgba(168,154,118,.42)", ink: "#fffaf0", muted: "rgba(255,250,240,.76)", accent: "#d6bd72", soft: "rgba(255,255,255,.22)" }
  },
  {
    key: "burgundy-scroll",
    names: ["Burgundy Scroll", "Wax Scroll"],
    label: "Burgundy Wax Scroll",
    palette: { bg: "#32101b", card: "#7c1830", ink: "#fff3df", muted: "rgba(255,243,223,.72)", accent: "#c59b60", soft: "rgba(255,228,196,.12)" }
  },
  {
    key: "ocean-floral-arch",
    names: ["Ocean Floral Arch", "Floral Gold"],
    label: "Ocean Floral Arch",
    palette: { bg: "#d7ddd8", card: "rgba(255,255,255,.78)", ink: "#1d2a24", muted: "rgba(29,42,36,.64)", accent: "#c4a66a", soft: "rgba(255,255,255,.52)" }
  },
  {
    key: "royal-scroll",
    names: ["Royal Scroll", "Vintage Scroll"],
    label: "Royal Parchment Scroll",
    palette: { bg: "#c7b3a6", card: "#9c7770", ink: "#43291e", muted: "rgba(67,41,30,.66)", accent: "#b99555", soft: "rgba(255,242,225,.34)" }
  },
  {
    key: "message-bottle",
    names: ["Message Bottle", "Seaside Bottle"],
    label: "Message In A Bottle",
    palette: { bg: "#d8d4c8", card: "rgba(232,224,204,.62)", ink: "#3a3328", muted: "rgba(58,51,40,.62)", accent: "#a87d46", soft: "rgba(255,255,255,.44)" }
  },
  {
    key: "navy-laser-gate",
    names: ["Navy Laser Gate", "Laser Cut Navy", "Modern Luxury"],
    label: "Navy Laser Gate",
    palette: { bg: "#071020", card: "#0d1730", ink: "#f7efe2", muted: "rgba(247,239,226,.68)", accent: "#d0a85f", soft: "rgba(255,255,255,.08)" }
  },
  {
    key: "emerald-velvet",
    names: ["Emerald Velvet", "Emerald Palace", "Emerald Garden"],
    label: "Emerald Velvet Acrylic",
    palette: { bg: "#031d16", card: "#063c2a", ink: "#f6edcf", muted: "rgba(246,237,207,.68)", accent: "#d8bd74", soft: "rgba(255,255,255,.08)" }
  },
  {
    key: "vintage-letterpress",
    names: ["Vintage Letterpress", "Classic Arabic", "Minimal Elegant"],
    label: "Vintage Letterpress Floral",
    palette: { bg: "#e8dec8", card: "#f5eddc", ink: "#4b3829", muted: "rgba(75,56,41,.64)", accent: "#9d845b", soft: "rgba(81,104,64,.16)" }
  },
  {
    key: "noir-gold-pocket",
    names: ["Noir Gold Pocket", "Black Gold Pocket", "Golden Night", "White & Gold", "Luxury Wedding Hall"],
    label: "Noir Gold Pocket",
    palette: { bg: "#070707", card: "#111111", ink: "#f5eee0", muted: "rgba(245,238,224,.64)", accent: "#d0a24a", soft: "rgba(255,255,255,.07)" }
  }
];

export function resolveTemplate(templateName: string) {
  return templateDefinitions.find((template) => template.names.some((name) => name.toLowerCase() === templateName.toLowerCase())) ?? templateDefinitions[0];
}

export function getCoupleInitials(brideName: string, groomName: string) {
  const first = brideName.trim().charAt(0);
  const second = groomName.trim().charAt(0);
  return `${first}${second}`.toUpperCase() || "DA";
}

export function InvitationTemplateRenderer({ invitation, initials, couple, rsvp }: TemplateProps) {
  const template = resolveTemplate(invitation.template_name);
  const props = { invitation, initials, couple, rsvp, template };

  switch (template.key) {
    case "burgundy-scroll":
      return <BurgundyScrollTemplate {...props} />;
    case "ocean-floral-arch":
      return <OceanFloralArchTemplate {...props} />;
    case "royal-scroll":
      return <RoyalScrollTemplate {...props} />;
    case "message-bottle":
      return <MessageBottleTemplate {...props} />;
    case "navy-laser-gate":
      return <NavyLaserGateTemplate {...props} />;
    case "emerald-velvet":
      return <EmeraldVelvetTemplate {...props} />;
    case "vintage-letterpress":
      return <VintageLetterpressTemplate {...props} />;
    case "noir-gold-pocket":
      return <NoirGoldPocketTemplate {...props} />;
    default:
      return <MirrorAcrylicTemplate {...props} />;
  }
}

function TemplateFrame({ children, template }: { children: ReactNode; template: TemplateDefinition }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.55, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 mx-auto min-h-[calc(100vh-8rem)] w-full max-w-7xl rounded-[2.25rem] p-4 md:p-8"
      style={{ color: template.palette.ink }}
    >
      {children}
    </motion.div>
  );
}

function Details({ invitation, template, light = false }: { invitation: PublicInvitation; template: TemplateDefinition; light?: boolean }) {
  const itemClass = `flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${light ? "border-black/10 bg-white/50" : "border-white/12 bg-white/[0.06]"}`;
  return (
    <div className="grid gap-3">
      {[
        { icon: Calendar, label: invitation.wedding_date },
        { icon: MapPin, label: invitation.venue },
        { icon: QrCode, label: "رابط دعوة شخصي" }
      ].map((item) => (
        <div key={item.label} className={itemClass} style={{ color: template.palette.muted }}>
          <item.icon className="h-4 w-4 shrink-0" style={{ color: template.palette.accent }} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function RsvpPanel({ rsvp, template, title = "تأكيد الحضور", light = false }: { rsvp: RsvpState; template: TemplateDefinition; title?: string; light?: boolean }) {
  return (
    <form onSubmit={rsvp.submit} className={`rounded-[1.75rem] border p-5 ${light ? "border-black/10 bg-white/55" : "border-white/12 bg-white/[0.07]"}`}>
      <p className="text-sm font-bold uppercase tracking-[0.14em]" style={{ color: template.palette.accent }}>{title}</p>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-bold" style={{ color: template.palette.muted }}>اسم الضيف</span>
        <input
          value={rsvp.guestName}
          onChange={(event) => rsvp.setGuestName(event.target.value)}
          className={`w-full rounded-2xl border px-5 py-4 outline-none transition focus:border-current ${light ? "border-black/10 bg-white/70 text-[#2b2119]" : "border-white/12 bg-black/20 text-white"}`}
          required
        />
      </label>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <RsvpChoice active={rsvp.response === "accepted"} onClick={() => rsvp.setResponse("accepted")} icon={<Check className="ml-2 inline h-4 w-4" />} label="قبول الدعوة" template={template} light={light} />
        <RsvpChoice active={rsvp.response === "declined"} onClick={() => rsvp.setResponse("declined")} icon={<X className="ml-2 inline h-4 w-4" />} label="اعتذار" template={template} light={light} />
      </div>
      {rsvp.error ? <p className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-100">{rsvp.error}</p> : null}
      {rsvp.status ? <p className="mt-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-3 text-sm text-emerald-100">{rsvp.status}</p> : null}
      <button disabled={rsvp.loading} className="mt-5 w-full rounded-full px-7 py-4 font-bold transition disabled:opacity-60" style={{ background: template.palette.accent, color: template.key === "ocean-floral-arch" || light ? "#1f1710" : "#120d08" }}>
        <Send className="ml-2 inline h-4 w-4" />
        {rsvp.loading ? "جاري الحفظ..." : "إرسال الرد"}
      </button>
    </form>
  );
}

function RsvpChoice({ active, onClick, icon, label, template, light }: { active: boolean; onClick: () => void; icon: ReactNode; label: string; template: TemplateDefinition; light?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-4 font-bold transition ${light ? "border-black/10" : "border-white/12"}`}
      style={{
        color: active ? template.palette.accent : template.palette.muted,
        background: active ? template.palette.soft : "transparent",
        borderColor: active ? template.palette.accent : undefined
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function MonogramSeal({ initials, template, wax = false }: { initials: string; template: TemplateDefinition; wax?: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.82, rotate: -8, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ delay: 0.85, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full text-3xl font-black shadow-[0_18px_50px_rgba(0,0,0,.28)]"
      style={{
        color: wax ? "#5d1020" : template.palette.ink,
        background: wax
          ? "radial-gradient(circle at 32% 24%, #d6a260, #9b6032 42%, #5c2619 78%)"
          : `radial-gradient(circle at 30% 24%, ${template.palette.accent}, ${template.palette.card})`
      }}
    >
      <span className="relative z-10 font-display">{initials}</span>
      <span className="absolute inset-3 rounded-full border border-current opacity-30" />
    </motion.div>
  );
}

function FloralLine({ color = "currentColor" }: { color?: string }) {
  return (
    <svg viewBox="0 0 320 90" className="h-16 w-full opacity-55" aria-hidden="true">
      <path d="M12 62 C68 18 116 18 160 58 C204 20 252 18 308 62" fill="none" stroke={color} strokeWidth="1.2" />
      {Array.from({ length: 7 }).map((_, index) => (
        <circle key={index} cx={42 + index * 39} cy={38 + (index % 2) * 16} r={10} fill="none" stroke={color} strokeWidth="1" />
      ))}
      {Array.from({ length: 10 }).map((_, index) => (
        <path key={`leaf-${index}`} d={`M${28 + index * 28} ${62 - (index % 2) * 18} q12 -18 24 0 q-12 8 -24 0z`} fill="none" stroke={color} strokeWidth="1" />
      ))}
    </svg>
  );
}

function MirrorAcrylicTemplate({ invitation, initials, couple, rsvp, template }: TemplateProps & { template: TemplateDefinition }) {
  return (
    <TemplateFrame template={template}>
      <div className="absolute inset-0 rounded-[2.25rem] bg-[linear-gradient(135deg,#f4f2ed,#beb79d_42%,#f8f7f2)]" />
      <div className="absolute inset-0 rounded-[2.25rem] bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,.55)_44%,transparent_60%)] opacity-70" />
      <div className="relative grid gap-8 lg:grid-cols-[.82fr_1.18fr]">
        <motion.div initial={{ x: -28, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="rounded-[2rem] border border-white/50 bg-white/45 p-6 text-[#5b5140] shadow-2xl backdrop-blur-md">
          <FloralLine color="#7d7463" />
          <MonogramSeal initials={initials} template={template} />
          <h1 className="mt-8 font-display text-5xl text-[#6b5a36] md:text-7xl">{couple}</h1>
          <p className="mt-5 leading-8">يشرفنا حضوركم ومشاركتكم ليلة من العمر.</p>
        </motion.div>
        <div className="rounded-[2rem] border border-white/45 bg-[#5f5a43]/45 p-6 shadow-2xl backdrop-blur-xl">
          <Countdown target={invitation.wedding_date} />
          <div className="mt-6"><Details invitation={invitation} template={template} /></div>
          <div className="mt-6"><RsvpPanel rsvp={rsvp} template={template} title="RSVP على الأكريليك" /></div>
        </div>
      </div>
    </TemplateFrame>
  );
}

function BurgundyScrollTemplate({ invitation, initials, couple, rsvp, template }: TemplateProps & { template: TemplateDefinition }) {
  return (
    <TemplateFrame template={template}>
      <div className="absolute inset-0 rounded-[2.25rem]" style={{ background: "radial-gradient(circle at 20% 18%, #91506a, #32101b 48%, #16070b)" }} />
      <div className="relative grid gap-8 lg:grid-cols-[.86fr_1.14fr]">
        <motion.div initial={{ rotate: -4, y: 22, opacity: 0 }} animate={{ rotate: -2, y: 0, opacity: 1 }} className="relative min-h-[520px] rounded-[12rem] bg-[#7c1830] p-8 shadow-[0_40px_100px_rgba(0,0,0,.45)]">
          <div className="absolute inset-x-8 top-8 h-8 rounded-full bg-[#9c2b46] shadow-inner" />
          <div className="absolute inset-x-8 bottom-8 h-8 rounded-full bg-[#591225] shadow-inner" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><MonogramSeal initials={initials} template={template} wax /></div>
        </motion.div>
        <div className="rounded-[2rem] border border-[#d2a05f]/25 bg-[#1f0b11]/72 p-7">
          <p className="text-sm font-bold uppercase tracking-[0.22em]" style={{ color: template.palette.accent }}>sealed invitation</p>
          <h1 className="mt-5 font-display text-5xl md:text-7xl">{couple}</h1>
          <p className="mt-5 leading-8" style={{ color: template.palette.muted }}>دعوة مطوية بروح المخمل والختم الذهبي.</p>
          <div className="mt-8"><Details invitation={invitation} template={template} /></div>
          <div className="mt-6"><RsvpPanel rsvp={rsvp} template={template} /></div>
        </div>
      </div>
    </TemplateFrame>
  );
}

function OceanFloralArchTemplate({ invitation, initials, couple, rsvp, template }: TemplateProps & { template: TemplateDefinition }) {
  return (
    <TemplateFrame template={template}>
      <div className="absolute inset-0 rounded-[2.25rem] bg-[linear-gradient(to_bottom,#cbd4d5,#f5efe2_48%,#8a9b7b)]" />
      <div className="absolute inset-x-8 top-12 h-[44%] rounded-t-full border-[22px] border-white/70 shadow-[0_0_0_14px_rgba(255,255,255,.22)]" />
      <div className="absolute left-5 top-8 h-52 w-52 rounded-full border-[18px] border-white/70 blur-[1px]" />
      <div className="absolute right-5 top-12 h-44 w-44 rounded-full border-[18px] border-white/60 blur-[1px]" />
      <div className="relative grid min-h-[620px] items-end gap-8 lg:grid-cols-[1fr_.78fr]">
        <div className="rounded-[2rem] bg-white/70 p-7 text-[#1d2a24] shadow-2xl backdrop-blur">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#a88b52]">by the sea</p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">{couple}</h1>
          <p className="mt-4 leading-8">ممر ورد أبيض، ضوء بحر هادئ، واحتفال يبدأ عند الأفق.</p>
          <div className="mt-7"><Countdown target={invitation.wedding_date} /></div>
        </div>
        <div className="rounded-[2rem] bg-white/75 p-6 text-[#1d2a24] backdrop-blur">
          <MonogramSeal initials={initials} template={template} />
          <div className="mt-6"><Details invitation={invitation} template={template} light /></div>
          <div className="mt-6"><RsvpPanel rsvp={rsvp} template={template} light /></div>
        </div>
      </div>
    </TemplateFrame>
  );
}

function RoyalScrollTemplate({ invitation, initials, couple, rsvp, template }: TemplateProps & { template: TemplateDefinition }) {
  return (
    <TemplateFrame template={template}>
      <div className="absolute inset-0 rounded-[2.25rem] bg-[#d5c4bb]" />
      <div className="relative mx-auto max-w-5xl rounded-[2rem] bg-[#a9867d] px-6 py-14 text-center shadow-[0_36px_100px_rgba(67,41,30,.32)] md:px-12">
        <div className="absolute inset-x-4 top-4 h-6 rounded-full bg-gradient-to-r from-[#8c6d43] via-[#e0c178] to-[#8c6d43]" />
        <div className="absolute inset-x-4 bottom-4 h-6 rounded-full bg-gradient-to-r from-[#8c6d43] via-[#e0c178] to-[#8c6d43]" />
        <FloralLine color="#5a3a2a" />
        <MonogramSeal initials={initials} template={template} />
        <h1 className="mt-8 font-display text-5xl md:text-7xl">{couple}</h1>
        <p className="mx-auto mt-5 max-w-xl leading-8" style={{ color: template.palette.muted }}>دعوة بأسلوب المخطوطات الملكية، هادئة ومصقولة بتفاصيل ذهبية.</p>
        <div className="mx-auto mt-8 max-w-3xl"><Details invitation={invitation} template={template} light /></div>
        <div className="mx-auto mt-6 max-w-3xl"><RsvpPanel rsvp={rsvp} template={template} light /></div>
      </div>
    </TemplateFrame>
  );
}

function MessageBottleTemplate({ invitation, initials, couple, rsvp, template }: TemplateProps & { template: TemplateDefinition }) {
  return (
    <TemplateFrame template={template}>
      <div className="absolute inset-0 rounded-[2.25rem] bg-[radial-gradient(circle_at_50%_0%,#f7f2e6,#bdb7a9_55%,#7f776b)]" />
      <div className="relative grid items-center gap-8 lg:grid-cols-[.75fr_1.25fr]">
        <motion.div initial={{ rotate: -8, opacity: 0 }} animate={{ rotate: -3, opacity: 1 }} className="relative mx-auto h-[620px] w-60 rounded-[6rem] border border-white/70 bg-white/25 shadow-[inset_0_0_40px_rgba(255,255,255,.35),0_35px_90px_rgba(0,0,0,.25)] backdrop-blur">
          <div className="absolute left-1/2 top-10 h-[78%] w-16 -translate-x-1/2 rounded-full bg-[#9d7b4b]" />
          <div className="absolute bottom-8 left-8 right-8 h-16 rounded-[50%] bg-[#7b674f]/55" />
          <div className="absolute left-1/2 top-32 -translate-x-1/2 rotate-90 text-4xl font-display text-[#4f3923]">{initials}</div>
        </motion.div>
        <div className="rounded-[2rem] border border-white/30 bg-[#eee3c9]/70 p-7 text-[#3a3328] shadow-2xl backdrop-blur">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9b6e3c]">message in a bottle</p>
          <h1 className="mt-5 font-display text-5xl md:text-7xl">{couple}</h1>
          <p className="mt-5 leading-8">رسالة حب داخل زجاجة، برائحة البحر والرمل والذكريات الهادئة.</p>
          <div className="mt-8"><Details invitation={invitation} template={template} light /></div>
          <div className="mt-6"><RsvpPanel rsvp={rsvp} template={template} light /></div>
        </div>
      </div>
    </TemplateFrame>
  );
}

function NavyLaserGateTemplate({ invitation, initials, couple, rsvp, template }: TemplateProps & { template: TemplateDefinition }) {
  return (
    <TemplateFrame template={template}>
      <div className="absolute inset-0 rounded-[2.25rem] bg-[#071020]" />
      <div className="absolute inset-y-8 left-8 w-1/3 rounded-[2rem] bg-[repeating-linear-gradient(135deg,transparent_0_18px,rgba(255,255,255,.08)_18px_22px)]" />
      <div className="relative grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
        <div className="rounded-[2rem] bg-[#0d1730] p-7 shadow-2xl">
          <div className="grid min-h-[520px] place-items-center rounded-[1.5rem] border border-[#d0a85f]/35 bg-[linear-gradient(135deg,transparent_35%,rgba(255,255,255,.07)_35%_65%,transparent_65%)]">
            <MonogramSeal initials={initials} template={template} />
          </div>
        </div>
        <div className="rounded-[2rem] border border-[#d0a85f]/30 bg-white/[0.04] p-7">
          <p className="text-sm font-bold uppercase tracking-[0.24em]" style={{ color: template.palette.accent }}>laser cut gate</p>
          <h1 className="mt-5 font-display text-5xl md:text-7xl">{couple}</h1>
          <p className="mt-5 leading-8" style={{ color: template.palette.muted }}>بوابة كحلية محفورة، تكشف عن دعوة بيضاء بتفاصيل ذهبية.</p>
          <div className="mt-8"><Countdown target={invitation.wedding_date} /></div>
          <div className="mt-6"><Details invitation={invitation} template={template} /></div>
          <div className="mt-6"><RsvpPanel rsvp={rsvp} template={template} /></div>
        </div>
      </div>
    </TemplateFrame>
  );
}

function EmeraldVelvetTemplate({ invitation, initials, couple, rsvp, template }: TemplateProps & { template: TemplateDefinition }) {
  return (
    <TemplateFrame template={template}>
      <div className="absolute inset-0 rounded-[2.25rem] bg-[radial-gradient(circle_at_18%_12%,#0d5a3c,#031d16_55%,#010b08)]" />
      <div className="relative grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <div className="rounded-[2rem] border border-[#d8bd74]/25 bg-[#063c2a] p-7 shadow-2xl">
          <div className="rounded-[1.5rem] border border-[#d8bd74]/35 bg-white/10 p-8 backdrop-blur">
            <MonogramSeal initials={initials} template={template} />
            <h1 className="mt-8 font-display text-5xl md:text-7xl">{couple}</h1>
            <p className="mt-5 leading-8" style={{ color: template.palette.muted }}>مخمل زمردي وأكريليك شفاف بزوايا ذهبية هادئة.</p>
            <div className="mt-8"><Details invitation={invitation} template={template} /></div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-[#d8bd74]/25 bg-black/20 p-7">
          <Countdown target={invitation.wedding_date} />
          <div className="mt-6"><RsvpPanel rsvp={rsvp} template={template} /></div>
        </div>
      </div>
    </TemplateFrame>
  );
}

function VintageLetterpressTemplate({ invitation, initials, couple, rsvp, template }: TemplateProps & { template: TemplateDefinition }) {
  return (
    <TemplateFrame template={template}>
      <div className="absolute inset-0 rounded-[2.25rem] bg-[#e8dec8]" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_.82fr]">
        <div className="rounded-[2rem] border border-[#8f7a55]/35 bg-[#f5eddc] p-8 text-center shadow-[0_28px_80px_rgba(75,56,41,.18)]">
          <FloralLine color="#8f7a55" />
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.24em] text-[#9d845b]">{initials}</p>
          <h1 className="mt-7 font-display text-5xl md:text-7xl">{couple}</h1>
          <p className="mx-auto mt-5 max-w-lg leading-8" style={{ color: template.palette.muted }}>ورق letterpress عاجي، إطار نباتي مرسوم، وظلال ناعمة كأنها مطبوعة يدويًا.</p>
          <div className="mx-auto mt-8 max-w-2xl"><Details invitation={invitation} template={template} light /></div>
        </div>
        <div className="rounded-[2rem] bg-[#516840]/80 p-7 text-[#fff8e8] shadow-2xl">
          <MonogramSeal initials={initials} template={template} />
          <div className="mt-8"><Countdown target={invitation.wedding_date} /></div>
          <div className="mt-6"><RsvpPanel rsvp={rsvp} template={template} /></div>
        </div>
      </div>
    </TemplateFrame>
  );
}

function NoirGoldPocketTemplate({ invitation, initials, couple, rsvp, template }: TemplateProps & { template: TemplateDefinition }) {
  return (
    <TemplateFrame template={template}>
      <div className="absolute inset-0 rounded-[2.25rem] bg-[#070707]" />
      <div className="relative grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <motion.div initial={{ rotate: -5, opacity: 0 }} animate={{ rotate: -2, opacity: 1 }} className="rounded-[2rem] bg-[#111] p-7 shadow-[0_40px_110px_rgba(0,0,0,.55)]">
          <div className="grid min-h-[520px] place-items-center border border-[#d0a24a]/25 bg-[linear-gradient(140deg,#050505,#191919_48%,#050505)] p-7">
            <MonogramSeal initials={initials} template={template} />
          </div>
        </motion.div>
        <div className="rounded-[2rem] border border-[#d0a24a]/30 bg-white/[0.04] p-7">
          <p className="text-sm font-bold uppercase tracking-[0.24em]" style={{ color: template.palette.accent }}>black tie pocket</p>
          <h1 className="mt-5 font-display text-5xl md:text-7xl">{couple}</h1>
          <p className="mt-5 leading-8" style={{ color: template.palette.muted }}>أسود فاخر، خطوط ذهبية، وبطاقة RSVP مدمجة كجيب أنيق.</p>
          <div className="mt-8"><Details invitation={invitation} template={template} /></div>
          <div className="mt-6"><RsvpPanel rsvp={rsvp} template={template} /></div>
        </div>
      </div>
    </TemplateFrame>
  );
}
