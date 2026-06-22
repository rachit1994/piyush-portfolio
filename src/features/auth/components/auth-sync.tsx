"use client";

import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

import { getSupabaseClient } from "@/shared/supabase";

import { authReadyState, sessionState } from "../state/session-state";

/**
 * The one effect that touches Supabase auth: it mirrors the session into
 * Recoil. Every component derives admin status from the atom during render.
 */
export function AuthSync() {
  const setSession = useSetRecoilState(sessionState);
  const setReady = useSetRecoilState(authReadyState);

  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => data.subscription.unsubscribe();
  }, [setSession, setReady]);

  return null;
}
