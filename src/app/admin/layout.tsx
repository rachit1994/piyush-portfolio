import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminChrome } from "@/features/admin";
import { AuthSync } from "@/features/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell">
      <AuthSync />
      <AdminChrome>{children}</AdminChrome>
    </div>
  );
}
