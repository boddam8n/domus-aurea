import { NextRequest, NextResponse } from "next/server";

type NominatimPlace = {
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  importance?: number;
  type?: string;
};

function distanceKm(latA: number, lngA: number, latB: number, lngB: number) {
  const radius = 6371;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(latB - latA);
  const dLng = toRad(lngB - lngA);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(latA)) * Math.cos(toRad(latB)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  const lat = Number(request.nextUrl.searchParams.get("lat"));
  const lng = Number(request.nextUrl.searchParams.get("lng"));
  const hasLocation = Number.isFinite(lat) && Number.isFinite(lng);

  if (!query || query.length < 2) {
    return NextResponse.json({ venues: [] });
  }

  try {
    const params = new URLSearchParams({
      q: query,
      format: "jsonv2",
      addressdetails: "1",
      limit: "8"
    });

    if (hasLocation) {
      const delta = 0.7;
      params.set("viewbox", [lng - delta, lat + delta, lng + delta, lat - delta].join(","));
      params.set("bounded", "0");
    }

    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
      headers: {
        "Accept-Language": "ar,en",
        "User-Agent": "DomusAureaWeddingPlatform/1.0 (venue-search)"
      },
      next: { revalidate: 60 * 60 }
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Venue search provider is unavailable." }, { status: 502 });
    }

    const places = (await response.json()) as NominatimPlace[];
    const venues = places
      .map((place) => {
        const venueLat = Number(place.lat);
        const venueLng = Number(place.lon);
        const distance = hasLocation && Number.isFinite(venueLat) && Number.isFinite(venueLng) ? distanceKm(lat, lng, venueLat, venueLng) : null;

        return {
          name: place.name || place.display_name.split(",")[0] || query,
          address: place.display_name,
          lat: venueLat,
          lng: venueLng,
          distanceKm: distance,
          importance: place.importance ?? 0,
          type: place.type
        };
      })
      .filter((venue) => Number.isFinite(venue.lat) && Number.isFinite(venue.lng))
      .sort((a, b) => {
        if (a.distanceKm !== null && b.distanceKm !== null) {
          const diff = a.distanceKm - b.distanceKm;
          if (Math.abs(diff) > 0.2) return diff;
        }
        return b.importance - a.importance;
      });

    if (!venues.length) {
      return NextResponse.json({
        venues: [
          {
            name: query,
            address: "لم نجد نتيجة مؤكدة. يمكنك حفظ اسم المكان يدويًا وإضافة العنوان لاحقًا.",
            lat: null,
            lng: null,
            distanceKm: null,
            importance: 0,
            type: "manual"
          }
        ]
      });
    }

    return NextResponse.json({ venues });
  } catch {
    return NextResponse.json({ error: "Venue search failed." }, { status: 500 });
  }
}
