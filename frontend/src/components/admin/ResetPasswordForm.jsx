import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const schema = z
  .object({
    newPassword: z.string().min(8, 'Mínimo 8 caracteres').max(100),
    confirmPassword: z.string().min(1, 'Requerido'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

const INPUT_CLASSES =
  'w-full rounded-btn border border-line bg-surface px-3 py-2 text-sm text-ink ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green';

// El admin no conoce (ni puede pedir) la contraseña actual de otra cuenta,
// a diferencia de ChangePasswordForm (self-service) — por eso este modal
// solo pide la nueva, sin currentPassword.
export default function ResetPasswordForm({ user, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const submit = async (data) => {
    await onSubmit(data.newPassword);
    onClose();
  };

  return (
    <Modal open onClose={onClose} labelledBy="reset-password-title">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <h2 id="reset-password-title" className="text-card-title text-ink">
          Restablecer contraseña de {user.name}
        </h2>

        <div>
          <label htmlFor="reset-password-new" className="mb-1 block text-xs font-medium text-muted">
            Nueva contraseña
          </label>
          <input
            id="reset-password-new"
            type="password"
            {...register('newPassword')}
            className={INPUT_CLASSES}
          />
          {errors.newPassword && <p className="mt-1 text-xs text-coral-dark">{errors.newPassword.message}</p>}
        </div>

        <div>
          <label htmlFor="reset-password-confirm" className="mb-1 block text-xs font-medium text-muted">
            Confirmar nueva contraseña
          </label>
          <input
            id="reset-password-confirm"
            type="password"
            {...register('confirmPassword')}
            className={INPUT_CLASSES}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-coral-dark">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} disabled={isSubmitting}>
            Restablecer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
