---
name: figma-help
description: "Complete reference for all Figma skills, commands, MCP servers, and workflows. Shows what each tool does, when to use it, and example prompts. Use when: user asks for help, says figma help, asks what commands are available, needs guidance on Figma workflows, or wants to know what MCP servers are available."
---

# Figma Skills & MCP Servers — Complete Reference

When this skill is invoked, present the following information to the user.

---

## Quick Start

New to Figma + Claude Code? Run these 3 commands:

```
1. /figma-setup       — install tools and configure MCP servers (once per machine)
2. /figma-new         — create a Figma plugin project
3. /figma-help        — you're here!
```

---

## All Commands

| Command | What it does |
|---------|-------------|
| `/figma-setup` | Install prerequisites (Node.js, pnpm, Git, TypeScript) and configure MCP servers |
| `/figma-new` | Create a new Figma plugin project from template |
| `/figma-build` | Build, typecheck, and validate a Figma plugin |
| `/figma-implement` | Translate a Figma design URL into production-ready code |
| `/figma-inspect` | Inspect Figma designs — structure, tokens, screenshots |
| `/figma-connect` | Map Figma components to code using Code Connect |
| `/figma-rules` | Generate design system rules for consistent Figma-to-code output |
| `/figma-mastery` | Learn Figma concepts — components, auto-layout, tokens, Plugin API |
| `/figma-optimize` | Fetch Figma data efficiently via sub-agents (saves tokens) |
| `/figma-browse` | Read and write Figma via REST API (comments, exports, data) |
| `/figma-diagram` | Create diagrams in FigJam (flowcharts, sequences, Gantt) |
| `/figma-help` | Show this reference page |

---

## Plugin Development Skills

### /figma-setup (figma-dev-setup)

**What:** One-command environment bootstrap. Detects OS, installs missing tools, configures MCP servers.

**When to use:** First time on a new machine, or when MCP servers need reconfiguring.

**Example:** `Set up Figma development environment`

### /figma-new (figma-plugin-create)

**What:** Scaffold a complete Figma plugin project with TypeScript, esbuild, and Figma API types.

**When to use:** Starting a new plugin. Asks for name, editor type, UI preference.

**Example:** `Create a new Figma plugin called "Color Palette Generator"`

### /figma-build (figma-plugin-build)

**What:** Run TypeScript checking, esbuild bundling, and manifest validation.

**When to use:** Before testing in Figma, or to check for errors.

**Example:** `Build the plugin` or `Check for errors`

---

## Design-to-Code Skills

### /figma-implement (figma-implement)

**What:** Translate a Figma design into production-ready code. Fetches design context, screenshots, and assets via MCP, then generates code adapted to your project's stack.

**When to use:** You have a Figma URL and want working code that matches your project conventions.

**Example:** `Implement this design: https://figma.com/design/abc123/MyApp?node-id=10-5`

**Key behavior:**

- Treats MCP output as reference, not final code
- Reuses existing project components
- Replaces raw Tailwind with your design tokens
- Validates against Figma screenshot

**Requires:** Figma Official Remote or Desktop MCP server

### /figma-inspect (figma-inspect)

**What:** Read-only inspection of Figma designs. 4 modes: Overview (structure + screenshot), Tokens (colors, typography, spacing), Full Context (complete design data), Screenshot.

**When to use:** You want to understand a Figma file before implementing, or extract specific data.

**Example:** `Show me the design tokens from: [URL]` or `What's in this Figma file?`

**Requires:** Figma Official Remote or Desktop MCP server

### /figma-connect (figma-connect)

**What:** Connect Figma design components to their code implementations using Code Connect. Developers see actual code usage in Figma Dev Mode.

**When to use:** After implementing components, to maintain design-code consistency.

**Example:** `Connect this Figma button to my code: [URL]`

**Note:** Components must be published to a Figma team library.

**Requires:** Figma MCP server

### /figma-rules (figma-rules)

