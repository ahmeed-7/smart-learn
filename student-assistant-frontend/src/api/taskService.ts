import apiClient from './apiClient';
import type { StudyTask } from '../store/useTaskStore';

export const taskService = {
  getTasks: async () => {
    const response = await apiClient.get('/tasks');
    return response.data;
  },
  addTask: async (task: Omit<StudyTask, 'id' | 'status'>) => {
    const response = await apiClient.post('/tasks', task);
    return response.data;
  },
  updateTask: async (id: string, data: Partial<StudyTask>) => {
    const response = await apiClient.put(`/tasks/${id}`, data);
    return response.data;
  },
  deleteTask: async (id: string) => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
