export type VerifiedVenue = {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  mapsUrl: string;
};

export function buildGoogleMapsUrl(name: string, address: string, lat?: number | null, lng?: number | null) {
  const query =
    typeof lat === "number" && typeof lng === "number"
      ? `${lat},${lng}`
      : [name, address].filter(Boolean).join(", ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function buildGoogleMapsEmbedUrl(lat?: number | null, lng?: number | null) {
  if (typeof lat !== "number" || typeof lng !== "number") return "";
  return `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
}
