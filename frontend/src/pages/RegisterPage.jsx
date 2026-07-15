import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, loginUser } from '../features/auth/authSlice';
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/ui/Button';

const schema = z.object({
  name: z.string().min(2, 'At least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
});

// T-029: restyle de presentación únicamente — ver nota equivalente en
// `LoginPage.jsx`; el flujo registerUser -> loginUser -> navigate('/dashboard')
// y el payload enviado a POST /auth/register no cambian (RF-10).
const INPUT_CLASSES =
  'h-12 w-full rounded-btn border border-line bg-surface px-3 text-sm text-ink ' +
  'placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-green';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      await dispatch(loginUser({ email: data.email, password: data.password }));
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Start managing your tasks">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="register-name" className="mb-1 block text-sm font-medium text-ink">
            Full name
          </label>
          <input {...register('name')} id="register-name" autoComplete="name" className={INPUT_CLASSES} />
          {errors.name && <p className="mt-1 text-xs text-coral-dark">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="register-email" className="mb-1 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            {...register('email')}
            id="register-email"
            type="email"
            autoComplete="email"
            className={INPUT_CLASSES}
          />
          {errors.email && <p className="mt-1 text-xs text-coral-dark">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="register-password" className="mb-1 block text-sm font-medium text-ink">
            Password
          </label>
          <input
            {...register('password')}
            id="register-password"
            type="password"
            autoComplete="new-password"
            className={INPUT_CLASSES}
          />
          {errors.password && <p className="mt-1 text-xs text-coral-dark">{errors.password.message}</p>}
        </div>
        {error && (
          <p role="alert" className="rounded-btn border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral-dark">
            {error}
          </p>
        )}
        <Button type="submit" isLoading={loading} className="w-full">
          {loading ? 'Creating account…' : 'Register'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-green hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
