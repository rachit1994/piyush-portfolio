import Link from "next/link";

import { ThemeToggle } from "@/features/theme";

export function SiteActions() {
  return (
    <div className="site-actions">
      <span className="availability">● Available for select projects</span>
      <ThemeToggle />
      <Link className="nav-pill nav-pill-dark" href="/login">
        Let&apos;s begin
      </Link>
    </div>
  );
}
