import { create } from 'zustand';

export interface Subject {
    id: string;
    name: string;
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
    day: string;       // Monday, Tuesday, etc.
    room?: string;
    color?: string;
}

export interface LessonLog {
    id: string;
    subjectId: string;
    title: string;
    content: string;
    date: string;
    audioUrl?: string;
    pdfUrl?: string;
    aiSummary?: string;
    aiKeyPoints?: string[];
    aiQuestions?: string[];
    reviewDate?: string;
}

interface ScheduleState {
    subjects: Subject[];
    logs: Record<string, LessonLog[]>; // subjectId -> logs
    setSubjects: (subjects: Subject[]) => void;
    addSubject: (subject: Subject) => void;
    updateSubject: (id: string, subject: Partial<Subject>) => void;
    deleteSubject: (id: string) => void;
    setLogs: (subjectId: string, logs: LessonLog[]) => void;
    addLog: (subjectId: string, log: LessonLog) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
    subjects: [],
    logs: {},
    setSubjects: (subjects) => set({ subjects }),
    addSubject: (subject) => set((state) => ({ subjects: [...state.subjects, subject] })),
    updateSubject: (id, updatedSubject) =>
        set((state) => ({
            subjects: state.subjects.map((s) => (s.id === id ? { ...s, ...updatedSubject } : s)),
        })),
    deleteSubject: (id) =>
        set((state) => ({
            subjects: state.subjects.filter((s) => s.id !== id),
        })),
    setLogs: (subjectId, logs) =>
        set((state) => ({
            logs: { ...state.logs, [subjectId]: logs },
        })),
    addLog: (subjectId, log) =>
        set((state) => ({
            logs: {
                ...state.logs,
                [subjectId]: [log, ...(state.logs[subjectId] || [])],
            },
        })),
}));
