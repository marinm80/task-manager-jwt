import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../constants/taskLabels';

const schema = z.object({
  title: z.string().min(1, 'Título requerido').max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(),
});

const INPUT_CLASSES =
  'w-full rounded-btn border border-line bg-surface px-3 py-2 text-sm text-ink ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green';

export default function ProjectTaskForm({ task, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: task
      ? { ...task, dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '' }
      : { status: 'PENDING', priority: 'MEDIUM' },
  });

  const submit = async (data) => {
    const payload = { ...data };
    if (payload.dueDate) payload.dueDate = new Date(payload.dueDate).toISOString();
    else delete payload.dueDate;
    await onSubmit(payload);
    onClose();
  };

  return (
    <Modal open onClose={onClose} labelledBy="project-task-form-title">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <h2 id="project-task-form-title" className="text-card-title text-ink">
          {task ? 'Editar tarea' : 'Nueva tarea del proyecto'}
        </h2>

        <div>
          <label htmlFor="project-task-form-title-input" className="mb-1 block text-xs font-medium text-muted">
            Título
          </label>
          <input
            id="project-task-form-title-input"
            {...register('title')}
            placeholder="Título *"
            className={INPUT_CLASSES}
          />
          {errors.title && <p className="mt-1 text-xs text-coral-dark">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="project-task-form-description" className="mb-1 block text-xs font-medium text-muted">
            Descripción
          </label>
          <textarea
            id="project-task-form-description"
            {...register('description')}
            placeholder="Descripción (opcional)"
            className={INPUT_CLASSES}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="project-task-form-status" className="mb-1 block text-xs font-medium text-muted">
              Estado
            </label>
            <select id="project-task-form-status" {...register('status')} className={INPUT_CLASSES}>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="project-task-form-priority" className="mb-1 block text-xs font-medium text-muted">
              Prioridad
            </label>
            <select id="project-task-form-priority" {...register('priority')} className={INPUT_CLASSES}>
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="project-task-form-due-date" className="mb-1 block text-xs font-medium text-muted">
            Fecha límite (opcional)
          </label>
          <input id="project-task-form-due-date" {...register('dueDate')} type="date" className={INPUT_CLASSES} />
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
