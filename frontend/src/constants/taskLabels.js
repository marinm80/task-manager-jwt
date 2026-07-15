// Mapeo backend → copy UI en español (spec.md §11). Los valores enviados/
// recibidos de la API (PENDING/IN_PROGRESS/COMPLETED, LOW/MEDIUM/HIGH) nunca
// cambian; esto solo resuelve cómo se muestran.

export const STATUS_LABELS = {
  PENDING: 'Por hacer',
  IN_PROGRESS: 'En curso',
  COMPLETED: 'Listo',
};

export const PRIORITY_LABELS = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
};

// Tonos por valor, expresados con el mismo vocabulario que `MetricCard`
// ('neutral'|'green'|'purple'|'coral'|'amber') para que `Badge` y las
// tarjetas de métrica comparten un único set de clases por tono
// (tailwind.config.js extendido, D-05). Verificación de contraste de
// tech-spec.md §2: `green` sobre `mint` (~6.5:1) y `coral-dark`/`amber-dark`
// sobre sus fondos `/15` (R6, validado por @code-reviewer).
export const STATUS_TONES = {
  PENDING: 'neutral',
  IN_PROGRESS: 'purple',
  COMPLETED: 'green',
};

export const PRIORITY_TONES = {
  LOW: 'green',
  MEDIUM: 'amber',
  HIGH: 'coral',
};
