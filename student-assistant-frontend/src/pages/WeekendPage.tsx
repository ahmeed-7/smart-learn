import React from 'react';
import { useWeekendStore, type WeekendTask } from '../store/useWeekendStore';
import { weekendService } from '../api/weekendService';
import { Trophy, CheckCircle2, Circle, Star, Zap, ChevronRight, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

const WeekendPage: React.FC = () => {
    const { tasks, toggleTask, setTasks } = useWeekendStore();
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await weekendService.getTasks();
                setTasks(data);
            } catch (_error) {
                toast.error('Failed to load weekend tasks');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, [setTasks]);

    const completedCount = tasks.filter(t => t.isCompleted).length;
    const totalXP = tasks.filter(t => t.isCompleted).reduce((acc, t) => acc + t.xpPoints, 0);
    const progressPercentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    const handleToggle = async (task: WeekendTask) => {
        try {
            await weekendService.toggleTask(task.id);
            toggleTask(task.id);
            if (!task.isCompleted) {
                toast.success(`+${task.xpPoints} XP Earned!`, {
                    icon: '🔥',
                    style: { borderRadius: '10px', background: '#333', color: '#fff' }
                });
            }
        } catch (_error) {
            toast.error('Failed to update task');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="relative overflow-hidden p-8 rounded-3xl bg-slate-900 text-white shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-10 blur-2xl bg-primary-500 rounded-full -mr-20 -mt-20 w-64 h-64" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-accent-400 font-bold text-sm uppercase tracking-widest mb-2">
                            <Zap size={16} />
                            Weekend Mode Active
                        </div>
                        <h1 className="text-4xl font-bold mb-2">Ready for the Climb?</h1>
                        <p className="text-slate-400 text-lg">Focus on your career and personal growth this weekend.</p>
                    </div>
                    <div className="flex items-center gap-6 p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                        <div className="text-center">
                            <p className="text-2xl font-black text-primary-400">{totalXP}</p>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Total XP</p>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="text-center">
                            <p className="text-2xl font-black text-accent-400">{completedCount}/{tasks.length}</p>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Tasks Done</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 relative h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Star className="text-accent-500" size={20} />
                        Career Challenges
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                onClick={() => handleToggle(task)}
                                className={`group p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${task.isCompleted
                                    ? 'bg-slate-50 border-emerald-100 opacity-70'
                                    : 'bg-white border-slate-100 hover:border-primary-200 hover:shadow-lg'
                                    }`}
                            >
                                <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600'
                                    }`}>
                                    {task.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-bold ${task.isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                        {task.title}
                                    </h3>
                                    <p className="text-sm text-slate-500">{task.description}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className={`text-sm font-bold block ${task.isCompleted ? 'text-emerald-500' : 'text-slate-400'}`}>
                                        +{task.xpPoints} XP
                                    </span>
                                    <ChevronRight size={16} className={`ml-auto mt-1 ${task.isCompleted ? 'text-emerald-400' : 'text-slate-300'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6 border-t-4 border-accent-500">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                            <Trophy className="text-accent-500" size={20} />
                            Rewards Shop
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Spotify 1 Month', cost: 500 },
                                { name: 'Career Mentorship', cost: 1200 },
                                { name: 'Certificate Voucher', cost: 2000 }
                            ].map(item => (
                                <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200 shadow-sm">
                                        <Zap size={12} className="text-accent-500" />
                                        <span className="text-xs font-bold text-slate-900">{item.cost}</span>
                                    </div>
                                </div>
                            ))}
                            <p className="text-xs text-slate-400 text-center italic mt-4 flex items-center justify-center gap-1">
                                <Gift size={12} />
                                More rewards coming soon!
                            </p>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-xl shadow-primary-200">
                        <h3 className="font-bold flex items-center gap-2 mb-2">
                            <Star size={18} />
                            Pro Tip
                        </h3>
                        <p className="text-sm text-primary-100 leading-relaxed">
                            Students who complete at least 3 career tasks per weekend are 40% more likely to land an internship within 6 months!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeekendPage;
