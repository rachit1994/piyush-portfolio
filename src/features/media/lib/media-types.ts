export type MediaKind = "image" | "video_file";

export type MediaAsset = {
  id: string;
  kind: MediaKind;
  r2_key: string | null;
  width: number | null;
  height: number | null;
  alt: string | null;
  byte_size: number | null;
  created_at: string;
};

// Server response from POST /api/uploads/sign.
export type SignResponse = {
  url: string;
  key: string;
  contentType: string;
};

// Row payload inserted into media_assets after a successful R2 PUT.
export type NewAssetInput = {
  kind: MediaKind;
  r2_key: string;
  width: number | null;
  height: number | null;
  alt: string | null;
  byte_size: number;
};
