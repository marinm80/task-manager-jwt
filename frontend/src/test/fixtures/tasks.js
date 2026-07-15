// Fixtures deterministas de tareas para tests de Vitest/RTL.
// No usan Date.now() ni Math.random(): todos los valores son literales fijos,
// para que los mismos casos produzcan siempre el mismo resultado.
//
// Forma de cada tarea (ver backend/prisma/schema.prisma → model Task):
// { id, title, description, status, priority, dueDate, userId, createdAt, updatedAt }

export const emptyTaskList = [];

// mixedTaskList: 7 tareas fijas que cubren las 3 combinaciones de `status`
// (PENDING/IN_PROGRESS/COMPLETED) y las 3 de `priority` (LOW/MEDIUM/HIGH),
// incluyendo una repetición (IN_PROGRESS + HIGH aparece 2 veces) para que
// los tests de agregación (p. ej. computeTaskStats) no puedan pasar solo
// contando valores únicos.
//
// Conteos esperados (oráculo manual para taskStats.test.js / TaskFilters.test.jsx):
//   total: 7
//   byStatus:   { PENDING: 2, IN_PROGRESS: 2, COMPLETED: 3 }
//   byPriority: { LOW: 2, MEDIUM: 2, HIGH: 3 }
export const mixedTaskList = [
  {
    id: 1,
    title: 'Preparar reporte semanal',
    description: 'Resumen de avances del equipo',
    status: 'PENDING',
    priority: 'LOW',
    dueDate: '2026-07-20T00:00:00.000Z',
    userId: 1,
    createdAt: '2026-07-10T09:00:00.000Z',
    updatedAt: '2026-07-10T09:00:00.000Z',
  },
  {
    id: 2,
    title: 'Revisar propuesta de diseño',
    description: 'Feedback sobre el nuevo sistema visual',
    status: 'PENDING',
    priority: 'MEDIUM',
    dueDate: null,
    userId: 1,
    createdAt: '2026-07-10T09:05:00.000Z',
    updatedAt: '2026-07-10T09:05:00.000Z',
  },
  {
    id: 3,
    title: 'Corregir bug crítico de login',
    description: 'El refresh token no se limpia correctamente',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2026-07-16T00:00:00.000Z',
    userId: 1,
    createdAt: '2026-07-11T10:00:00.000Z',
    updatedAt: '2026-07-12T08:00:00.000Z',
  },
  {
    id: 4,
    title: 'Migrar endpoint de exportación',
    description: 'Cambiar a streaming para archivos grandes',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2026-07-18T00:00:00.000Z',
    userId: 1,
    createdAt: '2026-07-11T10:10:00.000Z',
    updatedAt: '2026-07-12T08:10:00.000Z',
  },
  {
    id: 5,
    title: 'Actualizar dependencias del backend',
    description: null,
    status: 'COMPLETED',
    priority: 'LOW',
    dueDate: '2026-07-05T00:00:00.000Z',
    userId: 1,
    createdAt: '2026-07-01T09:00:00.000Z',
    updatedAt: '2026-07-05T12:00:00.000Z',
  },
  {
    id: 6,
    title: 'Escribir documentación de la API',
    description: 'Cubrir los endpoints de tareas y admin',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    dueDate: null,
    userId: 1,
    createdAt: '2026-07-02T09:00:00.000Z',
    updatedAt: '2026-07-06T12:00:00.000Z',
  },
  {
    id: 7,
    title: 'Desplegar hotfix de seguridad',
    description: 'Parche urgente en producción',
    status: 'COMPLETED',
    priority: 'HIGH',
    dueDate: '2026-07-04T00:00:00.000Z',
    userId: 1,
    createdAt: '2026-07-03T09:00:00.000Z',
    updatedAt: '2026-07-04T12:00:00.000Z',
  },
];
