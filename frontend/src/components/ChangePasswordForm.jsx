import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from './ui/Modal';
import Button from './ui/Button';
import api from '../utils/axiosConfig';
import { logout } from '../features/auth/authSlice';
import { useToast } from './ui/ToastProvider';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Requerido'),
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

// Cambia la contraseña de la sesión actual — a diferencia de forgot/reset
// password (pensados para cuando no tienes acceso a la cuenta), esto pide la
// contraseña actual. El backend invalida el refresh token al cambiarla
// (rota credenciales por completo), así que forzamos logout inmediato acá
// en vez de dejar que el usuario se entere recién cuando el access token
// expire y el refresh silencioso falle sin explicación.
export default function ChangePasswordForm({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const submit = async ({ currentPassword, newPassword }) => {
    try {
      await api.patch('/auth/change-password', { currentPassword, newPassword });
      showToast('success', 'Contraseña actualizada. Vuelve a iniciar sesión.');
      dispatch(logout());
      onClose();
      navigate('/login');
    } catch (err) {
      showToast('error', err.response?.data?.message ?? 'No pudimos cambiar la contraseña.');
    }
  };

  return (
    <Modal open onClose={onClose} labelledBy="change-password-title">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <h2 id="change-password-title" className="text-card-title text-ink">
          Cambiar contraseña
        </h2>

        <div>
          <label htmlFor="change-password-current" className="mb-1 block text-xs font-medium text-muted">
            Contraseña actual
          </label>
          <input
            id="change-password-current"
            type="password"
            {...register('currentPassword')}
            className={INPUT_CLASSES}
          />
          {errors.currentPassword && (
            <p className="mt-1 text-xs text-coral-dark">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="change-password-new" className="mb-1 block text-xs font-medium text-muted">
            Nueva contraseña
          </label>
          <input
            id="change-password-new"
            type="password"
            {...register('newPassword')}
            className={INPUT_CLASSES}
          />
          {errors.newPassword && <p className="mt-1 text-xs text-coral-dark">{errors.newPassword.message}</p>}
        </div>

        <div>
          <label htmlFor="change-password-confirm" className="mb-1 block text-xs font-medium text-muted">
            Confirmar nueva contraseña
          </label>
          <input
            id="change-password-confirm"
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
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
