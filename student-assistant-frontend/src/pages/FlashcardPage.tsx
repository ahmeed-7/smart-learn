import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScheduleStore } from '../store/useScheduleStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Brain, CheckCircle2, XCircle, Sparkles, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const FlashcardPage: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const navigate = useNavigate();
    const { subjects, logs } = useScheduleStore();

    const subject = subjects.find(s => s.id === subjectId);
    const subjectLogs = logs[subjectId || ''] || [];

    // Flatten all AI questions from all logs of this subject
    const cards = subjectLogs.flatMap(log =>
        (log.aiQuestions || []).map(q => ({
            id: Math.random().toString(36).substr(2, 9),
            question: q,
            answer: log.aiSummary || "Review your notes for this topic.",
            sourceTitle: log.title,
            date: log.date
        }))
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [studiedCount, setStudiedCount] = useState(0);
    const [masteredCount, setMasteredCount] = useState(0);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 150);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 150);
    };

    const handleMastered = () => {
        setMasteredCount(prev => prev + 1);
        setStudiedCount(prev => prev + 1);
        toast.success("Mastered! +5 XP", { icon: '🔥' });
        handleNext();
    };

    const handleRetry = () => {
        setStudiedCount(prev => prev + 1);
        toast.error("Keep practicing!", { icon: '🧠' });
        handleNext();
    };

    if (!subject) return null;

    if (cards.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <Brain className="text-slate-400" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">No AI Flashcards Yet</h2>
                <p className="text-slate-500 max-w-md mb-8">
                    Add some lesson logs and let the AI generate review questions to populate your deck!
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-primary px-8"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const currentCard = cards[currentIndex];
    const progress = ((currentIndex + 1) / cards.length) * 100;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white rounded-xl transition-colors text-slate-500"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Sparkles className="text-primary-500" size={24} />
                            AI Flashcard Deck
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">{subject.name} • {cards.length} Cards</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Studied Today</p>
                        <p className="text-lg font-black text-primary-600">{studiedCount}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100">
                        <BookOpen size={24} />
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>Progress</span>
                    <span>{currentIndex + 1} / {cards.length}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Flashcard Area */}
            <div className="relative perspective-1000 h-[400px] w-full max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="w-full h-full relative"
                    >
                        <motion.div
                            className="w-full h-full cursor-pointer preserve-3d relative"
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            {/* Front Side */}
                            <div className="absolute inset-0 backface-hidden glass-card p-12 flex flex-col items-center justify-center text-center space-y-6">
                                <div className="absolute top-6 left-6 px-3 py-1 bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-100">
                                    Question
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
                                    {currentCard.question}
                                </p>
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <RotateCcw size={14} />
                                    <span>Click to see answer</span>
                                </div>
                            </div>

                            {/* Back Side */}
                            <div
                                className="absolute inset-0 backface-hidden glass-card p-12 flex flex-col items-center justify-start text-center space-y-6 overflow-y-auto"
                                style={{ transform: 'rotateY(180deg)' }}
                            >
                                <div className="absolute top-6 left-6 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                                    Answer / Summary
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                                    <p className="text-lg text-slate-700 leading-relaxed italic">
                                        "{currentCard.answer}"
                                    </p>
                                    <div className="pt-6 border-t border-slate-100 w-full">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Source Lesson</p>
                                        <p className="text-sm font-semibold text-slate-600 truncate">{currentCard.sourceTitle}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handlePrev}
                        className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:border-primary-500 hover:text-primary-500 transition-all shadow-sm"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleRetry}
                            className="btn bg-white border-2 border-slate-100 text-slate-600 hover:border-red-500 hover:text-red-500 px-8 h-12 rounded-2xl flex items-center gap-2 font-bold shadow-sm"
                        >
                            <XCircle size={20} />
                            Retry
                        </button>
                        <button
                            onClick={handleMastered}
                            className="btn bg-emerald-500 text-white hover:bg-emerald-600 px-8 h-12 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-emerald-200 border-none"
                        >
                            <CheckCircle2 size={20} />
                            I know this
                        </button>
                    </div>

                    <button
                        onClick={handleNext}
                        className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:border-primary-500 hover:text-primary-500 transition-all shadow-sm"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Stats Footer */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cards Mastered</p>
                    <p className="text-2xl font-black text-emerald-600">{masteredCount}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">XP Earned</p>
                    <p className="text-2xl font-black text-primary-600">{masteredCount * 5}</p>
                </div>
            </div>

            <style>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
            `}</style>
        </div>
    );
};

export default FlashcardPage;
