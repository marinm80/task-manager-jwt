import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';
import Button from '../ui/Button';
import { logoutUser } from '../../features/auth/authSlice';

// Deriva iniciales (máx. 2 letras) del nombre real del usuario para el
// avatar placeholder del topbar (plan.md, asunción #2 de spec.md §14: sin
// campo de foto de perfil en el modelo `User` actual).
function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0][0] ?? '';
  const second = parts.length > 1 ? parts[1][0] ?? '' : '';
  return (first + second).toUpperCase();
}

// `{ children }` (plan.md): shell compartido por `DashboardPage` (T-039) y
// `AdminPage` (T-041) — `Sidebar` (T-017) + topbar (avatar de iniciales,
// nombre, logout) + `<main className="max-w-dashboard mx-auto">`. Lee
// `user`/`accessToken` internamente vía Redux, sin recibir props de auth.
// El botón de logout ya queda conectado a `logoutUser()` real (RF-24) desde
// aquí mismo, porque este es el único punto que ya tiene acceso a Redux
// para las dos páginas que lo consumen; T-039/T-041 solo verifican el
// escenario BDD de extremo a extremo, no reimplementan el dispatch.
export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-line/20">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-[67px] items-center gap-3 border-b border-line bg-surface px-4 md:px-6">
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            aria-label="Abrir menú"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <span aria-hidden="true">☰</span>
          </Button>

          <div className="ml-auto flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center rounded-full bg-mint text-sm font-semibold text-green"
            >
              {getInitials(user?.name)}
            </span>
            <span className="text-sm font-medium text-ink">{user?.name}</span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-dashboard flex-1 px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
