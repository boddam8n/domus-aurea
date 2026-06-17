"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Languages, Menu, Moon, Sun } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useThemeMode } from "@/components/theme-provider";
import { navItems, wedding } from "@/lib/data";

export function Navigation() {
  const { theme, toggleTheme } = useThemeMode();
  const { isArabic, toggleLanguage } = useLanguage();

  return (
    <motion.header initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-3 shadow-glass backdrop-blur-xl transition duration-700" style={{ borderColor: "var(--nav-border)", background: "var(--nav-bg)" }}>
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 font-display text-lg text-gold">DA</span>
          <span className="leading-tight">
            <span className="block font-display text-lg text-[var(--color-text)]">{wedding.brand}</span>
            <span className="block text-xs text-[var(--color-faint)]">{wedding.arabicBrand}</span>
          </span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm text-[var(--color-muted)] transition hover:bg-white/10 hover:text-[var(--color-text)]">
              {isArabic ? item.ar : item.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <button type="button" onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-[var(--color-text)] transition hover:bg-white/10" aria-label="Toggle day and night theme">
            {theme === "night" ? <Sun className="h-4 w-4 text-gold" /> : <Moon className="h-4 w-4 text-gold" />}
          </button>
          <button type="button" onClick={toggleLanguage} className="flex h-10 items-center gap-2 rounded-full border border-white/10 px-3 text-xs font-bold text-[var(--color-text)] transition hover:bg-white/10" aria-label="Switch language">
            <Languages className="h-4 w-4 text-gold" />
            {isArabic ? "EN" : "AR"}
          </button>
          <Link href="/design" className="rounded-full bg-[var(--color-text)] px-5 py-2 text-sm font-bold text-[var(--color-bg)] transition hover:bg-gold">
            {isArabic ? "ابدأ التصميم" : "Start Designing"}
          </Link>
          <Link href="/auth/sign-in" className="rounded-full border border-white/12 px-5 py-2 text-sm font-bold text-[var(--color-text)] transition hover:bg-white/10">
            {isArabic ? "دخول" : "Login"}
          </Link>
          <Link href="/dashboard" className="rounded-full border border-gold/30 px-5 py-2 text-sm font-bold text-[var(--color-text)] transition hover:bg-gold/10">
            {isArabic ? "لوحة العميل" : "Dashboard"}
          </Link>
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-[var(--color-text)] lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </nav>
    </motion.header>
  );
}
