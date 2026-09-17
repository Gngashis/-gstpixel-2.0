#!/usr/bin/env bash
set -euo pipefail

FAIL=0
PASS=0

pass() { PASS=$((PASS + 1)); printf "  PASS  %s\n" "$1"; }
fail() { FAIL=$((FAIL + 1)); printf "  FAIL  %s\n" "$1"; }

# ── preflight ──
if [ ! -f package.json ]; then
  fail "not a project root (no package.json)"
  exit 1
fi

# ── 1. production build output exists ──
if [ -d .output ]; then
  pass ".output directory exists"
else
  fail ".output directory missing — run 'npm run build' first"
fi

# ── 2. Cloudflare/Nitro worker bundle ──
if [ -f .output/server/index.mjs ]; then
  pass "worker entry .output/server/index.mjs exists"
else
  fail "worker entry .output/server/index.mjs missing"
fi

# ── 3. required runtime entrypoints ──
if [ -f .output/server/wrangler.json ]; then
  pass "wrangler.json generated"
else
  fail "wrangler.json missing"
fi

if [ -f .output/public/_headers ]; then
  pass "_headers file generated"
else
  fail "_headers missing"
fi

# ── 4. route-generation sanity ──
if find .output/server -name "routes-*.mjs" -type f 2>/dev/null | grep -q .; then
  pass "routes chunk generated"
else
  fail "routes chunk missing (route generation issue)"
fi

# ── 5. secret scan (obvious patterns in config/env) ──
SECRET_PATTERNS=(
  "api[_-]?key"
  "secret"
  "token"
  "password"
  "private[_-]?key"
  "access[_-]?token"
  "client[_-]?secret"
)

SECRET_FOUND=0
CHECK_FILES=(.output/server/wrangler.json .output/public/_headers .output/nitro.json vite.config.ts wrangler.json)
for f in "${CHECK_FILES[@]}"; do
  [ -f "$f" ] || continue
  for pat in "${SECRET_PATTERNS[@]}"; do
    if grep -qiE "$pat" "$f" 2>/dev/null; then
      # allow known safe false positives
      if ! grep -qE "(test|example|placeholder|dummy|your-|change-me)" "$f" 2>/dev/null; then
        fail "potential secret pattern '$pat' in $f"
        SECRET_FOUND=1
      fi
    fi
  done
done
# also check any .env files
for f in .env*; do
  [ -f "$f" ] || continue
  for pat in "${SECRET_PATTERNS[@]}"; do
    if grep -qiE "$pat" "$f" 2>/dev/null; then
      if ! grep -qE "(test|example|placeholder|dummy|your-|change-me)" "$f" 2>/dev/null; then
        fail "potential secret pattern '$pat' in $f"
        SECRET_FOUND=1
      fi
    fi
  done
done
[ "$SECRET_FOUND" -eq 0 ] && pass "no obvious secrets in config/env files"

# ── 6. key public routes in built output ──
ROUTES=("index" "services" "tools" "start-your-project" "contact" "about" "privacy")
MISSING=0
for r in "${ROUTES[@]}"; do
  # check SSR entry exists for route
  if find .output/server -name "*${r}*.mjs" -type f 2>/dev/null | grep -q .; then
    pass "route '$r' has SSR bundle"
  else
    # fallback: check for route in routes manifest
    ROUTES_FILE=$(find .output/server -name "routes-*.mjs" -type f 2>/dev/null | head -1)
    if [ -n "$ROUTES_FILE" ] && grep -q "\"$r\"" "$ROUTES_FILE" 2>/dev/null; then
      pass "route '$r' in routes manifest"
    else
      fail "route '$r' not found in built output"
      MISSING=$((MISSING + 1))
    fi
  fi
done

# ── summary ──
TOTAL=$((PASS + FAIL))
printf "\n%s\n" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
printf "  %d/%d pre-deploy checks passed" "$PASS" "$TOTAL"
if [ "$FAIL" -gt 0 ]; then
  printf "  (%d FAILED)" "$FAIL"
fi
printf "\n%s\n" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

[ "$FAIL" -eq 0 ] && exit 0 || exit 1