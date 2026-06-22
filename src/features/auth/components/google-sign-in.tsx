"use client";

import { getSupabaseClient } from "@/shared/supabase";

const CALLBACK_PATH = "/admin/auth/callback";

export function GoogleSignIn() {
  async function signIn() {
    await getSupabaseClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${CALLBACK_PATH}` },
    });
  }

  return (
    <button className="dark-button" onClick={signIn} type="button">
      Continue with Google
    </button>
  );
}
