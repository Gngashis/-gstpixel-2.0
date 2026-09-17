#!/usr/bin/env bash
set -euo pipefail

PORT=8798
TIMEOUT=20
FAIL=0
PASS=0
ROUTES=("/" "/services" "/tools" "/start-your-project" "/contact" "/?utm_source=smoke")

pass() { PASS=$((PASS + 1)); printf "  PASS  %s\n" "$1"; }
fail() { FAIL=$((FAIL + 1)); printf "  FAIL  %s\n" "$1"; }

run_check() {
  local label="$1"; shift
  printf "[%s]\n" "$label"
  if "$@" >/tmp/health-check-$label.log 2>&1; then
    pass "$label"
  else
    fail "$label (exit $?)"
    sed 's/^/        /' /tmp/health-check-$label.log | tail -8
  fi
}

# ── preflight ──
if [ ! -f package.json ]; then
  printf "FAIL  not a project root (no package.json)\n"
  exit 1
fi

# ── checks ──
run_check typecheck npx tsc --noEmit
run_check lint      npx eslint src/ --quiet
run_check build     npm run build

# ── route smoke ──
printf "[smoke]\n"
if [ ! -d .output ]; then
  fail "smoke (no .output — run build first)"
else
  npx wrangler dev --config .output/server/wrangler.json \
    --compatibility-date 2026-09-16 --port "$PORT" \
    >/tmp/health-check-wrangler.log 2>&1 &
  WRANGLER_PID=$!

  # wait for port to be ready (up to 30s)
  READY=0
  for _ in $(seq 1 30); do
    if curl -sS -o /dev/null "http://127.0.0.1:$PORT/" 2>/dev/null; then
      READY=1; break
    fi
    sleep 1
  done

  if [ "$READY" -eq 0 ]; then
    fail "smoke (wrangler failed to start within 30s)"
    sed 's/^/        /' /tmp/health-check-wrangler.log | tail -6
  else
    for route in "${ROUTES[@]}"; do
      body="/tmp/health-check-body-$RANDOM"
      status=$(curl -sS -o "$body" -w '%{http_code}' "http://127.0.0.1:$PORT$route" 2>/dev/null || echo "000")
      title=$(grep -ao '<title>[^<]*</title>' "$body" 2>/dev/null | head -1 || true)
      rm -f "$body"

      if [ "$status" = "200" ] && [ -n "$title" ]; then
        pass "smoke $route → $status $title"
      else
        fail "smoke $route → $status"
      fi
    done

    kill "$WRANGLER_PID" 2>/dev/null || true
    wait "$WRANGLER_PID" 2>/dev/null || true
  fi
fi

# ── cleanup ──
rm -f /tmp/health-check-*

# ── summary ──
TOTAL=$((PASS + FAIL))
printf "\n%s\n" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
printf "  %d/%d checks passed" "$PASS" "$TOTAL"
if [ "$FAIL" -gt 0 ]; then
  printf "  (%d FAILED)" "$FAIL"
fi
printf "\n%s\n" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit "$FAIL"
