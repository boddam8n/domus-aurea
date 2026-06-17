import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";
import { wedding } from "@/lib/data";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-4 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="font-display text-2xl text-[var(--color-text)]">{wedding.brand}</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Luxury wedding invitation requests, crafted with restraint.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/templates" className="text-sm text-[var(--color-muted)] transition hover:text-gold">Templates</Link>
          <Link href="/design" className="text-sm text-[var(--color-muted)] transition hover:text-gold">Design</Link>
          <Link href="/pricing" className="text-sm text-[var(--color-muted)] transition hover:text-gold">Pricing</Link>
          <a href={wedding.whatsapp} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-[var(--color-text)]">
            <MessageCircle className="h-4 w-4" />
          </a>
          <a href={wedding.instagram} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-[var(--color-text)]">
            <Instagram className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
