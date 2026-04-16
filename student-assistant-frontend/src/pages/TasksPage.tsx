import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Filter,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTaskStore, type TaskPriority } from '../store/useTaskStore';

const taskSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  subject: z.string().min(2, 'Subject is required'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
});

type TaskForm = z.infer<typeof taskSchema>;
type FilterType = 'all' | 'todo' | 'done';

const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-700 border-slate-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  high: 'bg-red-100 text-red-700 border-red-200',
};

const TasksPage: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useTaskStore();
  const [isAdding, setIsAdding] = React.useState(false);
  const [filter, setFilter] = React.useState<FilterType>('all');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'medium',
    },
  });

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const todoCount = tasks.filter((task) => task.status === 'todo').length;
  const doneCount = tasks.filter((task) => task.status === 'done').length;

  const onSubmit = (data: TaskForm) => {
    addTask(data);
    toast.success('Task added');
    reset({
      title: '',
      subject: '',
      description: '',
      dueDate: '',
      priority: 'medium',
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Task Manager</h1>
          <p className="text-slate-500">
            Track assignments, revision goals, and personal academic tasks
          </p>
        </div>

        <button onClick={() => setIsAdding(true)} className="btn btn-primary gap-2">
          <Plus size={18} />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-slate-500 mb-1">Total Tasks</p>
          <h3 className="text-2xl font-bold text-slate-900">{tasks.length}</h3>
        </div>

        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-slate-500 mb-1">To Do</p>
          <h3 className="text-2xl font-bold text-slate-900">{todoCount}</h3>
        </div>

        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-slate-500 mb-1">Completed</p>
          <h3 className="text-2xl font-bold text-slate-900">{doneCount}</h3>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <Filter size={18} className="text-primary-600" />
          <h2 className="text-lg font-bold text-slate-900">Filter Tasks</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {(['all', 'todo', 'done'] as FilterType[]).map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                filter === item
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'
              }`}
            >
              {item === 'all' ? 'All' : item === 'todo' ? 'To Do' : 'Done'}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <ClipboardCheck size={18} className="text-primary-600" />
          <h2 className="text-lg font-bold text-slate-900">Your Tasks</h2>
        </div>

        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-slate-200 text-center text-sm text-slate-400 italic">
              No tasks found for this filter. Add a new task or change the selected filter.
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all ${
                  task.status === 'done'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => {
                      toggleTask(task.id);
                      toast.success(
                        task.status === 'todo'
                          ? 'Task marked as done'
                          : 'Task marked as to do'
                      );
                    }}
                    className="mt-0.5"
                  >
                    {task.status === 'done' ? (
                      <CheckCircle2 className="text-emerald-600" size={22} />
                    ) : (
                      <Circle className="text-slate-400" size={22} />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3
                        className={`text-lg font-bold ${
                          task.status === 'done'
                            ? 'text-emerald-800 line-through'
                            : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h3>

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${priorityStyles[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-primary-700 mb-1">
                      {task.subject}
                    </p>

                    {task.description && (
                      <p className="text-sm text-slate-600 leading-relaxed mb-2">
                        {task.description}
                      </p>
                    )}

                    {task.dueDate && (
                      <p className="text-xs text-slate-400">
                        Due date: {task.dueDate}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      deleteTask(task.id);
                      toast.success('Task deleted');
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Trash2 size={16} className="text-slate-500" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsAdding(false)}
          />
          <div className="relative glass-card w-full max-w-xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Add Task</h2>
              <button
                onClick={() => setIsAdding(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Task Title</label>
                <input
                  {...register('title')}
                  className="input-field"
                  placeholder="e.g. Finish chapter summary"
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Subject</label>
                <input
                  {...register('subject')}
                  className="input-field"
                  placeholder="e.g. Networks"
                />
                {errors.subject && (
                  <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Describe the work to do"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Due Date</label>
                  <input {...register('dueDate')} type="date" className="input-field" />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Priority</label>
                  <select
                    {...register('priority')}
                    className="input-field appearance-none bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;