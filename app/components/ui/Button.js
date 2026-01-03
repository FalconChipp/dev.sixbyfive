// app/components/ui/Button.js
// New: consistent button styling (primary/secondary/ghost)

import Link from "next/link";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-[13px] font-semibold transition " +
  "focus:outline-none focus:ring-2 focus:ring-white/20";

const variants = {
  primary:
    "bg-[color:var(--accent)] text-slate-950 hover:brightness-110",
  secondary:
    "border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08]",
  ghost:
    "text-white/85 hover:text-white hover:bg-white/[0.06]"
};

export default function Button({
  href,
  onClick,
  variant = "primary",
  target,
  rel,
  children,
  className = "",
  type = "button"
}) {
  const cls = `${base} ${variants[variant]} ${className}`;

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} className={cls} target={target || "_blank"} rel={rel || "noreferrer"}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
