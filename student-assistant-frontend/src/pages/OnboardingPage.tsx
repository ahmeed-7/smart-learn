import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { GraduationCap, School, BookOpen, Target, ArrowRight, Loader2 } from 'lucide-react';
import { authService } from '../api/authService';
import toast from 'react-hot-toast';

const onboardingSchema = z.object({
    university: z.string().min(2, 'University is required'),
    specialty: z.string().min(2, 'Specialty is required'),
    level: z.string().min(1, 'Level is required'),
    goals: z.string().optional(),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

const OnboardingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OnboardingForm>({
        resolver: zodResolver(onboardingSchema),
    });

    const onSubmit = async (data: OnboardingForm) => {
        setIsLoading(true);
        try {
            const updated = await authService.updateProfile(data);
            updateUser(updated);
            toast.success('Onboarding complete!');
            navigate('/dashboard');
        } catch (_error) {
            toast.error('Failed to save profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome, {user?.name}!</h1>
                    <p className="text-slate-500 italic">Tell us a bit about your studies and goals</p>
                </div>

                <div className="glass-card p-8 lg:p-12">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <School size={18} className="text-primary-500" />
                                    University
                                </label>
                                <input
                                    {...register('university')}
                                    className={`input-field ${errors.university ? 'border-red-500' : ''}`}
                                    placeholder="e.g. University of Science"
                                />
                                {errors.university && <p className="text-xs text-red-500">{errors.university.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <GraduationCap size={18} className="text-primary-500" />
                                    Specialty
                                </label>
                                <input
                                    {...register('specialty')}
                                    className={`input-field ${errors.specialty ? 'border-red-500' : ''}`}
                                    placeholder="e.g. Computer Science"
                                />
                                {errors.specialty && <p className="text-xs text-red-500">{errors.specialty.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <BookOpen size={18} className="text-primary-500" />
                                    Current Level
                                </label>
                                <select
                                    {...register('level')}
                                    className={`input-field appearance-none bg-white ${errors.level ? 'border-red-500' : ''}`}
                                >
                                    <option value="">Select Level</option>
                                    <option value="L1">License 1 (Year 1)</option>
                                    <option value="L2">License 2 (Year 2)</option>
                                    <option value="L3">License 3 (Year 3)</option>
                                    <option value="M1">Master 1 (Year 4)</option>
                                    <option value="M2">Master 2 (Year 5)</option>
                                    <option value="PHD">Doctorate</option>
                                </select>
                                {errors.level && <p className="text-xs text-red-500">{errors.level.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Target size={18} className="text-primary-500" />
                                    Goal
                                </label>
                                <input
                                    {...register('goals')}
                                    className="input-field"
                                    placeholder="e.g. Master React & Node.js"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full h-14 text-lg group"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Let's get started
                                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;
