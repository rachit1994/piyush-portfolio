import { getSupabaseClient } from "@/shared/supabase";

import type { MediaAsset, NewAssetInput } from "./media-types";

const TABLE = "media_assets";

// Insert a metadata row (RLS-checked: only the admin claim may write).
export async function insertMediaAsset(
  input: NewAssetInput,
): Promise<MediaAsset> {
  const { data, error } = await getSupabaseClient()
    .from(TABLE)
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as MediaAsset;
}

// Library read: newest assets first.
export async function listMediaAssets(): Promise<MediaAsset[]> {
  const { data, error } = await getSupabaseClient()
    .from(TABLE)
    .select()
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as MediaAsset[];
}

// Delete the metadata row. Removing the R2 object is out of scope.
export async function deleteMediaAsset(id: string): Promise<void> {
  const { error } = await getSupabaseClient().from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
