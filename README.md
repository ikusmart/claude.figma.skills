# Figma Skills for Claude Code

A comprehensive skills and commands framework that teaches Claude Code how to work with Figma — from plugin development to design-to-code workflows.

## What This Is

This is **not** a standalone app or plugin. It's a **meta-project** — a collection of Claude Code skills, commands, templates, and reference materials that enable:

- Creating Figma plugins from scratch
- Translating Figma designs into production-ready code
- Mapping Figma components to codebase files (Code Connect)
- Extracting design tokens and inspecting designs
- Generating project-specific design system rules
- Optimizing token usage when working with large Figma files

## Quick Start

```bash
/figma-setup       # Install tools and configure MCP servers (once per machine)
/figma-new         # Create a new Figma plugin project
/figma-help        # Show all available commands and workflows
```

## Commands

| Command | Description |
| --- | --- |
| `/figma-setup` | Install prerequisites (Node.js 22+, pnpm, Git, TypeScript) and configure MCP servers |
| `/figma-new` | Create a new Figma plugin project from template |
| `/figma-build` | Build, typecheck, and validate a Figma plugin |
| `/figma-implement` | Translate a Figma design URL into production-ready code |
| `/figma-inspect` | Inspect Figma designs — structure, tokens, screenshots |
| `/figma-connect` | Map Figma components to code using Code Connect |
| `/figma-rules` | Generate design system rules for consistent Figma-to-code output |
| `/figma-mastery` | Learn Figma concepts — components, auto-layout, tokens, Plugin API |
| `/figma-optimize` | Fetch Figma data efficiently via sub-agents (saves context tokens) |
| `/figma-browse` | Read and write Figma via REST API (comments, exports, data) |
| `/figma-diagram` | Create diagrams in FigJam (flowcharts, sequences, Gantt charts) |
| `/figma-help` | Show this reference page with all details |

## Architecture

```text
┌─────────────────────────────────────────────────┐
│                  Claude Code                     │
│                                                  │
│  Commands (12)     Skills (11)     References    │
│  ┌────────────┐   ┌────────────┐  ┌───────────┐ │
│  │ /figma-*   │──►│ SKILL.md   │  │ concepts  │ │
│  │ (triggers) │   │ (workflows)│  │ patterns  │ │
│  └────────────┘   └─────┬──────┘  │ templates │ │
│                         │         └───────────┘ │
│                         ▼                        │
│              ┌──────────────────┐                │
│              │   MCP Servers    │                │
│              │  (Figma tools)   │                │
│              └──────────────────┘                │
└─────────────────────────────────────────────────┘
```

**Three layers:**

1. **Commands** — lightweight triggers (`/figma-implement`, `/figma-inspect`, etc.)
2. **Skills** — structured workflows with step-by-step instructions, self-documentation, and cross-references
3. **MCP Servers** — raw Figma tools (`get_design_context`, `get_metadata`, `generate_diagram`, etc.)

## Skills

### Plugin Development

| Skill | What It Does |
| --- | --- |
| **figma-dev-setup** | Detects OS, installs Node.js/pnpm/Git/TypeScript, configures MCP servers |
| **figma-plugin-create** | Scaffolds a complete plugin project (manifest, package.json, tsconfig, esbuild, source files) |
| **figma-plugin-build** | Runs TypeScript checking, esbuild bundling, manifest validation, reports results |

### Design-to-Code

| Skill | What It Does |
| --- | --- |
| **figma-implement** | Fetches design context via MCP, analyzes project stack, generates adapted code, validates against screenshot |
| **figma-inspect** | 4 modes: Overview (structure + screenshot), Tokens (colors, typography, spacing), Full Context, Screenshot |
| **figma-connect** | Discovers components in Figma, searches codebase for matches, creates Code Connect mappings |
| **figma-rules** | Scans project conventions, calls MCP, generates `.claude/rules/figma-design-system.md` for consistent output |

### Advanced

| Skill | What It Does |
| --- | --- |
| **figma-mastery** | Knowledge base: components, variants, auto-layout, prototyping, design systems, Dev Mode, Plugin API |
| **figma-optimize** | Delegates Figma data fetching to sub-agents, returns compact summaries instead of raw MCP responses |
| **figma-browse** | Figma REST API access for reading file data, adding/deleting comments, exporting images |
| **figma-help** | Complete reference for all skills, commands, MCP servers, and workflows |

## MCP Servers

### Primary (configured by `/figma-setup`)

| Server | Type | Auth | Best For |
| --- | --- | --- | --- |
| **Figma Official Remote** | Remote (hosted by Figma) | OAuth | Production teams, most use cases |
| **Figma Desktop** | Local (Figma Desktop app) | None | Selection-based prompting, Dev Mode |

### Optional

| Server | Type | Best For |
| --- | --- | --- |
| **Framelink** | Local (stdio) | Optimized AI context, large files |
| **Claude Talk to Figma** | WebSocket + Plugin | Full read/write, free accounts |
| **html.to.design** | SaaS | Send HTML/CSS directly to Figma |
| **Composio** | Managed | Zero-config OAuth |

