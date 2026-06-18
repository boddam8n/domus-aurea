"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Copy, Music } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SafeImage } from "@/components/safe-image";
import { countdownStyles, invitationTemplates, pricingPlans } from "@/lib/data";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { invitationRequestSchema } from "@/lib/validation";

export default function DesignInvitationPage() {
  const router = useRouter();
  const [template, setTemplate] = useState(invitationTemplates[0].name);
  const [countdown, setCountdown] = useState(countdownStyles[0].name);
  const [pkg, setPkg] = useState(pricingPlans[1].name);
  const [musicName, setMusicName] = useState("wedding-music.mp3");
  const [form, setForm] = useState({
    brideName: "",
    groomName: "",
    weddingDate: "",
    venue: "",
    phone: ""
  });
  const [publicUrl, setPublicUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedTemplate = invitationTemplates.find((item) => item.name === template) ?? invitationTemplates[0];
  const selectedPackage = pricingPlans.find((item) => item.name === pkg) ?? pricingPlans[1];

  const payload = useMemo(
    () => ({
      ...form,
      templateName: template,
      packageName: selectedPackage.name,
      countdownStyle: countdown,
      musicFileName: musicName
    }),
    [countdown, form, musicName, selectedPackage.name, template]
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPublicUrl("");

    const parsed = invitationRequestSchema.safeParse(payload);
    if (!parsed.success) {
      setError(Object.values(parsed.error.flatten().fieldErrors).flat()[0] || "برجاء مراجعة بيانات الدعوة.");
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
      if (!response.ok) throw new Error(json.error || "لم يتم إنشاء الدعوة.");
      setPublicUrl(json.publicUrl);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <PageShell>
      <section className="px-4 py-32 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-gold">إنشاء دعوة</p>
            <h1 className="mt-5 font-display text-5xl leading-tight text-[var(--color-text)] md:text-7xl">
              اختر التصميم، أدخل البيانات، واستلم رابط الدعوة فورًا.
            </h1>
            <p className="mt-5 leading-8 text-[var(--color-muted)]">
              مسار بسيط لعملاء Domus Aurea: كل دعوة تحفظ في حسابك، ويظهر رابط عام جاهز للمشاركة مع الضيوف.
            </p>
          </div>

          <form onSubmit={submit} className="mt-12 grid gap-8 lg:grid-cols-[1fr_.82fr]">
            <div className="grid gap-8">
              <section className="glass rounded-[2.25rem] p-6">
                <h2 className="font-display text-3xl text-[var(--color-text)]">١. اختر شكل الدعوة</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {invitationTemplates.slice(0, 6).map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setTemplate(item.name)}
                      className={`group overflow-hidden rounded-[1.5rem] border text-right transition duration-300 hover:-translate-y-1 ${
                        template === item.name ? "border-gold shadow-glow" : "border-white/10"
                      }`}
                    >
                      <span className="relative block aspect-[4/3] overflow-hidden">
                        <SafeImage src={item.image} alt={item.name} fill fallbackLabel={item.nameAr} sizes="(min-width:1024px) 22vw, 50vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                      </span>
                      <span className="block p-4">
                        <span className="block font-bold text-[var(--color-text)]">{item.nameAr}</span>
                        <span className="mt-1 block text-sm leading-6 text-[var(--color-muted)]">{item.description}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="glass rounded-[2.25rem] p-6">
                <h2 className="font-display text-3xl text-[var(--color-text)]">٢. بيانات الزفاف</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    ["brideName", "اسم العروسة"],
                    ["groomName", "اسم العريس"],
                    ["weddingDate", "تاريخ ووقت الفرح"],
                    ["venue", "المكان"],
                    ["phone", "رقم واتساب"]
                  ].map(([key, label]) => (
                    <label key={key} className={key === "phone" ? "md:col-span-2" : ""}>
                      <span className="mb-2 block text-sm font-bold text-[var(--color-muted)]">{label}</span>
                      <input
                        value={form[key as keyof typeof form]}
                        onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-[var(--color-text)] outline-none transition focus:border-gold"
                        required
                      />
                    </label>
                  ))}
                </div>
              </section>

              <section className="glass rounded-[2.25rem] p-6">
                <h2 className="font-display text-3xl text-[var(--color-text)]">٣. الباقة والتفاصيل</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <span className="mb-2 block text-sm font-bold text-[var(--color-muted)]">الباقة</span>
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
                    <span className="mb-2 block text-sm font-bold text-[var(--color-muted)]">شكل العداد</span>
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
                    اسم ملف الموسيقى الاختياري
                  </span>
                  <input value={musicName} onChange={(event) => setMusicName(event.target.value)} className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-[var(--color-text)] outline-none" />
                </label>
              </section>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="paper-card rounded-[2.25rem] p-7 text-night">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                  <SafeImage src={selectedTemplate.image} alt="" fill fallbackLabel={selectedTemplate.nameAr} sizes="(min-width:1024px) 34vw, 100vw" className="object-cover" />
                </div>
                <p className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-[#9b7330]">مراجعة الدعوة</p>
                <h2 className="mt-3 font-display text-4xl text-[#24170f]">{selectedTemplate.nameAr}</h2>
                <div className="mt-5 space-y-2 text-sm leading-7 text-night/65">
                  <p>العروسة: {form.brideName || "-"}</p>
                  <p>العريس: {form.groomName || "-"}</p>
                  <p>التاريخ: {form.weddingDate || "-"}</p>
                  <p>الباقة: {selectedPackage.nameAr} - {selectedPackage.price}</p>
                  <p>العداد: {countdown}</p>
                </div>
                {error ? <p className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-900">{error}</p> : null}
                <button disabled={loading} className="mt-7 w-full rounded-full bg-night px-6 py-4 font-bold text-[#f7efe2] transition hover:bg-[#9b7330] disabled:opacity-60">
                  {loading ? "جاري إنشاء الرابط..." : "إنشاء الدعوة والرابط"}
                </button>
                {publicUrl ? (
                  <div className="mt-5 rounded-[1.5rem] border border-[#b8894b]/25 bg-white/55 p-4">
                    <p className="flex items-center gap-2 font-bold text-night">
                      <CheckCircle2 className="h-5 w-5 text-[#174c3f]" />
                      تم إنشاء الدعوة
                    </p>
                    <p className="mt-2 break-all text-sm leading-6 text-night/65">{publicUrl}</p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <button type="button" onClick={copyLink} className="rounded-full bg-[#174c3f] px-4 py-3 text-center text-sm font-bold text-white">
                        <Copy className="ml-1 inline h-4 w-4" />
                        {copied ? "تم النسخ" : "نسخ الرابط"}
                      </button>
                      <Link href="/dashboard" className="rounded-full border border-[#b8894b]/40 px-4 py-3 text-center text-sm font-bold text-night">
                        لوحة العميل
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            </aside>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
