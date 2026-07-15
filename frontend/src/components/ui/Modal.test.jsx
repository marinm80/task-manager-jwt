import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Modal from './Modal';

// Arnés con estado real: un botón disparador + el Modal, para poder
// verificar el ciclo completo abrir → foco dentro → Escape → foco de vuelta
// al disparador (spec.md §12, Feature Accesibilidad, "Gestión de foco en
// el modal de tarea").
function ModalHarness() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir modal
      </button>
      <Modal open={open} onClose={() => setOpen(false)} labelledBy="modal-harness-title">
        <h2 id="modal-harness-title">Título del modal</h2>
        <button type="button">Acción dentro del modal</button>
      </Modal>
    </div>
  );
}

describe('Modal', () => {
  it('mueve el foco dentro del panel al abrirse', () => {
    render(<ModalHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'Abrir modal' }));

    const panel = screen.getByRole('dialog');
    expect(panel).toContainElement(document.activeElement);
  });

  it('invoca onClose al presionar Escape', () => {
    const handleClose = vi.fn();
    render(
      <Modal open onClose={handleClose} labelledBy="standalone-title">
        <h2 id="standalone-title">Título</h2>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('devuelve el foco al control que abrió el modal al cerrarse', () => {
    render(<ModalHarness />);
    const trigger = screen.getByRole('button', { name: 'Abrir modal' });

    // jsdom no mueve el foco automáticamente en un click sintético como sí
    // lo hace un navegador real al activar un botón; se enfoca explícitamente
    // para reproducir la precondición real que useFocusTrap debe capturar.
    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(document.activeElement).toBe(trigger);
  });
});
