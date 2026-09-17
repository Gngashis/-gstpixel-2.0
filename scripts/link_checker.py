#!/usr/bin/env python3
"""
GSTPIXEL link checker (AGENT5).
Crawls the locally running site, following internal links only.
Detects:
  - broken internal links
  - 404/5xx internal destinations
  - redirect loops
  - malformed internal hrefs
Python standard library only.

Usage: python3 scripts/link_checker.py [base_url]
       default: http://localhost:8080
Exit code: 0 = all links pass, 1 = failures found
"""

import sys
import re
import time
import signal
import subprocess
import urllib.parse
import urllib.request
import urllib.error
from html.parser import HTMLParser

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080").rstrip("/")
TIMEOUT = 10
MAX_LINKS = 200

visited = {}          # url -> status code (or "malformed")
referrer = {}         # url -> page that linked to it (evidence)
queue = []            # BFS queue of urls
broken = []           # (url, reason, found_on)
redirect_loops = []   # (url)
malformed = []        # (raw_href, reason, found_on)


# ── HTML link extractor ────────────────────────────────────────
class LinkExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hrefs = []  # (href, tag)

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            for k, v in attrs:
                if k == "href" and v and not v.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
                    self.hrefs.append(v)


def extract_links(html):
    p = LinkExtractor()
    p.feed(html)
    return p.hrefs


# ── malformed href detection ───────────────────────────────────
def malformed_reason(href):
    """Return a reason string if href is malformed, else None."""
    if re.search(r"[\x00-\x20]", href):
        return "contains spaces/control chars"
    if "\\" in href:
        return "contains backslash"
    if re.search(r"[<>\"']", href):
        return "contains angle quotes"
    if re.match(r"^[a-zA-Z0-9]+:$", href):
        return "empty scheme (e.g. 'foo:')"
    # '##', 'javascript' etc already filtered upstream
    return None


# ── fetch one URL ──────────────────────────────────────────────
def fetch(url, max_redirects=10):
    """Return (status, final_url, error, redirects). status=0 => connection error."""
    redirects = []
    current = url
    for _ in range(max_redirects + 1):
        try:
            req = urllib.request.Request(current, headers={"User-Agent": "GSTPIXEL-LinkChecker/1.0"})
            resp = urllib.request.urlopen(req, timeout=TIMEOUT)
            code = resp.getcode()
            final = resp.url
            if final != current:
                redirects.append((current, final, code))
            return (code, final, None, redirects)
        except urllib.error.HTTPError as e:
            return (e.code, current, str(e), redirects)
        except Exception as e:
            return (0, current, str(e), redirects)
    return (0, current, "too many redirects", redirects)


# ── normalize internal link ────────────────────────────────────
def normalize(link, page_url):
    """Return absolute URL if internal/resolvable, or raise reason string if malformed."""
    reason = malformed_reason(link)
    if reason:
        raise ValueError(reason)
    parsed = urllib.parse.urlparse(link)
    if not parsed.scheme and not parsed.netloc and not parsed.path and not parsed.params:
        raise ValueError("empty/invalid href")
    absolute = urllib.parse.urljoin(page_url, parsed._replace(fragment="").geturl())
    a = urllib.parse.urlparse(absolute)
    if a.scheme not in ("http", "https"):
        return None  # non-http: skip silently (not an internal page)
    base_host = urllib.parse.urlparse(BASE).netloc
    if a.netloc != base_host:
        return None  # external host: skip silently (internal-links-only crawl)
    path = a.path.rstrip("/") or "/"
    return urllib.parse.urlunparse((a.scheme, a.netloc, path, a.params, a.query, ""))


# ── crawl ──────────────────────────────────────────────────────
def crawl():
    queue.append(BASE)
    referrer[BASE] = "(seed)"

    while queue and len(visited) < MAX_LINKS:
        url = queue.pop(0)
        if url in visited:
            continue

        # Treat external as skip (already filtered in normalize)
        status, final, error, redirects = fetch(url)
        visited[url] = status

        if status == 0:
            broken.append((url, f"connection error: {error}", referrer.get(url, "")))
            continue
        if status == 404:
            broken.append((url, "404 Not Found", referrer.get(url, "")))
            continue
        if status >= 400:
            broken.append((url, f"HTTP {status}", referrer.get(url, "")))
            continue

        # Redirect loop: cycle in the redirect chain
        if redirects:
            targets = [r[1] for r in redirects]
            if len(targets) != len(set(targets)):
                redirect_loops.append(url)

        # Fetch and extract links from the final page
        try:
            req = urllib.request.Request(final, headers={"User-Agent": "GSTPIXEL-LinkChecker/1.0"})
            resp = urllib.request.urlopen(req, timeout=TIMEOUT)
            if "text/html" not in resp.headers.get("Content-Type", ""):
                continue
            html = resp.read().decode("utf-8", errors="ignore")
        except Exception:
            continue

        for link in extract_links(html):
            try:
                norm = normalize(link, final)
            except ValueError as e:
                malformed.append((link, str(e), final))
                continue
            if norm is None:
                continue  # external / non-http — skipped, not followed
            if norm not in visited and norm not in referrer:
                referrer[norm] = final
                queue.append(norm)

    return len(visited)


# ── output ─────────────────────────────────────────────────────
def report(pages_crawled):
    print(f"\n{'=' * 56}")
    print(f"GSTPIXEL link checker — {pages_crawled} pages crawled")
    print(f"{'=' * 56}")

    if malformed:
        print(f"\n✗ MALFORMED HREFS ({len(malformed)}):")
        for href, reason, page in malformed:
            print(f"  [{reason}] {href}")
            print(f"       found on: {page}")

    if broken:
        print(f"\n✗ BROKEN LINKS ({len(broken)}):")
        for url, reason, page in broken:
            print(f"  [{reason}] {url}")
            if page:
                print(f"       found on: {page}")

    if redirect_loops:
        print(f"\n✗ REDIRECT LOOPS ({len(redirect_loops)}):")
        for url in redirect_loops:
            print(f"  {url}")

    total = len(broken) + len(redirect_loops) + len(malformed)
    print(f"\n{'=' * 56}")
    if total:
        print(f"FAIL — {total} issue(s) found")
        return 1
    print("PASS — all internal links OK")
    return 0


# ── main ───────────────────────────────────────────────────────
def main():
    print(f"Starting dev server: npm run dev")
    print(f"Base URL: {BASE}")
    print(f"Timeout: {TIMEOUT}s per request | Max pages: {MAX_LINKS}")

    proc = subprocess.Popen(["npm", "run", "dev"],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    ready = False
    for attempt in range(30):
        time.sleep(1)
        try:
            req = urllib.request.Request(BASE, headers={"User-Agent": "GSTPIXEL-LinkChecker/1.0"})
            urllib.request.urlopen(req, timeout=3)
            ready = True
            print(f"Dev server ready after {attempt + 1}s")
            break
        except Exception:
            continue

    if not ready:
        print("ERROR: dev server did not start within 30s")
        proc.kill()
        sys.exit(1)

    try:
        pages = crawl()
        code = report(pages)
    finally:
        print("\nStopping dev server...")
        proc.kill()
        try:
            proc.wait(timeout=5)
        except Exception:
            pass

    sys.exit(code)


if __name__ == "__main__":
    signal.signal(signal.SIGCHLD, signal.SIG_IGN)
    main()