import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TaskFilters from './TaskFilters';

// AI-TDD obligatoria (D-09 #3, plan.md). Cubre los escenarios BDD "Búsqueda
// actualiza el filtro real", "Filtro por estado usa los valores del
// backend" y "Filtro por prioridad usa los valores del backend" (spec.md
// §12, Feature: Dashboard rediseñado). Componente puro: sin Provider ni
// mocks de red/Redux (D-02).
function renderFilters(overrides = {}) {
  const onFilterChange = vi.fn();
  const onViewChange = vi.fn();
  const onExport = vi.fn();

  render(
    <TaskFilters
      filters={{ search: '', status: '', priority: '' }}
      view="list"
      onFilterChange={onFilterChange}
      onViewChange={onViewChange}
      onExport={onExport}
      {...overrides}
    />
  );

  return { onFilterChange, onViewChange, onExport };
}

describe('TaskFilters', () => {
  it('seleccionar "En curso" en el filtro de estado dispara onFilterChange con el valor backend, nunca la etiqueta ES', () => {
    const { onFilterChange } = renderFilters();

    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'IN_PROGRESS' } });

    expect(onFilterChange).toHaveBeenCalledWith({ status: 'IN_PROGRESS' });
    expect(onFilterChange).not.toHaveBeenCalledWith({ status: 'En curso' });
  });

  it('seleccionar "Alta" en el filtro de prioridad dispara onFilterChange con el valor backend, nunca la etiqueta ES', () => {
    const { onFilterChange } = renderFilters();

    fireEvent.change(screen.getByLabelText('Prioridad'), { target: { value: 'HIGH' } });

    expect(onFilterChange).toHaveBeenCalledWith({ priority: 'HIGH' });
    expect(onFilterChange).not.toHaveBeenCalledWith({ priority: 'Alta' });
  });

  it('escribir un término en el buscador dispara onFilterChange con ese término en search', () => {
    const { onFilterChange } = renderFilters();

    fireEvent.change(screen.getByLabelText('Buscar tareas'), { target: { value: 'reporte' } });

    expect(onFilterChange).toHaveBeenCalledWith({ search: 'reporte' });
  });

  it('muestra las etiquetas ES en las opciones de estado/prioridad, no los valores crudos del backend', () => {
    renderFilters();

    expect(screen.getByRole('option', { name: 'En curso' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Alta' })).toBeInTheDocument();
  });

  it('no dispatcha nada por sí mismo: onExport solo se invoca al hacer clic en el botón de exportar', () => {
    const { onExport } = renderFilters();

    fireEvent.click(screen.getByRole('button', { name: /exportar/i }));

    expect(onExport).toHaveBeenCalledTimes(1);
  });
});
