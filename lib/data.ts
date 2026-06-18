import {
  CalendarDays,
  Camera,
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
  { href: "/design", label: "Design Invitation", ar: "صمم دعوتك" },
  { href: "/pricing", label: "Pricing", ar: "الأسعار" },
  { href: "/gallery", label: "Gallery", ar: "المعرض" },
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
    body: "Optional music, video backgrounds, gallery moments, intro animations and premium micro-interactions."
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

export const invitationTemplates = [
  {
    name: "Royal Gold",
    nameAr: "الذهب الملكي",
    image: "/assets/template-ivory.webp",
    description: "Ivory stationery, champagne foil and a restrained royal border."
  },
  {
    name: "Emerald Palace",
    nameAr: "قصر الزمرد",
    image: "/assets/template-emerald.webp",
    description: "Deep forest green, fine geometric embossing and evening elegance."
  },
  {
    name: "Classic Arabic",
    nameAr: "العربي الكلاسيكي",
    image: "/assets/paper-clean.webp",
    description: "Arabic calligraphy feeling, soft ivory paper and delicate gold ornaments."
  },
  {
    name: "Modern Luxury",
    nameAr: "الفخامة الحديثة",
    image: "/assets/domus-hero.webp",
    description: "Editorial spacing, minimal composition and a refined hotel-brand mood."
  },
  {
    name: "Floral Gold",
    nameAr: "ورود ذهبية",
    image: "/assets/floral-aisle-luxury.webp",
    description: "Romantic floral aisle inspiration with warm gold detail."
  },
  {
    name: "Minimal Elegant",
    nameAr: "بساطة راقية",
    image: "/assets/template-ivory.webp",
    description: "Quiet typography, open space and subtle foil accents."
  },
  {
    name: "Golden Night",
    nameAr: "ليلة ذهبية",
    image: "/assets/candle-table.webp",
    description: "Candlelight, black tie contrast and warm cinematic gold."
  },
  {
    name: "White & Gold",
    nameAr: "أبيض وذهبي",
    image: "/assets/wedding-hero.webp",
    description: "Classic white celebration style with champagne gold warmth."
  },
  {
    name: "Emerald Garden",
    nameAr: "حديقة الزمرد",
    image: "/assets/wedding-aisle.webp",
    description: "Garden ceremony atmosphere with forest green and candlelit depth."
  },
  {
    name: "Luxury Wedding Hall",
    nameAr: "قاعة فاخرة",
    image: "/assets/luxury-hall.webp",
    description: "Palace ballroom styling, chandeliers and royal ceremony grandeur."
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

export const gallery = [
  "/assets/luxury-hall.webp",
  "/assets/candle-table.webp",
  "/assets/floral-aisle-luxury.webp",
  "/assets/sunset-venue.webp",
  "/assets/wedding-aisle.webp",
  "/assets/wedding-hero.webp"
];

export const adminStats = [
  { label: "Invitations", value: "128", icon: CalendarDays },
  { label: "Confirmed Guests", value: "342", icon: Users },
  { label: "Gallery Uploads", value: "64", icon: Camera },
  { label: "Luxury Themes", value: "18", icon: Gem }
];

export const guests = [
  { name: "Nour Family", status: "Confirmed", seats: 5, table: "Emerald 01" },
  { name: "Omar Hassan", status: "Pending", seats: 2, table: "Gold 04" },
  { name: "Salma Atelier", status: "Confirmed", seats: 8, table: "Pearl 02" },
  { name: "Youssef Group", status: "Declined", seats: 3, table: "Noir 07" }
];
