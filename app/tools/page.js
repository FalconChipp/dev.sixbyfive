// app/tools/page.js — Tools index

import Link from "next/link";

export const metadata = {
  title: "Tools — SixByFive Studio",
  description: "Free browser tools and scripts built by SixByFive for Pokémon TCG data workflows.",
};

const tools = [
  {
    href: "/tools/bulk-edit",
    title: "Bulk Edit UI",
    tag: "Browser tool",
    status: "Free",
    summary: "Multi-source variant editor for Pokémon card product IDs.",
    description: "Upload Cardmarket and TCGPlayer export JSONs, merge them by card ID, then edit variant rows — type, foil, stamp, and IDs from both sources. Generates a stable code block ready for your metadata files. Built to handle edge cases: patterned foils, unknown additionals, holo-only cards, and base-locked variants.",
    features: [
      "Merges Cardmarket and TCGPlayer exports by canonical card ID",
      "Auto-assigns IDs to variants based on printing data",
      "Handles pokeball, masterball, energy, and other foil patterns",
      "Preserves unresolved additionals as explicit unknown rows",
      "Generates a formatted variants[] code block",
      "Persists edits in localStorage across sessions",
    ],
    built: "For the SixByFive TCG platform's card metadata workflow.",
  },
  {
    href: "/tools/cardmarket-exporter",
    title: "Cardmarket Exporter",
    tag: "Tampermonkey script",
    status: "Free",
    summary: "Paginate and export Cardmarket product IDs for any Pokémon set.",
    description: "A Tampermonkey userscript that injects into Cardmarket Singles set listing pages. It collects product IDs as you paginate, merging base and additional/variant bucket listings into a single JSON keyed by canonical card ID. Handles cross-slug merging so base and variant pages reconcile correctly.",
    features: [
      "Auto-detects set slug and bucket (base vs additionals)",
      "Persists collected data in localStorage across page loads",
      "Merges paginated results by derived group key",
      "Exports clean JSON for direct ingestion or use in Bulk Edit",
      "Handles Cardmarket&apos;s layout changes (2025+ grid and legacy rows)",
      "Includes variant name and label extraction",
    ],
    built: "For populating the Cardmarket product ID layer in the TCG platform.",
  },
  {
    href: "/tools/tcgplayer-exporter",
    title: "TCGPlayer Set Exporter",
    tag: "Browser tool",
    status: "Free",
    summary: "Fetch TCGPlayer product IDs and variant data for any Pokémon set.",
    description: "Uses TCGCSV — a free, no-auth, daily-updated mirror of TCGPlayer's API — to fetch every product for a set, including variant patterns (Poké Ball, Energy Symbol) and all printing subtypes (Normal, Holofoil, Reverse Holofoil). Browse all sets, adjust the set code, filter by variant type, and export JSON compatible with the Bulk Edit UI.",
    features: [
      "Browses all Pokémon sets from TCGPlayer via TCGCSV",
      "Shows every productId per card including variant patterns",
      "Includes printing subtypes and market prices per product",
      "Adjustable set code for canonical ID generation",
      "Filter by multi-product cards or holo/reverse holo",
      "Exports JSON keyed by SETCODE-NNN, ready for Bulk Edit",
    ],
    built: "For the TCGPlayer product ID layer in the TCG platform.",
  },
  {
    href: "/tools/image-intake",
    title: "Card Image Intake",
    tag: "Upload tool",
    status: "Internal",
    summary: "Upload, validate, and canonically rename card image zips for storage.",
    description: "Accepts a zip of card images, validates filenames, extracts card numbers, and uploads files to storage under a canonical path. Supports single-set mode with optional strict card number checking, symbol-only uploads, and batch multi-set mode where the zip contains one folder per set code.",
    features: [
      "Auto-detects mode: single set, symbol-only, or multi-set batch",
      "Strict mode: validates zip contents against declared card numbers",
      "Auto mode: resolves card numbers from filenames",
      "Supports .png, .jpg, .jpeg, .webp",
      "Uploads to structured cloud storage path",
      "Detailed error output for mismatches and duplicates",
    ],
    built: "For the TCGDex image pipeline backing the TCG platform.",
  },
];

