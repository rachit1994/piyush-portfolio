import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
        Public route
      </h1>
      <p className="mt-6 text-lg leading-8 text-slate-600">
        This page is generated as static HTML and can be opened directly on
        GitHub Pages. Replace this starter copy with Piyush&apos;s biography,
        experience, and portfolio content.
      </p>
    </article>
  );
}
