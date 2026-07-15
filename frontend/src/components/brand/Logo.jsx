// Isotipo "taskly": cuadrado verde redondeado con "t" blanca decorativa +
// texto "taskly" como nombre accesible real (tech-spec.md §3, literal).
// Sin SVG, sin dependencias nuevas — 100% CSS/Tailwind.
export default function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        aria-hidden="true"
        className="grid h-7 w-7 place-items-center rounded-btn bg-green text-sm font-bold text-white"
      >
        t
      </span>
      <span className="text-base font-bold lowercase text-ink">taskly</span>
    </span>
  );
}
