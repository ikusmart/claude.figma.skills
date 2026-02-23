---
name: figma-dev-setup
description: "Install all prerequisites for Figma plugin development and configure MCP servers. Detects OS (Windows/macOS), installs Node.js 22+, pnpm, Git, TypeScript. Configures up to 3 Figma MCP servers: Official Remote (OAuth), Desktop (local), Framelink (REST API). Use when: setting up Figma dev environment, running /figma-setup, first-time setup, or user says install figma tools."
---

# Figma Development Environment Setup

## Self-Documentation

When invoked WITHOUT clear intent:

1. Display the Quick Help block below
2. Ask the user if they want to proceed with full setup

When invoked WITH clear intent (e.g., "set up figma", "install figma tools") — proceed directly.

## Quick Help

**What I do:** One-command setup for Figma development. Installs missing tools, configures MCP servers, and verifies everything works.

**What gets installed:**

- Node.js 22+ (runtime for building plugins)
- pnpm (fast package manager)
- Git (version control)
- TypeScript (type checking)

**What gets configured (MCP servers):**

- Figma Official Remote — OAuth-based, works without desktop app (recommended)
- Figma Desktop — local connection to Figma Desktop app with Dev Mode
- Framelink — REST API with optimized context for AI (optional, for large files)

**Example prompts:**

- `Set up Figma development environment`
- `Install all Figma tools`
- `Configure Figma MCP servers`

**Time:** ~5 minutes on a fresh machine.

---

## Step 1: Detect Operating System

```bash
case "$OSTYPE" in
  msys*|cygwin*|mingw*) OS="windows" ;;
  darwin*)              OS="macos" ;;
  linux*)               OS="linux" ;;
  *)                    OS="unknown" ;;
esac
echo "Detected OS: $OS"
```

## Step 2: Check Prerequisites

Run these checks and build a status table:

| Tool | Check Command | Status |
|------|--------------|--------|
| Node.js v22+ | `node --version` | ? |
| pnpm | `pnpm --version` | ? |
| Git | `git --version` | ? |
| TypeScript | `tsc --version` | ? |

For each tool that is NOT installed, proceed to Step 3 with OS-specific installation.

## Step 3: Install Missing Tools

Read the appropriate reference file for your OS:

- Windows: [references/windows-setup.md](references/windows-setup.md)
- macOS: [references/macos-setup.md](references/macos-setup.md)

Follow the installation commands for each missing tool. Always verify after install with the check command.

**IMPORTANT**: Before installing anything, ask the user for confirmation:
> "The following tools need to be installed: [list]. Proceed?"

## Step 4: Configure Figma MCP Servers

Present the user with MCP server options. Recommend installing all 3 for full coverage.

### Option A: Figma Official Remote MCP (recommended)

Best for most users. OAuth-based, works without Figma Desktop app.
Free: 6 calls/month on Starter/View/Collab seats; per-minute rate limits on Dev/Full seats.

```bash
claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp
```

After adding, authenticate:

```
/mcp → select figma → Authenticate
```

**Tools provided:** get_design_context, get_screenshot, get_metadata, get_variables, get_code_connect_map, add_code_connect_map, generate_figma_design, download_assets

### Option B: Figma Desktop MCP Server

Requires Figma Desktop app with Dev Mode enabled (Dev or Full seat on paid plan).
Supports **selection-based prompting** — select a frame in Figma, then prompt Claude without URLs.

1. Open Figma Desktop → update to latest version
2. Open a Design file → toggle to Dev Mode (`Shift+D`)
3. In the inspect panel → click "Enable desktop MCP server"
4. Server runs at `http://127.0.0.1:3845/mcp`

```bash
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
```

### Option C: Framelink MCP (optional, for large files)

Community MCP for optimized AI context. Simplifies raw Figma API responses to reduce token usage.
Requires Figma Personal Access Token.

```bash
claude mcp add figma-framelink -- npx -y figma-developer-mcp --figma-api-key=YOUR-KEY --stdio
```

Ask the user for their Figma API key. Get one at: https://www.figma.com/developers/api#access-tokens

**Security:** Use version >= 0.6.3 (CVE-2025-53967 patched).

### Option D: Skip MCP setup

User can configure MCP servers later. Not recommended — most skills require at least one MCP server.

**Note:** For additional MCP servers (Claude Talk to Figma, html.to.design, Chrome DevTools CDP, etc.) run `/figma-help` and see the MCP Servers section.

## Step 5: Verify Setup

Run final verification:

```bash
echo "=== Figma Dev Environment Status ==="
echo "Node.js: $(node --version 2>/dev/null || echo 'NOT INSTALLED')"
echo "pnpm:    $(pnpm --version 2>/dev/null || echo 'NOT INSTALLED')"
echo "Git:     $(git --version 2>/dev/null || echo 'NOT INSTALLED')"
echo "tsc:     $(tsc --version 2>/dev/null || echo 'NOT INSTALLED')"
echo "==================================="
```

Also verify MCP servers with `/mcp` command — check that configured servers show as connected.

If all tools are installed, report success. If any are missing, report which ones failed and suggest manual installation.

## Step 6: Next Steps

After successful setup, inform the user:

**Plugin development:**

- `/figma-new` — create a new Figma plugin project
- `/figma-build` — build and validate a plugin
- `/figma-mastery` — learn about Figma concepts and Plugin API

**Design-to-code:**

- `/figma-implement` — translate a Figma design into code
- `/figma-inspect` — inspect and analyze Figma designs
- `/figma-connect` — map Figma components to code (Code Connect)
- `/figma-rules` — generate design system rules

**Advanced:**

- `/figma-optimize` — efficient Figma data fetching for large files
- `/figma-browse` — direct Plugin API access via browser
- `/figma-diagram` — create diagrams in FigJam

**Full reference:**

- `/figma-help` — complete guide to all skills, commands, and MCP servers
