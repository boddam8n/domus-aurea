import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/components/language-provider";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://domus-aurea.example"),
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
      <body className="bg-[var(--color-bg)] font-body text-[var(--color-text)] antialiased">
        <LanguageProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
