import apiClient from './apiClient';
import type { PlannerSession } from '../store/usePlannerStore';

export const plannerService = {
  getSessions: async () => {
    const response = await apiClient.get('/planner');
    return response.data;
  },
  addSession: async (session: Omit<PlannerSession, 'id'>) => {
    const response = await apiClient.post('/planner', session);
    return response.data;
  },
  updateSession: async (id: string, data: Partial<PlannerSession>) => {
    const response = await apiClient.put(`/planner/${id}`, data);
    return response.data;
  },
  deleteSession: async (id: string) => {
    await apiClient.delete(`/planner/${id}`);
  },
};