**What:** Generate project-specific design system rules. Encodes your conventions, tokens, and component patterns so `/figma-implement` produces consistent output.

**When to use:** Once per project, or when conventions change. Like a "new developer onboarding doc" for Claude.

**Example:** `Create design system rules for this project`

**Requires:** Figma MCP server + existing project with components

---

## Advanced Skills

### /figma-mastery (figma-mastery)

**What:** Knowledge-base skill about Figma concepts. Explains components, variants, auto-layout, design tokens, prototyping, Dev Mode, Plugin API, design systems, and handoff workflows.

**When to use:** You need to understand a Figma concept, or want to learn how Figma works.

**Topics:** Components & Variants, Auto Layout, Design Tokens, Prototyping, Dev Mode, Plugin API, Design Systems, Handoff

**Example:** `Explain auto layout in Figma` or `How does the Plugin API work?`

**No MCP required** — pure knowledge skill.

### /figma-optimize (figma-optimize)

**What:** Fetch Figma data without flooding your context window. Delegates to sub-agents that process data in isolation and return compact summaries.

**When to use:** Large Figma files, repeated fetches, context-sensitive sessions.

**Patterns:**

- Simple fetch: file overview, screen list via `get_metadata`
- Token extraction: colors, typography, spacing via `get_variable_defs`
- Component inventory: component list via `get_metadata` + `get_code_connect_map`
- Deep dive: full node data via `get_design_context`

**Example:** `Fetch this large Figma file efficiently: [URL]`

**Requires:** Figma Official Remote or Desktop MCP server

### /figma-browse (figma-browse)

**What:** Read and write access to Figma via the REST API. Supports reading file data, adding/deleting comments, exporting images, and working with variables.

**When to use:** You need programmatic access beyond what MCP tools provide, or need to add comments/export assets.

**Example:** `Add a comment "Approved" to this frame: [URL]` or `Export this frame as PNG: [URL]`

**Limitations:** Cannot create/modify shapes, frames, or text layers (REST API limitation). For full design manipulation, use `claude-talk-to-figma-mcp`.

**Requires:** Figma Personal Access Token

### /figma-diagram (command only — no dedicated skill)

**What:** Create diagrams in FigJam using the `generate_diagram` MCP tool.

**Supported types:** Flowcharts, Sequence diagrams, State diagrams, Gantt charts

**NOT supported:** Class diagrams, timelines, venn, ER diagrams

**Example:** `Create a flowchart of the user login process`

**Requires:** Figma MCP server

**Note:** This is a lightweight command that invokes the MCP tool directly. No dedicated skill file — the MCP tool handles Mermaid.js syntax rules automatically.

---

## MCP Servers — Main (configured by /figma-setup)

| Server | Type | Auth | Best for |
|--------|------|------|----------|
| **Figma Official Remote** | Remote (hosted by Figma) | OAuth | Production teams, most use cases |
| **Figma Desktop** | Local (Figma Desktop app) | None (local) | Selection-based prompting, Dev Mode |
| **Framelink** | Local (stdio) | API Token | Optimized context for AI, large files |

### Figma Official Remote

```bash
claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp
```

- OAuth auth: `/mcp` → select figma → Authenticate
- Free: 6 calls/month on Starter/View/Collab; per-minute rate limits on Dev/Full seats
- **Tools:** get_design_context, get_screenshot, get_metadata, get_variables, get_code_connect_map, add_code_connect_map, generate_figma_design, download_assets

### Figma Desktop

```bash
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
```

- Requires Figma Desktop with Dev Mode enabled (Shift+D)
- Enable: Inspect panel → "Enable desktop MCP server"
- **Key advantage:** Selection-based prompting — select frame in Figma, prompt without URLs

### Framelink

```bash
claude mcp add figma-framelink -- npx -y figma-developer-mcp --figma-api-key=YOUR-KEY --stdio
```

- Requires Figma Personal Access Token
- **Security:** Use version >= 0.6.3 (CVE-2025-53967)
- **Key advantage:** Simplified, optimized responses — better for AI context

