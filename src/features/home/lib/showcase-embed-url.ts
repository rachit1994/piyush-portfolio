export function buildYoutubeEmbedUrl(videoId: string) {
  // Always muted so autoplay is honored everywhere (mobile blocks unmuted
  // autoplay); controls stay on so a viewer can unmute with one tap.
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    playsinline: "1",
    loop: "1",
    playlist: videoId,
    rel: "0",
    modestbranding: "1",
    controls: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}
