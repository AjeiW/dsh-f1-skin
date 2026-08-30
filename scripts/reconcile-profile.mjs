// reconcile-profile.mjs — mirror of the dsh plugin forwarder's reconcile step:
// append the bundle name to dsh.profile.bundles in ./package.json (cwd must be
// the profile directory). Idempotent.
import { readFileSync, writeFileSync } from "node:fs";

const p = JSON.parse(readFileSync("package.json", "utf8"));
p.dsh = p.dsh ?? {};
p.dsh.profile = p.dsh.profile ?? {};
p.dsh.profile.bundles = [...new Set([...(p.dsh.profile.bundles ?? []), "dsh-f1-skin"])];
writeFileSync("package.json", JSON.stringify(p, null, 2) + "\n");
console.log("bundles:", p.dsh.profile.bundles.join(", "));
