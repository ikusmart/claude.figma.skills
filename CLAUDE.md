# Figma Plugin Development Workspace

## First-Time Setup

Run `/figma-setup` to install all prerequisites (Node.js 22+, pnpm, Git, TypeScript) and configure Figma MCP servers.

## Available Commands

| Command | Description |
|---------|-------------|
| `/figma-setup` | Install prerequisites and configure MCP servers |
| `/figma-new` | Create a new Figma plugin project from template |
| `/figma-build` | Build, typecheck, and validate a plugin project |
| `/figma-implement` | Translate a Figma design URL into production-ready code |
| `/figma-inspect` | Inspect and analyze Figma designs — structure, tokens, screenshots |
| `/figma-connect` | Map Figma design components to codebase components (Code Connect) |
| `/figma-rules` | Generate project-specific design system rules |
| `/figma-mastery` | Figma knowledge base — components, auto-layout, tokens, Plugin API |
| `/figma-optimize` | Fetch Figma data efficiently via sub-agents (saves context tokens) |
| `/figma-browse` | Read and write Figma via REST API (comments, exports, data) |
| `/figma-diagram` | Create diagrams in FigJam (flowcharts, sequences, Gantt) |
| `/figma-help` | Full reference for all skills, commands, and MCP servers |

## MCP Servers

This project uses two primary Figma MCP servers. Run `/figma-setup` to configure them automatically.

- **Figma Official Remote** — Remote server hosted by Figma. OAuth auth. Best for most use cases and production teams.
- **Figma Desktop** — Local connection to Figma Desktop app. No auth needed. Best for selection-based prompting and Dev Mode.

Optional third server for advanced use:

- **Framelink (figma-developer-mcp)** — Local stdio server. Requires API Token. Provides simplified, optimized responses for large files.

To add manually:
```bash
# Official Remote MCP (OAuth — recommended)
claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp

# Desktop MCP (requires Figma Desktop running with Dev Mode)
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp

# Framelink MCP (requires Figma Personal Access Token)
claude mcp add figma-framelink -- npx -y figma-developer-mcp --figma-api-key=YOUR_KEY --stdio
```

For additional MCP servers (Claude Talk to Figma, html.to.design, Chrome DevTools CDP, etc.) run `/figma-help`.

## Build Workflow

```bash
pnpm typecheck   # TypeScript type checking
pnpm build       # Bundle with esbuild
pnpm watch       # Auto-rebuild on file changes
```

## Figma Plugin Architecture

Figma plugins have two execution contexts that communicate via messages:

- **Sandbox** (`main.ts`) — runs in Figma's JS sandbox. Has access to the Figma Plugin API (`figma.*`). No DOM, no `fetch`, no browser APIs.
- **UI** (`ui.ts` / `ui.html`) — runs in an `<iframe>`. Has full browser APIs (DOM, fetch, etc.). No direct access to Figma API.

Communication between them:
```typescript
// Sandbox → UI
figma.ui.postMessage({ type: "data", payload: ... });

// UI → Sandbox
parent.postMessage({ pluginMessage: { type: "action", ... } }, "*");
```

## Conventions

- Always use `@figma/plugin-typings` for type safety
- Build output goes to `dist/` (gitignored)
- `manifest.json` is the source of truth for plugin config
- Use `documentAccess: "dynamic-page"` for all new plugins
- Test plugins via: Figma → Plugins → Development → Import plugin from manifest
