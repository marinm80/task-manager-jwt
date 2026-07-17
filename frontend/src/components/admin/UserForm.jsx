import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const baseSchema = {
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  role: z.enum(['USER', 'ADMIN']),
};

const createSchema = z.object({ ...baseSchema, password: z.string().min(8, 'Mínimo 8 caracteres').max(100) });
const editSchema = z.object(baseSchema);

const INPUT_CLASSES =
  'w-full rounded-btn border border-line bg-surface px-3 py-2 text-sm text-ink ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green';

export default function UserForm({ user, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(user ? editSchema : createSchema),
    defaultValues: user
      ? { name: user.name, email: user.email, role: user.role }
      : { role: 'USER' },
  });

  const submit = async (data) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal open onClose={onClose} labelledBy="user-form-title">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <h2 id="user-form-title" className="text-card-title text-ink">
          {user ? 'Editar usuario' : 'Nuevo usuario'}
        </h2>

        <div>
          <label htmlFor="user-form-name" className="mb-1 block text-xs font-medium text-muted">
            Nombre
          </label>
          <input id="user-form-name" {...register('name')} placeholder="Nombre *" className={INPUT_CLASSES} />
          {errors.name && <p className="mt-1 text-xs text-coral-dark">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="user-form-email" className="mb-1 block text-xs font-medium text-muted">
            Email
          </label>
          <input id="user-form-email" type="email" {...register('email')} placeholder="Email *" className={INPUT_CLASSES} />
          {errors.email && <p className="mt-1 text-xs text-coral-dark">{errors.email.message}</p>}
        </div>

        {!user && (
          <div>
            <label htmlFor="user-form-password" className="mb-1 block text-xs font-medium text-muted">
              Contraseña
            </label>
            <input
              id="user-form-password"
              type="password"
              {...register('password')}
              placeholder="Contraseña *"
              className={INPUT_CLASSES}
            />
            {errors.password && <p className="mt-1 text-xs text-coral-dark">{errors.password.message}</p>}
          </div>
        )}

        <div>
          <label htmlFor="user-form-role" className="mb-1 block text-xs font-medium text-muted">
            Rol
          </label>
          <select id="user-form-role" {...register('role')} className={INPUT_CLASSES}>
            <option value="USER">Usuario</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} disabled={isSubmitting}>
            {user ? 'Guardar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
