// Turns every PNG/JPG in public/images/work into a small WebP and records its size.
// Run:  npm run covers:optimize   (also runs automatically after npm run covers)
import { readdirSync, writeFileSync, readFileSync, existsSync, unlinkSync } from "node:fs";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const dir = "public/images/work";
const sizesFile = "src/data/cover-sizes.json";
const sizes = existsSync(sizesFile) ? JSON.parse(readFileSync(sizesFile, "utf8")) : {};

for (const file of readdirSync(dir)) {
  const ext = extname(file).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;
  const id = basename(file, ext);
  const src = join(dir, file);
  const out = join(dir, id + ".webp");
  const info = await sharp(src).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(out);
  sizes[id] = { w: info.width, h: info.height };
  unlinkSync(src);
  console.log("optimised", id, `${info.width}x${info.height}`, `${(info.size / 1024).toFixed(1)} KB`);
}
// also pick up .webp files added by hand
for (const file of readdirSync(dir)) {
  if (extname(file) !== ".webp") continue;
  const id = basename(file, ".webp");
  if (!sizes[id]) { const m = await sharp(join(dir, file)).metadata(); sizes[id] = { w: m.width, h: m.height }; }
}
writeFileSync(sizesFile, JSON.stringify(sizes, null, 2) + "\n");
console.log("Saved", sizesFile);
