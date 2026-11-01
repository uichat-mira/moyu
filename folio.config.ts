import { defineFolioConfig } from "@uichat-mira/folio";

export default defineFolioConfig({
  title: "摸鱼划水记录",
  description: "记录工作学习之余的生活碎片，包含一些日常随想、好物分享和个人感悟。纯个人小站，非经营性、非商业用途。",
  // The deployed origin is configured at build time. Test domain is the current default.
  siteUrl: process.env.SITE_ORIGIN || "https://test.6260381.xyz",
  navigation: [
    { label: "首页", href: "/" },
    { label: "关于", href: "/about" },
  ],
  footer: "摸鱼划水记录 · 一个不赶时间的个人角落",
});
