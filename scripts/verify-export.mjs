import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const outputDirectory = new URL("../out/", import.meta.url);
const requiredFiles = [
  "index.html",
  "about/index.html",
  "login/index.html",
  "private/index.html",
  "404.html",
  ".nojekyll",
];

await Promise.all(
  requiredFiles.map(async (file) => {
    await access(new URL(file, outputDirectory));
  }),
);

const staticDirectory = new URL("_next/static/", outputDirectory);
const staticEntries = await readdir(staticDirectory);

if (staticEntries.length === 0) {
  throw new Error("The static export contains no Next.js assets.");
}

const indexHtml = await readFile(
  new URL("index.html", outputDirectory),
  "utf8",
);
const basePath = process.env.PAGES_BASE_PATH ?? "";
const expectedAssetPath = `${basePath}/_next/static/`;
const expectedAboutPath = `${basePath}/about/`;

for (const expectedPath of [expectedAssetPath, expectedAboutPath]) {
  if (!indexHtml.includes(expectedPath)) {
    throw new Error(`Static export is missing expected path: ${expectedPath}`);
  }
}

console.log(
  `Verified ${requiredFiles.length} required files and ${join(basePath || "/", "_next/static")} assets.`,
);
