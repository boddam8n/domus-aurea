"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { romanceTypes } from "@/lib/romance";
import { RomanceAtmosphere } from "./romance-atmosphere";
import { RomanceCursor } from "./romance-cursor";
import { RomanceJourneyHeader } from "./romance-journey-header";
import { RomanceJourneySteps } from "./romance-journey-steps";
import { RomanceOccasionCard } from "./romance-occasion-card";
import styles from "./romance-journey.module.css";

export function RomanceOccasionPage() {
  const { isArabic } = useLanguage();

  return (
    <main className={styles.page}>
      <RomanceAtmosphere />
      <RomanceCursor />
      <RomanceJourneyHeader
        backHref="/romance"
        backLabel={{ ar: "عالم الرومانسية", en: "Romance world" }}
      />

      <section className={styles.journeyHero}>
        <RomanceJourneySteps current={1} />
        <motion.div
          className={styles.journeyIntro}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.eyebrow}>
            <Heart aria-hidden="true" />
            {isArabic ? "لنبدأ من إحساس اللحظة" : "Begin with the feeling"}
          </span>
          <h1>{isArabic ? "ماذا تحب أن تصنع اليوم؟" : "What would you like to create today?"}</h1>
          <p>
            {isArabic
              ? "اختر المناسبة وسنساعدك على صنع تجربة مثالية، شخصية، ودافئة."
              : "Choose the occasion and we’ll help you create the perfect experience."}
          </p>
        </motion.div>
        <div className={styles.heroOrnament} aria-hidden="true">
          <span />
          <Sparkles />
          <span />
        </div>
      </section>

      <section className={styles.occasionSection} aria-label={isArabic ? "المناسبات الرومانسية" : "Romantic occasions"}>
        <div className={styles.occasionGrid}>
          {romanceTypes.map((item, index) => (
            <RomanceOccasionCard key={item.id} item={item} isArabic={isArabic} index={index} />
          ))}
        </div>
      </section>

      <footer className={styles.journeyFooter}>
        <span>Domus Aurea</span>
        <Heart aria-hidden="true" />
        <span>Romance</span>
      </footer>
    </main>
  );
}
