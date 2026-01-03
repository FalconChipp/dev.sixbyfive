// app/components/CaseStudies.js
// CHANGED:
// - Cleaner card layout
// - Better spacing + typography hierarchy
// - Buttons feel more premium
// - Reduced “grey slab” effect

import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

const work = [
  {
    title: "SixByFive TCG Platform",
    label: "Product",
    description:
      "A collector-focused platform to search sets/cards, track collections, build binders, and keep pricing aligned across multiple sources.",
    points: ["Next.js frontend", "GraphQL API layer", "Pricing + metadata pipeline"],
    href: "https://tcg.sixbyfive.com",
  },
  {
    title: "3D Printing Portal",
    label: "Vertical",
    description:
      "A workflow-first portal for quoting and job management, including uploads and operational tooling to reduce manual admin.",
    points: ["Forms + uploads", "Admin workflow", "Email + notifications"],
    href: "https://3dprinting.sixbyfive.com",
  },
];

export default function CaseStudies() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {work.map((w) => (
        <Card key={w.title} className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge>{w.label}</Badge>
              <h3 className="mt-3 text-[16px] md:text-[18px] font-semibold text-white">
                {w.title}
              </h3>
            </div>
          </div>

          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            {w.description}
          </p>

          <ul className="mt-5 space-y-2 text-[12px] text-white/80">
            {w.points.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white/35" />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Button href={w.href} variant="secondary">
              View live site →
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
