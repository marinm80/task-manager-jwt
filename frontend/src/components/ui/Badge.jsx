import {
  PRIORITY_LABELS,
  PRIORITY_TONES,
  STATUS_LABELS,
  STATUS_TONES,
} from '../../constants/taskLabels';

// Mismos 5 tonos que `MetricCard` ('neutral'|'green'|'purple'|'coral'|'amber'),
// solo clases de tailwind.config.js extendido (D-05).
const TONE_CLASSES = {
  neutral: 'bg-line/40 text-ink',
  green: 'bg-mint text-green',
  purple: 'bg-purple/15 text-purple',
  coral: 'bg-coral/15 text-coral-dark',
  amber: 'bg-amber/15 text-amber-dark',
};

const LABELS_BY_KIND = {
  status: STATUS_LABELS,
  priority: PRIORITY_LABELS,
};

const TONES_BY_KIND = {
  status: STATUS_TONES,
  priority: PRIORITY_TONES,
};

// Sustituye los objetos STATUS_COLORS/PRIORITY_COLORS embebidos en
// TaskCard.jsx (consumido por T-037) resolviendo label ES + tono desde
// constants/taskLabels.js (T-007).
export default function Badge({ kind, value, className = '' }) {
  const label = LABELS_BY_KIND[kind]?.[value] ?? value;
  const tone = TONES_BY_KIND[kind]?.[value] ?? 'neutral';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${TONE_CLASSES[tone]} ${className}`}
    >
      {label}
    </span>
  );
}
