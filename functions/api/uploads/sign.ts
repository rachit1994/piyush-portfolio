// POST /api/uploads/sign — Cloudflare Pages Function.
// Verifies the caller is the Supabase admin, then returns a short-lived R2
// presigned PUT URL + object key. The file never passes through this function
// and R2 credentials never reach the browser.

import { presignR2Put } from "../../_lib/r2-presign";
import { verifySupabaseJwt } from "../../_lib/verify-jwt";

type Env = {
  SUPABASE_JWKS_URL: string;
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET: string;
};

type PagesContext = { request: Request; env: Env };

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
]);
const MAX_BYTES = 50 * 1024 * 1024;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function extensionFor(type: string): string {
  return type.split("/")[1]?.replace("jpeg", "jpg") ?? "bin";
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const { request, env } = context;
  const token = (request.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  const claims = await verifySupabaseJwt(token, env.SUPABASE_JWKS_URL);
  if (!claims || claims.user_role !== "admin") {
    return json({ error: "forbidden" }, 403);
  }

  const body = (await request.json().catch(() => null)) as {
    contentType?: string;
    size?: number;
  } | null;
  const contentType = body?.contentType ?? "";
  const size = body?.size ?? 0;
  if (!ALLOWED_TYPES.has(contentType)) return json({ error: "type" }, 415);
  if (size <= 0 || size > MAX_BYTES) return json({ error: "size" }, 413);

  const key = `originals/${crypto.randomUUID()}.${extensionFor(contentType)}`;
  const url = await presignR2Put(
    {
      accountId: env.R2_ACCOUNT_ID,
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      bucket: env.R2_BUCKET,
    },
    key,
    contentType,
  );
  return json({ url, key, contentType });
}
