import TaskCard from '../TaskCard';

const VIEW_CONTAINER_CLASSES = {
  cards: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
  list: 'flex flex-col gap-3',
};

// `{ tasks, view, loading, onEdit }` (plan.md, componentes de dominio):
// puro — delega cada tarea a `TaskCard` (T-037, que conserva su
// `useDispatch` interno para updateTask/deleteTask), con
// `layout={view === 'cards' ? 'grid' : 'list'}`. El estado de carga
// explícito de página completa (RF-23) lo decide `DashboardPage` (T-039,
// antes de montar `TaskList`); aquí `loading` solo atenúa la lista ya
// renderizada durante un refetch (p. ej. tras cambiar un filtro) para no
// hacerla parpadear a un estado vacío intermedio.
export default function TaskList({ tasks, view, loading, onEdit }) {
  const layout = view === 'cards' ? 'grid' : 'list';

  return (
    <div aria-busy={loading || undefined} className={loading ? 'opacity-60' : undefined}>
      <div className={VIEW_CONTAINER_CLASSES[view]}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} layout={layout} />
        ))}
      </div>
    </div>
  );
}
