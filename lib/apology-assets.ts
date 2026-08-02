const frames = (prefix: string, count: number) => Array.from(
  { length: count },
  (_, index) => `${prefix}-${String(index + 1).padStart(2, "0")}.webp`
);

export const apologyAssets = {
  scene: {
    sky: "/apology/assets/scene/sky.webp",
    city: "/apology/assets/scene/city.webp",
    ground: "/apology/assets/scene/ground.webp"
  },
  catIdle: Array.from({ length: 6 }, (_, index) =>
    `/apology/assets/cat/cat-${String(index + 1).padStart(2, "0")}.webp`
  ),
  catReaction: Array.from({ length: 4 }, (_, index) =>
    `/apology/assets/cat/cat-${String(index + 7).padStart(2, "0")}.webp`
  ),
  sign: "/apology/assets/sign/wood-sign.webp",
  choices: {
    yes: frames("/apology/assets/choices/yes", 4),
    no: "/apology/assets/choices/no.webp"
  },
  lamp: frames("/apology/assets/sprites/lamp", 4),
  bulb: frames("/apology/assets/sprites/bulb", 4),
  cloudLeft: frames("/apology/assets/sprites/cloud-left", 6),
  cloudRight: frames("/apology/assets/sprites/cloud-right", 6),
  moon: frames("/apology/assets/sprites/moon", 4),
  stars: frames("/apology/assets/sprites/star", 4),
  flowers: frames("/apology/assets/sprites/flower", 4),
  hearts: frames("/apology/assets/sprites/heart", 4),
  birds: frames("/apology/assets/sprites/bird", 6),
  butterflies: frames("/apology/assets/sprites/butterfly", 6),
  arrow: frames("/apology/assets/sprites/arrow", 4),
  sparkles: frames("/apology/assets/sprites/sparkle", 4),
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

export const apologyCriticalAssetUrls = [
  apologyAssets.scene.sky,
  apologyAssets.scene.city,
  apologyAssets.scene.ground,
  apologyAssets.sign,
  apologyAssets.choices.yes[0],
  apologyAssets.choices.no,
  apologyAssets.catIdle[0]
] as const;
