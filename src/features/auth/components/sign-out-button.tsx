"use client";

import { useRouter } from "next/navigation";

import { getSupabaseClient } from "@/shared/supabase";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    await getSupabaseClient().auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <button className="admin-link-button" onClick={signOut} type="button">
      Sign out
    </button>
  );
}
