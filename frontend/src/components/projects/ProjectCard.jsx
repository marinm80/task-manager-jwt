import RoleBadge from './RoleBadge';

const STATUS = {
  PLANNING: ['Planificación', 'bg-purple/10 text-purple'],
  ACTIVE: ['Activo', 'bg-mint text-green'],
  ON_HOLD: ['En pausa', 'bg-amber/20 text-amber-dark'],
  COMPLETED: ['Completado', 'bg-line/60 text-muted'],
};

export default function ProjectCard({ project, selected, onSelect }) {
  const lead = project.members?.find((member) => member.role === 'LEAD');
  const [statusLabel, statusClass] = STATUS[project.status] ?? [project.status, 'bg-line text-ink'];

  return (
    <button
      type="button"
      onClick={() => onSelect(project.id)}
      className={`w-full rounded-card border p-4 text-left transition ${
        selected ? 'border-green bg-mint/40 shadow-sm' : 'border-line bg-surface hover:border-green/40'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-xs font-bold text-green">{project.key}</span>
        <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusClass}`}>{statusLabel}</span>
      </div>
      <h3 className="mt-3 text-sm font-semibold text-ink">{project.name}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{project.description}</p>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3 text-xs text-muted">
        <span>{project._count?.tasks ?? 0} tareas</span>
        <span>{project.members?.length ?? 0} personas</span>
      </div>
      {lead && (
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-ink">{lead.user.name}</span>
          <RoleBadge role={lead.role} />
        </div>
      )}
    </button>
  );
}

