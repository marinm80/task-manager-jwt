// Cálculo puro de métricas del dashboard (RF-18, plan.md D-02/D-09 #4).
// No importa Redux ni `axiosConfig.js`: solo agrega sobre las tareas que
// recibe por parámetro, sin I/O — cubre el escenario BDD "Las métricas no
// inventan datos del servidor" (spec.md §12).

const STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

function zeroCounts(keys) {
  return keys.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});
}

// `computeTaskStats(tasks)` → `{ total, byStatus: {...}, byPriority: {...} }`.
// Shape estable: siempre incluye las 3 claves de `status` y las 3 de
// `priority`, aunque su conteo sea 0 (p. ej. lista vacía).
export function computeTaskStats(tasks = []) {
  const byStatus = zeroCounts(STATUSES);
  const byPriority = zeroCounts(PRIORITIES);

  for (const task of tasks) {
    if (task.status in byStatus) byStatus[task.status] += 1;
    if (task.priority in byPriority) byPriority[task.priority] += 1;
  }

  return {
    total: tasks.length,
    byStatus,
    byPriority,
  };
}
