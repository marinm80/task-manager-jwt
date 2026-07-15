import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, fetchTaskStats } from '../features/tasks/tasksSlice';
import { computeTaskStats } from '../features/tasks/taskStats';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import MetricCard from '../components/dashboard/MetricCard';
import TaskFilters from '../components/dashboard/TaskFilters';
import TaskList from '../components/dashboard/TaskList';
import TaskForm from '../components/TaskForm';
import EmptyState from '../components/ui/EmptyState';
import api from '../utils/axiosConfig';

// Restyle de integración (T-039): conserva `fetchTasks`/`handleExport` ya
// existentes (RF-16/RF-22); `logoutUser` sigue disparándose de extremo a
// extremo, ahora desde `DashboardLayout` (T-018), que ya tenía acceso
// directo a Redux para las dos páginas que lo consumen (RF-24). Delega
// presentación a `DashboardLayout` + `DashboardHeader` (T-031) + fila de
// `MetricCard` (T-032, alimentada por `computeTaskStats(statsSnapshot.items)`,
// T-033) + `TaskFilters` (T-035) + `TaskList` (T-036) + `TaskForm` (T-038).
export default function DashboardPage() {
  const dispatch = useDispatch();
  const { items, total, loading, statsSnapshot } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [view, setView] = useState('list');
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', page: 1, limit: 12 });

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  // D-03: el snapshot de métricas se pide una sola vez al montar la página;
  // las mutaciones (createTask/updateTask/deleteTask) lo mantienen
  // sincronizado por parcheo optimista en `tasksSlice`, sin refetch aquí.
  useEffect(() => {
    dispatch(fetchTaskStats());
  }, [dispatch]);

  const handleExport = async () => {
    const res = await api.get('/tasks/export', { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFilterChange = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch, page: 1 }));
  };

  const openCreate = () => { setEditTask(null); setShowForm(true); };
  const openEdit = (task) => { setEditTask(task); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditTask(null); };

  const stats = computeTaskStats(statsSnapshot.items);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader userName={user?.name} onNewTaskClick={openCreate} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total de tareas" value={stats.total} tone="neutral" />
          <MetricCard label="Por hacer" value={stats.byStatus.PENDING} tone="purple" />
          <MetricCard label="En curso" value={stats.byStatus.IN_PROGRESS} tone="amber" />
          <MetricCard label="Listas" value={stats.byStatus.COMPLETED} tone="green" />
        </div>

        <TaskFilters
          filters={{ search: filters.search, status: filters.status, priority: filters.priority }}
          view={view}
          onFilterChange={handleFilterChange}
          onViewChange={setView}
          onExport={handleExport}
        />

        {loading ? (
          <p className="py-16 text-center text-sm text-muted">Cargando tareas…</p>
        ) : items.length === 0 ? (
          <EmptyState
            title="Todavía no hay tareas"
            description="Crea tu primera tarea para empezar a organizar tu trabajo con Taskly."
            actionLabel="Crear mi primera tarea"
            onAction={openCreate}
          />
        ) : (
          <TaskList tasks={items} view={view} loading={loading} onEdit={openEdit} />
        )}

        {total > 0 && (
          <p className="text-center text-xs text-muted">{total} tarea{total !== 1 ? 's' : ''} en total</p>
        )}
      </div>

      {showForm && <TaskForm task={editTask} onClose={closeForm} />}
    </DashboardLayout>
  );
}
