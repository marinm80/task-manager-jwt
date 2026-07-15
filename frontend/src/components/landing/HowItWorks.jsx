import { howItWorksContent } from '../../content/landingContent';

// Sección "cómo funciona" (3 pasos numerados, fondo verde bosque, RF-04).
// Componente puro: renderiza exactamente `howItWorksContent.steps`.
export default function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-green">
      <div className="mx-auto max-w-content px-4 py-20 text-white md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow text-white/70">{howItWorksContent.eyebrow}</p>
          <h2 className="mt-3 text-section-mobile text-white md:text-section">
            {howItWorksContent.title}
          </h2>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {howItWorksContent.steps.map((step) => (
            <li
              key={step.number}
              className="rounded-card border border-white/15 bg-white/5 p-6 text-left"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-green"
              >
                {step.number}
              </span>
              <h3 className="mt-4 text-card-title text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-white/70">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
