# Figma × Claude Code: Skills, Agents & MCP Servers — Complete Guide

> Last updated: February 2026

---

## Part 1: Claude Code Skills for Figma (Simple → Advanced)

Skills are packaged instructions that teach Claude Code repeatable workflows. They don't replace MCP connections — they guide the agent on _which tools to use_, _how to sequence them_, and _how to apply results_.

### 1.1 Implement Design (Official, by Figma)

**Complexity:** ⭐⭐ Basic
**What it does:** Translates Figma designs into production-ready code with pixel-perfect (1:1) visual fidelity.

**Triggers:** "implement design", "generate code", "implement component", "build Figma design", providing Figma URLs, or asking to build components matching Figma specs.

**Workflow:**

1. Extract `fileKey` and `nodeId` from the Figma URL
2. Call `get_design_context(fileKey, nodeId)` — fetches layout, tokens, components
3. Call `get_screenshot(fileKey, nodeId)` — visual reference / source of truth
4. Download assets (images, icons, SVGs)
5. Translate Figma output (React + Tailwind by default) into project conventions
6. Validate against screenshot for 1:1 parity

**Example prompt:**

```
Implement this Figma button component:
https://figma.com/design/kL9xQn2VwM8pYrTb4ZcHjF/DesignSystem?node-id=42-15
```

**Key rules:**

- Treats Figma MCP output as a _representation_, not final code
- Replaces Tailwind utilities with project's design tokens
- Reuses existing components instead of duplicating
- Documents any deviations from Figma design

