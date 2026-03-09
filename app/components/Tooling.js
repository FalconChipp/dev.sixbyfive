// app/components/Tooling.js
//
// UPDATED (FULL FILE):
// - Keeps your existing tooling cards + tone
// - For the "Extraction" card, replaces single CTA with TWO CTAs:
//    1) Script page: /tools/cardmarket-exporter
//    2) UI page:     /tools/bulk-edit
// - Leaves all other cards unchanged (still uses their single CTA if provided)
// - No new components/deps, still uses your Card/Badge/Button
//
// NOTE:
// - This assumes your Button supports href + variant + className (as used elsewhere).
// - If your Button doesn't support variant="primary", switch it to "secondary" and use className for emphasis.

import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

const tools = [
  {
    badge: "Data",
    title: "Pricing + metadata pipeline",
    desc:
      "Scheduled ingestion, caching, and rollups to keep card data consistent across sources and reduce API load.",
    bullets: [
      "Daily/weekly rollups and “latest” tables",
      "FX conversion and provider normalization",
      "Integrity checks + backfills",
    ],
    cta: { label: "See TCG platform →", href: "https://tcg.sixbyfive.com" },
  },
  {
    badge: "Extraction",
    title: "Cardmarket browser extraction tooling",
    desc:
      "A browser-based export tool used to extract and merge Cardmarket product IDs across paginated set listings — designed for fast reconciliation and fewer mapping errors.",
    bullets: [
      "Delivered as a Tampermonkey userscript",
      "Handles pagination + merges base/variant buckets",
      "Exports clean ID maps for ingestion/QA",
    ],

    // CHANGED:
    // - Instead of a single CTA, this card gets TWO buttons.
    // - We keep `cta` out for this one and use `ctas` instead.
    ctas: [
      { label: "Get exporter script →", href: "/tools/cardmarket-exporter", variant: "primary" },
      { label: "Open Bulk Edit UI →", href: "/tools/bulk-edit", variant: "secondary" },
    ],
  },
  {
    badge: "Admin",
    title: "Bulk add + workflow UIs",
    desc:
      "Collector-first admin views that accelerate catalogue and collection operations without breaking data integrity.",
    bullets: [
      "Bulk add flows with validation",
      "Moderation + marketplace workflows",
      "Audit-friendly entry histories",
    ],
    cta: { label: "Capabilities →", href: "#services" },
  },
  {
    badge: "Ops",
    title: "Monitoring + error logging",
    desc:
      "Guardrails and visibility so background jobs and integrations can be trusted long-term.",
    bullets: [
      "Job retries and failure reporting",
      "Upload + email error tracking",
      "Actionable logs (not guesswork)",
    ],
    // cta: { label: "Contact →", href: "#contact" }
  },
  {
    badge: "Extraction",
    title: "TCGPlayer product ID exporter",
    desc:
      "An API-powered tool that fetches all TCGPlayer productIds for a Pokémon set — including variant patterns (Poké Ball, Energy Symbol) and printing subtypes (Normal, Holofoil, Reverse Holo).",
    bullets: [
      "Fetches from TCGCSV (free TCGPlayer API mirror)",
      "Shows every productId per card + variant pattern",
      "Exports JSON compatible with the Bulk Edit UI",
    ],
    cta: { label: "Open TCGPlayer exporter →", href: "/tools/tcgplayer-exporter" },
  },
];

export default function Tooling() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tools.map((t) => (
        <Card key={t.title} className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge>{t.badge}</Badge>
              <h3 className="mt-3 text-[16px] md:text-[18px] font-semibold text-white">
                {t.title}
              </h3>
            </div>
          </div>

          <p className="mt-3 text-[13px] leading-relaxed text-muted">{t.desc}</p>

          <ul className="mt-5 space-y-2 text-[12px] text-white/80">
            {t.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white/35" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {/* CHANGED: If a tool has `ctas`, render both buttons */}
          {Array.isArray(t.ctas) && t.ctas.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {t.ctas.map((c) => (
                <Button
                  key={c.href}
                  href={c.href}
                  variant={c.variant || "secondary"}
                >
                  {c.label}
                </Button>
              ))}
            </div>
          ) : t.cta?.href ? (
            <div className="mt-6">
              <Button href={t.cta.href} variant="secondary">
                {t.cta.label}
              </Button>
            </div>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
