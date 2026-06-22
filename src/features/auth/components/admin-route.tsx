"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

import { isAdminToken } from "../lib/admin-claim";
import { authReadyState, sessionState } from "../state/session-state";

/**
 * Client-side admin gate. UX only — the real security boundary is Supabase RLS
 * and the JWT-verifying upload function. Redirects non-admins to the login
 * route once the session has loaded.
 */
export function AdminRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const ready = useRecoilValue(authReadyState);
  const session = useRecoilValue(sessionState);
  const allowed = isAdminToken(session?.access_token);

  useEffect(() => {
    if (ready && !allowed) router.replace("/admin/login");
  }, [ready, allowed, router]);

  if (!ready)
    return (
      <p className="admin-status" role="status">
        Checking access…
      </p>
    );
  return allowed ? <>{children}</> : null;
}
