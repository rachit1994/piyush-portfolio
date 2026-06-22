import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";

import sharp from "sharp";

// Public images ship raw in the static export (next/image is `unoptimized`), so
// they are pre-sized here. Category sources are capped at 1080px and also get
// smaller responsive widths under `r/` for ~28vw desktop / ~72vw mobile slots;
// brand logos render at 72px. Re-encode only when smaller (idempotent sources).
const CATEGORY_DIR = "public/media/home-page-categories";
const BRAND_DIR = "public/media/brands";
const CATEGORY_WIDTHS = [480, 800];
const rasterExt = new Set([".webp", ".png", ".jpg", ".jpeg"]);
const kb = (n) => Math.round(n / 1024);

function encode(pipeline, ext, quality) {
  if (ext === ".png") return pipeline.png({ compressionLevel: 9 });
  if (ext === ".jpg" || ext === ".jpeg") return pipeline.jpeg({ quality });
  return pipeline.webp({ quality });
}

async function fit(path, { min, max, quality }) {
  const ext = extname(path).toLowerCase();
  const before = await readFile(path);
  let pipeline = sharp(before).rotate();
  const opts = { withoutEnlargement: true };
  if (min) pipeline = pipeline.resize(min, min, { fit: "outside", ...opts });
  if (max) pipeline = pipeline.resize(max, max, { fit: "inside", ...opts });
  const after = await encode(pipeline, ext, quality).toBuffer();
  if (after.length >= before.length) return 0;
  await writeFile(path, after);
  console.log(`${path}: ${kb(before.length)}KB -> ${kb(after.length)}KB`);
  return before.length - after.length;
}

async function variants(dir, name) {
  const ext = extname(name).toLowerCase();
  const source = await readFile(join(dir, name));
  await mkdir(join(dir, "r"), { recursive: true });
  for (const width of CATEGORY_WIDTHS) {
    const pipeline = sharp(source)
      .rotate()
      .resize(width, width, { fit: "outside", withoutEnlargement: true });
    const buffer = await encode(pipeline, ext, 70).toBuffer();
    await writeFile(
      join(dir, "r", `${basename(name, ext)}-${width}${ext}`),
      buffer,
    );
  }
}

let saved = 0;
for (const name of await readdir(BRAND_DIR)) {
  if (rasterExt.has(extname(name).toLowerCase()))
    saved += await fit(join(BRAND_DIR, name), { max: 220, quality: 82 });
}
for (const name of await readdir(CATEGORY_DIR)) {
  if (!rasterExt.has(extname(name).toLowerCase())) continue;
  saved += await fit(join(CATEGORY_DIR, name), { min: 1080, quality: 72 });
  await variants(CATEGORY_DIR, name);
}
console.log(`Saved ${(saved / 1024 / 1024).toFixed(1)} MB on sources`);
