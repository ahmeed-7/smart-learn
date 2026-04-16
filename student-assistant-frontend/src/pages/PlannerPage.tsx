import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarDays, Clock3, MapPin, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  plannerDays,
  usePlannerStore,
  getPlannerColor,
  type PlannerDay,
} from '../store/usePlannerStore';

const plannerSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  subject: z.string().min(2, 'Subject is required'),
  day: z.enum([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  location: z.string().optional(),
  note: z.string().optional(),
});

type PlannerForm = z.infer<typeof plannerSchema>;

const PlannerPage: React.FC = () => {
  const { sessions, addSession, deleteSession } = usePlannerStore();
  const [isAdding, setIsAdding] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlannerForm>({
    resolver: zodResolver(plannerSchema),
    defaultValues: {
      day: 'Monday',
    },
  });

  const onSubmit = (data: PlannerForm) => {
    addSession({
      ...data,
      color: getPlannerColor(),
    });

    toast.success('Planner session added');
    reset({
      title: '',
      subject: '',
      day: 'Monday',
      startTime: '',
      endTime: '',
      location: '',
      note: '',
    });
    setIsAdding(false);
  };

  const totalSessions = sessions.length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Study Planner</h1>
          <p className="text-slate-500">
            Organize your weekly study sessions and revision blocks
          </p>
        </div>

        <button onClick={() => setIsAdding(true)} className="btn btn-primary gap-2">
          <Plus size={18} />
          Add Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-slate-500 mb-1">Total Sessions</p>
          <h3 className="text-2xl font-bold text-slate-900">{totalSessions}</h3>
        </div>

        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-slate-500 mb-1">Most Active Day</p>
          <h3 className="text-2xl font-bold text-slate-900">
            {plannerDays.reduce((best, current) => {
              const bestCount = sessions.filter((s) => s.day === best).length;
              const currentCount = sessions.filter((s) => s.day === current).length;
              return currentCount > bestCount ? current : best;
            }, 'Monday' as PlannerDay)}
          </h3>
        </div>

        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-slate-500 mb-1">Weekly Goal</p>
          <h3 className="text-2xl font-bold text-slate-900">
            {Math.max(totalSessions, 6)}/6 planned
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {plannerDays.map((day) => {
          const daySessions = sessions
            .filter((session) => session.day === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div key={day} className="glass-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <CalendarDays size={18} className="text-primary-600" />
                <h2 className="text-lg font-bold text-slate-900">{day}</h2>
                <span className="ml-auto text-xs font-semibold text-slate-400">
                  {daySessions.length} session{daySessions.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-4">
                {daySessions.length === 0 ? (
                  <div className="p-5 rounded-2xl border border-dashed border-slate-200 text-center text-sm text-slate-400 italic">
                    No study sessions planned yet. Add a focused block to start organizing your week.
                  </div>
                ) : (
                  daySessions.map((session) => (
                    <div
                      key={session.id}
                      className={`relative p-4 rounded-2xl border shadow-sm ${session.color}`}
                    >
                      <button
                        onClick={() => {
                          deleteSession(session.id);
                          toast.success('Session deleted');
                        }}
                        className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/60 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="pr-8">
                        <p className="text-xs font-bold uppercase tracking-wide opacity-70 mb-1">
                          {session.subject}
                        </p>
                        <h3 className="text-lg font-bold mb-2">{session.title}</h3>

                        <div className="space-y-1.5 text-sm opacity-90">
                          <div className="flex items-center gap-2">
                            <Clock3 size={14} />
                            <span>
                              {session.startTime} - {session.endTime}
                            </span>
                          </div>

                          {session.location && (
                            <div className="flex items-center gap-2">
                              <MapPin size={14} />
                              <span>{session.location}</span>
                            </div>
                          )}
                        </div>

                        {session.note && (
                          <p className="mt-3 text-sm leading-relaxed opacity-90">
                            {session.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsAdding(false)}
          />
          <div className="relative glass-card w-full max-w-xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Add Study Session</h2>
              <button
                onClick={() => setIsAdding(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Session Title</label>
                <input
                  {...register('title')}
                  className="input-field"
                  placeholder="e.g. Exam Revision Block"
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
                  placeholder="e.g. Operating Systems"
                />
                {errors.subject && (
                  <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Day</label>
                  <select {...register('day')} className="input-field appearance-none bg-white">
                    {plannerDays.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Start Time</label>
                  <input {...register('startTime')} type="time" className="input-field" />
                  {errors.startTime && (
                    <p className="text-xs text-red-500 mt-1">{errors.startTime.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">End Time</label>
                  <input {...register('endTime')} type="time" className="input-field" />
                  {errors.endTime && (
                    <p className="text-xs text-red-500 mt-1">{errors.endTime.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Location</label>
                <input
                  {...register('location')}
                  className="input-field"
                  placeholder="e.g. Library / Home / Room A2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Note</label>
                <textarea
                  {...register('note')}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="What will you focus on during this session?"
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
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlannerPage;