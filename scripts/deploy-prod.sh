#!/usr/bin/env bash
# Runs only in the prod GitHub Actions job, after a successful dist/ build.
# The deploy account needs write access only to the dedicated Moyu root.
set -euo pipefail

for variable in MOYU_DEPLOY_HOST MOYU_DEPLOY_USER MOYU_DEPLOY_ROOT MOYU_DEPLOY_KEY MOYU_KNOWN_HOSTS GITHUB_SHA GITHUB_REF; do
  if [[ -z "${!variable:-}" ]]; then
    echo "::error::Required deployment input $variable is not configured."
    exit 1
  fi
done

if [[ "$GITHUB_REF" != "refs/heads/prod" || ! "$GITHUB_SHA" =~ ^[0-9a-f]{40}$ ]]; then
  echo "::error::Only a pinned prod commit may deploy."
  exit 1
fi
if [[ ! "$MOYU_DEPLOY_HOST" =~ ^[A-Za-z0-9][A-Za-z0-9.-]*$ ||
      ! "$MOYU_DEPLOY_USER" =~ ^[A-Za-z_][A-Za-z0-9_-]*$ ]]; then
  echo "::error::Unsafe SSH host or username."
  exit 1
fi
if [[ ! "$MOYU_DEPLOY_ROOT" =~ ^/srv/www/[A-Za-z0-9][A-Za-z0-9._-]*$ ||
      "$MOYU_DEPLOY_ROOT" == *..* ||
      "$MOYU_DEPLOY_ROOT" == "/srv/www/tomzlab.cn" ]]; then
  echo "::error::MOYU_DEPLOY_ROOT must be a separate site root under /srv/www."
  exit 1
fi
if [[ ! -s dist/index.html || ! -s dist/404.html ]]; then
  echo "::error::No verified static build artifact to deploy."
  exit 1
fi

umask 077
mkdir -p "$HOME/.ssh"
printf '%s\n' "$MOYU_DEPLOY_KEY" > "$HOME/.ssh/moyu_deploy_key"
printf '%s\n' "$MOYU_KNOWN_HOSTS" > "$HOME/.ssh/known_hosts"
chmod 600 "$HOME/.ssh/moyu_deploy_key"
chmod 600 "$HOME/.ssh/known_hosts"
unset MOYU_DEPLOY_KEY MOYU_KNOWN_HOSTS

ssh_opts=(-i "$HOME/.ssh/moyu_deploy_key" -o BatchMode=yes -o StrictHostKeyChecking=yes -o IdentitiesOnly=yes)
remote="${MOYU_DEPLOY_USER}@${MOYU_DEPLOY_HOST}"
release="${MOYU_DEPLOY_ROOT}/releases/${GITHUB_SHA}"

# Never create or overwrite the hosting root implicitly. The server operator
# must create the directory, dedicated permissions, and .moyu-site-root marker.
ssh "${ssh_opts[@]}" "$remote" \
  "test -f '${MOYU_DEPLOY_ROOT}/.moyu-site-root' &&
   { test ! -e '${MOYU_DEPLOY_ROOT}/current' || test -L '${MOYU_DEPLOY_ROOT}/current'; } &&
   mkdir -p '${release}'"

# --delete operates ONLY inside the SHA-specific release directory.
rsync -az --delete -e "ssh -i $HOME/.ssh/moyu_deploy_key -o BatchMode=yes -o StrictHostKeyChecking=yes -o IdentitiesOnly=yes" \
  dist/ "${remote}:${release}/"

# Atomic site activation. Retain previous releases for manual rollback.
ssh "${ssh_opts[@]}" "$remote" \
  "test -s '${release}/index.html' &&
   ln -s 'releases/${GITHUB_SHA}' '${MOYU_DEPLOY_ROOT}/.moyu-next-${GITHUB_SHA}' &&
   mv -Tf '${MOYU_DEPLOY_ROOT}/.moyu-next-${GITHUB_SHA}' '${MOYU_DEPLOY_ROOT}/current'"

echo "Moyu production current now points at commit ${GITHUB_SHA}."
