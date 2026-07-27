"use client";

import { Heart, Sparkles } from "lucide-react";
import styles from "./romance.module.css";

const particles = [
  { kind: "heart", left: "6%", delay: "-2s", duration: "17s", size: "0.8rem" },
  { kind: "petal", left: "14%", delay: "-10s", duration: "21s", size: "0.65rem" },
  { kind: "star", left: "22%", delay: "-5s", duration: "15s", size: "0.7rem" },
  { kind: "petal", left: "31%", delay: "-15s", duration: "24s", size: "0.8rem" },
  { kind: "heart", left: "41%", delay: "-7s", duration: "20s", size: "0.65rem" },
  { kind: "star", left: "51%", delay: "-12s", duration: "18s", size: "0.75rem" },
  { kind: "petal", left: "61%", delay: "-4s", duration: "23s", size: "0.7rem" },
  { kind: "heart", left: "70%", delay: "-16s", duration: "22s", size: "0.72rem" },
  { kind: "petal", left: "79%", delay: "-8s", duration: "19s", size: "0.62rem" },
  { kind: "star", left: "87%", delay: "-14s", duration: "25s", size: "0.74rem" },
  { kind: "petal", left: "94%", delay: "-3s", duration: "18s", size: "0.58rem" }
] as const;

export function RomanceAtmosphere() {
  return (
    <div className={styles.atmosphere} aria-hidden="true">
      {particles.map((particle, index) => (
        <span
          key={`${particle.kind}-${particle.left}`}
          className={`${styles.particle} ${styles[particle.kind]}`}
          style={{
            "--particle-left": particle.left,
            "--particle-delay": particle.delay,
            "--particle-duration": particle.duration,
            "--particle-size": particle.size
          } as React.CSSProperties}
        >
          {particle.kind === "heart" ? (
            <Heart className={styles.particleIcon} />
          ) : particle.kind === "star" ? (
            <Sparkles className={styles.particleIcon} />
          ) : (
            <span className={styles.petalShape} data-petal={index % 2 === 0 ? "rose" : "peach"} />
          )}
        </span>
      ))}
    </div>
  );
}
