import type { SignResponse } from "./media-types";

const SIGN_ENDPOINT = "/api/uploads/sign";

/**
 * Ask the JWT-verifying Pages Function for a short-lived R2 presigned PUT URL.
 * The file never passes through this call — only its content type and size do.
 */
export async function requestSignedUpload(
  token: string,
  contentType: string,
  size: number,
): Promise<SignResponse> {
  const response = await fetch(SIGN_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ contentType, size }),
  });
  if (!response.ok) {
    throw new Error(`sign request failed (${response.status})`);
  }
  return (await response.json()) as SignResponse;
}
