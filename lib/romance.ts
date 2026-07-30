export type LocalizedCopy = {
  en: string;
  ar: string;
};

export type RomanceFeatureKey =
  | "music"
  | "gifs"
  | "stickers"
  | "countdown"
  | "custom-messages"
  | "photo-uploads"
  | "secret-reveal"
  | "interactive-animations"
  | "qr-sharing"
  | "reactions";

export type RomanceType = {
  id: string;
  icon:
    | "heart"
    | "coffee"
    | "movie"
    | "sunset"
    | "letter"
    | "cake"
    | "gift"
    | "anniversary"
    | "proposal"
    | "apology"
    | "surprise";
  title: LocalizedCopy;
  description: LocalizedCopy;
  image: string;
  accent: "blush" | "peach" | "lavender" | "sky" | "rose";
  featured?: boolean;
};

export type RomanceTemplate = {
  id: string;
  name: LocalizedCopy;
  description: LocalizedCopy;
  image: string;
  accent: RomanceType["accent"];
  plannedFeatures: RomanceFeatureKey[];
};

export const romanceTypes: RomanceType[] = [
  {
    id: "ask-someone-out",
    icon: "heart",
    title: { en: "Ask Someone Out", ar: "دعوة لموعد" },
    description: {
      en: "A small invitation that could begin a beautiful story.",
      ar: "دعوة صغيرة قد تبدأ منها حكاية جميلة."
    },
    image: "/romance/type-01.webp",
    accent: "blush",
    featured: true
  },
  {
    id: "coffee-date",
    icon: "coffee",
    title: { en: "Coffee Date", ar: "موعد قهوة" },
    description: {
      en: "Warm coffee, an easy conversation, and time together.",
      ar: "قهوة دافئة وحديث لطيف ووقت يجمعكما."
    },
    image: "/romance/type-02.webp",
    accent: "peach"
  },
  {
    id: "movie-night",
    icon: "movie",
    title: { en: "Movie Night", ar: "ليلة سينما" },
    description: {
      en: "Turn a favorite film into a memorable invitation.",
      ar: "حوّل فيلمًا مفضلًا إلى دعوة لا تُنسى."
    },
    image: "/romance/type-03.webp",
    accent: "lavender"
  },
  {
    id: "sunset-walk",
    icon: "sunset",
    title: { en: "Sunset Walk", ar: "نزهة الغروب" },
    description: {
      en: "A gentle plan for golden skies and unhurried moments.",
      ar: "موعد هادئ لسماء ذهبية ولحظات بلا استعجال."
    },
    image: "/romance/type-04.webp",
    accent: "peach"
  },
  {
    id: "love-letter",
    icon: "letter",
    title: { en: "Love Letter", ar: "رسالة حب" },
    description: {
      en: "Send words that feel considered, personal, and timeless.",
      ar: "أرسل كلمات صادقة وشخصية لا يفقدها الزمن."
    },
    image: "/romance/type-05.webp",
    accent: "rose",
    featured: true
  },
  {
    id: "birthday-surprise",
    icon: "cake",
    title: { en: "Birthday Surprise", ar: "مفاجأة عيد ميلاد" },
    description: {
      en: "A joyful reveal made especially for someone you love.",
      ar: "مفاجأة مبهجة صُممت خصيصًا لشخص تحبه."
    },
    image: "/romance/type-06.webp",
    accent: "blush"
  },
  {
    id: "cute-gift",
    icon: "gift",
    title: { en: "Cute Gift Invitation", ar: "دعوة بهدية" },
    description: {
      en: "Wrap an invitation with the feeling of a thoughtful gift.",
      ar: "دعوة تحمل إحساس هدية مختارة بعناية."
    },
    image: "/romance/type-07.webp",
    accent: "peach"
  },
  {
    id: "anniversary",
    icon: "anniversary",
    title: { en: "Anniversary", ar: "ذكرى سنوية" },
    description: {
      en: "Celebrate the chapter you share and the ones still ahead.",
      ar: "احتفل بالفصل الذي جمعكما وما ينتظركما بعده."
    },
    image: "/romance/type-08.webp",
    accent: "lavender"
  },
  {
    id: "proposal",
    icon: "proposal",
    title: { en: "Proposal", ar: "طلب زواج" },
    description: {
      en: "Create a beautiful beginning for one unforgettable question.",
      ar: "اصنع بداية جميلة لسؤال واحد لا يُنسى."
    },
    image: "/romance/type-09.webp",
    accent: "blush",
    featured: true
  },
  {
    id: "apology",
    icon: "apology",
    title: { en: "Apology", ar: "اعتذار" },
    description: {
      en: "Say it softly, sincerely, and with space for a new beginning.",
      ar: "قلها بلطف وصدق واترك مساحة لبداية جديدة."
    },
    image: "/romance/type-10.webp",
    accent: "sky"
  },
  {
    id: "special-surprise",
    icon: "surprise",
    title: { en: "Special Surprise", ar: "مفاجأة خاصة" },
    description: {
      en: "Make an ordinary day feel wonderfully unexpected.",
      ar: "اجعل يومًا عاديًا يبدو مدهشًا وغير متوقع."
    },
    image: "/romance/type-11.webp",
    accent: "lavender"
  }
];

