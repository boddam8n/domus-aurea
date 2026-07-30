"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CakeSlice,
  Clapperboard,
  Coffee,
  Flower2,
  Gem,
  Gift,
  Heart,
  HeartHandshake,
  Mail,
  PartyPopper,
  Sunset
} from "lucide-react";
import type { RomanceType } from "@/lib/romance";
import { getRomanceTemplateGalleryPath } from "@/lib/romance";
import styles from "./romance-journey.module.css";

const icons = {
  heart: Heart,
  coffee: Coffee,
  movie: Clapperboard,
  sunset: Sunset,
  letter: Mail,
  cake: CakeSlice,
  gift: Gift,
  anniversary: Flower2,
  proposal: Gem,
  apology: HeartHandshake,
  surprise: PartyPopper
} satisfies Record<RomanceType["icon"], typeof Heart>;

type RomanceOccasionCardProps = {
  item: RomanceType;
  isArabic: boolean;
  index: number;
};

export function RomanceOccasionCard({ item, isArabic, index }: RomanceOccasionCardProps) {
  const Icon = icons[item.icon];

  return (
    <motion.article
      className={`${styles.occasionCard} ${styles[`accent-${item.accent}`]}`}
      initial={{ opacity: 0, y: 26, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.72, delay: Math.min(index * 0.045, 0.32), ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={getRomanceTemplateGalleryPath(item.id)} className={styles.occasionLink}>
        <div className={styles.occasionArtwork}>
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(max-width: 620px) 100vw, (max-width: 1050px) 50vw, 33vw"
            className={styles.coverImage}
          />
          <span className={styles.cardSparkle} aria-hidden="true">✦</span>
          <span className={styles.occasionIcon}>
            <Icon aria-hidden="true" />
          </span>
        </div>
        <div className={styles.occasionCopy}>
          <h2>{isArabic ? item.title.ar : item.title.en}</h2>
          <p>{isArabic ? item.description.ar : item.description.en}</p>
          <span className={styles.chooseLabel}>
            {isArabic ? "اختر هذه المناسبة" : "Choose this occasion"}
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
