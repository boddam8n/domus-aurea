"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  x: `${(index * 29) % 100}%`,
  delay: (index % 9) * 0.9,
  duration: 22 + (index % 9),
  size: index % 4 === 0 ? "h-1.5 w-1.5" : "h-1 w-1",
  crystal: index % 3 === 0
}));

export function AmbientParticles() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className={`absolute top-[-10vh] ${particle.id > 5 ? "hidden md:block" : ""} ${particle.size} ${particle.crystal ? "rotate-45 rounded-[2px] bg-white/35 shadow-[0_0_16px_rgba(255,255,255,.35)]" : "rounded-full bg-gold/35 shadow-[0_0_14px_rgba(200,155,70,.35)]"}`}
          style={{ left: particle.x }}
          animate={{ y: ["0vh", "115vh"], x: ["0vw", particle.crystal ? "2vw" : "-1vw", "0vw"], opacity: [0, 0.28, 0], scale: [0.8, 1, 0.8] }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
