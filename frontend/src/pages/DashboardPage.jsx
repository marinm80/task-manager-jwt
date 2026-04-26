import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchTasks } from '../features/tasks/tasksSlice';
import { logoutUser } from '../features/auth/authSlice';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import api from '../utils/axiosConfig';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, loading } = useSelector((s) => s.tasks);
  const { user } = useSelector((s) => s.auth);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', page: 1, limit: 12 });

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const handleExport = async () => {
    const res = await api.get('/tasks/export', { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const openEdit = (task) => { setEditTask(task); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditTask(null); };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Task Manager</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500 hidden sm:block">Hello, {user?.name}</span>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="text-purple-600 hover:underline font-medium">Admin</Link>
          )}
          <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8 px-4 space-y-6">
        <div className="flex flex-wrap gap-2 items-center">
          <input
            placeholder="Search tasks…"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="border rounded px-3 py-1.5 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="border rounded px-3 py-1.5 text-sm"
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}
            className="border rounded px-3 py-1.5 text-sm"
          >
            <option value="">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <div className="ml-auto flex gap-2">
            <button onClick={handleExport} className="text-sm border px-3 py-1.5 rounded hover:bg-gray-50 text-gray-600">
              Export CSV
            </button>
            <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700 font-medium">
              + New Task
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-16">Loading…</p>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No tasks found.</p>
            <button onClick={() => setShowForm(true)} className="mt-3 text-blue-600 hover:underline text-sm">
              Create your first task →
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={openEdit} />
            ))}
          </div>
        )}

        {total > 0 && (
          <p className="text-center text-xs text-gray-400">{total} task{total !== 1 ? 's' : ''} total</p>
        )}
      </main>

      {showForm && <TaskForm task={editTask} onClose={closeForm} />}
    </div>
  );
}
