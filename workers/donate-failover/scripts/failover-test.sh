#!/usr/bin/env bash
# End-to-end failover test against a running `npm run dev:down`
# (PRIMARY_URL points at a dead local port, so every health check fails).
#
#   terminal 1:  npm run dev:down
#   terminal 2:  npm run failover-test
set -euo pipefail
BASE="${BASE:-http://localhost:8787}"

loc() { curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' "$BASE$1"; }

echo "1. Before any cron run (empty KV) — expect PledgeCart (fail open):"
loc "/donate/?utm_source=test"

echo; echo "2. Trigger the cron (double-check waits ~5s)..."
curl -s "$BASE/__scheduled?cron=*/2+*+*+*+*" >/dev/null
sleep 1

echo; echo "3. After cron marks primary down — expect backup:"
loc "/donate?utm_source=test"
loc "/donate/"

echo; echo "4. Status endpoint (expect 503, routing.target=backup):"
curl -s -w '\nHTTP %{http_code}\n' "$BASE/__status"

echo; echo "5. Non-donate path under the route — expect 404 on dev (pass-through on vpm.org):"
loc "/donations"
