import {
  Baby,
  CakeSlice,
  Gem,
  GraduationCap,
  Heart,
  HeartHandshake,
  Infinity,
  MessageCircleHeart,
  PartyPopper,
  type LucideIcon
} from "lucide-react";

export type Occasion = {
  id: string;
  label: string;
  labelAr: string;
  icon: LucideIcon;
  href?: string;
};

export const occasions: Occasion[] = [
  { id: "wedding", label: "Wedding Invitations", labelAr: "دعوات الزفاف", icon: Heart },
  { id: "birthday", label: "Birthday", labelAr: "عيد الميلاد", icon: CakeSlice },
  { id: "proposal", label: "Proposal", labelAr: "طلب الزواج", icon: Gem },
  { id: "anniversary", label: "Anniversary", labelAr: "ذكرى سنوية", icon: Infinity },
  { id: "graduation", label: "Graduation", labelAr: "التخرج", icon: GraduationCap },
  { id: "baby-shower", label: "Baby Shower", labelAr: "استقبال مولود", icon: Baby },
  { id: "romance", label: "Romance", labelAr: "الرومانسية", icon: MessageCircleHeart, href: "/romance" },
  { id: "apology", label: "Apology", labelAr: "اعتذار", icon: HeartHandshake },
  { id: "celebration", label: "Celebration", labelAr: "احتفال", icon: PartyPopper }
];
