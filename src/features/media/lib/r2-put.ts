/**
 * Upload the raw file directly to R2 using the presigned URL. The Content-Type
 * header MUST match the value the sign endpoint signed, or R2 rejects the PUT.
 */
export async function putToR2(
  url: string,
  file: File,
  contentType: string,
): Promise<void> {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "content-type": contentType },
    body: file,
  });
  if (!response.ok) {
    throw new Error(`r2 upload failed (${response.status})`);
  }
}
