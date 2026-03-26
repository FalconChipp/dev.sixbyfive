// app/work/vision-lab/page.js — updated: AI training pipeline for card recognition
import CaseStudy from "../../../components/CaseStudy";

export const metadata = {
  title: "Vision Lab — SixByFive Studio",
  description: "AI training data pipeline for Pokémon card recognition — collecting, curating, and labelling card images to train a visual identification model.",
};

const data = {
  title: "Vision Lab",
  tagline: "The data pipeline behind a card recognition model — collecting, curating, and labelling training images at scale.",
  type: "Internal tool",
  role: "Built & maintained",
  status: "Active",
  year: "2024–present",

  problem: [
    "Card recognition — identifying a Pokémon card from a photo — is a genuinely hard computer vision problem. Cards share visual structure (same border style, same layout), differ in subtle ways (artwork, set symbol, card number, holographic pattern), and come in hundreds of variant printings that a model needs to distinguish reliably.",
    "Training a model that performs well requires a large, clean, well-labelled dataset. Assembling that dataset — collecting images, verifying they map to the correct card and variant, normalising quality, and structuring labels in a format the training pipeline can consume — is its own substantial engineering problem.",
    "Vision Lab is the tooling that makes that dataset assembly tractable. It's not the model itself — it's the infrastructure for building and maintaining the training data that the model learns from.",
  ],

  approach: {
    body: [
      "The core challenge is that training data quality matters more than quantity. A dataset of 100,000 poorly labelled or inconsistently cropped images produces a worse model than 20,000 carefully curated ones. Vision Lab is designed around that constraint — making it practical to collect images at volume while applying enough structure and verification to keep quality high.",
      "We treat the dataset as a product: versioned, auditable, with clear provenance for every image. When the model performs badly on a specific card type, we can trace back to the training data for those cards, identify the issue, and fix it — rather than treating the dataset as an opaque blob that occasionally gets added to.",
    ],
    decisions: [
      "Canonical image identity from TCGDex — every training image is keyed to a TCGDex card ID, so labels are precise to the exact printing and variant",
      "Curated over scraped — images are sourced and verified rather than bulk-scraped, which produces cleaner labels and fewer edge cases",
      "Versioned dataset — each training run uses a snapshot of the dataset, so model performance can be traced to specific data states",
      "Structured label format — labels include card ID, set, variant type, and image quality metadata, not just a class name",
      "Review queue with pass/reject — every image goes through a verification step before entering the training set",
    ],
  },

  built: {
    body: [
      "Vision Lab has two main surfaces: an image collection and labelling interface, and a dataset management layer that produces the structured exports the training pipeline consumes.",
    ],
    items: [
      "Image intake and validation — accepts card image submissions, checks format and resolution, extracts metadata",
      "Labelling interface — reviewers assign canonical card IDs to submitted images, confirm variant type, flag quality issues",
      "Side-by-side reference view — submitted image shown alongside the canonical TCGDex reference image to verify correct identification",
      "Quality scoring — each image receives metadata on crop alignment, lighting, glare, and focus that downstream training jobs can use as sample weights",
      "Dataset versioning — point-in-time snapshots of the labelled dataset for reproducible training runs",
      "Export pipeline — produces structured label files in formats compatible with common training frameworks",
      "Coverage dashboard — shows which cards and variants have sufficient training examples and which are underrepresented",
      "Contribution tracking — records image sources and reviewer decisions for provenance and audit",
    ],
  },

  whatWasHard: [
    {
      title: "Variant-level label precision",
      body: "Pokémon cards have many variants: base, reverse holofoil, full art, alternate art, Poké Ball pattern, Master Ball pattern. A model that can identify 'Charizard' but not 'Charizard Poké Ball pattern reverse holofoil' is only partially useful. Getting labels to variant granularity required that the labelling interface understand the card data model well enough to present the right options — which means it's tightly coupled to the TCGDex dataset structure.",
    },
    {
      title: "Defining 'good enough' image quality",
      body: "Not every image in a training set needs to be perfect — some variation in lighting, angle, and quality is actually useful for making the model robust. But there are thresholds: too much glare makes holographic patterns unreadable, too much blur makes text illegible, too much crop removes identifying features. Defining these thresholds in a way that reviewers could apply consistently, and encoding them as structured metadata rather than a binary pass/fail, took iteration.",
    },
    {
      title: "Coverage gaps and class imbalance",
      body: "Common cards from recent sets are easy to collect images for. Older cards, regional variants, and lower-print-run promos are hard to find in sufficient quantity. A model trained on an imbalanced dataset will perform well on common cards and poorly on rare ones — which is the opposite of what's useful. The coverage dashboard exists specifically to surface these gaps so we can prioritise targeted collection rather than just adding more images of cards that are already well represented.",
    },
    {
      title: "Keeping the dataset consistent as cards change",
      body: "TCGDex occasionally corrects card data — a card number that was wrong, a variant relationship that was mismodelled. When that happens, training images labelled against the old data need to be updated. Building the dataset with card IDs as the primary key (rather than human-readable names or numbers) means these corrections can be propagated systematically rather than requiring manual re-labelling.",
    },
  ],

  stack: [
    { label: "Frontend",   value: "Next.js · React — labelling and review interface" },
    { label: "Backend",    value: "Node.js · REST API" },
    { label: "Card data",  value: "TCGDex — canonical card and variant reference" },
    { label: "Storage",    value: "Cloud storage — image store with versioned snapshots" },
    { label: "Database",   value: "PostgreSQL — labels, provenance, quality metadata" },
    { label: "ML export",  value: "Python — structured label export for training frameworks" },
    { label: "Auth",       value: "Internal only — reviewer access control" },
  ],

  outcomes: [
    "Labelled training dataset with variant-level precision keyed to TCGDex card IDs",
    "Reproducible training runs via versioned dataset snapshots",
    "Coverage dashboard identifying underrepresented cards and variants",
    "Provenance record for every image — source, reviewer, quality metadata",
    "Export pipeline producing training-framework-compatible label files",
  ],

  note: "Vision Lab is internal tooling. The card recognition model it trains is an ongoing project — the dataset and tooling are the current focus.",

  nextProject: { href: "/work/set-ingestion", title: "Set Ingestion Backend" },
};

export default function Page() {
  return <CaseStudy data={data} />;
}