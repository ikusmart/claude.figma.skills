---
name: figma-plugin-create
description: "Create a new Figma plugin project from template with proper structure, types, and build config. Generates manifest.json, package.json, tsconfig.json, esbuild config, and source templates. Use when: creating a new Figma plugin, running /figma-new command, scaffolding plugin project, or when user says create figma plugin or new plugin."
---

# Create Figma Plugin Project

## Self-Documentation

When invoked WITHOUT clear input:

1. Display the Quick Help block below
2. Ask the user for the plugin name and details

When invoked WITH a plugin name or clear intent — skip help and proceed to Step 1.

## Quick Help

**What I do:** Scaffold a complete Figma plugin project with TypeScript, esbuild, and Figma API types. Ready to build and test in minutes.

**What gets created:**

```
{plugin-name}/
├── src/
│   ├── main.ts          # Plugin sandbox (Figma API access, no DOM)
│   └── ui.ts            # UI iframe (DOM access, no Figma API)
├── dist/                # Build output (gitignored)
├── manifest.json        # Figma plugin config
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript config
├── ui.html              # UI shell template
├── esbuild.config.js    # Build configuration
└── .gitignore
```

**Example prompts:**

- `Create a new Figma plugin called "Color Palette Generator"`
- `New Figma plugin for FigJam`
- `Scaffold a Figma Dev Mode plugin`

**Prerequisites:** Node.js 22+, pnpm. Run `/figma-setup` if not installed.

---

## Step 1: Gather Project Info

Ask the user these questions (one at a time):

1. **Plugin name** — human-readable name for the plugin (e.g., "Color Palette Generator")
2. **Plugin ID** — (optional) Figma-assigned ID. If not provided, leave as placeholder `"000000000000000000"`
3. **Editor type** — which Figma editors to support:
   - `figma` (default)
   - `figjam`
   - `dev` (Dev Mode)
   - Multiple selections allowed
4. **Include UI?** — whether the plugin needs a user interface (iframe)
   - Yes (default) — generates `ui.html` + `ui.ts`
   - No — plugin runs without UI

## Step 2: Create Project Structure

Use the plugin name in kebab-case as the directory name.
Create the project at `{current_working_directory}/{plugin-name}/`.

Read each template from `assets/templates/` and customize with the user's input:

```
{plugin-name}/
├── src/
│   ├── main.ts          # Plugin sandbox code
│   └── ui.ts            # UI iframe code (if UI enabled)
├── dist/                # Build output (gitignored)
├── manifest.json        # Figma plugin manifest
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── ui.html              # UI shell template (if UI enabled)
├── esbuild.config.js    # Build configuration
├── .gitignore
└── README.md
```

## Step 3: Customize Templates

### manifest.json

- Replace `{{PLUGIN_NAME}}` with the plugin name
- Replace `{{PLUGIN_ID}}` with the ID (or placeholder)
- Replace `{{EDITOR_TYPE}}` with the editor type JSON array (e.g., `["figma"]` or `["figma", "figjam"]`)
- If no UI: remove the `"ui"` field

### package.json

- Replace `{{PLUGIN_NAME_KEBAB}}` with kebab-case name
- Replace `{{PLUGIN_NAME}}` with display name

### main.ts

- If UI enabled: include `figma.showUI(__html__)` and message handler
- If no UI: include a simple plugin that runs and closes

### esbuild.config.js

- If UI enabled: include both main and ui entry points
- If no UI: include only main entry point

## Step 4: Install Dependencies

```bash
cd {plugin-name}
pnpm install
```

If pnpm is not available, fall back to `npm install`.

## Step 5: Build and Verify

```bash
pnpm build
```

Verify that:

- `dist/code.js` exists
- `dist/ui.html` exists (if UI enabled)
- No TypeScript errors
- No build errors

## Step 6: Report Success

Tell the user:

- Project created at `{path}`
- To test: Open Figma → Plugins → Development → Import plugin from manifest → select `{path}/manifest.json`
- To develop: `pnpm watch` for auto-rebuild on save
- To build: `pnpm build` for production build
- Run `/figma-build` to validate the plugin
- Run `/figma-mastery` to learn about the Plugin API architecture
