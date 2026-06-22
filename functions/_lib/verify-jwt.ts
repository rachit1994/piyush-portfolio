// Verify a Supabase access token against the project JWKS (asymmetric keys
// only — never a shared secret). Runs on the Cloudflare Workers runtime using
// Web Crypto. Returns the claims when valid, or null. Not 80-line constrained
// (outside src/), but kept small on purpose.

type Jwk = JsonWebKey & { kid?: string };
type Claims = Record<string, unknown>;

const ALGS: Record<string, { name: string; namedCurve?: string }> = {
  RS256: { name: "RSASSA-PKCS1-v1_5" },
  ES256: { name: "ECDSA", namedCurve: "P-256" },
};

function b64urlToBytes(input: string): Uint8Array<ArrayBuffer> {
  const binary = atob(input.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function decodeJson(segment: string): Record<string, unknown> {
  return JSON.parse(new TextDecoder().decode(b64urlToBytes(segment))) as Record<
    string,
    unknown
  >;
}

async function importKey(jwk: Jwk, alg: string): Promise<CryptoKey> {
  const spec = ALGS[alg];
  const algorithm = spec.namedCurve
    ? { name: spec.name, namedCurve: spec.namedCurve }
    : { name: spec.name, hash: "SHA-256" };
  return crypto.subtle.importKey("jwk", jwk, algorithm, false, ["verify"]);
}

async function fetchJwks(jwksUrl: string): Promise<Jwk[]> {
  const response = await fetch(jwksUrl);
  const body = (await response.json()) as { keys?: Jwk[] };
  return body.keys ?? [];
}

export async function verifySupabaseJwt(
  token: string,
  jwksUrl: string,
  audience = "authenticated",
): Promise<Claims | null> {
  const [headerB64, payloadB64, sigB64] = token.split(".");
  if (!headerB64 || !payloadB64 || !sigB64) return null;
  try {
    const header = decodeJson(headerB64) as { kid?: string; alg?: string };
    const alg = header.alg ?? "";
    if (!ALGS[alg]) return null;
    const jwk = (await fetchJwks(jwksUrl)).find((k) => k.kid === header.kid);
    if (!jwk) return null;
    const key = await importKey(jwk, alg);
    const verifyAlg = ALGS[alg].namedCurve
      ? { name: "ECDSA", hash: "SHA-256" }
      : { name: "RSASSA-PKCS1-v1_5" };
    const valid = await crypto.subtle.verify(
      verifyAlg,
      key,
      b64urlToBytes(sigB64),
      new TextEncoder().encode(`${headerB64}.${payloadB64}`),
    );
    if (!valid) return null;
    const claims = decodeJson(payloadB64) as Claims;
    const exp = typeof claims.exp === "number" ? claims.exp : 0;
    if (exp * 1000 < Date.now()) return null;
    if (claims.aud !== audience) return null;
    return claims;
  } catch {
    return null;
  }
}
