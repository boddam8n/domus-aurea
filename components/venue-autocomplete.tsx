"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CheckCircle2, ExternalLink, Loader2, LocateFixed, MapPin, Search } from "lucide-react";
import { getVenuePreviewImage, type VerifiedVenue } from "@/lib/maps";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export type VenueSelection = Partial<VerifiedVenue>;

type VenueOption = {
  placeId: string;
  name: string;
  address: string;
  distanceMeters: number | null;
};

type VenueAutocompleteProps = {
  value: VenueSelection;
  onChange: (value: VenueSelection) => void;
};

function createSessionToken() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function VenueAutocomplete({ value, onChange }: VenueAutocompleteProps) {
  const listboxId = useId();
  const sessionToken = useRef(createSessionToken());
  const [query, setQuery] = useState(value.name ?? "");
  const [options, setOptions] = useState<VenueOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (value.placeId && value.name) setQuery(value.name);
  }, [value.name, value.placeId]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3 || value.placeId) {
      setOptions([]);
      setLoading(false);
      setIsOpen(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setFeedback("");

      try {
        const supabase = createBrowserSupabaseClient();
        const { data } = await supabase.auth.getSession();
        if (!data.session) throw new Error("سجّل الدخول أولًا للبحث عن مكان الحفل.");

        const params = new URLSearchParams({
          q: trimmed,
          sessionToken: sessionToken.current
        });
        if (location) {
          params.set("lat", String(location.lat));
          params.set("lng", String(location.lng));
        }

        const response = await fetch(`/api/venues/search?${params.toString()}`, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${data.session.access_token}`
          }
        });
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.error || "تعذر البحث في الأماكن الآن.");
        }

        setOptions(json.venues ?? []);
        setIsOpen(true);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setOptions([]);
          setIsOpen(true);
          setFeedback(error instanceof Error ? error.message : "تعذر البحث في الأماكن الآن.");
        }
      } finally {
        setLoading(false);
      }
    }, 480);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [location, query, value.placeId]);

  const previewImage = useMemo(
    () => getVenuePreviewImage(value.venueType, value.name, value.address),
    [value.address, value.name, value.venueType]
  );

  const isVerified = Boolean(
    value.placeId &&
      value.name &&
      value.address &&
      typeof value.lat === "number" &&
      typeof value.lng === "number" &&
      value.mapsUrl
  );

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("الموقع غير مدعوم في هذا المتصفح.");
      return;
    }

    setLocationStatus("جاري تحديد موقعك التقريبي...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationStatus("تم ترتيب نتائج Google Places بالاعتماد على موقعك التقريبي.");
      },
      () => setLocationStatus("تعذر استخدام موقعك، لكن البحث سيظل متاحًا."),
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 1000 * 60 * 20 }
    );
  }

  async function selectVenue(option: VenueOption) {
    setSelecting(true);
    setFeedback("");

    try {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase.auth.getSession();
      if (!data.session) throw new Error("سجّل الدخول أولًا لتأكيد مكان الحفل.");

      const params = new URLSearchParams({
        placeId: option.placeId,
        sessionToken: sessionToken.current
      });
      const response = await fetch(`/api/venues/details?${params.toString()}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${data.session.access_token}`
        }
      });
      const json = await response.json();

      if (!response.ok || !json.venue) {
        throw new Error(json.error || "تعذر تأكيد بيانات هذا المكان.");
      }

      const venue = json.venue as VerifiedVenue;
      setQuery(venue.name);
      setOptions([]);
      setIsOpen(false);
      onChange(venue);
      sessionToken.current = createSessionToken();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "تعذر تأكيد بيانات هذا المكان.");
    } finally {
      setSelecting(false);
    }
  }

  return (
    <div className="relative md:col-span-2">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="block text-sm font-bold text-[var(--color-muted)]">مكان الحفل</span>
        <button
          type="button"
          onClick={requestLocation}
          className="inline-flex items-center gap-2 rounded-full border border-gold/20 px-3 py-1.5 text-xs font-bold text-gold transition hover:bg-gold hover:text-night"
        >
          <LocateFixed className="h-3.5 w-3.5" />
          استخدم موقعي
        </button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
        <input
          value={query}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-invalid={query.length > 0 && !isVerified}
          autoComplete="off"
          onBlur={() => window.setTimeout(() => setIsOpen(false), 180)}
          onChange={(event) => {
            setQuery(event.target.value);
            setFeedback("");
            if (value.placeId) onChange({});
          }}
          onFocus={() => {
            if (options.length || feedback) setIsOpen(true);
          }}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-4 pl-12 pr-11 text-[var(--color-text)] outline-none transition focus:border-gold"
          placeholder="ابحث باسم القاعة أو الفندق ثم اختر نتيجة موثقة"
          required
        />
        {loading || selecting ? (
          <Loader2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gold" />
        ) : isVerified ? (
          <CheckCircle2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
        ) : null}
      </div>

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-30 mt-3 max-h-80 w-full overflow-y-auto rounded-[1.25rem] border border-gold/20 bg-[#120f0b]/[0.98] p-2 text-right shadow-[0_26px_80px_rgba(0,0,0,.38)] backdrop-blur-xl"
        >
          {options.length ? (
            options.map((option) => (
              <button
                key={option.placeId}
                role="option"
                aria-selected="false"
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectVenue(option)}
                className="block w-full rounded-2xl px-4 py-3 text-right transition hover:bg-white/10 focus:bg-white/10 focus:outline-none"
              >
                <span className="flex items-center gap-2 font-bold text-[#f7efe2]">
                  <MapPin className="h-4 w-4 shrink-0 text-gold" />
                  {option.name}
                </span>
                <span className="mt-1 block text-sm leading-6 text-[#f7efe2]/58">{option.address}</span>
                {typeof option.distanceMeters === "number" && option.distanceMeters > 0 ? (
                  <span className="mt-1 block text-xs text-gold">
                    {(option.distanceMeters / 1000).toFixed(1)} كم تقريبًا
                  </span>
                ) : null}
              </button>
            ))
          ) : (
            <p className="px-4 py-5 text-sm leading-6 text-[#f7efe2]/65">
              {feedback || "لا توجد نتائج موثقة. جرّب كتابة اسم المكان والعنوان بصورة أدق."}
            </p>
          )}
          <div className="flex justify-end border-t border-white/10 px-3 pb-1 pt-3">
            <Image
              src="/assets/vendor/powered-by-google.png"
              alt="Powered by Google"
              width={120}
              height={15}
              className="h-auto w-[120px]"
            />
          </div>
        </div>
      ) : null}

      <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]">
        اختر نتيجة من Google Places. لا يمكن حفظ عنوان مكتوب يدويًا أو غير موثّق.
      </p>
      {locationStatus ? <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">{locationStatus}</p> : null}
      {feedback && !isOpen ? <p className="mt-2 text-xs leading-5 text-red-300">{feedback}</p> : null}

      {isVerified ? (
        <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-gold/20 bg-black/10">
          <div className="flex items-start justify-between gap-4 p-4">
            <div>
              <p className="flex items-center gap-2 font-bold text-[var(--color-text)]">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                {value.name}
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">{value.address}</p>
            </div>
            <a
              href={value.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-gold"
            >
              Google Maps
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          {previewImage ? (
            <div className="relative aspect-[16/7] w-full overflow-hidden border-t border-gold/15">
              <Image
                src={previewImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
