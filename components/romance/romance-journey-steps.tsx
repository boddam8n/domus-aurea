"use client";

import { Check, Heart, LayoutGrid, Palette } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import styles from "./romance-journey.module.css";

type RomanceJourneyStepsProps = {
  current: 1 | 2;
};

const steps = [
  { icon: Heart, ar: "المناسبة", en: "Occasion" },
  { icon: LayoutGrid, ar: "القالب", en: "Template" },
  { icon: Palette, ar: "التصميم", en: "Create" }
] as const;

export function RomanceJourneySteps({ current }: RomanceJourneyStepsProps) {
  const { isArabic } = useLanguage();

  return (
    <ol className={styles.steps} aria-label={isArabic ? "خطوات إنشاء التجربة" : "Creation steps"}>
      {steps.map((step, index) => {
        const number = index + 1;
        const Icon = number < current ? Check : step.icon;
        const state = number === current ? "current" : number < current ? "complete" : "future";

        return (
          <li key={step.en} className={styles.step} data-state={state}>
            <span className={styles.stepIcon}>
              <Icon aria-hidden="true" />
            </span>
            <span>{isArabic ? step.ar : step.en}</span>
          </li>
        );
      })}
    </ol>
  );
}
