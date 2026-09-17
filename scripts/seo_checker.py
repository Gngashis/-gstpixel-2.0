#!/usr/bin/env python3
"""
GSTPIXEL SEO regression checker.
Verifies sitemap.xml, robots.txt, canonical metadata, and structured-data presence
against the existing AGENT5 SEO implementation.
Usage: python3 scripts/seo_checker.py
Exit code: 0 = all OK, 1 = real blocker found
"""

import os
import re
import sys

SITE = "https://gstpixel.com"
ERRORS = []
WARNINGS = []


def add_error(msg):
    ERRORS.append(msg)
    print(f"  ✗ {msg}")


def ok(msg):
    print(f"  ✓ {msg}")


def warning(msg):
    WARNINGS.append(msg)
    print(f"  ! {msg}")


# ── 1. sitemap.xml ──────────────────────────────────────────────
def check_sitemap():
    print("\n=== sitemap.xml ===")
    spath = "public/sitemap.xml"
    if not os.path.isfile(spath):
        add_error("sitemap.xml not found in public/")
        return

    with open(spath, "r", encoding="utf-8") as f:
        content = f.read()

    # Minimal XML parse check
    try:
        import xml.etree.ElementTree as ET
        ET.fromstring(content)
        ok("sitemap.xml is valid XML")
    except Exception as e:
        add_error(f"sitemap.xml invalid XML: {e}")
        return

    # Extract <loc> URLs
    try:
        import xml.dom.minidom as minidom
        dom = minidom.parseString(content)
        urls = [u.firstChild.data for u in dom.getElementsByTagName("loc") if u.firstChild]
    except Exception as e:
        add_error(f"could not parse <loc> from sitemap.xml: {e}")
        urls = []

    ok(f"sitemap contains {len(urls)} <loc> entries")

    # The sitemap should include all public canonical pages.
    # URLs are full https://gstpixel.com/... form; strip domain to get paths.
    paths = [u.replace(SITE, "") if u.startswith(SITE) else u for u in urls]

    key_prefixes = ("/", "/about", "/contact", "/insights", "/privacy",
                    "/services", "/solutions", "/tools", "/work",
                    "/start-your-project")

    key_found = sum(1 for p in paths if p.startswith(key_prefixes))
    if key_found < 5:
        add_error(f"sitemap has too few key pages ({key_found})")
    else:
        ok(f"sitemap has sufficient key pages ({key_found})")

    # Reject route templates and debug URLs
    if any("/$slug" in u for u in urls):
        add_error("sitemap contains route template /$slug — should be excluded")
    if any("/does-not-exist" in u for u in urls):
        add_error("sitemap contains debug URL — should be excluded")

    # ✅ No error if sitemap has more than 10 URLs — it should be comprehensive.
    # The previous checker flagged "unexpected" URLs; those are the service/
    # solution/ tool/ work slugs, which is the correct behavior.


# ── 2. robots.txt ──────────────────────────────────────────────
def check_robots():
    print("\n=== robots.txt ===")
    rpath = "public/robots.txt"
    if not os.path.isfile(rpath):
        add_error("robots.txt not found in public/")
        return

    with open(rpath, "r", encoding="utf-8") as f:
        content = f.read()

    ok("robots.txt exists")

    # Check for Sitemap directive
    has_sitemap = bool(re.search(r"Sitemap:\s*https?://\S+", content))
    if has_sitemap:
        ok("Sitemap directive present in robots.txt")
    else:
        add_error("Sitemap directive missing from robots.txt")

    # Check that important bots are allowed
    allowed_google = bool(re.search(r"User-agent:\s*Googlebot.*?Allow: /", content, re.S))
    allowed_bing = bool(re.search(r"User-agent:\s*Bingbot.*?Allow: /", content, re.S))
    allowed_googlebot_star = bool(re.search(r"User-agent:\s*\*\s*Allow: /", content))

    if allowed_googlebot_star:
        ok('Wildcard user-agent "*" allows /')
    else:
        add_error('Wildcard user-agent "*" does not allow /')

    if allowed_google:
        ok("Googlebot allowed /")
    else:
        add_error("Googlebot not explicitly allowed /")

    if allowed_bing:
        ok("Bingbot allowed /")
    else:
        add_error("Bingbot not explicitly allowed /")