**Link:** [mcpservers.org/claude-skills/figma/implement-design](https://mcpservers.org/claude-skills/figma/implement-design)

---

### 1.2 Code Connect Components (Official, by Figma)

**Complexity:** ⭐⭐⭐ Intermediate
**What it does:** Connects Figma design components to their code implementations using Figma's Code Connect feature, maintaining design-code consistency.

**Triggers:** "code connect", "connect this component to code", "connect Figma to code", "map this component", "link component to code", "create code connect mapping".

**Workflow:**

1. Fetch the Figma node tree and identify components (nodes of type `<symbol>`)
2. Call `get_code_connect_map()` to check existing mappings
3. Search codebase for matching components
4. Call `add_code_connect_map()` to establish the mapping
5. Repeat for all unconnected components

**Example prompt:**

```
Connect this Figma button to my code:
https://figma.com/design/kL9xQn2VwM8pYrTb4ZcHjF/DesignSystem?node-id=42-15
```

**Example output:**

```
Code Connect Summary:
- Total components found: 5
- Successfully connected: 3
  - Button (1:2) → src/components/Button.tsx
  - Card (1:5) → src/components/Card.tsx
  - Input (1:8) → src/components/Input.tsx
- Already connected: 1
  - Icon (1:3) → src/icons/Icon.tsx
- Could not connect: 1
  - CustomWidget (1:10) - No matching component found
```

**Requirement:** Figma components must be published to a team library.

**Link:** [mcpservers.org/claude-skills/figma/code-connect-components](https://mcpservers.org/claude-skills/figma/code-connect-components)

---

### 1.3 Create Design System Rules (Official, by Figma)

**Complexity:** ⭐⭐⭐⭐ Advanced
**What it does:** Generates custom, project-specific design system rules that guide AI agents to produce consistent code when implementing Figma designs. Encodes "unwritten knowledge" of your codebase.

**Triggers:** "create design system rules", "generate rules for my project", "set up design rules", "customize design system guidelines".

**What gets generated:**

```markdown
# Figma MCP Integration Rules

## Component Organization

- UI components are in `src/components/ui/`
- Page components are in `src/app/`
- Use Tailwind for styling

## Figma Implementation Flow

1. Run get_design_context for the node
2. Run get_screenshot for visual reference
3. Map Figma colors to Tailwind colors in `tailwind.config.js`
4. Reuse components from `src/components/ui/` when possible
5. Validate against Figma for 1:1 look and behavior
```

**Why it matters:** Reduces repetitive prompting and ensures consistent output across all Figma implementation tasks. Essentially a "new developer onboarding doc" for Claude Code.

**Link:** [mcpservers.org/claude-skills/figma/create-design-system-rules](https://mcpservers.org/claude-skills/figma/create-design-system-rules)

---

### 1.4 Figma Mastery Skill (Community)

**Complexity:** ⭐⭐ Basic (knowledge-based)
**What it does:** A knowledge-base skill that teaches Claude about Figma UI/UX workflows — components, variants, auto-layout, prototyping, design systems, Dev Mode, plugins, and the Figma API.

**Best for:** Getting Claude to reason about Figma concepts, explain design patterns, guide handoff processes.

**Link:** [claude-plugins.dev/skills/@Useforclaude/skills-claude/figma-mastery-skill](https://claude-plugins.dev/skills/@Useforclaude/skills-claude/figma-mastery-skill)

---

### 1.5 Figma Framelink Sub-Agent Skill (Community / Custom)

**Complexity:** ⭐⭐⭐⭐⭐ Expert
**What it does:** Optimizes token consumption when working with Figma MCP by delegating Figma data fetching to a Sub Agent (Claude Code's Task tool), processing data in an isolated context, and returning only a compact summary to the main session.

**Problem it solves:** A single `get_figma_data` call can consume ~100K tokens, filling up context fast. This skill reduces it to ~500 tokens by using sub-agent summarization.

**Pattern:**

```
Pattern 1: Simple fetch (screen lists, metadata)
→ Sub Agent fetches with depth=1, summarizes

Pattern 2: Detailed fetch (typography, colors, assets)
→ Sub Agent fetches recursively, extracts design tokens, summarizes
```

**How to create:** Use the `skill-creator` skill:

```bash
/plugin marketplace add anthropics/skills
```

Then tell Claude: "Create a new skill for optimized Figma data fetching using sub-agents"

**Reference:** [zenn.dev/gaudiy_blog/articles/1737f814756e37](https://zenn.dev/gaudiy_blog/articles/1737f814756e37)

---

### 1.6 Figma-Friend Plugin (Community, Browser-based)

**Complexity:** ⭐⭐⭐⭐ Advanced
**What it does:** Instead of using Figma's REST API, gives Claude direct access to Figma's Plugin API _through a browser_. Claude opens Figma in Chrome, writes and executes plugin code directly.

**Install:**

```bash
/plugin marketplace add markacianfrani/claude-code-figma
/plugin install figma-friend
```

**How it works:**

1. Uses Chrome DevTools CDP MCP for browser control
2. Claude navigates to Figma, accesses the `figma` global object
3. Writes and executes Plugin API code to read/modify designs
4. No third-party websocket servers needed

**Key advantage:** Can _modify_ designs, not just read them. Works with any Figma account (even free).

**Link:** [cianfrani.dev/posts/a-better-figma-mcp](https://cianfrani.dev/posts/a-better-figma-mcp/)

---

### How to Install Skills

**Claude Code (Plugin Directory):**

```bash
claude plugin install figma@claude-plugins-official
```

**Claude.ai (Skills Directory):**
Browse at [claude.com/connectors](https://claude.com/connectors) → Figma → Enable in Settings > Capabilities > Skills

**Manual:**
Download from GitHub, place in `~/.claude/skills/`

---

## Part 2: MCP Servers for Figma

MCP (Model Context Protocol) servers provide the actual _data bridge_ between Figma and Claude Code. Skills tell Claude _how_ to work; MCP servers give Claude _access_.

---

### 2.1 Figma Official MCP Server (Remote)

**Type:** Remote (hosted by Figma)
**Auth:** OAuth (browser-based)
**License:** Free for all seats (limited to 6 calls/month on Starter/View/Collab); per-minute rate limits on Dev/Full seats
**Works with:** Claude Code, Cursor, VS Code, Windsurf, Codex

**Setup for Claude Code:**

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

Global setup (across all projects):

```bash
claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp
```

**Authentication:**

```
/mcp          # in Claude Code
→ select figma
→ Authenticate
✓ Authentication successful. Connected to figma
```

**Available tools:**
| Tool | Description |
|------|-------------|
| `get_design_context` | Returns structured layout, styling, component data (React + Tailwind by default) |
| `get_screenshot` | Visual screenshot of a Figma node |
| `get_metadata` | High-level node structure/tree |
| `get_variables` | Design tokens — colors, spacing, typography |
| `get_code_connect_map` | Maps Figma node IDs → code components |
| `add_code_connect_map` | Creates new Code Connect mappings |
| `generate_figma_design` | **Code to Figma** — sends rendered UI back as editable frames _(Claude Code only)_ |
| `download_assets` | Downloads image assets (icons, images) from Figma |

**Example prompts:**

```
Implement this design: https://figma.com/design/abc123/MyApp?node-id=10-5

Extract the color palette from: https://figma.com/design/abc123/DesignSystem?node-id=1-1

Send this to Figma    # captures live browser UI → editable Figma frames
```

**Links:**

- Docs: [developers.figma.com/docs/figma-mcp-server/remote-server-installation](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)
- Guide: [help.figma.com/hc/en-us/articles/32132100833559](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)
- GitHub: [github.com/figma/mcp-server-guide](https://github.com/figma/mcp-server-guide)

---

### 2.2 Figma Official MCP Server (Desktop / Local)

**Type:** Local (runs on your machine via Figma Desktop app)
**Auth:** None (local connection)
**Requirement:** Figma Desktop app with Dev Mode enabled, Dev or Full seat on a paid plan

**Setup:**

1. Open Figma Desktop → update to latest version
2. Open a Design file → toggle to Dev Mode (`Shift+D`)
3. In the inspect panel → click "Enable desktop MCP server"
4. Server runs at `http://127.0.0.1:3845/mcp`

**Claude Code config:**

```bash
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
```

Or in `.mcp.json`:

```json
{
  "mcpServers": {
    "figma-desktop": {
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

**Key advantage over Remote:** Supports **selection-based prompting** — select a frame in Figma Desktop, then prompt Claude without pasting URLs.

**Link:** [developers.figma.com/docs/figma-mcp-server/local-server-installation](https://developers.figma.com/docs/figma-mcp-server/local-server-installation/)

---

### 2.3 Framelink Figma MCP (Community, 10K+ ⭐ on GitHub)

**Type:** Local (stdio)
**Auth:** Figma Personal Access Token
**License:** Open source
**Works with:** Claude Code, Cursor, VS Code, Windsurf, Cline, Zed

**What it does:** Provides Figma layout information to AI coding agents. Simplifies and translates raw Figma API responses to include only the most relevant layout/styling data, reducing context size for better accuracy.

**Setup:**

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR-KEY",
        "--stdio"
      ]
    }
  }
}
```

For Claude Code:

```bash
claude mcp add figma-framelink -- npx -y figma-developer-mcp --figma-api-key=YOUR-KEY --stdio
```

**Tools:**
| Tool | Description |
|------|-------------|
| `get_figma_data` | Fetch file info, layout, styling (with `depth` option for controlling recursion) |
| `download_figma_images` | Download SVG/PNG images by node IDs |

**Example:**

```
Implement this design using the Figma data:
https://www.figma.com/design/ABC123/MyProject?node-id=1-234
```

**⚠️ Security note:** A critical RCE vulnerability (CVE-2025-53967) was found in versions before 0.6.3. **Always update to ≥0.6.3** or consider migrating to the official Figma MCP server.

**Links:**

- GitHub: [github.com/GLips/Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP)
- Docs: [framelink.ai/docs](https://framelink.ai/docs)

---

### 2.4 Claude Talk to Figma MCP (Community)

**Type:** Local (WebSocket + Figma Plugin)
**Auth:** None (local plugin connection)
**License:** Open source
**Works with:** Claude Desktop, Claude Code, Cursor, Windsurf, VS Code + Copilot, Cline, Roo Code

**What it does:** Full read/write access to Figma. Unlike official MCP which is mostly read-only + code generation, this one can **modify designs directly** — create, update, delete elements in your Figma file.

**Setup:**

1. Install socket server:

```bash
git clone https://github.com/arinspunk/claude-talk-to-figma-mcp
cd claude-talk-to-figma-mcp
bun install && bun run socket
```

2. Import Figma plugin: Menu → Plugins → Development → Import from manifest
3. Connect: Copy channel ID → tell agent "Connect to Figma, channel {your-ID}"

**Quick setup (npx):**

```json
{
  "mcpServers": {
    "ClaudeTalkToFigma": {
      "command": "npx",
      "args": [
        "-p",
        "claude-talk-to-figma-mcp@latest",
        "claude-talk-to-figma-mcp-server"
      ]
    }
  }
}
```

**Key advantage:** Works with **any Figma account (even free)**. No Dev Mode license required.

**Link:** [github.com/arinspunk/claude-talk-to-figma-mcp](https://github.com/arinspunk/claude-talk-to-figma-mcp)

---

### 2.5 html.to.design MCP

**Type:** Remote
**Auth:** Plugin-based (requires html.to.design Figma plugin)
**License:** Commercial (html.to.design subscription)
**Works with:** Claude Desktop, Claude.ai, Claude Code, Cursor

**What it does:** Sends AI-generated HTML/CSS designs **directly to your Figma canvas** as editable layers. No export/import steps — anything Claude generates appears in Figma in real-time.

**Workflow:**

1. Prompt Claude to create a design (generates HTML)
2. Claude sends it to Figma via MCP
3. Design appears on canvas as editable Figma layers
4. Iterate in Claude or Figma — changes sync bidirectionally

**Setup:** Follow instructions at [html.to.design/docs/mcp-tab](https://html.to.design/docs/mcp-tab/)

**Example:**

```
Create a hero section for a SaaS landing page with a gradient background,
headline, subtext, and CTA button. Send it to Figma.
```

**Link:** [html.to.design/blog/from-claude-to-figma-via-mcp](https://html.to.design/blog/from-claude-to-figma-via-mcp/)

---

### 2.6 figma-mcp by rui-branco (Community, Lightweight)

**Type:** Local (stdio)
**Auth:** Figma Personal Access Token
**Focus:** Image export + design specs for Claude Code

**What it does:** Focused on fetching design info and **exporting frames as high-resolution images** with smart section splitting for large frames. Also integrates with jira-mcp for cross-tool workflows.

**Setup:**

```bash
npx @rui.branco/figma-mcp setup
# Restart Claude Code and run /mcp to verify
```

Or manually:

```bash
claude mcp add --transport stdio figma -- node $HOME/.config/figma-mcp/index.js
```

**Features:**

- File name, last modified, frame dimensions
- Export as PNG, SVG, JPG, or PDF
- 2x scale by default (retina)
- Auto-splits large frames into readable sections
- Works standalone or with jira-mcp

**Link:** [github.com/rui-branco/figma-mcp](https://github.com/rui-branco/figma-mcp)

---

### 2.7 figma-mcp by karthiks3000 (Community, Read + Write)

**Type:** Local (stdio + WebSocket)
**Auth:** Figma Personal Access Token
**Modes:** Readonly (via REST API) + Write (via Figma Plugin bridge)

**Features:**

- **Readonly mode:** Extract design info from Figma files via URL
- **Write mode:** Create/update designs through WebSocket plugin bridge
- Unit + integration testing included
- TypeScript-based, well-structured codebase

**Link:** [github.com/karthiks3000/figma-mcp-server](https://github.com/karthiks3000/figma-mcp-server)

---

### 2.8 Composio Figma MCP (Managed Service)

**Type:** Remote (hosted by Composio)
**Auth:** OAuth via Composio
**Works with:** Claude Code, Cursor, Gemini CLI

**What it does:** Managed Figma MCP server — no API keys to manage, handles OAuth automatically.

**Setup:**

```bash
npx @composio/mcp@latest setup \
  "https://mcp.composio.dev/partner/composio/figma/mcp?customerId=<id>" \
  "figma-605dcr-13" --client claude-code
```

**Link:** [composio.dev/blog/how-to-use-figma-mcp-with-claude-code-to-build-pixel-perfect-designs](https://composio.dev/blog/how-to-use-figma-mcp-with-claude-code-to-build-pixel-perfect-designs)

---

### 2.9 Chrome DevTools CDP (Browser-based approach)

**Type:** Local (browser MCP)
**Auth:** Your Figma login in browser
**What it does:** Gives Claude direct access to Figma's Plugin API through Chrome DevTools. No Figma REST API or tokens needed.

**Setup:**

```bash
claude mcp add chrome-devtools npx chrome-devtools-mcp@latest
```

**Then prompt:**

```
Navigate to https://www.figma.com, log in, open my design file,
and use the Figma Plugin API to modify the selected frame.
```

**Key advantage:** Full Figma Plugin API access — can do anything a Figma plugin can do.
**Risk:** Browser-level access means Claude can interact with other tabs/pages. Review all tool calls.

**Link:** [cianfrani.dev/posts/a-better-figma-mcp](https://cianfrani.dev/posts/a-better-figma-mcp/)

---

### 2.10 figma-mcp by MatthewDailey (Community, Simple)

**Type:** Local (stdio)
**Auth:** Figma Personal Access Token
**Focus:** Minimal, simple — add a Figma file to your chat by URL

**Setup:**

```json
{
  "mcpServers": {
    "figma-mcp": {
      "command": "npx",
      "args": ["figma-mcp"],
      "env": {
        "FIGMA_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

**Example:**

```
What's in this figma file?
https://www.figma.com/design/MLkM98c1s4A9o9CMnHEyEC
```

**Link:** [mcpservers.org/servers/MatthewDailey/figma-mcp](https://mcpservers.org/servers/MatthewDailey/figma-mcp)

---

## Comparison Matrix

| MCP Server                    | Read | Write              | Free Account       | Auth               | Best For                 |
| ----------------------------- | ---- | ------------------ | ------------------ | ------------------ | ------------------------ |
| **Figma Official (Remote)**   | ✅   | ✅ (Code to Figma) | ✅ (6 calls/mo)    | OAuth              | Production teams         |
| **Figma Official (Desktop)**  | ✅   | ✅ (Code to Figma) | ❌ (Dev/Full seat) | Local              | Selection-based work     |
| **Framelink**                 | ✅   | ❌                 | ✅                 | API Token          | Optimized context for AI |
| **Claude Talk to Figma**      | ✅   | ✅                 | ✅                 | Local plugin       | Design modification      |
| **html.to.design**            | ❌   | ✅                 | ❌ (subscription)  | Plugin             | HTML → Figma layers      |
| **Chrome DevTools CDP**       | ✅   | ✅                 | ✅                 | Browser login      | Full Plugin API access   |
| **Composio**                  | ✅   | ❌                 | ✅                 | Managed OAuth      | Zero-config setup        |
| **figma-mcp (MatthewDailey)** | ✅   | ❌                 | ✅                 | API Token          | Simple file inspection   |
| **figma-mcp (rui-branco)**    | ✅   | ❌                 | ✅                 | API Token          | Image export + Jira      |
| **figma-mcp (karthiks3000)**  | ✅   | ✅                 | ✅                 | API Token + Plugin | Full read/write          |

---

## Recommended Stack for a Team

**Minimal setup:**

```bash
# Official remote MCP (no desktop app needed)
claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp

# Install official Figma plugin with skills
claude plugin install figma@claude-plugins-official
```

**Advanced setup (design system team):**

```bash
# Official desktop MCP (for selection-based prompting)
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp

# Official plugin with all 3 skills
claude plugin install figma@claude-plugins-official

# Optional: Framelink for optimized context in large files
claude mcp add figma-framelink -- npx -y figma-developer-mcp --figma-api-key=YOUR-KEY --stdio
```

---

## Further Reading

- [Figma MCP Server Developer Docs](https://developers.figma.com/docs/figma-mcp-server/)
- [Figma Blog: Claude Code to Figma](https://www.figma.com/blog/introducing-claude-code-to-figma/)
- [Figma Blog: FigJam + Claude](https://www.figma.com/blog/think-outside-of-the-box-with-claude-and-figjam/)
- [Claude Code MCP Docs](https://code.claude.com/docs/en/mcp)
- [Skills Directory](https://claude.com/connectors)
- [Awesome Claude Skills (GitHub)](https://github.com/travisvn/awesome-claude-skills)
- [The Complete Guide to Building Skills for Claude (PDF)](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)
