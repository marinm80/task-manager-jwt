import { Link } from 'react-router-dom';
import Logo from '../brand/Logo';

// Layout compartido por las 4 páginas de auth (T-029/T-030, `DESIGN_HANDOFF.md`
// → "Auth"): tarjeta centrada de ancho máximo ~440px con Logo + título/
// subtítulo. Usa `max-w-md` (448px, escala estándar de Tailwind) en vez de
// un valor arbitrario en píxeles para no introducir un tamaño ad-hoc fuera
// de `tailwind.config.js` extendido (D-05) y quedar razonablemente cerca de
// los "~440px" del handoff.
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-md rounded-card border border-line bg-surface p-6 shadow-md sm:p-8">
        <Link to="/" className="mb-6 inline-flex">
          <Logo />
        </Link>

        <h1 className="text-card-title text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
