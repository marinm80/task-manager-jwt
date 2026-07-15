import { useEffect, useState } from 'react';
import api from '../utils/axiosConfig';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';

// Mismo vocabulario de tonos que `Badge.jsx`/`MetricCard.jsx` (D-05): solo
// clases de `tailwind.config.js` extendido, sin colores ad-hoc. `role` no es
// un `kind` de `Badge.jsx` (ese componente está atado a `constants/taskLabels.js`
// para status/priority de tareas), así que este mapa vive localmente en la
// página que lo consume, sin tocar ese contrato.
const ROLE_TONE_CLASSES = {
  ADMIN: 'bg-purple/15 text-purple',
  USER: 'bg-line/40 text-ink',
};

// Restyle (T-041): conserva exactamente la misma llamada a `GET /admin/users`
// y `PATCH /admin/users/:id/role` (RF-27); envuelve la página en
// `DashboardLayout` (T-018) para heredar `Sidebar` + topbar, armonizando
// visualmente `/admin` con `/dashboard` sin agregar ninguna capacidad nueva.
export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <p className="text-eyebrow text-green">Administración</p>
          <h1 className="mt-2 text-card-title text-ink">Usuarios ({users.length})</h1>
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
                      <Button variant="secondary" size="sm" onClick={() => toggleRole(u.id, u.role)}>
                        Hacer {u.role === 'ADMIN' ? 'usuario' : 'admin'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
