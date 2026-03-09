// app/tools/tcgplayer-exporter/page.js

import TCGPlayerExporterClient from "./TCGPlayerExporterClient";

export const metadata = {
  title: "TCGPlayer Set Exporter • SixByFive Tools",
  description:
    "Fetch TCGPlayer product IDs and variant data for any Pokémon set. Powered by TCGCSV. Compatible with Bulk Edit UI.",
};

export default function TCGPlayerExporterPage() {
  return <TCGPlayerExporterClient />;
}