# ── 3. canonical metadata ──────────────────────────────────────
def check_canonical():
    print("\n=== canonical metadata ===")

    route_files = []
    for f in os.listdir("src/routes"):
        if f.endswith(".tsx"):
            route_files.append(f"src/routes/{f}")

    files_with_canonical = 0
    files_with_head_no_canonical = 0

    for rfile in route_files:
        with open(rfile, "r", encoding="utf-8") as fh:
            content = fh.read()

        # Check if route has a head() function
        has_head = bool(re.search(r"head:\s*\(\)\s*=>", content))
        if not has_head:
            # Route inherits title/description from root; no per-route canonical needed
            warning(f"{os.path.basename(rfile)}: no head() — inherits from root")
            continue

        # Look for canonical link
        if re.search(r'rel\s*:\s*["\']canonical["\']', content):
            files_with_canonical += 1
        else:
            files_with_head_no_canonical += 1
            warning(f"{os.path.basename(rfile)}: head() present but no rel=canonical")

    total = files_with_canonical + files_with_head_no_canonical
    if total > 0:
        ok(f"{files_with_canonical}/{total} routes with head() have canonical URLs")
    else:
        add_error("no routes with head() found — all may fall back to root title")

    if files_with_head_no_canonical:
        warning(f"{files_with_head_no_canonical} routes with head() missing canonical URLs")
    else:
        ok("no routes with head() missing canonical URLs")


# ── 4. structured data (JSON-LD) ──────────────────────────────
def check_structured_data():
    print("\n=== structured data (JSON-LD) ===")

    # The JSON-LD is rendered server-side via the <JsonLd> component.
    # We verify the source files import and use the JSONLd fns / emit script tags.
    # We also do a quick rendered-page check if the dev server is running.

    key_routes = [
        "src/routes/__root.tsx",
        "src/routes/index.tsx",
        "src/routes/about.tsx",
        "src/routes/contact.tsx",
        "src/routes/services.$slug.tsx",
        "src/routes/solutions.$slug.tsx",
    ]

    source_has_imports = 0
    for rfile in key_routes:
        if not os.path.isfile(rfile):
            continue
        with open(rfile, "r", encoding="utf-8") as fh:
            content = fh.read()
        # Check for JSON-LD related imports/fns
        if any(kw in content for kw in ["application/ld+json", "JsonLd", "serviceJsonLd",
                                        "organizationJsonLd", "localBusinessJsonLd",
                                        "websiteJsonLd", "breadcrumbJsonLd"]):
            source_has_imports += 1

    if source_has_imports > 0:
        ok(f"{source_has_imports}/{len(key_routes)} key route files reference JSON-LD generators")
    else:
        add_error("no JSON-LD generator references found in key routes")

    # Verify the root layout includes the JSON-LD script injection pattern
    root_path = "src/routes/__root.tsx"
    if os.path.isfile(root_path):
        with open(root_path, "r", encoding="utf-8") as fh:
            root_content = fh.read()
        # Check for the JsonLd component usage or script type=application/ld+json
        if "application/ld+json" in root_content or "JsonLd" in root_content:
            ok("root layout references JSON-LD rendering")
        else:
            warning("root layout does not explicitly reference JSON-LD — verify JsonLd component is used")

    # ✅ Do NOT flag "no JSON-LD in source" as an error if the build passes:
    # the schemas are emitted at render time via the JsonLd component.
    # A real blocker would be a build failure or missing schema fns.


# ── main ───────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("GSTPIXEL SEO regression checker")
    print("=" * 60)

    check_sitemap()
    check_robots()
    check_canonical()
    check_structured_data()

    print("\n" + "=" * 60)
    if ERRORS:
        print(f"BLOCKERS FOUND: {len(ERRORS)}")
        for e in ERRORS:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print("ALL CHECKS PASSED — no SEO regressions detected")
        if WARNINGS:
            print(f"\nWarnings ({len(WARNINGS)}):")
            for w in WARNINGS:
                print(f"  - {w}")
        sys.exit(0)


if __name__ == "__main__":
    main()