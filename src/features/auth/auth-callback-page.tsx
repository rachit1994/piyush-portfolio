"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getSupabaseClient } from "@/shared/supabase";

/**
 * OAuth return point. detectSessionInUrl exchanges the PKCE code when the
 * client is created; we wait for the session, then route to the dashboard.
 */
export function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseClient();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace("/admin");
    });
    supabase.auth.getSession().then(({ data: result }) => {
      if (result.session) router.replace("/admin");
    });
    return () => data.subscription.unsubscribe();
  }, [router]);

  return (
    <p className="admin-status" role="status">
      Completing sign-in…
    </p>
  );
}
