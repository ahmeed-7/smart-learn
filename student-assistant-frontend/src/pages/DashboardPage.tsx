import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useScheduleStore } from '../store/useScheduleStore';
import { scheduleService } from '../api/scheduleService';
import { useWeekendStore } from '../store/useWeekendStore';
import {
    BarChart3,
    BookOpen,
    TreePine,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    TrendingUp,
    Clock,
    Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const { user } = useAuthStore();
    const { subjects, logs } = useScheduleStore();
    const { tasks } = useWeekendStore();

    React.useEffect(() => {
        if (subjects.length === 0) {
            const fetchSubjects = async () => {
                try {
                    const data = await scheduleService.getSubjects();
                    useScheduleStore.getState().setSubjects(data);
                } catch (_error) {
                    // silent fail
                }
            };
            fetchSubjects();
        }
    }, [subjects.length]);

    const totalLogs = Object.values(logs).flat().length;
    const completedWeekendTasks = tasks.filter(t => t.isCompleted).length;
    const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todaySubjects = subjects.filter(s => s.day === dayName);

    const stats = [
        { label: 'Subjects', value: subjects.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Study Logs', value: totalLogs, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Weekend Goal', value: `${completedWeekendTasks}/${tasks.length}`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Today Classes', value: todaySubjects.length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Hello, {user?.name || 'Student'}! 👋</h1>
                    <p className="text-slate-500">Welcome back to your University Dashboard. Happy studying!</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm text-sm font-semibold text-slate-600">
                    <Calendar size={18} className="text-primary-500" />
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-card p-6 flex items-center justify-between hover:scale-[1.02] transition-transform">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Visual Call to Action */}
                    <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-primary-600 to-secondary-700 text-white shadow-xl shadow-primary-200">
                        <div className="absolute top-0 right-0 p-12 opacity-20">
                            <TreePine size={160} />
                        </div>
                        <div className="relative z-10 max-w-sm">
                            <h2 className="text-2xl font-bold mb-3">Your Knowledge Tree is growing!</h2>
                            <p className="text-primary-100 mb-6 leading-relaxed">
                                You've logged {totalLogs} lessons this semester. Visualizing your progress helps you retain 40% more information.
                            </p>
                            <Link to="/tree" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-colors">
                                View Tree
                                <ArrowUpRight size={18} />
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Clock size={18} className="text-orange-500" />
                                Next Classes (Today)
                            </h3>
                            <div className="space-y-3">
                                {todaySubjects.length > 0 ? (
                                    [...todaySubjects].sort((a, b) => a.startTime.localeCompare(b.startTime)).map(s => (
                                        <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div>
                                                <p className="font-bold text-slate-700">{s.name}</p>
                                                <p className="text-xs text-slate-500">{s.startTime} - {s.endTime}</p>
                                            </div>
                                            <div className="text-xs font-bold text-slate-400">{s.room || 'TBA'}</div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400 italic">No classes scheduled for today.</p>
                                )}
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <AlertCircle size={18} className="text-accent-500" />
                                Upcoming Reviews
                            </h3>
                            <div className="space-y-3">
                                <div className="p-3 rounded-xl bg-accent-50 text-accent-700 text-sm border border-accent-100 flex items-center justify-between">
                                    <span>Data Structures Review</span>
                                    <span className="font-bold">Tomorrow</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 text-slate-400 text-sm border border-slate-100 flex items-center justify-between">
                                    <span>Networking Lab</span>
                                    <span className="font-bold italic">In 3 days</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                            <TrendingUp className="text-emerald-500" size={20} />
                            Learning Activity
                        </h3>
                        <div className="space-y-4">
                            <div className="h-40 flex items-end justify-between gap-1 pt-4">
                                {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                    <div key={i} className="flex-1 space-y-2">
                                        <div
                                            className="w-full bg-primary-100 rounded-lg group relative overflow-hidden"
                                            style={{ height: `${h}%` }}
                                        >
                                            <div className="absolute inset-0 bg-primary-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        </div>
                                        <p className="text-[10px] text-center font-bold text-slate-400">
                                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500 text-center">
                                Your study intensity increased by <span className="text-emerald-500 font-bold">12%</span> this week.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-6 bg-slate-50 border-none">
                        <h3 className="font-bold text-slate-900 mb-4">Study Tip of the Day</h3>
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                            "The Feyman Technique: If you want to understand something well, try to explain it to someone else in simple terms."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
