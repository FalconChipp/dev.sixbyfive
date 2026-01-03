// app/components/ui/Badge.js
// New: small label chip used for "Product", "Tooling", etc.

export default function Badge({ children, className = "" }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 " +
        "text-[10px] uppercase tracking-[0.18em] text-white/70 " +
        className
      }
    >
      {children}
    </span>
  );
}
