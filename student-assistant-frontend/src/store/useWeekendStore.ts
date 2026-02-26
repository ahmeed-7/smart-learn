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
    tasks: [
        { id: '1', title: 'Resume Update', description: 'Add your latest projects and skills to your CV.', isCompleted: false, xpPoints: 50 },
        { id: '2', title: 'Connect with 3 Professionals', description: 'Reach out on LinkedIn to peers in your field.', isCompleted: false, xpPoints: 30 },
        { id: '3', title: 'Portfolio Project', description: 'Spend 2 hours building something that showcases your skills.', isCompleted: false, xpPoints: 100 },
        { id: '4', title: 'Read Industry Blog', description: 'Read at least 2 articles about current trends.', isCompleted: false, xpPoints: 20 },
    ],
    setTasks: (tasks) => set({ tasks }),
    toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)
    })),
}));
