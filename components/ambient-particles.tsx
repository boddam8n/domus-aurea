"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  x: `${(index * 29) % 100}%`,
  delay: (index % 9) * 0.45,
  duration: 15 + (index % 7)
}));

export function AmbientParticles() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute top-[-10vh] h-1 w-1 rounded-full bg-gold/40 shadow-[0_0_14px_rgba(200,155,70,.45)]"
          style={{ left: particle.x }}
          animate={{ y: ["0vh", "115vh"], opacity: [0, 0.38, 0], scale: [0.8, 1, 0.8] }}
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
