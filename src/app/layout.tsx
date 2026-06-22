import type { Metadata } from "next";

import { SiteHeader } from "@/features/navigation";
import { ThemeProvider, ThemeScript } from "@/features/theme";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Piyush Production House",
    template: "%s | Piyush Production House",
  },
  description: "Product direction, interface design, and engineering systems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
        {/* Warm up YouTube hosts: thumbnails load immediately, player on play. */}
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
        <link rel="dns-prefetch" href="https://s.ytimg.com" />
      </head>
      <body>
        <ThemeProvider>
          <SiteHeader />
          <main>{children}</main>
          <footer className="site-footer">
            <span>Based in India, working worldwide.</span>
            <span>© {new Date().getFullYear()} Piyush Production House</span>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
