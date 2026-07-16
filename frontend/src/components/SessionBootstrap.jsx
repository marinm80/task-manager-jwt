import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { bootstrapSession } from '../features/auth/authSlice';
import Logo from './brand/Logo';

// Gate exclusivo de rutas privadas. Evita que `PrivateRoute` decida con el
// store vacío antes de intentar restaurar la cookie HTTP-only existente.
export default function SessionBootstrap() {
  const dispatch = useDispatch();
  const { initialized, initializing } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized && !initializing) dispatch(bootstrapSession());
  }, [dispatch, initialized, initializing]);

  if (!initialized) {
    return (
      <main className="grid min-h-screen place-items-center bg-paper px-4">
        <div role="status" aria-live="polite" className="flex flex-col items-center gap-4 text-muted">
          <Logo />
          <p className="text-sm">Restaurando sesión…</p>
        </div>
      </main>
    );
  }

  return <Outlet />;
}
