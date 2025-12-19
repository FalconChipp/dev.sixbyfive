// app/tools/variant-mapper/page.js
// UPDATED: Intro for the Variant Mapper. We'll embed the HTML tool later.

import Link from "next/link";

export default function VariantMapperPage() {
  return (
    <div className="space-y-4 md:space-y-5">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.2em] text-sbf-accentSoft">
          Variants · Frontend tool
        </p>
        <h1 className="text-2xl font-semibold md:text-3xl">
          Variant Mapper
        </h1>
        <p className="max-w-2xl text-sm text-sbf-textMuted md:text-base">
          A browser-based utility that transforms merged Cardmarket exports into
          structured{" "}
          <code className="rounded bg-sbf-bgSoft px-1 py-0.5 text-[11px]">
            variants[]
          </code>{" "}
          blocks for your card metadata files (e.g. TCGdex-like schemas).
        </p>
      </header>

      <section className="rounded-2xl border border-sbf-border bg-sbf-bgElevated p-4 md:p-5 text-sm text-sbf-textMuted space-y-2">
        <p className="font-medium text-sbf-text">Flow</p>
        <ol className="ml-4 list-decimal space-y-1">
          <li>Run the Cardmarket Set Merge Exporter on a set.</li>
          <li>Save the exported JSON containing per-CN product IDs.</li>
          <li>Load that JSON into this tool.</li>
          <li>
            Fine-tune variants (normal / reverse / special foils) and copy the
            generated block into your repo.
          </li>
        </ol>
        <p className="text-[11px] text-sbf-textMuted">
          Next up we&apos;ll embed the existing{" "}
          <code>variant-generator.html</code> here in an iframe so you can use
          it directly on this site.
        </p>
        <p className="text-[11px] text-sbf-textMuted">
          Need the source JSON? Start with the{" "}
          <Link
            href="/tools/cardmarket-merge-exporter"
            className="text-sbf-accentLight underline underline-offset-4"
          >
            Cardmarket Set Merge Exporter
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
