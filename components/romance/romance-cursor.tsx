"use client";

import { useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import styles from "./romance.module.css";

export function RomanceCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const canUsePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!cursor || !canUsePointer || prefersReducedMotion) return;

    let frameId = 0;
    let x = -80;
    let y = -80;

    const updateCursor = (event: PointerEvent) => {
      x = event.clientX - 14;
      y = event.clientY - 14;
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };

    window.addEventListener("pointermove", updateCursor, { passive: true });
    return () => {
      window.removeEventListener("pointermove", updateCursor);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={cursorRef} className={styles.cursor} aria-hidden="true">
      <Heart />
    </div>
  );
}
