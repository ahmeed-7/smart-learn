import { create } from 'zustand';

export interface User {
    id: string;
    name: string;
    email: string;
    university?: string;
    specialty?: string;
    goals?: string;
    level?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },
    updateUser: (updatedUser) =>
        set((state) => ({
            user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
}));
