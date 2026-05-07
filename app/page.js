// app/page.js — v5
// Homepage: updated work preview includes TCGDex, tooling preview intact

import Link from "next/link";

const workPreview = [
  {
    title: "Intent",
    type: "npm package",
    role: "Author",
    description: "A git-native reasoning layer for software teams and AI agents. Plans, decisions, and constraints committed alongside code — surfaced via CLI and MCP server.",
    stack: "TypeScript · Zod · MCP · Commander.js",
    href: "/work/intent",
    external: false,
    badge: "Open source",
  },
  {
    title: "TCGDex",
    type: "Open Source",
    role: "Maintainer",
    description: "Active maintainers of the multilingual open-source Pokémon TCG API and dataset — contributing to data accuracy, the API layer, and the image pipeline.",
    stack: "REST API · community dataset · image pipeline",
    href: "https://tcgdex.dev",
    external: true,
  },
  {
    title: "SixByFive TCG Suite",
    type: "Product suite",
    role: "Built & maintained",
    description: "Web platform, Android app, admin dashboard, AI training pipeline, and set ingestion backend — a full collector platform and the operational systems that run it.",
    stack: "Next.js · Expo · GraphQL · PostgreSQL · ML pipeline",
    href: "/work",
    external: false,
    badge: "5 projects",
  },
  {
    title: "3D Printing Portal",
    type: "Vertical SaaS",
    role: "Built & maintained",
    description: "Workflow portal replacing email threads and spreadsheets for a 3D print service — quote requests, file uploads, automated notifications, and admin oversight.",
    stack: "Next.js · Node.js · email notifications",
    href: "/work/3d-printing-portal",
    external: false,
  },
];

