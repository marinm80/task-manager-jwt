import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Faq from './Faq';

// Fixture corta local (2-3 preguntas), deliberadamente independiente del
// copy final de `landingContent.js` (D-08, plan.md §"Faq.test.jsx"): el
// contrato bajo prueba es el comportamiento de teclado/click del acordeón,
// no el texto exacto de producción.
const fixtureItems = [
  { question: '¿Pregunta uno?', answer: 'Respuesta uno.' },
  { question: '¿Pregunta dos?', answer: 'Respuesta dos.' },
  { question: '¿Pregunta tres?', answer: 'Respuesta tres.' },
];

describe('Faq', () => {
  it('un click en el summary alterna el atributo open del details correspondiente', () => {
    render(<Faq items={fixtureItems} />);

    const summary = screen.getByText('¿Pregunta uno?');
    const details = summary.closest('details');

    expect(details).not.toHaveAttribute('open');

    fireEvent.click(summary);
    expect(details).toHaveAttribute('open');

    fireEvent.click(summary);
    expect(details).not.toHaveAttribute('open');
  });

  it('el summary es un elemento nativo sin listeners propios de teclado (Enter/Espacio los gestiona el navegador)', () => {
    // No se prueba `fireEvent.keyDown(summary, { key: 'Enter' })` a propósito:
    // jsdom no sintetiza el `click` nativo que un navegador real dispara al
    // presionar Enter/Espacio sobre un `<summary>` enfocado, así que ese caso
    // no es representativo aquí. Lo que SÍ se puede y se debe verificar en
    // jsdom es que no exista una reimplementación en JS que interfiera con
    // esa activación nativa (la causa exacta de un bug real encontrado en
    // QA manual: un handler de `onKeyDown` que llamaba a `.click()` producía
    // un doble toggle en el navegador real, dejando el FAQ inoperable por
    // teclado). La cobertura de teclado real vive en `spec.md §13` (QA
    // manual, T-042), verificada con Tab+Enter en un navegador real.
    render(<Faq items={fixtureItems} />);

    const summary = screen.getByText('¿Pregunta dos?');

    expect(summary.tagName).toBe('SUMMARY');
    expect(summary.closest('details').tagName).toBe('DETAILS');
    expect(summary).not.toHaveAttribute('onkeydown');
    expect(summary.getAttribute('tabindex')).toBeNull(); // sin override: usa el tabindex nativo del summary
  });
});
