import { getSupabaseClient } from "@/shared/supabase";

import type { Category, CategoryInput } from "./category-types";
import { slugify } from "./slugify";

const TABLE = "categories";

function unwrap<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message);
  return data as T;
}

export async function listCategories(): Promise<Category[]> {
  const { data, error } = await getSupabaseClient()
    .from(TABLE)
    .select("*")
    .order("sort_order", { ascending: true });
  return unwrap(data, error);
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const row = { ...input, slug: slugify(input.title) };
  const { data, error } = await getSupabaseClient()
    .from(TABLE)
    .insert(row)
    .select()
    .single();
  return unwrap(data, error);
}

export async function updateCategory(
  id: string,
  patch: Partial<CategoryInput>,
): Promise<Category> {
  const { data, error } = await getSupabaseClient()
    .from(TABLE)
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  return unwrap(data, error);
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await getSupabaseClient().from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function swapOrder(a: Category, b: Category): Promise<void> {
  const client = getSupabaseClient();
  const first = await client
    .from(TABLE)
    .update({ sort_order: b.sort_order })
    .eq("id", a.id);
  if (first.error) throw new Error(first.error.message);
  const second = await client
    .from(TABLE)
    .update({ sort_order: a.sort_order })
    .eq("id", b.id);
  if (second.error) throw new Error(second.error.message);
}
