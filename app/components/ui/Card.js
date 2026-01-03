// app/components/ui/Card.js
// New: premium card with hover lift + border accent

export default function Card({ children, className = "" }) {
  return (
    <div
      className={
        "surface group transition will-change-transform hover:-translate-y-[2px] hover:border-white/20 " +
        className
      }
    >
      {children}
    </div>
  );
}
