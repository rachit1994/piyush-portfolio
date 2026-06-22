"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignOutButton } from "@/features/auth";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="admin-nav">
      <ul className="admin-nav__list">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              aria-current={pathname === link.href ? "page" : undefined}
              className="admin-nav__link"
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <SignOutButton />
    </nav>
  );
}
