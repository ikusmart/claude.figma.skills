---
name: figma-inspect
description: "Read-only inspection and analysis of Figma designs — view structure, extract design tokens, take screenshots, get full design context. Use when: user says inspect design, show tokens, what's in this Figma file, show me the design, analyze Figma, extract colors, or wants to understand a Figma file before implementing."
---

# Inspect Figma Design

## Self-Documentation

When invoked WITHOUT a Figma URL or clear input:

1. Display the Quick Help block below
2. Ask the user for a Figma URL and what they want to inspect

When invoked WITH a Figma URL — skip help and proceed to Step 1.

## Quick Help

**What I do:** Read-only inspection of Figma designs. View structure, extract tokens, take screenshots, analyze design context — all without modifying anything. Perfect for understanding a design before implementing it.

**4 modes:**

| Mode | What you get | Best for |
|------|-------------|----------|
| **Overview** | Structure tree + screenshot | Quick look at what's in the file |
| **Tokens** | Colors, typography, spacing variables | Setting up design tokens in code |
| **Full Context** | Complete layout, styling, component data | Detailed analysis before implementing |
| **Screenshot** | High-res visual of any node | Visual reference or documentation |

**Example prompts:**
- `Inspect this design: https://figma.com/design/abc/App?node-id=1-5`
- `Show me the design tokens from: [URL]`
- `Take a screenshot of this Figma frame: [URL]`
- `What's the structure of this Figma page? [URL]`

**Prerequisites:**
- Figma MCP server configured (Official Remote or Desktop). Run `/figma-setup` if not.

---

## Step 1: Parse Figma URL

Extract `fileKey` and `nodeId` from the URL:
- `figma.com/design/:fileKey/:fileName?node-id=:nodeId` — convert `-` to `:` in nodeId
- `figma.com/design/:fileKey/branch/:branchKey/:fileName` — use branchKey as fileKey

## Step 2: Choose Mode

If the user's intent is clear, auto-select the mode. Otherwise ask:

- **Overview** — "I want to see what's in this file"
- **Tokens** — "I want design tokens / colors / typography"
- **Full Context** — "I want the complete design data"
- **Screenshot** — "I just need a visual"

## Step 3: Fetch Data

### Mode: Overview

1. Call `get_metadata(fileKey, nodeId)` — returns node structure in XML format
2. Call `get_screenshot(fileKey, nodeId)` — visual snapshot
3. Present: tree structure + screenshot + summary (frame count, component count, types)

### Mode: Tokens

1. Call `get_variable_defs(fileKey, nodeId)` — returns variable definitions
2. Present organized tables:
   - **Colors:** name → hex value
   - **Typography:** name → font, size, weight, line-height
   - **Spacing:** name → value
   - **Effects:** name → shadow/blur definition

### Mode: Full Context

1. Call `get_design_context(fileKey, nodeId)` — complete layout, styling, component data
2. Call `get_screenshot(fileKey, nodeId)` — visual reference
3. Present: code representation + screenshot + component list + style summary

### Mode: Screenshot

1. Call `get_screenshot(fileKey, nodeId)` — visual screenshot
2. Present the screenshot with basic info (node name, dimensions)

## Step 4: Suggest Next Steps

Based on what was inspected, suggest:

- `/figma-implement [URL]` — to turn this design into code
- `/figma-connect [URL]` — to map components to existing code
- `/figma-rules` — to generate design system rules from these tokens
- `/figma-optimize [URL]` — if the file is large and context-heavy
