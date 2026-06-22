import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "public-anon-placeholder";

let client: SupabaseClient | undefined;

/**
 * Single browser Supabase client (PKCE). Created lazily so static prerender
 * never instantiates it. The anon key is public on purpose; safety comes
 * entirely from Row Level Security, not from hiding this value.
 */
export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    client = createClient(url, anonKey, {
      auth: {
        flowType: "pkce",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}
