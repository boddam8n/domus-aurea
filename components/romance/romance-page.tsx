"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, Mail, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { romanceTemplates, romanceTypes } from "@/lib/romance";
import { RomanceAtmosphere } from "./romance-atmosphere";
import { RomanceCursor } from "./romance-cursor";
import { RomanceHero } from "./romance-hero";
import { RomanceTemplateCard } from "./romance-template-card";
import { RomanceTypeCard } from "./romance-type-card";
import styles from "./romance.module.css";

export function RomancePage() {
  const { isArabic } = useLanguage();
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

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
      <RomanceHero />

      <section id="romance-types" className={styles.typesSection}>
        <motion.div
          className={styles.sectionHeading}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>
            <Sparkles />
            {isArabic ? "اختر إحساس اللحظة" : "Choose the feeling"}
          </span>
          <h2>{isArabic ? "ليست كل الدعوات متشابهة." : "Not every invitation should feel the same."}</h2>
          <p>
            {isArabic
              ? "استكشف أفكارًا دافئة وخفيفة صُممت لمواعيد ورسائل ومفاجآت مختلفة. هذه التجارب قيد الإعداد."
              : "Explore warm, playful directions for dates, messages, and surprises. These experiences are currently being prepared."}
          </p>
        </motion.div>

        <div className={styles.typesGrid}>
          {romanceTypes.map((item) => (
            <RomanceTypeCard key={item.id} item={item} isArabic={isArabic} />
          ))}
        </div>
      </section>

      <div className={styles.letterTransition} aria-hidden="true">
        <span />
        <Mail />
        <span />
      </div>

      <section id="romance-templates" className={styles.templatesSection}>
        <motion.div
          className={styles.galleryHeading}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className={styles.galleryEyebrow}>
              <Heart />
              {isArabic ? "مجموعة القوالب الأولى" : "The first template collection"}
            </span>
            <h2>{isArabic ? "قوالب تحفظ شعور اللحظة." : "Templates that keep the feeling."}</h2>
          </div>
          <p>
            {isArabic
              ? "عشر اتجاهات بصرية مبدئية، من الرسائل الهادئة إلى الليالي الحالمة. أضف ما يعجبك إلى المفضلة."
              : "Ten early visual directions, from quiet letters to dreamlike nights. Save the ones that feel like you."}
          </p>
        </motion.div>

        <div className={styles.templatesGrid}>
          {romanceTemplates.map((item) => (
            <RomanceTemplateCard
              key={item.id}
              item={item}
              isArabic={isArabic}
              isFavorite={favorites.has(item.id)}
              onFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>

      <section className={styles.closingSection}>
        <motion.div
          className={styles.closingCopy}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.closingIcon}>
            <Heart />
          </span>
          <p>{isArabic ? "Romance من Domus Aurea" : "Romance by Domus Aurea"}</p>
          <h2>{isArabic ? "الأشياء الصغيرة تستحق تصميمًا جميلًا." : "Little moments deserve beautiful design."}</h2>
          <div className={styles.closingActions}>
            <a href="#romance-types" className={styles.primaryButton}>
              {isArabic ? "ابدأ من الإحساس" : "Start with a feeling"}
              <Arrow />
            </a>
            <Link href="/" className={styles.secondaryButton}>
              {isArabic ? "العودة إلى دوموس أوريا" : "Back to Domus Aurea"}
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
