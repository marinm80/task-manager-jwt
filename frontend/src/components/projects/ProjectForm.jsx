import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const STATUS_LABELS = {
  PLANNING: 'Planificación',
  ACTIVE: 'Activo',
  ON_HOLD: 'En pausa',
  COMPLETED: 'Completado',
};

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(120),
  key: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(12)
    .regex(/^[A-Za-z0-9-]+$/, 'Solo letras, números y guiones'),
  description: z.string().max(1000).optional(),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED']).optional(),
  initialTasks: z.array(z.object({ title: z.string().max(200) })).optional(),
});

const INPUT_CLASSES =
  'w-full rounded-btn border border-line bg-surface px-3 py-2 text-sm text-ink ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green';

export default function ProjectForm({ project, onClose, onSubmit }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: project
      ? { name: project.name, key: project.key, description: project.description ?? '', status: project.status }
      : { initialTasks: [{ title: '' }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'initialTasks' });

  const submit = async (data) => {
    const initialTasks = (data.initialTasks ?? [])
      .map((item) => item.title.trim())
      .filter(Boolean);
    await onSubmit({ ...data, initialTasks });
    onClose();
  };

  return (
    <Modal open onClose={onClose} labelledBy="project-form-title">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <h2 id="project-form-title" className="text-card-title text-ink">
          {project ? 'Editar proyecto' : 'Nuevo proyecto'}
        </h2>

        <div>
          <label htmlFor="project-form-name" className="mb-1 block text-xs font-medium text-muted">
            Nombre
          </label>
          <input id="project-form-name" {...register('name')} placeholder="Nombre *" className={INPUT_CLASSES} />
          {errors.name && <p className="mt-1 text-xs text-coral-dark">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="project-form-key" className="mb-1 block text-xs font-medium text-muted">
            Clave
          </label>
          <input
            id="project-form-key"
            {...register('key')}
            placeholder="Ej. WEB, APP-1"
            className={INPUT_CLASSES}
          />
          {errors.key && <p className="mt-1 text-xs text-coral-dark">{errors.key.message}</p>}
        </div>

        <div>
          <label htmlFor="project-form-description" className="mb-1 block text-xs font-medium text-muted">
            Descripción
          </label>
          <textarea
            id="project-form-description"
            {...register('description')}
            placeholder="Descripción (opcional)"
            className={INPUT_CLASSES}
            rows={3}
          />
        </div>

        {project ? (
          <div>
            <label htmlFor="project-form-status" className="mb-1 block text-xs font-medium text-muted">
              Estado
            </label>
            <select id="project-form-status" {...register('status')} className={INPUT_CLASSES}>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <p className="mb-1 text-xs font-medium text-muted">Primeras tareas (opcional)</p>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`initialTasks.${index}.title`)}
                    placeholder={`Tarea ${index + 1}`}
                    className={INPUT_CLASSES}
                  />
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="md" iconOnly aria-label="Quitar tarea" onClick={() => remove(index)}>
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => append({ title: '' })}>
              + Agregar otra tarea
            </Button>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} disabled={isSubmitting}>
            {project ? 'Guardar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
