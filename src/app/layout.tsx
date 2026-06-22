import type { Metadata } from "next";

import { SiteHeader } from "@/features/navigation";
import { ThemeProvider, ThemeScript } from "@/features/theme";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Piyush Design Office",
    template: "%s | Piyush Design Office",
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
      </head>
      <body>
        <ThemeProvider>
          <SiteHeader />
          <main>{children}</main>
          <footer className="site-footer">
            <span>Based in India, working worldwide.</span>
            <span>© {new Date().getFullYear()} Piyush Design Office</span>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
