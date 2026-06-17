import Link from "next/link";

export default function NotFound() {
  return (
    <main className="luxury-bg grid min-h-screen place-items-center px-4 text-center">
      <div className="glass max-w-xl rounded-[2rem] p-8">
        <p className="gold-text font-display text-7xl">404</p>
        <h1 className="mt-4 text-3xl font-bold text-pearl">This invitation is still being prepared.</h1>
        <p className="mt-4 text-pearl/60">Return to the main experience and choose another moment.</p>
        <Link href="/" className="mt-7 inline-flex rounded-full bg-pearl px-7 py-4 font-bold text-night">
          Back home
        </Link>
      </div>
    </main>
  );
}
