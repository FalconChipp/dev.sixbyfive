// app/services/page.js

import Link from "next/link";

export const metadata = {
  title: "Services — SixByFive Studio",
  description: "What SixByFive builds: product engineering, platforms, integrations, and UI systems.",
};

const capabilities = [
  {
    label: "Build",
    title: "Product engineering",
    summary: "End-to-end product delivery from blank page to production.",
    detail: "We handle the full build: frontend, backend, auth, database design, API layer, and deployment. We define scope early, agree acceptance criteria upfront, and deliver in milestones you can review. No surprises.",
    includes: [
      "UI and component system",
      "Backend API and business logic",
      "Authentication and access control",
      "Data modelling and migrations",
      "Deployment, CI/CD, and release process",
    ],
    goodFor: "New products, MVPs, greenfield features, rebuilds of unreliable systems.",
    tags: ["Next.js", "React", "Node.js", "TypeScript", "PostgreSQL"],
  },
  {
    label: "Operate",
    title: "Platforms & pipelines",
    summary: "Scheduled jobs, data ingestion, and the infrastructure that keeps things reliable.",
    detail: "Products that depend on data need systems to keep that data accurate. We build scheduled pipelines, ingestion jobs, reconciliation processes, caching layers, and monitoring — all the machinery that runs in the background and is invisible when it works.",
    includes: [
      "Scheduled cron jobs and background workers",
      "Data ingestion and ETL pipelines",
      "Reconciliation and integrity checks",
      "Caching and rollup strategies",
      "Failure alerting and retry logic",
    ],
    goodFor: "Products with external data dependencies, marketplaces, anything with pricing or inventory.",
    tags: ["Node.js", "Cron", "GraphQL", "PostgreSQL", "Monitoring"],
  },
  {
    label: "Connect",
    title: "Integrations",
    summary: "Third-party APIs and services connected cleanly, without the spaghetti.",
    detail: "We have direct experience integrating Stripe, Discord, Shopify, WordPress, and a range of niche data APIs. Integration work is scoped carefully — we map the data contract, handle edge cases, write for resilience, and make it easy to debug when something goes wrong.",
    includes: [
      "Payment processing (Stripe)",
      "Community integrations (Discord)",
      "E-commerce (Shopify, WooCommerce)",
      "CMS (WordPress, headless)",
      "Custom and niche data APIs",
    ],
    goodFor: "Adding payment flows, syncing data from external sources, connecting existing tools.",
    tags: ["Stripe", "Discord", "Shopify", "REST", "Webhooks"],
  },
  {
    label: "Polish",
    title: "UI systems",
    summary: "Component libraries and design systems that scale without becoming a mess.",
    detail: "A consistent component system makes it faster to build new features and cheaper to maintain existing ones. We design and build component libraries with clear contracts — typed props, documented variants, and a visual hierarchy that works across screen sizes.",
    includes: [
      "Component library design and build",
      "Responsive layout systems",
      "Design token architecture",
      "Dark mode and theming",
      "Accessibility fundamentals",
    ],
    goodFor: "Teams scaling a product, redesigns, consolidating inconsistent UIs.",
    tags: ["React", "Tailwind", "Design tokens", "Storybook", "TypeScript"],
  },
];

const notAGoodFit = [
  "Large enterprise projects requiring on-site consultancy",
  "Pure design work (no development component)",
  "Maintenance contracts for codebases we didn&apos;t build",
  "Rush projects with no time for proper scoping",
];

export default function ServicesPage() {
  return (
    <>
      {/* Page header */}
      <section style={{ padding: "72px 0 64px" }}>
        <div className="wrap">
          <Link href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-4)", textDecoration: "none", letterSpacing: "0.08em", display: "inline-block", marginBottom: 40 }}>
            ← SixByFive
          </Link>
          <span className="eyebrow" style={{ display: "block", marginBottom: 16 }}>Capabilities</span>
          <h1 className="display" style={{ fontSize: "clamp(36px, 5vw, 58px)", color: "var(--text)", maxWidth: 680, marginBottom: 20 }}>
            What we deliver
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-2)", maxWidth: 480, lineHeight: 1.65 }}>
            We work in clear scope buckets. Most engagements combine two or three of these,
            shaped around what you actually need rather than a predefined package.
          </p>
        </div>
      </section>

      <div className="hr" />

      {/* Capabilities detail */}
      {capabilities.map((c, i) => (
        <div key={c.title}>
          <section style={{ padding: "72px 0" }}>
            <div className="wrap">
              <div className="section-grid">
                {/* Left */}
                <div style={{ paddingTop: 4 }}>
                  <span className="pill pill-accent" style={{ marginBottom: 16, display: "inline-flex" }}>{c.label}</span>
                </div>

                {/* Right */}
                <div>
                  <h2 className="display" style={{ fontSize: "clamp(24px, 3vw, 34px)", color: "var(--text)", marginBottom: 8 }}>
                    {c.title}
                  </h2>
                  <p style={{ fontSize: 15, color: "var(--text-2)", marginBottom: 20, lineHeight: 1.6, fontStyle: "italic", fontFamily: "var(--font-display)" }}>
                    {c.summary}
                  </p>
                  <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7, maxWidth: 560, marginBottom: 40 }}>
                    {c.detail}
                  </p>

                  {/* Includes */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px 48px", marginBottom: 40 }}>
                    <div>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-4)", display: "block", marginBottom: 16 }}>
                        Includes
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                        {c.includes.map((item) => (
                          <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <span style={{ color: "var(--accent)", fontSize: 14, lineHeight: "20px", flexShrink: 0 }}>—</span>
                            <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-4)", display: "block", marginBottom: 16 }}>
                        Good for
                      </span>
                      <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>{c.goodFor}</p>

                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-4)", display: "block", marginTop: 28, marginBottom: 12 }}>
                        Technologies
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {c.tags.map((t) => <span key={t} className="pill">{t}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {i < capabilities.length - 1 && <div className="hr" />}
        </div>
      ))}

      <div className="hr" />

      {/* Not a good fit */}
      <section style={{ padding: "72px 0" }}>
        <div className="wrap">
          <div className="section-grid">
            <div style={{ paddingTop: 4 }}>
              <span className="eyebrow">Honesty</span>
            </div>
            <div>
              <h2 className="display" style={{ fontSize: "clamp(22px, 2.8vw, 30px)", color: "var(--text)", marginBottom: 8 }}>
                When we&apos;re probably not the right fit
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 40, lineHeight: 1.6 }}>
                We&apos;d rather tell you upfront than waste your time.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {notAGoodFit.map((n) => (
                  <div key={n} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ color: "var(--text-4)", fontSize: 14, lineHeight: "22px", flexShrink: 0 }}>×</span>
                    <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: n }} />
                  </div>
                ))}
              </div>
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
              Ready to scope something?
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.65, marginBottom: 32 }}>
              Most engagements start with a short call to understand the problem,
              then a written scope and a first milestone.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="https://uk.linkedin.com/company/sixbyfive" target="_blank" rel="noreferrer" className="btn btn-primary">Get in touch ↗</a>
              <Link href="/process" className="btn btn-secondary">How we work</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}