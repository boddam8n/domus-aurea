import { CalendarDays, Download, Filter, Plus, Search } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { adminStats, guests } from "@/lib/data";

export default function AdminPage() {
  return (
    <PageShell>
      <section className="px-4 py-32 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.34em] text-gold">Dashboard</p>
              <h1 className="mt-4 font-display text-5xl text-pearl md:text-7xl">Wedding operations, refined.</h1>
            </div>
            <div className="flex gap-3">
              <button className="rounded-full border border-white/12 px-5 py-3 text-pearl">
                <Download className="ml-2 inline h-4 w-4" />
                Export
              </button>
              <button className="rounded-full bg-pearl px-5 py-3 font-bold text-night">
                <Plus className="ml-2 inline h-4 w-4" />
                New invitation
              </button>
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {adminStats.map((stat) => (
              <div key={stat.label} className="glass rounded-[2rem] p-6">
                <stat.icon className="h-6 w-6 text-gold" />
                <strong className="mt-6 block font-display text-4xl text-pearl">{stat.value}</strong>
                <span className="text-pearl/55">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="glass mt-6 rounded-[2rem] p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3 rounded-full bg-white/[0.06] px-4 py-3 text-pearl/50 md:w-96">
                <Search className="h-4 w-4" />
                <span>Search guests, tables, status...</span>
              </div>
              <button className="rounded-full border border-white/12 px-5 py-3 text-pearl">
                <Filter className="ml-2 inline h-4 w-4" />
                Filters
              </button>
            </div>
            <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
              <div className="grid grid-cols-5 gap-4 bg-white/[0.06] px-5 py-4 text-xs uppercase tracking-[0.22em] text-pearl/45">
                <span>Guest</span>
                <span>Status</span>
                <span>Seats</span>
                <span>Table</span>
                <span>Date</span>
              </div>
              {guests.map((guest) => (
                <div key={guest.name} className="grid grid-cols-5 gap-4 border-t border-white/10 px-5 py-5 text-sm">
                  <span className="font-bold text-pearl">{guest.name}</span>
                  <span className="text-gold">{guest.status}</span>
                  <span className="text-pearl/60">{guest.seats}</span>
                  <span className="text-pearl/60">{guest.table}</span>
                  <span className="text-pearl/45">
                    <CalendarDays className="ml-1 inline h-4 w-4" />
                    Dec 12
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
