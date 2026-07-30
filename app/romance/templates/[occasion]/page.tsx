import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RomanceTemplateGalleryPage } from "@/components/romance/romance-template-gallery-page";
import { getRomanceType, romanceTypes } from "@/lib/romance";

type RomanceTemplateRouteProps = {
  params: {
    occasion: string;
  };
};

export function generateStaticParams() {
  return romanceTypes.map((item) => ({ occasion: item.id }));
}

export function generateMetadata({ params }: RomanceTemplateRouteProps): Metadata {
  const occasion = getRomanceType(params.occasion);

  if (!occasion) {
    return { title: "Romance Templates | Domus Aurea" };
  }

  return {
    title: `${occasion.title.en} Templates | Domus Aurea Romance`,
    description: `Choose a premium romantic template for ${occasion.title.en.toLowerCase()}.`
  };
}

export default function RomanceTemplateRoute({ params }: RomanceTemplateRouteProps) {
  const occasion = getRomanceType(params.occasion);
  if (!occasion) notFound();

  return <RomanceTemplateGalleryPage occasion={occasion} />;
}
