import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { createTask, updateTask } from '../features/tasks/tasksSlice';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(),
});

export default function TaskForm({ task, onClose }) {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: task
      ? { ...task, dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '' }
      : { status: 'PENDING', priority: 'MEDIUM' },
  });

  const onSubmit = async (data) => {
    const payload = { ...data };
    if (payload.dueDate) payload.dueDate = new Date(payload.dueDate).toISOString();
    else delete payload.dueDate;
    if (task) await dispatch(updateTask({ id: task.id, data: payload }));
    else await dispatch(createTask(payload));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-xl">
        <h2 className="text-lg font-semibold">{task ? 'Edit Task' : 'New Task'}</h2>
        <div>
          <input {...register('title')} placeholder="Title *" className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <textarea
          {...register('description')}
          placeholder="Description (optional)"
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <div className="grid grid-cols-2 gap-3">
          <select {...register('status')} className="border rounded px-3 py-2 text-sm">
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select {...register('priority')} className="border rounded px-3 py-2 text-sm">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Due date (optional)</label>
          <input {...register('dueDate')} type="date" className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="text-sm text-gray-600 hover:underline px-3 py-2">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white text-sm px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {task ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
