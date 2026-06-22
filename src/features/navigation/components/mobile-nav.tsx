import Link from "next/link";

import { primaryLinks } from "@/features/navigation/navigation-data";
import { ThemeToggle } from "@/features/theme";

export function MobileNav() {
  if (primaryLinks.length === 0) return null;

  return (
    <details className="mobile-nav">
      <summary>Menu ☰</summary>
      <div className="mobile-nav-panel">
        {primaryLinks.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
        <ThemeToggle />
      </div>
    </details>
  );
}
