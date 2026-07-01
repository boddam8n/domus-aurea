export type InvitationLanguage = "ar" | "en";

export type LocalizedText = {
  ar: string;
  en: string;
};

export type VenueOption = {
  id: "palace" | "weddingHall" | "sea" | "mosque";
  name: LocalizedText;
  image: string;
};

export const invitationData = {
  invitationId: "demo-wedding-001",
  mainWebsiteUrl: "/",
  languageDefault: "en" as InvitationLanguage,
  couple: {
    groom: {
      ar: "أحمد",
      en: "Ahmed"
    },
    bride: {
      ar: "مايار",
      en: "Mayar"
    }
  },
  wedding: {
    dateISO: "2026-12-12T18:00:00+02:00",
    startTime: {
      ar: "6:00 PM",
      en: "6:00 PM"
    },
    endTime: {
      ar: "11:00 PM",
      en: "11:00 PM"
    }
  },
  venue: {
    selected: "weddingHall" as const,
    name: {
      ar: "قاعة جراند بالاس",
      en: "The Grand Palace"
    },
    address: {
      ar: "شارع الاحتفال ١٢٣، القاهرة، مصر",
      en: "123 Celebration Street, Cairo, Egypt"
    },
    mapUrl: "https://maps.google.com/?q=The%20Grand%20Palace%20Cairo"
  },
  venueOptions: [
    {
      id: "palace",
      name: { ar: "قصر", en: "Palace" },
      image: "/invitation/venue-palace.webp"
    },
    {
      id: "weddingHall",
      name: { ar: "قاعة زفاف", en: "Wedding Hall" },
      image: "/invitation/venue-wedding-hall.webp"
    },
    {
      id: "sea",
      name: { ar: "البحر", en: "Sea" },
      image: "/invitation/venue-sea.webp"
    },
    {
      id: "mosque",
      name: { ar: "مسجد", en: "Mosque" },
      image: "/invitation/venue-mosque.webp"
    }
  ] satisfies VenueOption[],
  copy: {
    ar: {
      languageLabel: "عربي",
      introSkip: "تخطي",
      heroLabel: "دعوة زفاف",
      heroText: "بكل حب وسرور\nندعوكم لمشاركتنا فرحة زفافنا",
      venueTitle: "المكان",
      venueSubtitle: "اختاروا المكان المثالي ليومنا الخاص",
      countdownTitle: "يومنا المميز",
      countdownLabels: ["يوم", "ساعة", "دقيقة", "ثانية"],
      weddingTimeTitle: "موعد الفرح",
      weddingTimeText: "من 6:00 PM إلى 11:00 PM",
      locationTitle: "المكان",
      openMaps: "فتح الخريطة",
      rsvpTitle: "تأكيد الحضور",
      rsvpSubtitle: "يسعدنا حضوركم ومشاركتكم فرحتنا",
      guestName: "اسم الضيف",
      accept: "قبول الدعوة",
      apologize: "اعتذار",
      send: "إرسال",
      sending: "جاري الإرسال...",
      successTitle: "شكرًا لتأكيد حضوركم",
      successBody: "نتطلع للاحتفال معكم.",
      error: "حدث خطأ غير متوقع. حاول مرة أخرى.",
      thankYou: "شكرًا لكم",
      thankYouBody: "وجودكم يزيد فرحتنا",
      backHome: "العودة إلى الموقع الرئيسي",
      designed: "صُممت بكل حب",
      copyright: "جميع الحقوق محفوظة © 2026"
    },
    en: {
      languageLabel: "EN",
      introSkip: "Skip",
      heroLabel: "Wedding Invitation",
      heroText: "Together with their families\nwe invite you to celebrate\nour wedding day",
      venueTitle: "Venue",
      venueSubtitle: "Choose the perfect place for our special day",
      countdownTitle: "Our Special Day",
      countdownLabels: ["Days", "Hours", "Minutes", "Seconds"],
      weddingTimeTitle: "Wedding Time",
      weddingTimeText: "From 6:00 PM to 11:00 PM",
      locationTitle: "Location",
      openMaps: "Open in Maps",
      rsvpTitle: "Confirm Your Attendance",
      rsvpSubtitle: "We would be honored to celebrate with you",
      guestName: "Guest Name",
      accept: "Accept Invitation",
      apologize: "Apologize",
      send: "Send",
      sending: "Sending...",
      successTitle: "Thank you for confirming",
      successBody: "We look forward to celebrating with you.",
      error: "Something went wrong. Please try again.",
      thankYou: "Thank You",
      thankYouBody: "Your presence will make our day even more special",
      backHome: "Back to Main Website",
      designed: "Designed with love",
      copyright: "All rights reserved © 2026"
    }
  }
};

