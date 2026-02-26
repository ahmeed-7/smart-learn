import apiClient from './apiClient';

export interface WeekendTask {
    id: string;
    title: string;
    description: string;
    xpPoints: number;
    isCompleted: boolean;
    category: string;
}

export const weekendService = {
    getTasks: async () => {
        const response = await apiClient.get<WeekendTask[]>('/weekend/tasks');
        return response.data;
    },

    toggleTask: async (taskId: string) => {
        const response = await apiClient.post('/weekend/tasks/toggle', { taskId });
        return response.data;
    }
};
