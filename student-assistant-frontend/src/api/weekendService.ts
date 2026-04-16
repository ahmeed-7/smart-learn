import apiClient from './apiClient';
import type { WeekendTask } from '../store/useWeekendStore';

export const weekendService = {
    getTasks: async () => {
        const response = await apiClient.get<WeekendTask[]>('/weekend/challenges');
        return response.data;
    },

    toggleTask: async (id: string) => {
        const response = await apiClient.put(`/weekend/challenges/${id}/toggle`);
        return response.data;
    }
};
