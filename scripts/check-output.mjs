import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const base = process.env.VITE_SITE_BASE || "/";
const normalizedBase = base === "/" ? "/" : "/" + base.replace(/^\/+|\/+$/g, "") + "/";
const origin = (process.env.SITE_ORIGIN || "https://test.6260381.xyz").replace(/\/$/, "");

for (const name of ["index.html", "about/index.html", "404.html", "robots.txt", "sitemap.xml"]) {
  assert.ok(existsSync(join("dist", name)), "missing Folio static output: " + name);
}
const home = readFileSync(join("dist", "index.html"), "utf8");
const about = readFileSync(join("dist", "about/index.html"), "utf8");
const sitemap = readFileSync(join("dist", "sitemap.xml"), "utf8");
const notFound = readFileSync(join("dist", "404.html"), "utf8");

assert.match(home, /<main class="folio-prerender">/);
assert.match(home, /摸鱼划水记录/);
assert.match(home, /property="og:title"/);
assert.match(home, /application\/ld\+json/);
assert.match(about, /关于这个小站/);
assert.match(about, /<article class="folio-markdown">/);
assert.match(notFound, /noindex,nofollow/);
assert.ok(!home.includes("moyu-hero"), "custom landing-page HTML should not be present");
assert.ok(home.includes('rel="canonical" href="' + origin + normalizedBase), "homepage canonical mismatch");
assert.ok(about.includes('rel="canonical" href="' + origin + normalizedBase + "about/"), "about canonical mismatch");
assert.ok(sitemap.includes(origin + normalizedBase), "sitemap origin/base mismatch");
assert.ok(sitemap.includes(origin + normalizedBase + "about/"), "about sitemap route missing");

console.log("Folio 0.1.1 default UI and static SEO contract: PASS; base=" + normalizedBase);
