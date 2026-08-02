import {
  Baby,
  CakeSlice,
  Clapperboard,
  Coffee,
  Gem,
  GraduationCap,
  Heart,
  HeartHandshake,
  Infinity,
  Mail,
  MessageCircleHeart,
  PartyPopper,
  type LucideIcon
} from "lucide-react";

export type OccasionStatus = "available" | "planned";
export type OccasionKind = "invitation" | "message" | "experience";

export type Occasion = {
  id: string;
  label: string;
  labelAr: string;
  icon: LucideIcon;
  kind: OccasionKind;
  status: OccasionStatus;
  showInNavigation: boolean;
  href?: string;
};

export const occasionRegistry: Occasion[] = [
  { id: "wedding", label: "Wedding Invitations", labelAr: "دعوات الزفاف", icon: Heart, kind: "invitation", status: "available", showInNavigation: true },
  { id: "birthday", label: "Birthday", labelAr: "عيد الميلاد", icon: CakeSlice, kind: "invitation", status: "planned", showInNavigation: true },
  { id: "proposal", label: "Proposal", labelAr: "طلب الزواج", icon: Gem, kind: "experience", status: "planned", showInNavigation: true },
  { id: "anniversary", label: "Anniversary", labelAr: "ذكرى سنوية", icon: Infinity, kind: "invitation", status: "planned", showInNavigation: true },
  { id: "graduation", label: "Graduation", labelAr: "التخرج", icon: GraduationCap, kind: "invitation", status: "planned", showInNavigation: true },
  { id: "baby-shower", label: "Baby Shower", labelAr: "استقبال مولود", icon: Baby, kind: "invitation", status: "planned", showInNavigation: true },
  { id: "romance", label: "Romance", labelAr: "الرومانسية", icon: MessageCircleHeart, kind: "experience", status: "available", showInNavigation: true, href: "/romance" },
  { id: "apology", label: "Apology", labelAr: "اعتذار", icon: HeartHandshake, kind: "experience", status: "available", showInNavigation: true, href: "/apology/editor" },
  { id: "celebration", label: "Celebration", labelAr: "احتفال", icon: PartyPopper, kind: "invitation", status: "planned", showInNavigation: true },
  { id: "love-letter", label: "Love Letter", labelAr: "رسالة حب", icon: Mail, kind: "message", status: "planned", showInNavigation: false },
  { id: "coffee-date", label: "Coffee Date", labelAr: "موعد قهوة", icon: Coffee, kind: "experience", status: "planned", showInNavigation: false },
  { id: "movie-night", label: "Movie Night", labelAr: "ليلة فيلم", icon: Clapperboard, kind: "experience", status: "planned", showInNavigation: false }
];

export const occasions = occasionRegistry.filter((occasion) => occasion.showInNavigation);

export function getOccasion(id: string) {
  return occasionRegistry.find((occasion) => occasion.id === id);
}
