function decodeSegment(segment: string): Record<string, unknown> | null {
  try {
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const parsed: unknown = JSON.parse(atob(base64));
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/**
 * Read the `user_role` claim stamped into the access token by the Supabase
 * Custom Access Token Hook. Client-side and unverified — for UX gating only.
 * Real authorization is enforced by RLS and the upload function.
 */
export function readRoleFromToken(token: string | undefined): string | null {
  if (!token) return null;
  const payload = token.split(".")[1];
  if (!payload) return null;
  const role = decodeSegment(payload)?.user_role;
  return typeof role === "string" ? role : null;
}

export function isAdminToken(token: string | undefined): boolean {
  return readRoleFromToken(token) === "admin";
}
