"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Languages, Menu, Moon, Sun, X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useThemeMode } from "@/components/theme-provider";
import { brandFontVariables } from "@/lib/brand-fonts";
import { navItems, wedding } from "@/lib/data";
import { occasions } from "@/lib/occasions";

export function Navigation() {
  const { theme, toggleTheme } = useThemeMode();
  const { isArabic, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOccasionsOpen, setIsOccasionsOpen] = useState(false);

  const actionLinks = [
    { href: "/design", label: "Start Designing", ar: "ابدأ التصميم", primary: true },
    { href: "/auth/sign-in", label: "Login", ar: "دخول" },
    { href: "/dashboard", label: "Dashboard", ar: "لوحة العميل" }
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${brandFontVariables} brand-navigation fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8`}
    >
      <nav className="mx-auto max-w-7xl rounded-[1.65rem] border px-4 py-3 shadow-glass backdrop-blur-xl transition duration-700 lg:rounded-full" style={{ borderColor: "var(--nav-border)", background: "var(--nav-bg)" }}>
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3"
            onClick={() => {
              setIsMenuOpen(false);
              setIsOccasionsOpen(false);
            }}
          >
            <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 font-display text-lg text-gold">DA</span>
            <span className="leading-tight">
              <span className="brand-display block text-lg font-medium text-[var(--color-text)]">{wedding.brand}</span>
              <span className="block text-xs text-[var(--color-faint)]">{wedding.arabicBrand}</span>
            </span>
          </Link>

          <div className="hidden items-center gap-0 xl:flex">
            {navItems.slice(0, 2).map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm text-[var(--color-muted)] transition hover:bg-white/10 hover:text-[var(--color-text)]">
                {isArabic ? item.ar : item.label}
              </Link>
            ))}
            <OccasionsMenu
              isArabic={isArabic}
              isOpen={isOccasionsOpen}
              onOpenChange={setIsOccasionsOpen}
            />
            {navItems.slice(2).map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full px-3 py-2 text-sm text-[var(--color-muted)] transition hover:bg-white/10 hover:text-[var(--color-text)]">
                {isArabic ? item.ar : item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
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
            onClick={() => {
              setIsMenuOpen((current) => !current);
              setIsOccasionsOpen(false);
            }}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-[var(--color-text)] xl:hidden"
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
            className="mt-4 grid gap-2 border-t border-white/10 pt-4 xl:hidden"
          >
            {navItems.slice(0, 2).map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-white/10">
                {isArabic ? item.ar : item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setIsOccasionsOpen((current) => !current)}
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-white/10"
              aria-expanded={isOccasionsOpen}
              aria-controls="mobile-occasions"
            >
              <span>{isArabic ? "المناسبات" : "Occasions"}</span>
              <ChevronDown className={`h-4 w-4 text-gold transition-transform duration-500 ${isOccasionsOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {isOccasionsOpen ? (
                <motion.div
                  id="mobile-occasions"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-1 rounded-2xl border border-gold/15 bg-black/10 p-2 sm:grid-cols-2">
                    {occasions.map((occasion) => (
                      <OccasionItem key={occasion.id} occasion={occasion} isArabic={isArabic} compact />
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
            {navItems.slice(2).map((item) => (
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

function OccasionsMenu({
  isArabic,
  isOpen,
  onOpenChange
}: {
  isArabic: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <div
      className="relative"
      onMouseEnter={() => onOpenChange(true)}
      onMouseLeave={() => onOpenChange(false)}
      onFocus={() => onOpenChange(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onOpenChange(false);
      }}
    >
      <button
        type="button"
        onClick={() => onOpenChange(!isOpen)}
        className="flex items-center gap-1 rounded-full px-3 py-2 text-sm text-[var(--color-muted)] transition hover:bg-white/10 hover:text-[var(--color-text)]"
        aria-expanded={isOpen}
        aria-controls="desktop-occasions"
      >
        {isArabic ? "المناسبات" : "Occasions"}
        <ChevronDown className={`h-3.5 w-3.5 text-gold transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen ? (
          <div className="absolute left-1/2 top-full w-[34rem] -translate-x-1/2 pt-4">
            <motion.div
              id="desktop-occasions"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.985 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="origin-top overflow-hidden rounded-[1.6rem] border border-gold/20 bg-[var(--nav-bg)] p-3 shadow-[0_28px_80px_rgba(0,0,0,.32)] backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-3 pb-3">
                <div>
                  <p className="brand-display text-xl font-medium text-[var(--color-text)]">{isArabic ? "كل لحظة تستحق دعوة" : "Every moment deserves an invitation"}</p>
                  <p className="mt-1 text-xs text-[var(--color-faint)]">{isArabic ? "تصنيفات جديدة قيد الإعداد" : "New collections are being prepared"}</p>
                </div>
                <span className="rounded-full border border-gold/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                  {isArabic ? "قريبًا" : "Coming soon"}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1">
                {occasions.map((occasion) => (
                  <OccasionItem key={occasion.id} occasion={occasion} isArabic={isArabic} />
                ))}
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function OccasionItem({
  occasion,
  isArabic,
  compact = false
}: {
  occasion: (typeof occasions)[number];
  isArabic: boolean;
  compact?: boolean;
}) {
  const Icon = occasion.icon;
  return (
    <div
      aria-disabled="true"
      className={`group flex items-center gap-3 rounded-xl px-3 text-[var(--color-muted)] transition duration-300 hover:bg-white/[0.07] hover:text-[var(--color-text)] ${
        compact ? "py-2.5 text-xs" : "py-3 text-sm"
      }`}
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/20 bg-gold/[0.06] text-gold transition duration-300 group-hover:border-gold/40 group-hover:bg-gold/[0.12]">
        <Icon className="h-3.5 w-3.5 stroke-[1.5]" />
      </span>
      <span>{isArabic ? occasion.labelAr : occasion.label}</span>
    </div>
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
