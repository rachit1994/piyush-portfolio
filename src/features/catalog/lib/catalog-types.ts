export const CATALOG_VERSION = 1;

export type CatalogMedia = {
  id: string;
  kind: "image" | "video_embed" | "video_file";
  src: string;
  alt: string;
  width?: number;
  height?: number;
  provider?: "youtube" | "vimeo";
  providerId?: string;
};

export type CatalogCategory = {
  slug: string;
  title: string;
  kind: "photography" | "videography" | "both";
};

export type CatalogProject = {
  slug: string;
  title: string;
  client?: string;
  year?: number;
  summary?: string;
  categories: string[];
  featured: boolean;
  cover?: string;
  media: CatalogMedia[];
};

export type Catalog = {
  version: number;
  publishedAt: string;
  categories: CatalogCategory[];
  projects: CatalogProject[];
};
