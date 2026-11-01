# Moyu production release (Infra-owned)

The only server deployment owner is `uichat-mira/mira-cloud-infra`:
`.github/workflows/moyu-release.yml` on its protected `prod` branch.
Moyu **does not** have an SSH deployment workflow or server credentials.

## Release contract

1. Promote the Moyu site source through `feat/* → dev → test → prod`;
   validate the exact `prod` commit using Moyu CI.
2. In Infra's `prod` workflow **Publish Moyu static site**, supply the
   exact 40-character Moyu `prod` commit SHA. It verifies that commit is
   an ancestor of current Moyu `prod` before building.
3. Infra's GitHub Runner installs Moyu and packs the **exact Folio source
   candidate previously accepted in the public Pages preview**. This is
   a read-only immutable build input, not a Folio release or dependency
   upgrade. The public Moyu package manifest still pins Folio 0.1.1.
4. Infra compiles `dist/` under `SITE_ORIGIN=https://6260381.xyz`,
   `VITE_SITE_BASE=/`, executes `npm run check`, and uploads only
   static output to the Guangzhou origin.
5. Infra owns the dedicated Caddy vhost, isolated
   `/srv/www/6260381.xyz/releases/<SHA>` directory, atomic
   `current` switch, rollback and HTTPS origin smoke.

Moyu's CI validates the root domain and the separate public
GitHub Pages project-path preview. A passing CI does not certify
the real Caddy origin; Infra's protected production job must produce
its own live HTTP/TLS evidence.

**Do not run another Moyu-owned deploy workflow**, copy Infra credentials
to Moyu, replace `tomzlab.cn`'s Caddy vhost, change Folio repositories,
or overwrite the independent EdgeOne `test.6260381.xyz` site.

## DNS and domain

Official apex domain: `6260381.xyz` (www may redirect to apex).
Its authoritative A record points to the designated Guangzhou server;
DNS changes belong to the domain owner, not to the deploy action.
The static site's owner-provided ICP footer is preserved.
