import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  AlarmClock,
  BookOpenCheck,
  CalendarDays,
  GraduationCap,
  MapPin,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useExamStore, type ExamType } from '../store/useExamStore';

const examSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  subject: z.string().min(2, 'Subject is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().optional(),
  type: z.enum(['quiz', 'midterm', 'final', 'oral', 'practical']),
  note: z.string().optional(),
});

type ExamForm = z.infer<typeof examSchema>;

const typeStyles: Record<ExamType, string> = {
  quiz: 'bg-sky-100 text-sky-700 border-sky-200',
  midterm: 'bg-amber-100 text-amber-700 border-amber-200',
  final: 'bg-red-100 text-red-700 border-red-200',
  oral: 'bg-purple-100 text-purple-700 border-purple-200',
  practical: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const ExamsPage: React.FC = () => {
  const { exams, addExam, deleteExam } = useExamStore();
  const [isAdding, setIsAdding] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExamForm>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      type: 'midterm',
    },
  });

  const sortedExams = [...exams].sort((a, b) => {
    const aDate = new Date(`${a.date}T${a.time}`).getTime();
    const bDate = new Date(`${b.date}T${b.time}`).getTime();
    return aDate - bDate;
  });

  const today = new Date();

  const upcomingExams = sortedExams.filter((exam) => {
    const examDate = new Date(`${exam.date}T${exam.time}`);
    return examDate >= today;
  });

  const nextExam = upcomingExams[0];

  const onSubmit = (data: ExamForm) => {
    addExam(data);
    toast.success('Exam added');
    reset({
      title: '',
      subject: '',
      date: '',
      time: '',
      location: '',
      type: 'midterm',
      note: '',
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Exam Timetable</h1>
          <p className="text-slate-500">
            Organize quizzes, midterms, finals, and oral evaluations
          </p>
        </div>

        <button onClick={() => setIsAdding(true)} className="btn btn-primary gap-2">
          <Plus size={18} />
          Add Exam
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-slate-500 mb-1">Total Exams</p>
          <h3 className="text-2xl font-bold text-slate-900">{exams.length}</h3>
        </div>

        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-slate-500 mb-1">Upcoming</p>
          <h3 className="text-2xl font-bold text-slate-900">{upcomingExams.length}</h3>
        </div>

        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-slate-500 mb-1">Next Exam</p>
          <h3 className="text-lg font-bold text-slate-900">
            {nextExam ? nextExam.subject : 'No upcoming exam'}
          </h3>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <GraduationCap size={18} className="text-primary-600" />
          <h2 className="text-lg font-bold text-slate-900">Upcoming Exams</h2>
        </div>

        <div className="space-y-4">
          {sortedExams.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-slate-200 text-center text-sm text-slate-400 italic">
              No exams planned yet. Add your first evaluation to keep your timetable ready.
            </div>
          ) : (
            sortedExams.map((exam) => (
              <div key={exam.id} className="p-4 rounded-2xl border bg-white border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-primary-50">
                    <BookOpenCheck className="text-primary-600" size={22} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{exam.title}</h3>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${typeStyles[exam.type]}`}
                      >
                        {exam.type}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-primary-700 mb-2">
                      {exam.subject}
                    </p>

                    <div className="space-y-1.5 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={14} />
                        <span>{exam.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <AlarmClock size={14} />
                        <span>{exam.time}</span>
                      </div>

                      {exam.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>{exam.location}</span>
                        </div>
                      )}
                    </div>

                    {exam.note && (
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                        {exam.note}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      deleteExam(exam.id);
                      toast.success('Exam deleted');
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Trash2 size={16} className="text-slate-500" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsAdding(false)}
          />
          <div className="relative glass-card w-full max-w-xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Add Exam</h2>
              <button
                onClick={() => setIsAdding(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Exam Title</label>
                <input
                  {...register('title')}
                  className="input-field"
                  placeholder="e.g. Data Structures Final"
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Subject</label>
                <input
                  {...register('subject')}
                  className="input-field"
                  placeholder="e.g. Data Structures"
                />
                {errors.subject && (
                  <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Date</label>
                  <input {...register('date')} type="date" className="input-field" />
                  {errors.date && (
                    <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Time</label>
                  <input {...register('time')} type="time" className="input-field" />
                  {errors.time && (
                    <p className="text-xs text-red-500 mt-1">{errors.time.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Location</label>
                <input
                  {...register('location')}
                  className="input-field"
                  placeholder="e.g. Hall A / Room C14"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Exam Type</label>
                <select
                  {...register('type')}
                  className="input-field appearance-none bg-white"
                >
                  <option value="quiz">Quiz</option>
                  <option value="midterm">Midterm</option>
                  <option value="final">Final</option>
                  <option value="oral">Oral</option>
                  <option value="practical">Practical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Note</label>
                <textarea
                  {...register('note')}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="What should you revise for this exam?"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamsPage;