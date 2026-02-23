# Figma Concepts Reference

This file provides detailed knowledge for the figma-mastery skill. Each section covers a core Figma concept with explanations, patterns, and developer-relevant tips.

---

## 1. Components & Variants

### What are Components?

Components are reusable design elements in Figma. They work like classes in OOP:
- **Master Component** (diamond icon) — the source of truth, the "class definition"
- **Instance** (diamond outline) — a linked copy, the "object"

### Overrides

When you modify an instance, those changes are "overrides." Overrides persist even when the master is updated, unless the same property was changed in both.

Override types: text content, fill colors, stroke, effects, visibility, swap nested instances.

### Variants

Variants are components with multiple states organized as a single component set.

```
Button
├── Size: Small | Medium | Large
├── State: Default | Hover | Active | Disabled
└── Type: Primary | Secondary | Ghost
```

In code, each variant property maps to a component prop:
```tsx
<Button size="medium" state="hover" type="primary" />
```

### Boolean Properties

Components can have boolean variant properties (true/false toggles):
- Show/hide icon
- Show/hide badge
- Expanded/collapsed state

Maps to: `<Button showIcon={true} />`

---

## 2. Auto Layout

### Core Concept

Auto Layout = CSS Flexbox. Frames with Auto Layout automatically arrange their children.

### Property Mapping (Figma → CSS)

| Figma Property | CSS Equivalent |
|---------------|---------------|
| Direction: Horizontal | flex-direction: row |
| Direction: Vertical | flex-direction: column |
| Direction: Wrap | flex-wrap: wrap |
| Gap between items | gap: Npx |
| Padding | padding: Npx |
| Primary axis alignment | justify-content |
| Counter axis alignment | align-items |
| Hug contents | width/height: fit-content |
| Fill container | flex: 1 |
| Fixed | width/height: Npx |

### Nested Auto Layout

Complex layouts are built by nesting Auto Layout frames:
```
Page (Vertical, padding 24px, gap 16px)
├── Header (Horizontal, gap 8px)
│   ├── Logo (Fixed 32x32)
│   └── Nav (Horizontal, gap 12px, Fill)
├── Content (Vertical, gap 24px, Fill)
│   ├── Hero (Fixed height 400px, Fill width)
│   └── Cards (Horizontal, Wrap, gap 16px)
└── Footer (Horizontal, gap 8px)
```

### Absolute Position

Items inside Auto Layout can be set to "Absolute position" — they are removed from the flow (like CSS `position: absolute`). Used for badges, overlays, close buttons.

### Min/Max Width & Height

Auto Layout children support min-width, max-width, min-height, max-height constraints. This enables responsive behavior where elements can grow/shrink within bounds — maps directly to CSS `min-width`/`max-width` properties.

---

## 2.5. Constraints (Non-Auto-Layout Frames)

### What are Constraints?

Constraints define how child layers respond when their parent frame is resized. Used in frames WITHOUT Auto Layout.

### Constraint Types (Figma → CSS)

| Figma Constraint | CSS Equivalent |
|-----------------|----------------|
| Left | position: absolute; left: Npx |
| Right | position: absolute; right: Npx |
| Left and Right | position: absolute; left: Npx; right: Npx (stretches) |
| Center | position: absolute; left: 50%; transform: translateX(-50%) |
| Scale | width: N% (percentage-based sizing) |
| Top | position: absolute; top: Npx |
| Bottom | position: absolute; bottom: Npx |
| Top and Bottom | position: absolute; top: Npx; bottom: Npx (stretches) |

### When to Use

- Constraints: for absolute-positioned layouts, overlays, backgrounds
- Auto Layout: for flow-based layouts (most UI components)

In practice, most modern Figma files use Auto Layout for content and Constraints only for decorative/overlay elements.

---

## 3. Design Tokens

### What are Design Tokens?

Named values that represent design decisions: colors, spacing, typography, shadows. They create a shared language between design and code.

### Figma Variables

Figma stores tokens as **Variables** organized into:
- **Collections** — groups of related variables (e.g., "Colors", "Spacing")
- **Modes** — variants of the same variable (e.g., Light mode, Dark mode)

### Variable Types

| Type | Example | CSS Equivalent |
|------|---------|---------------|
| Color | Primary/500 = #3B82F6 | --color-primary-500: #3B82F6 |
| Number | Spacing/md = 16 | --spacing-md: 16px |
| String | Font/body = "Inter" | --font-body: "Inter" |
| Boolean | Feature/darkMode = true | data-theme="dark" |

### Naming Conventions

Common patterns:
- `color/primary/500` — semantic + scale
- `spacing/sm`, `spacing/md`, `spacing/lg` — t-shirt sizing
- `font/heading/h1` — category + variant
- `shadow/card`, `shadow/modal` — component-specific

---

## 4. Prototyping

### Connections

Prototyping connections link frames to simulate user flows:
- **Trigger:** What starts the interaction (click, hover, drag, delay, key press, mouse enter/leave)
- **Action:** What happens (navigate, open overlay, swap, scroll to, back, close overlay, set variable)
- **Transition:** How it animates (instant, dissolve, move in, push, slide, smart animate)
- **Destination:** Target frame or component variant

### Flow Starting Points

Each prototype can have named starting points — entry frames for different user flows (e.g., "Login Flow", "Onboarding Flow", "Checkout Flow"). These help organize prototypes with multiple paths.

### Smart Animate

Smart Animate matches layers by name between frames and animates the differences. Rules:
- Layers must have **identical names** across frames to be matched
- Works with position, size, rotation, opacity, fills
- Nested components animate if the instance swap changes variants

