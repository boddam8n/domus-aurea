"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChart3, Check, Copy, Eye, Link2, Plus, Users, X } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { DashboardInvitation } from "@/lib/invitations";

export default function DashboardPage() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<DashboardInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    async function load() {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          router.push("/auth/sign-in?next=/dashboard");
          return;
        }
        const response = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${data.session.access_token}` }
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || "Dashboard failed to load.");
        setInvitations(json.invitations);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unexpected dashboard error.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function copyLink(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    window.setTimeout(() => setCopied(""), 1600);
  }

  const totals = invitations.reduce(
    (acc, item) => ({
      views: acc.views + item.total_views,
      unique: acc.unique + item.unique_visitors,
      accepted: acc.accepted + item.accepted_guests,
      declined: acc.declined + item.declined_guests
    }),
    { views: 0, unique: 0, accepted: 0, declined: 0 }
  );

  return (
    <PageShell>
      <section className="px-4 py-32 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-gold">لوحة العميل</p>
              <h1 className="mt-4 font-display text-5xl text-[var(--color-text)] md:text-7xl">دعواتك وتحليلات الحضور</h1>
            </div>
            <Link href="/design" className="rounded-full bg-[var(--color-text)] px-6 py-4 text-center font-bold text-[var(--color-bg)] transition hover:bg-gold">
              <Plus className="ml-2 inline h-4 w-4" />
              إنشاء دعوة
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              { label: "إجمالي المشاهدات", value: totals.views, icon: Eye },
              { label: "زوار مختلفون", value: totals.unique, icon: Users },
              { label: "قبول", value: totals.accepted, icon: Check },
              { label: "اعتذار", value: totals.declined, icon: X }
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-[2rem] p-6">
                <stat.icon className="h-6 w-6 text-gold" />
                <strong className="mt-5 block font-display text-4xl text-[var(--color-text)]">{stat.value}</strong>
                <span className="text-[var(--color-muted)]">{stat.label}</span>
              </div>
            ))}
          </div>

          {loading ? <p className="mt-10 text-[var(--color-muted)]">جاري تحميل الدعوات...</p> : null}
          {error ? <p className="mt-10 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-100">{error}</p> : null}
          {!loading && !error && invitations.length === 0 ? (
            <div className="glass mt-10 rounded-[2rem] p-8 text-center">
              <BarChart3 className="mx-auto h-10 w-10 text-gold" />
              <h2 className="mt-4 font-display text-4xl text-[var(--color-text)]">لا توجد دعوات بعد</h2>
              <p className="mx-auto mt-3 max-w-xl text-[var(--color-muted)]">ابدأ بإنشاء دعوة، وسيظهر هنا الرابط العام والتحليلات وردود الضيوف.</p>
            </div>
          ) : null}

          <div className="mt-8 grid gap-6">
            {invitations.map((invitation) => {
              const url = invitation.public_url || `${origin}/invitation/${invitation.slug}`;
              return (
                <article key={invitation.id} className="glass rounded-[2rem] p-5 md:p-7">
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">{invitation.template_name}</p>
                      <h2 className="mt-3 font-display text-4xl text-[var(--color-text)]">{invitation.bride_name} و {invitation.groom_name}</h2>
                      <p className="mt-2 text-[var(--color-muted)]">{invitation.wedding_date} - {invitation.venue}</p>
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Link href={`/invitation/${invitation.slug}`} className="rounded-full border border-white/12 px-5 py-3 text-center font-bold text-[var(--color-text)]">
                          <Link2 className="ml-2 inline h-4 w-4" />
                          فتح الدعوة
                        </Link>
                        <button onClick={() => copyLink(url)} className="rounded-full bg-gold px-5 py-3 font-bold text-night">
                          <Copy className="ml-2 inline h-4 w-4" />
                          {copied === url ? "تم النسخ" : "نسخ الرابط"}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4 lg:min-w-[420px]">
                      {[
                        ["مشاهدات", invitation.total_views],
                        ["زوار", invitation.unique_visitors],
                        ["قبول", invitation.accepted_guests],
                        ["اعتذار", invitation.declined_guests]
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl bg-white/[0.06] p-4">
                          <strong className="block font-display text-3xl text-[var(--color-text)]">{value}</strong>
                          <span className="text-xs text-[var(--color-muted)]">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
                    <div className="grid grid-cols-3 bg-white/[0.06] px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      <span>الضيف</span>
                      <span>الرد</span>
                      <span>التاريخ</span>
                    </div>
                    {invitation.guest_responses.length ? invitation.guest_responses.map((guest) => (
                      <div key={guest.id} className="grid grid-cols-3 border-t border-white/10 px-4 py-4 text-sm">
                        <span className="font-bold text-[var(--color-text)]">{guest.guest_name}</span>
                        <span className="text-gold">{guest.response === "accepted" ? "قبول" : "اعتذار"}</span>
                        <span className="text-[var(--color-muted)]">{new Date(guest.created_at).toLocaleDateString("ar-EG")}</span>
                      </div>
                    )) : (
                      <p className="border-t border-white/10 px-4 py-4 text-sm text-[var(--color-muted)]">لا توجد ردود حتى الآن.</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
