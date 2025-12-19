// app/page.js
// Simple studio overview: what you run, what you’re good at, and a nod to the tools.

import ToolCard from "./components/ToolCards";

const platforms = [
  {
    href: "https://tcg.sixbyfive.com",
    name: "SixByFive TCG",
    tagline:
      "Web and mobile platform for tracking Pokémon collections, viewing UK-focused pricing, and (soon) trading and marketplace features.",
    kind: "Platform",
    meta: ["Next.js", "Custom backend", "GraphQL"]
  },
  {
    href: "https://3dprinting.sixbyfive.com",
    name: "3D Printing Studio",
    tagline:
      "Quote and job management for custom 3D printed parts, aimed at hobbyists and small-batch work.",
    kind: "Product",
    meta: ["3D printing", "Quoting flow"]
  }
];

const tools = [
  {
    href: "/tools/cardmarket-merge-exporter",
    name: "Cardmarket Set Merge Exporter",
    tagline:
      "Userscript to merge Cardmarket base + additional buckets into a single canonical map keyed by set + collector number.",
    kind: "Tooling",
    meta: ["Userscript", "Cardmarket"]
  },
  {
    href: "/tools/variant-mapper",
    name: "Variant Mapper",
    tagline:
      "Browser tool that turns those exports into variants[] blocks for card metadata.",
    kind: "Tooling",
    meta: ["Frontend", "Metadata"]
  },
  {
    href: "/tools/crosscheck-cardmarket-sources",
    name: "Crosscheck CLI",
    tagline:
      "CLI to compare Cardmarket HTML, CSV, and internal IDs so issues show up in a report, not in production.",
    kind: "Tooling",
    meta: ["Node.js", "Data quality"]
  }
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.25em] text-sbf-textMuted">
          SixByFive · Studio
        </p>
        <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
          I build and run{" "}
          <span className="text-sbf-accent">real products and tooling</span>{" "}
          around trading cards and 3D printing.
        </h1>
        <p className="max-w-xl text-[14px] text-sbf-textMuted">
          This page is a quick snapshot of what&apos;s live today – platforms,
          smaller products, and some of the internal tools that keep everything
          working.
        </p>
      </section>

      {/* PLATFORMS / PRODUCTS */}
      <section className="space-y-3">
        <h2 className="text-[15px] font-semibold">Platforms &amp; products</h2>
        <p className="text-[13px] text-sbf-textMuted">
          Things that are live, used, and still evolving.
        </p>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {platforms.map((item) => (
            <ToolCard key={item.name} item={item} />
          ))}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="space-y-3">
        <h2 className="text-[15px] font-semibold">What I&apos;m comfortable with</h2>
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-sbf-border bg-sbf-bgElevated px-4 py-3 text-[13px] text-sbf-textMuted">
            <p className="mb-1 font-medium text-sbf-text">Product &amp; stack</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Next.js, React, Node, GraphQL / REST APIs.</li>
              <li>Designing data models and background jobs.</li>
              <li>Taking ideas from “sketch” to something people can click.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-sbf-border bg-sbf-bgElevated px-4 py-3 text-[13px] text-sbf-textMuted">
            <p className="mb-1 font-medium text-sbf-text">Problem spaces</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Trading card metadata, pricing, and marketplaces.</li>
              <li>3D printing workflows and quoting.</li>
              <li>Glue work: Discord bots, WordPress / Shopify bridges, etc.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* OPEN TOOLING */}
      <section className="space-y-3">
        <h2 className="text-[15px] font-semibold">Open tools</h2>
        <p className="text-[13px] text-sbf-textMuted">
          A few of the utilities I use day-to-day that also happen to be handy
          for other developers working with Cardmarket or similar data.
        </p>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {tools.map((item) => (
            <ToolCard key={item.name} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
