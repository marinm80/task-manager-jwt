import Badge from '../ui/Badge';
import Button from '../ui/Button';

const NEXT_STATUS = { PENDING: 'IN_PROGRESS', IN_PROGRESS: 'COMPLETED', COMPLETED: 'PENDING' };
const NEXT_STATUS_LABEL = { PENDING: 'En curso', IN_PROGRESS: 'Listo', COMPLETED: 'Por hacer' };

function formatDate(value) {
  if (!value) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(new Date(value));
}

export default function ProjectTaskTable({ tasks, onAdvanceStatus, onEdit, onDelete }) {
  const showActions = onAdvanceStatus || onEdit || onDelete;
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-paper text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Tarea</th>
              <th className="px-4 py-3">Responsable</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Prioridad</th>
              <th className="px-4 py-3">Vence</th>
              {showActions && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-paper">
                <td className="max-w-md px-4 py-3">
                  <p className="font-medium text-ink">{task.title}</p>
                  {task.parentTaskId && <span className="text-xs text-muted">Subtarea</span>}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{task.user?.name ?? 'Sin asignar'}</td>
                <td className="whitespace-nowrap px-4 py-3"><Badge kind="status" value={task.status} /></td>
                <td className="whitespace-nowrap px-4 py-3"><Badge kind="priority" value={task.priority} /></td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(task.dueDate)}</td>
                {showActions && (
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {onAdvanceStatus && (
                        <Button variant="secondary" size="sm" onClick={() => onAdvanceStatus(task, NEXT_STATUS[task.status])}>
                          → {NEXT_STATUS_LABEL[task.status]}
                        </Button>
                      )}
                      {onEdit && (
                        <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
                          Editar
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="danger" size="sm" onClick={() => onDelete(task)}>
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

