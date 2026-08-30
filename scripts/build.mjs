// build.mjs — assemble lib/client.js (the web2 lazy-CJS bundle) from
// src/teams.mjs data, the plugin fragment, and the embedded cockpit images.
// Zero dependencies: node scripts/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as data from "../src/teams.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const COCKPIT_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".svg"];
const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

function loadCockpit(id) {
  for (const ext of COCKPIT_EXTS) {
    try {
      const buf = readFileSync(join(root, "assets", "cockpits", id + ext));
      return `data:${MIME[ext]};base64,${buf.toString("base64")}`;
    } catch { /* try the next extension */ }
  }
  throw new Error(`dsh-f1-skin build: no cockpit asset for team "${id}"`);
}

const teams = data.TEAMS.map((team) => ({ ...team, cockpit: loadCockpit(team.id) }));

const tokenMapSrc = "{\n" + Object.entries(data.TOKEN_MAP)
  .map(([name, spec]) => `    ${JSON.stringify(name)}: ${typeof spec === "function" ? spec.toString() : JSON.stringify(spec)}`)
  .join(",\n") + "\n  }";

const fragment = readFileSync(join(root, "src", "plugin-fragment.js"), "utf8");

const bundle = `window.__ModuleLoader__.load({
  id: "dsh-f1-skin",
  factory: (require) => {
    "use strict";
    var module = { exports: {} };
    var exports = module.exports;
    const ALL_TOKENS = ${JSON.stringify(data.ALL_TOKENS)};
    const TOKEN_MAP = ${tokenMapSrc};
    ${data.hexToRgb.toString()}
    ${data.rgbToHex.toString()}
    ${data.mix.toString()}
    ${data.lighten.toString()}
    ${data.darken.toString()}
    ${data.alpha.toString()}
    ${data.resolveSpec.toString()}
    ${data.makeTeamTokens.toString()}
    const TEAMS = ${JSON.stringify(teams)};
    const F1_CSS = ${JSON.stringify(data.F1_CSS)};
${fragment}
    return module.exports;
  }
});
`;

const out = join(root, "lib", "client.js");
mkdirSync(join(root, "lib"), { recursive: true });
writeFileSync(out, bundle, "utf8");
console.log(`built lib/client.js (${Math.round(bundle.length / 1024)} KB, ${teams.length} teams embedded)`);
