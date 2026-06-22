import { getSupabaseClient } from "@/shared/supabase";

import type { CategoryOption } from "./project-types";

export async function listCategoryOptions(): Promise<CategoryOption[]> {
  const { data, error } = await getSupabaseClient()
    .from("categories")
    .select("id, slug, title")
    .order("title", { ascending: true });
  if (error) throw error;
  return (data as CategoryOption[]) ?? [];
}

export async function setProjectCategories(
  projectId: string,
  categoryIds: string[],
): Promise<void> {
  const client = getSupabaseClient();
  const cleared = await client
    .from("project_categories")
    .delete()
    .eq("project_id", projectId);
  if (cleared.error) throw cleared.error;
  if (categoryIds.length === 0) return;
  const rows = categoryIds.map((category_id) => ({
    project_id: projectId,
    category_id,
  }));
  const { error } = await client.from("project_categories").insert(rows);
  if (error) throw error;
}
