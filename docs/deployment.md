# Moyu production release (Huawei ECS)

## Current production contract

- Official apex: `https://6260381.xyz`; `https://www.6260381.xyz` redirects to the apex.
- Source of truth: an exact accepted commit on `uichat-mira/moyu:prod`. Never deploy a moving branch head.
- Current production host: Huawei Cloud ECS `hcss-ecs-afed`, public IPv4 `124.70.99.72`.
- Host stack: Ubuntu 24.04 + BaoTa + Nginx.
- Static release root: `/www/wwwroot/6260381.xyz/releases/<MOYU_PROD_SHA>`.
- Active release: atomic symlink `/www/wwwroot/6260381.xyz/current`.
- Nginx vhost: `/www/server/panel/vhost/nginx/6260381.xyz.conf`.
- TLS: Let's Encrypt certificate under `/etc/letsencrypt/live/6260381.xyz/`; renewal is owned by the system `certbot.timer`.
- Build contract: `SITE_ORIGIN=https://6260381.xyz`, `VITE_SITE_BASE=/`, `npm run check`.
- Current Folio dependency: published `@uichat-mira/folio@0.2.0`.

## DNS

Authoritative DNS remains on ESA/ATrustDNS:

- `mount-tai.ns.atrustdns.com`
- `nasser.ns.atrustdns.com`

Production records are direct DNS-only records, not ESA-proxied traffic:

- `6260381.xyz` → A/AAAA value `124.70.99.72`, proxy off
- `www.6260381.xyz` → A/AAAA value `124.70.99.72`, proxy off

Do not change the nameserver delegation for routine releases. Do not turn ESA proxying back on unless the maintainer explicitly selects ESA as a rollback target and the ESA production artifact has been independently verified.

## Release procedure

1. Promote source through `feat/* → dev → test → prod`.
2. Record the exact 40-character `prod` SHA selected for release.
3. Build that exact commit from a clean install:
   - `npm ci --no-audit --no-fund`
   - `SITE_ORIGIN=https://6260381.xyz VITE_SITE_BASE=/ npm run check`
4. Package only `dist/`.
5. On Huawei, extract into a new immutable release directory under `/www/wwwroot/6260381.xyz/releases/<SHA>`.
6. Switch `current` atomically to the new release.
7. Run Nginx configuration validation before reload.
8. Verify local HTTPS on the host and public HTTPS from an independent client.
9. Verify the required product contract on the public site: Editorial home, article routes, `tzt2026` byline/avatar/profile, Git-native publication date, favicon/logo, and ICP footer.

A successful build, upload, DNS write, certificate issuance, or Nginx reload alone is not production acceptance.

## TLS renewal

HTTP remains reachable only to redirect ordinary traffic to HTTPS and to serve `/.well-known/acme-challenge/` from the active site root. Do not remove that exception: certbot uses it for renewal.

Before changing renewal configuration, preserve:

- `6260381.xyz` and `www.6260381.xyz` in the certificate SANs;
- DNS-only routing to the Huawei host while HTTP-01 validation is performed;
- a passing `nginx -t` before reload.

## ESA status

ESA Pages production is retired from the automatic release path. The historical production workflow may be kept only as a **manual emergency fallback** and must not trigger on `prod` pushes. ESA staging used by `test` is a separate verification surface and does not define production.

The one-time migration to ESA on 2026-11-06 and the later return to Huawei are historical evidence, not recurring release steps.

## Historical infrastructure

The older `uichat-mira/mira-cloud-infra` Moyu Caddy/SSH release path targets the previous domestic host and is not the current production authority. Its static release files may be retained for rollback/audit, but the Moyu Caddy import must remain disabled unless the maintainer explicitly reactivates that route.

Do not copy historical SSH credentials, overwrite unrelated `tomzlab.cn`/Mira Cloud ingress, or use that old workflow merely because it still exists.

## Current cutover evidence

The Huawei production cutover completed on 2026-11-26 with:

- deployed site source: `37cfac6be9b43c080e62b861d65fdfc28f670516` (the accepted `prod` commit selected at cutover)
- Folio: `0.2.0`
- Huawei release symlink targeting that exact Moyu SHA
- ESA apex + `www` records changed from proxied to DNS-only while preserving value `124.70.99.72`
- Let's Encrypt certificate covering both apex and `www`
- independent direct-Huawei HTTPS smoke covering homepage, article attribution, Git date, and ICP footer
