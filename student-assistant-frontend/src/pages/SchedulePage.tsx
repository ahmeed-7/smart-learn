import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useScheduleStore } from '../store/useScheduleStore';
import { scheduleService } from '../api/scheduleService';
import { Plus, Trash2, Clock, MapPin, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const subjectSchema = z.object({
    name: z.string().min(2, 'Subject name is required'),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    room: z.string().optional(),
});

type SubjectForm = z.infer<typeof subjectSchema>;

const SchedulePage: React.FC = () => {
    const { subjects, addSubject, deleteSubject } = useScheduleStore();
    const [isAdding, setIsAdding] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SubjectForm>({
        resolver: zodResolver(subjectSchema),
    });

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const data = await scheduleService.getSubjects();
                useScheduleStore.getState().setSubjects(data);
            } catch (_error) {
                toast.error('Failed to load schedule');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    const onSubmit = async (data: SubjectForm) => {
        setIsSubmitting(true);
        try {
            const colors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-emerald-100 text-emerald-700', 'bg-orange-100 text-orange-700'];
            const newSubject = await scheduleService.addSubject({
                ...data,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
            addSubject(newSubject);
            toast.success('Subject added');
            setIsAdding(false);
            reset();
        } catch (_e) {
            toast.error('Failed to add subject');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await scheduleService.deleteSubject(id);
            deleteSubject(id);
            toast.success('Subject deleted');
        } catch (_error) {
            toast.error('Failed to delete subject');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary-600" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Weekly Schedule</h1>
                    <p className="text-slate-500">Manage your university classes and hours</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="btn btn-primary gap-2"
                >
                    <Plus size={20} />
                    Add Subject
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {days.map((day) => (
                    <div key={day} className="space-y-4">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2 px-2">
                            <span className="w-2 h-2 rounded-full bg-primary-500" />
                            {day}
                        </h2>
                        <div className="space-y-3">
                            {subjects.filter(s => s.day === day).length === 0 ? (
                                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm italic text-center">
                                    No classes
                                </div>
                            ) : (
                                subjects
                                    .filter((s) => s.day === day)
                                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                    .map((subject) => (
                                        <div
                                            key={subject.id}
                                            className={`group p-4 rounded-xl border border-slate-100 shadow-sm relative transition-all hover:shadow-md hover:-translate-y-1 ${subject.color || 'bg-white'}`}
                                        >
                                            <button
                                                onClick={() => handleDelete(subject.id)}
                                                className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <h3 className="font-bold mb-2 pr-6">{subject.name}</h3>
                                            <div className="flex flex-col gap-1 text-sm opacity-80">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} />
                                                    {subject.startTime} - {subject.endTime}
                                                </div>
                                                {subject.room && (
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin size={14} />
                                                        {subject.room}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
                    <div className="relative glass-card w-full max-w-md p-6 animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Add New Subject</h2>
                            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Subject Name</label>
                                <input {...register('name')} className="input-field" placeholder="e.g. Database Systems" />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Start Time</label>
                                    <input {...register('startTime')} type="time" className="input-field" />
                                    {errors.startTime && <p className="text-xs text-red-500 mt-1">{errors.startTime.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">End Time</label>
                                    <input {...register('endTime')} type="time" className="input-field" />
                                    {errors.endTime && <p className="text-xs text-red-500 mt-1">{errors.endTime.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Day of Week</label>
                                <select {...register('day')} className="input-field appearance-none bg-white">
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                {errors.day && <p className="text-xs text-red-500 mt-1">{errors.day.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Room (Optional)</label>
                                <input {...register('room')} className="input-field" placeholder="e.g. Lab 304" />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsAdding(false)} className="btn btn-secondary flex-1">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="btn btn-primary flex-1">
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Save Subject'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchedulePage;
