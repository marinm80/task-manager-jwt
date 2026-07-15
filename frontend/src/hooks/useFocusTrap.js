import { useEffect, useRef } from 'react';

// D-07: hook sin opinión visual, consumido por Modal.jsx (T-009) y por el
// drawer móvil de Sidebar.jsx (T-017). Toda la lógica de foco/Escape/
// retorno de foco vive únicamente aquí — ningún consumidor la reimplementa.
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
}

/**
 * useFocusTrap({ isOpen, onClose })
 * Devuelve un `containerRef` que el consumidor debe adjuntar al elemento
 * que actúa como panel/drawer. Mientras `isOpen` es true:
 * - mueve el foco dentro del contenedor al activarse,
 * - atrapa Tab/Shift+Tab entre los elementos focables del contenedor,
 * - invoca `onClose()` al presionar Escape,
 * - restaura el foco al `document.activeElement` capturado en la apertura
 *   cuando `isOpen` pasa a false o el hook se desmonta.
 */
export default function useFocusTrap({ isOpen, onClose }) {
  const containerRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedElementRef.current = document.activeElement;

    const container = containerRef.current;
    const [firstFocusable] = getFocusableElements(container);
    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      container?.focus();
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElementRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  return containerRef;
}
