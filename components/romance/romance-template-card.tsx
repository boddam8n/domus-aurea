"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { RomanceTemplate } from "@/lib/romance";
import styles from "./romance.module.css";

type RomanceTemplateCardProps = {
  item: RomanceTemplate;
  isArabic: boolean;
  isFavorite: boolean;
  onFavorite: (id: string) => void;
};

export function RomanceTemplateCard({
  item,
  isArabic,
  isFavorite,
  onFavorite
}: RomanceTemplateCardProps) {
  return (
    <motion.article
      className={`${styles.templateCard} ${styles[`accent-${item.accent}`]}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.templateArtwork}>
        <Image
          src={item.image}
          alt={isArabic ? `معاينة قالب ${item.name.ar}` : `${item.name.en} template preview`}
          fill
          sizes="(max-width: 560px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className={styles.coverImage}
        />
        <button
          type="button"
          className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ""}`}
          onClick={() => onFavorite(item.id)}
          aria-label={
            isFavorite
              ? isArabic
                ? `إزالة ${item.name.ar} من المفضلة`
                : `Remove ${item.name.en} from favorites`
              : isArabic
                ? `إضافة ${item.name.ar} إلى المفضلة`
                : `Add ${item.name.en} to favorites`
          }
          aria-pressed={isFavorite}
        >
          <Heart />
        </button>
        <span className={styles.previewLabel}>{isArabic ? "معاينة" : "Preview"}</span>
      </div>
      <div className={styles.templateCopy}>
        <h3>{isArabic ? item.name.ar : item.name.en}</h3>
        <p>{isArabic ? item.description.ar : item.description.en}</p>
      </div>
    </motion.article>
  );
}