export const romanceTemplates: RomanceTemplate[] = [
  {
    id: "pink-hearts",
    name: { en: "Pink Hearts", ar: "قلوب وردية" },
    description: { en: "Blush paper, tiny blooms, and rose-gold foil.", ar: "ورق وردي وزهور صغيرة ولمسات روز جولد." },
    image: "/romance/tpl-01.webp",
    accent: "blush",
    plannedFeatures: ["music", "stickers", "reactions"]
  },
  {
    id: "kawaii-cats",
    name: { en: "Kawaii Cats", ar: "قطط لطيفة" },
    description: { en: "A refined, playful story for two.", ar: "حكاية راقية ومرحة لشخصين." },
    image: "/romance/tpl-02.webp",
    accent: "peach",
    plannedFeatures: ["gifs", "stickers", "reactions"]
  },
  {
    id: "romantic-night",
    name: { en: "Romantic Night", ar: "ليلة رومانسية" },
    description: { en: "Moonlight, lavender skies, and a sealed note.", ar: "ضوء قمر وسماء لافندر ورسالة مختومة." },
    image: "/romance/tpl-03.webp",
    accent: "lavender",
    plannedFeatures: ["music", "countdown", "secret-reveal"]
  },
  {
    id: "coffee-time",
    name: { en: "Coffee Time", ar: "وقت القهوة" },
    description: { en: "A warm invitation made for easy conversation.", ar: "دعوة دافئة لحديث بسيط ولطيف." },
    image: "/romance/tpl-04.webp",
    accent: "peach",
    plannedFeatures: ["custom-messages", "qr-sharing"]
  },
  {
    id: "anime-love",
    name: { en: "Anime Love", ar: "حب الأنيمي" },
    description: { en: "Cinematic petals and a glowing sunset promise.", ar: "بتلات سينمائية ووعد تحت ضوء الغروب." },
    image: "/romance/tpl-05.webp",
    accent: "rose",
    plannedFeatures: ["music", "gifs", "interactive-animations"]
  },
  {
    id: "minimal-romance",
    name: { en: "Minimal Romance", ar: "رومانسية هادئة" },
    description: { en: "Quiet cream paper with one confident ribbon.", ar: "ورق كريمي هادئ وشريط واحد أنيق." },
    image: "/romance/tpl-06.webp",
    accent: "rose",
    plannedFeatures: ["custom-messages", "qr-sharing"]
  },
  {
    id: "rose-garden",
    name: { en: "Rose Garden", ar: "حديقة الورد" },
    description: { en: "A lush floral frame with a soft ivory center.", ar: "إطار غني بالورود وقلب عاجي هادئ." },
    image: "/romance/tpl-07.webp",
    accent: "blush",
    plannedFeatures: ["photo-uploads", "music", "countdown"]
  },
  {
    id: "dream-clouds",
    name: { en: "Dream Clouds", ar: "سحب حالمة" },
    description: { en: "A floating letter beneath a luminous moon.", ar: "رسالة عائمة تحت قمر مضيء." },
    image: "/romance/tpl-08.webp",
    accent: "sky",
    plannedFeatures: ["secret-reveal", "interactive-animations", "music"]
  },
  {
    id: "love-letter",
    name: { en: "Love Letter", ar: "رسالة حب" },
    description: { en: "Layered stationery, silk ribbon, and a personal seal.", ar: "طبقات ورقية وشريط حريري وختم شخصي." },
    image: "/romance/tpl-09.webp",
    accent: "blush",
    plannedFeatures: ["custom-messages", "secret-reveal", "reactions"]
  },
  {
    id: "galaxy-love",
    name: { en: "Galaxy Love", ar: "حب كوني" },
    description: { en: "Constellations and quiet light for a love without limits.", ar: "نجوم وضوء هادئ لحب بلا حدود." },
    image: "/romance/tpl-10.webp",
    accent: "lavender",
    plannedFeatures: ["music", "interactive-animations", "qr-sharing"]
  }
];

export const romanceFutureFeatures: Record<RomanceFeatureKey, { status: "planned" }> = {
  music: { status: "planned" },
  gifs: { status: "planned" },
  stickers: { status: "planned" },
  countdown: { status: "planned" },
  "custom-messages": { status: "planned" },
  "photo-uploads": { status: "planned" },
  "secret-reveal": { status: "planned" },
  "interactive-animations": { status: "planned" },
  "qr-sharing": { status: "planned" },
  reactions: { status: "planned" }
};

export function getRomanceType(id: string) {
  return romanceTypes.find((item) => item.id === id);
}

export function getRomanceTemplatesForOccasion(occasionId: string) {
  const offset = Math.max(
    0,
    romanceTypes.findIndex((item) => item.id === occasionId)
  );

  return romanceTemplates.map((_, index) => romanceTemplates[(index + offset) % romanceTemplates.length]);
}

export function getRomanceTemplateGalleryPath(occasionId: string) {
  return `/romance/templates/${occasionId}`;
}

export function getFutureRomanceEditorPath(occasionId: string, templateId: string) {
  const search = new URLSearchParams({ occasion: occasionId, template: templateId });
  return `/romance/editor?${search.toString()}`;
}
