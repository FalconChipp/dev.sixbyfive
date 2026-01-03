// app/tools/bulk-edit/page.js
//
// FIXED:
// - This file is now a SERVER component (no "use client")
// - metadata export is allowed again
// - Renders the real UI from BulkEditClient (client component)

import BulkEditClient from "./BulkEditClient";

export const metadata = {
  title: "Bulk Edit UI • SixByFive Tools",
  description:
    "Free bulk editing UI for generating and managing card variant blocks from Cardmarket exports.",
};

export default function BulkEditPage() {
  return <BulkEditClient />;
}
