// app/work/set-ingestion/page.js
import CaseStudy from "@/app/components/CaseStudy";

export const metadata = {
  title: "Set Ingestion Backend — SixByFive Studio",
  description: "The backend pipeline for bringing new Pokémon TCG sets into the platform — parsing, normalising, resolving variants, and triggering downstream jobs.",
};

const data = {
  title: "Set Ingestion Backend",
  tagline: "The pipeline that turns raw set data into a live, priced, searchable catalogue entry — reliably, every release.",
  type: "Internal tool",
  role: "Built & maintained",
  status: "Active",
  year: "2024–present",

  problem: [
    "Pokémon TCG sets release roughly every three months. Each new set means hundreds of cards, each with multiple variants, need to be ingested into the platform — structured, normalised, mapped to their Cardmarket and TCGPlayer product IDs, and priced — before they can appear in search and be added to collections.",
    "Done manually, this is a significant operational task. Done with an ad-hoc script per release, it accumulates inconsistency. The set ingestion backend makes it a defined, repeatable pipeline: structured input in, verified platform records out, with the right checks at each stage to catch problems before they reach users.",
    "The pipeline also handles updates — corrections to card data, variant mapping fixes, price re-pulls — not just initial ingestion. It needs to be safe to re-run on a set that's already live, applying updates without disrupting what's already there.",
  ],

  approach: {
    body: [
      "The pipeline is structured as a sequence of stages, each with a clear input contract and a defined output. A failure at any stage stops the pipeline there — no partial ingestion that leaves the database in an inconsistent state.",
      "We separated the pipeline into two modes: automated ingestion for straightforward cases (where the source data is clean and the variant mapping is unambiguous) and supervised ingestion for cases that need a maintainer to review and confirm before proceeding. The admin dashboard's ingestion review queue is the interface for the supervised path.",
    ],
    decisions: [
      "Pipeline stages with hard stops — a validation failure halts ingestion rather than continuing with bad data",
      "Idempotent operations — every stage can be re-run safely, applying updates without duplicating records",
      "Supervised mode for ambiguous cases — pipeline pauses and surfaces to a reviewer rather than guessing",
      "TCGDex as the authoritative card data source — set structure, card entries, and localised text all come from there",
      "Variant resolution as an explicit stage — Cardmarket and TCGPlayer ID assignment happens after card records exist, not interleaved with creation",
      "Downstream triggers after successful ingestion — pricing jobs, search index updates, and cache invalidation all happen as a consequence of a completed ingestion",
    ],
  },

  built: {
    body: [
      "The pipeline covers the full journey from raw set data to live platform record. Each stage is independently testable and has structured logging so failures are diagnosable.",
    ],
    items: [
      "Set data parsing — ingests structured set data from TCGDex including card entries, series, legality, and localised names",
      "Normalisation layer — applies consistent casing, handles encoding issues, strips whitespace, resolves aliases",
      "Card record creation — creates or updates card entries with correct set membership, numbers, and variant relationships",
      "Variant resolution — attaches Cardmarket and TCGPlayer product IDs from the extraction tooling output",
      "Validation stage — checks referential integrity, confirms expected card count, flags cards with missing variant mappings",
      "Supervised review gate — pauses pipeline for maintainer review when validation finds issues or the set is flagged for manual check",
      "Pricing job trigger — once ingestion completes, kicks off the initial price pull for the new set",
      "Search index update — new cards become searchable immediately after successful ingestion",
      "Ingestion history — full record of every ingestion run, its outcome, and any issues encountered",
    ],
  },

  whatWasHard: [
    {
      title: "Variant resolution at scale",
      body: "The hardest part of ingesting a new set is correctly assigning Cardmarket and TCGPlayer product IDs to each card variant. The extraction tooling produces JSON keyed by canonical card ID, but the canonical IDs need to match exactly what the pipeline creates during card record creation. Any mismatch means a variant ends up with no price source. Getting the canonical ID generation consistent across the ingestion pipeline and the extraction tools required careful alignment — they're separate codebases that need to agree on the same normalisation rules.",
    },
    {
      title: "Idempotency with mutable data",
      body: "Re-running ingestion on a set that's already live needs to apply corrections without creating duplicates or overwriting fields that were manually corrected in the admin dashboard. This means the pipeline needs to distinguish between 'this field came from ingestion and should be updated' and 'this field was manually corrected and should be preserved'. Implementing that distinction — essentially a per-field provenance system — was more complex than it sounds when you're dealing with hundreds of fields across hundreds of cards.",
    },
    {
      title: "The supervised mode interface",
      body: "When the pipeline pauses for review, the reviewer needs to see exactly what the pipeline found and what it's asking them to decide. The first version of the review queue showed the raw validation output — a list of issues in pipeline log format. That was accurate but required significant domain knowledge to interpret. The admin dashboard's ingestion review view replaced this with a structured display of exactly the cards and variants that need attention, with the specific issue clearly labelled and the available actions obvious.",
    },
    {
      title: "Downstream coordination",
      body: "A successful ingestion needs to trigger several downstream jobs: price pulls, search index updates, cache invalidation. These jobs shouldn't run if ingestion failed or is paused for review. Getting the trigger logic right — fire and forget is wrong, but synchronous waiting is also wrong for jobs that take time — required a simple job queue with status tracking, rather than chained pipeline steps.",
    },
  ],

  stack: [
    { label: "Runtime",     value: "Node.js · async pipeline stages" },
    { label: "Data source", value: "TCGDex API · extraction tool JSON output" },
    { label: "Database",    value: "PostgreSQL · upsert patterns · provenance fields" },
    { label: "Queue",       value: "Job queue for downstream triggers" },
    { label: "Logging",     value: "Structured per-stage logging · ingestion history table" },
    { label: "Interface",   value: "Admin dashboard — supervised review and status monitoring" },
  ],

  outcomes: [
    "New sets go from raw data to live platform in a single pipeline run for clean cases",
    "Ambiguous cases surface to review rather than proceeding with bad data",
    "Re-ingestion is safe — corrections apply without duplicating records or overwriting manual fixes",
    "Downstream jobs (pricing, search) trigger automatically on successful completion",
    "Full ingestion history allows any run to be investigated if something goes wrong later",
  ],

  note: "This is internal tooling — not publicly accessible. It's included here because the problems it solves are representative of the kind of engineering that makes a data-heavy platform reliable at scale.",
};

export default function Page() {
  return <CaseStudy data={data} />;
}