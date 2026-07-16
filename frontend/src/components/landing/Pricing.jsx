import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { pricingSectionContent, pricingPlans } from '../../content/landingContent';

// Sección de precios (RF-04/RF-07). Puramente informativa: los 3 planes
// (Free/Pro/Team) se leen de `landingContent.js` (D-08) y NINGÚN CTA de
// plan ejecuta cobro real ni simulado ni abre un flujo de checkout — los
// tres botones son `<Button as={Link} to="/register">`, exactamente el
// mismo destino que el CTA "Empieza gratis" del resto de la landing.
// No se agrega `onClick` con lógica de pago en ningún caso (RF-07,
// mitigación explícita del riesgo de simular un checkout).
export default function Pricing() {
  return (
    <section id="precios" className="bg-paper">
      <div className="mx-auto max-w-content px-4 py-20 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow text-green">{pricingSectionContent.eyebrow}</p>
          <h2 className="mt-3 text-section-mobile text-ink md:text-section">
            {pricingSectionContent.title}
          </h2>
          <p className="mt-4 text-base text-muted">{pricingSectionContent.subtitle}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={[
                'flex flex-col gap-6 rounded-card border p-8',
                plan.featured ? 'border-green bg-surface shadow-md' : 'border-line bg-surface',
              ].join(' ')}
            >
              {plan.badge && (
                <span className="inline-flex w-fit items-center rounded-full bg-green px-3 py-1 text-eyebrow uppercase text-white">
                  {plan.badge}
                </span>
              )}

              <div>
                <h3 className="text-card-title text-ink">{plan.name}</h3>
                <p className="mt-2">
                  <span className="text-section-mobile text-ink">{plan.price}</span>
                </p>
                <p className="text-sm text-muted">{plan.note}</p>
              </div>

              <ul className="flex-1 space-y-2 text-sm text-ink">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span aria-hidden="true" className="text-green">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* RF-07: siempre navega a /register, jamás dispara cobro/checkout. */}
              <Button
                as={Link}
                to="/register"
                variant={plan.featured ? 'primary' : 'secondary'}
                size="md"
              >
                {plan.ctaLabel}
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
