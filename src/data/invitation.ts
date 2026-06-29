export type InvitationLanguage = "ar" | "en";

export type InvitationScheduleItem = {
  time: {
    ar: string;
    en: string;
  };
  title: {
    ar: string;
    en: string;
  };
};

export const invitationContent = {
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
  copy: {
    ar: {
      closedLabel: "دعوة زفاف",
      openHint: "اضغط على الختم لفتح الدعوة",
      heroLabel: "يوم الزفاف",
      bismillah: "بسم الله الرحمن الرحيم",
      opening: "تشرفت حكايتنا ببدايتها... ويشرّفها أن تكونوا شهودًا على أجمل فصولها.",
      formal: "يسرّنا دعوتكم لمشاركتنا حفل زفافنا، لتكتمل فرحتنا بحضوركم الكريم ودعواتكم الصادقة.",
      scrollHint: "مرّر للأسفل",
      countdownTitle: "يبدأ الاحتفال خلال",
      scheduleTitle: "برنامج الحفل",
      locationTitle: "المكان",
      mapTitle: "خريطة الوصول",
      openMaps: "فتح في الخرائط",
      dressTitle: "قواعد اللباس",
      dressValue: "رسمي / أنيق",
      rsvpTitle: "تأكيد الحضور",
      guestName: "اسم الضيف",
      accept: "قبول الدعوة",
      decline: "اعتذار",
      send: "إرسال",
      sending: "جاري الإرسال...",
      success: "تم تسجيل ردك بنجاح. شكرًا لمشاركتكم.",
      error: "حدث خطأ غير متوقع."
    },
    en: {
      closedLabel: "Save the Date",
      openHint: "Tap the seal to open the invitation",
      heroLabel: "Wedding Day",
      bismillah: "In the name of God, the Most Gracious, the Most Merciful",
      opening: "Our story begins with love, and it would be our honor to have you witness one of its most beautiful chapters.",
      formal: "We are delighted to invite you to celebrate our wedding day with us.",
      scrollHint: "Scroll down",
      countdownTitle: "The Celebration Begins In",
      scheduleTitle: "Wedding Schedule",
      locationTitle: "Location",
      mapTitle: "Map",
      openMaps: "Open in Maps",
      dressTitle: "Dress Code",
      dressValue: "Formal / Elegant",
      rsvpTitle: "RSVP",
      guestName: "Guest Name",
      accept: "Accept Invitation",
      decline: "Apologize",
      send: "Send",
      sending: "Sending...",
      success: "Your reply has been saved. Thank you.",
      error: "Something went wrong."
    }
  },
  event: {
    date: "2026-12-12T20:00:00+02:00",
    venue: {
      ar: "فندق ريتز كارلتون - القاهرة",
      en: "The Ritz-Carlton, Cairo"
    },
    address: {
      ar: "كورنيش النيل، القاهرة",
      en: "Nile Corniche, Cairo"
    },
    coordinates: {
      lat: 30.0444,
      lng: 31.2357
    }
  },
  schedule: [
    {
      time: { ar: "٥ مساءً", en: "5 PM" },
      title: { ar: "استقبال الضيوف", en: "Guest Arrival" }
    },
    {
      time: { ar: "٦ مساءً", en: "6 PM" },
      title: { ar: "مراسم الزفاف", en: "Ceremony" }
    },
    {
      time: { ar: "٧ مساءً", en: "7 PM" },
      title: { ar: "العشاء", en: "Dinner" }
    },
    {
      time: { ar: "٩ مساءً", en: "9 PM" },
      title: { ar: "بداية الاحتفال", en: "Celebration" }
    }
  ] satisfies InvitationScheduleItem[],
  countdownLabels: {
    ar: ["يوم", "ساعة", "دقيقة", "ثانية"],
    en: ["Days", "Hours", "Minutes", "Seconds"]
  }
};
