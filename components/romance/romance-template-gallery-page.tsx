"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart, LockKeyhole } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { getFutureRomanceEditorPath, romanceTemplates } from "@/lib/romance";
import { RomanceJourneyHeader } from "./romance-journey-header";
import { RomanceTemplateChoiceCard } from "./romance-template-choice-card";
import styles from "./romance-journey.module.css";

export function RomanceTemplateGalleryPage() {
  const { isArabic } = useLanguage();
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const Arrow = isArabic ? ArrowLeft : ArrowRight;
  const selectedTemplate = romanceTemplates.find((item) => item.id === selectedId);
  const futureEditorHref = selectedTemplate ? getFutureRomanceEditorPath(selectedTemplate.id) : undefined;

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
      <RomanceJourneyHeader
        backHref="/romance"
        backLabel={{ ar: "العودة", en: "Back" }}
      />

      <section className={styles.galleryHero}>
        <span className={styles.eyebrow}>
          <Heart aria-hidden="true" />
          {isArabic ? "قوالب رومانسية" : "Romantic templates"}
        </span>
        <h1>{isArabic ? "اختر التصميم الأقرب إلى إحساسك." : "Choose the design that feels most like you."}</h1>
        <p>
          {isArabic
            ? "مجموعة هادئة من القوالب المصممة للرسائل والدعوات واللحظات التي تستحق اهتمامًا خاصًا."
            : "A considered collection for invitations, messages, and moments that deserve a personal touch."}
        </p>
      </section>

      <section className={styles.templateSection} aria-label={isArabic ? "اختيار القالب" : "Choose a template"}>
        <div className={styles.templateGrid}>
          {romanceTemplates.map((item) => (
            <RomanceTemplateChoiceCard
              key={item.id}
              item={item}
              isArabic={isArabic}
              isFavorite={favorites.has(item.id)}
              isSelected={selectedId === item.id}
              onFavorite={toggleFavorite}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      </section>

      {isMounted && selectedTemplate
        ? createPortal(
            <aside className={styles.selectionBar} aria-live="polite">
              <div>
                <small>{isArabic ? "القالب المختار" : "Selected template"}</small>
                <strong>{isArabic ? selectedTemplate.name.ar : selectedTemplate.name.en}</strong>
              </div>
              <button type="button" disabled data-future-href={futureEditorHref}>
                <LockKeyhole aria-hidden="true" />
                {isArabic ? "المحرر قريبًا" : "Editor coming soon"}
                <Arrow aria-hidden="true" />
              </button>
            </aside>,
            document.body
          )
        : null}

      <footer className={styles.footer}>
        <Link href="/romance">{isArabic ? "العودة إلى عالم الرومانسية" : "Back to Romance"}</Link>
      </footer>
    </main>
  );
}
