// app/components/ProofStrip.js
// New: "trust" layer. Swap text for real metrics when ready.

import Badge from "./ui/Badge";

export default function ProofStrip() {
  const items = [
    { k: "Stack", v: "Next.js • Node • GraphQL" },
    { k: "Ops", v: "Cron pipelines • monitoring • logging" },
    { k: "Focus", v: "Collector-first product design" },
    { k: "Output", v: "Shipped + actively maintained systems" }
  ];

  return (
    <div className="mt-6 grid gap-3 rounded-[var(--radius)] border border-white/10 bg-white/[0.03] p-4 md:grid-cols-4">
      {items.map((it) => (
        <div key={it.k} className="flex flex-col gap-1">
          <Badge>{it.k}</Badge>
          <div className="text-[13px] text-white/85">{it.v}</div>
        </div>
      ))}
    </div>
  );
}