Setup commands:

```bash
# Official Remote (OAuth — recommended)
claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp

# Desktop (requires Figma Desktop with Dev Mode)
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp

# Framelink (REST API, optional)
claude mcp add figma-framelink -- npx -y figma-developer-mcp --figma-api-key=YOUR_KEY --stdio
```

## Figma Plugin Architecture

Figma plugins have two isolated execution contexts:

```text
┌─────────────────────┐     postMessage      ┌──────────────────────┐
│     SANDBOX          │ ◄──────────────────► │     UI (iframe)      │
│                      │                      │                      │
│  figma.* API         │                      │  DOM access          │
│  Document model      │                      │  fetch() / XHR       │
│  No DOM              │                      │  Canvas / WebGL      │
│  No fetch            │                      │  No figma.* API      │
│                      │                      │                      │
│  src/main.ts         │                      │  src/ui.ts + ui.html │
└─────────────────────┘                      └──────────────────────┘
```

- **Sandbox** (`main.ts`) — access to Figma Plugin API (`figma.*`). No DOM, no `fetch`.
- **UI** (`ui.ts` / `ui.html`) — full browser APIs. No direct Figma API access.
- **Communication** via `figma.ui.postMessage()` and `parent.postMessage({ pluginMessage: ... }, "*")`.

## Typical Workflows

### New Plugin Developer

```bash
/figma-setup          # install tools and MCP servers
/figma-new            # create a plugin project
pnpm watch            # develop with auto-rebuild
# Test in Figma → Plugins → Development → Import from manifest
/figma-build          # final build and validation
```

### Implement Figma Design

```bash
/figma-inspect [URL]    # understand the design first
/figma-implement [URL]  # generate production code
/figma-connect [URL]    # map components back to Figma
```

### Design System Team

```bash
/figma-rules            # encode project conventions
/figma-connect [URL]    # map all components to code
/figma-implement [URL]  # implement with rules applied
```

### Large File / Token Optimization

```bash
/figma-optimize [URL]   # get compact summary of large file
/figma-inspect [URL]    # deep dive on specific nodes
/figma-implement [URL]  # implement specific frames
```

## Build Workflow

```bash
pnpm typecheck   # TypeScript type checking
pnpm build       # Bundle with esbuild
pnpm watch       # Auto-rebuild on file changes
```

Build output goes to `dist/` (gitignored). The esbuild config bundles `main.ts` → `dist/code.js` and injects `ui.ts` into `dist/ui.html`.

## Project Structure

```text
.claude/
├── commands/           # 12 command files (lightweight triggers)
│   ├── figma-browse.md
│   ├── figma-build.md
│   ├── figma-connect.md
│   ├── figma-diagram.md
│   ├── figma-help.md
│   ├── figma-implement.md
│   ├── figma-inspect.md
│   ├── figma-mastery.md
│   ├── figma-new.md
│   ├── figma-optimize.md
│   ├── figma-rules.md
│   └── figma-setup.md
└── skills/             # 11 skill implementations
    ├── figma-browse/           # REST API access
    ├── figma-connect/          # Code Connect mapping
    ├── figma-dev-setup/        # Environment bootstrap
    │   └── references/         # OS-specific setup guides
    ├── figma-help/             # Complete reference
    ├── figma-implement/        # Design-to-code
    ├── figma-inspect/          # Design inspection
    ├── figma-mastery/          # Knowledge base
    │   └── references/         # Figma concepts deep dive
    ├── figma-optimize/         # Sub-agent optimization
    │   └── references/         # Prompt templates
    ├── figma-plugin-build/     # Build pipeline
    ├── figma-plugin-create/    # Project scaffolding
    │   └── assets/templates/   # Plugin file templates
    └── figma-rules/            # Design system rules
```

## Key Design Decisions

**Why custom skills instead of official plugins?**

The official Figma skills (via `claude plugin install figma@claude-plugins-official`) may be available but are unverified. Our custom skills add significant value on top of raw MCP tools:

- Self-documentation (Quick Help when invoked without arguments)
- Structured multi-step workflows
- Project context analysis and adaptation
- Cross-references between skills (`/figma-implement` loads `/figma-rules` output automatically)
- Design system integration
- Sub-agent delegation for token optimization

**Why two MCP servers?**

- **Official Remote** — works everywhere, OAuth auth, full tool set
- **Desktop** — enables selection-based prompting (select a frame in Figma, prompt without URLs)

## References

- [Figma MCP Server Docs](https://developers.figma.com/docs/figma-mcp-server)
- [Figma Blog — Claude Code to Figma](https://figma.com/blog/introducing-claude-code-to-figma)
- [Claude Code MCP Docs](https://code.claude.com/docs/en/mcp)
- [Figma API Tokens](https://figma.com/developers/api#access-tokens)
- [spec.md](spec.md) — full specification with all MCP servers and skill details

## License

Private project.
