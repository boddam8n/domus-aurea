"use client";

import Image from "next/image";
import { Check, Heart } from "lucide-react";
import type { RomanceTemplate } from "@/lib/romance";
import styles from "./romance-journey.module.css";

type RomanceTemplateChoiceCardProps = {
  item: RomanceTemplate;
  isArabic: boolean;
  isFavorite: boolean;
  isSelected: boolean;
  onFavorite: (id: string) => void;
  onSelect: (id: string) => void;
};

export function RomanceTemplateChoiceCard({
  item,
  isArabic,
  isFavorite,
  isSelected,
  onFavorite,
  onSelect
}: RomanceTemplateChoiceCardProps) {
  return (
    <article
      className={`${styles.templateCard} ${styles[`accent-${item.accent}`]}`}
      data-selected={isSelected}
    >
      <button
        type="button"
        className={styles.templateSelectArea}
        onClick={() => onSelect(item.id)}
        aria-label={isArabic ? `اختيار قالب ${item.name.ar}` : `Select ${item.name.en} template`}
        aria-pressed={isSelected}
      >
        <span className={styles.templateArtwork}>
          <Image
            src={item.image}
            alt={isArabic ? `معاينة قالب ${item.name.ar}` : `${item.name.en} template preview`}
            fill
            sizes="(max-width: 620px) 50vw, (max-width: 1050px) 33vw, 25vw"
            className={styles.coverImage}
          />
          {isSelected ? (
            <span className={styles.selectedMark}>
              <Check aria-hidden="true" />
            </span>
          ) : null}
        </span>
        <span className={styles.templateCopy}>
          <strong>{isArabic ? item.name.ar : item.name.en}</strong>
          <small>{isArabic ? item.description.ar : item.description.en}</small>
          <span>{isArabic ? "اختيار القالب" : "Select template"}</span>
        </span>
      </button>

      <button
        type="button"
        className={styles.favoriteButton}
        data-active={isFavorite}
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
        <Heart aria-hidden="true" />
      </button>
    </article>
  );
}
