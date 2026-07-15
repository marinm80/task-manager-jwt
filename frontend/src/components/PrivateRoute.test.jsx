import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PrivateRoute from './PrivateRoute';

// AI-TDD obligatoria (D-09 #2, plan.md). Cubre los escenarios BDD "Ruta
// privada sin sesión redirige a login" y "Acceso a /admin sin rol ADMIN
// redirige al dashboard" (spec.md §12, Feature: Autenticación rediseñada).
// `PrivateRoute.jsx` permanece SIN CAMBIO salvo que este test revele lo
// contrario (tasks.md T-040) — su único "puerto" es el store de Redux vía
// `useSelector`; se inyecta un store real de `@reduxjs/toolkit` con
// `preloadedState` controlado, sin thunks, sin llamadas a `axiosConfig.js`.

// Reducers mínimos: solo necesitamos el slice `auth` que consume
// `PrivateRoute` (accessToken/user.role); no se importan los slices reales
// del árbol de features para no arrastrar sus thunks/dependencias de red.
function authReducer(state = { user: null, accessToken: null }) {
  return state;
}

// Reproduce la forma real en que la app usa `PrivateRoute` (ver
// `App.jsx`): "/admin" queda protegido con `requiredRole="ADMIN"`,
// mientras que "/dashboard" es el destino real de la redirección por rol
// insuficiente — no una ruta ad-hoc inventada solo para el test.
function renderWithProviders({ preloadedState, initialEntries = ['/admin'] }) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: preloadedState },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route element={<PrivateRoute requiredRole="ADMIN" />}>
            <Route path="/admin" element={<p>Contenido protegido</p>} />
          </Route>
          <Route path="/dashboard" element={<p>Página de dashboard</p>} />
          <Route path="/login" element={<p>Página de login</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe('PrivateRoute', () => {
  it('sin accessToken, al navegar a /admin redirige a /login', () => {
    renderWithProviders({ preloadedState: { user: null, accessToken: null } });

    expect(screen.getByText('Página de login')).toBeInTheDocument();
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });

  it('con accessToken pero role distinto del requerido, al navegar a /admin redirige a /dashboard', () => {
    renderWithProviders({
      preloadedState: { user: { role: 'USER' }, accessToken: 'token-123' },
    });

    expect(screen.getByText('Página de dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });

  it('con accessToken y el role requerido, renderiza el Outlet protegido de /admin', () => {
    renderWithProviders({
      preloadedState: { user: { role: 'ADMIN' }, accessToken: 'token-123' },
    });

    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
    expect(screen.queryByText('Página de login')).not.toBeInTheDocument();
    expect(screen.queryByText('Página de dashboard')).not.toBeInTheDocument();
  });
});
