// app/components/Services.js
// New: services grid with "agency style" capability framing

import Card from "./ui/Card";
import Badge from "./ui/Badge";

const services = [
  {
    title: "Product engineering",
    badge: "Build",
    text: "End-to-end product delivery: UI, backend, auth, data modelling, and a clean release path."
  },
  {
    title: "Platforms & pipelines",
    badge: "Operate",
    text: "Scheduled jobs, ingestion, reconciliation, caching, and the tooling that keeps data trustworthy."
  },
  {
    title: "Integrations",
    badge: "Connect",
    text: "Stripe, Discord, Shopify, WordPress, and external APIs — integrated without spaghetti."
  },
  {
    title: "UI systems",
    badge: "Polish",
    text: "A consistent component system, responsive layouts, and UX details that feel premium."
  }
];

export default function Services() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {services.map((s) => (
        <Card key={s.title} className="p-5">
          <Badge>{s.badge}</Badge>
          <h3 className="mt-3 text-[15px] font-semibold text-white">{s.title}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">{s.text}</p>
        </Card>
      ))}
    </div>
  );
}
