// app/work/intent/page.js
// Documentation page for the Intent npm package (@dev-sixbyfive/intent)

import Link from "next/link";

export const metadata = {
  title: "Intent — SixByFive Studio",
  description: "Intent is a git-native reasoning layer for software projects. Plans, architectural decisions, and constraints committed alongside code — surfaced to humans and AI agents.",
};

const mono = { fontFamily: "var(--font-mono)" };

function Section({ label, children }) {
  return (
    <div style={{ padding: "56px 0", borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0 64px" }} className="cs-grid">
        <div style={{ paddingTop: 3 }}>
          <span className="eyebrow">{label}</span>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function Body({ children, mb = 16 }) {
  return (
    <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.75, maxWidth: 600, marginBottom: mb }}>
      {children}
    </p>
  );
}

function SectionHeading({ children, mt = 28 }) {
  return (
    <p style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 8, marginTop: mt }}>
      {children}
    </p>
  );
}

function MonoLabel({ children }) {
  return (
    <span style={{ ...mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-4)", display: "block", marginBottom: 14 }}>
      {children}
    </span>
  );
}

function CodeBlock({ children, lang }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {lang && (
        <div style={{
          background: "var(--bg-subtle)",
          borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
          padding: "5px 14px",
          borderBottom: "1px solid var(--border)",
          display: "inline-block",
        }}>
          <span style={{ ...mono, fontSize: 10, color: "var(--text-4)", letterSpacing: "0.08em" }}>{lang}</span>
        </div>
      )}
      <pre style={{
        background: "var(--bg-raised)",
        border: "1px solid var(--border)",
        borderRadius: lang ? "0 var(--radius-sm) var(--radius-sm) var(--radius-sm)" : "var(--radius-sm)",
        padding: "16px 18px",
        overflowX: "auto",
        margin: 0,
        ...mono,
        fontSize: 12.5,
        lineHeight: 1.7,
        color: "var(--text-2)",
      }}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

function IC({ children }) {
  return (
    <code style={{ ...mono, fontSize: 12.5, background: "var(--bg-raised)", border: "1px solid var(--border)", borderRadius: 4, padding: "1px 6px", color: "var(--accent-text)" }}>
      {children}
    </code>
  );
}

function DashList({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={{ color: "var(--accent)", fontSize: 15, lineHeight: "24px", flexShrink: 0 }}>—</span>
          <span style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

function CrossList({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={{ color: "var(--text-3)", fontSize: 15, lineHeight: "24px", flexShrink: 0 }}>×</span>
          <span style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

function CommandRow({ cmd, desc, sub }) {
  return (
    <div style={{ padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "baseline" }} className="cmd-grid">
        <code style={{ ...mono, fontSize: 12.5, color: "var(--accent-text)" }}>{cmd}</code>
        <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>{desc}</span>
      </div>
      {sub && sub.map((s, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "baseline", marginTop: 8, paddingLeft: 16 }} className="cmd-grid">
          <code style={{ ...mono, fontSize: 11.5, color: "var(--text-4)" }}>{s.cmd}</code>
          <span style={{ fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.6 }}>{s.desc}</span>
        </div>
      ))}
    </div>
  );
}

function ToolRow({ name, sig, desc }) {
  return (
    <div style={{ padding: "13px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ marginBottom: 4 }}>
        <code style={{ ...mono, fontSize: 12.5, color: "var(--accent-text)" }}>{name}</code>
        {sig && <code style={{ ...mono, fontSize: 11.5, color: "var(--text-4)", marginLeft: 8 }}>{sig}</code>}
      </div>
      <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </div>
  );
}

function PackageCard({ name, pkg, desc, items }) {
  return (
    <div style={{ padding: "20px 22px", background: "var(--bg-raised)", border: "1px solid var(--border)", borderRadius: "var(--radius)", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{name}</span>
        <code style={{ ...mono, fontSize: 11, color: "var(--text-3)", background: "var(--bg-subtle)", padding: "2px 8px", borderRadius: 4 }}>{pkg}</code>
      </div>
      <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.65, marginBottom: items ? 14 : 0 }}>{desc}</p>
      {items && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {items.map((item) => (
            <span key={item} style={{ ...mono, fontSize: 10.5, color: "var(--text-4)", background: "var(--bg-subtle)", padding: "3px 8px", borderRadius: 4 }}>
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function IntentPage() {
  return (
    <>
      <style>{`
        @media (max-width: 720px) {
          .cs-grid { grid-template-columns: 1fr !important; gap: 20px 0 !important; }
          .cmd-grid { grid-template-columns: 1fr !important; gap: 4px 0 !important; }
        }
      `}</style>

      {/* Header */}
      <section style={{ padding: "72px 0 64px" }}>
        <div className="wrap">
          <Link
            href="/work"
            style={{ ...mono, fontSize: 12, color: "var(--text-4)", textDecoration: "none", letterSpacing: "0.08em", display: "inline-block", marginBottom: 40 }}
          >
            ← Work
          </Link>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            <span className="pill pill-live">Active</span>
            <span className="pill">npm package</span>
            <span className="pill pill-accent">Open source</span>
            <span style={{ ...mono, fontSize: 11, color: "var(--text-4)", alignSelf: "center", marginLeft: 4 }}>2026</span>
          </div>

          <h1 className="display" style={{ fontSize: "clamp(38px, 5.5vw, 64px)", color: "var(--text)", maxWidth: 760, marginBottom: 20, lineHeight: 1.04 }}>
            Intent
          </h1>
          <p style={{ fontSize: 17, color: "var(--accent-text)", fontStyle: "italic", fontFamily: "var(--font-display)", maxWidth: 580, lineHeight: 1.5, marginBottom: 32 }}>
            A git-native reasoning layer that documents the architectural why behind code — and surfaces it to humans and AI agents.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="https://github.com/SixByFive/intent" target="_blank" rel="noreferrer" className="btn btn-primary">
              GitHub ↗
            </a>
            <a href="https://www.npmjs.com/package/@dev-sixbyfive/intent" target="_blank" rel="noreferrer" className="btn btn-secondary">
              npm ↗
            </a>
          </div>
        </div>
      </section>

      <div className="wrap">

        {/* The problem */}
        <Section label="The problem">
          <Body>
            Modern codebases have a knowledge problem. Commit messages record what changed. PRs explain why at that moment. But over time, the reasoning behind architectural choices, constraints, and active plans disappears into history.
          </Body>
          <Body>
            AI agents have the same problem — they can read your code but they can&apos;t read your mind. They don&apos;t know that the auth middleware is being rewritten for compliance reasons, that the listing limit exists because of a vendor contract, or that you&apos;re mid-way through a multi-sprint migration.
          </Body>
          <Body mb={28}>
            Intent solves this by making reasoning a first-class commit artifact — committed alongside the code it documents:
          </Body>
          <CodeBlock lang="shell">
{`git add src/auth/middleware.ts .intent/plans/auth-rewrite.md
git commit -m "Refactor auth middleware for session token compliance"`}
          </CodeBlock>
        </Section>

        {/* What it is */}
        <Section label="What it is">
          <Body>
            Intent lives inside your repository as a <IC>.intent/</IC> directory and tracks the <em>why</em> behind code: plans, architectural decisions, constraints, and system context. It&apos;s designed to be read by both humans and AI agents.
          </Body>
          <Body mb={28}>
            Git already tracks <em>what</em> changed. Intent tracks <em>why</em> it changed.
          </Body>

          <MonoLabel>Directory structure</MonoLabel>
          <CodeBlock lang="shell">
{`.intent/
  intent.json          ← project config
  plans/               ← active and historical plans
  decisions/           ← architectural decision records (ADRs)
  systems/             ← system / domain definitions
  constraints/         ← hard and soft constraints
  links/               ← auto-generated index (never edit manually)
    index.json`}
          </CodeBlock>

          <Body>
            The <IC>links/</IC> directory is auto-generated and git-ignored. Everything else is plain markdown — readable without any tooling, versioned alongside code, present in every clone.
          </Body>
        </Section>

        {/* Packages */}
        <Section label="Packages">
          <Body mb={28}>
            Intent is a TypeScript monorepo published as five npm packages. Install the meta-package to get everything, or install pieces individually.
          </Body>

          <PackageCard
            name="intent"
            pkg="@dev-sixbyfive/intent"
            desc="Meta-package. Installs both the CLI and the MCP server in one command. The recommended install for most projects."
            items={["intent CLI", "intent-mcp server"]}
          />
          <PackageCard
            name="intent-schemas"
            pkg="@dev-sixbyfive/intent-schemas"
            desc="Zod schemas and TypeScript types for all document formats. The shared type contract used by core, CLI, and MCP. Use this if you're building tooling on top of the .intent/ format."
            items={["PlanFrontmatter", "DecisionFrontmatter", "SystemFrontmatter", "ConstraintFrontmatter"]}
          />
          <PackageCard
            name="intent-core"
            pkg="@dev-sixbyfive/intent-core"
            desc="All .intent/ file I/O, parsing, validation, git integration, and context management. Returns Result<T, IntentError> throughout — no silent failures. Not typically installed directly."
            items={["plans.ts", "decisions.ts", "systems.ts", "constraints.ts", "links.ts", "validate.ts", "git.ts", "agent.ts", "export.ts"]}
          />
          <PackageCard
            name="intent-cli"
            pkg="@dev-sixbyfive/intent-cli"
            desc="Commander.js CLI. A thin command layer — all business logic lives in core. Install directly if you only need the CLI and not the MCP server."
            items={["intent init", "intent plan", "intent decision", "intent review-diff", "intent export", "intent agent"]}
          />
          <PackageCard
            name="intent-mcp"
            pkg="@dev-sixbyfive/intent-mcp"
            desc="MCP server exposing 11 Intent tools via stdio. Configure once in your AI agent and it has access to your repository's full reasoning context. Install directly if you only need the server."
            items={["intent_context", "intent_review_diff", "intent_agent_prepare", "intent_agent_review", "11 tools total"]}
          />

          <div style={{ marginTop: 8 }}>
            <p style={{ ...mono, fontSize: 11, color: "var(--text-4)", lineHeight: 1.7 }}>
              Dependency rule: <span style={{ color: "var(--accent-text)" }}>schemas → core → cli / mcp</span>. Core never imports CLI. Schemas never import core. All business logic belongs in core, not in command handlers.
            </p>
          </div>
        </Section>

        {/* Quick start */}
        <Section label="Quick start">
          <SectionHeading mt={0}>Install</SectionHeading>
          <CodeBlock lang="shell">
{`# Recommended: installs CLI + MCP server in one go
npm install -g @dev-sixbyfive/intent

# Or with pnpm
pnpm add -g @dev-sixbyfive/intent

# CLI only
npm install -g @dev-sixbyfive/intent-cli

# MCP server only
npm install -g @dev-sixbyfive/intent-mcp`}
          </CodeBlock>

          <p style={{ ...mono, fontSize: 11.5, color: "var(--text-4)", marginBottom: 28 }}>Requirements: Node 18+, must be run inside a git repository.</p>

          <SectionHeading mt={0}>Initialise a repository</SectionHeading>
          <CodeBlock lang="shell">
{`cd your-project
intent init
# Creates .intent/ with intent.json and all subdirectories
# Adds .intent/links/ to .gitignore`}
          </CodeBlock>

          <SectionHeading>Create a plan</SectionHeading>
          <CodeBlock lang="shell">
{`intent plan create auth-rewrite --title "Auth middleware rewrite" --system auth`}
          </CodeBlock>

          <SectionHeading>Record an architectural decision</SectionHeading>
          <CodeBlock lang="shell">
{`intent decision add --title "Use short-lived JWTs over session tokens" --system auth
# Auto-increments the ID: DEC-0001, DEC-0002, …`}
          </CodeBlock>

          <SectionHeading>Review what intent context applies to your current diff</SectionHeading>
          <CodeBlock lang="shell">
{`git add src/auth/
intent review-diff
# Cross-references changed files against the links index
# Surfaces only plans and decisions relevant to this commit`}
          </CodeBlock>

          <SectionHeading>Configure the MCP server (Claude Code)</SectionHeading>
          <Body>Add to <IC>.claude/settings.json</IC> in your project, or <IC>~/.claude/settings.json</IC> globally:</Body>
          <CodeBlock lang="json">
{`{
  "mcpServers": {
    "intent": {
      "command": "npx",
      "args": ["@dev-sixbyfive/intent-mcp"]
    }
  }
}`}
          </CodeBlock>
        </Section>

        {/* Document formats */}
        <Section label="Documents">
          <Body mb={28}>
            Every <IC>.intent/</IC> file uses hybrid frontmatter markdown: structured YAML frontmatter for machine-readable metadata, free-form markdown body for human reasoning. No editor dependency — valid markdown in any viewer.
          </Body>

          <SectionHeading mt={0}>Plan — <code style={{ ...mono, fontWeight: 400, fontSize: 13 }}>.intent/plans/plan-*.md</code></SectionHeading>
          <Body>Captures an active or completed development initiative: what&apos;s being built, which system it belongs to, which decisions apply. Plans are the &quot;now&quot; of Intent — what&apos;s in flight.</Body>
          <CodeBlock lang="markdown">
{`---
id: plan-auth-rewrite
title: Auth middleware rewrite
type: plan
status: active          # draft | active | archived | superseded
created: 2024-01-15T09:00:00Z
updated: 2024-01-15T09:00:00Z
system: auth
decisions: [DEC-0001]
constraints: []
tags: [security, compliance]
---

## Goal

Replace the legacy session token middleware with short-lived JWTs.

## Reason

Legal flagged the current session token storage as non-compliant
with the new data residency requirements. Must be resolved before Q2 audit.

## Rules

- Tokens must expire in 15 minutes
- Refresh tokens stored in httpOnly cookies only
- No token data written to application logs`}
          </CodeBlock>

          <SectionHeading>Decision — <code style={{ ...mono, fontWeight: 400, fontSize: 13 }}>.intent/decisions/DEC-NNNN.md</code></SectionHeading>
          <Body>Architectural Decision Records. Each decision is a permanent record of a choice and its reasoning — including alternatives considered and consequences. IDs are auto-incremented.</Body>
          <CodeBlock lang="markdown">
{`---
id: DEC-0001
title: Use short-lived JWTs over session tokens
type: decision
status: active          # draft | active | archived | superseded
created: 2024-01-15T09:00:00Z
updated: 2024-01-15T09:00:00Z
system: auth
plans: [plan-auth-rewrite]
tags: [security]
---

## Context

We need to replace the current session token approach. Options were:
opaque session tokens (existing), short-lived JWTs, or a
third-party auth provider.

## Decision

Short-lived JWTs (15 min) with httpOnly refresh tokens.

## Consequences

- Stateless auth — no session store required
- Must implement token refresh flow on the client
- All services need to validate JWTs independently`}
          </CodeBlock>

          <SectionHeading>System — <code style={{ ...mono, fontWeight: 400, fontSize: 13 }}>.intent/systems/sys-*.md</code></SectionHeading>
          <Body>Domain or service definitions. Groups plans and decisions by architectural boundary. Systems have no status — they&apos;re always active as long as the domain exists.</Body>
          <CodeBlock lang="markdown">
{`---
id: sys-auth
title: Auth system
type: system
created: 2024-01-10T09:00:00Z
updated: 2024-01-15T09:00:00Z
plans: [plan-auth-rewrite]
decisions: [DEC-0001]
tags: [security]
---

Session management, token issuance, and access control.
Shared by the web platform and the mobile app.`}
          </CodeBlock>

          <SectionHeading>Constraint — <code style={{ ...mono, fontWeight: 400, fontSize: 13 }}>.intent/constraints/CON-NNNN.md</code></SectionHeading>
          <Body>Hard and soft constraints that affect architectural choices — compliance requirements, infrastructure limits, contractual obligations. Referenced from plans and decisions to make dependencies explicit.</Body>
          <CodeBlock lang="markdown">
{`---
id: CON-0001
title: No token data written to application logs
type: constraint
severity: hard          # hard | soft
created: 2024-01-10T09:00:00Z
updated: 2024-01-10T09:00:00Z
system: auth
plans: [plan-auth-rewrite]
tags: [security, compliance]
---

Tokens, refresh tokens, and session identifiers must never
appear in application log output. Compliance requirement.`}
          </CodeBlock>
        </Section>

        {/* CLI reference */}
        <Section label="CLI reference">
          <Body mb={28}>All commands accept <IC>--help</IC> for detailed usage.</Body>

          <MonoLabel>Initialisation</MonoLabel>
          <div style={{ marginBottom: 28 }}>
            <CommandRow
              cmd="intent init"
              desc="Initialise Intent in a git repository. Creates .intent/ structure and intent.json config."
              sub={[
                { cmd: "--project <name>", desc: "Explicit project name (defaults to repo name)." },
                { cmd: "--force", desc: "Reinitialise an existing .intent/ directory." },
              ]}
            />
          </div>

          <MonoLabel>Plans</MonoLabel>
          <div style={{ marginBottom: 28 }}>
            <CommandRow cmd="intent plan create <name>" desc="Create a new plan at .intent/plans/<name>.md with a structured template." sub={[
              { cmd: "--title <t>", desc: "Plan title." },
              { cmd: "--system <s>", desc: "Assign to a system." },
              { cmd: "--status <s>", desc: "Initial status (default: active)." },
            ]} />
            <CommandRow cmd="intent plan update <name>" desc="Update a plan's status or title without editing the file directly." sub={[
              { cmd: "--status <s>", desc: "New status: draft | active | archived | superseded." },
              { cmd: "--title <t>", desc: "New title." },
            ]} />
            <CommandRow cmd="intent plan list" desc="List all plans with status, system, and last-updated." />
          </div>

          <MonoLabel>Decisions</MonoLabel>
          <div style={{ marginBottom: 28 }}>
            <CommandRow cmd="intent decision add" desc="Record an architectural decision. IDs auto-increment: DEC-0001, DEC-0002, …" sub={[
              { cmd: "--title <t>", desc: "Decision title." },
              { cmd: "--system <s>", desc: "Assign to a system." },
            ]} />
            <CommandRow cmd="intent decision update <id>" desc="Update a decision's status or title." sub={[
              { cmd: "--status <s>", desc: "New status: draft | active | archived | superseded." },
              { cmd: "--title <t>", desc: "New title." },
            ]} />
            <CommandRow cmd="intent decision list" desc="List all decisions with status and supersession relationships." />
          </div>

          <MonoLabel>Systems</MonoLabel>
          <div style={{ marginBottom: 28 }}>
            <CommandRow cmd="intent system create <name>" desc="Create a system definition at .intent/systems/<name>.md." sub={[
              { cmd: "--title <t>", desc: "System title." },
            ]} />
            <CommandRow cmd="intent system list" desc="List all systems." />
          </div>

          <MonoLabel>Constraints</MonoLabel>
          <div style={{ marginBottom: 28 }}>
            <CommandRow cmd="intent constraint add" desc="Record a constraint. IDs auto-increment: CON-0001, CON-0002, …" sub={[
              { cmd: "--title <t>", desc: "Constraint title." },
              { cmd: "--severity <s>", desc: "hard or soft." },
              { cmd: "--system <s>", desc: "Assign to a system." },
            ]} />
            <CommandRow cmd="intent constraint list" desc="List all constraints." />
          </div>

          <MonoLabel>Context & querying</MonoLabel>
          <div style={{ marginBottom: 28 }}>
            <CommandRow cmd="intent context [system]" desc="Show all intent context for the project. Pass a system name to filter." />
            <CommandRow
              cmd="intent review-diff"
              desc="Show intent context relevant to the current git diff — the highest-value command. Cross-references changed files against the links index and surfaces only what applies to this commit."
              sub={[
                { cmd: "--all", desc: "Include staged + unstaged changes (default: staged only)." },
                { cmd: "--base <ref>", desc: "Diff against a branch or commit instead (CI mode)." },
              ]}
            />
          </div>

          <MonoLabel>Maintenance</MonoLabel>
          <div style={{ marginBottom: 28 }}>
            <CommandRow
              cmd="intent link"
              desc="Rebuild the .intent/links/index.json index. Run after adding or editing .intent/ files to keep review-diff results accurate."
            />
            <CommandRow
              cmd="intent validate"
              desc="Validate all .intent/ files and check referential integrity. Exits 0 if valid, 1 if there are errors. Pipe into CI."
              sub={[{ cmd: "--errors-only", desc: "Suppress warnings, show errors only." }]}
            />
            <CommandRow cmd="intent status" desc="Health overview: plan/decision/system counts, active and draft plans, links index freshness, and validation summary." />
          </div>

          <MonoLabel>Export</MonoLabel>
          <div style={{ marginBottom: 28 }}>
            <CommandRow
              cmd="intent export <target>"
              desc="Export intent context as a formatted markdown block into the config file your editor or AI tool reads automatically. Updates in place on subsequent runs using intent-context markers."
              sub={[
                { cmd: "claude", desc: "Write to CLAUDE.md." },
                { cmd: "cursor", desc: "Write to .cursor/rules." },
                { cmd: "copilot", desc: "Write to .github/copilot-instructions.md." },
                { cmd: "--system <s>", desc: "Filter export to a single system." },
              ]}
            />
          </div>

          <MonoLabel>Agent commands</MonoLabel>
          <div>
            <CommandRow
              cmd="intent agent prepare [task]"
              desc="Keyword-score all plans, decisions, and systems against a task description and return the most relevant context. Falls back to full context when no task is given."
              sub={[
                { cmd: "--hook", desc: "Emit JSON on stdout — for Claude Code hooks that inject context into the system prompt." },
              ]}
            />
            <CommandRow
              cmd="intent agent review"
              desc="Review the current diff against documented intent and validate all files. In interactive mode, prompts you to write a draft decision if unlinked changes are detected."
              sub={[
                { cmd: "--base <ref>", desc: "Review against a branch (CI mode)." },
                { cmd: "--unstaged", desc: "Include unstaged changes." },
                { cmd: "--hook", desc: "JSON output + exit code for CI / hooks." },
              ]}
            />
          </div>
        </Section>

        {/* MCP server */}
        <Section label="MCP server">
          <Body mb={8}>
            Configure <IC>@dev-sixbyfive/intent-mcp</IC> once and every AI agent session has access to your repository&apos;s full reasoning layer.
          </Body>
          <Body mb={28}>
            All tools accept an optional <IC>cwd</IC> parameter. When omitted, the tool uses the process working directory — which is usually the project root and therefore correct automatically.
          </Body>

          <MonoLabel>Configuration</MonoLabel>

          <SectionHeading mt={0}>Claude Code</SectionHeading>
          <Body>Add to <IC>.claude/settings.json</IC> (project) or <IC>~/.claude/settings.json</IC> (global):</Body>
          <CodeBlock lang="json">
{`{
  "mcpServers": {
    "intent": {
      "command": "npx",
      "args": ["@dev-sixbyfive/intent-mcp"]
    }
  }
}`}
          </CodeBlock>

          <SectionHeading>Cursor</SectionHeading>
          <Body>Add to <IC>.cursor/mcp.json</IC> in your project:</Body>
          <CodeBlock lang="json">
{`{
  "mcpServers": {
    "intent": {
      "command": "npx",
      "args": ["@dev-sixbyfive/intent-mcp"]
    }
  }
}`}
          </CodeBlock>

          <SectionHeading>OpenAI Codex CLI</SectionHeading>
          <CodeBlock lang="yaml">
{`# ~/.codex/config.yaml
mcpServers:
  intent:
    command: npx
    args:
      - "@dev-sixbyfive/intent-mcp"`}
          </CodeBlock>

          <SectionHeading>ChatGPT desktop</SectionHeading>
          <Body>Add to <IC>%APPDATA%\ChatGPT\mcp.json</IC> on Windows, or <IC>~/Library/Application Support/ChatGPT/mcp.json</IC> on Mac:</Body>
          <CodeBlock lang="json">
{`{
  "mcpServers": {
    "intent": {
      "command": "npx",
      "args": ["@dev-sixbyfive/intent-mcp"]
    }
  }
}`}
          </CodeBlock>

          <MonoLabel style={{ marginTop: 32 }}>Available tools</MonoLabel>
          <div>
            <ToolRow name="intent_context" sig="(cwd?, system?)" desc="Get all plans, decisions, and systems. Pass system to filter to a single domain." />
            <ToolRow name="intent_review_diff" sig="(cwd?, staged?, base?)" desc="Get intent context relevant to the current git diff. Set staged: true for staged-only; pass base to diff against a branch." />
            <ToolRow name="intent_list_plans" sig="(cwd?)" desc="List all plans with status and metadata." />
            <ToolRow name="intent_list_decisions" sig="(cwd?)" desc="List all decisions with status and supersession relationships." />
            <ToolRow name="intent_list_systems" sig="(cwd?)" desc="List all system definitions." />
            <ToolRow name="intent_rebuild_links" sig="(cwd?)" desc="Rebuild the links index after manual edits or branch merges." />
            <ToolRow name="intent_validate" sig="(cwd?)" desc="Validate all documents for schema correctness and broken cross-references. Returns a structured error list." />
            <ToolRow name="intent_status" sig="(cwd?)" desc="Health overview: counts by type, active plans, validation summary, and links index state." />
            <ToolRow name="intent_agent_prepare" sig="(cwd?, task)" desc="Keyword-score context for relevance to a task and return the most applicable items. Use before starting non-trivial implementation." />
            <ToolRow name="intent_agent_review" sig="(cwd?, staged?, base?)" desc="Review the diff against documented intent. Flags undocumented decisions and schema violations. Returns suggestDecision signal." />
            <ToolRow name="intent_export" sig="(cwd?, system?, target)" desc="Export context as markdown or write to IDE config files (claude, cursor, copilot)." />
          </div>

          <SectionHeading>Example agent workflow</SectionHeading>
          <CodeBlock lang="shell">
{`User: Implement the vendor listing limit

Agent calls: intent_agent_prepare "implement vendor listing limit"
  → scores plans/decisions by keyword relevance
  → returns plan-subscriptions, DEC-0007 (listing constraints),
    sys-marketplace

Agent implements accordingly — without asking the user to
re-explain the plan or constraints

Agent calls: intent_agent_review (after making changes)
  → changes covered by plan-subscriptions ✓
  → all files valid ✓
  → suggestDecision: false (changes were already linked)`}
          </CodeBlock>
        </Section>

        {/* GitHub Action */}
        <Section label="GitHub Action">
          <Body>
            Intent includes a GitHub Action that automatically posts relevant context as a PR comment — surfacing applicable plans and decisions to reviewers without anyone having to look them up.
          </Body>
          <CodeBlock lang="yaml">
{`# .github/workflows/intent-pr.yml
name: Intent PR Context

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  intent:
    name: Post intent context
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: SixByFive/intent/.github/actions/intent-pr@main
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}
          base-ref: origin/\${{ github.base_ref }}`}
          </CodeBlock>
          <Body>
            When a PR is opened or updated, the action runs <IC>intent review-diff --base origin/{'<'}base-branch{'>'}</IC> against the diff, posts a comment with all relevant plans, decisions, and systems, and updates that comment on subsequent pushes. If no related context exists, no comment is posted.
          </Body>

          <SectionHeading>Wiring intent agent review into Claude Code hooks</SectionHeading>
          <Body>Automatically inject relevant context before every tool call by adding this to <IC>.claude/settings.json</IC>:</Body>
          <CodeBlock lang="json">
{`{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "intent agent prepare --hook"
          }
        ]
      }
    ]
  }
}`}
          </CodeBlock>
        </Section>

        {/* Stack */}
        <Section label="Stack">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Language",  value: "TypeScript — strict, explicit Result<T, E> error handling throughout" },
              { label: "Monorepo",  value: "Turborepo with pnpm workspaces — parallel builds, shared type cache" },
              { label: "Schemas",   value: "Zod — runtime validation and static type inference for all document formats" },
              { label: "Parsing",   value: "gray-matter — YAML frontmatter extraction from markdown files" },
              { label: "Git",       value: "simple-git — branch detection, staged diff, base-ref comparison" },
              { label: "CLI",       value: "Commander.js — thin command layer, all logic in core" },
              { label: "Protocol",  value: "Model Context Protocol — stdio transport, works with Claude, Cursor, Codex, ChatGPT" },
              { label: "Tests",     value: "Vitest — unit tests across core and CLI packages" },
            ].map((r) => (
              <div key={r.label} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 16, alignItems: "baseline" }}>
                <span style={{ ...mono, fontSize: 11, color: "var(--text-4)", letterSpacing: "0.06em" }}>{r.label}</span>
                <span style={{ fontSize: 14, color: "var(--text-2)" }}>{r.value}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* What it is not */}
        <Section label="What it is not">
          <Body mb={24}>Worth being explicit:</Body>
          <CrossList items={[
            "Not a documentation app — .intent/ is not a wiki",
            "Not a project management tool — it doesn't replace Linear, Jira, or GitHub Issues",
            "Not a SaaS dashboard — no account, no sync, no external dependency of any kind",
            "Not a replacement for commit messages or PRs — it complements them",
          ]} />
        </Section>

      </div>

      {/* Bottom nav */}
      <div style={{ padding: "64px 0 80px", borderTop: "1px solid var(--border)", marginTop: 8 }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <Link href="/work" className="btn btn-secondary">← All work</Link>
          <Link href="/work/tcgdex" className="btn btn-secondary">Next: TCGDex →</Link>
        </div>
      </div>
    </>
  );
}
