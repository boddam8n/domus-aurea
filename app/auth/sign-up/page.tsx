"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Building2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [studioName, setStudioName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createBrowserSupabaseClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          studio_name: studioName
        }
      }
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <PageShell>
      <section className="grid min-h-screen place-items-center px-4 py-32 md:px-8">
        <form onSubmit={submit} className="glass w-full max-w-lg rounded-[2.5rem] p-8">
          <p className="text-sm font-bold uppercase tracking-[0.34em] text-gold">حساب جديد</p>
          <h1 className="mt-5 font-display text-5xl text-pearl">ابدأ دعواتك الفاخرة</h1>
          <label className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 text-pearl/60">
            <UserRound className="h-5 w-5 text-gold" />
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} className="w-full bg-transparent text-pearl outline-none" placeholder="اسمك" required />
          </label>
          <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 text-pearl/60">
            <Building2 className="h-5 w-5 text-gold" />
            <input value={studioName} onChange={(event) => setStudioName(event.target.value)} className="w-full bg-transparent text-pearl outline-none" placeholder="اسم الاستوديو أو العائلة" />
          </label>
          <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 text-pearl/60">
            <Mail className="h-5 w-5 text-gold" />
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full bg-transparent text-pearl outline-none" placeholder="البريد الإلكتروني" type="email" required />
          </label>
          <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 text-pearl/60">
            <LockKeyhole className="h-5 w-5 text-gold" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} className="w-full bg-transparent text-pearl outline-none" placeholder="كلمة المرور" type="password" minLength={8} required />
          </label>
          {error ? <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
          <button disabled={loading} className="mt-6 block w-full rounded-full bg-pearl px-7 py-4 text-center font-bold text-night transition hover:bg-gold disabled:opacity-60">
            {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
          </button>
          <p className="mt-5 text-center text-sm text-pearl/55">
            لديك حساب بالفعل؟ <Link className="text-gold" href="/auth/sign-in">تسجيل الدخول</Link>
          </p>
        </form>
      </section>
    </PageShell>
  );
}
