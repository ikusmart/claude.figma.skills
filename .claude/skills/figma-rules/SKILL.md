---
name: figma-rules
description: "Generate project-specific design system rules that guide AI agents to produce consistent code when implementing Figma designs. Encodes your project's conventions, tokens, and component patterns. Use when: user says create design rules, generate rules, design system rules, set up design rules, customize design guidelines, or wants consistent Figma-to-code output."
---

# Create Design System Rules

## Self-Documentation

When invoked WITHOUT clear input:

1. Display the Quick Help block below
2. Ask the user if they want to generate rules for the current project

When invoked WITH clear intent — skip help and proceed to Step 1.

## Quick Help

**What I do:** Generate a project-specific rules document that teaches AI agents how to correctly translate Figma designs into code for YOUR project. Encodes "unwritten knowledge" — component organization, token mapping, styling conventions.

**Example prompts:**
- `Create design system rules for this project`
- `Generate Figma implementation rules`
- `Set up design rules so /figma-implement uses our conventions`

**Prerequisites:**
- Figma MCP server configured. Run `/figma-setup` if not configured.
- An existing project with components, styling, and conventions to encode.

**What you get:**
- A rules document saved to `.claude/rules/figma-design-system.md`
- Rules cover: component organization, implementation flow, token mapping, reuse patterns
- All future `/figma-implement` calls will follow these rules automatically

---

## Step 1: Analyze Project

Scan the current project to understand its structure:

- **Framework:** React, Vue, Svelte, Angular, etc.
- **Component directories:** where UI components live (e.g., `src/components/ui/`)
- **Styling:** Tailwind, CSS Modules, styled-components, SCSS, design tokens
- **Token system:** color variables, spacing, typography definitions
- **Naming conventions:** PascalCase components, kebab-case files, etc.
- **Existing patterns:** how components are structured, exported, tested

## Step 2: Call MCP

Call `create_design_system_rules` with the detected frameworks and languages:

```
create_design_system_rules(
  clientFrameworks: "react,tailwind",   // detected frameworks
  clientLanguages: "typescript,css"      // detected languages
)
```

This returns a base set of rules from Figma.

## Step 3: Customize Rules

Merge MCP output with project-specific conventions discovered in Step 1:

- Map Figma color tokens → project CSS variables or Tailwind config
- Map Figma spacing → project spacing scale
- Map Figma typography → project font definitions
- Define component reuse rules (which project components map to Figma components)
- Define file placement rules (where new components should be created)

## Step 4: Save Rules

Write the generated rules to `.claude/rules/figma-design-system.md`.

Example structure (the agent will generate project-specific content):

```markdown
# Figma Design System Rules

## Component Organization
- Where UI components live, naming patterns

## Token Mapping
| Figma Token | Project Token |
|-------------|---------------|
| Primary/500 | --color-primary |

## Styling Rules
- Framework-specific conventions
```

**Important:** Rules saved to `.claude/rules/` are auto-loaded for ALL sessions in this project. The `/figma-implement` skill will use these rules as primary context, skipping redundant project analysis.

## Step 5: Report

Tell the user:
- Where the rules file was saved
- What conventions were encoded
- How it affects future `/figma-implement` calls (rules are auto-loaded by Claude Code)
- Suggest running `/figma-implement` to test the rules on a real design
