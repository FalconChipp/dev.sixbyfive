// app/process/page.js

import Link from "next/link";

export const metadata = {
  title: "Process — SixByFive Studio",
  description: "How SixByFive works: scoping, building, shipping, and maintaining.",
};

const phases = [
  {
    n: "01",
    title: "Discovery and scoping",
    duration: "1–2 days",
    summary: "Understanding the problem before writing a line of code.",
    body: "We start with a conversation about what you&apos;re building, why it matters, and what success looks like. From that, we produce a written scope: a clear description of what will be built, how we&apos;ll know it&apos;s done, and what&apos;s explicitly out of scope. Scoping is the most important part of the process — a tight scope prevents the majority of project problems.",
    outputs: [
      "Written scope document",
      "Acceptance criteria per deliverable",
      "First milestone definition",
      "Rough timeline and cost estimate",
    ],
  },
  {
    n: "02",
    title: "Architecture and API contracts",
    duration: "2–5 days",
    summary: "Agreeing on the shape of the system before building it.",
    body: "Before any UI exists, we define the data model and API contracts. This gives both sides a clear picture of what&apos;s being built and means the frontend and backend can progress in parallel without blocking each other. It also surfaces complexity early — better to find a hard problem in a contract than in production code.",
    outputs: [
      "Data model / schema",
      "API shape and endpoint definitions",
      "Third-party integration contracts",
      "Agreed technical constraints",
    ],
  },
  {
    n: "03",
    title: "Build in milestones",
    duration: "Varies",
    summary: "Incremental delivery you can review, test, and provide feedback on.",
    body: "We build in short milestones — typically one to two weeks each. At the end of each milestone, you have something reviewable: a working feature, a deployed environment, or a testable flow. We don&apos;t do big-bang deliveries where you see nothing for six weeks and then get everything at once. Steady increments mean problems are caught early.",
    outputs: [
      "Deployed staging environment",
      "Working feature per milestone",
      "Short written update at each stage",
      "Issues log and remaining scope",
    ],
  },
  {
    n: "04",
    title: "QA and pre-launch",
    duration: "3–7 days",
    summary: "Deliberate testing before anything goes live.",
    body: "Before launch, we run through the agreed acceptance criteria systematically. We test edge cases, check error states, and verify the system behaves correctly under the conditions it will actually face. We also complete a pre-launch checklist: environment variables, logging, error tracking, and any third-party configurations that need to be in place.",
    outputs: [
      "Acceptance criteria sign-off",
      "Edge case and error state testing",
      "Pre-launch environment checklist",
      "Performance and load sanity check",
    ],
  },
  {
    n: "05",
    title: "Launch and handover",
    duration: "1–2 days",
    summary: "A clean deployment with documentation you can actually use.",
    body: "Launch is planned, not improvised. We deploy to production in a low-risk window, monitor the first hours, and document anything the team needs to know about operating the system. Handover includes environment setup docs, a runbook for common operational tasks, and clear pointers to where things live.",
    outputs: [
      "Production deployment",
      "Environment and configuration documentation",
      "Runbook for operational tasks",
      "Monitoring and alerting in place",
    ],
  },
  {
    n: "06",
    title: "Maintenance and iteration",
    duration: "Ongoing",
    summary: "Keeping the system healthy after it ships.",
    body: "Shipping is not the end. We offer ongoing maintenance engagements for systems we&apos;ve built — monitoring, dependency updates, bug fixes, and incremental improvements. If you have a new feature to add or something that&apos;s broken, you&apos;re not starting a relationship from scratch with someone who doesn&apos;t know the codebase.",
    outputs: [
      "Monthly dependency and security updates",
      "Bug fix SLA",
      "Feature iteration on request",
      "Ongoing monitoring and alerting",
    ],
  },
];

