// app/components/ProofStrip.js — REDESIGN v2
// Refined stats strip with mono typography and visual structure

export default function ProofStrip() {
  const items = [
    { label: "Stack", value: "Next.js · Node · GraphQL" },
    { label: "Ops",   value: "Cron · monitoring · logging" },
    { label: "Focus", value: "Collector-first products" },
    { label: "Ships", value: "Actively maintained" },
  ];

  return (
    <div
      className="mt-8 grid gap-0 md:grid-cols-4 rounded-xl overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.025)",
      }}
    >
      {items.map((it, i) => (
        <div
          key={it.label}
          className="px-5 py-4 flex flex-col gap-1.5"
          style={{
            borderRight: i < items.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
          }}
        >
          <span className="mono-label">{it.label}</span>
          <span className="text-[12px] text-white/75 leading-snug font-medium">
            {it.value}
          </span>
        </div>
      ))}
    </div>
  );
}