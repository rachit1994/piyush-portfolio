export const showcasePlaylistId = "PLlWlPTewOeNFRjyCl293p3V08_obsTs83";

const playlistVideos = [
  ["jToy8-SwF6Q", "White label Google Ads agency growth"],
  ["DQx7PLkGf54", "Plumbing company Google Ads testimonial"],
  ["fEekdAMo6tc", "PT intake Google Ads testimonial"],
  ["eyvFUfb-BMc", "Dentist Google Ads testimonial"],
  ["gWuGxpRRTr4", "Tree removal Google Ads testimonial"],
  ["kHnbtSm79Es", "Josh Google Ads results testimonial"],
  ["elvFk8dC_V0", "Sam recommends PPC success"],
  ["Koagb_5F3rY", "White-label Google Ads services"],
  ["JqY5SGfwaUY", "Certified Google Ads expert review"],
  ["MQhu6C54GIo", "Certified Google AdWords expert"],
  ["49q7iAt6eVw", "Turning clicks into clients"],
  ["hkdU3v-nH_M", "Google Ads expert review"],
  ["w4Q2CoedR-w", "Google Certified AdWords specialist"],
] as const;

export type ShowcaseVideo = {
  slug: string;
  videoId: (typeof playlistVideos)[number][0];
  title: string;
};

export const showcaseVideos: ShowcaseVideo[] = playlistVideos.map(
  ([videoId, title], index) => ({
    slug: `showcase-video-${index + 1}`,
    videoId,
    title,
  }),
);
