import { socialProofContent } from '../../content/landingContent';

// Franja de prueba social (logos de marcas). Componente puro: solo lee copy
// de `landingContent.js` (D-08), sin lógica.
export default function SocialProof() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto max-w-content px-4 py-10 md:px-6">
        <p className="text-center text-eyebrow text-muted">{socialProofContent.eyebrow}</p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {socialProofContent.logos.map((logo) => (
            <li key={logo} className="text-lg font-semibold text-ink/60">
              {logo}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
