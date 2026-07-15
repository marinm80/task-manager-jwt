import { benefitsContent } from '../../content/landingContent';

// Sección de 4 beneficios numerados (RF-04). Componente puro: renderiza
// exactamente `benefitsContent.items` sin lógica propia.
export default function Benefits() {
  return (
    <section id="beneficios" className="bg-paper">
      <div className="mx-auto max-w-content px-4 py-20 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow text-green">{benefitsContent.eyebrow}</p>
          <h2 className="mt-3 text-section-mobile text-ink md:text-section">
            {benefitsContent.title}
          </h2>
          <p className="mt-4 text-base text-muted">{benefitsContent.description}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefitsContent.items.map((item) => (
            <article
              key={item.number}
              className="rounded-card border border-line bg-surface p-6 text-left"
            >
              <span className="text-sm font-bold text-green">{item.number}</span>
              <h3 className="mt-3 text-card-title text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
