// Mismos 5 tonos que `Badge` ('neutral'|'green'|'purple'|'coral'|'amber'),
// solo clases de `tailwind.config.js` extendido (D-05) — sin colores ad-hoc.
const TONE_CLASSES = {
  neutral: 'bg-line/40 text-ink',
  green: 'bg-mint text-green',
  purple: 'bg-purple/15 text-purple',
  coral: 'bg-coral/15 text-coral-dark',
  amber: 'bg-amber/15 text-amber-dark',
};

// `{ label, value, tone? }` (plan.md, componentes de dominio): puro, render
// de una tarjeta de métrica individual (RF-18). El cálculo de `value` vive
// en `computeTaskStats` (T-033); este componente solo presenta el resultado.
export default function MetricCard({ label, value, tone = 'neutral' }) {
  return (
    <div className={`rounded-card border border-line p-4 ${TONE_CLASSES[tone]}`}>
      <p className="text-eyebrow opacity-80">{label}</p>
      <p className="mt-2 text-card-title">{value}</p>
    </div>
  );
}
