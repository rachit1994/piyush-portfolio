import Link from "next/link";

import { primaryLinks } from "@/features/navigation/navigation-data";

export function DesktopNav() {
  if (primaryLinks.length === 0) return null;

  return (
    <nav className="desktop-nav" aria-label="Primary navigation">
      {primaryLinks.map((link) => (
        <Link className="nav-pill" href={link.href} key={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
