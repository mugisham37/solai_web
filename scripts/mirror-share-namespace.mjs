/**
 * Copies the English `share` namespace into the other locales, prefixing every
 * string with the translation marker, matching how `build`, `payout` and `live`
 * were seeded. Existing translated strings are left alone.
 *
 * Run: node scripts/mirror-share-namespace.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const MARKER = "[NEEDS TRANSLATION] ";
const NAMESPACE = "share";
const TARGETS = ["fr", "rw", "sw"];
const DIR = new URL("../src/i18n/messages/", import.meta.url);

function markStrings(value) {
  if (typeof value === "string") {
    return value.startsWith(MARKER) ? value : `${MARKER}${value}`;
  }
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, markStrings(v)]));
}

/** Keep any string a translator has already done; seed only what is missing. */
function merge(source, existing) {
  if (typeof source === "string") {
    return typeof existing === "string" ? existing : markStrings(source);
  }
  const out = {};
  for (const [key, value] of Object.entries(source)) {
    out[key] = merge(value, existing?.[key]);
  }
  return out;
}

const en = JSON.parse(readFileSync(new URL("en.json", DIR), "utf8"));
const source = en[NAMESPACE];
if (!source) throw new Error(`en.json has no "${NAMESPACE}" namespace`);

for (const locale of TARGETS) {
  const path = new URL(`${locale}.json`, DIR);
  const messages = JSON.parse(readFileSync(path, "utf8"));
  messages[NAMESPACE] = merge(source, messages[NAMESPACE]);
  writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`);
  console.log(`${locale}.json: ${NAMESPACE} namespace mirrored`);
}
