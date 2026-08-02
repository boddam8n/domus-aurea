export type VerifiedVenue = {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  mapsUrl: string;
  venueType?: string;
};

const venuePreviewImages: Array<{ types: string[]; image: string }> = [
  {
    types: ["hotel", "lodging", "resort_hotel"],
    image: "/invitation/venue-palace.webp"
  },
  {
    types: ["wedding_venue", "event_venue", "banquet_hall", "convention_center"],
    image: "/invitation/venue-wedding-hall.webp"
  },
  {
    types: ["beach"],
    image: "/invitation/venue-sea.webp"
  },
  {
    types: ["park", "garden", "campground"],
    image: "/assets/sunset-venue.webp"
  },
  {
    types: ["mosque", "place_of_worship"],
    image: "/invitation/venue-mosque.webp"
  }
];

export function getVenuePreviewImage(venueType?: string | null, name = "", address = "") {
  const normalizedType = venueType?.trim().toLowerCase() || "";
  const normalizedText = `${name} ${address}`.toLowerCase();

  const directMatch = venuePreviewImages.find(({ types }) => types.includes(normalizedType));
  if (directMatch) return directMatch.image;

  const keywordGroups: Array<{ keywords: string[]; image: string }> = [
    { keywords: ["hotel", "resort", "فندق", "منتجع"], image: "/invitation/venue-palace.webp" },
    { keywords: ["wedding hall", "banquet", "event venue", "قاعة", "قاعه"], image: "/invitation/venue-wedding-hall.webp" },
    { keywords: ["beach", "sea", "شاطئ", "بحر"], image: "/invitation/venue-sea.webp" },
    { keywords: ["garden", "park", "حديقة", "حديقه"], image: "/assets/sunset-venue.webp" },
    { keywords: ["mosque", "مسجد"], image: "/invitation/venue-mosque.webp" }
  ];

  return keywordGroups.find(({ keywords }) => keywords.some((keyword) => normalizedText.includes(keyword)))?.image || null;
}

export function buildGoogleMapsUrl(name: string, address: string, lat?: number | null, lng?: number | null) {
  const query =
    typeof lat === "number" && typeof lng === "number"
      ? `${lat},${lng}`
      : [name, address].filter(Boolean).join(", ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
