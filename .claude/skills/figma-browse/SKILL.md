---
name: figma-browse
description: "Modify Figma designs via the Figma REST API. Supports adding comments, reading file data, and limited write operations. Use when: user wants to modify a Figma file, add comments, read design data via API, or needs programmatic access to Figma beyond MCP tools."
---

# Figma REST API — Read & Write Access

## Security Warning

This skill uses the Figma REST API with a Personal Access Token. The token grants access to all files in your Figma account. Review all operations before approving them.

---

## Self-Documentation

When invoked WITHOUT a clear task:

1. Display the Quick Help block below
2. Ask what the user wants to do in Figma

When invoked WITH a Figma URL and clear intent — skip help and proceed to Step 1.

## Quick Help

**What I do:** Provide programmatic read/write access to Figma files via the REST API. Unlike the MCP tools that focus on design-to-code workflows, this skill gives you direct API access for modifications, comments, and data export.

**What you CAN do:**

- Read file/node data, styles, components
- Add, edit, delete comments on designs
- Export nodes as PNG/SVG/JPG/PDF
- Read/create/update design variables
- Read component properties and styles

**What you CANNOT do (REST API limitations):**

- Create or modify shapes, frames, text layers (requires Plugin API)
- Change fills, strokes, effects on existing nodes
- Rearrange layer order or rename nodes
- Full design manipulation (use `claude-talk-to-figma-mcp` for that — see spec.md section 2.4)

**Example prompts:**

- `Add a comment "Approved" to this frame: [URL]`
- `Export this frame as PNG at 2x: [URL]`
- `List all comments on this design: [URL]`
- `Read the variables from this file: [URL]`

**Prerequisites:**

- Figma Personal Access Token (generate at figma.com/developers/api#access-tokens)
- Token must be available as environment variable or passed directly

---

## Step 1: Validate Prerequisites

Check that a Figma Personal Access Token is available:

- Environment variable `FIGMA_API_KEY` or `FIGMA_TOKEN`
- Or ask the user to provide one

If not available, show how to generate one:
1. Go to figma.com → Settings → Account → Personal access tokens
2. Create a new token with appropriate scopes
3. Set as environment variable: `export FIGMA_TOKEN=your-token-here`

## Step 2: Parse Figma URL

Extract `fileKey` and `nodeId` from the URL:

- `figma.com/design/:fileKey/:fileName?node-id=:nodeId` — convert `-` to `:` in nodeId
- `figma.com/design/:fileKey/branch/:branchKey/:fileName` — use branchKey as fileKey

## Step 3: Execute API Operations

Use `curl` via Bash to call Figma REST API endpoints.

**Base URL:** `https://api.figma.com`

**Auth header:** `-H "X-Figma-Token: $FIGMA_TOKEN"`

### Read Operations

```bash
# Get file data
curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/{fileKey}"

# Get specific nodes
curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/{fileKey}/nodes?ids={nodeId}"

# Get comments
curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/{fileKey}/comments"

# Export node as image
curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/images/{fileKey}?ids={nodeId}&format=png&scale=2"
```

### Write Operations

```bash
# Add a comment
curl -s -X POST -H "X-Figma-Token: $FIGMA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Comment text", "client_meta": {"node_id": "{nodeId}"}}' \
  "https://api.figma.com/v1/files/{fileKey}/comments"

# Delete a comment
curl -s -X DELETE -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/{fileKey}/comments/{commentId}"
```

**IMPORTANT:** Always confirm with the user before executing write operations.

## Step 4: Report Results

Show what was done:

- For reads: present data in a clean, formatted way
- For writes: confirm the operation succeeded
- For exports: provide the download URL or save the file locally

## Limitations

For full design manipulation (creating shapes, modifying properties, rearranging layers), you need one of these alternatives:

- **claude-talk-to-figma-mcp** — WebSocket + Figma Plugin, full read/write (see spec.md section 2.4)
- **Figma Plugin API** — requires running a plugin inside Figma Desktop

The REST API is best suited for: reading data, managing comments, exporting images, and working with variables.
