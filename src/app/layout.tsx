import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Piyush Portfolio",
    template: "%s | Piyush Portfolio",
  },
  description: "A statically exported portfolio built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full antialiased" lang="en">
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-5xl flex-1 px-6 py-16">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-slate-500">
            Built as a static Next.js site for GitHub Pages.
          </div>
        </footer>
      </body>
    </html>
  );
}
