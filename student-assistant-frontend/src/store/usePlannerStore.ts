import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PlannerDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface PlannerSession {
  id: string;
  title: string;
  subject: string;
  day: PlannerDay;
  startTime: string;
  endTime: string;
  location?: string;
  note?: string;
  color: string;
}

interface PlannerState {
  sessions: PlannerSession[];
  addSession: (session: Omit<PlannerSession, 'id'>) => void;
  deleteSession: (id: string) => void;
  updateSession: (id: string, data: Partial<PlannerSession>) => void;
}

export const plannerDays: PlannerDay[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const plannerColors = [
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-pink-100 text-pink-700 border-pink-200',
];

export const getPlannerColor = () =>
  plannerColors[Math.floor(Math.random() * plannerColors.length)];

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set) => ({
      sessions: [
        {
          id: 'planner-1',
          title: 'Deep Work Block',
          subject: 'Algorithms',
          day: 'Monday',
          startTime: '09:00',
          endTime: '11:00',
          location: 'Library',
          note: 'Focus on graph problems and shortest path exercises.',
          color: 'bg-blue-100 text-blue-700 border-blue-200',
        },
        {
          id: 'planner-2',
          title: 'Revision Sprint',
          subject: 'Databases',
          day: 'Wednesday',
          startTime: '14:00',
          endTime: '15:30',
          location: 'Room B12',
          note: 'Review normalization and SQL joins.',
          color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        },
      ],

      addSession: (session) =>
        set((state) => ({
          sessions: [
            ...state.sessions,
            {
              ...session,
              id: crypto.randomUUID(),
            },
          ],
        })),

      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((session) => session.id !== id),
        })),

      updateSession: (id, data) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id ? { ...session, ...data } : session
          ),
        })),
    }),
    {
      name: 'smart-learn-planner',
    }
  )
);