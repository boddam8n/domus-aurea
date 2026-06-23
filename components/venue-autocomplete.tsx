"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, LocateFixed, MapPin, Search } from "lucide-react";

export type VenueSelection = {
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
};

type VenueOption = {
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  distanceKm: number | null;
  importance: number;
};

type VenueAutocompleteProps = {
  value: VenueSelection;
  onChange: (value: VenueSelection) => void;
};

export function VenueAutocomplete({ value, onChange }: VenueAutocompleteProps) {
  const [query, setQuery] = useState(value.name);
  const [options, setOptions] = useState<VenueOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setQuery(value.name);
  }, [value.name]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setOptions([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ q: trimmed });
        if (location) {
          params.set("lat", String(location.lat));
          params.set("lng", String(location.lng));
        }
        const response = await fetch(`/api/venues/search?${params.toString()}`, { signal: controller.signal });
        const json = await response.json();
        setOptions(response.ok ? json.venues ?? [] : []);
        setIsOpen(true);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setOptions([]);
        }
      } finally {
        setLoading(false);
      }
    }, 420);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, location]);

  const mapUrl = useMemo(() => {
    if (typeof value.lat !== "number" || typeof value.lng !== "number") return "";
    const lat = value.lat;
    const lng = value.lng;
    const delta = 0.012;
    const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  }, [value.lat, value.lng]);

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("الموقع غير مدعوم في هذا المتصفح.");
      return;
    }

    setLocationStatus("جاري تحديد الموقع التقريبي...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationStatus("تم استخدام موقعك لترتيب النتائج الأقرب أولًا.");
      },
      () => setLocationStatus("لم نتمكن من استخدام الموقع. البحث سيعمل بدون ترتيب بالمسافة."),
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 1000 * 60 * 20 }
    );
  }

  return (
    <div className="relative md:col-span-2">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="block text-sm font-bold text-[var(--color-muted)]">المكان</span>
        <button type="button" onClick={requestLocation} className="inline-flex items-center gap-2 rounded-full border border-gold/20 px-3 py-1.5 text-xs font-bold text-gold transition hover:bg-gold hover:text-night">
          <LocateFixed className="h-3.5 w-3.5" />
          استخدم موقعي
        </button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
        <input
          value={query}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 180)}
          onChange={(event) => {
            const next = event.target.value;
            setQuery(next);
            onChange({ name: next });
          }}
          onFocus={() => {
            if (options.length) setIsOpen(true);
          }}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-4 pl-5 pr-11 text-[var(--color-text)] outline-none transition focus:border-gold"
          placeholder="اكتب اسم القاعة أو الفندق"
          required
        />
        {loading ? <Loader2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gold" /> : null}
      </div>

      {isOpen && options.length ? (
        <div className="absolute z-30 mt-3 max-h-80 w-full overflow-y-auto rounded-[1.25rem] border border-gold/20 bg-[#120f0b]/95 p-2 text-right shadow-[0_26px_80px_rgba(0,0,0,.38)] backdrop-blur-xl">
          {options.map((option) => (
            <button
              key={`${option.lat}-${option.lng}-${option.address}`}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setQuery(option.name);
                setIsOpen(false);
                onChange({
                  name: option.name,
                  address: option.address,
                  lat: typeof option.lat === "number" ? option.lat : undefined,
                  lng: typeof option.lng === "number" ? option.lng : undefined
                });
              }}
              className="block w-full rounded-2xl px-4 py-3 text-right transition hover:bg-white/10"
            >
              <span className="flex items-center gap-2 font-bold text-[#f7efe2]">
                <MapPin className="h-4 w-4 text-gold" />
                {option.name}
              </span>
              <span className="mt-1 block text-sm leading-6 text-[#f7efe2]/58">{option.address}</span>
              {option.distanceKm !== null ? <span className="mt-1 block text-xs text-gold">{option.distanceKm.toFixed(1)} كم تقريبًا</span> : null}
            </button>
          ))}
        </div>
      ) : null}

      {locationStatus ? <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]">{locationStatus}</p> : null}

      {value.address ? (
        <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-gold/20 bg-black/10">
          <div className="p-4">
            <p className="font-bold text-[var(--color-text)]">{value.name}</p>
            <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">{value.address}</p>
          </div>
          {mapUrl ? <iframe title="Venue map preview" src={mapUrl} className="h-56 w-full border-0" loading="lazy" /> : null}
        </div>
      ) : null}
    </div>
  );
}
