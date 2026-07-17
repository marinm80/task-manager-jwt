import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(120),
  key: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(12)
    .regex(/^[A-Za-z0-9-]+$/, 'Solo letras, números y guiones'),
  description: z.string().max(1000).optional(),
});

const INPUT_CLASSES =
  'w-full rounded-btn border border-line bg-surface px-3 py-2 text-sm text-ink ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green';

export default function ProjectForm({ onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const submit = async (data) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal open onClose={onClose} labelledBy="project-form-title">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <h2 id="project-form-title" className="text-card-title text-ink">
          Nuevo proyecto
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

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} disabled={isSubmitting}>
            Crear
          </Button>
        </div>
      </form>
    </Modal>
  );
}
