import { Bodoni_Moda, IBM_Plex_Sans_Arabic, Manrope, Noto_Naskh_Arabic } from "next/font/google";

const latinDisplay = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-brand-latin-display",
  adjustFontFallback: false,
  display: "swap"
});

const latinBody = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-brand-latin-body",
  display: "swap"
});

const arabicDisplay = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-brand-arabic-display",
  display: "swap"
});

const arabicBody = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-brand-arabic-body",
  display: "swap"
});

export const brandFontVariables = [
  latinDisplay.variable,
  latinBody.variable,
  arabicDisplay.variable,
  arabicBody.variable
].join(" ");
