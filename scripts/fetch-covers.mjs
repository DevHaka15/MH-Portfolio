// Run once on your computer (Node 18+):   npm run covers
// 1. Downloads any project cover that is not in public/images/work yet (from Behance's CDN)
// 2. Converts every cover to a small WebP and records its size (scripts/optimize-covers.mjs)
// Then commit public/images/work and src/data/cover-sizes.json.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const src = readFileSync("src/data/projects.ts", "utf8");
const CDN = "https://mir-s3-cdn-cf.behance.net/projects/404/";
mkdirSync("public/images/work", { recursive: true });

let ok = 0, skipped = 0, bad = 0;
for (const m of src.matchAll(/id:\s*"([^"]+)"[^}]*?cover:\s*"([^"]+)"/g)) {
  const [, id, cover] = m;
  if (existsSync(`public/images/work/${id}.webp`)) { skipped++; continue; }
  try {
    const r = await fetch(CDN + cover);
    if (!r.ok) throw new Error(String(r.status));
    writeFileSync(`public/images/work/${id}.${cover.split(".").pop()}`, Buffer.from(await r.arrayBuffer()));
    ok++; console.log("downloaded", id);
  } catch (e) { bad++; console.log("FAILED", id, String(e)); }
}
console.log(`${ok} downloaded, ${skipped} already there, ${bad} failed.`);
const res = spawnSync("node", ["scripts/optimize-covers.mjs"], { stdio: "inherit" });
process.exit(res.status ?? 0);