---

## MCP Servers — Optional (advanced)

| Server | Read | Write | Free | Best for |
|--------|------|-------|------|----------|
| **Claude Talk to Figma** | Yes | Yes | Yes | Design modification via WebSocket plugin |
| **html.to.design** | No | Yes | No | Send HTML/CSS directly to Figma canvas |
| **Chrome DevTools CDP** | Yes | Yes | Yes | Full Plugin API via browser |
| **Composio** | Yes | No | Yes | Zero-config managed OAuth |
| **figma-mcp (MatthewDailey)** | Yes | No | Yes | Simple file inspection |
| **figma-mcp (rui-branco)** | Yes | No | Yes | Image export + Jira integration |
| **figma-mcp (karthiks3000)** | Yes | Yes | Yes | Full read/write via plugin bridge |

### Claude Talk to Figma

Full read/write via WebSocket + Figma Plugin. Works with free accounts.

```bash
# Quick setup:
npx -p claude-talk-to-figma-mcp@latest claude-talk-to-figma-mcp-server
```

Link: github.com/arinspunk/claude-talk-to-figma-mcp

### html.to.design

Send AI-generated HTML/CSS to Figma as editable layers. Requires subscription.

Link: html.to.design/docs/mcp-tab

### Chrome DevTools CDP

Full Plugin API access via Chrome browser. Used by `/figma-browse`.

```bash
claude mcp add chrome-devtools npx chrome-devtools-mcp@latest
```

### Composio

Managed Figma MCP — no API keys, automatic OAuth.

```bash
npx @composio/mcp@latest setup "https://mcp.composio.dev/..." "figma-id" --client claude-code
```

Link: composio.dev

---

## Typical Workflows

### 1. New Plugin Developer

```
/figma-setup        → install tools and MCP servers
/figma-new          → create a plugin project
pnpm watch          → develop with auto-rebuild
Test in Figma       → Plugins → Development → Import from manifest
/figma-build        → final build and validation
```

### 2. Implement Figma Design

```
/figma-inspect [URL]   → understand the design first
/figma-implement [URL] → generate production code
/figma-connect [URL]   → map components back to Figma
```

### 3. Design System Team

```
/figma-rules           → encode project conventions
/figma-connect [URL]   → map all components to code
/figma-implement [URL] → implement with rules applied
```

### 4. Large File / Token Optimization

```
/figma-optimize [URL]  → get compact summary of large file
/figma-inspect [URL]   → deep dive on specific nodes
/figma-implement [URL] → implement specific frames
```

---

## Plugin Architecture (quick reference)

Figma plugins have two isolated execution contexts:

| Context | File | Has access to | No access to |
|---------|------|--------------|-------------|
| **Sandbox** | `src/main.ts` | Figma Plugin API (`figma.*`) | DOM, `fetch`, browser APIs |
| **UI iframe** | `src/ui.ts` | DOM, `fetch`, browser APIs | Figma API |

Communication via messages:

```
Sandbox → UI:   figma.ui.postMessage({ type: "data", ... })
UI → Sandbox:   parent.postMessage({ pluginMessage: { type: "action" } }, "*")
```

---

## Official Figma Plugin

Figma also offers official skills that may be available via `claude plugin install figma@claude-plugins-official`. These provide basic design-to-code workflows. Our custom skills build on top of the same MCP tools with more detailed, project-specific workflows. Verify plugin availability for your setup.

---

## Further Reading

- Figma MCP Server Docs: developers.figma.com/docs/figma-mcp-server
- Figma Blog — Claude Code to Figma: figma.com/blog/introducing-claude-code-to-figma
- Figma Blog — FigJam + Claude: figma.com/blog/think-outside-of-the-box-with-claude-and-figjam
- Claude Code MCP Docs: code.claude.com/docs/en/mcp
- Figma API Token: figma.com/developers/api#access-tokens
