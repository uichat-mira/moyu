# Moyu production deployment

## The only production pipeline

A push to `prod` triggers `.github/workflows/deploy-prod.yml`. GitHub Actions
checks out the Moyu source, installs dependencies, compiles and verifies the
static site, then directly uploads **dist/** via SSH/rsync to the approved
domestic server. The server does not run npm, Node or Folio.

For visual parity with the user-accepted GitHub Pages preview, the build
reads the **fixed Folio candidate commit**
`a0d7c88c23b1a9f39b56d016626c2257659b57ae` and packs it into the
Runner. No Folio repository is modified and no npm release is required.
The public Moyu manifest and lockfile still reference Folio 0.1.1.
This commit is fixed, not automatically upgraded. Future changes to
that build input must receive separate review and Moyu regression testing.

Do not overwrite the separate EdgeOne site `test.6260381.xyz`.

## Production environment configuration

Create the GitHub Actions environment `production` with the following
repository variables and secrets:

| Name | Kind | Purpose |
| --- | --- | --- |
| MOYU_SITE_ORIGIN | variable | Approved site URL, HTTPS origin only |
| MOYU_DEPLOY_HOST | variable | Authorized server IP/SSH hostname |
| MOYU_DEPLOY_USER | variable | Site-limited SSH deploy username |
| MOYU_DEPLOY_ROOT | variable | Dedicated server root under /srv/www |
| MOYU_DEPLOY_KEY | secret | Site-specific private SSH key |
| MOYU_KNOWN_HOSTS | secret | Independently verified SSH known-hosts entry |

None of these are configured at the time of writing. The workflow
**fails closed** if any required setting is missing. Do not invent
the IP, host, directory, SSH credentials or the owner's domain.

## One-time host setup

An authorized server operator verifies domain ownership and the
applicable ICP filing, adds a separate Caddy virtual host using
`ops/Caddyfile.example` and creates the dedicated directory, e.g.
`/srv/www/<approved-hostname>`. This path must NOT be Tomzlab's site.

Create `releases/` and an explicit empty `.moyu-site-root` marker
within that dedicated root. Make it writable to the site-specific SSH
account and readable to Caddy; the root's `current` path must be absent
or a symlink. The SSH host key must be verified independently before
adding it to GitHub Secrets.

Deployment writes only to `releases/<exact-commit-sha>/` and switches
`current` atomically to that release. It retains older releases for
rollback. Caddy reads only `<site-root>/current`. Do not replace the
existing Caddy config or its Tomzlab virtual host.

## Verification and promotion

Use the normal `feat/* → dev → test → prod` promotion. The workflow
builds the checked-out `prod` SHA on GitHub's Ubuntu runner. It uses
`VITE_SITE_BASE=/` and production `SITE_ORIGIN`. It checks article
routes, genuine static HTML, sitemap, images, TOC and footer before
upload; the deployment job verifies the explicit root marker and SSH
host identity; then HTTPS smoke checks the homepage, blog collection,
project collection, About and long article.

GitHub Pages remains an isolated review preview, not production.
Neither a successful PR merge nor a successful build-only step proves
the server was deployed.

Rollback: switch the dedicated root's `current` symlink to a previously
verified `releases/<sha>`. No server-side rebuild is required.
