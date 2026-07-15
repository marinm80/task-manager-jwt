import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/ui/Button';

const schema = z.object({
  password: z.string().min(8, 'At least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// T-030: restyle de presentación únicamente — el servicio invocado
// (`api.post('/auth/reset-password', ...)`), su payload y la validación
// zod no cambian (RF-10); tras éxito sigue redirigiendo a "/login" con el
// mismo mensaje de éxito.
const INPUT_CLASSES =
  'h-12 w-full rounded-btn border border-line bg-surface px-3 text-sm text-ink ' +
  'placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-green';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const token = searchParams.get('token');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ password }) => {
    setServerError('');
    try {
      await api.post('/auth/reset-password', { token, password });
      navigate('/login', { state: { message: 'Password updated. You can now log in.' } });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid or expired link.');
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Reset password">
        <p role="alert" className="mb-4 rounded-btn border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral-dark">
          Invalid reset link.
        </p>
        <Link to="/login" className="text-sm text-green hover:underline">
          Back to login
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset password" subtitle="Enter your new password.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="reset-password" className="mb-1 block text-sm font-medium text-ink">
            New password
          </label>
          <input
            {...register('password')}
            id="reset-password"
            type="password"
            autoComplete="new-password"
            className={INPUT_CLASSES}
          />
          {errors.password && <p className="mt-1 text-xs text-coral-dark">{errors.password.message}</p>}
        </div>
        <div>
          <label htmlFor="reset-confirm-password" className="mb-1 block text-sm font-medium text-ink">
            Confirm new password
          </label>
          <input
            {...register('confirmPassword')}
            id="reset-confirm-password"
            type="password"
            autoComplete="new-password"
            className={INPUT_CLASSES}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-coral-dark">{errors.confirmPassword.message}</p>
          )}
        </div>
        {serverError && (
          <p role="alert" className="rounded-btn border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral-dark">
            {serverError}
          </p>
        )}
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          {isSubmitting ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </AuthLayout>
  );
}
