"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { apologyAssets } from "@/lib/apology-assets";
import { SpriteEngine } from "./sprite-engine";
import { useAssetManager } from "./use-asset-manager";
import { useSoundManager } from "./sound-manager";
import styles from "./apology.module.css";

type ApologyLanguage = "ar" | "en";

type ApologyExperienceProps = {
  initialLanguage: ApologyLanguage;
  initialMessage?: string;
  senderName?: string;
};

const reversedCloudFrames = [...apologyAssets.clouds].reverse();
const reversedStarFrames = [...apologyAssets.stars].reverse();
const reversedLampFrames = [...apologyAssets.lamp].reverse();
const reversedFlowerFrames = [...apologyAssets.flowers].reverse();
const reversedBulbFrames = [...apologyAssets.bulb].reverse();
const reversedHeartFrames = [...apologyAssets.hearts].reverse();
const pressedButtonFrames = [apologyAssets.yesPressed] as const;
const zzzFrames = [apologyAssets.zzz] as const;

const copy = {
  ar: {
    eyebrow: "رسالة صغيرة من القلب",
    defaultMessage: "أنا آسف... لم أقصد أن أزعلك. هل يمكن أن نبدأ من جديد؟ 🤍",
    yes: "مسامحك",
    catHint: "القطة مش جاهزة تقول لأ",
    accepted: "شكرًا لقلبك الجميل... رجعنا أصحاب 🤍",
    back: "العودة إلى Domus Aurea",
    sound: "تشغيل الصوت",
    mute: "إيقاف الصوت",
    loading: "بنرتّب الكلام من القلب"
  },
  en: {
    eyebrow: "A tiny note from the heart",
    defaultMessage: "I am sorry. I never meant to hurt you. Can we start again? 🤍",
    yes: "I forgive you",
    catHint: "The cat is not ready to say no",
    accepted: "Thank you for your kind heart. We are okay again. 🤍",
    back: "Back to Domus Aurea",
    sound: "Enable sound",
    mute: "Mute sound",
    loading: "Gathering a few words from the heart"
  }
} as const;

function safeMessage(value: string | undefined, fallback: string) {
  const normalized = value?.trim().slice(0, 500);
  return normalized || fallback;
}

