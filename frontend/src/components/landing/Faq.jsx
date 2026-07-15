import { faqSectionContent, faqItems } from '../../content/landingContent';

// Acordeón de FAQ accesible (RF-08). Usa `<details>/<summary>` nativo: el
// propio navegador gestiona click y activación por teclado (Enter/Espacio)
// sobre el `<summary>` sin ninguna lógica de toggle propia — nunca se guarda
// `open` en estado de React (mitigación de riesgo R3, D-09 #5).
//
// IMPORTANTE (corregido tras QA manual de T-042): no agregar un handler de
// `onKeyDown` que llame a `.click()` en Enter "para que funcione igual en
// jsdom". En un navegador real, Enter sobre un `<summary>` enfocado YA
// dispara un `click` nativo por sí solo; un `.click()` adicional en el mismo
// evento produce un DOBLE toggle (abre y cierra en el mismo Enter), dejando
// el acordeón inoperable por teclado — confirmado con Tab+Enter real en
// Chromium. La diferencia de comportamiento entre jsdom (no sintetiza ese
// click) y un navegador real (sí lo hace) se resuelve en el test, no en el
// componente: ver `Faq.test.jsx`.
export default function Faq({ items = faqItems }) {
  return (
    <section id="faq" className="bg-paper">
      <div className="mx-auto max-w-content px-4 py-20 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow text-green">{faqSectionContent.eyebrow}</p>
          <h2 className="mt-3 text-section-mobile text-ink md:text-section">
            {faqSectionContent.title}
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-2xl divide-y divide-line">
          {items.map((item) => (
            <details key={item.question} className="group py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary
                className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-card-title text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
              >
                {item.question}
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 text-xl text-muted transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted">{item.answer}</p>
            </details>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted">
          {faqSectionContent.supportText}{' '}
          <a
            href={`mailto:${faqSectionContent.supportEmail}`}
            className="font-semibold text-green hover:text-green-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
          >
            {faqSectionContent.supportLinkLabel}
          </a>
        </p>
      </div>
    </section>
  );
}
