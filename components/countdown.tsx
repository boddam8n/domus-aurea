"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function getTime(target: string) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const minute = 60 * 1000;
  return {
    days: Math.floor(diff / day),
    hours: Math.floor((diff % day) / hour),
    minutes: Math.floor((diff % hour) / minute),
    seconds: Math.floor((diff % minute) / 1000)
  };
}

export function Countdown({ target }: { target: string }) {
  const [time, setTime] = useState(() => getTime(target));

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getTime(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {Object.entries(time).map(([label, value]) => (
        <motion.div
          key={label}
          whileHover={{ y: -6, scale: 1.02 }}
          className="relative overflow-hidden rounded-3xl bg-[url('/assets/countdown-frame-soft.webp')] bg-cover bg-center p-5 text-center"
        >
          <div className="absolute inset-5 rounded-full bg-pearl/45 blur-xl" />
          <strong className="gold-text relative block font-display text-4xl md:text-5xl">
            {String(value).padStart(2, "0")}
          </strong>
          <span className="relative text-xs uppercase tracking-[0.24em] text-night/55">{label}</span>
        </motion.div>
      ))}
    </div>
  );
}