const principles = [
  { title: "Scope first, code second", body: "Ambiguous requirements produce ambiguous results. We write down what we&apos;re building before we build it, and we review that with you before starting." },
  { title: "No big-bang deliveries", body: "You see something working at the end of every milestone. This keeps feedback loops short and prevents surprises at launch." },
  { title: "Honest about complexity", body: "If something is harder than it looks, we say so upfront — not two weeks in when it&apos;s a problem. We&apos;d rather adjust scope than overrun." },
  { title: "Built to be maintained", body: "Every system we build has logging, error tracking, and documentation. Not as an afterthought — as part of the definition of done." },
  { title: "Small team, direct access", body: "You work directly with the people building your product. No account managers, no handoffs, no translation layers." },
];

export default function ProcessPage() {
  return (
    <>
      {/* Header */}
      <section style={{ padding: "72px 0 64px" }}>
        <div className="wrap">
          <Link href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-4)", textDecoration: "none", letterSpacing: "0.08em", display: "inline-block", marginBottom: 40 }}>
            ← SixByFive
          </Link>
          <span className="eyebrow" style={{ display: "block", marginBottom: 16 }}>How we work</span>
          <h1 className="display" style={{ fontSize: "clamp(36px, 5vw, 58px)", color: "var(--text)", maxWidth: 640, marginBottom: 20 }}>
            Simple, structured, designed to ship without chaos.
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-2)", maxWidth: 480, lineHeight: 1.65 }}>
            A process built from experience on what actually goes wrong in software projects —
            and what prevents it.
          </p>
        </div>
      </section>

      <div className="hr" />

      {/* Phases */}
      <section style={{ padding: "72px 0" }}>
        <div className="wrap">
          <div className="section-grid">
            <div style={{ paddingTop: 4 }}>
              <span className="eyebrow">Phases</span>
            </div>
            <div>
              <h2 className="display" style={{ fontSize: "clamp(22px, 2.8vw, 30px)", color: "var(--text)", marginBottom: 8 }}>
                From first call to long-term maintenance
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 48 }}>
                Not every project goes through all six phases — we adapt to what you actually need.
              </p>

              {phases.map((p) => (
                <div key={p.n} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: "0 24px", padding: "28px 0", borderTop: "1px solid var(--border)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-text)", paddingTop: 3 }}>{p.n}</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 600, fontSize: 15, color: "var(--text)" }}>{p.title}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-4)", letterSpacing: "0.06em" }}>{p.duration}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--accent-text)", marginBottom: 12, fontStyle: "italic", fontFamily: "var(--font-display)" }}>
                      {p.summary}
                    </p>
                    <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7, marginBottom: 20, maxWidth: 520 }}
                      dangerouslySetInnerHTML={{ __html: p.body }} />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {p.outputs.map((o) => <span key={o} className="pill" style={{ fontSize: 10 }}>{o}</span>)}
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ borderBottom: "1px solid var(--border)" }} />
            </div>
          </div>
        </div>
      </section>

      <div className="hr" />

      {/* Principles */}
      <section style={{ padding: "72px 0" }}>
        <div className="wrap">
          <div className="section-grid">
            <div style={{ paddingTop: 4 }}>
              <span className="eyebrow">Principles</span>
            </div>
            <div>
              <h2 className="display" style={{ fontSize: "clamp(22px, 2.8vw, 30px)", color: "var(--text)", marginBottom: 48 }}>
                What guides how we work
              </h2>
              {principles.map((p) => (
                <div key={p.title} className="process-row">
                  <span style={{ color: "var(--accent)", fontSize: 14, lineHeight: "22px" }}>—</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>{p.title}</p>
                    <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: p.body }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="hr" />

      {/* CTA */}
      <section style={{ padding: "80px 0" }}>
        <div className="wrap">
          <div style={{ maxWidth: 520 }}>
            <h2 className="display" style={{ fontSize: "clamp(26px, 3.5vw, 40px)", color: "var(--text)", marginBottom: 16 }}>
              Sounds like how you want to work?
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.65, marginBottom: 32 }}>
              The first step is a short conversation. We&apos;ll ask about your project and tell you
              honestly whether we&apos;re a good fit.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="https://uk.linkedin.com/company/sixbyfive" target="_blank" rel="noreferrer" className="btn btn-primary">Get in touch ↗</a>
              <Link href="/services" className="btn btn-secondary">See capabilities</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}