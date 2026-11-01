# Moyu repository instructions

Follow the current `uichat-mira/.github/AGENTS.md`.

## Boundaries

- This repo owns the personal site "摸鱼划水记录"; `uichat-mira/folio` owns the Folio runtime.
- Consume published `@uichat-mira/folio@0.1.1` through public entrypoints only.
- Use **Folio's built-in visual UI**: `FolioApp` and `@uichat-mira/folio/styles.css`. Do not introduce a custom homepage, alternative stylesheet or parallel static HTML template without explicit product approval.
- Markdown in `content/` must be written/reviewed by the owner. Do not invent biographical posts, dates, photos or attribution. Folio does not sanitize untrusted raw HTML.
- Use `SITE_ORIGIN` for canonical URLs and `VITE_SITE_BASE` for root or project path.

## Verification

```bash
npm ci --no-audit --no-fund
npm run check
```

Verify both root-domain and GitHub Pages project-path builds. The built-in UI should receive actual desktop and mobile browser acceptance before promotion.

## Deployment

`feat/* → dev → test → prod`. There is no active deploy integration for this repository. The existing EdgeOne site at `test.6260381.xyz` is a separate deployment and must not be overwritten without confirming its owner, current route set, and migration plan.

## Assets

Original photos should be inventoried and optimized after provenance is verified; no large image archive is stored in Git. Avoid using placeholder artwork to imply it originated from the former site.
