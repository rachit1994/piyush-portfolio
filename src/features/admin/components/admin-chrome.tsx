"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AdminNav } from "./admin-nav";

const BARE_ROUTES = ["/admin/login", "/admin/auth/callback"];

/**
 * Wraps authed admin pages with the nav. Login and OAuth-callback routes render
 * bare (no nav) because the visitor is not signed in yet.
 */
export function AdminChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some((route) => pathname.startsWith(route));
  if (bare) return <>{children}</>;
  return (
    <div className="admin-layout">
      <AdminNav />
      <main className="admin-main">{children}</main>
    </div>
  );
}
