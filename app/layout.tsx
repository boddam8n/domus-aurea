import type { Metadata, Viewport } from "next";
import { Amiri, Aref_Ruqaa_Ink, Cormorant_Garamond, Great_Vibes, Playfair_Display, Tajawal } from "next/font/google";
import { LanguageProvider } from "@/components/language-provider";
import { LuxuryAudioPlayer } from "@/components/luxury-audio-player";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap"
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap"
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap"
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap"
});

const arefRuqaa = Aref_Ruqaa_Ink({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-aref-ruqaa",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Domus Aurea | Luxury Wedding Invitations",
  description:
    "A premium Arabic-inspired digital wedding invitation platform with RSVP, guest management, stories, QR sharing and luxury themes.",
  keywords: ["wedding invitation", "digital invitation", "Arabic wedding", "RSVP", "luxury wedding"],
  openGraph: {
    title: "Domus Aurea | Luxury Wedding Invitations",
    description: "Luxury cinematic wedding invitations for unforgettable celebrations.",
    images: ["/assets/wedding-aisle.webp"]
  }
};

export const viewport: Viewport = {
  themeColor: "#090806",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${tajawal.variable} ${amiri.variable} ${cormorant.variable} ${greatVibes.variable} ${playfair.variable} ${arefRuqaa.variable} bg-[var(--color-bg)] font-body text-[var(--color-text)] antialiased`}
      >
        <LanguageProvider>
          <ThemeProvider>
            {children}
            <LuxuryAudioPlayer src="/audio/wedding-music.mp3" variant="nav" />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
