// app/work/admin-dashboard/page.js
import CaseStudy from "@/app/components/CaseStudy";

export const metadata = {
  title: "TCG Admin Dashboard — SixByFive Studio",
  description: "Internal operations dashboard for managing the SixByFive TCG platform — catalogue, pricing, ingestion, and moderation.",
};

const data = {
  title: "TCG Admin Dashboard",
  tagline: "Full operational visibility into the TCG platform — without touching the database.",
  type: "Internal tool",
  role: "Built & maintained",
  status: "Active",
  year: "2024–present",

  problem: [
    "Running a data-heavy platform like the TCG marketplace means needing to intervene regularly: a set ingestion needs a manual review, a card's variant mapping is wrong, a price hasn't updated as expected, a user reports a data issue. Without tooling, every one of these means opening a database client and writing SQL.",
    "That works when it's occasional. It doesn't work when new Pokémon sets release every few months and each one requires reviewing hundreds of cards, validating variant mappings, and checking that prices attached correctly. And it creates risk — direct database access with no guardrails means a mistake is a production mistake.",
    "The admin dashboard replaces direct database access for all routine operational tasks. Anything that needs doing regularly has a UI. Anything that's high-risk has a confirmation step and an audit trail.",
  ],

  approach: {
    body: [
      "We designed the dashboard around operational tasks rather than data tables. The instinct with internal tools is often to expose the database schema directly — show a table, let the operator edit rows. That's fast to build and deeply unpleasant to use.",
      "Instead, we mapped the actual tasks operators perform: reviewing a newly ingested set, correcting a variant mapping, investigating a pricing anomaly, moderating user-submitted content. Each of these got a purpose-built view that shows exactly what's needed for that task and provides the right actions — not a generic CRUD interface.",
    ],
    decisions: [
      "Task-oriented views rather than table views — operators see what they need for a specific job, not raw data",
      "Audit log on all mutations — every change records who made it, when, and what changed",
      "Confirmation flows for high-risk actions — bulk operations and deletions require an explicit confirm step",
      "Read-only views for investigation — operators can dig into data without risk of accidental mutation",
      "Status indicators for pipeline health — ingestion jobs and pricing runs surface their current state prominently",
    ],
  },

  built: {
    items: [
      "Set catalogue view — browse all sets and series, with status indicators showing ingestion and pricing state",
      "Card management — search, view, and edit card entries and variant mappings",
      "Variant mapping editor — correct Cardmarket and TCGPlayer ID assignments per card variant",
      "Pricing audit view — see current prices per variant, compare against source data, flag anomalies",
      "Ingestion review queue — sets that need manual review before going live, with diff view showing what's changed",
      "User activity overview — recent activity, collection sizes, binder views",
      "Moderation queue — flagged content and user-reported data issues",
      "Pipeline status panel — current state of scheduled jobs, last run times, failure alerts",
      "Bulk operations — mark multiple cards as reviewed, trigger price re-pulls for a set, batch-update status",
    ],
    note: "Not publicly accessible — this is the operational layer that makes it practical to run the TCG platform without a developer present for routine tasks.",
  },

  whatWasHard: [
    {
      title: "Making variant mapping usable",
      body: "The core operational task in the dashboard is assigning the correct Cardmarket and TCGPlayer IDs to card variants. The data is complex — a single card might have a base entry, a Poké Ball pattern, a Master Ball pattern, and a reverse holofoil, each mapping to different product IDs on both sources, some of which TCGPlayer incorrectly labels. Building a UI that makes this tractable — showing what's already assigned, surfacing likely matches, flagging conflicts — took several iterations. The Bulk Edit UI (available publicly as a free tool) came out of this work.",
    },
    {
      title: "Pipeline visibility without noise",
      body: "Background jobs run constantly: pricing updates, ingestion checks, integrity scans. Surfacing their status in the dashboard without creating an overwhelming wall of logs required thinking carefully about what an operator actually needs to see. The answer was status indicators (healthy/warning/failed) with drill-down rather than a firehose — you see at a glance whether something needs attention, and can investigate if it does.",
    },
    {
      title: "Audit trail that's actually useful",
      body: "Every mutation in the dashboard writes an audit record. The challenge was making those records useful for investigation rather than just compliance. When a price is wrong, you want to be able to trace back through when it changed, what triggered the change, and what the value was before — without that being a complex query. Building the audit log schema to support these investigative queries upfront saved significant time later.",
    },
  ],

  stack: [
    { label: "Frontend",  value: "Next.js · React · Tailwind CSS" },
    { label: "API",       value: "GraphQL — shared with public platform" },
    { label: "Auth",      value: "Role-based · admin-only routes" },
    { label: "Database",  value: "PostgreSQL · audit log schema" },
    { label: "Pipelines", value: "Job status polling · webhook receivers" },
  ],

  outcomes: [
    "Routine platform operations handled without database access",
    "Variant mapping corrections take minutes rather than requiring a developer",
    "Full audit trail on all operational mutations",
    "Pipeline health visible at a glance — issues surface before they become user-facing problems",
    "New set releases reviewable and publishable without engineering involvement",
  ],

  nextProject: { href: "/work/vision-lab", title: "Vision Lab" },
};

export default function Page() {
  return <CaseStudy data={data} />;
}