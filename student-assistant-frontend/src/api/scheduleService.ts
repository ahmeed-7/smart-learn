import apiClient from './apiClient';
import type { Subject, LessonLog } from '../store/useScheduleStore';

export const scheduleService = {
    getSubjects: async () => {
        const response = await apiClient.get('/schedule/subjects');
        return response.data;
    },
    addSubject: async (subject: Partial<Subject>) => {
        const response = await apiClient.post('/schedule/subjects', subject);
        return response.data;
    },
    deleteSubject: async (id: string) => {
        await apiClient.delete(`/schedule/subjects/${id}`);
    },
    getLogs: async (subjectId: string) => {
        const response = await apiClient.get(`/schedule/logs/${subjectId}`);
        return response.data;
    },
    addLog: async (log: Partial<LessonLog>) => {
        const response = await apiClient.post('/schedule/logs', log);
        return response.data;
    }
};
