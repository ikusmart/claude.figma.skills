---
name: figma-mastery
description: "Knowledge-base skill about Figma UI/UX workflows — components, variants, auto-layout, prototyping, design systems, Dev Mode, plugins, and the Figma API. Teaches Figma concepts with examples and best practices. Use when: user asks about Figma concepts, says explain Figma, what is auto layout, how do variants work, teach me Figma, Figma architecture, or needs to understand Figma terminology."
---

# Figma Mastery — Knowledge Base

## Self-Documentation

When invoked WITHOUT a specific topic:

1. Display the Quick Help block below with all available topics
2. Ask the user what topic they want to learn about

When invoked WITH a specific topic — skip help and go directly to that topic.

## Quick Help

**What I do:** Teach you Figma concepts, patterns, and terminology. No MCP tools needed — this is pure knowledge.

**Available topics:**

| # | Topic | What you'll learn |
|---|-------|------------------|
| 1 | Components & Variants | Master components, instances, overrides, variant properties |
| 2 | Auto Layout | Direction, spacing, padding, constraints, nested frames |
| 3 | Design Tokens | Colors, typography, spacing, effects, naming conventions |
| 4 | Prototyping | Interactions, transitions, smart animate |
| 5 | Dev Mode | Inspect panel, annotations, CSS/iOS/Android snippets |
| 6 | Plugin API | Plugin types, API surface, sandbox model, message passing |
| 7 | Design Systems | Library structure, publishing, branching, versioning |
| 8 | Handoff | Developer handoff workflow, specifications, export |

**Example prompts:**
- `Explain auto layout in Figma`
- `How do Figma variants work?`
- `Teach me about the Figma Plugin API`
- `What's the difference between components and instances?`

**No prerequisites** — this skill works without any MCP servers.

---

## Teaching Approach

When explaining a topic:

1. **Start with the concept** — what it is and why it matters
2. **Show the structure** — how it's organized in Figma (use ASCII diagrams if helpful)
3. **Common patterns** — how experienced designers use it
4. **Gotchas** — common mistakes and how to avoid them
5. **Figma-specific terminology** — terms that may differ from other tools
6. **Practical tips** — actionable advice for developers working with designers
7. **Link to related topics** — suggest what to learn next

Read `references/figma-concepts.md` for detailed content on each topic.

## Topic: Components & Variants

**Concept:** Components are reusable design elements. A Master Component defines the blueprint; Instances are copies that inherit from the master but can be overridden.

**Key terms:**
- **Master Component** — the source of truth (diamond icon)
- **Instance** — a linked copy (diamond outline icon)
- **Overrides** — changes made to an instance that differ from the master
- **Variant** — a component with multiple states (e.g., size: small/medium/large, state: default/hover/active)
- **Variant Properties** — the dimensions that define variants (e.g., Size, State, Type)

**For developers:** Each variant maps to a prop. `Button/Size=Large, State=Hover` → `<Button size="large" state="hover" />`

## Topic: Auto Layout

**Concept:** Auto Layout makes frames behave like CSS flexbox. Children are arranged automatically based on direction, spacing, and padding rules.

**Key properties:**
- **Direction:** Horizontal (row), Vertical (column), Wrap
- **Spacing:** Gap between children (like CSS `gap`)
- **Padding:** Internal padding (like CSS `padding`)
- **Alignment:** Primary axis + cross axis alignment (like `justify-content` + `align-items`)
- **Resizing:** Hug contents, Fill container, Fixed

**For developers:** Auto Layout → flexbox. The mapping is nearly 1:1.

## Topic: Design Tokens

**Concept:** Design tokens are named values for colors, typography, spacing, and effects. They create a shared language between design and code.

**In Figma:** Tokens are stored as Variables (Figma's term). They can be organized into collections and modes (e.g., Light/Dark theme).

**Token types:** Color, Number, String, Boolean

## Topic: Prototyping

**Concept:** Prototyping adds interactivity to static designs. Connections between frames simulate user flows.

**Key elements:** Triggers (click, hover, drag), Actions (navigate, overlay, scroll), Transitions (dissolve, move, smart animate)

## Topic: Dev Mode

**Concept:** Dev Mode is Figma's developer-focused view. Shows CSS/iOS/Android code snippets, measurements, assets, and annotations.

**Key features:** Inspect panel, CSS generation, asset export, annotations, section status (Ready for dev)

## Topic: Plugin API

**Concept:** Figma plugins extend Figma's functionality. They run in a sandboxed environment with access to the Figma document model.

**Plugin types:**
- **Design plugins** — modify design files
- **FigJam plugins** — extend the whiteboard
- **Widget plugins** — interactive objects on canvas
- **Dev Mode plugins** — extend Dev Mode panel

**Architecture:** Two contexts — Sandbox (Figma API, no DOM) and UI iframe (DOM, no Figma API). They communicate via `postMessage`.

See `/figma-help` for the full architecture diagram.

## Topic: Design Systems

**Concept:** A design system is a collection of reusable components, tokens, and guidelines that ensure consistency across products.

**In Figma:** Organized as a Library — a Figma file containing components, styles, and variables that can be published and consumed by other files.

## Topic: Handoff

**Concept:** Handoff is the process of transferring design specifications to developers. Figma's Dev Mode facilitates this.

**Best practices:** Use Dev Mode, annotate designs, mark sections as "Ready for dev", export assets, use Code Connect for component mapping.
