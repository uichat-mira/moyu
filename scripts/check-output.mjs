import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const base = process.env.VITE_SITE_BASE || "/";
const normalizedBase = base === "/" ? "/" : "/" + base.replace(/^\/+|\/+$/g, "") + "/";
const origin = (process.env.SITE_ORIGIN || "https://test.6260381.xyz").replace(/\/$/, "");
const files = ["index.html", "about/index.html", "404.html", "robots.txt", "sitemap.xml", "pond.svg"];
for (const name of files) {
  assert.ok(existsSync(join("dist", name)), "missing build output " + name);
}
const home = readFileSync(join("dist", "index.html"), "utf8");
const about = readFileSync(join("dist", "about/index.html"), "utf8");
const sitemap = readFileSync(join("dist", "sitemap.xml"), "utf8");
assert.match(home, /摸鱼划水记录/);
assert.match(home, /工作之外，还有生活/);
assert.match(home, /property="og:title"/);
assert.match(home, /application\/ld\+json/);
assert.match(about, /关于这个小站/);
assert.match(about, /<article class="folio-markdown">/);
assert.ok(home.includes('rel="canonical" href="' + origin + normalizedBase), "homepage canonical mismatch");
assert.ok(sitemap.includes(origin + normalizedBase), "sitemap origin/base mismatch");
assert.ok(sitemap.includes(origin + normalizedBase + "about/"), "about sitemap route missing");
console.log("Folio 0.1.1 static contract: PASS; base=" + normalizedBase);
