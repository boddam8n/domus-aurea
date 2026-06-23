import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Domus Aurea | Luxury Wedding Invitations",
  description:
    "A premium Arabic-inspired digital wedding invitation platform with RSVP, guest management, gallery, stories, QR sharing and luxury themes.",
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
      <body className={`${tajawal.variable} bg-[var(--color-bg)] font-body text-[var(--color-text)] antialiased`}>
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