export const invitationContent = {
  couple: invitationData.couple,
  copy: {
    ar: {
      closedLabel: "دعوة زفاف",
      openHint: "اضغط على الختم لفتح الدعوة",
      heroLabel: invitationData.copy.ar.heroLabel,
      bismillah: "بسم الله الرحمن الرحيم",
      opening: "تشرفت حكايتنا ببدايتها... ويشرّفها أن تكونوا شهودًا على أجمل فصولها.",
      formal: "يسرّنا دعوتكم لمشاركتنا حفل زفافنا، لتكتمل فرحتنا بحضوركم الكريم ودعواتكم الصادقة.",
      scrollHint: "مرّر للأسفل",
      countdownTitle: invitationData.copy.ar.countdownTitle,
      scheduleTitle: "برنامج الحفل",
      locationTitle: invitationData.copy.ar.locationTitle,
      mapTitle: "خريطة الوصول",
      openMaps: invitationData.copy.ar.openMaps,
      dressTitle: "قواعد اللباس",
      dressValue: "رسمي / أنيق",
      rsvpTitle: invitationData.copy.ar.rsvpTitle,
      guestName: invitationData.copy.ar.guestName,
      accept: invitationData.copy.ar.accept,
      decline: invitationData.copy.ar.apologize,
      send: invitationData.copy.ar.send,
      sending: invitationData.copy.ar.sending,
      success: invitationData.copy.ar.successTitle,
      error: invitationData.copy.ar.error
    },
    en: {
      closedLabel: "Save the Date",
      openHint: "Tap the seal to open the invitation",
      heroLabel: invitationData.copy.en.heroLabel,
      bismillah: "In the name of God, the Most Gracious, the Most Merciful",
      opening: "Our story begins with love, and it would be our honor to have you witness one of its most beautiful chapters.",
      formal: invitationData.copy.en.heroText,
      scrollHint: "Scroll down",
      countdownTitle: invitationData.copy.en.countdownTitle,
      scheduleTitle: "Wedding Schedule",
      locationTitle: invitationData.copy.en.locationTitle,
      mapTitle: "Map",
      openMaps: invitationData.copy.en.openMaps,
      dressTitle: "Dress Code",
      dressValue: "Formal / Elegant",
      rsvpTitle: invitationData.copy.en.rsvpTitle,
      guestName: invitationData.copy.en.guestName,
      accept: invitationData.copy.en.accept,
      decline: invitationData.copy.en.apologize,
      send: invitationData.copy.en.send,
      sending: invitationData.copy.en.sending,
      success: invitationData.copy.en.successTitle,
      error: invitationData.copy.en.error
    }
  },
  event: {
    date: invitationData.wedding.dateISO,
    venue: invitationData.venue.name,
    address: invitationData.venue.address,
    coordinates: {
      lat: 30.0444,
      lng: 31.2357
    }
  },
  schedule: [],
  countdownLabels: {
    ar: invitationData.copy.ar.countdownLabels,
    en: invitationData.copy.en.countdownLabels
  }
};
