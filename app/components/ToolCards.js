// components/ToolCard.js
// Simple showcase card for platforms / tools / projects.

import Link from "next/link";

export default function ToolCard({ item }) {
  const { href, name, tagline, kind, meta } = item;

  const inner = (
    <article className="flex h-full flex-col justify-between rounded-xl border border-sbf-border bg-sbf-bgElevated px-4 py-3 text-sm hover:border-sbf-accent transition-colors">
      <div>
        <div className="mb-1 flex items-center justify-between gap-2">
          <h3 className="text-[14px] font-semibold text-sbf-text">
            {name}
          </h3>
          {kind && (
            <span className="rounded-full bg-sbf-bgSoft px-2 py-0.5 text-[10px] uppercase tracking-wide text-sbf-textMuted">
              {kind}
            </span>
          )}
        </div>
        <p className="text-[13px] text-sbf-textMuted">{tagline}</p>
      </div>

      {meta && meta.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-sbf-textMuted">
          {meta.map((m) => (
            <span
              key={m}
              className="rounded-full border border-sbf-border px-2 py-0.5"
            >
              {m}
            </span>
          ))}
        </div>
      )}
    </article>
  );

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="h-full">
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className="h-full">
      {inner}
    </Link>
  );
}
