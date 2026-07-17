import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { createTask, updateTask } from '../features/tasks/tasksSlice';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { PRIORITY_LABELS, STATUS_LABELS } from '../constants/taskLabels';
import projectService from '../services/projectService';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(),
  projectId: z.string().optional(),
});

const INPUT_CLASSES =
  'w-full rounded-btn border border-line bg-surface px-3 py-2 text-sm text-ink ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green';

// `{ task?, onClose }` (plan.md, componentes de dominio, T-038): conserva
// íntegro `react-hook-form` + `zod` + `useDispatch` para `createTask`/
// `updateTask` (RF-20/RF-21) — mismo esquema, mismos payloads que antes de
// este restyle. El único cambio de comportamiento es de presentación: el
// `<div className="fixed inset-0">` se reemplaza por `<Modal open onClose={onClose}>`
// (T-009), que resuelve RF-39 (foco/Escape/retorno de foco) por
// composición, sin reimplementarlo aquí.
export default function TaskForm({ task, onClose }) {
  const dispatch = useDispatch();
  const [projects, setProjects] = useState([]);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: task
      ? { ...task, dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '', projectId: task.projectId ? String(task.projectId) : '' }
      : { status: 'PENDING', priority: 'MEDIUM', projectId: '' },
  });

  useEffect(() => {
    projectService.getMyProjects().then(({ data }) => setProjects(data)).catch(() => setProjects([]));
  }, []);

  // El <select> de proyecto solo tiene la opción "Sin proyecto" en el primer
  // render (la lista real llega async); si el navegador intenta seleccionar
  // un value que todavía no existe como <option>, cae al primero disponible
  // y se queda ahí — defaultValues no lo corrige retroactivamente porque
  // este es un input no controlado (`register`). Este efecto corre DESPUÉS
  // del render que ya agregó las opciones reales al DOM (depende de
  // `projects`, no se dispara junto con el fetch), así que para cuando
  // llama a setValue la opción correcta ya existe para seleccionar.
  useEffect(() => {
    if (task?.projectId && projects.some((project) => project.id === task.projectId)) {
      setValue('projectId', String(task.projectId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  const onSubmit = async (data) => {
    const payload = { ...data };
    if (payload.dueDate) payload.dueDate = new Date(payload.dueDate).toISOString();
    else delete payload.dueDate;
    payload.projectId = payload.projectId ? Number(payload.projectId) : null;
    if (task) await dispatch(updateTask({ id: task.id, data: payload }));
    else await dispatch(createTask(payload));
    onClose();
  };

  return (
    <Modal open onClose={onClose} labelledBy="task-form-title">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 id="task-form-title" className="text-card-title text-ink">
          {task ? 'Editar tarea' : 'Nueva tarea'}
        </h2>

        <div>
          <label htmlFor="task-form-title-input" className="mb-1 block text-xs font-medium text-muted">
            Título
          </label>
          <input id="task-form-title-input" {...register('title')} placeholder="Título *" className={INPUT_CLASSES} />
          {errors.title && <p className="mt-1 text-xs text-coral-dark">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="task-form-description" className="mb-1 block text-xs font-medium text-muted">
            Descripción
          </label>
          <textarea
            id="task-form-description"
            {...register('description')}
            placeholder="Descripción (opcional)"
            className={INPUT_CLASSES}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="task-form-status" className="mb-1 block text-xs font-medium text-muted">
              Estado
            </label>
            <select id="task-form-status" {...register('status')} className={INPUT_CLASSES}>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="task-form-priority" className="mb-1 block text-xs font-medium text-muted">
              Prioridad
            </label>
            <select id="task-form-priority" {...register('priority')} className={INPUT_CLASSES}>
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="task-form-due-date" className="mb-1 block text-xs font-medium text-muted">
            Fecha límite (opcional)
          </label>
          <input id="task-form-due-date" {...register('dueDate')} type="date" className={INPUT_CLASSES} />
        </div>

        <div>
          <label htmlFor="task-form-project" className="mb-1 block text-xs font-medium text-muted">
            Proyecto (opcional)
          </label>
          <select id="task-form-project" {...register('projectId')} className={INPUT_CLASSES}>
            <option value="">Sin proyecto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.key} · {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} disabled={isSubmitting}>
            {task ? 'Guardar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
