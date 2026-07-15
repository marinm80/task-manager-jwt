import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';

// D-03 (plan.md): límite del snapshot de métricas del dashboard. Las
// métricas se calculan sobre este snapshot desacoplado del listado
// filtrado/paginado (para no subestimar el total cuando hay filtros
// activos), no sobre `items`. 1000 se acepta como límite razonable para un
// task manager personal/portafolio (riesgo R9, aceptado explícitamente en
// tech-spec.md §7): por encima de ese volumen las métricas podrían
// subestimar el total real, pero cubre con margen el uso esperado de esta
// feature.
export const TASK_STATS_SNAPSHOT_LIMIT = 1000;

export const fetchTasks = createAsyncThunk('tasks/fetch', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/tasks', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks');
  }
});

export const createTask = createAsyncThunk('tasks/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/tasks', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create task');
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update task');
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete task');
  }
});

// D-03 (plan.md, opción b): snapshot desacoplado de la lista filtrada,
// obtenido sin `status`/`priority`/`search` para que las métricas (T-033,
// `computeTaskStats`) siempre reflejen el total real del usuario, no solo
// la página/filtro visible en `items`. Se dispara una sola vez al montar
// `/dashboard` (T-039); las mutaciones (`createTask`/`updateTask`/
// `deleteTask`) lo actualizan de forma optimista en los `extraReducers` de
// abajo, sin ninguna llamada de red adicional.
export const fetchTaskStats = createAsyncThunk('tasks/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/tasks', { params: { limit: TASK_STATS_SNAPSHOT_LIMIT } });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch task stats');
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    total: 0,
    page: 1,
    loading: false,
    error: null,
    // D-03: sub-estado independiente de `items`/`loading` para que el
    // snapshot de métricas tenga su propio ciclo de carga y no compita con
    // el de la lista filtrada (riesgo R5, mitigado por diseño).
    statsSnapshot: { items: [], loading: false, error: null },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.tasks;
        state.total = action.payload.total;
        state.page = action.payload.page;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTaskStats.pending, (state) => {
        state.statsSnapshot.loading = true;
        state.statsSnapshot.error = null;
      })
      .addCase(fetchTaskStats.fulfilled, (state, action) => {
        state.statsSnapshot.loading = false;
        state.statsSnapshot.items = action.payload.tasks;
      })
      .addCase(fetchTaskStats.rejected, (state, action) => {
        state.statsSnapshot.loading = false;
        state.statsSnapshot.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
        // D-03: parcheo optimista en paralelo, sin refetch de red.
        state.statsSnapshot.items.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;

        const statsIdx = state.statsSnapshot.items.findIndex((t) => t.id === action.payload.id);
        if (statsIdx !== -1) state.statsSnapshot.items[statsIdx] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        state.statsSnapshot.items = state.statsSnapshot.items.filter((t) => t.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
