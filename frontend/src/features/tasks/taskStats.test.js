import { describe, expect, it } from 'vitest';
import { computeTaskStats } from './taskStats';
import { emptyTaskList, mixedTaskList } from '../../test/fixtures/tasks';

// AI-TDD obligatoria (D-09 #4, plan.md). Cubre el escenario BDD "Las
// métricas no inventan datos del servidor" (spec.md §12, Feature: Dashboard
// rediseñado): `computeTaskStats` solo agrega datos ya presentes en las
// tareas recibidas por parámetro, sin I/O ni campos inventados.
describe('computeTaskStats', () => {
  it('con una lista vacía devuelve total 0 y todos los conteos en 0', () => {
    const stats = computeTaskStats(emptyTaskList);

    expect(stats).toEqual({
      total: 0,
      byStatus: { PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0 },
      byPriority: { LOW: 0, MEDIUM: 0, HIGH: 0 },
    });
  });

  it('con la fixture mixta devuelve los conteos exactos documentados en test/fixtures/tasks.js', () => {
    const stats = computeTaskStats(mixedTaskList);

    expect(stats).toEqual({
      total: 7,
      byStatus: { PENDING: 2, IN_PROGRESS: 2, COMPLETED: 3 },
      byPriority: { LOW: 2, MEDIUM: 2, HIGH: 3 },
    });
  });

  it('no agrega campos fuera de total/byStatus/byPriority', () => {
    const stats = computeTaskStats(mixedTaskList);

    expect(Object.keys(stats).sort()).toEqual(['byPriority', 'byStatus', 'total']);
  });
});
