import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { heroContent } from '../../content/landingContent';

// Hero de la landing (RF-03): título/descripción/CTAs literales del handoff,
// leídos de `landingContent.js` (D-08) para que la verificación palabra por
// palabra contra el handoff se haga en un solo lugar. Componente puro: el
// CTA primario navega directamente a `/register`; el CTA secundario
// ("Ver demo en vivo") recibe su destino real como callback desde
// `LandingPage` (T-028), que es quien conoce el estado de sesión (RF-06).
export default function Hero({ onSecondaryCtaClick }) {
  return (
    <section className="bg-paper">
      <div className="mx-auto flex max-w-content flex-col items-center gap-6 px-4 py-20 text-center md:px-6 md:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold text-ink">
          <span className="rounded-full bg-green px-2 py-0.5 text-[10px] uppercase text-white">
            {heroContent.eyebrow}
          </span>
          {heroContent.eyebrowHighlight}
        </span>

        <h1 className="max-w-3xl text-hero-mobile text-ink md:text-hero">{heroContent.title}</h1>

        <p className="max-w-2xl text-base text-muted md:text-lg">{heroContent.description}</p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button as={Link} to="/register" variant="primary" size="lg">
            {heroContent.ctaPrimaryLabel}
          </Button>
          <Button variant="secondary" size="lg" onClick={onSecondaryCtaClick}>
            {heroContent.ctaSecondaryLabel}
          </Button>
        </div>

        <p className="text-sm text-muted">{heroContent.supportText}</p>

        <div className="flex items-center gap-3 text-sm text-ink">
          <span aria-hidden="true" className="text-amber">
            {heroContent.proofRating}
          </span>
          <span>{heroContent.proofText}</span>
        </div>
      </div>
    </section>
  );
}
