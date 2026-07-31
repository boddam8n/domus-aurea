import "server-only";

const GOOGLE_PLACES_BASE_URL = "https://places.googleapis.com/v1";

export function getGoogleMapsApiKey() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Google Maps Places is not configured.");
  }
  return apiKey;
}

export async function requestGooglePlaces(path: string, init: RequestInit, fieldMask: string) {
  return fetch(`${GOOGLE_PLACES_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": getGoogleMapsApiKey(),
      "X-Goog-FieldMask": fieldMask,
      ...init.headers
    }
  });
}
