import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useScheduleStore } from '../store/useScheduleStore';
import type { LessonLog } from '../store/useScheduleStore';
import AudioRecorder from '../components/logs/AudioRecorder';
import { FileText, Upload, Brain, ChevronLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { scheduleService } from '../api/scheduleService';
import toast from 'react-hot-toast';

const logSchema = z.object({
    title: z.string().min(3, 'Title is too short'),
    content: z.string().min(10, 'Please write a bit more notes'),
});

type LogForm = z.infer<typeof logSchema>;

const AddLogPage: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const navigate = useNavigate();
    const { subjects, addLog } = useScheduleStore();
    const subject = subjects.find(s => s.id === subjectId);

    const [_audioBlob, setAudioBlob] = React.useState<Blob | null>(null);
    const [file, setFile] = React.useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [aiResult, setAiResult] = React.useState<Partial<LessonLog> | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LogForm>({
        resolver: zodResolver(logSchema),
    });

    if (!subject) return <div>Subject not found</div>;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            toast.success('File attached');
        }
    };

    const onSubmit = async (data: LogForm) => {
        setIsAnalyzing(true);
        try {
            // simulate complex AI processing
            await new Promise(r => setTimeout(r, 3000));

            const mockAiResult: Partial<LessonLog> = {
                aiSummary: "The lesson focused on the core principles and architecture. Key themes included scalability and efficiency.",
                aiKeyPoints: [
                    "Understanding the fundamental architecture",
                    "Implementing scalable solutions",
                    "Applying best practices for performance"
                ],
                aiQuestions: [
                    "What is the main advantage of this architecture?",
                    "How do we handle state management in this context?",
                    "What are the 3 key scalability factors discussed?"
                ],
                reviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days later
            };

            const newLogData: Partial<LessonLog> = {
                subjectId: subject.id,
                title: data.title,
                content: data.content,
                date: new Date().toISOString(),
                ...mockAiResult
            };

            const savedLog = await scheduleService.addLog(newLogData);
            addLog(subject.id, savedLog);
            setAiResult(mockAiResult);
            toast.success('AI Analysis Complete!');
        } catch (_e) {
            toast.error('Analysis failed');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
            <button
                onClick={() => navigate('/tree')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
                <ChevronLeft size={20} />
                Back to Knowledge Tree
            </button>

            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${subject.color || 'bg-primary-100 text-primary-600'}`}>
                        {subject.name}
                    </span>
                    <h1 className="text-3xl font-bold text-slate-900">Add New Lesson Log</h1>
                </div>
                <p className="text-slate-500 italic">Capture your learning and let AI summarize it for you.</p>
            </div>

            {!aiResult ? (
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="glass-card p-6 space-y-4">
                            <h2 className="font-bold flex items-center gap-2 text-slate-800">
                                <FileText size={20} className="text-primary-500" />
                                Lesson Details
                            </h2>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Lesson Title</label>
                                <input {...register('title')} className="input-field" placeholder="e.g. Introduction to React Hooks" />
                                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Key Points / Notes</label>
                                <textarea
                                    {...register('content')}
                                    rows={6}
                                    className="input-field resize-none"
                                    placeholder="Paste your notes or write what you learned today..."
                                />
                                {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
                            </div>
                        </div>

                        <div className="glass-card p-6 space-y-4">
                            <h2 className="font-bold flex items-center gap-2 text-slate-800">
                                <Upload size={20} className="text-primary-500" />
                                Attach Resources
                            </h2>
                            <div className="relative group border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-primary-400 transition-all cursor-pointer">
                                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.doc,.docx" />
                                <div className="space-y-2">
                                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400 group-hover:text-primary-500 group-hover:bg-primary-50">
                                        <Upload size={24} />
                                    </div>
                                    <p className="font-bold text-sm text-slate-700">{file ? file.name : 'Upload PDF / Document'}</p>
                                    <p className="text-xs text-slate-400">Max size 20MB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <AudioRecorder onRecordingComplete={setAudioBlob} />

                        <div className="p-6 rounded-2xl bg-primary-600 text-white shadow-xl shadow-primary-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles size={24} />
                                <h3 className="text-lg font-bold">AI Processing</h3>
                            </div>
                            <p className="text-primary-100 text-sm mb-6 leading-relaxed">
                                Clicking the button below will analyze your notes, voice recordings, and attached files to generate a summary, key points, and review questions.
                            </p>
                            <button
                                type="submit"
                                disabled={isAnalyzing}
                                className="w-full h-14 bg-white text-primary-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-50 transition-colors disabled:opacity-50"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        Analyzing Content...
                                    </>
                                ) : (
                                    <>
                                        <Brain size={24} />
                                        Run AI Analysis
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="space-y-8 animate-slide-up">
                    <div className="glass-card p-8 border-t-8 border-primary-500">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center">
                                    <Sparkles size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">AI Study Summary</h2>
                                    <p className="text-sm text-slate-500">Analysis complete & saved to your tree</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/tree')}
                                className="btn btn-secondary"
                            >
                                Done
                            </button>
                        </div>

                        <div className="space-y-8">
                            <section>
                                <h3 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <FileText size={16} />
                                    Executive Summary
                                </h3>
                                <p className="text-lg text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                                    "{aiResult.aiSummary}"
                                </p>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <section>
                                    <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                        Key Learning Points
                                    </h3>
                                    <ul className="space-y-3">
                                        {aiResult.aiKeyPoints?.map((point, i) => (
                                            <li key={i} className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                                <span className="text-emerald-500 font-bold">0{i + 1}.</span>
                                                <span className="text-slate-700">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-sm font-bold text-accent-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-accent-500 rounded-full" />
                                        Review Questions
                                    </h3>
                                    <div className="space-y-3">
                                        {aiResult.aiQuestions?.map((q, i) => (
                                            <div key={i} className="p-4 rounded-xl border border-slate-100 bg-white">
                                                <p className="text-slate-700 font-medium">Q: {q}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex items-center gap-3 text-orange-700">
                                <AlertCircle size={20} />
                                <p className="text-sm whitespace-nowrap">
                                    <strong>Spaced Repetition:</strong> We've scheduled your first review for <strong>{new Date(aiResult.reviewDate!).toLocaleDateString()}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddLogPage;
