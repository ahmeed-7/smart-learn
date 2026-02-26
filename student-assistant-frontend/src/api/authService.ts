import apiClient from './apiClient';
import type { User } from '../store/useAuthStore';

export const authService = {
    login: async (credentials: any) => {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    },
    register: async (data: any) => {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },
    getProfile: async () => {
        const response = await apiClient.get('/user/profile');
        return response.data;
    },
    updateProfile: async (data: Partial<User>) => {
        const response = await apiClient.put('/user/profile', data);
        return response.data;
    }
};
