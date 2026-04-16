import apiClient from './apiClient';
import type { StudyExam } from '../store/useExamStore';

export const examService = {
  getExams: async () => {
    const response = await apiClient.get('/exams');
    return response.data;
  },
  addExam: async (exam: Omit<StudyExam, 'id'>) => {
    const response = await apiClient.post('/exams', exam);
    return response.data;
  },
  deleteExam: async (id: string) => {
    await apiClient.delete(`/exams/${id}`);
  },
};
