import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const base = process.env.VITE_SITE_BASE || "/";
const normalizedBase = base === "/" ? "/" : "/" + base.replace(/^\/+|\/+$/g, "") + "/";
const origin = (process.env.SITE_ORIGIN || "https://test.6260381.xyz").replace(/\/$/, "");

for (const name of ["index.html", "blogs/index.html", "projects/index.html", "blogs/ai-agent-ux-rant/index.html", "blogs/wo-lai-le/index.html", "blogs/daily-fragments/index.html", "blogs/slacking-thoughts/index.html", "blogs/weekend/index.html", "projects/good-things/index.html", "docs/about/index.html", "images/template-ali.webp", "images/template-tencent.webp", "images/template-bytedance.webp", "404.html", "robots.txt", "sitemap.xml"]) {
  assert.ok(existsSync(join("dist", name)), "missing Folio static output: " + name);
}
const home = readFileSync(join("dist", "index.html"), "utf8");
const about = readFileSync(join("dist", "docs/about/index.html"), "utf8");
const sitemap = readFileSync(join("dist", "sitemap.xml"), "utf8");
const notFound = readFileSync(join("dist", "404.html"), "utf8");

assert.match(home, /<main class="folio-prerender">/);
assert.match(home, /摸鱼划水记录/);
assert.match(home, /property="og:title"/);
assert.match(home, /application\/ld\+json/);
assert.match(about, /关于小站/);
const blogIndex = readFileSync(join("dist", "blogs/index.html"), "utf8");
const projectIndex = readFileSync(join("dist", "projects/index.html"), "utf8");
assert.match(blogIndex, /folio-collection-page/);
assert.match(blogIndex, /\/blogs\/ai-agent-ux-rant\//);
assert.match(projectIndex, /\/projects\/good-things\//);
assert.match(projectIndex, /好物/);
assert.match(sitemap, /\/blogs\//);
assert.match(sitemap, /\/projects\//);
const migrated = readFileSync(join("dist", "blogs/ai-agent-ux-rant/index.html"), "utf8");
assert.match(migrated, /大厂 AI 生成的博客模板/);
assert.match(migrated, /template-ali.webp/);
assert.match(migrated, /<article/);
for (const path of ["blogs/ai-agent-ux-rant", "blogs/wo-lai-le", "blogs/daily-fragments", "blogs/slacking-thoughts", "blogs/weekend", "projects/good-things", "docs/about"]) {
  assert.ok(sitemap.includes(origin + normalizedBase + path + "/"), "missing migrated URL: " + path);
}
assert.match(about, /<article class="folio-markdown">/);
assert.match(notFound, /noindex,nofollow/);
assert.ok(!home.includes("moyu-hero"), "custom landing-page HTML should not be present");
assert.ok(home.includes('rel="canonical" href="' + origin + normalizedBase), "homepage canonical mismatch");
assert.ok(about.includes('rel="canonical" href="' + origin + normalizedBase + "docs/about/"), "about canonical mismatch");
assert.ok(sitemap.includes(origin + normalizedBase), "sitemap origin/base mismatch");
assert.ok(sitemap.includes(origin + normalizedBase + "docs/about/"), "about sitemap route missing");

// The marketing link and ICP record must be present in static HTML as well as the React runtime.
for (const page of [home, about, migrated, notFound]) {
  assert.equal((page.match(/class="moyu-site-footer"/g) || []).length, 1, "expected one site footer per page");
  assert.match(page, /Built with/);
  assert.match(page, /href="https:\/\/github.com\/uichat-mira\/folio"/);
  assert.match(page, /href="https:\/\/beian\.miit\.gov\.cn\/"/);
  assert.match(page, /粤ICP备2026107949号-1/);
}
assert.match(home, /class="moyu-site-footer__icp"/);
assert.match(home, /rel="noopener noreferrer"/);

console.log("Folio 0.1.1 default UI, footer links, and static SEO contract: PASS; base=" + normalizedBase);
