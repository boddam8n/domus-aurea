import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Gem,
  Heart,
  Music,
  Palette,
  QrCode,
  ShieldCheck,
  Users
} from "lucide-react";

export type InvitationTemplateStatus = "development" | "available";

export type InvitationTemplate = {
  name: string;
  nameAr: string;
  image: string;
  description: string;
  status: InvitationTemplateStatus;
  badge: string;
  badgeAr: string;
};

export const wedding = {
  brand: "Domus Aurea",
  arabicBrand: "دوموس أوريا",
  couple: "ليان و ياسين",
  coupleEn: "Layan & Yassin",
  date: "2026-12-12T20:00:00+02:00",
  venue: "قصر الزمرد",
  venueEn: "Emerald Palace",
  city: "Cairo",
  whatsapp: "https://wa.me/201000000000",
  instagram: "https://instagram.com/domusaurea",
  inviteLink: "/invitation/layan-yassin"
};

export const navItems = [
  { href: "/", label: "Home", ar: "الرئيسية" },
  { href: "/templates", label: "Templates", ar: "القوالب" },
  { href: "/design", label: "Design Invitation", ar: "صمّم دعوتك" },
  { href: "/pricing", label: "Pricing", ar: "الأسعار" },
  { href: "/#faq", label: "FAQ", ar: "الأسئلة" }
];

export const features = [
  {
    icon: Palette,
    title: "Bespoke Visual Direction",
    body: "Customers choose a mood, palette, language direction, imagery style and celebration personality."
  },
  {
    icon: Heart,
    title: "Personal Couple Experience",
    body: "Every order includes a polished couple page, story blocks, guest-ready invitation and RSVP path."
  },
  {
    icon: Clock,
    title: "Fast Premium Delivery",
    body: "Structured ordering turns a high-end invitation brief into a beautiful launch-ready experience."
  },
  {
    icon: QrCode,
    title: "QR + WhatsApp Sharing",
    body: "Final invitations are delivered with QR assets and WhatsApp-ready copy for effortless sharing."
  },
  {
    icon: Music,
    title: "Cinematic Extras",
    body: "Optional music, video backgrounds, opening scenes, intro animations and premium micro-interactions."
  },
  {
    icon: ShieldCheck,
    title: "Private Client Portal",
    body: "Order status and admin tools are protected behind authentication, away from public visitors."
  }
];

export const themes = [
  { name: "Noir Gold", description: "Black-tie evening, candlelight, gold foil and deep contrast.", colors: ["#090806", "#c89b46", "#f7efe2"] },
  { name: "Emerald Majlis", description: "Arabic geometry, emerald silk, brass detail and palace ambience.", colors: ["#062f27", "#dcc28b", "#11100d"] },
  { name: "Ivory Couture", description: "Sunlit ivory, champagne gradients, floral softness and editorial calm.", colors: ["#f7efe2", "#b8894b", "#8f2634"] }
];

const developmentBadge = {
  status: "development" as const,
  badge: "Coming Soon",
  badgeAr: "قريبًا"
};

export const invitationTemplates: InvitationTemplate[] = [
  {
    name: "Mirror Acrylic",
    nameAr: "أكريليك مرايا",
    image: "/assets/templates/mirror-acrylic-reference.webp",
    description: "Reflective champagne acrylic, white floral linework, and polished layered typography.",
    ...developmentBadge
  },
  {
    name: "Burgundy Scroll",
    nameAr: "لفافة عنابية",
    image: "/assets/invitation-sequences/burgundy-scroll/closed.png",
    description: "Velvet burgundy scroll mood with a warm wax seal and ceremonial reveal.",
    ...developmentBadge
  },
  {
    name: "Ocean Floral Arch",
    nameAr: "قوس ورد على البحر",
    image: "/assets/templates/ocean-floral-arch-reference.webp",
    description: "White floral arches, sea horizon light, and a clean romantic ceremony rhythm.",
    ...developmentBadge
  },
  {
    name: "Royal Scroll",
    nameAr: "مخطوطة ملكية",
    image: "/assets/templates/royal-scroll-reference.webp",
    description: "Parchment scroll layout with gold rods, ornate spacing, and classic script hierarchy.",
    ...developmentBadge
  },
  {
    name: "Message Bottle",
    nameAr: "رسالة في زجاجة",
    image: "/assets/templates/message-bottle-reference.webp",
    description: "Seaside bottle concept with sand, shell detail, and a private handwritten feeling.",
    ...developmentBadge
  },
  {
    name: "Navy Laser Gate",
    nameAr: "بوابة كحلية محفورة",
    image: "/assets/invitation-sequences/navy-gate/closed.png",
    description: "Navy laser-cut gate pattern with a gold monogram and crisp inner card.",
    ...developmentBadge
  },
  {
    name: "Emerald Velvet",
    nameAr: "مخمل زمردي",
    image: "/assets/templates/emerald-velvet-reference.webp",
    description: "Deep velvet green, transparent acrylic feeling, ornate crest, and gold border lines.",
    ...developmentBadge
  },
  {
    name: "Vintage Letterpress",
    nameAr: "طباعة كلاسيكية",
    image: "/assets/templates/vintage-letterpress-reference.webp",
    description: "Ivory letterpress paper, antique floral border, olive envelope energy, and soft shadows.",
    ...developmentBadge
  },
  {
    name: "Noir Gold Pocket",
    nameAr: "جيب أسود وذهبي",
    image: "/assets/templates/noir-gold-pocket-reference.webp",
    description: "Black pocket invitation with gold initials, modern QR-like structure, and editorial contrast.",
    ...developmentBadge
  },
  {
    name: "TEST INVITATION",
    nameAr: "TEST INVITATION",
    image: "/assets/templates/test-invitation-preview.webp",
    description: "A launch-ready blush royal invitation with ivory sliding doors, a rose wax seal, and a full-screen floral card reveal.",
    status: "available",
    badge: "Launch Ready",
    badgeAr: "جاهز للإطلاق"
  }
];

