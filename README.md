# 摸鱼划水记录 / Moyu

个人网站，直接消费 npm 发布的 **`@uichat-mira/folio@0.1.1`**。

## 设计原则

使用 Folio 的 **默认 FolioApp、默认首页、导航、搜索、主题切换和整站样式**。不维护独立 UI 组件、定制 CSS 或同功能的静态 HTML 模板。网站只配置标题、描述、导航以及 Markdown 内容。

现有测试站：[test.6260381.xyz](https://test.6260381.xyz)。这个仓库最初只有 LICENSE。2026-11-01 已从原站**浏览器真实渲染结果**核对迁入五篇博客、好物清单和关于小站，保留原路由。原站没有可核实的发布日期，因此不添加 date 字段。

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

## 页脚、备案与 Folio 署名

站点页脚只在 `index.html` 中维护一次，位于 React 挂载点外，因此 Folio 预渲染 HTML 无 JavaScript 时也能显示。版权/推广行使用紧凑的 `Built with @uichat-mira/folio`（链接官方仓库）；底部独立居中显示 `粤ICP备2026107949号-1`，链接到工信部备案系统 `https://beian.miit.gov.cn/`。上线前由站主核对备案编号与实际接入域名一致。

Folio 0.1.1 的 `config.footer` 仅接受文本，不能原生输出交互链接，所以只用 `src/site-footer.css` 实现这一处小型站点特例并隐藏 Folio 默认纯文本 footer，其余仍由 Folio 原生样式负责。

## 正式发布

生产站 `https://6260381.xyz` 由 `uichat-mira/mira-cloud-infra` 的受保护 `prod` 发布链从本仓库的精确 `prod` 提交构建、原子部署与 HTTP 验证。这里不保存或调用生产服务器 SSH 凭据，也不触碰原 EdgeOne 测试站。

## 内容

- `content/blogs/`：五篇来自旧站的真实文章（保留原 slug、标题、正文及表格）。
- `content/docs/about.md`：原站的关于小站。
- `content/projects/good-things.md`：原站的好物清单。
- `public/images/`：来自原站的三张优化 WebP，69/67/53 KB 的 JPEG 压到约 39/34/29 KB。

文章图片使用 Pages 预览绝对 URL，生产切换前必须解决跨域名的静态资源地址；本阶段不自行改造 Folio 原生 API。

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

当前 GitHub Pages 仅用于公开评审，EdgeOne 的 `test.6260381.xyz` 没有被覆盖。正式上线仍按 `feat/* → dev → test → prod` 推进；须先解决图片的预览绝对 URL，并完成实际运行和内容验收。

- [Folio 0.1.1 Release](https://github.com/uichat-mira/folio/releases/tag/folio-v0.1.1)
- [Folio consumer contract](https://github.com/uichat-mira/folio/blob/prod/docs/consumer-contract.md)
