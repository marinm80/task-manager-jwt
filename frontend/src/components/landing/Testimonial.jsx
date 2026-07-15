import { testimonialContent } from '../../content/landingContent';

// Testimonio único (RF-04). Componente puro: lee copy de
// `landingContent.js`, sin lógica propia.
export default function Testimonial() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-content px-4 py-20 md:px-6">
        <figure className="mx-auto max-w-2xl text-center">
          <blockquote className="text-section-mobile text-ink md:text-section">
            &ldquo;{testimonialContent.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-6 flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-mint text-sm font-bold text-green"
            >
              {testimonialContent.authorInitials}
            </span>
            <span className="text-left text-sm">
              <span className="block font-semibold text-ink">{testimonialContent.authorName}</span>
              <span className="block text-muted">{testimonialContent.authorRole}</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
