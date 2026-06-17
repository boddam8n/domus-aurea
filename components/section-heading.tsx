"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/components/motion-presets";

export function SectionHeading({
  eyebrow,
  title,
  body
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.8 }}
      className="mx-auto max-w-3xl text-center"
    >
      <p className="mb-4 text-sm font-bold uppercase tracking-[0.34em] text-gold">{eyebrow}</p>
      <h2 className="font-display text-4xl leading-tight text-[var(--color-text)] md:text-6xl">{title}</h2>
      <p className="mt-5 text-lg leading-8 text-[var(--color-muted)]">{body}</p>
    </motion.div>
  );
}
