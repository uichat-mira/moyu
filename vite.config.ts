import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { renderFolioMarkdown } from "@uichat-mira/folio";
import {
  folio,
  folioEscapeHtml,
  type FolioStaticBuildOptions,
} from "@uichat-mira/folio/vite";
import config from "./folio.config";

const base = process.env.VITE_SITE_BASE || "/";
const routeHref = (route: string) => base.replace(/\/?$/, "/") + route.replace(/^\/+/, "") + (route === "/" ? "" : "/");

const staticRoutes: FolioStaticBuildOptions = {
  locale: "zh_CN",
  siteName: config.title,
  twitterCard: "summary",
  title: (route) => route.path === "/" ? config.title : route.title + " · " + config.title,
  routes: ({ docs }) => {
    const posts = docs.filter((doc) => doc.type === "article").sort(
      (a, b) => String(b.date ?? "").localeCompare(String(a.date ?? "")),
    );
    const homePosts = posts.length
      ? '<div class="moyu-post-grid">' + posts.map((doc, i) =>
          '<a class="moyu-post" href="' + folioEscapeHtml(routeHref(doc.path)) + '">' +
          '<div class="moyu-post__index">' + String(i + 1).padStart(2, "0") + '</div>' +
          '<span class="moyu-post__category">' + folioEscapeHtml(doc.group) + '</span>' +
          '<h3>' + folioEscapeHtml(doc.title) + '</h3>' +
          '<p>' + folioEscapeHtml(doc.description) + '</p></a>',
        ).join("") + "</div>"
      : '<div class="moyu-empty"><div><h3>故事正在整理中</h3><p>旧站文章与照片正在核对，暂不提供虚构内容。</p></div></div>';
    const header = '<header class="moyu-static-header"><a href="' + routeHref("/") + '">摸鱼划水记录</a><a href="' + routeHref("/about") + '">关于</a></header>';
    return [
      {
        path: "/",
        title: config.title,
        description: config.description,
        type: "website",
        body: header +
          '<main class="moyu-home">' +
          '<section class="moyu-hero"><div class="moyu-hero__copy">' +
          '<span class="moyu-kicker">AN UNHURRIED LITTLE CORNER</span>' +
          '<p class="moyu-intro">工作之外，还有生活。</p>' +
          '<h1>摸鱼划水<span>记录<i>。</i></span></h1>' +
          '<p class="moyu-hero__lede">记一点日常，存几段心情。忙里偷闲不必找借口，生活本来就值得认真记录。</p>' +
          '<div class="moyu-hero__actions"><a class="moyu-button moyu-button--primary" href="#writing">看看最近写的 ↘</a> ' +
          '<a class="moyu-text-link" href="' + routeHref("/about") + '">关于这里 ↗</a></div></div>' +
          '<div class="moyu-hero__art"><div class="moyu-art__frame">' +
          '<span class="moyu-art__top">SLOW DAYS / GOOD STORIES</span>' +
          '<img alt="鱼儿游过水面的简约插画" src="' + base.replace(/\/?$/, "/") + 'pond.svg">' +
          '<div class="moyu-art__bottom"><span>日常收集所</span><span>VOL. 01</span></div></div></div></section>' +
          '<section id="writing" class="moyu-writing"><div class="moyu-section-head"><div><span class="moyu-eyebrow">THE JOURNAL</span><h2>最近在写 ✳</h2></div></div>' +
          homePosts + '</section>' +
          '<section class="moyu-ending"><h2>慢一点，也挺好。</h2><p>此处不赶路，只记录沿途。</p><a href="' + routeHref("/about") + '">关于摸鱼划水记录 ↗</a></section></main>',
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: config.title,
          description: config.description,
          url: config.siteUrl + "/",
          inLanguage: "zh-CN",
        },
      },
      ...docs.map((doc) => ({
        path: doc.path,
        title: doc.title,
        description: doc.description || config.description,
        type: doc.type === "article" ? "article" : "website",
        image: doc.cover,
        doc,
        body: header + '<main class="moyu-static-document">' +
          '<span class="moyu-eyebrow">' + folioEscapeHtml(doc.group) + '</span>' +
          '<h1>' + folioEscapeHtml(doc.title) + '</h1>' +
          (doc.description ? '<p class="moyu-article-lede">' + folioEscapeHtml(doc.description) + '</p>' : "") +
          '<article class="folio-markdown">' + renderFolioMarkdown(doc.body, { removeH1: true }) + '</article></main>',
      })),
    ];
  },
  notFound: () => ({
    path: "/404",
    title: "页面暂时不在",
    description: "没有找到这个页面。",
    robots: "noindex,nofollow",
    body: '<main class="moyu-static-document"><h1>这页暂时不在。</h1><p>也许它去别处摸鱼了。</p><a href="' + routeHref("/") + '">返回首页</a></main>',
  }),
  sitemap: true,
  robots: true,
};

export default defineConfig({
  base,
  plugins: [
    react(),
    folio({ contentDir: "content", config, staticRoutes }),
  ],
});
