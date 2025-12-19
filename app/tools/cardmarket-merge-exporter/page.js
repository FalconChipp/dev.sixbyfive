// app/tools/cardmarket-merge-exporter/page.js
// UPDATED: Intro styled like a real docs page.

export default function CardmarketMergeExporterPage() {
  return (
    <div className="space-y-4 md:space-y-5">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.2em] text-sbf-accentSoft">
          Cardmarket · Userscript
        </p>
        <h1 className="text-2xl font-semibold md:text-3xl">
          Cardmarket Set Merge Exporter
        </h1>
        <p className="max-w-2xl text-sm text-sbf-textMuted md:text-base">
          A Tampermonkey/Greasemonkey userscript that walks Cardmarket set pages
          (including additional buckets) and exports a canonical map keyed by
          set code and collector number.
        </p>
      </header>

      <section className="rounded-2xl border border-sbf-border bg-sbf-bgElevated p-4 md:p-5 text-sm text-sbf-textMuted space-y-2">
        <p className="font-medium text-sbf-text">What it solves</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>Merges base and “additionals” buckets into one logical set.</li>
          <li>Collects product IDs per collector number.</li>
          <li>Produces JSON ready for the Variant Mapper tool.</li>
        </ul>
        <p className="text-[11px] text-sbf-textMuted">
          In the next pass we can drop the full script here plus install
          instructions and a sample export.
        </p>
      </section>
    </div>
  );
}
