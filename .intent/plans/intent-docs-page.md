---
id: plan-intent-docs-page
title: Add Intent documentation page
type: plan
status: active
created: '2026-05-07T23:10:43.983Z'
updated: '2026-05-08T00:00:00.000Z'
system: site
decisions:
  - DEC-0001
  - DEC-0002
  - DEC-0003
constraints:
  - CON-0001
  - CON-0002
tags:
  - open-source
  - documentation
---

## Goal

Add a full documentation page for the Intent npm package to the dev.sixbyfive site, covering what it does, how it's designed, all CLI commands, MCP tools, document formats, integrations, and design rationale. Surface Intent as a first-class open source project in the work index and homepage preview.

## Reason

Intent is a SixByFive-authored npm package. The site has no page for it. People discovering the package via GitHub or npm should be able to find detailed documentation and context on the studio's own site rather than relying solely on the README. It also demonstrates the kind of tooling work the studio does.

## Rules

- Source of truth for all commands, flags, and formats is the local monorepo at H:/Intent — not npm metadata, not inferred from tool descriptions
- Page must match the site's visual language exactly: same CSS variables, same layout classes, no new global styles
- All code blocks must render correctly without any syntax highlighting library
- Intent must appear in both the work index (/work) and the homepage work preview
- The page should document the package for a developer audience: complete CLI reference, all MCP tools, real format examples with frontmatter, and integration configs for each supported tool
