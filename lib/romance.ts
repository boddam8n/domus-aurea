export type LocalizedCopy = {
  en: string;
  ar: string;
};

export type RomanceAccent = "blush" | "peach" | "lavender" | "sky" | "rose";

export type RomanceTemplate = {
  id: string;
  name: LocalizedCopy;
  description: LocalizedCopy;
  image: string;
  accent: RomanceAccent;
};

export const romanceTemplates: RomanceTemplate[] = [
  {
    id: "pink-hearts",
    name: { en: "Pink Hearts", ar: "قلوب وردية" },
    description: { en: "Blush paper, tiny blooms, and rose-gold foil.", ar: "ورق وردي وزهور صغيرة ولمسات روز جولد." },
    image: "/romance/tpl-01.webp",
    accent: "blush"
  },
  {
    id: "kawaii-cats",
    name: { en: "Kawaii Cats", ar: "قطط لطيفة" },
    description: { en: "A refined, playful story for two.", ar: "حكاية راقية ومرحة لشخصين." },
    image: "/romance/tpl-02.webp",
    accent: "peach"
  },
  {
    id: "romantic-night",
    name: { en: "Romantic Night", ar: "ليلة رومانسية" },
    description: { en: "Moonlight, lavender skies, and a sealed note.", ar: "ضوء قمر وسماء لافندر ورسالة مختومة." },
    image: "/romance/tpl-03.webp",
    accent: "lavender"
  },
  {
    id: "coffee-time",
    name: { en: "Coffee Time", ar: "وقت القهوة" },
    description: { en: "A warm invitation made for easy conversation.", ar: "دعوة دافئة لحديث بسيط ولطيف." },
    image: "/romance/tpl-04.webp",
    accent: "peach"
  },
  {
    id: "anime-love",
    name: { en: "Anime Love", ar: "حب الأنيمي" },
    description: { en: "Cinematic petals and a glowing sunset promise.", ar: "بتلات سينمائية ووعد تحت ضوء الغروب." },
    image: "/romance/tpl-05.webp",
    accent: "rose"
  },
  {
    id: "minimal-romance",
    name: { en: "Minimal Romance", ar: "رومانسية هادئة" },
    description: { en: "Quiet cream paper with one confident ribbon.", ar: "ورق كريمي هادئ وشريط واحد أنيق." },
    image: "/romance/tpl-06.webp",
    accent: "rose"
  },
  {
    id: "rose-garden",
    name: { en: "Rose Garden", ar: "حديقة الورد" },
    description: { en: "A lush floral frame with a soft ivory center.", ar: "إطار غني بالورود وقلب عاجي هادئ." },
    image: "/romance/tpl-07.webp",
    accent: "blush"
  },
  {
    id: "dream-clouds",
    name: { en: "Dream Clouds", ar: "سحب حالمة" },
    description: { en: "A floating letter beneath a luminous moon.", ar: "رسالة عائمة تحت قمر مضيء." },
    image: "/romance/tpl-08.webp",
    accent: "sky"
  },
  {
    id: "love-letter",
    name: { en: "Love Letter", ar: "رسالة حب" },
    description: { en: "Layered stationery, silk ribbon, and a personal seal.", ar: "طبقات ورقية وشريط حريري وختم شخصي." },
    image: "/romance/tpl-09.webp",
    accent: "blush"
  },
  {
    id: "galaxy-love",
    name: { en: "Galaxy Love", ar: "حب كوني" },
    description: { en: "Constellations and quiet light for a love without limits.", ar: "نجوم وضوء هادئ لحب بلا حدود." },
    image: "/romance/tpl-10.webp",
    accent: "lavender"
  }
];

export function getFutureRomanceEditorPath(templateId: string) {
  const search = new URLSearchParams({ template: templateId });
  return `/romance/editor?${search.toString()}`;
}
