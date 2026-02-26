import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User as UserIcon, Mail, School, BookOpen, Target, Bell, Shield, Save, Camera } from 'lucide-react';
import { authService } from '../api/authService';
import toast from 'react-hot-toast';

const settingsSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    university: z.string().min(2, 'University is required'),
    specialty: z.string().min(2, 'Specialty is required'),
    goals: z.string().min(10, 'Tell us more about your goals'),
});

type SettingsForm = z.infer<typeof settingsSchema>;

const SettingsPage: React.FC = () => {
    const { user, updateUser } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset
    } = useForm<SettingsForm>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            university: user?.university || '',
            specialty: user?.specialty || '',
            goals: user?.goals || '',
        },
    });

    const onSubmit = async (data: SettingsForm) => {
        try {
            const updated = await authService.updateProfile(data);
            updateUser(updated);
            toast.success('Settings updated successfully!');
            reset(updated);
        } catch (_error) {
            toast.error('Failed to update settings');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Settings</h1>
                <p className="text-slate-500">Manage your profile information and preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card p-6 text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold border-4 border-white shadow-lg">
                                {user?.name?.[0] || 'S'}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full border-4 border-white shadow-md hover:bg-primary-700 transition-colors">
                                <Camera size={16} />
                            </button>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">{user?.name}</h3>
                        <p className="text-sm text-slate-500 mb-6">{user?.specialty} Student</p>

                        <div className="space-y-2 text-left">
                            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary-50 text-primary-700 font-bold text-sm">
                                <UserIcon size={18} />
                                Profile Info
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors">
                                <Bell size={18} />
                                Notifications
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors">
                                <Shield size={18} />
                                Security
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label-text flex items-center gap-2 mb-1.5 font-bold">
                                    <UserIcon size={16} className="text-primary-500" />
                                    Full Name
                                </label>
                                <input {...register('name')} className="input-field" />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                            </div>
                            <div>
                                <label className="label-text flex items-center gap-2 mb-1.5 font-bold">
                                    <Mail size={16} className="text-primary-500" />
                                    Email Address
                                </label>
                                <input {...register('email')} className="input-field" />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label-text flex items-center gap-2 mb-1.5 font-bold">
                                    <School size={16} className="text-primary-500" />
                                    University
                                </label>
                                <input {...register('university')} className="input-field" />
                                {errors.university && <p className="text-xs text-red-500 mt-1">{errors.university.message}</p>}
                            </div>
                            <div>
                                <label className="label-text flex items-center gap-2 mb-1.5 font-bold">
                                    <BookOpen size={16} className="text-primary-500" />
                                    Specialty
                                </label>
                                <input {...register('specialty')} className="input-field" />
                                {errors.specialty && <p className="text-xs text-red-500 mt-1">{errors.specialty.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="label-text flex items-center gap-2 mb-1.5 font-bold">
                                <Target size={16} className="text-primary-500" />
                                Current Goals
                            </label>
                            <textarea {...register('goals')} rows={4} className="input-field resize-none" />
                            {errors.goals && <p className="text-xs text-red-500 mt-1">{errors.goals.message}</p>}
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={!isDirty}
                                className="btn btn-primary flex items-center gap-2 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={20} />
                                Save Changes
                            </button>
                        </div>
                    </form>

                    <div className="glass-card p-8 border-t-8 border-red-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Danger Zone</h3>
                        <p className="text-sm text-slate-500 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                        <button className="px-6 py-2 border-2 border-red-500 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-colors">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
