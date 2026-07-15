import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { finalCtaContent } from '../../content/landingContent';

// CTA final de la landing (RF-04). Componente puro: navega siempre a
// `/register` como fija `landingContent.js` (D-08).
export default function FinalCta() {
  return (
    <section className="bg-mint">
      <div className="mx-auto flex max-w-content flex-col items-center gap-4 px-4 py-20 text-center md:px-6">
        <p className="text-eyebrow text-green">{finalCtaContent.eyebrow}</p>
        <h2 className="max-w-2xl text-section-mobile text-ink md:text-section">
          {finalCtaContent.title}
        </h2>
        <p className="max-w-xl text-base text-muted">{finalCtaContent.description}</p>
        <Button as={Link} to="/register" variant="primary" size="lg">
          {finalCtaContent.ctaLabel}
        </Button>
      </div>
    </section>
  );
}
