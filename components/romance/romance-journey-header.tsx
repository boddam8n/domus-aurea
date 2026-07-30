"use client";

import Link from "next/link";
import { ArrowLeft, Languages } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import styles from "./romance-journey.module.css";

type RomanceJourneyHeaderProps = {
  backHref: string;
  backLabel: { ar: string; en: string };
};

export function RomanceJourneyHeader({ backHref, backLabel }: RomanceJourneyHeaderProps) {
  const { isArabic, toggleLanguage } = useLanguage();

  return (
    <header className={styles.header}>
      <Link href="/romance" className={styles.brand} aria-label="Domus Aurea Romance">
        <span className={styles.brandMark}>DA</span>
        <span>
          <strong>Domus Aurea</strong>
          <small>Romance</small>
        </span>
      </Link>

      <nav className={styles.headerActions} aria-label={isArabic ? "تنقل رحلة الرومانسية" : "Romance journey navigation"}>
        <Link href={backHref} className={styles.backLink}>
          <ArrowLeft aria-hidden="true" />
          <span>{isArabic ? backLabel.ar : backLabel.en}</span>
        </Link>
        <button type="button" className={styles.languageButton} onClick={toggleLanguage}>
          <Languages aria-hidden="true" />
          <span>{isArabic ? "EN" : "عربي"}</span>
        </button>
      </nav>
    </header>
  );
}