const toolsPreview = [
  { href: "/tools/bulk-edit",           title: "Bulk Edit UI",         desc: "Multi-source variant editor. Merge Cardmarket and TCGPlayer exports, edit card variant IDs, generate code blocks.", tag: "Browser tool" },
  { href: "/tools/cardmarket-exporter", title: "Cardmarket Exporter",  desc: "Tampermonkey script that paginates Singles listings and exports a clean product ID map for ingestion.", tag: "Script" },
  { href: "/tools/tcgplayer-exporter",  title: "TCGPlayer Exporter",   desc: "Fetches all TCGPlayer productIds for any Pokémon set — including variant patterns and printing subtypes.", tag: "API tool" },
  { href: "/tools/image-intake",        title: "Card Image Intake",    desc: "Upload, validate, and canonically rename card image zips for storage. Supports single-set and batch modes.", tag: "Upload tool" },
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="wrap">
          <div className="anim-1" style={{ marginBottom: 32 }}>
            <span className="eyebrow-accent">SixByFive Studio</span>
            <span className="eyebrow" style={{ margin: "0 10px" }}>·</span>
            <span className="eyebrow">Independent · UK</span>
          </div>

          <h1 className="display anim-2" style={{ fontSize: "clamp(42px, 6.5vw, 76px)", color: "var(--text)", maxWidth: 820, marginBottom: 24 }}>
            We design and build platforms that ship{" "}
            <span style={{ color: "var(--accent)" }}>—</span> and keep running.
          </h1>

          <p className="anim-3" style={{ fontSize: 16, color: "var(--text-2)", maxWidth: 520, lineHeight: 1.65, marginBottom: 40 }}>
            An independent studio building collector-first products, open-source tooling,
            and the internal systems that make data and operations reliable.
          </p>

          <div className="anim-4" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/work" className="btn btn-primary">See work</Link>
            <Link href="/services" className="btn btn-secondary">Capabilities</Link>
          </div>

          <div className="stat-grid anim-5">
            <div className="stat-cell">
              <span className="stat-label">Stack</span>
              <span className="stat-value">Next.js · Node · GraphQL</span>
            </div>
            <div className="stat-cell">
              <span className="stat-label">Open source</span>
              <span className="stat-value">TCGDex maintainers</span>
            </div>
            <div className="stat-cell">
              <span className="stat-label">Focus</span>
              <span className="stat-value">Collector-first products</span>
            </div>
            <div className="stat-cell">
              <span className="stat-label">Output</span>
              <span className="stat-value">Shipped · maintained</span>
            </div>
          </div>
        </div>
      </section>

      <div className="hr" />

      {/* ── WORK PREVIEW ──────────────────────────────────── */}
      <section style={{ padding: "80px 0" }}>
        <div className="wrap">
          <div className="section-grid">
            <div style={{ paddingTop: 4 }}>
              <span className="eyebrow">Work</span>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 8 }}>
                <h2 className="display" style={{ fontSize: "clamp(26px, 3.5vw, 38px)", color: "var(--text)" }}>
                  Products, platforms, open source
                </h2>
                <Link href="/work" className="page-link" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)", textDecoration: "none", whiteSpace: "nowrap" }}>
                  All work →
                </Link>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 48 }}>
                Live systems and open-source projects we actively maintain.
              </p>

              {workPreview.map((w) => {
                const El = w.external ? "a" : Link;
                const elProps = w.external
                  ? { href: w.href, target: "_blank", rel: "noreferrer" }
                  : { href: w.href };
                return (
                  <El key={w.title} {...elProps} className="work-row" style={{ textDecoration: "none" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 17, fontWeight: 600, color: "var(--text)" }}>{w.title}</span>
                        <span className="pill pill-live">Live</span>
                        <span className="pill">{w.type}</span>
                        <span className="pill pill-accent">{w.role}</span>
                        {w.badge && <span className="pill" style={{ borderColor: "var(--accent-border)", color: "var(--accent-text)" }}>{w.badge}</span>}
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 10, maxWidth: 560, lineHeight: 1.6 }}>{w.description}</p>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-4)", letterSpacing: "0.06em" }}>{w.stack}</span>
                    </div>
                    <div className="work-arrow">↗</div>
                  </El>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="hr" />

      {/* ── SERVICES PREVIEW ──────────────────────────────── */}
      <section style={{ padding: "80px 0" }}>
        <div className="wrap">
          <div className="section-grid">
            <div style={{ paddingTop: 4 }}>
              <span className="eyebrow">Services</span>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 8 }}>
                <h2 className="display" style={{ fontSize: "clamp(26px, 3.5vw, 38px)", color: "var(--text)" }}>
                  What we deliver
                </h2>
                <Link href="/services" className="page-link" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)", textDecoration: "none", whiteSpace: "nowrap" }}>
                  Full capabilities →
                </Link>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 48 }}>
                Clear scope buckets. Most engagements combine two or three.
              </p>
              {[
                { label: "Build",   title: "Product engineering",   text: "End-to-end delivery: UI, backend, auth, data modelling, and a clean release path." },
                { label: "Operate", title: "Platforms & pipelines", text: "Scheduled jobs, ingestion, reconciliation, caching — tooling that keeps data trustworthy." },
                { label: "Connect", title: "Integrations",          text: "Stripe, Discord, Shopify, WordPress, and external APIs integrated without spaghetti." },
                { label: "Polish",  title: "UI systems",            text: "Consistent component systems, responsive layouts, and UX details that feel premium." },
              ].map((s) => (
                <div key={s.title} className="service-row">
                  <div><span className="pill pill-accent">{s.label}</span></div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>{s.title}</p>
                    <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>{s.text}</p>
                  </div>
                  <div />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="hr" />

      {/* ── TOOLING ───────────────────────────────────────── */}
      <section style={{ padding: "80px 0" }}>
        <div className="wrap">
          <div className="section-grid">
            <div style={{ paddingTop: 4 }}>
              <span className="eyebrow">Tooling</span>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 8 }}>
                <h2 className="display" style={{ fontSize: "clamp(26px, 3.5vw, 38px)", color: "var(--text)" }}>
                  Free tools
                </h2>
                <Link href="/tools" className="page-link" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)", textDecoration: "none", whiteSpace: "nowrap" }}>
                  All tools →
                </Link>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 48 }}>
                Built for our own data workflows — open for anyone to use.
              </p>
              {toolsPreview.map((t) => (
                <Link key={t.href} href={t.href} className="work-row" style={{ textDecoration: "none" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>{t.title}</span>
                      <span className="pill">{t.tag}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-2)", maxWidth: 560, lineHeight: 1.6 }}>{t.desc}</p>
                  </div>
                  <div className="work-arrow">→</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="hr" />

      {/* ── CONTACT ───────────────────────────────────────── */}
      <section style={{ padding: "96px 0 80px" }}>
        <div className="wrap">
          <div style={{ maxWidth: 600 }}>
            <span className="eyebrow-accent" style={{ display: "block", marginBottom: 24 }}>Get in touch</span>
            <h2 className="display" style={{ fontSize: "clamp(32px, 4.5vw, 52px)", color: "var(--text)", marginBottom: 20 }}>
              Want to build something that lasts?
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.65, marginBottom: 40, maxWidth: 460 }}>
              If you&apos;re building something that needs to ship and keep running,
              let&apos;s talk through scope, timeline, and a sensible first milestone.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
              <a href="https://uk.linkedin.com/company/sixbyfive" target="_blank" rel="noreferrer" className="btn btn-primary">LinkedIn ↗</a>
              <a href="https://sixbyfive.com" target="_blank" rel="noreferrer" className="btn btn-secondary">sixbyfive.com</a>
            </div>
            <p className="mono" style={{ fontSize: 12, color: "var(--text-4)", letterSpacing: "0.04em" }}>
              Typical first step: scope call → single milestone → ship.
            </p>
          </div>
        </div>
      </section>

      <style>{`.page-link:hover { color: var(--text) !important; }`}</style>
    </>
  );
}