import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const expected = `v${manifest.version}`;
const actual = process.env.RELEASE_TAG;

if (actual !== expected) {
  console.error(`release tag ${JSON.stringify(actual)} must equal package version tag ${JSON.stringify(expected)}`);
  process.exit(1);
}
console.log(`release tag matches package version: ${actual}`);
