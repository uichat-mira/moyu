# 摸鱼划水记录 / Moyu

Personal site built as an **independent consumer of the published Folio 0.1.1** runtime.

## Current status

The linked former test site is [test.6260381.xyz](https://test.6260381.xyz).
Its public HTML currently exposes the title, description and a prerender placeholder, but no usable article inventory or original photos. This repository initially contained only LICENSE. Therefore this is a **new site scaffold**, not a verified migration of former blog posts.

The home hero illustration is an original lightweight SVG made for this scaffold, not an original photo. Existing writing and photos should be imported only after provenance, permission, dates and original routes are confirmed.

## Development

Requires Node 22.12+ (Node 24 recommended).

```bash
npm ci --no-audit --no-fund
npm run dev
npm run check
```

Build for the current custom-domain candidate:

```powershell
$env:SITE_ORIGIN="https://test.6260381.xyz"
$env:VITE_SITE_BASE="/"
npm run check
```

Build a GitHub Pages repository-path candidate:

```powershell
$env:SITE_ORIGIN="https://uichat-mira.github.io"
$env:VITE_SITE_BASE="/moyu/"
npm run check
```

Folio creates `dist/index.html`, `dist/about/index.html`, `dist/404.html`, `dist/sitemap.xml` and `dist/robots.txt`; these are real prerendered pages, not an SPA-only fallback.

## Content

- `content/pages/about.md`: the verified site-purpose description.
- `content/blogs/`: future personally authored articles, with original provenance and reviewed Markdown.
- `public/pond.svg`: lightweight starter illustration.

Example article frontmatter (replace with real author-supplied content, **not** a fictitious demo):

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

Only trusted/reviewed Markdown is allowed: Folio 0.1.1 intentionally preserves unsafe raw HTML and URLs without sanitization.

## Deploy boundary

This repository currently adds CI only. It does **not** alter the existing EdgeOne deployment at `test.6260381.xyz`. Before switching DNS or routing, create the test branch and deployment integration, verify redirects for any former routes, verify assets, run HTTP smoke, and only promote accepted revisions through `dev → test → prod`.

## Background and package

- [Folio 0.1.1 release](https://github.com/uichat-mira/folio/releases/tag/folio-v0.1.1)
- [Folio consumer contract](https://github.com/uichat-mira/folio/blob/prod/docs/consumer-contract.md)
