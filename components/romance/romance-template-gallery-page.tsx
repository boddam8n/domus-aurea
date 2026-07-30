"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, LockKeyhole, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import {
  getFutureRomanceEditorPath,
  getRomanceTemplatesForOccasion,
  type RomanceType
} from "@/lib/romance";
import { RomanceAtmosphere } from "./romance-atmosphere";
import { RomanceCursor } from "./romance-cursor";
import { RomanceJourneyHeader } from "./romance-journey-header";
import { RomanceJourneySteps } from "./romance-journey-steps";
import { RomanceTemplateChoiceCard } from "./romance-template-choice-card";
import styles from "./romance-journey.module.css";

type RomanceTemplateGalleryPageProps = {
  occasion: RomanceType;
};

export function RomanceTemplateGalleryPage({ occasion }: RomanceTemplateGalleryPageProps) {
  const { isArabic } = useLanguage();
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const templates = useMemo(() => getRomanceTemplatesForOccasion(occasion.id), [occasion.id]);
  const Arrow = isArabic ? ArrowLeft : ArrowRight;
  const selectedTemplate = templates.find((item) => item.id === selectedId);
  const futureEditorHref = selectedTemplate
    ? getFutureRomanceEditorPath(occasion.id, selectedTemplate.id)
    : undefined;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main className={styles.page}>
      <RomanceAtmosphere />
      <RomanceCursor />
      <RomanceJourneyHeader
        backHref="/romance/create"
        backLabel={{ ar: "اختيار المناسبة", en: "Choose occasion" }}
      />

      <section className={styles.galleryHero}>
        <RomanceJourneySteps current={2} />
        <motion.div
          className={styles.galleryIntro}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.88, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.occasionPill}>
            <Heart aria-hidden="true" />
            {isArabic ? occasion.title.ar : occasion.title.en}
          </span>
          <h1>{isArabic ? "اختر الشكل الذي يشبه حكايتك." : "Choose the look that feels like your story."}</h1>
          <p>
            {isArabic
              ? "كل قالب هو بداية قابلة للتخصيص. اختر الآن، وسنفتح المحرر في المرحلة القادمة."
              : "Each template is a customizable beginning. Choose one now; the editor arrives in the next phase."}
          </p>
        </motion.div>
      </section>

      <section className={styles.templateSection} aria-label={isArabic ? "اختيار القالب" : "Choose a template"}>
        <div className={styles.templateGrid}>
          {templates.map((item, index) => (
            <RomanceTemplateChoiceCard
              key={item.id}
              item={item}
              isArabic={isArabic}
              isFavorite={favorites.has(item.id)}
              isSelected={selectedId === item.id}
              index={index}
              onFavorite={toggleFavorite}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      </section>

      {isMounted
        ? createPortal(
            <AnimatePresence>
              {selectedTemplate ? (
                <motion.aside
                  className={styles.selectionBar}
                  initial={{ opacity: 0, y: 28, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 18 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  aria-live="polite"
                >
                  <span className={styles.selectionSparkle}>
                    <Sparkles aria-hidden="true" />
                  </span>
                  <div>
                    <small>{isArabic ? "تم اختيار القالب" : "Template selected"}</small>
                    <strong>{isArabic ? selectedTemplate.name.ar : selectedTemplate.name.en}</strong>
                  </div>
                  <button type="button" disabled data-future-href={futureEditorHref}>
                    <LockKeyhole aria-hidden="true" />
                    {isArabic ? "المحرر قريبًا" : "Editor coming soon"}
                    <Arrow aria-hidden="true" />
                  </button>
                </motion.aside>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}

      <footer className={styles.journeyFooter}>
        <Link href="/romance/create">{isArabic ? "تغيير المناسبة" : "Change occasion"}</Link>
        <Heart aria-hidden="true" />
        <Link href="/romance">{isArabic ? "عالم الرومانسية" : "Romance world"}</Link>
      </footer>
    </main>
  );
}
