import type { Session } from "@supabase/supabase-js";
import { atom } from "recoil";

export const sessionState = atom<Session | null>({
  key: "portfolio/auth-session",
  default: null,
});

// False until the first getSession resolves, so guards show a loading state
// instead of redirecting a valid admin during the async session read.
export const authReadyState = atom<boolean>({
  key: "portfolio/auth-ready",
  default: false,
});
