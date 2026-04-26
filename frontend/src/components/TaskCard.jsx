import { useDispatch } from 'react-redux';
import { deleteTask, updateTask } from '../features/tasks/tasksSlice';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

const PRIORITY_COLORS = {
  LOW: 'text-gray-500',
  MEDIUM: 'text-orange-500',
  HIGH: 'text-red-600 font-semibold',
};

const NEXT_STATUS = { PENDING: 'IN_PROGRESS', IN_PROGRESS: 'COMPLETED', COMPLETED: 'PENDING' };

export default function TaskCard({ task, onEdit }) {
  const dispatch = useDispatch();

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-medium text-gray-900 text-sm">{task.title}</h3>
        <span className={`shrink-0 text-xs px-2 py-1 rounded-full ${STATUS_COLORS[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
      {task.description && <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>}
      <div className="flex items-center gap-3 text-xs">
        <span className={PRIORITY_COLORS[task.priority]}>{task.priority}</span>
        {task.dueDate && (
          <span className="text-gray-400">Due {new Date(task.dueDate).toLocaleDateString()}</span>
        )}
      </div>
      <div className="flex gap-3 mt-1 text-xs">
        <button
          onClick={() => dispatch(updateTask({ id: task.id, data: { status: NEXT_STATUS[task.status] } }))}
          className="text-blue-600 hover:underline"
        >
          → {NEXT_STATUS[task.status].replace('_', ' ')}
        </button>
        <button onClick={() => onEdit(task)} className="text-gray-500 hover:underline">Edit</button>
        <button
          onClick={() => { if (confirm('Delete this task?')) dispatch(deleteTask(task.id)); }}
          className="text-red-500 hover:underline ml-auto"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