export const pricingPlans = [
  {
    name: "Basic Package",
    nameAr: "الباقة الأساسية",
    price: "30 EGP",
    description: "A refined digital invitation request with one elegant direction.",
    features: ["Invitation style consultation", "Basic wedding details", "WhatsApp-ready summary", "Arabic or English"]
  },
  {
    name: "Premium Package",
    nameAr: "الباقة المميزة",
    price: "500 EGP",
    description: "For couples who want a richer custom invitation direction.",
    featured: true,
    features: ["Everything in Basic", "Template customization", "Countdown style selection", "Music direction", "Arabic + English"]
  },
  {
    name: "Royal Package",
    nameAr: "الباقة الملكية",
    price: "900 EGP",
    description: "A complete luxury request for a memorable guest experience.",
    features: ["Full creative direction", "Opening animation choice", "Premium RSVP direction", "Music support", "Priority delivery"]
  }
];

export const processSteps = [
  { title: "Browse Templates", body: "Explore refined invitation directions and choose the closest mood for your wedding." },
  { title: "Choose Preferred Style", body: "Select template, package and countdown style without getting lost in complex tools." },
  { title: "Enter Wedding Information", body: "Add names, wedding date, venue and contact details for the design request." },
  { title: "Complete Request", body: "Send a professional summary through WhatsApp or Instagram to finish your invitation." }
];

export const countdownStyles = [
  { name: "Luxury Gold", description: "Warm gold numerals with classic luxury spacing." },
  { name: "Modern Minimal", description: "Clean, quiet, and contemporary for modern weddings." },
  { name: "Floral Style", description: "Soft floral detail with romantic decorative edges." },
  { name: "Royal Frame", description: "A formal framed countdown with palace-inspired details." },
  { name: "Elegant Arabic", description: "Arabic-inspired rhythm with refined gold separators." }
];

export const comparison = [
  { feature: "Luxury responsive invitation", signature: true, couture: true, royal: true },
  { feature: "RSVP collection", signature: true, couture: true, royal: true },
  { feature: "Bilingual Arabic + English", signature: false, couture: true, royal: true },
  { feature: "Custom AI visual direction", signature: false, couture: true, royal: true },
  { feature: "Guest segmentation", signature: false, couture: false, royal: true }
];

export const testimonials = [
  {
    quote: "It felt less like a link and more like opening the visual identity of our wedding.",
    name: "Farah A.",
    role: "Bride, Dubai"
  },
  {
    quote: "The ordering process was calm, premium and surprisingly precise. Our guests loved the RSVP flow.",
    name: "Yousef M.",
    role: "Groom, Cairo"
  },
  {
    quote: "Finally a digital invitation product that looks aligned with luxury event production.",
    name: "Aurea Events",
    role: "Wedding planner"
  }
];

export const faqs = [
  { question: "Is this the actual invitation or an ordering platform?", answer: "This is the ordering platform. Customers use it to choose packages, themes and request a custom luxury invitation." },
  { question: "Can the final invitation be Arabic and English?", answer: "Yes. Couture and Royal packages support bilingual RTL/LTR invitation experiences." },
  { question: "Do you support WhatsApp and QR sharing?", answer: "Yes. Every delivered invitation can include WhatsApp copy, QR assets and a personalized link." },
  { question: "Is the admin dashboard public?", answer: "No. Admin tools are kept behind the client portal and are not shown in public navigation." }
];

export const story = [
  { date: "2019", title: "The First Look", body: "A quiet evening became the beginning of everything." },
  { date: "2021", title: "The Promise", body: "A private promise, a shared future, and a thousand small rituals." },
  { date: "2025", title: "The Proposal", body: "Gold lights, jasmine air, and one unforgettable yes." },
  { date: "2026", title: "The Celebration", body: "A cinematic night crafted for family, friends and memory." }
];

export const adminStats = [
  { label: "Invitations", value: "128", icon: CalendarDays },
  { label: "Confirmed Guests", value: "342", icon: Users },
  { label: "Public Links", value: "64", icon: QrCode },
  { label: "Luxury Themes", value: "18", icon: Gem }
];

export const guests = [
  { name: "Nour Family", status: "Confirmed", seats: 5, table: "Emerald 01" },
  { name: "Omar Hassan", status: "Pending", seats: 2, table: "Gold 04" },
  { name: "Salma Atelier", status: "Confirmed", seats: 8, table: "Pearl 02" },
  { name: "Youssef Group", status: "Declined", seats: 3, table: "Noir 07" }
];
