// app/work/tcg-platform/page.js
import CaseStudy from "../../../components/CaseStudy";

export const metadata = {
  title: "SixByFive TCG Platform — SixByFive Studio",
  description: "How we built a collector-first Pokémon TCG platform handling complex data, multi-source pricing, and daily automated ingestion.",
};

const data = {
  title: "SixByFive TCG Platform",
  tagline: "A collector-first platform for the Pokémon TCG secondary market — search, collect, price, and build.",
  type: "Product",
  role: "Built & maintained",
  status: "Live",
  year: "2023–present",
  externalHref: "https://tcg.sixbyfive.com",
  externalLabel: "View platform ↗",

  problem: [
    "The Pokémon TCG secondary market is data-heavy in a way most platforms underestimate. A single set can contain hundreds of cards, each with multiple printings — normal, reverse holofoil, holo, and foil pattern variants. Each variant has its own product ID on Cardmarket, a separate product ID on TCGPlayer, and a price that updates daily. Getting all of this right, consistently, is the core problem.",
    "Existing platforms either flatten this complexity away (treating all variants of a card as one entry) or expose raw data without making it usable for collectors. Neither serves someone trying to value their collection accurately or find a specific variant to complete a set.",
    "We built the TCG platform to handle this properly — with a data model that represents variants correctly, a pricing layer that reconciles multiple sources, and a user experience designed around how collectors actually think about their cards.",
  ],

  approach: {
    body: [
      "The architecture decision that shaped everything else was treating Cardmarket and TCGPlayer as parallel data sources rather than having one be authoritative. Both have gaps: Cardmarket has better coverage of the European market and older sets; TCGPlayer has more granular variant and printing data. The platform needs both.",
      "Rather than scraping, we built structured extraction tooling — a Tampermonkey userscript for Cardmarket's paginated listings and a TCGCSV-based exporter for TCGPlayer — that produces clean JSON we can ingest. This gives us control over the data shape and means we can re-run ingestion as either source updates.",
      "The pricing pipeline runs on a schedule, pulling updated prices, applying FX conversion, and rolling up to the per-variant level the platform serves. All of this happens in the background — users see current prices without knowing the machinery underneath.",
    ],
    decisions: [
      "Use TCGDex as the canonical card data source — contributing improvements back rather than forking privately",
      "Model variants explicitly — each printing gets its own row, not a field on the base card",
      "Build extraction tooling rather than scraping — structured output is more reliable than brittle HTML parsing",
      "GraphQL API — the frontend queries exactly what it needs, which matters when a card can have many nested variant and pricing fields",
      "Separate the ingestion pipeline from the serving layer — background jobs update data independently of user-facing queries",
    ],
  },

  built: {
    body: [
      "The platform has three main surfaces: public-facing search and browse, a collection tracker, and the binder builder. Behind all of these sits the data layer — ingestion, pricing, and variant management.",
    ],
    items: [
      "Full-text and filtered search across sets, cards, variants, and rarities",
      "Collection tracker — add cards by variant, track quantities, see portfolio valuation",
      "Binder builder — organise a collection visually, shareable as a public view",
      "Multi-source pricing — Cardmarket and TCGPlayer prices aligned per variant, updated daily",
      "Automated ingestion pipeline — new set data flows in from TCGDex and extraction tooling",
      "FX conversion — prices normalised to the user's currency with daily rate updates",
      "Admin dashboard — internal tool for managing the catalogue, reviewing ingestion, auditing prices",
      "Monitoring and error alerting — background jobs have visibility, failures surface immediately",
    ],
  },

  whatWasHard: [
    {
      title: "The variant mapping problem",
      body: "Cardmarket and TCGPlayer don't agree on how to identify variants. Cardmarket uses product IDs that map to a base listing plus additional listings for variants. TCGPlayer uses separate productIds per variant pattern, with printing subtypes (Normal, Holofoil, Reverse Holofoil) as sub-entries under each product. Reconciling these into a single canonical variant — so that the Cardmarket price and TCGPlayer price for 'Erika's Oddish Poké Ball pattern' point to the same record — required building explicit mapping tooling and handling a long tail of edge cases (foil pattern names that differ between sources, holo cards that Cardmarket treats as base but TCGPlayer splits, sets where the numbering doesn't align).",
    },
    {
      title: "Pricing at variant granularity",
      body: "Most pricing systems aggregate to the card level. The TCG platform needs prices at the variant level — a Poké Ball pattern reverse holofoil is worth significantly more than the base card from the same set, and a collector tracking their collection needs to know the difference. Building the rollup logic to aggregate variant prices to card level (for display) while preserving the per-variant prices (for valuation) without creating consistency bugs took careful data modelling.",
    },
    {
      title: "Keeping data current as sets release",
      body: "New sets release every few months and immediately generate pricing activity as the market discovers which cards are valuable. The ingestion pipeline needs to handle a new set arriving — structured data from TCGDex, product IDs from the extraction tools, initial prices from both sources — and get it into the platform quickly without corrupting existing data. This is a coordination problem as much as an engineering one.",
    },
    {
      title: "Search that works for collectors",
      body: "Collector search patterns don't map cleanly to standard full-text search. Someone might search for 'Charizard alt art SV' meaning a specific illustration rare from a Scarlet & Violet era set. Building search that handles set era shorthand, card name aliases, and variant type filtering without requiring exact terminology was an iterative problem with a lot of user-mental-model work.",
    },
  ],

  stack: [
    { label: "Frontend",   value: "Next.js · React · Tailwind CSS" },
    { label: "API",        value: "GraphQL · Node.js · Apollo" },
    { label: "Database",   value: "PostgreSQL · structured variant schema" },
    { label: "Pipelines",  value: "Cron jobs · Node.js workers · scheduled ingestion" },
    { label: "Pricing",    value: "Cardmarket + TCGPlayer sources · FX layer · daily rollups" },
    { label: "Card data",  value: "TCGDex API · community dataset" },
    { label: "Ops",        value: "Error logging · job monitoring · alerting" },
  ],

  outcomes: [
    "Live platform handling search, collection tracking, and pricing for Pokémon TCG collectors",
    "Multi-source pricing pipeline reconciling Cardmarket and TCGPlayer at variant granularity",
    "Automated daily ingestion keeping prices and card data current",
    "Internal admin tooling giving full operational visibility without direct database access",
    "Foundation that scales to new sets without manual intervention per release",
  ],

  nextProject: { href: "/work/3d-printing-portal", title: "3D Printing Portal" },
};

export default function Page() {
  return <CaseStudy data={data} />;
}