"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Languages, Menu, Moon, Sun, X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useThemeMode } from "@/components/theme-provider";
import { navItems, wedding } from "@/lib/data";

export function Navigation() {
  const { theme, toggleTheme } = useThemeMode();
  const { isArabic, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const actionLinks = [
    { href: "/design", label: "Start Designing", ar: "ابدأ التصميم", primary: true },
    { href: "/auth/sign-in", label: "Login", ar: "دخول" },
    { href: "/dashboard", label: "Dashboard", ar: "لوحة العميل" }
  ];

  return (
    <motion.header initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <nav className="mx-auto max-w-7xl rounded-[1.65rem] border px-4 py-3 shadow-glass backdrop-blur-xl transition duration-700 lg:rounded-full" style={{ borderColor: "var(--nav-border)", background: "var(--nav-bg)" }}>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
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
            <HeaderControls theme={theme} toggleTheme={toggleTheme} isArabic={isArabic} toggleLanguage={toggleLanguage} />
            {actionLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={link.primary
                  ? "rounded-full bg-[var(--color-text)] px-5 py-2 text-sm font-bold text-[var(--color-bg)] transition hover:bg-gold"
                  : "rounded-full border border-white/12 px-5 py-2 text-sm font-bold text-[var(--color-text)] transition hover:bg-white/10"}
              >
                {isArabic ? link.ar : link.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-[var(--color-text)] lg:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 grid gap-2 border-t border-white/10 pt-4 lg:hidden"
          >
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-white/10">
                {isArabic ? item.ar : item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-wrap gap-2">
              <HeaderControls theme={theme} toggleTheme={toggleTheme} isArabic={isArabic} toggleLanguage={toggleLanguage} />
            </div>
            <div className="mt-2 grid gap-2">
              {actionLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={link.primary
                    ? "rounded-full bg-[var(--color-text)] px-5 py-3 text-center text-sm font-bold text-[var(--color-bg)] transition hover:bg-gold"
                    : "rounded-full border border-white/12 px-5 py-3 text-center text-sm font-bold text-[var(--color-text)] transition hover:bg-white/10"}
                >
                  {isArabic ? link.ar : link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}
      </nav>
    </motion.header>
  );
}

function HeaderControls({
  theme,
  toggleTheme,
  isArabic,
  toggleLanguage
}: {
  theme: "night" | "day";
  toggleTheme: () => void;
  isArabic: boolean;
  toggleLanguage: () => void;
}) {
  return (
    <>
      <button type="button" onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-[var(--color-text)] transition hover:bg-white/10" aria-label="Toggle day and night theme">
        {theme === "night" ? <Sun className="h-4 w-4 text-gold" /> : <Moon className="h-4 w-4 text-gold" />}
      </button>
      <button type="button" onClick={toggleLanguage} className="flex h-10 items-center gap-2 rounded-full border border-white/10 px-3 text-xs font-bold text-[var(--color-text)] transition hover:bg-white/10" aria-label="Switch language">
        <Languages className="h-4 w-4 text-gold" />
        {isArabic ? "EN" : "AR"}
      </button>
    </>
  );
}
