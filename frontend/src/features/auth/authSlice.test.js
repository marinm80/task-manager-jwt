import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import authReducer, { bootstrapSession } from './authSlice';
import { refreshSession } from '../../services/sessionService';

vi.mock('../../services/sessionService', () => ({
  refreshSession: vi.fn(),
}));

vi.mock('../../utils/axiosConfig', () => ({
  default: { post: vi.fn() },
}));

function createAuthStore() {
  return configureStore({ reducer: { auth: authReducer } });
}

describe('bootstrapSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hidrata accessToken y user cuando la cookie de refresh es válida', async () => {
    const user = { id: 7, name: 'QA Taskly', email: 'qa@example.com', role: 'USER' };
    refreshSession.mockResolvedValue({ accessToken: 'access-123', user });
    const store = createAuthStore();

    await store.dispatch(bootstrapSession());

    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(store.getState().auth).toMatchObject({
      accessToken: 'access-123',
      user,
      initialized: true,
      initializing: false,
    });
  });

  it('termina como sesión anónima cuando el refresh falla', async () => {
    refreshSession.mockRejectedValue(new Error('No refresh token'));
    const store = createAuthStore();

    await store.dispatch(bootstrapSession());

    expect(store.getState().auth).toMatchObject({
      accessToken: null,
      user: null,
      initialized: true,
      initializing: false,
    });
  });

  it('evita una segunda petición mientras el bootstrap está en curso', async () => {
    let resolveRefresh;
    refreshSession.mockReturnValue(new Promise((resolve) => { resolveRefresh = resolve; }));
    const store = createAuthStore();

    const first = store.dispatch(bootstrapSession());
    const second = store.dispatch(bootstrapSession());

    expect(refreshSession).toHaveBeenCalledTimes(1);
    resolveRefresh({
      accessToken: 'access-456',
      user: { id: 8, name: 'QA', email: 'qa2@example.com', role: 'USER' },
    });
    await Promise.all([first, second]);

    expect(store.getState().auth.initialized).toBe(true);
  });
});
