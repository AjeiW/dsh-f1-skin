// check.mjs — validate the skin data and the built bundle. Zero dependencies.
// Usage: node scripts/check.mjs
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as data from "../src/teams.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failures = 0;
const fail = (msg) => { console.error("✗ " + msg); failures += 1; };
const ok = (msg) => console.log("✓ " + msg);

// ── token inventory ──
const names = data.ALL_TOKENS;
if (names.length !== 79) fail(`expected 79 tokens, got ${names.length}`);
else ok(`79 tokens declared (78 alias + sidebar fill)`);
if (new Set(names).size !== names.length) fail("duplicate token names");
else ok("no duplicate token names");
const mapKeys = Object.keys(data.TOKEN_MAP);
const missing = names.filter((n) => !mapKeys.includes(n));
const extra = mapKeys.filter((n) => !names.includes(n));
if (missing.length > 0) fail(`tokens missing from TOKEN_MAP: ${missing.join(", ")}`);
else ok("every token has a mapping");
if (extra.length > 0) fail(`TOKEN_MAP has extra keys: ${extra.join(", ")}`);
else ok("no extra mapping keys");

// ── per-team override layers ──
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGBA = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(?:0(?:\.\d+)?|1(?:\.0+)?|\.\d+)\s*\)$/i;
const validValue = (v) => typeof v === "string" && (HEX.test(v) || RGBA.test(v) || v === "transparent");
if (data.TEAMS.length !== 4) fail(`expected 4 teams, got ${data.TEAMS.length}`);
else ok("4 teams defined");
const expectedIds = ["redbull", "ferrari", "mclaren", "mercedes"];
for (const id of expectedIds) {
  if (!data.TEAMS.some((t) => t.id === id)) fail(`missing team ${id}`);
}
ok("team ids: " + data.TEAMS.map((t) => t.id).join(", "));
for (const team of data.TEAMS) {
  const layer = data.makeTeamTokens(team);
  const keys = Object.keys(layer);
  if (keys.length !== names.length) fail(`${team.id}: ${keys.length} token entries`);
  let bad = 0;
  for (const name of names) {
    const v = layer[name];
    if (!v || !validValue(v.light) || !validValue(v.dark)) bad += 1;
  }
  if (bad > 0) fail(`${team.id}: ${bad} invalid color values`);
  else ok(`${team.id}: 79 × {light, dark} valid color values`);
  if (team.cockpit !== null && typeof team.cockpit === "string") fail(`${team.id}: cockpit should be null in src (filled at build)`);
}

// ── CSS sanity ──
const css = data.F1_CSS;
let depth = 0;
for (const ch of css) {
  if (ch === "{") depth += 1;
  else if (ch === "}") depth -= 1;
  if (depth < 0) break;
}
if (depth !== 0) fail(`CSS braces unbalanced (depth ${depth})`);
else ok("CSS braces balanced");
if (!css.includes("prefers-reduced-motion")) fail("CSS lacks reduced-motion branch");
else ok("prefers-reduced-motion branch present");
if (!css.trimStart().startsWith("@import")) fail("@import must be the first CSS rule");
else ok("@import is the first rule");

// ── built bundle ──
const bundlePath = join(root, "lib", "client.js");
if (!existsSync(bundlePath)) {
  fail("lib/client.js missing — run: node scripts/build.mjs");
} else {
  const bundle = readFileSync(bundlePath, "utf8");
  if (!bundle.includes("window.__ModuleLoader__.load({")) fail("bundle lacks __ModuleLoader__ registration");
  else ok("bundle registers via window.__ModuleLoader__.load");
  if (!bundle.includes('id: "dsh-f1-skin"')) fail("bundle id is not dsh-f1-skin");
  else ok("bundle id correct");
  const images = (bundle.match(/data:image\/[a-z+]+;base64,/g) || []).length;
  if (images < 4) fail(`expected 4 embedded cockpit images, found ${images}`);
  else ok(`${images} embedded cockpit images`);
  if (bundle.includes("cockpit\": null")) fail("a cockpit image was not embedded");
  else ok("no unembedded cockpit placeholders");
  const sizeKB = Math.round(bundle.length / 1024);
  ok(`lib/client.js is ${sizeKB} KB`);
  if (sizeKB > 3200) fail(`bundle over 3.2 MB (${sizeKB} KB) — compress the images`);
}

// ── bundle smoke test: register + materialize the factory in bare Node ──
{
  let registration = null;
  globalThis.window = { __ModuleLoader__: { load: (reg) => { registration = reg; } } };
  try {
    await import(pathToFileURL(bundlePath).href + `?smoke=${Date.now()}`);
  } finally {
    delete globalThis.window;
  }
  if (registration === null) fail("bundle did not call window.__ModuleLoader__.load");
  else if (registration.id !== "dsh-f1-skin") fail(`registration id mismatch: ${registration.id}`);
  else {
    ok("bundle registered with correct id");
    let ex = null;
    try {
      ex = registration.factory((spec) => {
        throw new Error(`unexpected external require("${spec}") — the skin must be self-contained`);
      });
    } catch (e) {
      fail(`factory materialization threw: ${e.message}`);
    }
    if (ex !== null) {
      if (Array.isArray(ex.inject) && ex.inject.includes("theme")) ok("client plugin injects \"theme\"");
      else fail(`inject must include "theme", got ${JSON.stringify(ex.inject)}`);
      if (typeof ex.apply === "function") ok("client plugin exports apply()");
      else fail("client plugin is missing apply()");
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log("\nall checks passed ✓");
