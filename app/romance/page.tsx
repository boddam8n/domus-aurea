import type { Metadata } from "next";
import { RomancePage } from "@/components/romance/romance-page";

export const metadata: Metadata = {
  title: "Romance | Domus Aurea",
  description:
    "Warm, playful and premium romantic invitation experiences for dates, letters, proposals and beautiful surprises.",
  openGraph: {
    title: "Romance by Domus Aurea",
    description: "Every beautiful story begins with a simple invitation.",
    images: ["/romance/hero-world.webp"]
  }
};

export default function RomanceRoute() {
  return <RomancePage />;
}
