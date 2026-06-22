import { getSupabaseClient } from "@/shared/supabase";

import type { MediaAsset } from "./media-types";
import { readImageSize } from "./read-image-size";
import {
  insertMediaAsset,
  putToR2,
  requestSignedUpload,
} from "./upload-client";
import type { UploadItem } from "./upload-item";

async function accessToken(): Promise<string> {
  const { data } = await getSupabaseClient().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("not signed in");
  return token;
}

// Run the full sign -> PUT -> insert pipeline for a single queued item.
export async function uploadOne(item: UploadItem): Promise<MediaAsset> {
  const token = await accessToken();
  const { file, kind } = item;
  const sign = await requestSignedUpload(token, file.type, file.size);
  await putToR2(sign.url, file, sign.contentType);
  const size = kind === "image" ? await readImageSize(file) : null;
  return insertMediaAsset({
    kind,
    r2_key: sign.key,
    width: size?.width ?? null,
    height: size?.height ?? null,
    alt: kind === "image" ? item.alt.trim() : null,
    byte_size: file.size,
  });
}
