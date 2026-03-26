// app/components/CaseStudy.js
// Shared layout for all case study inner pages.
// Accepts structured data, renders consistently.

import Link from "next/link";

const mono = { fontFamily: "var(--font-mono)" };
const monoLabel = { ...mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-4)", display: "block", marginBottom: 14 };
const dash = { color: "var(--accent)", fontSize: 15, lineHeight: "24px", flexShrink: 0 };
const cross = { color: "var(--text-3)", fontSize: 15, lineHeight: "24px", flexShrink: 0 };

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

function BodyText({ children }) {
  return <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.75, maxWidth: 600, marginBottom: 16 }}>{children}</p>;
}

function DashList({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={dash}>—</span>
          <span style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>
            {typeof item === "string" ? item : item}
          </span>
        </div>
      ))}
    </div>
  );
}

function CrossList({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={cross}>×</span>
          <span style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

function StackTable({ rows }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 16, alignItems: "baseline" }}>
          <span style={{ ...mono, fontSize: 11, color: "var(--text-4)", letterSpacing: "0.06em" }}>{r.label}</span>
          <span style={{ fontSize: 14, color: "var(--text-2)" }}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function Callout({ children }) {
  return (
    <div style={{ padding: "16px 20px", borderLeft: "2px solid var(--border-2)", marginTop: 24, marginBottom: 8 }}>
      <p style={{ fontSize: 14, color: "var(--text-3)", lineHeight: 1.7, ...mono }}>{children}</p>
    </div>
  );
}

export default function CaseStudy({ data }) {
  const {
    title, tagline, type, role, status, year,
    externalHref, externalLabel,
    problem, approach, built, whatWasHard,
    stack, outcomes, notBuilt,
    note, nextProject,
  } = data;

  return (
    <>
      <style>{`
        @media (max-width: 720px) {
          .cs-grid { grid-template-columns: 1fr !important; gap: 20px 0 !important; }
        }
      `}</style>

      {/* Page header */}
      <section style={{ padding: "72px 0 64px" }}>
        <div className="wrap">
          <Link href="/work" style={{ ...mono, fontSize: 12, color: "var(--text-4)", textDecoration: "none", letterSpacing: "0.08em", display: "inline-block", marginBottom: 40 }}>
            ← Work
          </Link>

          {/* Meta pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            <span className={`pill ${status === "Live" || status === "Active" ? "pill-live" : ""}`}>{status}</span>
            <span className="pill">{type}</span>
            <span className="pill pill-accent">{role}</span>
            <span style={{ ...mono, fontSize: 11, color: "var(--text-4)", alignSelf: "center", marginLeft: 4 }}>{year}</span>
          </div>

          <h1 className="display" style={{ fontSize: "clamp(38px, 5.5vw, 64px)", color: "var(--text)", maxWidth: 760, marginBottom: 20, lineHeight: 1.04 }}>
            {title}
          </h1>
          <p style={{ fontSize: 17, color: "var(--accent-text)", fontStyle: "italic", fontFamily: "var(--font-display)", maxWidth: 560, lineHeight: 1.5, marginBottom: 32 }}>
            {tagline}
          </p>

          {externalHref && (
            <a href={externalHref} target="_blank" rel="noreferrer" className="btn btn-primary">
              {externalLabel || "View live ↗"}
            </a>
          )}
        </div>
      </section>

      {/* Body sections */}
      <div className="wrap">

        {/* The problem */}
        {problem && (
          <Section label="The problem">
            {problem.map((p, i) => <BodyText key={i}>{p}</BodyText>)}
          </Section>
        )}

        {/* The approach */}
        {approach && (
          <Section label="Approach">
            {approach.body && approach.body.map((p, i) => <BodyText key={i}>{p}</BodyText>)}
            {approach.decisions && (
              <div style={{ marginTop: 24 }}>
                <span style={monoLabel}>Key decisions</span>
                <DashList items={approach.decisions} />
              </div>
            )}
          </Section>
        )}

        {/* What was built */}
        {built && (
          <Section label="What was built">
            {built.body && built.body.map((p, i) => <BodyText key={i}>{p}</BodyText>)}
            {built.items && (
              <div style={{ marginTop: built.body ? 24 : 0 }}>
                <DashList items={built.items} />
              </div>
            )}
            {built.note && <Callout>{built.note}</Callout>}
          </Section>
        )}

        {/* What was hard */}
        {whatWasHard && (
          <Section label="What was hard">
            {whatWasHard.map((block, i) => (
              <div key={i} style={{ marginBottom: 28 }}>
                {block.title && (
                  <p style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 6 }}>{block.title}</p>
                )}
                <BodyText>{block.body}</BodyText>
              </div>
            ))}
          </Section>
        )}

        {/* Stack */}
        {stack && (
          <Section label="Stack">
            <StackTable rows={stack} />
          </Section>
        )}

        {/* Outcomes */}
        {outcomes && (
          <Section label="Outcomes">
            <DashList items={outcomes} />
          </Section>
        )}

        {/* Explicitly not built */}
        {notBuilt && (
          <Section label="Out of scope">
            <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 20, lineHeight: 1.6 }}>
              Worth being explicit about what this project deliberately didn&apos;t try to do.
            </p>
            <CrossList items={notBuilt} />
          </Section>
        )}

        {/* Closing note */}
        {note && (
          <div style={{ padding: "40px 0", borderTop: "1px solid var(--border)" }}>
            <Callout>{note}</Callout>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ padding: "64px 0 80px", borderTop: "1px solid var(--border)", marginTop: 8 }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <Link href="/work" className="btn btn-secondary">← All work</Link>
          {nextProject && (
            <Link href={nextProject.href} className="btn btn-secondary">
              Next: {nextProject.title} →
            </Link>
          )}
        </div>
      </div>
    </>
  );
}