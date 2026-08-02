export const apologyAssets = {
  background: "/apology/assets/background/night-garden.webp",
  catIdle: Array.from({ length: 6 }, (_, index) =>
    `/apology/assets/cat/cat-${String(index + 1).padStart(2, "0")}.webp`
  ),
  catReaction: Array.from({ length: 4 }, (_, index) =>
    `/apology/assets/cat/cat-${String(index + 7).padStart(2, "0")}.webp`
  ),
  sign: "/apology/assets/sign/wood-sign.webp",
  yesButton: [
    "/apology/assets/buttons/yes-idle.webp",
    "/apology/assets/buttons/yes-glow.webp"
  ],
  yesPressed: "/apology/assets/buttons/yes-pressed.webp",
  lamp: [
    "/apology/assets/lamps/lamp-off.webp",
    "/apology/assets/lamps/lamp-on.webp"
  ],
  bulb: [
    "/apology/assets/lamps/bulb-dim.webp",
    "/apology/assets/lamps/bulb-bright.webp"
  ],
  clouds: [
    "/apology/assets/clouds/cloud-01.webp",
    "/apology/assets/clouds/cloud-02.webp"
  ],
  moon: [
    "/apology/assets/effects/moon-dim.webp",
    "/apology/assets/effects/moon-glow.webp"
  ],
  stars: [
    "/apology/assets/effects/star-dim.webp",
    "/apology/assets/effects/star-bright.webp"
  ],
  flowers: [
    "/apology/assets/flowers/flower-01.webp",
    "/apology/assets/flowers/flower-02.webp"
  ],
  hearts: [
    "/apology/assets/effects/heart-01.webp",
    "/apology/assets/effects/heart-02.webp"
  ],
  heart: "/apology/assets/effects/heart.webp",
  zzz: "/apology/assets/effects/zzz.webp",
  audio: {
    ambience: "/apology/assets/audio/night-ambience.mp3",
    purr: "/apology/assets/audio/cat-purr.mp3",
    meow: "/apology/assets/audio/tiny-meow.mp3",
    click: "/apology/assets/audio/arcade-click.mp3",
    lamp: "/apology/assets/audio/lamp-hum.mp3"
  }
} as const;

function flattenValues(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenValues);
  if (value && typeof value === "object") return Object.values(value).flatMap(flattenValues);
  return [];
}

export const apologyAssetUrls = Array.from(new Set(flattenValues(apologyAssets)));

export const apologyImageUrls = apologyAssetUrls.filter((url) => !url.endsWith(".mp3"));
export const apologyAudioUrls = apologyAssetUrls.filter((url) => url.endsWith(".mp3"));
