import { useDispatch } from 'react-redux';
import { deleteTask, updateTask } from '../features/tasks/tasksSlice';
import Badge from './ui/Badge';
import Button from './ui/Button';

const NEXT_STATUS = { PENDING: 'IN_PROGRESS', IN_PROGRESS: 'COMPLETED', COMPLETED: 'PENDING' };
const NEXT_STATUS_LABEL = { PENDING: 'En curso', IN_PROGRESS: 'Listo', COMPLETED: 'Por hacer' };

// `{ task, onEdit, layout? }` (plan.md, componentes de dominio, T-037):
// conserva íntegro el `useDispatch` interno para `updateTask` (toggle de
// estado, RF-21) y `deleteTask` (con confirmación previa ya existente,
// RF-21) — sin cambios de comportamiento respecto a la versión anterior,
// solo restyle. `STATUS_COLORS`/`PRIORITY_COLORS` embebidos se sustituyen
// por `Badge` (T-007) y los botones ad-hoc por `Button` (T-006). `layout`
// es puramente presentacional (delegado por `TaskList`, T-036).
export default function TaskCard({ task, onEdit, layout = 'list' }) {
  const dispatch = useDispatch();

  const handleAdvanceStatus = () => {
    dispatch(updateTask({ id: task.id, data: { status: NEXT_STATUS[task.status] } }));
  };

  const handleDelete = () => {
    if (confirm('¿Eliminar esta tarea?')) dispatch(deleteTask(task.id));
  };

  return (
    <div
      className={`flex flex-col gap-2 rounded-card border border-line bg-surface p-4 shadow-sm ${
        layout === 'grid' ? '' : 'sm:flex-row sm:items-start sm:justify-between sm:gap-4'
      }`}
    >
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-ink">{task.title}</h3>
          <Badge kind="status" value={task.status} />
        </div>

        {task.description && <p className="line-clamp-2 text-xs text-muted">{task.description}</p>}

        <div className="flex items-center gap-3 text-xs">
          <Badge kind="priority" value={task.priority} />
          {task.dueDate && (
            <span className="text-muted">Vence {new Date(task.dueDate).toLocaleDateString('es-ES')}</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" onClick={handleAdvanceStatus}>
          → {NEXT_STATUS_LABEL[task.status]}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
          Editar
        </Button>
        <Button variant="danger" size="sm" onClick={handleDelete}>
          Eliminar
        </Button>
      </div>
    </div>
  );
}
