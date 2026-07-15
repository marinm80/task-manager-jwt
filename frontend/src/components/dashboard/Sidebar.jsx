import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from '../brand/Logo';
import Button from '../ui/Button';
import useFocusTrap from '../../hooks/useFocusTrap';

// Ítems de navegación del sidebar (RF-25, `DESIGN_HANDOFF.md` → "Sidebar").
// La app real solo expone una página de tareas (`/dashboard`) — no existen
// rutas separadas de "Mi día"/"Actividad" en el alcance de este spec (spec.md
// §8 excluye Calendario/Kanban con drag-and-drop y cualquier feature v2.0).
// "Tareas" es el único ítem con destino real; "Mi día" y "Actividad" quedan
// como botones enfocables/inertes (visualmente completos según el handoff,
// sin una página propia que enlazar todavía) — ninguno queda oculto del
// teclado, solo no navegan a ningún sitio nuevo.
const STATIC_NAV_ITEMS = ['Mi día', 'Actividad'];

function navLinkClassName({ isActive }) {
  return [
    'rounded-btn px-3 py-2 text-left text-sm font-medium transition-colors',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green',
    isActive ? 'bg-mint text-green' : 'text-ink hover:bg-line/40',
  ].join(' ');
}

function SidebarNav() {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav aria-label="Navegación del panel" className="flex flex-col gap-1">
      <button type="button" className={navLinkClassName({ isActive: false })}>
        {STATIC_NAV_ITEMS[0]}
      </button>
      <NavLink to="/dashboard" className={navLinkClassName}>
        Tareas
      </NavLink>
      <button type="button" className={navLinkClassName({ isActive: false })}>
        {STATIC_NAV_ITEMS[1]}
      </button>
      {/* RF-25: enlace a Admin visible únicamente para role === 'ADMIN' */}
      {user?.role === 'ADMIN' && (
        <NavLink to="/admin" className={navLinkClassName}>
          Admin
        </NavLink>
      )}
    </nav>
  );
}

// `{ mobileOpen, onCloseMobile }` (plan.md, componentes de dominio): lee
// `user.role` internamente vía Redux para decidir el enlace Admin. Variante
// desktop persistente (228px, `DESIGN_HANDOFF.md` → "Layout") + variante
// drawer móvil (RF-26) que reutiliza `useFocusTrap` (T-008/D-07) en vez de
// reimplementar foco/Escape.
export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const drawerRef = useFocusTrap({ isOpen: mobileOpen, onClose: onCloseMobile });

  return (
    <>
      {/* Sidebar persistente de escritorio */}
      <aside
        aria-label="Barra lateral"
        className="hidden h-screen w-[228px] flex-shrink-0 flex-col gap-8 border-r border-line bg-surface p-4 md:flex"
      >
        <Link to="/">
          <Logo />
        </Link>
        <SidebarNav />
      </aside>

      {/* Drawer móvil (RF-26): oculto en md+ para no duplicar controles
          focables visibles al mismo tiempo que el sidebar de escritorio. */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-ink/50" aria-hidden="true" onClick={onCloseMobile} />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            tabIndex={-1}
            className="motion-safe:animate-fade-in-up fixed inset-y-0 left-0 flex w-[228px] flex-col gap-8 bg-surface p-4 shadow-md"
          >
            <div className="flex items-center justify-between">
              <Link to="/">
                <Logo />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label="Cerrar menú"
                onClick={onCloseMobile}
              >
                <span aria-hidden="true">×</span>
              </Button>
            </div>
            <SidebarNav />
          </div>
        </div>
      )}
    </>
  );
}
