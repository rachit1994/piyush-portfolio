import Link from "next/link";

export default function Home() {
  return (
    <section className="my-auto max-w-3xl">
      <p className="mb-5 text-sm font-semibold tracking-widest text-blue-700 uppercase">
        Portfolio foundation
      </p>
      <h1 className="text-5xl leading-tight font-semibold tracking-tight text-balance text-slate-950 sm:text-6xl">
        A stable starting point for Piyush&apos;s portfolio.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        This Next.js application is configured for static export, typed
        development, automated quality checks, and GitHub Pages deployment.
      </p>
      <div className="mt-9 flex flex-wrap gap-4">
        <Link
          className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
          href="/about"
        >
          View public route
        </Link>
        <Link
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
          href="/private"
        >
          Test private route
        </Link>
      </div>
    </section>
  );
}
