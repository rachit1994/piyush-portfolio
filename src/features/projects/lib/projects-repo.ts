import { getSupabaseClient } from "@/shared/supabase";

import type { Project, ProjectInput } from "./project-types";

const TABLE = "projects";

export async function listProjects(): Promise<Project[]> {
  const { data, error } = await getSupabaseClient()
    .from(TABLE)
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as Project[]) ?? [];
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const { data, error } = await getSupabaseClient()
    .from(TABLE)
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

export async function updateProject(
  id: string,
  patch: Partial<ProjectInput>,
): Promise<void> {
  const { error } = await getSupabaseClient()
    .from(TABLE)
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await getSupabaseClient().from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