export default function ToolsPage() {
  return (
    <>
      {/* Header */}
      <section style={{ padding: "72px 0 64px" }}>
        <div className="wrap">
          <Link href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-4)", textDecoration: "none", letterSpacing: "0.08em", display: "inline-block", marginBottom: 40 }}>
            ← SixByFive
          </Link>
          <span className="eyebrow" style={{ display: "block", marginBottom: 16 }}>Tooling</span>
          <h1 className="display" style={{ fontSize: "clamp(36px, 5vw, 58px)", color: "var(--text)", maxWidth: 640, marginBottom: 20 }}>
            The systems behind the systems
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-2)", maxWidth: 520, lineHeight: 1.65 }}>
            Tools built for our own data workflows — open for anyone to use.
            These came out of real problems on the TCG platform: getting product IDs from Cardmarket
            and TCGPlayer into a form we could actually trust.
          </p>
        </div>
      </section>

      <div className="hr" />

      {/* Tool list */}
      {tools.map((t, i) => (
        <div key={t.href}>
          <section style={{ padding: "72px 0" }}>
            <div className="wrap">
              <div className="section-grid">
                {/* Left */}
                <div style={{ paddingTop: 4 }}>
                  <span className="pill" style={{ display: "inline-flex", marginBottom: 10 }}>{t.tag}</span>
                  <div>
                    <span className={`pill ${t.status === "Free" ? "pill-live" : ""}`} style={{ display: "inline-flex" }}>
                      {t.status}
                    </span>
                  </div>
                </div>

                {/* Right */}
                <div>
                  <h2 className="display" style={{ fontSize: "clamp(22px, 3vw, 32px)", color: "var(--text)", marginBottom: 8 }}>
                    {t.title}
                  </h2>
                  <p style={{ fontSize: 15, fontStyle: "italic", fontFamily: "var(--font-display)", color: "var(--accent-text)", marginBottom: 20 }}>
                    {t.summary}
                  </p>
                  <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7, maxWidth: 560, marginBottom: 36 }}>
                    {t.description}
                  </p>

                  {/* Features */}
                  <div style={{ marginBottom: 36 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-4)", display: "block", marginBottom: 16 }}>
                      What it does
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      {t.features.map((f) => (
                        <div key={f} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <span style={{ color: "var(--accent)", fontSize: 14, lineHeight: "20px", flexShrink: 0 }}>—</span>
                          <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: f }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Built for */}
                  <div style={{ padding: "14px 18px", borderLeft: "2px solid var(--border-2)", marginBottom: 32 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-4)", letterSpacing: "0.06em" }}>
                      Built for: {t.built}
                    </span>
                  </div>

                  <Link href={t.href} className="btn btn-primary">Open tool →</Link>
                </div>
              </div>
            </div>
          </section>
          {i < tools.length - 1 && <div className="hr" />}
        </div>
      ))}

      <div className="hr" />

      {/* Footer note */}
      <section style={{ padding: "72px 0" }}>
        <div className="wrap">
          <div style={{ maxWidth: 560 }}>
            <h2 className="display" style={{ fontSize: "clamp(22px, 2.8vw, 30px)", color: "var(--text)", marginBottom: 16 }}>
              Need something built?
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.65, marginBottom: 32 }}>
              These tools exist because we needed them. If you&apos;re facing a data or workflow
              problem that needs a proper solution — not a one-off script — that&apos;s what we do.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="https://uk.linkedin.com/company/sixbyfive" target="_blank" rel="noreferrer" className="btn btn-primary">Get in touch ↗</a>
              <Link href="/work" className="btn btn-secondary">See what we&apos;ve built</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}