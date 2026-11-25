# Moyu repository instructions

Follow the current `uichat-mira/.github/AGENTS.md`.

## Boundaries

- This repo owns the personal site "摸鱼划水记录"; `uichat-mira/folio` owns the Folio runtime.
- Consume published `@uichat-mira/folio@0.2.0` through public entrypoints only.
- The publicly accepted Pages UI is built with an **exact, frozen Folio source commit** packed read-only during GitHub Actions. Changing that source SHA requires independent Moyu verification and an explicit release review. Production must also be built from an exact accepted Moyu `prod` commit; never deploy a moving branch head.
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

Official production is the Huawei Cloud ECS `hcss-ecs-afed` at `124.70.99.72`, using the existing BaoTa-managed Nginx stack. The static site lives under `/www/wwwroot/6260381.xyz/releases/<MOYU_PROD_SHA>` with an atomic `current` symlink; the vhost is `/www/server/panel/vhost/nginx/6260381.xyz.conf`. Production TLS uses Let's Encrypt through certbot and must preserve HTTP ACME challenge reachability for renewal.

Authoritative DNS remains on ESA/ATrustDNS. The apex and `www` records are DNS-only A/AAAA records whose value is `124.70.99.72`; ESA proxying is **off** for production. The former ESA Pages production workflow is legacy fallback only and must not run automatically on `prod` pushes. ESA staging under `test` may remain as a separate verification surface.

Do not use the historical `mira-cloud-infra` Caddy/SSH Moyu release path as production authority: it targets the older domestic host and is retained only as historical/rollback infrastructure unless the maintainer explicitly reactivates it. Production is not accepted until the exact `prod` build, Huawei Nginx/TLS, DNS-only routing, and public HTTPS behavior are all observable.

## Assets

Original photos should be inventoried and optimized after provenance is verified; no large image archive is stored in Git. Avoid using placeholder artwork to imply it originated from the former site.
