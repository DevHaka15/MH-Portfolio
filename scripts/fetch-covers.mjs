// Run once on your computer (Node 18+):  node scripts/fetch-covers.mjs
// Saves every project cover into images/work so the site serves them itself (faster than Behance).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const file = "js/projects.js", src = readFileSync(file, "utf8");
const IB = "https://mir-s3-cdn-cf.behance.net/projects/404/";
mkdirSync("images/work", { recursive: true });
let ok = 0, bad = 0;
for (const m of src.matchAll(/\{id:"([^"]+)"[^}]*?,i:"([^"]+)"/g)) {
  const [, id, i] = m;
  try {
    const r = await fetch(IB + i);
    if (!r.ok) throw new Error(r.status);
    writeFileSync(`images/work/${id}.${i.split(".").pop()}`, Buffer.from(await r.arrayBuffer()));
    ok++; console.log("saved", id);
  } catch (e) { bad++; console.log("FAILED", id, String(e)); }
}
if (ok && !bad) { writeFileSync(file, src.replace("LOCAL_COVERS=false", "LOCAL_COVERS=true")); console.log("Done. Commit images/work and js/projects.js."); }
else console.log(`${ok} saved, ${bad} failed. Fix the failures, then run again.`);
