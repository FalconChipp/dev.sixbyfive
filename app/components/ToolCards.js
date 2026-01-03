// app/components/ToolCards.js
// CHANGED:
// - More "premium" card: subtle gradient, shadow, hover lift
// - Better meta chips styling
// - Kept same API (item shape) so page.js doesn't break

import Link from "next/link";

export default function ToolCard({ item }) {
  const { href, name, tagline, kind, meta } = item;

  const card = (
    <article
      className="
        group flex h-full flex-col justify-between
        rounded-xl border border-white/10
        bg-gradient-to-b from-white/[0.06] to-white/[0.02]
        px-4 py-4
        shadow-sm shadow-black/30
        hover:-translate-y-[2px]
        hover:border-[color:var(--color-sbf-accent)]/50
        hover:shadow-blue-500/10
        transition
      "
    >
      <div>
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-[14px] font-semibold text-slate-50 leading-snug">
            {name}
          </h3>

          {kind && (
            <span className="shrink-0 rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-400">
              {kind}
            </span>
          )}
        </div>

        <p className="text-[13px] leading-snug text-slate-300/90">
          {tagline}
        </p>
      </div>

      {meta && meta.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
          {meta.map((m) => (
            <span
              key={m}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5"
            >
              {m}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 text-[12px] text-slate-300 opacity-0 group-hover:opacity-100 transition">
        View →
      </div>
    </article>
  );

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="h-full">
        {card}
      </a>
    );
  }

  return (
    <Link href={href} className="h-full">
      {card}
    </Link>
  );
}
