import { CATALOG_VERSION, type Catalog } from "./catalog-types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isProject(value: unknown): boolean {
  return (
    isObject(value) &&
    typeof value.slug === "string" &&
    typeof value.title === "string" &&
    Array.isArray(value.media)
  );
}

/**
 * Validate the published catalog before the public site renders it. Returns
 * null on any shape or version mismatch so callers fall back to the last good
 * copy instead of throwing. This is the only trusted entry point for untrusted
 * catalog JSON (versioned + isolated per AGENTS.md).
 */
export function parseCatalog(input: unknown): Catalog | null {
  if (!isObject(input)) return null;
  if (input.version !== CATALOG_VERSION) return null;
  if (typeof input.publishedAt !== "string") return null;
  if (!Array.isArray(input.categories)) return null;
  if (!Array.isArray(input.projects)) return null;
  if (!input.projects.every(isProject)) return null;
  return input as unknown as Catalog;
}
