import Button from '../ui/Button';

// Formatea la fecha actual en español para el eyebrow del encabezado
// (p. ej. "MIÉRCOLES, 15 DE JULIO"). Puro respecto a props: no depende de
// Redux ni de red, solo de `Date` en tiempo de render (RF-17, plan.md
// componentes de dominio → DashboardHeader.jsx).
function formatTodayEyebrow() {
  const today = new Date();
  const formatted = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(today);
  return formatted.toUpperCase();
}

// `{ userName, onNewTaskClick }` (plan.md, componentes de dominio): puro —
// recibe `user.name` ya resuelto por `DashboardPage` (T-039). Cubre RF-17
// (saludo con el nombre real del usuario) y el CTA "Nueva tarea" (RF-20).
export default function DashboardHeader({ userName, onNewTaskClick }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-eyebrow text-green">{formatTodayEyebrow()}</p>
        <h1 className="mt-2 text-card-title text-ink">Hola, {userName}</h1>
      </div>
      <Button variant="primary" size="md" onClick={onNewTaskClick}>
        + Nueva tarea
      </Button>
    </div>
  );
}
