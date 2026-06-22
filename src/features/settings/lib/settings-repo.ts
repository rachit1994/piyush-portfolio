import { getSupabaseClient } from "@/shared/supabase";

import type { SiteSettings } from "./settings-types";

const TABLE = "site_settings";

export async function getSettings(): Promise<Partial<SiteSettings>> {
  const { data, error } = await getSupabaseClient()
    .from(TABLE)
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return (data as Partial<SiteSettings>) ?? {};
}

export async function saveSettings(
  patch: Partial<SiteSettings>,
): Promise<void> {
  const { error } = await getSupabaseClient()
    .from(TABLE)
    .upsert({ id: 1, ...patch });
  if (error) throw error;
}
