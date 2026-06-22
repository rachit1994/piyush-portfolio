import { slugify } from "./slugify";
import type { Project, ProjectFormValue, ProjectInput } from "./project-types";

export const EMPTY_FORM: ProjectFormValue = {
  title: "",
  client: "",
  year: "",
  summary: "",
  cover_asset_id: "",
  status: "draft",
  featured: false,
  categoryIds: [],
};

export function projectToForm(
  project: Project,
  categoryIds: string[],
): ProjectFormValue {
  return {
    title: project.title,
    client: project.client ?? "",
    year: project.year != null ? String(project.year) : "",
    summary: project.summary ?? "",
    cover_asset_id: project.cover_asset_id ?? "",
    status: project.status,
    featured: project.featured,
    categoryIds,
  };
}

export function formToInput(value: ProjectFormValue): ProjectInput {
  const year = Number.parseInt(value.year, 10);
  return {
    title: value.title.trim(),
    slug: slugify(value.title),
    client: value.client.trim() || null,
    year: Number.isFinite(year) ? year : null,
    summary: value.summary.trim() || null,
    cover_asset_id: value.cover_asset_id.trim() || null,
    status: value.status,
    featured: value.featured,
  };
}
