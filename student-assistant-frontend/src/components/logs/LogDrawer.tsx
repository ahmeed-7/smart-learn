import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScheduleStore } from '../../store/useScheduleStore';
import { scheduleService } from '../../api/scheduleService';
import { X, Plus, FileText, Sparkles, Calendar } from 'lucide-react';

interface LogDrawerProps {
    subjectId: string;
    isOpen: boolean;
    onClose: () => void;
}

const LogDrawer: React.FC<LogDrawerProps> = ({ subjectId, isOpen, onClose }) => {
    const navigate = useNavigate();
    const { subjects, logs, setLogs } = useScheduleStore();
    const subject = subjects.find(s => s.id === subjectId);
    const subjectLogs = logs[subjectId] || [];

    useEffect(() => {
        if (isOpen && subjectId) {
            const fetchLogs = async () => {
                try {
                    const data = await scheduleService.getLogs(subjectId);
                    setLogs(subjectId, data);
                } catch (_error) {
                    // silently fail
                }
            };
            fetchLogs();
        }
    }, [isOpen, subjectId, setLogs]);

    if (!isOpen || !subject) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-40 animate-slide-in-right overflow-y-auto">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${subject.color || 'bg-primary-100 text-primary-600'}`}>
                                {subject.name}
                            </span>
                            <h2 className="text-xl font-bold text-slate-900">Lesson Logs</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Add Log Button */}
                    <button
                        onClick={() => navigate(`/add-log/${subjectId}`)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-200"
                    >
                        <Plus size={18} />
                        Add New Log
                    </button>

                    {/* Logs List */}
                    {subjectLogs.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <FileText size={28} />
                            </div>
                            <h3 className="font-bold text-slate-700 mb-1">No logs yet</h3>
                            <p className="text-sm text-slate-500">Add your first lesson log to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {subjectLogs.map(log => (
                                <div
                                    key={log.id}
                                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all cursor-pointer space-y-2"
                                >
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-bold text-slate-800">{log.title}</h3>
                                        {log.aiSummary && (
                                            <span className="flex items-center gap-1 text-xs text-primary-500 font-semibold bg-primary-50 px-2 py-0.5 rounded-full">
                                                <Sparkles size={12} />
                                                AI
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 line-clamp-2">
                                        {log.aiSummary || log.content}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                        <Calendar size={12} />
                                        {new Date(log.date).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default LogDrawer;
