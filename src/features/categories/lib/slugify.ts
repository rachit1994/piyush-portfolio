/**
 * Derive a URL-safe slug from a human title: lowercase, spaces to dashes,
 * drop anything outside [a-z0-9-], then collapse and trim repeated dashes.
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
