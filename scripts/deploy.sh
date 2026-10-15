#!/bin/sh
# Deploy on the VM, from the clone (~/GateBrain): bring in new code, rebuild, check it's healthy.
# The app commits to this same clone, so pull with rebase (its pushed commits are already on GitHub).
set -e
cd "$(dirname "$0")/.."
# Pull with GITHUB_TOKEN from .env (works for a private repo too), else this machine's git login.
token=$(grep -E '^GITHUB_TOKEN=' .env | cut -d= -f2-)
if [ -n "$token" ]; then
  auth=$(printf 'x-access-token:%s' "$token" | base64 | tr -d '\n')
  git -c credential.helper= -c "http.https://github.com/.extraheader=AUTHORIZATION: basic $auth" pull --rebase --autostash
else
  git pull --rebase --autostash
fi
docker compose up -d --build
docker image prune -f >/dev/null
port=$(grep -E '^GATEBRAIN_PORT=' .env | cut -d= -f2)
for i in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:${port:-3200}/api/health" >/dev/null; then echo "healthy"; exit 0; fi
  sleep 3
done
echo "health check failed"; docker compose logs app --tail 50; exit 1
