import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser } from '../features/auth/authSlice';
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/ui/Button';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

// T-029: restyle de presentación únicamente — inputs migrados a los tokens
// de `tailwind.config.js` (D-05); ni el schema, ni los hooks (react-hook-form
// + zod), ni el thunk `loginUser`, ni el payload que dispatcha cambian (RF-10).
const INPUT_CLASSES =
  'h-12 w-full rounded-btn border border-line bg-surface px-3 text-sm text-ink ' +
  'placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-green';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((s) => s.auth);
  const successMessage = location.state?.message;
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) navigate('/dashboard');
  };

  return (
    <AuthLayout title="Sign in" subtitle="Sign in to your account">
      {successMessage && (
        <p role="status" className="mb-4 rounded-btn bg-mint px-3 py-2 text-sm text-green">
          {successMessage}
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            {...register('email')}
            id="login-email"
            type="email"
            autoComplete="email"
            className={INPUT_CLASSES}
          />
          {errors.email && <p className="mt-1 text-xs text-coral-dark">{errors.email.message}</p>}
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="login-password" className="mb-1 block text-sm font-medium text-ink">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs text-green hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            {...register('password')}
            id="login-password"
            type="password"
            autoComplete="current-password"
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
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        No account?{' '}
        <Link to="/register" className="text-green hover:underline">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}