Powerful for: toggle animations, card expansion, tab switching, micro-interactions, skeleton loading states.

### Component Interactions

Components can have **interactions defined at the variant level**:
- Hover state: change variant on mouse enter, revert on mouse leave
- Press state: change variant while pressing, revert on release
- Focus state: change variant on focus (for form inputs)

This means a single Button component can have built-in hover/active behavior without separate frames.

### Scroll Behavior

Frames support scroll behavior settings:
- **Overflow scrolling:** horizontal, vertical, or both
- **Fixed elements:** layers marked "Fix position when scrolling" stay in place (like CSS `position: fixed`)
- **Scroll to:** prototype action that scrolls to a specific layer within a scrollable frame

### Overflow Behavior

Frames can have overflow set to: Visible, Hidden, Scroll (horizontal/vertical). This maps directly to CSS `overflow` property.

### Device Frames

Prototypes can be presented in device frames (iPhone, Android, desktop, tablet) with specific viewport dimensions. This helps verify responsive layouts at target screen sizes.

---

## 5. Dev Mode

### What is Dev Mode?

A dedicated view for developers in Figma. Toggle with `Shift+D`.

### Key Features

- **Inspect panel** — shows CSS, iOS (SwiftUI), or Android (XML) code for selected elements
- **Annotations** — designer notes attached to frames
- **Section status** — mark sections as "Ready for development"
- **Measurements** — hover to see distances between elements
- **Asset export** — export images, icons as PNG/SVG/PDF
- **Code Connect** — see actual code implementation linked to components

### Annotations

Designers can add annotations with:
- Development notes
- Interaction specifications
- Content requirements
- Accessibility notes

These appear in Dev Mode and should be followed when implementing.

---

## 6. Plugin API

### Plugin Types

| Type | Editor | Purpose |
|------|--------|---------|
| Design plugin | Figma | Modify design files |
| FigJam plugin | FigJam | Extend whiteboard |
| Widget | Both | Interactive objects on canvas |
| Dev Mode plugin | Figma | Extend Dev Mode panel |

### Architecture: Two Contexts

```
┌─────────────────────┐     postMessage      ┌──────────────────────┐
│     SANDBOX          │ ◄──────────────────► │     UI (iframe)      │
│                      │                      │                      │
│ • figma.* API        │                      │ • DOM access         │
│ • Document model     │                      │ • fetch() / XHR      │
│ • No DOM             │                      │ • Canvas / WebGL     │
│ • No fetch           │                      │ • No figma.* API     │
│                      │                      │                      │
│ src/main.ts          │                      │ src/ui.ts + ui.html  │
└─────────────────────┘                      └──────────────────────┘
```

### Key API Objects

- `figma.currentPage` — active page
- `figma.root` — document root
- `figma.createRectangle()`, `figma.createText()`, etc. — create nodes
- `figma.ui.postMessage()` — send data to UI
- `figma.ui.onmessage` — receive data from UI
- `figma.clientStorage` — persistent local storage
- `figma.notify()` — show toast notifications

### Node Types

SceneNode types: FRAME, GROUP, COMPONENT, INSTANCE, RECTANGLE, ELLIPSE, LINE, TEXT, VECTOR, STAR, POLYGON, BOOLEAN_OPERATION, SLICE, SECTION.

---

## 7. Design Systems

### Library Structure

A Figma design system library typically contains:
- **Components** — buttons, inputs, cards, modals, etc.
- **Styles** — color, text, effect, grid styles
- **Variables** — design tokens (colors, spacing, typography)
- **Documentation** — usage guidelines per component

### Variant Naming Best Practices

Consistent naming is critical for design-code alignment:
- **Property names** match code prop names: `Size`, `State`, `Type` (not "Variant 1")
- **Value names** match code enum values: `small`, `medium`, `large` (not "S", "M", "L")
- **Boolean properties** use descriptive names: `Show Icon` (not "Toggle 1")
- **Nesting delimiter:** use `/` for nested component names: `Button/Primary`, `Button/Secondary`

### Component Documentation

Figma supports component-level documentation:
- **Description** — what the component does, when to use it
- **Links** — URLs to code docs, Storybook, design guidelines
- **Property descriptions** — explain each variant property's purpose
- **Playground** — example configurations showing common use cases

This documentation shows in the Assets panel and Dev Mode inspect panel.

### Publishing

Libraries are published from Team/Organization files. Changes go through a review/publish cycle:
1. Designer updates master component
2. Publishes update with description
3. Consuming files see "Update available" notification
4. Designers accept or dismiss updates per component

### Branching

Figma supports file branching for design system work:
- Create branch from main file
- Make changes in branch
- Request review
- Merge back to main

### Library Analytics

Teams can track component usage across files:
- Which components are most/least used
- Which files use which components
- Detached instances (components that were unlinked from the library)

---

## 8. Handoff

### Best Practices

1. **Use Dev Mode** — mark sections as "Ready for development"
2. **Add annotations** — explain interactions, edge cases, content rules
3. **Use Auto Layout** — makes spacing/sizing inspectable
4. **Use design tokens** — named variables instead of raw hex values
5. **Set up Code Connect** — link Figma components to code files
6. **Export assets** — provide icons/images in required formats
7. **Document states** — show all component states (default, hover, active, disabled, error, loading)

### Developer Workflow

```
1. Open Figma Dev Mode (Shift+D)
2. Select a frame
3. Read annotations and specs
4. Inspect CSS/properties in the right panel
5. Export any assets needed
6. Use /figma-implement to generate code
7. Use /figma-connect to link back to Figma
```
