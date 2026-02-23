---
name: figma-optimize
description: "Optimize token consumption when working with Figma MCP by delegating data fetching to sub-agents. Processes Figma data in isolated Task agents and returns compact summaries. Use when: working with large Figma files, user says optimize Figma fetch, reduce tokens, sub-agent fetch, large Figma file, or context window is getting full from Figma data."
---

# Optimized Figma Fetch via Sub-Agents

## Self-Documentation

When invoked WITHOUT a Figma URL or clear input:

1. Display the Quick Help block below
2. Ask what Figma data the user needs and provide the URL

When invoked WITH a Figma URL and clear intent — skip help and proceed to Step 1.

## Quick Help

**What I do:** Fetch Figma design data without flooding your context window. Tools like `get_design_context` can return large responses for complex files. I delegate the fetch to a sub-agent that processes the data and returns only a compact summary.

**Example prompts:**

- `Fetch this large Figma file efficiently: [URL]`
- `Get design tokens from this file without using too many tokens: [URL]`
- `Optimize: list all screens in this Figma file: [URL]`

**Prerequisites:**

- Figma MCP server configured (Official Remote or Desktop). Run `/figma-setup` if not configured.

**When to use this instead of /figma-inspect:**

- The Figma file is very large (many pages/frames)
- You're making repeated fetches in one session
- Your context window is getting full
- You need only specific data (tokens, screen list, component inventory) not the full design

---

## Step 1: Determine Fetch Pattern

Ask the user (or infer from context) what data they need:

**Pattern 1: Simple fetch** (metadata, screen lists, file overview)

- Best for: "What's in this file?", "List all screens", "Show page structure"
- Sub-agent uses `get_metadata` for lightweight XML structure

**Pattern 2: Token extraction** (colors, typography, spacing)

- Best for: "Extract color palette", "Get all typography styles", "List spacing tokens"
- Sub-agent uses `get_variable_defs` for design token data

**Pattern 3: Component inventory** (component list with variants)

- Best for: "List all components", "Component audit", "What's in this library?"
- Sub-agent uses `get_metadata` + `get_code_connect_map` to build inventory

**Pattern 4: Specific node deep dive** (detailed info on one frame)

- Best for: detailed analysis of a single frame/component before implementing
- Sub-agent uses `get_design_context` for full node data

Read `references/sub-agent-patterns.md` for detailed prompt templates.

## Step 2: Parse Figma URL

Extract `fileKey` and `nodeId` from the URL:

- `figma.com/design/:fileKey/:fileName?node-id=:nodeId` — convert `-` to `:` in nodeId
- `figma.com/design/:fileKey/branch/:branchKey/:fileName` — use branchKey as fileKey

## Step 3: Launch Sub-Agent

Use the **Task tool** to launch a sub-agent with `subagent_type="general-purpose"`.

The sub-agent has access to the same MCP tools. Include in the prompt:

1. The specific MCP tool to call and its parameters (fileKey, nodeId)
2. What data to extract from the response
3. Output format (markdown tables, structured lists)
4. Token budget constraint ("Total output must be under N tokens")

See `references/sub-agent-patterns.md` for ready-to-use prompt templates.

## Step 4: Process Results

The sub-agent returns a compact summary. Present it to the user.

If more detail is needed for specific nodes, launch another targeted sub-agent for just that node (Pattern 4).

**Fallback:** If the file turns out to be small and the sub-agent returns quickly, suggest using `/figma-inspect` directly next time for simpler files.

## Step 5: Suggest Next Steps

Based on what was fetched, suggest:

- `/figma-implement [URL]` — to implement a specific frame
- `/figma-inspect [URL]` — for detailed inspection of a specific node
- `/figma-connect [URL]` — to map components to code
