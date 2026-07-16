import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import authReducer from '../features/auth/authSlice';
import { refreshSession } from '../services/sessionService';
import PrivateRoute from './PrivateRoute';
import SessionBootstrap from './SessionBootstrap';

vi.mock('../services/sessionService', () => ({ refreshSession: vi.fn() }));
vi.mock('../utils/axiosConfig', () => ({ default: { post: vi.fn() } }));

function renderPrivateRoute() {
  const store = configureStore({ reducer: { auth: authReducer } });
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<SessionBootstrap />}>
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<p>Dashboard privado</p>} />
            </Route>
          </Route>
          <Route path="/login" element={<p>Página de login</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
  return store;
}

describe('SessionBootstrap', () => {
  it('espera el refresh y conserva la ruta privada cuando la sesión es válida', async () => {
    refreshSession.mockResolvedValue({
      accessToken: 'access-valid',
      user: { id: 1, name: 'QA', email: 'qa@example.com', role: 'USER' },
    });

    const store = renderPrivateRoute();

    expect(screen.getByRole('status')).toHaveTextContent('Restaurando sesión');
    expect(await screen.findByText('Dashboard privado')).toBeInTheDocument();
    expect(store.getState().auth.accessToken).toBe('access-valid');
  });

  it('deja que PrivateRoute redirija a login después de un refresh inválido', async () => {
    refreshSession.mockRejectedValue(new Error('No refresh token'));

    renderPrivateRoute();

    expect(await screen.findByText('Página de login')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard privado')).not.toBeInTheDocument();
  });
});
