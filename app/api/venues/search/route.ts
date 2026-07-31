import { NextRequest, NextResponse } from "next/server";
import { requestGooglePlaces } from "@/lib/google-places-server";
import { authenticateRequest } from "@/lib/request-auth";

type GoogleAutocompleteResponse = {
  suggestions?: Array<{
    placePrediction?: {
      placeId?: string;
      text?: { text?: string };
      structuredFormat?: {
        mainText?: { text?: string };
        secondaryText?: { text?: string };
      };
      distanceMeters?: number;
    };
  }>;
};

function isCoordinate(value: number, min: number, max: number) {
  return Number.isFinite(value) && value >= min && value <= max;
}

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth.error) return auth.error;

  const query = request.nextUrl.searchParams.get("q")?.trim();
  const sessionToken = request.nextUrl.searchParams.get("sessionToken")?.trim();
  const lat = Number(request.nextUrl.searchParams.get("lat"));
  const lng = Number(request.nextUrl.searchParams.get("lng"));
  const hasLocation = isCoordinate(lat, -90, 90) && isCoordinate(lng, -180, 180);

  if (!query || query.length < 3 || query.length > 120 || !sessionToken || sessionToken.length > 80) {
    return NextResponse.json({ venues: [] });
  }

  try {
    const body: Record<string, unknown> = {
      input: query,
      languageCode: "ar",
      sessionToken,
      includeQueryPredictions: false
    };

    if (hasLocation) {
      body.origin = { latitude: lat, longitude: lng };
      body.locationBias = {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 50000
        }
      };
    }

    const response = await requestGooglePlaces(
      "/places:autocomplete",
      { method: "POST", body: JSON.stringify(body) },
      [
        "suggestions.placePrediction.placeId",
        "suggestions.placePrediction.text.text",
        "suggestions.placePrediction.structuredFormat.mainText.text",
        "suggestions.placePrediction.structuredFormat.secondaryText.text",
        "suggestions.placePrediction.distanceMeters"
      ].join(",")
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Google Places search is unavailable." }, { status: 502 });
    }

    const result = (await response.json()) as GoogleAutocompleteResponse;
    const venues = (result.suggestions ?? [])
      .map((suggestion) => {
        const prediction = suggestion.placePrediction;
        if (!prediction?.placeId) return null;
        return {
          placeId: prediction.placeId,
          name: prediction.structuredFormat?.mainText?.text || prediction.text?.text || query,
          address: prediction.structuredFormat?.secondaryText?.text || prediction.text?.text || "",
          distanceMeters: prediction.distanceMeters ?? null
        };
      })
      .filter((venue): venue is NonNullable<typeof venue> => venue !== null);

    return NextResponse.json({ venues });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Venue search failed.";
    return NextResponse.json({ error: message }, { status: message.includes("not configured") ? 503 : 500 });
  }
}
