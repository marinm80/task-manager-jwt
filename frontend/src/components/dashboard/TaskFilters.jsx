import { PRIORITY_LABELS, STATUS_LABELS } from '../../constants/taskLabels';
import Button from '../ui/Button';

const SELECT_CLASSES =
  'h-11 rounded-btn border border-line bg-surface px-3 text-sm text-ink ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green';

const INPUT_CLASSES =
  'h-11 w-full rounded-btn border border-line bg-surface px-3 text-sm text-ink sm:w-56 ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green';

// `Object.entries(STATUS_LABELS/PRIORITY_LABELS)` es el único lugar donde se
// listan los pares valor-backend/etiqueta-ES (RF-19, D-02/D-09 #3): el
// `value` de cada `<option>` siempre es la clave del backend
// (PENDING/IN_PROGRESS/COMPLETED, LOW/MEDIUM/HIGH), nunca la etiqueta
// visible — así el mapeo ES→backend queda centralizado en
// `constants/taskLabels.js` (T-007), no repetido inline por cada `<option>`.
function LabeledSelect({ id, label, value, onChange, labels }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-muted">
        {label}
      </label>
      <select id={id} value={value} onChange={onChange} className={SELECT_CLASSES}>
        <option value="">Todos</option>
        {Object.entries(labels).map(([backendValue, esLabel]) => (
          <option key={backendValue} value={backendValue}>
            {esLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

// `{ filters: { search, status, priority }, view, onFilterChange, onViewChange, onExport }`
// (plan.md, componentes de dominio): puro — no dispatcha nada, no importa
// `axiosConfig` ni Redux (D-02/D-09 #3). Cubre RF-19: búsqueda, filtro de
// estado/prioridad, exportar CSV y cambio de vista lista/tarjetas.
export default function TaskFilters({ filters, view, onFilterChange, onViewChange, onExport }) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="task-filter-search" className="text-xs font-medium text-muted">
          Buscar tareas
        </label>
        <input
          id="task-filter-search"
          type="search"
          placeholder="Buscar tareas…"
          value={filters.search}
          onChange={(event) => onFilterChange({ search: event.target.value })}
          className={INPUT_CLASSES}
        />
      </div>

      <LabeledSelect
        id="task-filter-status"
        label="Estado"
        value={filters.status}
        labels={STATUS_LABELS}
        onChange={(event) => onFilterChange({ status: event.target.value })}
      />

      <LabeledSelect
        id="task-filter-priority"
        label="Prioridad"
        value={filters.priority}
        labels={PRIORITY_LABELS}
        onChange={(event) => onFilterChange({ priority: event.target.value })}
      />

      <div className="ml-auto flex items-center gap-2">
        <div className="flex overflow-hidden rounded-btn border border-line">
          <button
            type="button"
            onClick={() => onViewChange('list')}
            aria-pressed={view === 'list'}
            className={`px-3 py-2 text-sm font-medium ${view === 'list' ? 'bg-mint text-green' : 'text-ink hover:bg-line/40'}`}
          >
            Lista
          </button>
          <button
            type="button"
            onClick={() => onViewChange('cards')}
            aria-pressed={view === 'cards'}
            className={`px-3 py-2 text-sm font-medium ${view === 'cards' ? 'bg-mint text-green' : 'text-ink hover:bg-line/40'}`}
          >
            Tarjetas
          </button>
        </div>

        <Button variant="secondary" size="md" onClick={onExport}>
          Exportar CSV
        </Button>
      </div>
    </div>
  );
}
