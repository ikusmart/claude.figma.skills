---
name: figma-plugin-build
description: "Build, typecheck, and validate a Figma plugin project. Runs TypeScript checking, esbuild bundling, and manifest validation. Use when: building a Figma plugin, running /figma-build, checking for errors, or when user says build plugin, check plugin, or validate plugin."
---

# Build & Validate Figma Plugin

## Self-Documentation

When invoked WITHOUT clear context (no plugin project in current directory):

1. Display the Quick Help block below
2. Search for the nearest manifest.json to identify the project

When invoked WITH a clear project context — skip help and proceed to Step 1.

## Quick Help

**What I do:** Run the full build pipeline for a Figma plugin — TypeScript checking, esbuild bundling, and manifest validation. Reports errors and warnings.

**What gets checked:**

- TypeScript types (zero errors required)
- esbuild bundling (dist/code.js + dist/ui.html)
- manifest.json validity (required fields, file references)

**Example prompts:**

- `Build the plugin`
- `Check for errors in the plugin`
- `Validate the Figma plugin`

**Prerequisites:** A Figma plugin project with manifest.json. Create one with `/figma-new`.

**Expected output:**

```
=== Build Report ===
TypeScript: OK
Build:      OK
Output:     dist/code.js (12 KB), dist/ui.html (3 KB)
Manifest:   OK
====================
```

---

## Step 1: Locate Project

Find the nearest `manifest.json` with a `"main"` field (Figma plugin manifest).
If not found in the current directory, check parent directories up to 3 levels.

## Step 2: TypeScript Check

```bash
pnpm typecheck
```

If `pnpm` is not available, use `npx tsc --noEmit`.

Report any TypeScript errors. If there are errors, stop and report them.

## Step 3: Build

```bash
pnpm build
```

If `pnpm` is not available, use `node esbuild.config.js`.

## Step 4: Validate Build Output

Check that the expected output files exist:

- `dist/code.js` — main plugin bundle (required)
- `dist/ui.html` — UI bundle (only if manifest has `"ui"` field)

## Step 5: Validate Manifest

Read `manifest.json` and verify:

- `name` is not empty
- `id` is not the placeholder `"000000000000000000"` (warn if it is)
- `api` is `"1.0.0"`
- `main` points to an existing file
- `ui` points to an existing file (if present)
- `editorType` is a non-empty array
- `documentAccess` is `"dynamic-page"`

## Step 6: Report

Output a summary:

```
=== Build Report ===
TypeScript: OK / X errors
Build:      OK / FAILED
Output:     dist/code.js (X KB), dist/ui.html (X KB)
Manifest:   OK / X warnings
====================
```
