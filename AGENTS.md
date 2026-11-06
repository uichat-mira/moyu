# Moyu repository instructions

Follow the current `uichat-mira/.github/AGENTS.md`.

## Boundaries

- This repo owns the personal site "摸鱼划水记录"; `uichat-mira/folio` owns the Folio runtime.
- Consume published `@uichat-mira/folio@0.1.1` through public entrypoints only.
- The publicly accepted Pages UI is built with an **exact, frozen Folio source commit** packed read-only during GitHub Actions. The production deployment workflow owned by `uichat-mira/mira-cloud-infra` may reuse that same audited SHA solely as a build-time input, without editing the Folio repository, releasing Folio, changing the package lockfile, or using a moving branch head. This is a temporary site-specific build exception; changing the SHA requires independent Moyu verification and an explicit release review.
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

`feat/* → dev → test → prod` governs production promotion. GitHub Pages at `https://uichat-mira.github.io/moyu/` is a separate **public review preview**, explicitly requested by the maintainer. The `pages-preview.yml` workflow deploys only from the isolated `pages-preview` branch (promoted there explicitly by its maintainer), never automatically on PR, feature, dev or test pushes; this preview is not production acceptance or promotion. The existing EdgeOne site at `test.6260381.xyz` is an independent deployment and must not be overwritten without confirming its owner, current route set, and migration plan.

The site owner has authorized ESA Pages as the production deployment target. `.github/workflows/esa-production.yml` runs only on `prod`, uses the exact reviewed Folio build input, publishes to the ESA Pages `production` environment, binds the official apex domain only after checking ESA site activation, and requires live HTTPS smoke. The prior domestic SSH deployment is superseded; do not reintroduce SSH production credentials or alter the separate EdgeOne test site. A production deployment or binding is not accepted until observable runtime evidence exists.

## Assets

Original photos should be inventoried and optimized after provenance is verified; no large image archive is stored in Git. Avoid using placeholder artwork to imply it originated from the former site.
