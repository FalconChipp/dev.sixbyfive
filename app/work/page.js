// app/work/page.js — v4
// Restructured: TCG Suite grouped, TCGDex tools separate, key fix applied

import Link from "next/link";

export const metadata = {
  title: "Work — SixByFive Studio",
  description: "Products, platforms, and open source work built and maintained by SixByFive.",
};

const standaloneProjects = [
  {
    title: "TCGDex",
    type: "Open Source",
    role: "Maintainer",
    status: "Active",
    year: "2023–present",
    href: "/work/tcgdex",
    description: "Active maintainers of the multilingual open-source Pokémon TCG API and dataset — contributing to data accuracy, the API layer, and the image pipeline.",
    stack: "REST API · TypeScript SDKs · image pipeline",
  },
  {
    title: "3D Printing Portal",
    type: "Vertical SaaS",
    role: "Built & maintained",
    status: "Live",
    year: "2024",
    href: "/work/3d-printing-portal",
    description: "End-to-end job management — quote requests, file uploads, automated notifications, and admin oversight. Replaced email threads and spreadsheets with a system that fits how the business operates.",
    stack: "Next.js · Node.js · PostgreSQL · transactional email",
  },
];

const tcgSuite = [
  {
    title: "TCG Platform",
    type: "Web app",
    status: "Live",
    year: "2023–present",
    href: "/work/tcg-platform",
    description: "Collector-first platform for searching sets and cards, tracking collections, building binders, and monitoring pricing across Cardmarket and TCGPlayer.",
    stack: "Next.js · GraphQL · PostgreSQL · pricing pipeline",
  },
  {
    title: "TCG Mobile",
    type: "Android app",
    status: "Beta",
    year: "2024–present",
    href: "/work/tcg-mobile",
    description: "Expo Android app with full feature parity — search, collection tracking, binders, live pricing. Shares the same GraphQL API as the web platform.",
    stack: "Expo · React Native · GraphQL",
  },
  {
    title: "Admin Dashboard",
    type: "Internal tool",
    status: "Active",
    year: "2024–present",
    href: "/work/admin-dashboard",
    description: "Ops dashboard for catalogue management, variant mapping, pricing audits, ingestion review, and pipeline monitoring. The operational layer that makes running the platform practical.",
    stack: "Next.js · GraphQL · PostgreSQL",
  },
  {
    title: "Vision Lab",
    type: "Internal tool",
    status: "Active",
    year: "2024–present",
    href: "/work/vision-lab",
    description: "AI training data pipeline for card recognition — collecting, curating, and labelling card images to train a model that can identify Pokémon cards from photos.",
    stack: "Next.js · Python · ML training pipeline",
  },
  {
    title: "Set Ingestion Backend",
    type: "Internal tool",
    status: "Active",
    year: "2024–present",
    href: "/work/set-ingestion",
    description: "Pipeline that takes raw set data and produces live, priced, searchable catalogue entries. Staged, idempotent, with supervised mode for ambiguous cases.",
    stack: "Node.js · PostgreSQL · job queue",
  },
];

const tcgdexTools = [
  {
    title: "Card Image Intake",
    type: "Tool",
    status: "Active",
    year: "2024–present",
    href: "/tools/image-intake",
    description: "Upload, validate, and canonically rename card image zips for the TCGDex image store. Supports single-set, symbol-only, and batch multi-set modes.",
    stack: "Next.js · fflate · cloud storage",
  },
  {
    title: "Cardmarket Exporter",
    type: "Script",
    status: "Free",
    year: "2024",
    href: "/tools/cardmarket-exporter",
    description: "Tampermonkey userscript that paginates Cardmarket Singles listings and exports a clean product ID map — base and variant buckets merged by canonical card ID.",
    stack: "Tampermonkey · JavaScript",
  },
  {
    title: "TCGPlayer Exporter",
    type: "Tool",
    status: "Free",
    year: "2024",
    href: "/tools/tcgplayer-exporter",
    description: "Fetches all TCGPlayer productIds for any Pokémon set via TCGCSV — variant patterns, printing subtypes, and pricing. Exports JSON compatible with the Bulk Edit UI.",
    stack: "Next.js · TCGCSV API",
  },
  {
    title: "Bulk Edit UI",
    type: "Tool",
    status: "Free",
    year: "2024",
    href: "/tools/bulk-edit",
    description: "Multi-source variant editor — merge Cardmarket and TCGPlayer exports, assign IDs per card variant, generate stable code blocks. Handles foil patterns and unknown additionals.",
    stack: "Next.js · React",
  },
];

