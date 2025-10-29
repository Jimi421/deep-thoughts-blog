// scripts/sanitize-mdx.mjs
import fs from "fs";
import path from "path";

const DIR = "src/data/posts";

for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith(".mdx")) continue;
  const p = path.join(DIR, f);
  let t = fs.readFileSync(p, "utf8");

  // 1) Tokens like <1000BASE-SX> or <ST> that MDX misreads as HTML tags
  t = t.replace(/<([0-9][^>\s]*)>/g, (_m, g1) => `&lt;${g1}&gt;`);
  t = t.replace(/<([A-Z0-9\-]{2,})>/g, (_m, g1) => `&lt;${g1}&gt;`);

  // 2) Comparisons like "< 2 km" or "> 10 Gbps"
  t = t.replace(/<\s+(\d)/g, (_m, d) => `&lt; ${d}`);
  t = t.replace(/>\s+(\d)/g, (_m, d) => `&gt; ${d}`);

  fs.writeFileSync(p, t);
  console.log("✓ sanitized", f);
}

