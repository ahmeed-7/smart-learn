import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ExamType = 'quiz' | 'midterm' | 'final' | 'oral' | 'practical';

export interface StudyExam {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  location?: string;
  type: ExamType;
  note?: string;
}

interface ExamState {
  exams: StudyExam[];
  addExam: (exam: Omit<StudyExam, 'id'>) => void;
  deleteExam: (id: string) => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set) => ({
      exams: [
        {
          id: 'exam-1',
          title: 'Database Midterm',
          subject: 'Databases',
          date: '2026-04-05',
          time: '09:00',
          location: 'Room B12',
          type: 'midterm',
          note: 'Focus on normalization, SQL joins, and transactions.',
        },
        {
          id: 'exam-2',
          title: 'Algorithms Final',
          subject: 'Algorithms',
          date: '2026-04-12',
          time: '14:00',
          location: 'Main Hall',
          type: 'final',
          note: 'Revise graphs, dynamic programming, and greedy methods.',
        },
      ],

      addExam: (exam) =>
        set((state) => ({
          exams: [
            ...state.exams,
            {
              ...exam,
              id: crypto.randomUUID(),
            },
          ],
        })),

      deleteExam: (id) =>
        set((state) => ({
          exams: state.exams.filter((exam) => exam.id !== id),
        })),
    }),
    {
      name: 'smart-learn-exams',
    }
  )
);