"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, Heart, Languages } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import styles from "./romance.module.css";

export function RomanceHero() {
  const { isArabic, toggleLanguage } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <section className={styles.hero}>
      <Image
        src="/romance/hero-world.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.heroImage}
      />
      <div className={styles.heroWash} />

      <header className={styles.romanceHeader}>
        <Link href="/" className={styles.brandLink} aria-label="Domus Aurea home">
          <span className={styles.brandMark}>DA</span>
          <span>
            <strong>Domus Aurea</strong>
            <small>Romance</small>
          </span>
        </Link>
        <button type="button" onClick={toggleLanguage} className={styles.languageButton}>
          <Languages />
          <span>{isArabic ? "EN" : "عربي"}</span>
        </button>
      </header>

      <motion.div
        className={`${styles.heroCopy} ${isArabic ? styles.rtlCopy : styles.ltrCopy}`}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
      >
        <span className={styles.heroEyebrow}>
          <Heart />
          {isArabic ? "عالم جديد من دوموس أوريا" : "A new world by Domus Aurea"}
        </span>
        <h1>
          {isArabic ? (
            <>
              كل حكاية جميلة
              <em> تبدأ بدعوة بسيطة.</em>
            </>
          ) : (
            <>
              Every beautiful story
              <em> begins with a simple invitation.</em>
            </>
          )}
        </h1>
        <p>
          {isArabic
            ? "دعوات وتجارب رومانسية دافئة، مصممة لتجعل اللحظات الصغيرة تبدو ساحرة وشخصية ولا تُنسى."
            : "Warm romantic invitations and tiny experiences, made to turn a simple moment into something personal and unforgettable."}
        </p>
        <div className={styles.heroActions}>
          <Link href="#romance-types" className={styles.primaryButton}>
            {isArabic ? "أنشئ دعوة رومانسية" : "Create Romantic Invitation"}
            <Arrow />
          </Link>
          <Link href="#romance-templates" className={styles.secondaryButton}>
            {isArabic ? "تصفح القوالب الرومانسية" : "Browse Romantic Templates"}
          </Link>
        </div>
      </motion.div>

      <a href="#romance-types" className={styles.scrollCue} aria-label={isArabic ? "اكتشف عالم الرومانسية" : "Explore Romance"}>
        <span>{isArabic ? "اكتشف العالم" : "Discover the world"}</span>
        <ArrowDown />
      </a>
    </section>
  );
}
