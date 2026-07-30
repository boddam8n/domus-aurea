import type { Metadata } from "next";
import { RomanceTemplateGalleryPage } from "@/components/romance/romance-template-gallery-page";

export const metadata: Metadata = {
  title: "Romance Templates | Domus Aurea",
  description: "Choose a premium romantic template for a personal invitation, letter, or thoughtful surprise."
};

export default function RomanceTemplatesPage() {
  return <RomanceTemplateGalleryPage />;
}
