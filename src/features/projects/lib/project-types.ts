export type ProjectStatus = "draft" | "published";

export type Project = {
  id: string;
  slug: string;
  title: string;
  client: string | null;
  year: number | null;
  summary: string | null;
  cover_asset_id: string | null;
  status: ProjectStatus;
  featured: boolean;
  sort_order: number;
  updated_at: string;
};

export type ProjectInput = {
  title: string;
  slug: string;
  client: string | null;
  year: number | null;
  summary: string | null;
  cover_asset_id: string | null;
  status: ProjectStatus;
  featured: boolean;
};

export type CategoryOption = {
  id: string;
  slug: string;
  title: string;
};

export type ProjectFormValue = {
  title: string;
  client: string;
  year: string;
  summary: string;
  cover_asset_id: string;
  status: ProjectStatus;
  featured: boolean;
  categoryIds: string[];
};
