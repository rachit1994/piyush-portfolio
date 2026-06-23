type ThumbnailName = "mqdefault" | "hqdefault";

export function buildYoutubeThumbnailUrl(
  videoId: string,
  name: ThumbnailName = "hqdefault",
) {
  return `https://i.ytimg.com/vi/${videoId}/${name}.jpg`;
}

// Mobile picks the ~10 KB 320px frame; desktop the ~25 KB 480px frame.
export function buildYoutubeThumbnailSrcSet(videoId: string) {
  return [
    `${buildYoutubeThumbnailUrl(videoId, "mqdefault")} 320w`,
    `${buildYoutubeThumbnailUrl(videoId, "hqdefault")} 480w`,
  ].join(", ");
}
