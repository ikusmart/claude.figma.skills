---
name: figma-connect
description: "Connect Figma design components to their code implementations using Figma Code Connect. Maps component nodes in Figma to source files in the codebase. Use when: user says code connect, connect component, map Figma to code, link component to code, create code connect mapping, or wants to maintain design-code consistency."
---

# Code Connect — Map Figma Components to Code

## Self-Documentation

When invoked WITHOUT a Figma URL or clear input:

1. Display the Quick Help block below
2. Ask the user to provide a Figma URL or describe what they want to connect

When invoked WITH a Figma URL or clear intent — skip help and proceed to Step 1.

## Quick Help

**What I do:** Connect Figma design components to their code implementations using Figma's Code Connect feature. This ensures that when developers inspect a component in Figma Dev Mode, they see the actual code usage.

**Example prompts:**
- `Connect this Figma button to my code: https://figma.com/design/abc/DS?node-id=42-15`
- `Map all components in this file to code: [URL]`
- `Link Figma components to my React components`

**Prerequisites:**
- Figma MCP server configured. Run `/figma-setup` if not configured.
- Figma components must be published to a team library.
- A codebase with implemented components to map to.

**What you get:**
- Mappings between Figma component nodes and source code files
- Summary report: connected, already connected, could not connect

---

## Step 1: Parse Figma URL

Extract `fileKey` and `nodeId` from the URL:
- `figma.com/design/:fileKey/:fileName?node-id=:nodeId` — convert `-` to `:` in nodeId
- `figma.com/design/:fileKey/branch/:branchKey/:fileName` — use branchKey as fileKey

## Step 2: Discover Components

Call `get_metadata(fileKey, nodeId)` to fetch the node tree.

Identify component nodes — look for nodes of type `COMPONENT` or `COMPONENT_SET` in the metadata response. These represent Figma components and component groups with variants.

## Step 3: Check Existing Mappings

Call `get_code_connect_map(fileKey, nodeId)` to see which components are already connected.

Filter out already-connected components from the list.

## Step 4: Get Suggestions

Call `get_code_connect_suggestions(fileKey, nodeId)` to get Figma's suggested mappings.

Review suggestions and compare with the codebase. If suggestions are empty or unhelpful, proceed directly to codebase search in Step 5.

## Step 5: Search Codebase

For each unconnected component, search the project for matching implementations.

**Search order:**

1. **Exact name match** — search for files named exactly like the component (e.g., "Button" → `Button.tsx`)
2. **Case variant match** — try PascalCase, kebab-case, camelCase variants (e.g., "IconButton" → `icon-button.tsx`)
3. **Path pattern match** — search in common component directories (`src/components/`, `src/ui/`, `lib/`)
4. **Partial match** — if no exact match, present closest matches to the user for confirmation

**Auto-detect `label` from file extension:** `.tsx`/`.jsx` → React, `.vue` → Vue, `.svelte` → Svelte, `.swift` → SwiftUI, `.kt` → Compose

Present matches to the user for confirmation before creating mappings.

## Step 6: Create Mappings

For each confirmed match, call:

```
add_code_connect_map(
  nodeId: "component-node-id",
  fileKey: "file-key",
  source: "src/components/Button.tsx",
  componentName: "Button",
  label: "React"  // or Vue, Svelte, etc.
)
```

Supported labels: React, Web Components, Vue, Svelte, Storybook, Javascript, Swift UIKit, Objective-C UIKit, SwiftUI, Compose, Java, Kotlin, Android XML Layout, Flutter, Markdown.

**For multiple components:** Use `send_code_connect_mappings` to batch all mappings in a single call instead of calling `add_code_connect_map` repeatedly. This is more efficient when connecting 3+ components at once.

## Step 7: Report

Present a summary:

```
=== Code Connect Summary ===
Total components found: X
Successfully connected: Y
  - Button (1:2) → src/components/Button.tsx
  - Card (1:5) → src/components/Card.tsx
Already connected: Z
  - Icon (1:3) → src/icons/Icon.tsx
Could not connect: W
  - CustomWidget (1:10) — No matching component found
============================
```

Suggest running `/figma-implement` for components that need to be built from scratch.
