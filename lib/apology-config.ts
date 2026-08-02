import { z } from "zod";

export const apologyLanguages = ["ar", "en"] as const;
export const apologyFonts = ["amiri", "tajawal", "ruqaa", "playfair"] as const;
export const apologyTextAlignments = ["start", "center", "end"] as const;

export const apologyConfigSchema = z.object({
  language: z.enum(apologyLanguages).default("ar"),
  message: z.string().trim().min(1, "اكتب رسالة الاعتذار أولًا.").max(1200),
  textColor: z.string().regex(/^#[0-9a-f]{6}$/i, "اختر لونًا صالحًا للنص."),
  fontFamily: z.enum(apologyFonts),
  fontSize: z.number().int().min(14).max(34),
  lineSpacing: z.number().min(1.25).max(2.4),
  textAlignment: z.enum(apologyTextAlignments),
  boardWidth: z.number().int().min(72).max(100),
  boardHeight: z.number().int().min(180).max(520),
  boardX: z.number().int().min(-80).max(80),
  boardY: z.number().int().min(-80).max(80),
  catX: z.number().int().min(-70).max(70),
  catY: z.number().int().min(-70).max(70),
  yesX: z.number().int().min(-70).max(70),
  yesY: z.number().int().min(-70).max(70),
  noX: z.number().int().min(-70).max(70),
  noY: z.number().int().min(-70).max(70),
  decorationsEnabled: z.boolean(),
  musicEnabled: z.boolean(),
  soundEffectsEnabled: z.boolean()
});

export const apologyRequestSchema = z.object({
  config: apologyConfigSchema
});

export type ApologyConfig = z.infer<typeof apologyConfigSchema>;
export type ApologyFont = ApologyConfig["fontFamily"];

export const defaultApologyConfig: ApologyConfig = {
  language: "ar",
  message: "أنا آسف من قلبي. وجودك عندي أهم من أي خلاف، ونفسي نبدأ الكلام من جديد بهدوء ومحبة.",
  textColor: "#fff0cf",
  fontFamily: "amiri",
  fontSize: 25,
  lineSpacing: 1.85,
  textAlignment: "center",
  boardWidth: 100,
  boardHeight: 188,
  boardX: 0,
  boardY: 0,
  catX: 0,
  catY: 0,
  yesX: 0,
  yesY: 0,
  noX: 0,
  noY: 0,
  decorationsEnabled: true,
  musicEnabled: true,
  soundEffectsEnabled: true
};

export function normalizeApologyConfig(value: unknown): ApologyConfig {
  const candidate = value && typeof value === "object"
    ? { ...defaultApologyConfig, ...value }
    : defaultApologyConfig;
  const parsed = apologyConfigSchema.safeParse(candidate);
  return parsed.success ? parsed.data : defaultApologyConfig;
}

export const apologyFontLabels: Record<ApologyFont, { ar: string; en: string }> = {
  amiri: { ar: "أميري", en: "Amiri" },
  tajawal: { ar: "تجوال", en: "Tajawal" },
  ruqaa: { ar: "رقعة", en: "Ruqaa" },
  playfair: { ar: "بلايفير", en: "Playfair" }
};
