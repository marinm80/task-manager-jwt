import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../utils/axiosConfig';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import UserForm from '../components/admin/UserForm';
import { useToast } from '../components/ui/ToastProvider';

// Mismo vocabulario de tonos que `Badge.jsx`/`MetricCard.jsx` (D-05): solo
// clases de `tailwind.config.js` extendido, sin colores ad-hoc. `role` no es
// un `kind` de `Badge.jsx` (ese componente está atado a `constants/taskLabels.js`
// para status/priority de tareas), así que este mapa vive localmente en la
// página que lo consume, sin tocar ese contrato.
const ROLE_TONE_CLASSES = {
  ADMIN: 'bg-purple/15 text-purple',
  USER: 'bg-line/40 text-ink',
};

export default function AdminPage() {
  const { showToast } = useToast();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    api.get('/admin/users').then((res) => {
      setUsers(res.data);
      setLoading(false);
    });
  }, []);

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    const res = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
    setUsers((prev) => prev.map((u) => (u.id === userId ? res.data : u)));
  };

  const openCreate = () => { setEditUser(null); setShowForm(true); };
  const openEdit = (user) => { setEditUser(user); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditUser(null); };

  const handleSubmit = async (data) => {
    try {
      if (editUser) {
        const res = await api.patch(`/admin/users/${editUser.id}`, data);
        setUsers((prev) => prev.map((u) => (u.id === editUser.id ? res.data : u)));
        showToast('success', 'Usuario actualizado.');
      } else {
        const res = await api.post('/admin/users', data);
        setUsers((prev) => [...prev, res.data]);
        showToast('success', 'Usuario creado.');
      }
    } catch (err) {
      showToast('error', err.response?.data?.message ?? 'No pudimos guardar el usuario.');
    }
  };

  const handleDelete = async (user) => {
    if (!confirm(`¿Eliminar al usuario "${user.name}"?`)) return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      showToast('success', 'Usuario eliminado.');
    } catch (err) {
      showToast('error', err.response?.data?.message ?? 'No pudimos eliminar el usuario.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-eyebrow text-green">Administración</p>
            <h1 className="mt-2 text-card-title text-ink">Usuarios ({users.length})</h1>
          </div>
          <Button variant="primary" size="md" onClick={openCreate}>
            + Nuevo usuario
          </Button>
        </div>

        {loading ? (
          <p className="py-16 text-center text-sm text-muted">Cargando usuarios…</p>
        ) : (
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            <table className="w-full text-sm">
              <thead className="border-b border-line text-xs font-semibold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Rol</th>
                  <th className="px-4 py-3 text-left">Se unió</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-line/20">
                    <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                    <td className="px-4 py-3 text-muted">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${ROLE_TONE_CLASSES[u.role] ?? ROLE_TONE_CLASSES.USER}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={() => toggleRole(u.id, u.role)}>
                          Hacer {u.role === 'ADMIN' ? 'usuario' : 'admin'}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>
                          Editar
                        </Button>
                        {u.id !== currentUser?.id && (
                          <Button variant="danger" size="sm" onClick={() => handleDelete(u)}>
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && <UserForm user={editUser} onClose={closeForm} onSubmit={handleSubmit} />}
    </DashboardLayout>
  );
}
