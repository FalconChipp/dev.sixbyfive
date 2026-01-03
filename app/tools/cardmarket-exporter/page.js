// app/tools/cardmarket-exporter/page.js
// NEW:
// - Single page with: download + documentation (same page as requested)
// - Uses your existing Section/Container/Button/Card styling conventions

import Section from "../../components/ui/Section";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

export const metadata = {
  title: "Cardmarket Exporter (Tampermonkey) • SixByFive Tools",
  description:
    "Download the Cardmarket Exporter Tampermonkey script and read setup + usage docs.",
};

function H2({ id, children }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-[16px] md:text-[18px] font-semibold text-white">
      {children}
    </h2>
  );
}

function P({ children }) {
  return <p className="mt-2 text-[13px] leading-relaxed text-muted">{children}</p>;
}

function Code({ children }) {
  return (
    <pre className="mt-3 overflow-auto rounded-lg border border-white/10 bg-black/40 p-4 text-[12px] text-white/80">
      <code>{children}</code>
    </pre>
  );
}

export default function CardmarketExporterPage() {
  return (
    <div>
      <Section
        eyebrow="Tool"
        title="Cardmarket Exporter (Tampermonkey)"
        subtitle="Browser extraction tooling to export and merge Cardmarket product IDs across paginated set listings."
        showDivider={false}
      >
        <div className="grid gap-4 md:grid-cols-12">
          {/* LEFT: Download + quick summary */}
          <div className="md:col-span-5">
            <Card className="p-6">
              <Badge>Download</Badge>
              <h3 className="mt-3 text-[16px] font-semibold text-white">
                Install the userscript
              </h3>
              <P>
                This is a Tampermonkey userscript. Download it, then install via the Tampermonkey dashboard.
              </P>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-[12px] font-semibold text-white hover:bg-white/15 transition"
                  href="/downloads/cardmarket-exporter.user.js"
                  download
                >
                  Download script →
                </a>

                <Button href="#install" variant="secondary">
                  Read install steps →
                </Button>
                <Button href="/tools/bulk-edit" variant="secondary">
                  Use the UI
                </Button>
              </div>

              <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-[12px] text-white/80">
                <div className="font-semibold text-white">What it does</div>
                <ul className="mt-2 space-y-1 text-white/75">
                  <li>• Auto-paginates set listings and collects product IDs</li>
                  <li>• Supports base + additionals/variants bucket merging</li>
                  <li>• Exports a clean mapping for QA / ingestion</li>
                </ul>
              </div>
            </Card>
          </div>

          {/* RIGHT: Docs */}
          <div className="md:col-span-7 space-y-4">
            <Card className="p-6">
              <H2 id="install">Install</H2>
              <P>
                1) Install Tampermonkey (Chrome/Edge/Firefox). <br />
                2) Open Tampermonkey → <b>Create a new script</b>. <br />
                3) Paste the downloaded <code>.user.js</code> contents (or import the file). <br />
                4) Save. Visit a Cardmarket Pokémon Singles set listing page.
              </P>
            </Card>

            <Card className="p-6">
              <H2 id="usage">Usage</H2>
              <P>
                - Open the set listing page on Cardmarket. <br />
                - Run the exporter (button/menu injected by the script). <br />
                - Let it paginate through all pages. <br />
                - If the set has an “Additionals/Variants” listing, run it there too (or use the script’s merge mode).
              </P>
            </Card>

            <Card className="p-6">
              <H2 id="output">Output</H2>
              <P>
                The exporter should output a stable mapping keyed by your canonical card ID (e.g. <code>PRE-001</code>),
                with base/additional IDs. Keep this section aligned to your script’s actual format.
              </P>
              <Code>{`{
  "byCardId": {
    "PRE-001": { "ids": { "base": [805390], "additional": [806408, 806409] } }
  }
}`}</Code>
            </Card>

            <Card className="p-6">
              <H2 id="troubleshooting">Troubleshooting</H2>
              <P>
                If pagination stops early, Cardmarket markup may have changed. If merge overwrites earlier results,
                ensure the script stores base/additional separately before producing final export.
              </P>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}
