# Moyu official site / ESA Pages production

## Release contract

- Official origin: `https://6260381.xyz` (apex); no `www` hostname is assumed.
- Source branch: `prod` only. The production workflow is `.github/workflows/esa-production.yml`.
- ESA Pages project: `moyu-esa-staging`, historically named at first staging deployment. The same project holds **separate staging and production code versions**.
- Existing validated test deployment: `test` → `.github/workflows/esa-pages.yml` → ESA `staging`. Never use a staging code-version ID for production.
- Preserve the exact accepted Folio build source commit `a0d7c88c23b1a9f39b56d016626c2257659b57ae`. Build with `SITE_ORIGIN=https://6260381.xyz`, `VITE_SITE_BASE=/`.
- Actions secrets are `ALIBABA_CLOUD_ACCESS_KEY_ID` and `ALIBABA_CLOUD_ACCESS_KEY_SECRET`; no SSH credentials or plaintext keys in git.

## Completed one-time migration and recurring release

The owner authorized replacing the previously non-functional domestic publishing path with an ESA Pages static website on 2026-11-06. Do **not** assume that a successful staging deployment means the ESA root site is already activated.

The production workflow deliberately fails before deployment unless `esa-cli site list` shows `6260381.xyz` activated. It publishes a new code version to `production`, then **checks** `esa-cli domain list` for an exact existing apex binding. It does not create, delete or replace any DNS records or domain binding during routine releases. If the binding is missing, the workflow fails closed and requires a separate reviewed repair.

The one-time migration to ESA completed in GitHub Actions run `42249069753`: the audited obsolete root A record was removed and the new ESA Pages apex binding was created. That migration is **not** part of future production runs. ESA domain binding creates the site's DNS record. If the site is connected through NS, authoritative DNS follows ESA once delegation has propagated. If connected through CNAME, the owner must still set the exact ESA-issued CNAME record with the authoritative DNS provider; the workflow intentionally cannot guess it. HTTPS also requires a valid ESA SSL/TLS certificate. No unrelated nameservers, subdomains or test routes are modified.

## Smoke and completion

After binding, the workflow checks homepage HTML and required Folio page markers, then HTTPS routes for blogs, projects, About, a long-form article, logo and favicon. A failed smoke makes the action red **even if production upload or domain binding succeeded**. Examine Actions steps individually before retrying; do not report success based solely on upload.

Do not change `test.6260381.xyz` (separate EdgeOne review site) or GitHub Pages review. If the official site does not resolve, check activation, NS/CNAME mode, authoritative DNS and SSL/TLS before attempting another build.

## Historical hosting

The former domestic Caddy/SSH server deployment instructions are superseded for this site. They applied to an older unproven delivery route and are not authority to reintroduce SSH credentials or overwrite other Mira Cloud infrastructure. The current owner-approved delivery route is the ESA workflow above.
