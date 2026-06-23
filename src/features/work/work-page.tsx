"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { homeCategories } from "@/features/home";

import { WorkCategorySelect } from "./components/work-category-select";
import { WorkImageRow } from "./components/work-image-row";
import { WorkVideoRow } from "./components/work-video-row";
import { getFilteredImages, getFilteredVideos } from "./work-data";

export function WorkPage() {
  const params = useSearchParams();
  const router = useRouter();
  const category = params.get("category") ?? "all";
  const videos = getFilteredVideos(category);
  const images = getFilteredImages(category);

  return (
    <div className="work-page">
      <div className="work-subheader">
        <div className="work-subheader-inner">
          <WorkCategorySelect
            categories={homeCategories}
            onChange={(slug) => router.push(`/work?category=${slug}`)}
            value={category}
          />
        </div>
      </div>
      <WorkVideoRow videos={videos} />
      <WorkImageRow images={images} speed={0.9} />
      <WorkImageRow direction="backward" images={images} speed={1.6} />
    </div>
  );
}
