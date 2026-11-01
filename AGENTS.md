# Moyu repository instructions

This site follows the current instructions in `uichat-mira/.github/AGENTS.md`.

## Ownership and scope

- This repository owns the personal site "摸鱼划水记录" only.
- The reusable Folio engine is owned by `uichat-mira/folio`. Consume its published npm package, currently `@uichat-mira/folio@0.1.1`; do not copy or patch library internals into this site.
- `content/` owns authored/reviewed Markdown articles and pages. Do not fabricate the owner's autobiographical posts, timestamps, photographs or attribution.
- `src/` owns site-specific layout and theme. `vite.config.ts` owns static output and SEO metadata.
- Folio's Markdown renderer supports trusted reviewed source only. Do not feed unreviewed submissions into it.

## Verification

```bash
npm ci --no-audit --no-fund
npm run check
```

The check must verify strict TypeScript, production build, HTML pages, sitemap, robots, and canonical URL. Also verify mobile and desktop layouts in a real browser before accepting visual changes.

## Environments

```text
feat/* -> dev -> test -> prod
```

Production deployment must not run from feature, dev, or test branches.
The current `test.6260381.xyz` site is an independent existing deployment; this repository does not control that domain unless explicit deployment credentials/routing are configured.
`SITE_ORIGIN` is the canonical HTTPS origin; `VITE_SITE_BASE` is the hosting base path (e.g. / for custom domain, /moyu/ for repository Pages).

## Assets

Optimize original images before accepting them into the repo. Prefer real author-owned originals with source metadata; generate thumbnails in WebP/AVIF when appropriate. Keep original archives outside Git unless small and explicitly required. Never claim the placeholder SVG is an old-site photo.
