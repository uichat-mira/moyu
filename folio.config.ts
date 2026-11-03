import { defineFolioConfig } from "@uichat-mira/folio";

export default defineFolioConfig({
  title: "摸鱼划水记录",
  description: "记录工作学习之余的生活碎片，包含一些日常随想、好物分享和个人感悟。纯个人小站，非经营性、非商业用途。",
  siteUrl: process.env.SITE_ORIGIN || "https://6260381.xyz",
  logo: "images/moyu-logo.webp",
  navigation: [
    { label: "首页", href: "/" },
    { label: "博客", href: "/blogs" },
    { label: "好物", href: "/projects" },
    { label: "关于", href: "/docs/about" },
  ],
  // Folio FOL-022 candidate: each index recursively discovers URLs under its root.
  // Not hardcoded article/project types, and no consumer-maintained list component.
  collections: [
    { path: "/blogs", title: "博客", description: "写下的文章与日常" },
    { path: "/projects", title: "好物", description: "值得留下的发现" },
  ],
  // The linked, compliant footer is authored once in index.html, outside React's root.
  footer: "",
});
