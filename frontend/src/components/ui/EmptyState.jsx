import Button from './Button';

// Estado vacío genérico, reutilizado por el dashboard cuando no hay tareas
// (RF-23, consumido por T-039). La acción es opcional: si falta
// `actionLabel` u `onAction`, simplemente no se renderiza el botón.
export default function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-line bg-surface px-6 py-12 text-center">
      {icon && (
        <div aria-hidden="true" className="text-muted">
          {icon}
        </div>
      )}
      <h3 className="text-card-title text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
