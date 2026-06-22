import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const checkedRoots = ["src", "scripts"];
const checkedExtensions = new Set([".ts", ".tsx", ".css", ".mjs"]);
const violations = [];

async function collect(directory) {
  const entries = await readdir(directory);
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry);
    const details = await stat(path);
    files.push(...(details.isDirectory() ? await collect(path) : [path]));
  }
  return files;
}

for (const checkedRoot of checkedRoots) {
  const files = await collect(join(root, checkedRoot));
  for (const file of files) {
    if (!checkedExtensions.has(extname(file))) continue;
    const lines = (await readFile(file, "utf8")).split("\n").length;
    if (lines > 80)
      violations.push(`${relative(root, file)} has ${lines} lines`);
  }
}

const featureRoot = join(root, "src/features");
for (const feature of await readdir(featureRoot)) {
  const indexPath = join(featureRoot, feature, "index.ts");
  try {
    await stat(indexPath);
  } catch {
    violations.push(`src/features/${feature} is missing index.ts`);
  }
}

if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Architecture checks passed.");
