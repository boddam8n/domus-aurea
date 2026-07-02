"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Copy, ImagePlus, Lock, Music, Trash2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SafeImage } from "@/components/safe-image";
import { LuxuryInvitationMiniature } from "@/components/invitation-experience";
import { PlayPreviewButton, TemplatePreviewModal } from "@/components/template-preview-experience";
import { VenueAutocomplete } from "@/components/venue-autocomplete";
import { countdownStyles, invitationTemplates, pricingPlans } from "@/lib/data";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { invitationRequestSchema } from "@/lib/validation";

const launchTemplate = invitationTemplates.find((item) => item.status === "available") ?? invitationTemplates[invitationTemplates.length - 1];

export default function DesignInvitationPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(countdownStyles[0].name);
  const [pkg, setPkg] = useState(pricingPlans[1].name);
  const [musicName, setMusicName] = useState("wedding-music.mp3");
  const [form, setForm] = useState({
    brideName: "",
    groomName: "",
    weddingDate: "",
    venue: "",
    venueAddress: "",
    venueLat: undefined as number | undefined,
    venueLng: undefined as number | undefined,
    phone: "",
    sealImageUrl: ""
  });
  const [publicUrl, setPublicUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedPackage = pricingPlans.find((item) => item.name === pkg) ?? pricingPlans[1];
  const payload = useMemo(
    () => ({
      ...form,
      templateName: launchTemplate.name,
      packageName: selectedPackage.name,
      countdownStyle: countdown,
      musicFileName: musicName
    }),
    [countdown, form, musicName, selectedPackage.name]
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPublicUrl("");

    const parsed = invitationRequestSchema.safeParse(payload);
    if (!parsed.success) {
      setError(Object.values(parsed.error.flatten().fieldErrors).flat()[0] || "????? ?????? ?????? ??????.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth/sign-in?next=/design");
        return;
      }

      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`
        },
        body: JSON.stringify(parsed.data)
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "?? ??? ????? ??????.");
      setPublicUrl(json.publicUrl);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "??? ??? ??? ?????.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function handleSealUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");

    if (file.type !== "image/png") {
      setError("?? ???? ???? ???? ??? ????? PNG ???? ????? ?????? ?????.");
      event.target.value = "";
      return;
    }

    if (file.size > 620 * 1024) {
      setError("???? ????? ????? ????. ?????? ?? ???? ??? ?? 620KB ?????? ??? ???? ??????.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, sealImageUrl: typeof reader.result === "string" ? reader.result : "" }));
    };
    reader.onerror = () => setError("?? ????? ?? ????? ???? ?????. ???? ???? PNG ????.");
    reader.readAsDataURL(file);
  }

  return (
    <PageShell>
      <section className="px-4 py-32 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-gold">????? ????</p>
            <h1 className="mt-5 font-display text-5xl leading-tight text-[var(--color-text)] md:text-7xl">
              ???? ???? ???? ????? ????? ???????.
            </h1>
            <p className="mt-5 leading-8 text-[var(--color-muted)]">
              ???? ?????? ??????? ???? ??????? ????? ????? ?????? ?? ????. ??? ????? ????? ???? ??? ???? ???????? ?????.
            </p>
          </div>

          <form onSubmit={submit} className="mt-12 grid gap-8 lg:grid-cols-[1fr_.82fr]">
            <div className="grid gap-8">
              <section className="glass rounded-[2.25rem] p-6">
                <h2 className="font-display text-3xl text-[var(--color-text)]">?. ???? ??????</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {invitationTemplates.map((item) =>
                    item.status === "available" ? (
                      <div key={item.name} className="group overflow-hidden rounded-[1.5rem] border border-gold shadow-glow text-right">
                        <button type="button" onClick={() => setPreviewOpen(true)} className="block w-full text-right">
                          <span className="relative block aspect-[4/3] overflow-hidden bg-[#fff2ee] p-3">
                            <SafeImage
                              src={item.image}
                              alt={item.name}
                              fill
                              fallbackLabel={item.nameAr}
                              sizes="(min-width:1024px) 22vw, 50vw"
                              className="object-contain transition duration-700 group-hover:scale-[1.015]"
                            />
                          </span>
                          <span className="block p-4">
                            <span className="flex items-center justify-between gap-3">
                              <span className="font-bold text-[var(--color-text)]">{item.nameAr}</span>
                              <span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">Selected</span>
                            </span>
                            <span className="mt-2 block text-sm leading-6 text-[var(--color-muted)]">{item.description}</span>
                          </span>
                        </button>
                        <div className="px-4 pb-4">
                          <PlayPreviewButton onClick={() => setPreviewOpen(true)} isArabic />
                        </div>
                      </div>
                    ) : (
                      <div key={item.name} className="relative overflow-hidden rounded-[1.5rem] border border-white/10 text-right opacity-80">
                        <span className="relative block aspect-[4/3] overflow-hidden bg-[#e8dfcf]">
                          <SafeImage src={item.image} alt={item.name} fill fallbackLabel={item.nameAr} sizes="(min-width:1024px) 22vw, 50vw" className="object-contain grayscale-[.2]" />
                          <span className="absolute inset-0 bg-black/50" />
                          <span className="absolute inset-x-4 bottom-4 inline-flex items-center justify-center gap-2 rounded-full border border-[#d8b15f]/30 bg-black/45 px-4 py-2 text-xs font-bold text-[#f7efe2] backdrop-blur-md">
                            <Lock className="h-3.5 w-3.5 text-gold" />
                            ??? ???????
                          </span>
                        </span>
                        <span className="block p-4">
                          <span className="block font-bold text-[var(--color-text)]">{item.nameAr}</span>
                          <span className="mt-1 block text-sm leading-6 text-[var(--color-muted)]">??????? ???? ???? ???????? ????.</span>
                        </span>
                      </div>
                    )
                  )}
                </div>
              </section>

              <section className="glass rounded-[2.25rem] p-6">
                <h2 className="font-display text-3xl text-[var(--color-text)]">?. ?????? ??????</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <TextField label="??? ???????" value={form.brideName} onChange={(value) => setForm((current) => ({ ...current, brideName: value }))} />
                  <TextField label="??? ??????" value={form.groomName} onChange={(value) => setForm((current) => ({ ...current, groomName: value }))} />
                  <TextField label="????? ???? ?????" type="datetime-local" value={form.weddingDate} onChange={(value) => setForm((current) => ({ ...current, weddingDate: value }))} />
                  <TextField label="??? ??????" value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} />
                  <VenueAutocomplete
                    value={{
                      name: form.venue,
                      address: form.venueAddress,
                      lat: form.venueLat,
                      lng: form.venueLng
                    }}
                    onChange={(venue) =>
                      setForm((current) => ({
                        ...current,
                        venue: venue.name,
                        venueAddress: venue.address || "",
                        venueLat: venue.lat,
                        venueLng: venue.lng
                      }))
                    }
                  />
                </div>
              </section>

              <section className="glass rounded-[2.25rem] p-6">
                <h2 className="font-display text-3xl text-[var(--color-text)]">?. ????? ?????????</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <span className="mb-2 block text-sm font-bold text-[var(--color-muted)]">??????</span>
                    <div className="grid gap-2">
                      {pricingPlans.map((plan) => (
                        <button key={plan.name} type="button" onClick={() => setPkg(plan.name)} className={`rounded-2xl border px-4 py-3 text-right transition ${pkg === plan.name ? "border-gold bg-gold/10" : "border-white/10 hover:bg-white/10"}`}>
                          <span className="font-bold text-[var(--color-text)]">{plan.nameAr}</span>
                          <span className="mr-2 text-gold">{plan.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="mb-2 block text-sm font-bold text-[var(--color-muted)]">??? ??????</span>
                    <div className="grid gap-2">
                      {countdownStyles.map((style) => (
                        <button key={style.name} type="button" onClick={() => setCountdown(style.name)} className={`rounded-2xl border px-4 py-3 text-right transition ${countdown === style.name ? "border-gold bg-gold/10" : "border-white/10 hover:bg-white/10"}`}>
                          <span className="font-bold text-[var(--color-text)]">{style.name}</span>
                          <span className="mt-1 block text-sm text-[var(--color-muted)]">{style.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <label className="mt-6 grid gap-2 rounded-[1.5rem] border border-gold/20 bg-black/10 p-5">
                  <span className="flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
                    <Music className="h-4 w-4 text-gold" />
                    ??? ??? ???????? ?????????
                  </span>
                  <input value={musicName} onChange={(event) => setMusicName(event.target.value)} className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-[var(--color-text)] outline-none" />
                </label>

                <div className="mt-6 rounded-[1.5rem] border border-gold/20 bg-black/10 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="block text-sm font-bold uppercase tracking-[0.16em] text-gold">Wax Seal</span>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">???? ????? ?????? ????? PNG ?????? ????? ????? ?? ????? ????? ??????.</p>
                    </div>
                    <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-gold/40 bg-[radial-gradient(circle_at_30%_25%,#fff1f0,#d89588_48%,#8f5d55)] shadow-[0_14px_38px_rgba(0,0,0,.18)]">
                      {form.sealImageUrl ? (
                        <img src={form.sealImageUrl} alt="Wax seal preview" className="h-full w-full object-contain p-1.5" />
                      ) : (
                        <span className="font-display text-xl text-[#fff7ee]">DA</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                    <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-[1.2rem] border border-dashed border-gold/40 bg-white/[0.035] px-5 py-5 text-center transition hover:border-gold hover:bg-gold/10">
                      <input type="file" accept="image/png" onChange={handleSealUpload} className="sr-only" />
                      <ImagePlus className="h-6 w-6 text-gold" />
                      <span className="mt-2 text-sm font-bold text-[var(--color-text)]">Upload custom stamp</span>
                      <span className="mt-1 text-xs text-[var(--color-muted)]">PNG transparent background, max 620KB</span>
                    </label>
                    {form.sealImageUrl ? (
                      <button
                        type="button"
                        onClick={() => setForm((current) => ({ ...current, sealImageUrl: "" }))}
                        className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] border border-red-300/30 px-5 py-4 text-sm font-bold text-red-200 transition hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        ????? ?????
                      </button>
                    ) : null}
                  </div>
                </div>
              </section>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="paper-card rounded-[2.25rem] p-7 text-night">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#fff2ee]">
                  <LuxuryInvitationMiniature />
                </div>
                <p className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-[#9b7330]">?????? ??????</p>
                <h2 className="mt-3 font-display text-4xl text-[#24170f]">{launchTemplate.nameAr}</h2>
                <div className="mt-5 space-y-2 text-sm leading-7 text-night/65">
                  <p>???????: {form.brideName || "-"}</p>
                  <p>??????: {form.groomName || "-"}</p>
                  <p>???????: {form.weddingDate || "-"}</p>
                  <p>??????: {form.venue || "-"}</p>
                  <p>??????: {selectedPackage.nameAr} - {selectedPackage.price}</p>
                  <p>??????: {countdown}</p>
                </div>
                {error ? <p className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-900">{error}</p> : null}
                <button disabled={loading} className="mt-7 w-full rounded-full bg-night px-6 py-4 font-bold text-[#f7efe2] transition hover:bg-[#9b7330] disabled:opacity-60">
                  {loading ? "???? ????? ??????..." : "????? ?????? ???????"}
                </button>
                {publicUrl ? (
                  <div className="mt-5 rounded-[1.5rem] border border-[#b8894b]/25 bg-white/55 p-4">
                    <p className="flex items-center gap-2 font-bold text-night">
                      <CheckCircle2 className="h-5 w-5 text-[#174c3f]" />
                      ?? ????? ??????
                    </p>
                    <p className="mt-2 break-all text-sm leading-6 text-night/65">{publicUrl}</p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <button type="button" onClick={copyLink} className="rounded-full bg-[#174c3f] px-4 py-3 text-center text-sm font-bold text-white">
                        <Copy className="ml-1 inline h-4 w-4" />
                        {copied ? "?? ?????" : "??? ??????"}
                      </button>
                      <Link href="/dashboard" className="rounded-full border border-[#b8894b]/40 px-4 py-3 text-center text-sm font-bold text-night">
                        ???? ??????
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            </aside>
          </form>
        </div>
      </section>

      <TemplatePreviewModal
        isOpen={previewOpen}
        templateName={launchTemplate.name}
        onClose={() => setPreviewOpen(false)}
        sample={{
          brideName: form.brideName || "?????",
          groomName: form.groomName || "????",
          date: form.weddingDate || "12 December 2026",
          venue: form.venue || "???? ???? ??????? - ???????",
          message: "??? ???? ???????? ?????? ????? ??? ?????? ????????? ???? ????? ?????.",
          musicSrc: musicName ? `/audio/${musicName}` : "/audio/wedding-music.mp3",
          sealImageUrl: form.sealImageUrl
        }}
      />
    </PageShell>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-bold text-[var(--color-muted)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-[var(--color-text)] outline-none transition focus:border-gold"
        required
      />
    </label>
  );
}
