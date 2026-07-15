import { footerLinks } from '../../content/landingContent';

// Footer oscuro (RF-09, `DESIGN_HANDOFF.md` → "FAQ y footer") con columnas
// Producto/Compañía/Recursos leídas de `landingContent.js` (T-013, D-08).
// No reutiliza `Logo` (T-005): esa marca fija su wordmark en `text-ink`,
// que sobre un fondo oscuro sería invisible (mismo tono que el fondo) — se
// dibuja aquí una marca decorativa propia en blanco, sin tocar `Logo.jsx`.
export default function PublicFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-16 md:grid-cols-4 md:px-6">
        <div>
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="grid h-7 w-7 place-items-center rounded-btn bg-green text-sm font-bold text-white"
            >
              t
            </span>
            <span className="text-base font-bold lowercase text-white">taskly</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/70">{footerLinks.tagline}</p>
        </div>

        {footerLinks.columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold text-white">{column.title}</h3>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-content border-t border-white/10 px-4 py-6 text-xs text-white/60 md:px-6">
        <span>{footerLinks.copyright}</span>
      </div>
    </footer>
  );
}
