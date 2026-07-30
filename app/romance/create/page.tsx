import type { Metadata } from "next";
import { RomanceOccasionPage } from "@/components/romance/romance-occasion-page";

export const metadata: Metadata = {
  title: "Choose an Occasion | Domus Aurea Romance",
  description: "Choose the romantic moment you want to turn into a beautiful personal experience."
};

export default function RomanceCreatePage() {
  return <RomanceOccasionPage />;
}
