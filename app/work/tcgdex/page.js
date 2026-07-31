// app/work/tcgdex/page.js
import CaseStudy from "@/app/components/CaseStudy";

export const metadata = {
  title: "TCGDex — SixByFive Studio",
  description: "How SixByFive contributes to and maintains TCGDex, the open-source multilingual Pokémon TCG API.",
};

const data = {
  title: "TCGDex",
  tagline: "A multilingual, community-driven Pokémon TCG API and dataset — open source, actively maintained.",
  type: "Open Source",
  role: "Maintainer",
  status: "Active",
  year: "Early 2026–present",
  externalHref: "https://tcgdex.dev",
  externalLabel: "tcgdex.dev ↗",

  problem: [
    "The Pokémon TCG has thousands of cards across hundreds of sets, released in multiple languages simultaneously. Collectors, developers, and platform builders all need reliable structured access to this data — set names, card numbers, rarities, variant types, localised text, and card images.",
    "Most available data sources are either unofficial scrapes that drift out of date, official APIs locked behind commercial terms, or one-language-only with no internationalisation. TCGDex exists to solve this: a community-maintained, open dataset with a well-structured API that anyone can query or contribute to.",
    "When we started building the SixByFive TCG platform, we needed a trusted data source as our foundation. We became active maintainers of TCGDex rather than building our own parallel dataset — contributing back to something the wider community uses rather than duplicating the effort in private.",
  ],

  approach: {
    body: [
      "Our involvement with TCGDex is structured around the parts of the project that intersect most directly with what the TCG platform needs: data accuracy, image availability, and the tooling that makes it practical to keep the dataset current as new sets release.",
      "Rather than treating TCGDex purely as a dependency, we contribute fixes and improvements upstream. This means the quality work we do on our own platform feeds back into the open-source project — and any improvements the wider community makes flow back to us.",
    ],
    decisions: [
      "Maintain rather than fork — keeping data centralised and contributions public benefits everyone in the ecosystem",
      "Build the image pipeline as a distinct owned system — TCGDex provides the data schema, we provide the image storage and serving layer",
      "Contribute schema improvements upstream when we encounter modelling gaps on the platform",
      "Open contributor tooling so the community can add new sets without requiring direct maintainer involvement for every card",
    ],
  },

  built: {
    body: [
      "Our primary contribution to TCGDex is the image intake and processing pipeline — the system by which card images are submitted, validated, canonically named, and promoted to the live image store that the API and platforms like ours serve from.",
    ],
    items: [
      "Card image intake tool — validates filenames, extracts card numbers, supports single-set, symbol-only, and batch multi-set zip uploads",
      "Canonical naming and storage — images are renamed to a deterministic path keyed by set code and card number, making them reliably addressable",
      "Format and resolution validation — rejects images that don't meet quality thresholds before they enter the review queue",
      "Visual review queue — staging layer where submitted images are held for QA before promotion to the live store (Vision Lab)",
      "Contributions to data schema — variant modelling improvements, set structure clarifications, rarity normalisation",
      "Set ingestion tooling — workflows for adding newly released sets to the dataset with correct structure from day one",
    ],
    note: "TCGDex is open source. The dataset, API, and SDKs are publicly available at tcgdex.dev. Our image pipeline is the piece we operate directly.",
  },

  whatWasHard: [
    {
      title: "Canonical identity across sources",
      body: "The same card exists under different IDs on Cardmarket, TCGPlayer, and in the TCGDex dataset. Resolving these into a single canonical identifier — and keeping that mapping accurate as Cardmarket introduces new variant buckets and TCGPlayer splits or merges products — is the central hard problem. A wrong mapping means a card on the platform shows the wrong price, the wrong image, or doesn't appear in search at all.",
    },
    {
      title: "Variant complexity",
      body: "Modern Pokémon TCG sets increasingly include variant printings of the same card: foil patterns (Poké Ball, Master Ball, Energy Symbol), reverse holofoils, and promotional stamps. Each variant needs its own image, its own price, and its own ID mapping to Cardmarket and TCGPlayer. The data model has to handle this without flattening variants into a single card entry or losing the distinction between them.",
    },
    {
      title: "Image quality at scale",
      body: "Card image submissions come from contributors with widely varying setups — scans, photographs, official press images — at different resolutions and in different formats. The intake pipeline needs to validate these consistently, provide clear error messages when something is wrong, and never silently accept a bad image that would end up served to users.",
    },
    {
      title: "Keeping the dataset current",
      body: "New Pokémon sets release roughly every three months, often with a pre-release window that creates a spike of contributor activity. The ingestion tooling needs to make it practical for contributors to add new sets correctly — with the right structure, right card numbers, and right variant relationships — without a maintainer manually reviewing every entry.",
    },
  ],

  stack: [
    { label: "API",       value: "REST · TypeScript SDKs in multiple languages" },
    { label: "Dataset",   value: "Community-maintained · JSON · git-based contributions" },
    { label: "Images",    value: "Cloud storage · canonical path structure · our pipeline" },
    { label: "Intake",    value: "Next.js upload tool · fflate zip parsing · validation layer" },
    { label: "Review",    value: "Vision Lab (internal) · staging before promotion" },
  ],

  outcomes: [
    "Active maintainership of a widely-used open-source Pokémon TCG API",
    "Image pipeline handling card images for the TCGDex dataset and the TCG platform",
    "Contributor tooling that makes adding new sets practical without maintainer bottlenecks",
    "API consumed by the SixByFive TCG platform and third-party projects in the community",
    "Data quality improvements feeding back to all consumers of the dataset",
  ],

  nextProject: { href: "/work/tcg-platform", title: "SixByFive TCG Platform" },
};

export default function Page() {
  return <CaseStudy data={data} />;
}