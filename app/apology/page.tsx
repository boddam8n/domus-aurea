import type { Metadata } from "next";
import { ApologyExperience } from "@/components/apology/apology-experience";

export const metadata: Metadata = {
  title: "اعتذار | Domus Aurea",
  description: "A tiny handcrafted apology experience from Domus Aurea.",
  openGraph: {
    title: "اعتذار | Domus Aurea",
    description: "Sometimes a small sincere message can make everything feel lighter.",
    images: ["/apology/assets/background/night-garden.webp"]
  }
};

type ApologyPageProps = {
  searchParams: {
    lang?: string;
    message?: string;
  };
};

export default function ApologyPage({ searchParams }: ApologyPageProps) {
  return (
    <ApologyExperience
      initialLanguage={searchParams.lang === "en" ? "en" : "ar"}
      initialMessage={searchParams.message}
    />
  );
}
