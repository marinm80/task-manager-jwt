import { Link } from 'react-router-dom';
import Logo from '../brand/Logo';
import Button from '../ui/Button';

// Enlaces centrales de la nav (RF-02); anclas dentro de la propia
// LandingPage (T-028, fuera de esta tarea) — no son parte del "copy" de
// landing centralizado en `landingContent.js` (D-08), son navegación.
const NAV_LINKS = [
  { label: 'Producto', href: '#beneficios' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Precios', href: '#precios' },
];

// Nav pública de landing (RF-02, `DESIGN_HANDOFF.md` → "Navegación"): logo a
// la izquierda, enlaces centrados ocultos en móvil (RF-29/RF-30), CTAs de
// login/registro a la derecha. Sin lógica propia: cada CTA navega a una
// ruta real vía `Button as={Link}`.
export default function PublicHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex h-public-header max-w-content items-center justify-between px-4 md:px-6">
        <Link to="/">
          <Logo />
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink hover:text-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button as={Link} to="/login" variant="ghost" size="sm">
            Iniciar sesión
          </Button>
          <Button as={Link} to="/register" variant="primary" size="sm">
            Empieza gratis
          </Button>
        </div>
      </div>
    </header>
  );
}
