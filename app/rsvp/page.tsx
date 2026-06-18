"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, PartyPopper } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export default function RsvpPage() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <PageShell>
      <section className="grid min-h-screen place-items-center px-4 py-32 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass w-full max-w-3xl rounded-[2.5rem] p-8 md:p-12"
        >
          <p className="text-sm font-bold uppercase tracking-[0.34em] text-gold">تأكيد الحضور</p>
          <h1 className="mt-5 font-display text-5xl text-pearl md:text-7xl">أكّد حضورك بأناقة.</h1>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-pearl outline-none" placeholder="اسم الضيف" />
            <input className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-pearl outline-none" placeholder="عدد المقاعد" />
            <select className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-pearl outline-none md:col-span-2">
              <option>سأحضر</option>
              <option>ربما أحضر</option>
              <option>أعتذر عن الحضور</option>
            </select>
            <textarea
              className="min-h-32 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-pearl outline-none md:col-span-2"
              placeholder="اترك رسالة قصيرة للعروسين"
            />
          </div>
          <button
            onClick={() => setConfirmed(true)}
            className="mt-6 w-full rounded-full bg-pearl px-7 py-4 font-bold text-night transition hover:bg-gold"
          >
            تأكيد الرد
          </button>
          {confirmed ? (
            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 rounded-3xl bg-emerald/40 p-5 text-pearl">
              <CheckCircle2 className="ml-2 inline h-5 w-5 text-gold" />
              تم حفظ الرد. نتمنى لكم ليلة مليئة بالفرح.
              <PartyPopper className="mr-2 inline h-5 w-5 text-gold" />
            </motion.div>
          ) : null}
        </motion.div>
      </section>
    </PageShell>
  );
}