export function ApologyExperience({ initialLanguage, initialMessage, senderName }: ApologyExperienceProps) {
  const [language, setLanguage] = useState<ApologyLanguage>(initialLanguage);
  const [catMode, setCatMode] = useState<"idle" | "reaction">("idle");
  const [reaction, setReaction] = useState<"zzz" | "heart">("zzz");
  const [showSecondHeart, setShowSecondHeart] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const reactionTimerRef = useRef<number | null>(null);
  const catClickCountRef = useRef(0);
  const { progress, ready } = useAssetManager();
  const { enabled: soundEnabled, enable: enableSound, toggle: toggleSound, play: playSound } = useSoundManager();
  const currentCopy = copy[language];
  const message = useMemo(
    () => safeMessage(initialMessage, currentCopy.defaultMessage),
    [currentCopy.defaultMessage, initialMessage]
  );
  const shownMessage = accepted ? currentCopy.accepted : message;
  const messageClass = shownMessage.length > 220 ? styles.veryLongMessage : shownMessage.length > 110 ? styles.longMessage : "";

  useEffect(() => {
    return () => {
      if (reactionTimerRef.current) window.clearTimeout(reactionTimerRef.current);
    };
  }, []);

  const reactToCat = useCallback(() => {
    enableSound();
    playSound("purr");
    window.setTimeout(() => playSound("meow"), 260);
    catClickCountRef.current += 1;
    setCatMode("reaction");
    setReaction("heart");
    setShowSecondHeart(catClickCountRef.current % 3 === 0);
    if (reactionTimerRef.current) window.clearTimeout(reactionTimerRef.current);
    reactionTimerRef.current = window.setTimeout(() => {
      setCatMode("idle");
      setReaction("zzz");
      setShowSecondHeart(false);
    }, 1900);
  }, [enableSound, playSound]);

  const acceptApology = useCallback(() => {
    enableSound();
    playSound("click");
    setButtonPressed(true);
    window.setTimeout(() => {
      setAccepted(true);
      setButtonPressed(false);
    }, 180);
  }, [enableSound, playSound]);

  const finishCatReaction = useCallback(() => setCatMode("idle"), []);

  return (
    <main className={`${styles.page} ${ready ? styles.ready : ""}`} dir={language === "ar" ? "rtl" : "ltr"}>
      <div className={`${styles.preloader} ${ready ? styles.preloaderDone : ""}`} aria-live="polite">
        <SpriteEngine frames={apologyAssets.moon} frameDuration={500} className={styles.preloaderMoon} />
        <p>{currentCopy.loading}</p>
        <div className={styles.progressTrack}><span style={{ width: `${progress}%` }} /></div>
        <strong>{progress}%</strong>
      </div>

      <div className={styles.scene} aria-hidden={!ready}>
        <div className={styles.background} />
        <SpriteEngine frames={apologyAssets.clouds} frameDuration={1100} className={`${styles.sprite} ${styles.cloudLeft}`} />
        <SpriteEngine frames={reversedCloudFrames} frameDuration={1300} className={`${styles.sprite} ${styles.cloudRight}`} />
        <SpriteEngine frames={apologyAssets.moon} frameDuration={900} className={`${styles.sprite} ${styles.moon}`} />
        <SpriteEngine frames={apologyAssets.stars} frameDuration={650} className={`${styles.sprite} ${styles.starOne}`} />
        <SpriteEngine frames={reversedStarFrames} frameDuration={840} className={`${styles.sprite} ${styles.starTwo}`} />
        <SpriteEngine frames={apologyAssets.lamp} frameDuration={760} className={`${styles.sprite} ${styles.lampLeft}`} />
        <SpriteEngine frames={reversedLampFrames} frameDuration={920} className={`${styles.sprite} ${styles.lampRight}`} />
        <SpriteEngine frames={apologyAssets.flowers} frameDuration={900} className={`${styles.sprite} ${styles.flowersLeft}`} />
        <SpriteEngine frames={reversedFlowerFrames} frameDuration={980} className={`${styles.sprite} ${styles.flowersRight}`} />

        <header className={styles.toolbar}>
          <Link href="/" className={styles.brand} aria-label={`DA - ${currentCopy.back}`}>DA</Link>
          <div className={styles.toolbarActions}>
            <button type="button" onClick={() => setLanguage((value) => (value === "ar" ? "en" : "ar"))} className={styles.smallButton}>
              {language === "ar" ? "EN" : "عربي"}
            </button>
            <button type="button" onClick={toggleSound} className={styles.iconButton} aria-label={soundEnabled ? currentCopy.mute : currentCopy.sound}>
              {soundEnabled ? <Volume2 /> : <VolumeX />}
            </button>
          </div>
        </header>

        <section className={styles.content} aria-label={language === "ar" ? "تجربة اعتذار" : "Apology experience"}>
          <div className={styles.signWrap}>
            <div className={styles.sign} style={{ backgroundImage: `url(${apologyAssets.sign})` }}>
              <p className={styles.eyebrow}>{currentCopy.eyebrow}</p>
              <p className={`${styles.message} ${messageClass}`}>{shownMessage}</p>
              {senderName ? <p className={styles.sender}>— {senderName}</p> : null}
            </div>
          </div>

          <div className={styles.choices}>
            <button type="button" onClick={acceptApology} className={styles.yesButton} disabled={accepted}>
              <SpriteEngine
                frames={buttonPressed ? pressedButtonFrames : apologyAssets.yesButton}
                frameDuration={560}
                className={styles.yesButtonSprite}
              />
              <span>{accepted ? "✓" : currentCopy.yes}</span>
            </button>

            <div className={styles.catChoice}>
              <button type="button" onClick={reactToCat} className={styles.catButton} aria-label={currentCopy.catHint}>
                <SpriteEngine
                  frames={catMode === "reaction" ? apologyAssets.catReaction : apologyAssets.catIdle}
                  frameDuration={catMode === "reaction" ? 250 : 430}
                  loop={catMode === "idle"}
                  onComplete={finishCatReaction}
                  className={styles.catSprite}
                />
              </button>
              <div className={`${styles.reaction} ${reaction === "heart" ? styles.reactionHeart : ""}`}>
                <SpriteEngine
                  frames={reaction === "heart" ? apologyAssets.hearts : zzzFrames}
                  frameDuration={280}
                  className={styles.reactionSprite}
                />
              </div>
              {showSecondHeart ? (
                <div className={`${styles.reaction} ${styles.secondReaction}`} aria-hidden="true">
                  <SpriteEngine frames={reversedHeartFrames} frameDuration={320} className={styles.reactionSprite} />
                </div>
              ) : null}
              <p>{currentCopy.catHint}</p>
            </div>
          </div>
        </section>

        <SpriteEngine frames={apologyAssets.bulb} frameDuration={720} className={`${styles.sprite} ${styles.bulbOne}`} />
        <SpriteEngine frames={reversedBulbFrames} frameDuration={810} className={`${styles.sprite} ${styles.bulbTwo}`} />
      </div>
    </main>
  );
}
