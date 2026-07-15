import useFocusTrap from '../../hooks/useFocusTrap';

// Modal accesible genérico (resuelve RF-39): overlay + panel con
// role="dialog", gestión de foco/Escape/retorno de foco delegada por
// completo a useFocusTrap (D-07) — sin lógica de foco propia aquí.
// `initialFocusSelector` queda reservado en el contrato de props (ver
// plan.md) para que un consumidor futuro pueda pedir un foco inicial
// distinto al primer elemento focable; useFocusTrap (D-07) es el único
// lugar donde vive la lógica de foco, así que este componente no la
// implementa por su cuenta mientras ningún consumidor real lo necesite.
export default function Modal({ open, onClose, labelledBy, initialFocusSelector, children }) {
  const panelRef = useFocusTrap({ isOpen: open, onClose });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-ink/50" aria-hidden="true" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className="motion-safe:animate-fade-in-up relative w-full max-w-lg rounded-modal bg-surface p-6 shadow-md"
      >
        {children}
      </div>
    </div>
  );
}
