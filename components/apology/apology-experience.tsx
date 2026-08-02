"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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
};

const reversedStarFrames = [...apologyAssets.stars].reverse();
const reversedLampFrames = [...apologyAssets.lamp].reverse();
const reversedFlowerFrames = [...apologyAssets.flowers].reverse();
const reversedBulbFrames = [...apologyAssets.bulb].reverse();
const reversedHeartFrames = [...apologyAssets.hearts].reverse();
const reversedBirdFrames = [...apologyAssets.birds].reverse();
const zzzFrames = [apologyAssets.zzz] as const;
const skyFrame = [apologyAssets.scene.sky] as const;
const cityFrame = [apologyAssets.scene.city] as const;
const groundFrame = [apologyAssets.scene.ground] as const;
const noSignFrame = [apologyAssets.choices.no] as const;

const copy = {
  ar: {
    no: "لا",
    yes: "ايوه",
    catCaption: "بلاش تصحي شيتوس",
    catAria: "شيتوس مش جاهز يقول لأ",
    back: "العودة إلى Domus Aurea",
    sound: "تشغيل الصوت",
    mute: "إيقاف الصوت",
    loading: "بنرتّب الكلام من القلب"
  },
  en: {
    no: "NO",
    yes: "YES",
    catCaption: "Please don't wake Cheetos",
    catAria: "Cheetos is not ready to say no",
    back: "Back to Domus Aurea",
    sound: "Enable sound",
    mute: "Mute sound",
    loading: "Gathering a few words from the heart"
  }
} as const;

function safeMessage(value: string | undefined) {
  return value?.trim().slice(0, 1200) || "";
}

export function ApologyExperience({ initialLanguage, initialMessage }: ApologyExperienceProps) {
  const [language, setLanguage] = useState<ApologyLanguage>(initialLanguage);
  const [catMode, setCatMode] = useState<"idle" | "reaction">("idle");
  const [reaction, setReaction] = useState<"zzz" | "heart">("zzz");
  const [showSecondHeart, setShowSecondHeart] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const reactionTimerRef = useRef<number | null>(null);
  const catClickCountRef = useRef(0);
  const { progress, ready } = useAssetManager();
  const { enabled: soundEnabled, enable: enableSound, toggle: toggleSound, play: playSound } = useSoundManager();
  const currentCopy = copy[language];
  const message = safeMessage(initialMessage);
  const messageLength = Array.from(message).length;
  const messageClass = messageLength > 600
    ? styles.ultraLongMessage
    : messageLength > 300
      ? styles.veryLongMessage
      : messageLength > 150
        ? styles.longMessage
        : "";
  const boardClass = messageLength > 600
    ? styles.ultraLongBoard
    : messageLength > 300
      ? styles.veryLongBoard
      : messageLength > 150
        ? styles.longBoard
        : "";

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
    setAccepted(true);
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
        <div className={styles.sceneLayers} aria-hidden="true">
          <SpriteEngine frames={skyFrame} loading="eager" className={styles.sceneSky} />
          <SpriteEngine frames={cityFrame} loading="eager" className={styles.sceneCity} />
          <SpriteEngine frames={groundFrame} loading="eager" className={styles.sceneGround} />
          <div className={styles.atmosphere} />
        </div>
        <SpriteEngine frames={apologyAssets.cloudLeft} frameDuration={1350} className={`${styles.sprite} ${styles.cloudLeft}`} />
        <SpriteEngine frames={apologyAssets.cloudRight} frameDuration={1450} className={`${styles.sprite} ${styles.cloudRight}`} />
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
            <div className={`${styles.sign} ${boardClass}`} style={{ backgroundImage: `url(${apologyAssets.sign})` }}>
              <p className={`${styles.message} ${messageClass}`}>{message}</p>
            </div>
          </div>

          <div className={styles.choices}>
            <div className={styles.catChoice}>
              <div className={styles.catStage}>
                <div className={styles.noSign} aria-hidden="true">
                  <SpriteEngine frames={noSignFrame} loading="eager" className={styles.choiceTexture} />
                  <span>{currentCopy.no}</span>
                </div>
                <button type="button" onClick={reactToCat} className={styles.catButton} aria-label={currentCopy.catAria}>
                  <SpriteEngine
                    frames={catMode === "reaction" ? apologyAssets.catReaction : apologyAssets.catIdle}
                    frameDuration={catMode === "reaction" ? 250 : 430}
                    loop={catMode === "idle"}
                    onComplete={finishCatReaction}
                    className={styles.catSprite}
                  />
                </button>
              </div>
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
              <p className={styles.catCaption}>{currentCopy.catCaption}</p>
            </div>

            <div className={styles.yesChoice}>
              <button
                type="button"
                onClick={acceptApology}
                className={`${styles.yesSign} ${accepted ? styles.yesSignAccepted : ""}`}
                disabled={accepted}
                aria-pressed={accepted}
              >
                <SpriteEngine frames={apologyAssets.choices.yes} frameDuration={720} loading="eager" className={styles.choiceTexture} />
                <span className={styles.yesText}>{currentCopy.yes}</span>
                {accepted ? <span className={styles.acceptedMark} aria-hidden="true">✓</span> : null}
              </button>
              <div className={styles.yesHints} aria-hidden="true">
                <SpriteEngine frames={apologyAssets.birds} frameDuration={540} className={`${styles.hintSprite} ${styles.pixelBirdOne}`} />
                <SpriteEngine frames={reversedBirdFrames} frameDuration={610} className={`${styles.hintSprite} ${styles.pixelBirdTwo}`} />
                <SpriteEngine frames={apologyAssets.butterflies} frameDuration={480} className={`${styles.hintSprite} ${styles.pixelButterfly}`} />
                <SpriteEngine frames={apologyAssets.hearts} frameDuration={690} className={`${styles.hintSprite} ${styles.pixelHeart}`} />
                <SpriteEngine frames={apologyAssets.sparkles} frameDuration={430} className={`${styles.hintSprite} ${styles.fireflyOne}`} />
                <SpriteEngine frames={reversedStarFrames} frameDuration={760} className={`${styles.hintSprite} ${styles.fireflyTwo}`} />
              </div>
              <SpriteEngine frames={apologyAssets.arrow} frameDuration={410} className={styles.pixelArrow} />
            </div>
          </div>
        </section>

        <SpriteEngine frames={apologyAssets.bulb} frameDuration={720} className={`${styles.sprite} ${styles.bulbOne}`} />
        <SpriteEngine frames={reversedBulbFrames} frameDuration={810} className={`${styles.sprite} ${styles.bulbTwo}`} />
      </div>
    </main>
  );
}
