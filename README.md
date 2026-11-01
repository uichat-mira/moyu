# 摸鱼划水记录 / Moyu

个人网站，直接消费 npm 发布的 **`@uichat-mira/folio@0.1.1`**。

## 设计原则

使用 Folio 的 **默认 FolioApp、默认首页、导航、搜索、主题切换和整站样式**。不维护独立 UI 组件、定制 CSS 或同功能的静态 HTML 模板。网站只配置标题、描述、导航以及 Markdown 内容。

现有测试站：[test.6260381.xyz](https://test.6260381.xyz)。这个仓库最初只有 LICENSE，旧站公开 HTML 没有可核对的文章或原始图片清单；因此当前是新版站点底座，**不是已完成的旧文章和照片迁移**。请核对旧站内容来源后，再导入实际文章、照片和原 URL 映射。不要虚构个人经历或发表日期。

## 开发

Node 22.12+，推荐 Node 24。

```bash
npm ci --no-audit --no-fund
npm run dev
npm run check
```

Folio 的 Vite 插件负责 `virtual:folio/content`、路由静态 HTML、404、sitemap、robots、canonical、OG 和 JSON-LD。UI 使用 `@uichat-mira/folio/styles.css`。

自定义域名构建：`SITE_ORIGIN=https://test.6260381.xyz`、`VITE_SITE_BASE=/`。

GitHub Pages 项目路径构建：`SITE_ORIGIN=https://uichat-mira.github.io`、`VITE_SITE_BASE=/moyu/`。

CI 对两种路径都运行构建和静态产物检查，保留根路径 artifact。

## GitHub Pages 预览

公开预览地址：[https://uichat-mira.github.io/moyu/](https://uichat-mira.github.io/moyu/)。这是只用于评审的 GitHub Pages 站，**不是**原 EdgeOne 域名的生产替代。`.github/workflows/pages-preview.yml` 仅由独立的 `pages-preview` 分支推送触发，评审者确认更新该预览分支时才会发布；`feat/*`、`dev`、`test` 和 `prod` 的普通推送不会自动更新该预览。预览部署不代表合并、验收或生产发布。

## 内容

- `content/pages/about.md`：根据现有站点简介编写的关于页。
- `content/blogs/`：之后迁入可核对来源的真实文章（Markdown + Frontmatter）。

新增文章示例：

```yaml
---
title: 文章标题
description: 摘要
type: article
path: /blogs/original-slug
date: YYYY-MM-DD
group: 日常
tags: [日常]
---
```

**注意**：Folio 0.1.1 的 Markdown 渲染器保留原始 HTML，不对恶意内容做清洗。只接入作者本人或维护者审核过的可信内容。

## 交付边界

当前增加了手动 GitHub Pages 公共评审预览，但没有自动覆盖 EdgeOne 的工作流。既有 `test.6260381.xyz` 网站不会因本 PR 被替换。正式上线仍按 `feat/* → dev → test → prod` 推进，需先确认域名、旧 URL、图片迁移及验收证据。

- [Folio 0.1.1 Release](https://github.com/uichat-mira/folio/releases/tag/folio-v0.1.1)
- [Folio consumer contract](https://github.com/uichat-mira/folio/blob/prod/docs/consumer-contract.md)
