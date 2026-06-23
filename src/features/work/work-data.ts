import { publicAssetPath } from "@/shared/assets";

import { homeCategories, showcaseVideos } from "@/features/home";

import type { WorkImageItem, WorkVideoItem } from "./work-types";

export const workVideos: WorkVideoItem[] = homeCategories.map((cat, i) => ({
  slug: `work-video-${cat.slug}`,
  videoId: showcaseVideos[i % showcaseVideos.length].videoId,
  title: showcaseVideos[i % showcaseVideos.length].title,
  categorySlug: cat.slug,
}));

export const workImages: WorkImageItem[] = homeCategories.map((cat) => ({
  slug: `work-image-${cat.slug}`,
  src: publicAssetPath(`/media/home-page-categories/${cat.slug}.webp`),
  alt: `${cat.label} photography`,
  categorySlug: cat.slug,
}));

export function getFilteredVideos(categorySlug: string): WorkVideoItem[] {
  if (categorySlug === "all") return workVideos;
  return workVideos.filter((v) => v.categorySlug === categorySlug);
}

export function getFilteredImages(categorySlug: string): WorkImageItem[] {
  if (categorySlug === "all") return workImages;
  return workImages.filter((img) => img.categorySlug === categorySlug);
}
