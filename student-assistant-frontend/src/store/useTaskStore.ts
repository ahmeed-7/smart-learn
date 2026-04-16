import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TaskStatus = 'todo' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
}

interface TaskState {
  tasks: StudyTask[];
  addTask: (task: Omit<StudyTask, 'id' | 'status'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [
        {
          id: 'task-1',
          title: 'Finish database exercises',
          subject: 'Databases',
          description: 'Practice joins, group by, and normalization examples.',
          dueDate: '2026-03-28',
          priority: 'high',
          status: 'todo',
        },
        {
          id: 'task-2',
          title: 'Review graph algorithms',
          subject: 'Algorithms',
          description: 'Revise BFS, DFS, Dijkstra, and MST.',
          dueDate: '2026-03-30',
          priority: 'medium',
          status: 'done',
        },
      ],

      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: crypto.randomUUID(),
              status: 'todo',
            },
          ],
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: task.status === 'todo' ? 'done' : 'todo',
                }
              : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
    }),
    {
      name: 'smart-learn-tasks',
    }
  )
);