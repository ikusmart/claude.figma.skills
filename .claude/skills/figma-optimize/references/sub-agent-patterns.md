# Sub-Agent Fetch Patterns for Figma

Reference file for the figma-optimize skill. Contains prompt templates for efficient Figma data fetching via Task sub-agents using the official Figma MCP server tools.

---

## Why Sub-Agents?

The `get_design_context` MCP tool can return large responses for complex files — detailed layout, styling, and component data that fills the main context window. By delegating to a sub-agent via the Task tool, the data is processed in an isolated context and only a compact summary is returned.

---

## Pattern 1: Simple Fetch (Screen Lists, Metadata)

**Use when:** "What's in this file?", "List all screens", "Show page structure"

**MCP tool:** `get_metadata(fileKey, nodeId)` — returns lightweight XML structure

**Task prompt template:**

```
You have access to the Figma MCP server.

Call get_metadata with:
- fileKey: {fileKey}
- nodeId: {nodeId}

From the XML response, extract and return ONLY:
1. List of pages with their names
2. For each page, list top-level frames: name, type, approximate dimensions
3. Total count of nodes

Format as a clean markdown table. Example:

| Page | Frame | Type |
|------|-------|------|
| Homepage | Hero Section | FRAME |
| Homepage | Features | FRAME |
| Login | Login Form | COMPONENT |

Do NOT include raw XML, node IDs, or styling data.
Total output must be under 500 tokens.
```

---

## Pattern 2: Design Token Extraction

**Use when:** "Extract color palette", "Get typography styles", "List spacing tokens"

**MCP tool:** `get_variable_defs(fileKey, nodeId)` — returns variable definitions

**Task prompt template:**

```
You have access to the Figma MCP server.

Call get_variable_defs with:
- fileKey: {fileKey}
- nodeId: {nodeId}

From the response, extract and return ONLY design tokens organized as:

### Colors
| Name | Value |
|------|-------|
| Primary/500 | #3B82F6 |

### Typography
| Name | Font | Size | Weight | Line Height |
|------|------|------|--------|-------------|
| Heading/H1 | Inter | 32px | 700 | 40px |

### Spacing (if found)
| Name | Value |
|------|-------|
| sm | 8px |

Do NOT include layout data, positions, or raw JSON.
Total output must be under 800 tokens.
```

---

## Pattern 3: Component Inventory

**Use when:** "List all components", "What components are in this library?", "Component audit"

**MCP tools:** `get_metadata(fileKey, nodeId)` + `get_code_connect_map(fileKey, nodeId)`

**Task prompt template:**

```
You have access to the Figma MCP server.

Step 1: Call get_metadata with:
- fileKey: {fileKey}
- nodeId: {nodeId}

Step 2: Call get_code_connect_map with the same fileKey and nodeId.

From the combined results, extract:

### Components
| Name | Type | Code Connected | Source |
|------|------|---------------|--------|
| Button | COMPONENT_SET | Yes | src/components/Button.tsx |
| Card | COMPONENT | No | — |

For each component, list:
- Component name (from metadata)
- Whether it has a Code Connect mapping
- Source file path (if connected)

Do NOT include layout data, positions, or raw XML.
Total output must be under 600 tokens.
```

---

## Pattern 4: Specific Node Deep Dive

**Use when:** Need detailed info about one specific frame/component before implementing

**MCP tool:** `get_design_context(fileKey, nodeId)` — returns full layout, styling, component data

**Task prompt template:**

```
You have access to the Figma MCP server.

Call get_design_context with:
- fileKey: {fileKey}
- nodeId: {nodeId}

From the response, extract and return:
1. Node name, type, dimensions
2. Layer hierarchy (max 3 levels deep, name + type only)
3. Key styles: colors used, fonts, spacing values
4. Component references (if any components are used)
5. Any text content

Format as structured markdown.
Total output must be under 500 tokens.
```

---

## Usage Notes

- Always specify `subagent_type="general-purpose"` for Task sub-agents
- Sub-agents have access to MCP tools configured in the session
- If the sub-agent returns too much data, refine the prompt to be more specific
- For very large files, chain Pattern 1 (get overview) then Pattern 4 (deep dive specific nodes)
- If `get_variable_defs` returns empty, the file may not use Figma variables — suggest extracting tokens manually from `get_design_context` instead
