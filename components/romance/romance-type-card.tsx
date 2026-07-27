"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { RomanceType } from "@/lib/romance";
import styles from "./romance.module.css";

type RomanceTypeCardProps = {
  item: RomanceType;
  isArabic: boolean;
};

export function RomanceTypeCard({ item, isArabic }: RomanceTypeCardProps) {
  return (
    <motion.article
      className={`${styles.typeCard} ${styles[`accent-${item.accent}`]} ${item.featured ? styles.featuredType : ""}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.typeArtwork}>
        <Image
          src={item.image}
          alt=""
          fill
          sizes={item.featured ? "(max-width: 760px) 100vw, 50vw" : "(max-width: 760px) 100vw, 25vw"}
          className={styles.coverImage}
        />
      </div>
      <div className={styles.typeCopy}>
        <span className={styles.comingSoon}>
          <Sparkles />
          {isArabic ? "قريبًا" : "Coming soon"}
        </span>
        <h3>{isArabic ? item.title.ar : item.title.en}</h3>
        <p>{isArabic ? item.description.ar : item.description.en}</p>
      </div>
    </motion.article>
  );
}
