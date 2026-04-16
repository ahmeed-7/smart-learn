import { create } from 'zustand';

export interface WeekendTask {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    xpPoints: number;
}

interface WeekendState {
    tasks: WeekendTask[];
    setTasks: (tasks: WeekendTask[]) => void;
    toggleTask: (id: string) => void;
}

export const useWeekendStore = create<WeekendState>((set) => ({
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
    toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)
    })),
}));
