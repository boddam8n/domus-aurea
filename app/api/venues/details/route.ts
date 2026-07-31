import { NextRequest, NextResponse } from "next/server";
import { requestGooglePlaces } from "@/lib/google-places-server";
import { buildGoogleMapsUrl, type VerifiedVenue } from "@/lib/maps";
import { authenticateRequest } from "@/lib/request-auth";

type GooglePlaceDetailsResponse = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  googleMapsUri?: string;
};

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth.error) return auth.error;

  const placeId = request.nextUrl.searchParams.get("placeId")?.trim();
  const sessionToken = request.nextUrl.searchParams.get("sessionToken")?.trim();

  if (!placeId || placeId.length > 255 || !sessionToken || sessionToken.length > 80) {
    return NextResponse.json({ error: "Invalid place selection." }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({ languageCode: "ar", sessionToken });
    const response = await requestGooglePlaces(
      `/places/${encodeURIComponent(placeId)}?${params.toString()}`,
      { method: "GET" },
      "id,displayName,formattedAddress,location,googleMapsUri"
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Google Places details are unavailable." }, { status: 502 });
    }

    const place = (await response.json()) as GooglePlaceDetailsResponse;
    const name = place.displayName?.text?.trim();
    const address = place.formattedAddress?.trim();
    const lat = place.location?.latitude;
    const lng = place.location?.longitude;

    if (!place.id || !name || !address || typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json({ error: "The selected place has incomplete location details." }, { status: 422 });
    }

    const venue: VerifiedVenue = {
      placeId: place.id,
      name,
      address,
      lat,
      lng,
      mapsUrl: place.googleMapsUri || buildGoogleMapsUrl(name, address, lat, lng)
    };

    return NextResponse.json({ venue });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Venue details failed.";
    return NextResponse.json({ error: message }, { status: message.includes("not configured") ? 503 : 500 });
  }
}
