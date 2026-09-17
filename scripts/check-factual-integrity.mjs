#!/usr/bin/env node
/**
 * GSTPIXEL factual-integrity checker (read-only).
 *
 * Verifies two things across src/ (excluding the canonical business-facts
 * module, src/lib/content.ts):
 *
 *  1. No risky / unsupported claims remain — absolute or invented credibility
 *     wording that should have been removed or rewritten to be factual.
 *  2. No duplicated hardcoded business facts — phone numbers, emails, GSTIN,
 *     address fragments, WhatsApp URL and the exact tagline must live ONLY in
 *     the canonical businessFacts source, not repeated across pages/components.
 *
 * Exits 0 (PASS) if clean, 1 (FAIL) if any violation is found. Prints
 * file:line for each violation.
 *
 * Uses only Node.js stdlib (fs, path, readline/string ops). No dependencies.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

// Canonical business-facts module. Values here are the single source of truth
// and are intentionally exempt from the "duplicated hardcoded fact" check.
const CANONICAL_FILE = join("src", "lib", "content.ts");

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, "src");

// ---------------------------------------------------------------------------
// 1. Risky / unsupported claims
// ---------------------------------------------------------------------------
// Each entry: { regex, label }. Matches are flagged unless the surrounding line
// contains an explicit safe/negated phrase (allowlist).
const RISKY_CLAIMS = [
  { label: "absolute compliance claim", regex: /fully\s+compliant/i },
  { label: "implied legal structure", regex: /registered\s+indian\s+business/i },
  { label: "implied availability (anytime)", regex: /\banytime\b/i },
  { label: "unsupported 24/7 availability", regex: /\b24\s*\/?\s*7\b|\b24x7\b/i },
  { label: "implied walk-in office", regex: /physical\s+office/i },
  { label: "implied walk-in office (visit us)", regex: /\bvisit\s+us\b/i },
  { label: "unsupported HSTS/secure-header claim", regex: /hsts\s+and\s+secure\s+headers/i },
  { label: "absolute first-party-only claim", regex: /only\s+first[- ]party\s+assets/i },
  { label: "false no-third-party claim", regex: /no[-\s]?analytics,\s*tracking,\s*or\s*third[- ]party\s+scripts\s+without\s+consent/i },
  { label: "unsupported guarantee (non-disclaimer)", regex: /\bguarantee(s|d)?\b/i },
  { label: "unsupported certification claim", regex: /\bcertified\b/i },
  { label: "unsupported approval claim", regex: /\bapproved\s+by\s+(the\s+)?government/i },
];

// Phrases that legitimately contain risky words but are factual disclaimers or
// rejections of the claim. If a line contains any of these, it is not flagged.
const CLAIM_ALLOWLIST = [
  "not a guarantee",
  "not a government portal",
  "is not a government portal",
  "not legal advice",
  "not legal, tax, regulatory",
  "not legal or tax advice",
  "does not constitute legal advice",
  "not partnership, endorsement, or certification",
  "no invented prices, guarantees",
  "not an audit, benchmark, or certification",
  "confirm official requirements",
  "confirm the registration directly",
  "verify the registration directly",
  "is not asserted here",
  "no advertising pixels, social media trackers",
  "the only third-party request",
  "web fonts load from google's cdn",
  "fonts are served from google's font cdn",
  "hosting edge",
  "not configured in this codebase",
  "arranged in advance",
  "meetings are arranged in advance",
];

// ---------------------------------------------------------------------------
// 2. Duplicated hardcoded business facts
// ---------------------------------------------------------------------------
// Literal business-identity values. Outside the canonical module these are
// duplicates to be avoided. Numbers are matched both with and without spaces /
// country-code grouping to catch formatting variants.
const HARDCODED_FACTS = [
  { label: "primary India phone", regex: /90465\s*20548|9046520548/ },
  { label: "alternate India phone", regex: /81160\s*76725|8116076725/ },
  { label: "Bhutan phone", regex: /77260\s*538|77260538/ },
  { label: "support email", regex: /support\@gstpixel\.(com|in)/i },
  { label: "GSTIN", regex: /19ESPPG2569P1ZP/ },
  { label: "address (Ramgaon)", regex: /Ramgaon/i },
  { label: "address (Anthony School)", regex: /Anthony\s+School/i },
  { label: "address (postcode)", regex: /736182/ },
  { label: "WhatsApp URL", regex: /wa\.me\/919046520548/ },
  { label: "tagline", regex: /Start\s+Right\.\s+Stay\s+Compliant\.\s+Grow\s+Online\./ },
];

// Lines within src/lib/content.ts that are allowed to contain hardcoded facts.
const FACTS_ONLY_IN_CANONICAL =
  "hardcoded business facts must live only in the canonical module " +
  "(src/lib/content.ts)";

// ---------------------------------------------------------------------------
// Walk src/ for .ts/.tsx files, skipping the canonical module.
// ---------------------------------------------------------------------------
function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      yield* walk(full);
    } else if (/(\.tsx?|\.jsx?|\.mjs)$/.test(name)) {
      yield full;
    }
  }
}

const canonicalAbs = join(ROOT, CANONICAL_FILE);
const violations = [];
const fileCount = { scanned: 0 };

function report(file, line, col, kind, label, match) {
  violations.push({ file, line, col, kind, label, match });
}

for (const abs of walk(SRC_DIR)) {
  if (abs === canonicalAbs) continue; // canonical source is the source of truth
  const rel = relative(ROOT, abs);
  fileCount.scanned += 1;

  const content = readFileSync(abs, "utf8");
  const lines = content.split("\n");

  lines.forEach((text, idx) => {
    const line = idx + 1;

    // -- risky claims --
    for (const { regex, label } of RISKY_CLAIMS) {
      const m = regex.exec(text);
      if (!m) continue;
      const lower = text.toLowerCase();
      const allowed = CLAIM_ALLOWLIST.some((p) => lower.includes(p));
      if (!allowed) {
        const col = (m.index ?? 0) + 1;
        report(rel, line, col, "RISKY_CLAIM", label, m[0]);
      }
    }

    // -- duplicated hardcoded facts --
    for (const { regex, label } of HARDCODED_FACTS) {
      const m = regex.exec(text);
      if (m) {
        const col = (m.index ?? 0) + 1;
        report(rel, line, col, "HARDCODED_FACT", label, m[0]);
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
const byKind = (k) => violations.filter((v) => v.kind === k);

if (violations.length === 0) {
  console.log(`PASS — scanned ${fileCount.scanned} source files`);
  console.log(`No risky/unsupported claims and no duplicated hardcoded facts found outside ${CANONICAL_FILE}.`);
  process.exit(0);
}

console.log(`FAIL — ${violations.length} violation(s) across ${fileCount.scanned} source files`);
console.log("");

const risky = byKind("RISKY_CLAIM");
if (risky.length) {
  console.log(`[1] RISKY / UNSUPPORTED CLAIMS (${risky.length}):`);
  for (const v of risky) {
    console.log(`  ${v.file}:${v.line}:${v.col}  ${v.label}  — matched "${v.match}"`);
  }
  console.log("");
}

const facts = byKind("HARDCODED_FACT");
if (facts.length) {
  console.log(`[2] DUPLICATED HARDCODED BUSINESS FACTS (${facts.length}):`);
  for (const v of facts) {
    console.log(`  ${v.file}:${v.line}:${v.col}  ${v.label}  — matched "${v.match}"`);
  }
  console.log("");
}

console.log(`Note: ${FACTS_ONLY_IN_CANONICAL}.`);
process.exit(1);