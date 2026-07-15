import { productContent } from '../../content/landingContent';

// Bloque destacado de producto (RF-04). Componente puro: lista de
// funciones leída de `landingContent.js`, sin lógica propia.
export default function ProductShowcase() {
  return (
    <section id="producto" className="bg-paper">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-20 md:grid-cols-2 md:items-center md:px-6">
        <div>
          <p className="text-eyebrow text-green">{productContent.eyebrow}</p>
          <h2 className="mt-3 text-section-mobile text-ink md:text-section">
            {productContent.title}
          </h2>
          <p className="mt-4 text-base text-muted">{productContent.description}</p>

          <ul className="mt-8 space-y-6">
            {productContent.features.map((feature) => (
              <li key={feature.title}>
                <h3 className="text-card-title text-ink">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted">{feature.description}</p>
              </li>
            ))}
          </ul>

          <a
            href="#producto"
            className="mt-8 inline-block text-sm font-semibold text-green hover:text-green-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
          >
            {productContent.linkLabel}
          </a>
        </div>

        <div
          aria-hidden="true"
          className="h-72 rounded-card border border-line bg-mint md:h-96"
        />
      </div>
    </section>
  );
}
