// app/components/Services.js — REDESIGN v2
// Services grid with stronger visual identity per capability

const services = [
  {
    title: "Product engineering",
    badge: "Build",
    icon: "⬡",
    text: "End-to-end product delivery: UI, backend, auth, data modelling, and a clean release path.",
    tags: ["Next.js", "Node", "TypeScript"],
  },
  {
    title: "Platforms & pipelines",
    badge: "Operate",
    icon: "⬡",
    text: "Scheduled jobs, ingestion, reconciliation, caching, and the tooling that keeps data trustworthy.",
    tags: ["GraphQL", "Cron", "Monitoring"],
  },
  {
    title: "Integrations",
    badge: "Connect",
    icon: "⬡",
    text: "Stripe, Discord, Shopify, WordPress, and external APIs — integrated without spaghetti.",
    tags: ["APIs", "Stripe", "Webhooks"],
  },
  {
    title: "UI systems",
    badge: "Polish",
    icon: "⬡",
    text: "A consistent component system, responsive layouts, and UX details that feel premium.",
    tags: ["React", "Tailwind", "Design tokens"],
  },
];

export default function Services() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {services.map((s, i) => (
        <div
          key={s.title}
          className="surface-elevated p-6 group"
        >
          {/* Badge */}
          <span className="badge-accent badge">{s.badge}</span>

          {/* Title */}
          <h3 className="mt-4 text-[16px] font-semibold text-white leading-snug">
            {s.title}
          </h3>

          {/* Body */}
          <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
            {s.text}
          </p>

          {/* Tags */}
          <div className="mt-5 flex flex-wrap gap-1.5">
            {s.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono tracking-wide px-2.5 py-1 rounded-full"
                style={{
                  border: "1px solid rgba(255,255,255,0.09)",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}