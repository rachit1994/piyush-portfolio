// AWS SigV4 presigned PUT URL for Cloudflare R2 (S3 API), using Web Crypto.
// Lets the browser upload a file straight to R2 without it passing through the
// function and without exposing R2 credentials. Content-Type is signed, so the
// client must send exactly that header. Keep expiresIn small.

const ENC = new TextEncoder();

export type PresignConfig = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
};

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", ENC.encode(value));
  return toHex(new Uint8Array(digest));
}

async function hmac(key: BufferSource, value: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", cryptoKey, ENC.encode(value));
}

function encodeRfc3986(value: string): string {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function encodeKeyPath(key: string): string {
  return key.split("/").map(encodeRfc3986).join("/");
}

export async function presignR2Put(
  config: PresignConfig,
  key: string,
  contentType: string,
  expiresIn = 60,
): Promise<string> {
  const host = `${config.accountId}.r2.cloudflarestorage.com`;
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const scope = `${dateStamp}/auto/s3/aws4_request`;
  const canonicalUri = `/${config.bucket}/${encodeKeyPath(key)}`;
  const query = new URLSearchParams({
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${config.accessKeyId}/${scope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(expiresIn),
    "X-Amz-SignedHeaders": "content-type;host",
  });
  const canonicalQuery = query.toString();
  const canonicalRequest = [
    "PUT",
    canonicalUri,
    canonicalQuery,
    `content-type:${contentType}\nhost:${host}\n`,
    "content-type;host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    await sha256Hex(canonicalRequest),
  ].join("\n");
  const kDate = await hmac(
    ENC.encode(`AWS4${config.secretAccessKey}`),
    dateStamp,
  );
  const kRegion = await hmac(kDate, "auto");
  const kService = await hmac(kRegion, "s3");
  const kSigning = await hmac(kService, "aws4_request");
  const signature = toHex(new Uint8Array(await hmac(kSigning, stringToSign)));
  return `https://${host}${canonicalUri}?${canonicalQuery}&X-Amz-Signature=${signature}`;
}