function ProjectRow({ p }) {
  const isLive = p.status === "Live" || p.status === "Active";
  const isFree = p.status === "Free";
  return (
    <div key={p.title}>
      <Link href={p.href} className="work-row" style={{ textDecoration: "none" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>{p.title}</span>
            <span className={`pill ${isLive ? "pill-live" : isFree ? "pill-live" : ""}`}>{p.status}</span>
            <span className="pill">{p.type}</span>
            {p.year && <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-4)", letterSpacing: "0.06em" }}>{p.year}</span>}
          </div>
          <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 8, maxWidth: 580, lineHeight: 1.65 }}>{p.description}</p>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-4)", letterSpacing: "0.06em" }}>{p.stack}</span>
        </div>
        <div className="work-arrow">→</div>
      </Link>
    </div>
  );
}

function GroupHeader({ eyebrow, title, description }) {
  return (
    <div style={{ paddingBottom: 32, marginBottom: 8 }}>
      <span className="eyebrow" style={{ display: "block", marginBottom: 12 }}>{eyebrow}</span>
      <h2 className="display" style={{ fontSize: "clamp(20px, 2.5vw, 28px)", color: "var(--text)", marginBottom: 8 }}>{title}</h2>
      {description && <p style={{ fontSize: 13, color: "var(--text-2)", maxWidth: 520, lineHeight: 1.65 }}>{description}</p>}
    </div>
  );
}

export default function WorkPage() {
  return (
    <>
      {/* Page header */}
      <section style={{ padding: "72px 0 64px" }}>
        <div className="wrap">
          <Link href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-4)", textDecoration: "none", letterSpacing: "0.08em", display: "inline-block", marginBottom: 40 }}>
            ← SixByFive
          </Link>
          <span className="eyebrow" style={{ display: "block", marginBottom: 16 }}>Work</span>
          <h1 className="display" style={{ fontSize: "clamp(36px, 5vw, 58px)", color: "var(--text)", maxWidth: 680, marginBottom: 20 }}>
            Products, platforms, and open source
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-2)", maxWidth: 520, lineHeight: 1.65 }}>
            Everything here is live, maintained, and built to last.
            We work on a small number of things at a time and go deep on each one.
          </p>
        </div>
      </section>

      <div className="hr" />

      {/* Standalone projects */}
      <section style={{ padding: "64px 0" }}>
        <div className="wrap">
          {standaloneProjects.map((p) => (
            <ProjectRow key={p.title} p={p} />
          ))}
        </div>
      </section>

      <div className="hr" />

      {/* SixByFive TCG Suite */}
      <section style={{ padding: "64px 0" }}>
        <div className="wrap">
          <GroupHeader
            eyebrow="SixByFive TCG"
            title="The TCG platform and everything that runs it"
            description="A suite of products and internal tools built around the collector platform — web, mobile, ops, AI training, and the data pipelines underneath."
          />
          {tcgSuite.map((p) => (
            <ProjectRow key={p.title} p={p} />
          ))}
        </div>
      </section>

      <div className="hr" />

      {/* TCGDex tools */}
      <section style={{ padding: "64px 0" }}>
        <div className="wrap">
          <GroupHeader
            eyebrow="TCGDex tooling"
            title="Tools built for the TCGDex ecosystem"
            description="Extraction, ingestion, and image tooling built to maintain the TCGDex dataset and map card data across sources. Free and open to use."
          />
          {tcgdexTools.map((p) => (
            <ProjectRow key={p.title} p={p} />
          ))}
        </div>
      </section>

      <div className="hr" />

      {/* CTA */}
      <section style={{ padding: "80px 0" }}>
        <div className="wrap">
          <div style={{ maxWidth: 520 }}>
            <h2 className="display" style={{ fontSize: "clamp(26px, 3.5vw, 40px)", color: "var(--text)", marginBottom: 16 }}>
              Got a project in mind?
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.65, marginBottom: 32 }}>
              We take on a small number of new projects each year. If what you&apos;re building
              sounds like a good fit, let&apos;s talk.
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