# Release Readiness Hardening Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task.

**Goal:** Turn the current non-commercial F1-inspired DSH skin into a reproducible, testable release candidate without publishing it yet.

**Architecture:** Keep the existing zero-runtime-dependency plugin and generated `lib/` bundle. Add release governance around it: packaged third-party notices, deterministic metadata, CI gates, browser-level layout checks, release documentation, screenshot assets, and explicit bundle budgets. Preserve DSH behavior by testing visibility, clickability, settings isolation, and team switching rather than replacing DSH components.

**Tech Stack:** Node.js ESM, CSS/JavaScript build scripts, GitHub Actions, Playwright browser tests, npm package tooling, DSH `0.1.1-rc.2` compatibility target.

---

### Task 1: Package attribution and non-official status

**Files:**
- Create: `THIRD_PARTY_NOTICES.md`
- Modify: `README.md`
- Modify: `package.json`

**Steps:**
1. Document all four Wikimedia-hosted photographs and four Wikimedia Commons SVG team marks with author, source, license, and modification status.
2. Add a prominent non-official, non-commercial fan-project statement and trademark ownership statement.
3. Include the notice file in the npm package allowlist.
4. Verify `npm pack --dry-run` contains the license and notices.

### Task 2: Version and release metadata

**Files:**
- Create: `CHANGELOG.md`
- Create: `CONTRIBUTING.md`
- Create: `SECURITY.md`
- Modify: `package.json`
- Modify: `README.md`

**Steps:**
1. Set the next release candidate version and add homepage, bugs, author, Node engine, keywords, and public publish configuration.
2. Record user-visible changes and compatibility scope.
3. Document local verification, contribution expectations, and responsible vulnerability reporting.
4. Leave tagging, GitHub Release creation, and npm publication for an explicit release command.

### Task 3: Deterministic release checks

**Files:**
- Create: `scripts/release-check.mjs`
- Modify: `scripts/check.mjs`
- Modify: `package.json`

**Steps:**
1. Add hard bundle-size and asset-count budgets to the existing structural checks.
2. Add a package-content audit that rejects missing required files, source leakage, and oversized tarballs.
3. Add a single `quality` command that runs build, structural checks, and package checks.
4. Run the command and retain exact output for handoff.

### Task 4: Browser regression suite

**Files:**
- Create: `playwright.config.mjs`
- Create: `tests/e2e/f1-skin.spec.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`

**Steps:**
1. Add Playwright as a development-only test dependency.
2. Test the four teams at desktop and compact widths.
3. Assert that the DeepSeek harness label is visible, settings is clickable, the settings dialog is unobstructed, no synthetic team numbers appear, and key controls have non-overlapping bounds.
4. Capture per-team screenshots as CI artifacts for visual comparison.

### Task 5: Continuous integration and release workflow

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/release.yml`
- Create: `.github/ISSUE_TEMPLATE/bug_report.yml`
- Create: `.github/ISSUE_TEMPLATE/config.yml`

**Steps:**
1. Run quality checks on supported Node versions for pushes and pull requests.
2. Run the browser smoke matrix on the pinned DSH compatibility version and upload screenshots.
3. Add a manually dispatched release workflow that requires the version/tag to agree and publishes through npm trusted publishing only after all checks pass.
4. Add an issue template that requests DSH version, viewport, team, theme, screenshot, and reproduction steps.

### Task 6: README visuals and compatibility contract

**Files:**
- Create: `docs/screenshots/*.png`
- Modify: `README.md`

**Steps:**
1. Capture representative desktop screenshots from the running DSH UI using the in-app browser.
2. Add a compact gallery showing each team rather than a single misleading theme.
3. Document the tested DSH version, supported viewport range, install/update/uninstall flow, and verification commands.

### Task 7: Remove unused weight and final audit

**Files:**
- Delete: `src/styles/sidebar.css`
- Delete: obsolete raster logo fallbacks in `assets/team-logos/`
- Delete: obsolete cockpit fallbacks in `assets/cockpits/`
- Modify: asset credit documentation if required

**Steps:**
1. Confirm each candidate is unreferenced by source and build output.
2. Remove only the explicit tracked files; retain all active SVG logos and broadcast photographs.
3. Rebuild, rerun quality checks, inspect the final tarball, and review the git diff for accidental DSH behavior changes.
